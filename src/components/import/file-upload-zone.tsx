"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parseExcelBuffer } from "@/lib/excel-parser";
import type { WeeklyMetrics } from "@/types/metrics";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onImportComplete: () => void;
}

type Status = "idle" | "parsing" | "preview" | "uploading" | "success" | "error";

export function FileUploadZone({ onImportComplete }: FileUploadZoneProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [parsedMetrics, setParsedMetrics] = useState<WeeklyMetrics[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setStatus("parsing");
    setWarnings([]);

    try {
      const buffer = await file.arrayBuffer();
      const result = parseExcelBuffer(buffer);

      if (result.metrics.length === 0) {
        setStatus("error");
        setMessage("No se encontraron datos validos en el archivo");
        setWarnings(result.warnings);
        return;
      }

      setParsedMetrics(result.metrics);
      setWarnings(result.warnings);
      setStatus("preview");
    } catch {
      setStatus("error");
      setMessage("Error al parsear el archivo Excel");
    }
  }, []);

  const handleConfirmImport = async () => {
    setStatus("uploading");
    try {
      const res = await fetch("/api/metrics/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics: parsedMetrics }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || `Se importaron ${data.count} registros`);
        onImportComplete();
      } else {
        setStatus("error");
        setMessage(data.error || "Error al importar");
      }
    } catch {
      setStatus("error");
      setMessage("Error de conexion al importar");
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setStatus("idle");
    setParsedMetrics([]);
    setWarnings([]);
    setMessage("");
    setFileName("");
  };

  return (
    <Card>
      <CardContent className="p-6">
        {status === "idle" && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 cursor-pointer transition-colors",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            )}
          >
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="text-center">
              <p className="text-lg font-medium">
                Arrastra tu archivo Excel aqui
              </p>
              <p className="text-sm text-muted-foreground">
                o hace click para seleccionar (.xlsx, .xls)
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleInputChange}
            />
          </div>
        )}

        {status === "parsing" && (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p>Parseando {fileName}...</p>
          </div>
        )}

        {status === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <span className="font-medium">{fileName}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Se encontraron {parsedMetrics.length} registros listos para
              importar.
            </p>
            {warnings.length > 0 && (
              <div className="rounded-lg bg-yellow-500/10 p-3">
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Advertencias:
                </p>
                <ul className="mt-1 list-disc pl-4 text-sm text-yellow-600 dark:text-yellow-400">
                  {warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleConfirmImport}>Confirmar Import</Button>
              <Button variant="outline" onClick={reset}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {status === "uploading" && (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p>Importando datos...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-12">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
            <p className="text-lg font-medium">{message}</p>
            <Button variant="outline" onClick={reset}>
              Importar otro archivo
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-12">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-lg font-medium text-red-600 dark:text-red-400">
              {message}
            </p>
            {warnings.length > 0 && (
              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
            <Button variant="outline" onClick={reset}>
              Intentar de nuevo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
