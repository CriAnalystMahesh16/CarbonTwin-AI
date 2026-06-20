import React from "react";
import { Github } from "lucide-react";

export function AppFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 block py-8 text-center text-[10px] text-slate-600 tracking-wider uppercase select-none mt-12 space-y-2 font-sans">
      <p>CarbonTwin AI Platform • All Rights Reserved 2026</p>
      <p className="text-[9px] text-slate-700">WCAG 2.2 compliant • Zero-Trust Database rules enforced</p>
      <div className="pt-2 flex justify-center">
        <a 
          href="https://github.com/CriAnalystMahesh16/CarbonTwin-AI.git"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[9px] text-emerald-500 font-bold hover:text-emerald-400 normal-case tracking-normal transition-colors"
        >
          <Github className="w-3.5 h-3.5" /> github.com/CriAnalystMahesh16/CarbonTwin-AI
        </a>
      </div>
    </footer>
  );
}
