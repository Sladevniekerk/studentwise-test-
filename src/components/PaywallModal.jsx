import { useState } from "react";

const PLAN_PRICE = 49;

export default function PaywallModal({ onClose, onSubscribe }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDemo = () => {
    setLoading(true);
    setTimeout(() => {
      onSubscribe();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-3xl text-gray-300 hover:text-gray-500"
        >
          ×
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center text-4xl mb-4">
            ✨
          </div>
          <h2 className="serif text-3xl mb-2">Go Premium</h2>
          <p className="text-gray-600">Unlock full discounts &amp; recipes</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-5">
          {[
            ["Full discount directory", "20+ exclusive SA student deals"],
            ["Premium student recipes", "All meals under R50"],
            ["Budget alerts", "Never overspend again"],
          ].map(([title, desc]) => (
            <div key={title} className="flex gap-4">
              <span className="text-emerald-600 text-xl">✓</span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <span className="serif text-4xl font-medium">R{PLAN_PRICE}</span>
          <span className="text-gray-500"> / month</span>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-black"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-black"
          />

          <button
            onClick={handleDemo}
            disabled={loading || !name || !email}
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
          >
            {loading ? "Activating Premium..." : "Demo: Activate Premium"}
          </button>

          <p className="text-center text-[10px] text-gray-400">
            Demo mode • Replace with real PayFast later
          </p>
        </div>
      </div>
    </div>
  );
}
