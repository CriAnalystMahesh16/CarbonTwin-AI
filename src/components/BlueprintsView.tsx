import React from "react";
import { BookOpen } from "lucide-react";

export function BlueprintsView(): React.JSX.Element {
  return (
    <div className="max-w-4xl mx-auto space-y-8" id="sys-blueprints-view">
      <div className="bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-2xl space-y-6 shadow-md">
        <h2 className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-1.5 border-b border-slate-800 pb-4">
          <BookOpen className="w-6 h-6 text-emerald-400" /> Digital Twin Platform architecture blueprints
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-emerald-400 font-bold uppercase block mb-1">01. Intelligent Decision Engine</span>
            <p className="text-slate-400">
              Calculates mitigation scores dynamically. Automatically prioritizes action proposals matching both highest carbon footprint hotspots (typically flights and local commuting engines) and stated lifestyle goals.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-emerald-400 font-bold uppercase block mb-1">02. Static ABAC Rule Gate</span>
            <p className="text-slate-400">
              Attribute-Based Access Control restricts snapshot historical modifications under user subdirectories. Checks request.auth.uid securely against target collection paths.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-emerald-400 font-bold uppercase block mb-1">03. Secure API Proxies</span>
            <p className="text-slate-400">
              Strict full-stack separation: Client UI makes standard local routing requests to server.ts. The server hosts the @google/genai SDK, never detailing keys to browser bundles.
            </p>
          </div>
        </div>

        {/* API CONTRACT OVERVIEW CODE SPEC */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-white">Firestore Schema Entity Blueprint</h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
            <p className="text-emerald-400 font-bold">// Collection structure blueprint</p>
            <p className="text-amber-400">/users/{"{userId}"}</p>
            <p className="pl-4 text-slate-400">// properties: uid (string), email (string), displayName (string), createdAt (timestamp)</p>
            <p className="text-amber-400 mt-2">/users/{"{userId}"}/twins/{"{twinId}"}</p>
            <p className="pl-4 text-slate-400">// properties: id(string), userId(string), inputs(Map), analysis(Map), createdAt(timestamp)</p>
          </div>
        </div>

        {/* FIRESTORE RULE SNIPPET SPECIFICATION */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-white">Hardened Firestore Security Rules (ABAC)</h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs font-mono text-slate-400 max-h-48 overflow-y-auto leading-relaxed">
            <p className="text-slate-500">// Zero-Trust Master Security rule definitions currently deployed in firestore.rules</p>
            <p className="text-slate-300">rules_version = '2';</p>
            <p className="text-slate-300">service cloud.firestore {"{"}</p>
            <p className="text-slate-300 pl-4">match /databases/{"{database}"}/documents {"{"}</p>
            <p className="text-rose-400 pl-8">// Global safety default denies read/write</p>
            <p className="text-slate-300 pl-8">match /{"{document=**}"} {"{"}</p>
            <p className="text-slate-300 pl-12">allow read, write: if false;</p>
            <p className="text-slate-300 pl-8">{"}"}</p>
            <p className="text-slate-300 pl-8">function isOwner(userId) {"{"}</p>
            <p className="text-slate-350 pl-12">return request.auth != null && request.auth.uid == userId;</p>
            <p className="text-slate-300 pl-8">{"}"}</p>
            <p className="text-slate-500 pl-8">// Lock historical twins, create permitted only...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
