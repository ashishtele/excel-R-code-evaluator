// WebR singleton initializer
// Note: This file must be imported only in Client Components

import { WebR } from "webr";

let webRInstance: WebR | null = null;

export async function getWebR() {
  if (typeof window === "undefined") throw new Error("WebR can only run in the browser");
  if (!webRInstance) {
    webRInstance = new WebR({
      baseURL: undefined, // use CDN default
      stdout: (line: string) => console.log("R:", line),
      stderr: (line: string) => console.warn("R err:", line),
    });
    await webRInstance.init();
  }
  return webRInstance;
}

export type SheetCSV = { name: string; filename: string; csv: string };

export async function writeSheetsToWebRFS(sheets: SheetCSV[]) {
  const webR = await getWebR();
  const enc = new TextEncoder();
  for (const s of sheets) {
    try {
      webR.FS.writeFile(s.filename, enc.encode(s.csv));
    } catch (e) {
      console.error("Failed writing", s.filename, e);
    }
  }
  return sheets.map((s) => s.filename);
}

export async function runRWithCapture(code: string) {
  const webR = await getWebR();
  // @ts-ignore captureR exists in webr runtime
  const out = await (webR as any).captureR(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await webR.evalR(code);
  });
  return out as { stdout: string; stderr: string; result: unknown };
}