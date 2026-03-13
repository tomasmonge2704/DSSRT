"use client";

import { FileUploadZone } from "@/components/import/file-upload-zone";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, Info } from "lucide-react";

export default function ImportPage() {
  const router = useRouter();

  const handleImportComplete = () => {
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Importar Datos</h1>

      <FileUploadZone onImportComplete={handleImportComplete} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4" />
            Formato esperado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            El archivo Excel debe contener una hoja llamada{" "}
            <strong>&quot;Metricas Tiktok&quot;</strong> con el siguiente formato:
          </p>
          <div className="flex items-start gap-2">
            <FileSpreadsheet className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium text-foreground">Estructura:</p>
              <ul className="mt-1 list-disc pl-4 space-y-1">
                <li>Seccion por cuenta (ej: &quot;El oso de la bresh&quot;, &quot;Mundo Bresh&quot;)</li>
                <li>Fila de encabezados: Views, Likes, Comentarios, Compartidos, Seguidores, Visu perfil, reach, interacciones</li>
                <li>Filas de datos por semana: w1, w2, w3...</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
