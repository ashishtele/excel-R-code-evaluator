"use client";

import React, { useEffect, useMemo, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-r";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface REditorProps {
  filenames: string[];
}

const DEFAULT_CODE = `# Paste your R script here or upload a .txt/.md file above.\n`;

export default function REditor({ filenames }: REditorProps) {
  const [code, setCode] = useState(DEFAULT_CODE);

  const handleRCodeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || (file.name.endsWith('.txt') || file.name.endsWith('.md')) === false) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (filenames?.length && code === DEFAULT_CODE) {
      const example = `# Available CSV files: ${filenames.join(', ')}\n`;
      setCode(DEFAULT_CODE.replace('# Paste your R script here or upload a .txt/.md file above.\n', example + DEFAULT_CODE));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filenames.join(",")]);

  const highlight = useMemo(() => {
    return (code: string) => Prism.highlight(code, Prism.languages.r, "r");
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <Card className="p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Upload R Script (.txt or .md)</div>
          <label htmlFor="r-code-upload" className="cursor-pointer">
            <Button type="button" variant="outline" size="sm">Upload R Code</Button>
          </label>
          <input
            id="r-code-upload"
            type="file"
            accept=".txt,.md"
            onChange={handleRCodeUpload}
            className="hidden"
          />
        </div>
      </Card>

      <Card className="flex min-h-[260px] flex-1 flex-col overflow-hidden">
        <div className="p-2">
          <div className="text-sm font-medium">R Code Viewer</div>
        </div>
        <Separator />
        <div className="min-h-0 flex-1 overflow-auto">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={highlight}
            padding={12}
            textareaId="r-editor"
            className="font-mono text-sm"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              minHeight: 240,
              outline: 'none'
            }}
          />
        </div>
      </Card>
    </div>
  );
}