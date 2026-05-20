import { useState } from "react";

export default function RecipeCard({ recipe }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div
        className="p-5 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{recipe.name}</h3>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                {recipe.cost}
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                {recipe.time}
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                {recipe.serves} servings
              </span>
            </div>
          </div>
          <span className={`text-2xl transition-transform ${open ? "rotate-180" : ""}`}>›</span>
        </div>
      </div>

      {open && (
        <div className="px-5 pb-6 border-t">
          <p className="uppercase text-xs font-semibold text-gray-500 mt-5 mb-2">Ingredients</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>

          <p className="uppercase text-xs font-semibold text-gray-500 mt-6 mb-3">Method</p>
          <div className="space-y-4">
            {recipe.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
