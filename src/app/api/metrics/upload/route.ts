import { NextRequest, NextResponse } from "next/server";
import { upsertMetrics } from "@/lib/data";
import type { WeeklyMetrics } from "@/types/metrics";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    metrics: WeeklyMetrics[];
  };

  if (!body.metrics || !Array.isArray(body.metrics)) {
    return NextResponse.json(
      { error: "Se requiere un array de metricas" },
      { status: 400 }
    );
  }

  const metricsWithSource = body.metrics.map((m) => ({
    ...m,
    source: "excel" as const,
  }));
  const count = await upsertMetrics(metricsWithSource);
  return NextResponse.json({
    success: true,
    count,
    message: `Se importaron ${count} registros correctamente`,
  });
}
