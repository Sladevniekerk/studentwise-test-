export default function PremiumGate({ label, onUpgrade }) {
  return (
    <button
      onClick={onUpgrade}
      className="w-full flex items-center gap-3 bg-[#FAFAF8] border border-dashed border-gray-300 hover:border-gray-400 transition-colors rounded-2xl p-5 text-left"
    >
      <div className="text-2xl">🔓</div>
      <div className="flex-1">
        <p className="font-medium text-gray-700">{label}</p>
      </div>
      <span className="bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full">
        Premium
      </span>
    </button>
  );
}
