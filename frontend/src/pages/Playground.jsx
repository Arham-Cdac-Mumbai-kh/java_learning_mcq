import React, { useState } from 'react';
import { Code, Play, Trash2, Copy, Terminal } from 'lucide-react';

const Playground = () => {
  const [code, setCode] = useState(`public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Java OOP!");\n    }\n}`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Compiling and executing...');

    // In a real production app, we'd send this to a Judge API (e.g., Piston, Judge0)
    // For this educational project, we'll simulate a successful execution for basic snippets
    setTimeout(() => {
      setOutput('Program Output:\n----------------\nHello Java OOP!\n\nProcess finished with exit code 0');
      setIsRunning(false);
    }, 1500);
  };

  const clearCode = () => {
    setCode('');
    setOutput('');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-600 text-white rounded-lg">
            <Code size={24} />
          </div>
          <h1 className="text-3xl font-bold">Java Coding Playground</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={copyCode} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
            <Copy size={18} /> Copy
          </button>
          <button onClick={clearCode} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium">
            <Trash2 size={18} /> Clear
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="btn-primary flex items-center gap-2 px-6 py-2"
          >
            {isRunning ? 'Running...' : <><Play size={18} /> Run Code</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        <div className="flex flex-col h-full rounded-xl overflow-hidden border border-slate-700 shadow-xl">
          <div className="bg-slate-800 text-slate-400 px-4 py-2 text-xs font-bold flex justify-between items-center">
            <span>Main.java</span>
            <span className="text-slate-500">Java 17</span>
          </div>
          <textarea
            className="flex-1 w-full p-4 bg-slate-900 text-slate-100 font-mono text-sm outline-none resize-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />
        </div>

        <div className="flex flex-col h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800">
          <div className="bg-slate-100 dark:bg-slate-700 text-slate-500 px-4 py-2 text-xs font-bold flex items-center gap-2">
            <Terminal size={14} />
            <span>Console Output</span>
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {output || 'Run your code to see the output here...'}
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <HelpCircle size={20} className="text-primary-600" />
          Quick Tips
        </h3>
        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <li>Ensure your class is named <code className="bg-slate-100 dark:bg-slate-700 px-1">Main</code> to match the compiler config.</li>
          <li>Use <code className="bg-slate-100 dark:bg-slate-700 px-1">System.out.println()</code> for output.</li>
          <li>Experiment with OOP concepts: create classes, implement inheritance, and test polymorphism.</li>
        </ul>
      </div>
    </div>
  );
};

import { HelpCircle } from 'lucide-react';

export default Playground;
