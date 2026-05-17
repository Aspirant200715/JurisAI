"use client";
import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ShieldCheck, Scale, FileText, Loader2, GitBranch, Shield } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);
    setLogs(["🚀 Initializing LexGuard multi-agent LangGraph pipeline..."]);

    const timer1 = setTimeout(() => {
      setLogs(prev => [...prev, "🔍 Agent 1: Extracting key legal clauses..."]);
    }, 1500);

    const timer2 = setTimeout(() => {
      setLogs(prev => [...prev, "⚠️ Agent 2: Assessing liability & risk exposure..."]);
    }, 3500);

    const timer3 = setTimeout(() => {
      setLogs(prev => [...prev, "⚖️ Agent 3: Performing adversarial stress-test..."]);
    }, 5500);

    const timer4 = setTimeout(() => {
      setLogs(prev => [...prev, "🗣️ Agent 4: Translating legalese to plain English..."]);
    }, 7500);

    const timer5 = setTimeout(() => {
      setLogs(prev => [...prev, "🛡️ Agent 5: Scanning data privacy & statutory compliance..."]);
    }, 9500);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to analyze document");
      }

      const data = await res.json();
      setResult(data);

      const numClauses = data.extraction?.clauses?.length || 0;
      const numRisks = data.risk_analysis?.assessments?.length || 0;
      const numChecks = data.adversarial_check?.checks?.length || 0;
      const numInsights = data.user_insights?.insights?.length || 0;
      const numPrivacy = data.privacy_scan?.findings?.length || 0;

      setLogs([
        `🔍 Agent 1: Extracted ${numClauses} clauses`,
        `⚠️ Agent 2: Assessed ${numRisks} risks`,
        `⚖️ Agent 3: Completed adversarial check (${numChecks} clauses)`,
        `🗣️ Agent 4: Generated plain English insights (${numInsights} clauses)`,
        `🛡️ Agent 5: Found ${numPrivacy} privacy & compliance findings`
      ]);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 font-sans">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-10 text-center">
        <div className="flex justify-between items-center mb-6 bg-white py-4 px-6 rounded-xl shadow-sm border border-slate-200 max-w-xl mx-auto">
          <span className="font-bold text-xl text-blue-900">LexGuard</span>
          <div className="flex gap-4">
            <a href="/" className="text-blue-700 font-semibold hover:underline">Analyze Contract</a>
            <a href="/workflow" className="text-slate-600 font-semibold hover:text-blue-700 hover:underline">View Workflow</a>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-blue-900 mb-2">LexGuard</h1>
        <p className="text-lg text-slate-600">
          AI-Powered Contract Intelligence for Everyone
        </p>
        {/* Accessibility Disclaimer */}
        <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 text-sm text-left inline-block" role="alert">
          <strong>Disclaimer:</strong> This tool is for educational purposes only. It does not provide legal advice.
        </div>
        <div className="mt-4">
          <Link
            href="/workflow"
            className="text-blue-700 hover:text-blue-900 underline font-semibold inline-flex items-center gap-2"
          >
            <GitBranch className="w-4 h-4" />
            View Multi-Agent Workflow
          </Link>
        </div>
      </header>



      {/* Upload Section */}
      <section className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md mb-12 border-2 border-slate-200">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6" /> Upload Contract
        </h2>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            aria-label="Select contract file"
          />
          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-blue-700 text-white py-4 px-6 rounded-lg text-xl font-bold hover:bg-blue-800 disabled:bg-slate-400 transition-colors focus:ring-4 focus:ring-blue-300"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" /> Analyzing...
              </span>
            ) : (
              "Analyze Risks"
            )}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-red-600 font-semibold text-center" role="alert">
            {error}
          </p>
        )}

        {/* Live Execution Logs */}
        {logs.length > 0 && (
          <div className="mt-6 bg-slate-900 text-emerald-400 p-5 rounded-xl font-mono text-sm shadow-inner border border-slate-800">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800 text-slate-400 text-xs tracking-wider uppercase">
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${loading ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`}></span>
                LangGraph Execution Terminal
              </span>
              <span>{loading ? "Status: RUNNING..." : "Status: COMPLETED"}</span>
            </div>
            <div className="space-y-2 text-base">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-3 animate-fadeIn">
                  <span className="text-slate-500 select-none">[{index + 1}]</span>
                  <span className="text-emerald-300">{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Results Dashboard */}
      {result && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* 1. Risk Analysis */}
          <section className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-500">
            <h3 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" /> Risk Analysis
            </h3>
            <ul className="space-y-4">
              {result.risk_analysis.assessments.map((r: any, i: number) => (
                <li key={i} className="p-4 bg-red-50 rounded-lg border border-red-100 shadow-sm">
                  <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <span className="font-bold text-lg">{r.clause_text.substring(0, 60)}...</span>
                    <div className="flex gap-2">
                      <span className="bg-red-600 text-white px-2.5 py-1 rounded text-xs font-bold shadow-sm">
                        Risk: {r.risk_score}/10
                      </span>
                      {r.deviation_score != null && (
                        <span className="bg-orange-500 text-white px-2.5 py-1 rounded text-xs font-bold shadow-sm">
                          Deviation: {r.deviation_score}/10
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-700 mb-3">{r.reasoning}</p>

                  {/* Static RAG Benchmark Comparison */}
                  {r.benchmark_comparison && (
                    <div className="mt-3 bg-white p-4 rounded-lg border-l-4 border-orange-500 text-sm shadow-sm">
                      <strong className="text-orange-800 flex items-center gap-2 mb-1">
                        📊 Benchmark Comparison:
                      </strong>
                      <p className="text-slate-700 mt-1 leading-relaxed">{r.benchmark_comparison}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* 2. User Insights (Plain English) */}
          <section className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
            <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" /> What This Means
            </h3>
            <ul className="space-y-4">
              {result.user_insights.insights.map((ins: any, i: number) => (
                <li key={i} className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="font-bold text-lg text-green-800 mb-2">Clause: {ins.clause_text.substring(0, 50)}...</p>
                  <div className="bg-white p-3 rounded border border-green-200 mb-2">
                    <strong className="text-sm text-slate-500">PLAIN ENGLISH:</strong>
                    <p className="text-lg">{ins.plain_english}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-green-200">
                    <strong className="text-sm text-slate-500">NEGOTIATION TIP:</strong>
                    <p className="text-md italic text-slate-700">"{ins.negotiation_tip}"</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Adversarial Check */}
          <section className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500 md:col-span-2">
            <h3 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6" /> Devil's Advocate View
            </h3>
            <ul className="space-y-4">
              {result.adversarial_check.checks.map((check: any, i: number) => (
                <li key={i} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="font-bold text-lg text-purple-800 mb-1">Clause: {check.clause_text.substring(0, 50)}...</p>
                  <p className="text-slate-700"><strong>Is this standard?</strong> {check.is_standard ? "Yes" : "No"}</p>
                  <p className="text-slate-700 mt-1">{check.counter_argument}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Privacy & Compliance Scan */}
          <section className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500 md:col-span-2">
            <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" /> Privacy & Compliance
            </h3>

            {!result.privacy_scan?.findings || result.privacy_scan.findings.length === 0 ? (
              <p className="text-slate-500 italic p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                No specific privacy or compliance risks detected in this document.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {result.privacy_scan.findings.map((finding: any, i: number) => (
                  <div key={i} className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
                        <span className="font-bold text-indigo-900 uppercase text-xs tracking-wider bg-indigo-200 px-2 py-0.5 rounded">
                          {finding.category}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold text-white shadow-sm ${finding.severity === 'High' ? 'bg-red-600' : finding.severity === 'Medium' ? 'bg-orange-500' : 'bg-emerald-600'
                          }`}>
                          {finding.severity}
                        </span>
                      </div>
                      <p className="text-slate-800 font-semibold mb-2 text-base">{finding.issue}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-indigo-200">
                      <p className="text-sm text-slate-600 italic">💡 {finding.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      )}
    </main>
  );
}