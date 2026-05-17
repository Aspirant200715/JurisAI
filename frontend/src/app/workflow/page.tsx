import Link from "next/link";
import { ArrowDown, Shield, Brain, Scale, FileText, GitBranch } from "lucide-react";

export default function WorkflowPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 font-sans">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-10">
        <Link href="/" className="text-blue-700 hover:underline font-bold text-lg">
          ← Back to LexGuard
        </Link>
        <h1 className="text-4xl font-bold text-slate-900 mt-4 mb-2">
          Multi-Agent Workflow Architecture
        </h1>
        <p className="text-lg text-slate-600">
          Powered by <strong>LangGraph</strong> - State-Managed Orchestration
        </p>
      </header>

      {/* Workflow Diagram */}
      <section className="max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-center">🔄 Agent Execution Pipeline</h2>
          
          <div className="flex flex-col gap-4">
            {/* Agent 1 */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8" />
                <h3 className="text-xl font-bold">Agent 1: Clause Extractor</h3>
              </div>
              <p className="text-blue-50">
                Scans the contract and identifies potentially risky clauses across categories:
                liability, privacy, termination, IP, payment, renewal, non-compete
              </p>
              <div className="mt-3 bg-blue-700 bg-opacity-50 p-3 rounded text-sm">
                <strong>Output:</strong> List of extracted clauses with categories
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-8 h-8 text-slate-400" />
            </div>

            {/* Agent 2 */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8" />
                <h3 className="text-xl font-bold">Agent 2: Risk Assessor</h3>
              </div>
              <p className="text-red-50">
                Analyzes each clause for legal risk, assigns severity scores (0-10),
                and provides detailed reasoning about potential implications
              </p>
              <div className="mt-3 bg-red-700 bg-opacity-50 p-3 rounded text-sm">
                <strong>Output:</strong> Risk scores + legal reasoning for each clause
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-8 h-8 text-slate-400" />
            </div>

            {/* Agent 3 */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Scale className="w-8 h-8" />
                <h3 className="text-xl font-bold">Agent 3: Devil's Advocate</h3>
              </div>
              <p className="text-purple-50">
                Challenges assumptions by defending clauses from the company's perspective,
                checking industry standards, and identifying counter-arguments
              </p>
              <div className="mt-3 bg-purple-700 bg-opacity-50 p-3 rounded text-sm">
                <strong>Output:</strong> Adversarial perspective + standard/non-standard flags
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-8 h-8 text-slate-400" />
            </div>

            {/* Agent 4 */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-8 h-8" />
                <h3 className="text-xl font-bold">Agent 4: Plain Language Translator</h3>
              </div>
              <p className="text-green-50">
                Translates complex legal jargon into simple, accessible language with
                real-world impact explanations and actionable negotiation tips
              </p>
              <div className="mt-3 bg-green-700 bg-opacity-50 p-3 rounded text-sm">
                <strong>Output:</strong> Plain English + negotiation recommendations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LangGraph Features */}
      <section className="max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-yellow-400">
          <div className="flex items-center gap-3 mb-6">
            <GitBranch className="w-8 h-8 text-yellow-600" />
            <h2 className="text-2xl font-bold text-slate-900">LangGraph Advantages</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-bold text-yellow-900 mb-2">🔄 State Management</h3>
              <p className="text-slate-700">
                Maintains context across all agents, ensuring seamless data flow and consistency
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-bold text-yellow-900 mb-2">🛡️ Automatic Retries</h3>
              <p className="text-slate-700">
                Handles API rate limits and failures with exponential backoff strategies
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-bold text-yellow-900 mb-2">🔧 Fallback Mechanisms</h3>
              <p className="text-slate-700">
                Rule-based extraction if LLM fails, ensuring reliability in production
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-bold text-yellow-900 mb-2">📊 Visualizable Workflow</h3>
              <p className="text-slate-700">
                Clear execution graph that can be monitored and debugged in real-time
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-bold text-yellow-900 mb-2">🧩 Modular Design</h3>
              <p className="text-slate-700">
                Easy to add new agents or modify existing ones without breaking the pipeline
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-bold text-yellow-900 mb-2">⚡ Parallel Execution</h3>
              <p className="text-slate-700">
                Can run independent agents in parallel for faster processing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">🔬 Technical Implementation</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">State Schema</h3>
              <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`class AgentState(TypedDict):
    document_text: str
    extracted_clauses: List[dict]
    risk_assessments: List[dict]
    adversarial_checks: List[dict]
    user_insights: List[dict]
    final_report: dict`}
              </pre>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">Workflow Graph</h3>
              <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`workflow = StateGraph(AgentState)
workflow.add_node("extractor", extract_clauses_node)
workflow.add_node("risk_assessor", assess_risk_node)
workflow.add_node("devils_advocate", devils_advocate_node)
workflow.add_node("translator", translate_node)

workflow.set_entry_point("extractor")
workflow.add_edge("extractor", "risk_assessor")
workflow.add_edge("risk_assessor", "devils_advocate")
workflow.add_edge("devils_advocate", "translator")
workflow.add_edge("translator", END)`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="max-w-4xl mx-auto text-center">
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
          <p className="text-lg text-slate-700">
            This multi-agent workflow demonstrates <strong>innovation in legal AI</strong> by 
            combining adversarial reasoning, risk assessment, and explainable AI in a 
            state-managed orchestration system.
          </p>
        </div>
      </section>
    </main>
  );
}