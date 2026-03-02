import React, { useState } from "react";
import { Save, Play, Copy, Plus } from "lucide-react";
import { cn } from "../lib/utils";

export default function PromptBuilder() {
  const [prompt, setPrompt] = useState(
    "Analyze the following resume for a {{role}} position:\n\n{{resume_text}}"
  );
  const [variables, setVariables] = useState([
    { name: "role", value: "Senior React Developer" },
    { name: "resume_text", value: "[Paste Resume Here]" }
  ]);

  const handleRun = () => {
    let finalPrompt = prompt;
    variables.forEach(v => {
        finalPrompt = finalPrompt.replace(new RegExp(`{{${v.name}}}`, 'g'), v.value);
    });
    console.log("Running Prompt:", finalPrompt);
    alert(`Prompt Built:\n\n${finalPrompt}`);
  };

  const addVariable = () => {
      const name = prompt("Variable Name (e.g., 'topic'):");
      if (name) setVariables([...variables, { name, value: "" }]);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 m-0">Prompt Builder</h3>
        <div className="flex gap-2">
            <button className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-white border rounded-md hover:bg-slate-50">
                <Save size={14} /> Save Template
            </button>
            <button 
                onClick={handleRun}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
                <Play size={14} /> Run
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* Editor */}
        <div className="flex-1 p-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">System / User Prompt</label>
            <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-[calc(100%-2rem)] p-4 bg-slate-900 text-slate-50 font-mono text-sm rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                spellCheck={false}
            />
        </div>

        {/* Variables Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 p-4">
            <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Variables</label>
                <button onClick={addVariable}><Plus size={14} className="text-slate-400 hover:text-indigo-600" /></button>
            </div>
            
            <div className="space-y-3">
                {variables.map((v, i) => (
                    <div key={i} className="bg-white p-2 rounded border border-slate-200">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-mono text-indigo-600 font-semibold">{"{{"}{v.name}{"}}"}</span>
                        </div>
                        <input 
                            value={v.value}
                            onChange={(e) => {
                                const newVars = [...variables];
                                newVars[i].value = e.target.value;
                                setVariables(newVars);
                            }}
                            className="w-full text-sm p-1 border rounded bg-slate-50 focus:bg-white transition-colors"
                        />
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
