import { useState, useEffect, useMemo, useCallback } from "react";

import { CATEGORIES } from "./data/categories";
import { FREE_DISCOUNTS, PREMIUM_DISCOUNTS } from "./data/discounts";
import { FREE_RECIPES, PREMIUM_RECIPES } from "./data/recipes";
import { HABITS } from "./data/habits";

import { formatZAR } from "./utils/formatZAR";

import NotificationBanner from "./components/NotificationBanner";
import PaywallModal from "./components/PaywallModal";
import RecipeCard from "./components/RecipeCard";
import PremiumGate from "./components/PremiumGate";

const LS = {
  get: (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  },
};

export default function App() {
  const [tab, setTab] = useState("budget");
  const [isPremium, setIsPremium] = useState(() => LS.get("sw_premium", false));
  const [showPaywall, setShowPaywall] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifiedLevels, setNotifiedLevels] = useState(() => LS.get("sw_notified", {}));

  // Budget State
  const [budget, setBudget] = useState(() => LS.get("sw_budget", ""));
  const [budgetSet, setBudgetSet] = useState(() => LS.get("sw_budgetSet", false));
  const [expenses, setExpenses] = useState(() => LS.get("sw_expenses", []));
  const [form, setForm] = useState({ amount: "", category: "food", note: "" });
  const [showForm, setShowForm] = useState(false);

  // Persist everything
  useEffect(() => { LS.set("sw_budget", budget); }, [budget]);
  useEffect(() => { LS.set("sw_budgetSet", budgetSet); }, [budgetSet]);
  useEffect(() => { LS.set("sw_expenses", expenses); }, [expenses]);
  useEffect(() => { LS.set("sw_premium", isPremium); }, [isPremium]);
  useEffect(() => { LS.set("sw_notified", notifiedLevels); }, [notifiedLevels]);

  const totalSpent = useMemo(() => 
    expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]
  );
  
  const remaining = budgetSet ? Number(budget) - totalSpent : null;
  const pct = budgetSet && Number(budget) > 0 
    ? Math.min((totalSpent / Number(budget)) * 100, 100) 
    : 0;

  const pushNotif = useCallback((id, type, title, message) => {
    setNotifications(prev => 
      prev.find(n => n.id === id) ? prev : [...prev, { id, type, title, message }]
    );
  }, []);

  // Budget notifications
  useEffect(() => {
    if (!budgetSet || !Number(budget)) return;

    const month = new Date().toISOString().slice(0, 7);
    const key80 = `${month}_80`;
    const key100 = `${month}_100`;

    if (pct >= 100 && !notifiedLevels[key100]) {
      pushNotif("over100", "danger", "Budget exceeded!", 
        `You've spent ${formatZAR(totalSpent)} — over your ${formatZAR(Number(budget))} budget.`);
      setNotifiedLevels(prev => ({ ...prev, [key100]: true }));
    } else if (pct >= 80 && !notifiedLevels[key80]) {
      pushNotif("warn80", "warning", "80% of budget used", 
        `Only ${formatZAR(remaining)} left for the month.`);
      setNotifiedLevels(prev => ({ ...prev, [key80]: true }));
    }
  }, [pct, budgetSet, budget, totalSpent, remaining, notifiedLevels, pushNotif]);

  const dismissNotif = (id) => 
    setNotifications(prev => prev.filter(n => n.id !== id));

  const byCategory = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return map;
  }, [expenses]);

  const addExpense = () => {
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) return;

    const newExpense = {
      id: Date.now(),
      amount: Number(form.amount),
      category: form.category,
      note: form.note.trim(),
      date: new Date().toLocaleDateString("en-ZA")
    };

    setExpenses([newExpense, ...expenses]);
    setForm({ amount: "", category: "food", note: "" });
    setShowForm(false);
  };

  const statusColor = pct < 60 ? "bg-emerald-600" : pct < 85 ? "bg-amber-600" : "bg-red-600";

  const discounts = isPremium ? PREMIUM_DISCOUNTS : FREE_DISCOUNTS;
  const recipes = isPremium ? PREMIUM_RECIPES : FREE_RECIPES;

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A18]">
      <NotificationBanner notifications={notifications} onDismiss={dismissNotif} />

      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onSubscribe={() => setIsPremium(true)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 bg-white border-b z-40">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-baseline gap-2">
              <span className="serif text-2xl tracking-tight">studentwise</span>
              <span className="text-xs text-gray-400">for SA students</span>
            </div>

            {isPremium ? (
              <span className="px-4 py-1.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                Premium
              </span>
            ) : (
              <button
                onClick={() => setShowPaywall(true)}
                className="bg-black hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl transition"
              >
                Upgrade • R49/mo
              </button>
            )}
          </div>

          <nav className="flex gap-8 -mb-px">
            {[
              { id: "budget", label: "Budget" },
              { id: "discounts", label: "Discounts" },
              { id: "recipes", label: "Recipes" },
              { id: "habits", label: "Habits" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-8 pb-20">
        {/* ====================== BUDGET TAB ====================== */}
        {tab === "budget" && (
          <div>
            {!budgetSet ? (
              <div className="text-center py-16">
                <h1 className="serif text-4xl mb-4">Set your monthly budget</h1>
                <p className="text-gray-600 mb-10 max-w-xs mx-auto">
                  Your budget is saved locally on this device
                </p>
                <div className="max-w-xs mx-auto flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">R</span>
                    <input
                      type="number"
                      placeholder="3000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && budget && setBudgetSet(true)}
                      className="w-full border border-gray-300 rounded-2xl pl-10 py-4 text-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  <button
                    onClick={() => budget && setBudgetSet(true)}
                    className="bg-black text-white px-8 rounded-2xl font-semibold"
                  >
                    Start
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Overview Card */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-8">
                  <div className="flex justify-between mb-8">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">Remaining</p>
                      <p className={`serif text-5xl mt-2 ${remaining < 0 ? "text-red-600" : ""}`}>
                        {formatZAR(Math.max(remaining ?? 0, 0))}
                      </p>
                      {remaining < 0 && (
                        <p className="text-red-600 text-sm mt-1">
                          Over by {formatZAR(Math.abs(remaining))}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Spent</p>
                      <p className="text-2xl font-semibold mt-1">{formatZAR(totalSpent)}</p>
                      <p className="text-sm text-gray-500">of {formatZAR(Number(budget))}</p>
                    </div>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${statusColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <span>{Math.round(pct)}% used</span>
                    {pct >= 80 && <span className="text-amber-600 font-medium">Getting tight</span>}
                  </div>
                </div>

                {/* Category Breakdown */}
                {Object.keys(byCategory).length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-8">
                    <h3 className="font-semibold mb-6">Spending by category</h3>
                    {CATEGORIES.filter(c => byCategory[c.id]).map(cat => {
                      const amount = byCategory[cat.id] || 0;
                      const percentage = Math.round((amount / totalSpent) * 100);
                      return (
                        <div key={cat.id} className="mb-6 last:mb-0">
                          <div className="flex justify-between text-sm mb-2">
                            <span>{cat.label}</span>
                            <span>{formatZAR(amount)} <span className="text-gray-400">({percentage}%)</span></span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full">
                            <div
                              className="h-1.5 rounded-full"
                              style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Expenses List */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Recent Expenses ({expenses.length})</h3>
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-black text-white px-5 py-2.5 rounded-2xl text-sm font-medium"
                  >
                    + Add Expense
                  </button>
                </div>

                {showForm && (
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-6">
                    {/* Form fields here - you can expand if needed */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">R</span>
                        <input
                          type="number"
                          placeholder="Amount"
                          value={form.amount}
                          onChange={(e) => setForm({ ...form, amount: e.target.value })}
                          className="w-full border border-gray-300 rounded-2xl pl-10 py-4"
                        />
                      </div>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="border border-gray-300 rounded-2xl px-4 py-4"
                      >
                        {CATEGORIES.map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="Note (optional)"
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      className="w-full border border-gray-300 rounded-2xl px-5 py-4 mb-4"
                    />

                    <div className="flex gap-3">
                      <button onClick={addExpense} className="flex-1 bg-black text-white py-4 rounded-2xl font-medium">
                        Add Expense
                      </button>
                      <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 py-4 rounded-2xl">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {expenses.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    No expenses yet. Add your first one above.
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-3xl divide-y">
                    {expenses.map((e) => {
                      const cat = CATEGORIES.find(c => c.id === e.category);
                      return (
                        <div key={e.id} className="flex items-center justify-between p-6">
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">{cat?.label?.slice(0, 1)}</div>
                            <div>
                              <p className="font-medium">{e.note || cat?.label}</p>
                              <p className="text-xs text-gray-500">{e.date} • {cat?.label}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-semibold text-lg">{formatZAR(e.amount)}</p>
                            <button
                              onClick={() => setExpenses(expenses.filter(x => x.id !== e.id))}
                              className="text-gray-300 hover:text-red-600 text-2xl"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={() => {
                    setBudgetSet(false);
                    setBudget("");
                    setExpenses([]);
                    setNotifiedLevels({});
                  }}
                  className="text-red-600 text-sm mt-8 mx-auto block hover:underline"
                >
                  Reset Budget
                </button>
              </>
            )}
          </div>
        )}

        {/* ====================== DISCOUNTS TAB ====================== */}
        {tab === "discounts" && (
          <div>
            <h1 className="serif text-4xl mb-2">Student Discounts</h1>
            <p className="text-gray-600 mb-8">
              {isPremium 
                ? `${discounts.length} deals available` 
                : `${FREE_DISCOUNTS.length} free • ${PREMIUM_DISCOUNTS.length - FREE_DISCOUNTS.length} more with Premium`}
            </p>

            <div className="space-y-4">
              {discounts.map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-3xl p-7">
                  <div className="flex justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl">{d.store}</h3>
                      <p className="mt-2 text-gray-600">{d.deal}</p>
                      <span className="inline-block mt-4 text-xs px-4 py-2 bg-gray-100 rounded-full">
                        {d.category}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="uppercase text-[10px] tracking-widest text-gray-400 mb-1">Code</p>
                      <p className="font-mono bg-gray-100 px-5 py-3 rounded-2xl text-sm font-medium">
                        {d.code}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!isPremium && (
              <PremiumGate
                label={`Unlock ${PREMIUM_DISCOUNTS.length - FREE_DISCOUNTS.length} more exclusive deals`}
                onUpgrade={() => setShowPaywall(true)}
              />
            )}
          </div>
        )}

        {/* ====================== RECIPES TAB ====================== */}
        {tab === "recipes" && (
          <div>
            <h1 className="serif text-4xl mb-2">Cheap Student Recipes</h1>
            <p className="text-gray-600 mb-8">All meals under R50</p>

            <div className="space-y-6">
              {recipes.map((r, i) => (
                <RecipeCard key={i} recipe={r} />
              ))}
            </div>

            {!isPremium && (
              <PremiumGate
                label={`Unlock ${PREMIUM_RECIPES.length - FREE_RECIPES.length} more recipes`}
                onUpgrade={() => setShowPaywall(true)}
              />
            )}
          </div>
        )}

        {/* ====================== HABITS TAB ====================== */}
        {tab === "habits" && (
          <div>
            <h1 className="serif text-4xl mb-3">Money Habits</h1>
            <p className="text-gray-600 mb-10">Small changes that add up</p>

            <div className="space-y-5">
              {HABITS.map((h, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-3xl p-8">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg">{h.title}</h3>
                    <span className="text-xs px-4 py-2 bg-gray-100 rounded-full">{h.tag}</span>
                  </div>
                  <p className="mt-4 leading-relaxed text-gray-600">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
