"use client";

import React, { useCallback, useState } from "react";
import ExcelViewer, { type SheetCSV, type SheetArray } from "./ExcelViewer";
import REditor from "./REditor";
import { Card } from "@/components/ui/card";
import { writeSheetsToWebRFS, runRWithCapture } from "@/lib/webr";

export default function Evaluator() {
  const [filenames, setFilenames] = useState<string[]>([]);
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [running, setRunning] = useState(false);

  const onSheetsParsed = useCallback(async (sheets: (SheetCSV & SheetArray)[]) => {
    const files = sheets.map((s) => ({ name: s.name, filename: s.filename, csv: s.csv }));
    await writeSheetsToWebRFS(files);
    setFilenames(files.map((f) => f.filename));
  }, []);

  const onRun = useCallback(async (code: string) => {
    setRunning(true);
    setStdout("");
    setStderr("");
    try {
      const out = await runRWithCapture(code);
      setStdout(out.stdout || "");
      setStderr(out.stderr || "");
    } catch (e: any) {
      setStderr(String(e?.message || e));
    } finally {
      setRunning(false);
    }
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Excel ↔ R Evaluation Tool</h1>
        <a
          href="https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&w=1200&auto=format&fit=crop"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-muted-foreground hover:underline"
        >
          Reference design
        </a>
      </div>
      <Card className="grid min-h-[70vh] grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div className="min-h-0">
          <div className="mb-2 text-sm font-medium">Excel Sheets</div>
          <ExcelViewer onSheetsParsed={onSheetsParsed} />
        </div>
        <div className="min-h-0">
          <div className="mb-2 text-sm font-medium">R Code & Results</div>
          <REditor filenames={filenames} onRun={onRun} running={running} stdout={stdout} stderr={stderr} />
        </div>
      </Card>
      <p className="text-xs text-muted-foreground">Tip: After uploading Excel, use read.csv('YourSheet.csv') in R to read the sheet.</p>
    </div>
  );
}