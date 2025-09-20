"use client";

import React, { useCallback, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export type SheetArray = { name: string; rows: any[][] };
export type SheetCSV = { name: string; filename: string; csv: string };

export interface ExcelViewerProps {
  onSheetsParsed?: (sheets: (SheetCSV & SheetArray)[]) => void;
}

function toSafeFilename(name: string) {
  return `${name.replace(/[^a-z0-9\-_.]+/gi, "_")}.csv`;
}

export default function ExcelViewer({ onSheetsParsed }: ExcelViewerProps) {
  const [sheets, setSheets] = useState<(SheetCSV & SheetArray)[] | null>(null);
  const [active, setActive] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const hasData = !!sheets && sheets.length > 0;

  const onFiles = useCallback(async (file: File) => {
    const ab = await file.arrayBuffer();
    const wb = XLSX.read(ab, { type: "array" });
    const parsed: (SheetCSV & SheetArray)[] = wb.SheetNames.map((name) => {
      const ws = wb.Sheets[name]!;
      const rows = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: "" });
      const csv = XLSX.utils.sheet_to_csv(ws);
      return { name, rows, csv, filename: toSafeFilename(name) };
    });
    setSheets(parsed);
    setActive(0);
    onSheetsParsed?.(parsed);
  }, [onSheetsParsed]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFiles(f);
  }, [onFiles]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFiles(f);
  }, [onFiles]);

  const preview = useMemo(() => {
    if (!sheets || sheets.length === 0) return null;
    const s = sheets[active];
    const headers = (s.rows[0] as any[]) || [];
    const body = s.rows.slice(1, 101);
    return { headers, body, name: s.name };
  }, [sheets, active]);

  return (
    <div className="flex h-full flex-col gap-3">
      <Card className={`p-4 ${dragOver ? "ring-2 ring-primary" : ""}`}>
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center"
        >
          <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleInput} />
          <div className="text-sm text-muted-foreground">
            Drag and drop an Excel file (.xlsx/.xls) here, or click to browse
          </div>
        </label>
      </Card>

      {hasData ? (
        <div className="flex min-h-0 flex-1 gap-3">
          <Card className="w-48 shrink-0 overflow-auto p-2">
            <div className="mb-2 text-xs font-medium text-muted-foreground">Sheets</div>
            <div className="flex flex-col gap-1">
              {sheets!.map((s, i) => (
                <Button key={s.name} variant={i === active ? "default" : "secondary"} size="sm" onClick={() => setActive(i)} className="justify-start truncate">
                  {s.name}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-3 p-3">
              <div className="text-sm font-medium">Preview: {preview?.name}</div>
              <div className="text-xs text-muted-foreground">Showing up to 100 rows</div>
            </div>
            <Separator />
            <div className="min-w-0 flex-1 overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-secondary">
                  <tr>
                    {preview?.headers.map((h, idx) => (
                      <th key={idx} className="border border-border px-2 py-1 text-left font-medium">{String(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview?.body.map((row, rIdx) => (
                    <tr key={rIdx} className="odd:bg-muted/50">
                      {row.map((cell: any, cIdx: number) => (
                        <td key={cIdx} className="border border-border px-2 py-1 align-top">{String(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          Upload an Excel file to preview its sheets here.
        </Card>
      )}
    </div>
  );
}