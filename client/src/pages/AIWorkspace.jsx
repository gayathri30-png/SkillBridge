import React from "react";
import AIChatPanel from "../components/AIChatPanel";
import PromptBuilder from "../components/PromptBuilder";
import { LayoutDashboard, Database, Settings } from "lucide-react";

export default function AIWorkspace() {
  return (
    <div className="h-[calc(100vh-64px)] flex bg-slate-100 overflow-hidden">
        {/* Workspace Sidebar (Mini) */}
        <div className="w-16 bg-slate-900 flex flex-col items-center py-4 gap-4 text-slate-400">
            <div className="p-2 bg-indigo-600 text-white rounded-lg mb-4">
                <span className="font-bold text-xs">AI</span>
            </div>
            <button className="p-2 rounded-lg bg-slate-800 text-indigo-400"><LayoutDashboard size={20} /></button>
            <button className="p-2 rounded-lg hover:bg-slate-800 hover:text-slate-100"><Database size={20} /></button>
            <div className="flex-1" />
            <button className="p-2 rounded-lg hover:bg-slate-800 hover:text-slate-100"><Settings size={20} /></button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 bg-white border-b flex items-center px-6 justify-between">
                <h2 className="text-lg font-semibold text-slate-800 m-0">AI Workspace</h2>
                <div className="flex gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">GPT-4 Turbo</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">34ms Latency</span>
                </div>
            </header>
            
            <main className="flex-1 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
                <div className="md:col-span-2 h-full flex flex-col gap-4 min-h-0">
                    <div className="h-2/3 min-h-0">
                        <PromptBuilder />
                    </div>
                    <div className="h-1/3 bg-white rounded-xl border border-slate-200 p-4 min-h-0 overflow-y-auto">
                        <h4 className="font-bold text-slate-700 mb-2">Execution Logs</h4>
                        <p className="font-mono text-xs text-slate-500">[10:42:01] Initializing context...</p>
                        <p className="font-mono text-xs text-slate-500">[10:42:01] Vector DB connected.</p>
                        <p className="font-mono text-xs text-green-600">[10:42:02] Response generated in 1.4s</p>
                    </div>
                </div>
                
                <div className="h-full min-h-0 border rounded-xl overflow-hidden shadow-sm">
                    <AIChatPanel />
                </div>
            </main>
        </div>
    </div>
  );
}
