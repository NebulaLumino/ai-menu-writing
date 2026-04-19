"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ACCENT = "bg-rose-500";
const ACCENT_TEXT = "text-rose-400";
const ACCENT_GLOW = "shadow-rose-500/20";

export default function MenuDescription() {
  const [dishName, setDishName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [cookingMethod, setCookingMethod] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName || !ingredients || !cookingMethod || !price) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishName, ingredients, cookingMethod, price }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result || "");
    } catch {
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-5 flex items-center gap-3">
        <div className={`w-10 h-10 ${ACCENT} rounded-xl flex items-center justify-center text-xl`}>📜</div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Restaurant Menu Description Writer</h1>
          <p className="text-sm text-gray-400">Marketing copy with sensory language & upsell framing</p>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Dish Name</label>
            <input value={dishName} onChange={e => setDishName(e.target.value)} placeholder="e.g., Seared Duck Breast with Cherry Gastrique"
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Key Ingredients</label>
            <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} rows={3}
              placeholder="e.g., duck breast, bing cherries, red wine, thyme, butter..."
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Cooking Method</label>
            <select value={cookingMethod} onChange={e => setCookingMethod(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select cooking method...</option>
              <option value="pan-seared" className="bg-gray-900">Pan-Seared</option>
              <option value="grilled" className="bg-gray-900">Grilled</option>
              <option value="braised" className="bg-gray-900">Braised</option>
              <option value="roasted" className="bg-gray-900">Roasted</option>
              <option value="poached" className="bg-gray-900">Poached</option>
              <option value="deep-fried" className="bg-gray-900">Deep-Fried</option>
              <option value="sous-vide" className="bg-gray-900">Sous Vide</option>
              <option value="smoked" className="bg-gray-900">Smoked</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g., $28, Market Price, $18–24"
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50 transition-colors" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${ACCENT} hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${ACCENT_GLOW}`}>
            {loading ? "Writing Description..." : "Write Menu Description"}
          </button>
        </form>
        <div className="flex flex-col">
          <h2 className={`text-sm font-semibold uppercase tracking-wider ${ACCENT_TEXT} mb-3`}>AI Output</h2>
          <div className="flex-1 bg-gray-800/40 border border-white/10 rounded-xl p-6 overflow-y-auto max-h-[600px]">
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500 italic">Your menu description will appear here...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
