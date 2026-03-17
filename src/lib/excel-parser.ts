import * as XLSX from "xlsx";
import type { WeeklyMetrics, AccountHandle } from "@/types/metrics";

const COLUMN_MAP: Record<string, keyof WeeklyMetrics> = {
  views: "views",
  Views: "views",
  Visualizaciones: "views",
  likes: "likes",
  Likes: "likes",
  comentarios: "comments",
  Comentarios: "comments",
  Comments: "comments",
  compartidos: "shares",
  Compartidos: "shares",
  Shares: "shares",
  seguidores: "followers",
  Seguidores: "followers",
  Followers: "followers",
  "visu perfil": "profileVisits",
  "Visu perfil": "profileVisits",
  "Profile Visits": "profileVisits",
  reach: "reach",
  Reach: "reach",
  Alcance: "reach",
  interacciones: "interactions",
  Interacciones: "interactions",
  Interactions: "interactions",
};

const WEEK_DATES: Record<string, { start: string; end: string }> = {
  w1: { start: "2026-01-05", end: "2026-01-11" },
  w2: { start: "2026-01-12", end: "2026-01-18" },
  w3: { start: "2026-01-19", end: "2026-01-25" },
  w4: { start: "2026-01-26", end: "2026-02-01" },
  w5: { start: "2026-02-02", end: "2026-02-08" },
  w6: { start: "2026-02-09", end: "2026-02-15" },
  w7: { start: "2026-02-16", end: "2026-02-22" },
  w8: { start: "2026-02-23", end: "2026-03-01" },
  w9: { start: "2026-03-02", end: "2026-03-08" },
  w10: { start: "2026-03-09", end: "2026-03-15" },
  w11: { start: "2026-03-16", end: "2026-03-22" },
  w12: { start: "2026-03-23", end: "2026-03-29" },
};

interface AccountAnchor {
  weekCol: number;
  account: AccountHandle;
}

interface HeaderSegment {
  account: AccountHandle;
  weekCol: number;
  metricCols: Map<number, keyof WeeklyMetrics>;
}

function detectAccount(value: unknown): AccountHandle | null {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  if (!normalized) return null;
  if (normalized.includes("oso") || normalized.includes("elosodebresh")) {
    return "@elosodebresh";
  }
  if (normalized.includes("mundo") || normalized.includes("mundobresh")) {
    return "@mundobresh";
  }
  return null;
}

function detectAccountAnchors(rowStrings: string[]): AccountAnchor[] {
  const anchors: AccountAnchor[] = [];
  const seenAccounts = new Set<AccountHandle>();

  for (let colIdx = 0; colIdx < rowStrings.length; colIdx++) {
    const account = detectAccount(rowStrings[colIdx]);
    if (!account || seenAccounts.has(account)) continue;

    anchors.push({ weekCol: colIdx, account });
    seenAccounts.add(account);
  }

  return anchors.sort((a, b) => a.weekCol - b.weekCol);
}

function buildHeaderSegments(
  rowStrings: string[],
  accountAnchors: AccountAnchor[],
  fallbackAccount: AccountHandle | null
): HeaderSegment[] {
  if (accountAnchors.length > 0) {
    const segments: HeaderSegment[] = [];

    for (let i = 0; i < accountAnchors.length; i++) {
      const anchor = accountAnchors[i];
      const nextWeekCol = accountAnchors[i + 1]?.weekCol ?? rowStrings.length;
      const metricCols = new Map<number, keyof WeeklyMetrics>();

      for (let colIdx = anchor.weekCol + 1; colIdx < nextWeekCol; colIdx++) {
        const mapped = COLUMN_MAP[rowStrings[colIdx]];
        if (mapped) metricCols.set(colIdx, mapped);
      }

      if (metricCols.size > 0) {
        segments.push({
          account: anchor.account,
          weekCol: anchor.weekCol,
          metricCols,
        });
      }
    }

    if (segments.length > 0) return segments;
  }

  if (!fallbackAccount) return [];

  const metricCols = new Map<number, keyof WeeklyMetrics>();
  for (let colIdx = 0; colIdx < rowStrings.length; colIdx++) {
    const mapped = COLUMN_MAP[rowStrings[colIdx]];
    if (mapped) metricCols.set(colIdx, mapped);
  }

  if (metricCols.size === 0) return [];

  return [
    {
      account: fallbackAccount,
      weekCol: 0,
      metricCols,
    },
  ];
}

function parseNumeric(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const sanitized = value.trim().replace(/,/g, "");
    const parsed = Number(sanitized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function normalizeWeekLabel(raw: string): string | null {
  const cleaned = raw.toString().trim().toLowerCase();
  const match = cleaned.match(/^w(\d+)$/);
  if (match) return `w${match[1]}`;
  const match2 = cleaned.match(/^semana\s*(\d+)$/i);
  if (match2) return `w${match2[1]}`;
  return null;
}

export interface ParseResult {
  metrics: WeeklyMetrics[];
  warnings: string[];
}

export function parseExcelBuffer(buffer: ArrayBuffer): ParseResult {
  const workbook = XLSX.read(buffer, { type: "array" });
  const warnings: string[] = [];
  const allMetrics: WeeklyMetrics[] = [];

  const metricasSheet =
    workbook.Sheets["Metricas Tiktok"] ||
    workbook.Sheets["Metricas TikTok"] ||
    workbook.Sheets[workbook.SheetNames.find((n) => n.toLowerCase().includes("metricas")) || ""];

  if (metricasSheet) {
    const parsed = parseMetricasTiktokSheet(metricasSheet);
    allMetrics.push(...parsed.metrics);
    warnings.push(...parsed.warnings);
  } else {
    warnings.push("No se encontro la hoja 'Metricas Tiktok'");
  }

  return { metrics: allMetrics, warnings };
}

function parseMetricasTiktokSheet(sheet: XLSX.WorkSheet): ParseResult {
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];
  const metrics: WeeklyMetrics[] = [];
  const warnings: string[] = [];

  let accountAnchors: AccountAnchor[] = [];
  let headerSegments: HeaderSegment[] = [];
  let fallbackAccount: AccountHandle | null = null;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const rowStrings = row.map((c) => String(c || "").trim());
    const firstCell = rowStrings[0] || "";
    const firstCellAccount = detectAccount(firstCell);
    if (firstCellAccount) fallbackAccount = firstCellAccount;

    const detectedAnchors = detectAccountAnchors(rowStrings);
    if (detectedAnchors.length > 0) {
      accountAnchors = detectedAnchors;
    }

    const detectedSegments = buildHeaderSegments(
      rowStrings,
      accountAnchors,
      fallbackAccount
    );
    if (detectedSegments.length > 0) {
      headerSegments = detectedSegments;
      continue;
    }

    if (headerSegments.length === 0) continue;

    for (const segment of headerSegments) {
      const weekLabelRaw = String(row[segment.weekCol] || "").trim();
      if (weekLabelRaw.toUpperCase() === "TOTALES" || weekLabelRaw === "") {
        continue;
      }

      const weekKey = normalizeWeekLabel(weekLabelRaw);
      if (!weekKey) continue;

      const dates = WEEK_DATES[weekKey];
      if (!dates) {
        warnings.push(`Fecha no mapeada para ${weekKey}`);
        continue;
      }

      const weekNum = weekKey.replace("w", "");
      const id = `2026-W${weekNum.padStart(2, "0")}-${segment.account.replace("@", "")}`;

      const metric: WeeklyMetrics = {
        id,
        account: segment.account,
        weekLabel: `Semana ${weekNum}`,
        weekStartDate: dates.start,
        weekEndDate: dates.end,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        followers: 0,
        profileVisits: 0,
        reach: 0,
        interactions: 0,
      };

      for (const [colIdx, field] of segment.metricCols.entries()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (metric as any)[field] = parseNumeric(row[colIdx]);
      }

      metrics.push(metric);
    }
  }

  return { metrics, warnings };
}
