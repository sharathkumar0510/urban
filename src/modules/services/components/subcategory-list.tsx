import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SubcategoryListProps {
  mainCategory: string;
  subcategories: string[];
  selectedSubcategory: string | null;
  onSubcategorySelect: (subcategory: string) => void;
  onPriceChange?: (price: number) => void;
  onRatingChange?: (rating: number | null) => void;
  currentPrice?: number;
  currentRating?: number | null;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  count: number;
  id: string;
  subcategories: { name: string; count: number }[];
}

export default function SubcategoryList({
  mainCategory,
  subcategories,
  selectedSubcategory,
  onSubcategorySelect,
  onPriceChange,
  onRatingChange,
  currentPrice = 500,
  currentRating = null,
}: SubcategoryListProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    mainCategory,
  ]);
  const [priceRange, setPriceRange] = useState<number>(currentPrice);

  const mainCategoryDisplayName =
    mainCategory.charAt(0).toUpperCase() +
    mainCategory.slice(1).replace(/-/g, " ");

  // All available categories with predefined subcategories
  const allCategories: Category[] = [
    {
      name: "Beauty & Wellness",
      icon: "💆",
      count: 245,
      id: "beauty",
      subcategories: [
        { name: "Hair Styling", count: 78 },
        { name: "Massage", count: 56 },
        { name: "Nail Care", count: 42 },
        { name: "Facial", count: 38 },
        { name: "Spa", count: 31 },
        { name: "Makeup", count: 25 },
        { name: "Waxing", count: 22 },
      ],
    },
    {
      name: "Home Repairs",
      icon: "🔧",
      count: 189,
      id: "home-repairs",
      subcategories: [
        { name: "Furniture Assembly", count: 45 },
        { name: "Door & Window", count: 38 },
        { name: "Drywall", count: 32 },
        { name: "Flooring", count: 42 },
        { name: "General Repairs", count: 32 },
        { name: "Painting", count: 28 },
        { name: "Carpentry", count: 24 },
      ],
    },
    {
      name: "AC Services",
      icon: "❄️",
      count: 156,
      id: "hvac",
      subcategories: [
        { name: "Installation", count: 42 },
        { name: "Maintenance", count: 58 },
        { name: "Repair", count: 36 },
        { name: "Duct Cleaning", count: 20 },
        { name: "Filter Replacement", count: 18 },
        { name: "Refrigerant Recharge", count: 15 },
        { name: "Smart Thermostat", count: 12 },
      ],
    },
    {
      name: "Cleaning",
      icon: "🧹",
      count: 234,
      id: "cleaning",
      subcategories: [
        { name: "Home Cleaning", count: 87 },
        { name: "Deep Cleaning", count: 45 },
        { name: "Move-in/out", count: 32 },
        { name: "Carpet Cleaning", count: 38 },
        { name: "Window Cleaning", count: 32 },
        { name: "Office Cleaning", count: 28 },
        { name: "Post-Construction", count: 22 },
      ],
    },
    {
      name: "Electrical",
      icon: "⚡",
      count: 167,
      id: "electrical",
      subcategories: [
        { name: "Wiring", count: 42 },
        { name: "Lighting", count: 56 },
        { name: "Outlets & Switches", count: 38 },
        { name: "Panel Upgrades", count: 31 },
        { name: "Ceiling Fans", count: 28 },
        { name: "Smart Home", count: 24 },
        { name: "Troubleshooting", count: 20 },
      ],
    },
    {
      name: "Plumbing",
      icon: "🚿",
      count: 178,
      id: "plumbing",
      subcategories: [
        { name: "Leak Repair", count: 48 },
        { name: "Drain Cleaning", count: 52 },
        { name: "Fixture Installation", count: 38 },
        { name: "Water Heater", count: 40 },
        { name: "Toilet Repair", count: 35 },
        { name: "Pipe Replacement", count: 30 },
        { name: "Sump Pump", count: 25 },
      ],
    },
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseInt(e.target.value);
    setPriceRange(newPrice);
    if (onPriceChange) {
      onPriceChange(newPrice);
    }
  };

  const handleRatingChange = (rating: number | null) => {
    if (onRatingChange) {
      onRatingChange(rating === currentRating ? null : rating);
    }
  };

  // Find the current category to display its predefined subcategories
  const currentCategory = allCategories.find((cat) => cat.id === mainCategory);

  // Log for debugging
  console.log("Current category:", mainCategory);
  console.log("Available subcategories:", subcategories);
  console.log("Current category object:", currentCategory);

  // Map API subcategories to our predefined ones if possible
  const mappedSubcategories = subcategories.map((subcat) => {
    // Try to find a matching predefined subcategory
    const category = allCategories.find((cat) => cat.id === mainCategory);
    if (category) {
      const match = category.subcategories.find(
        (s) =>
          s.name.toLowerCase() === subcat.toLowerCase() ||
          s.name.toLowerCase().includes(subcat.toLowerCase()) ||
          subcat.toLowerCase().includes(s.name.toLowerCase()),
      );
      if (match) {
        return match.name;
      }
    }
    return subcat;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold p-4 border-b border-gray-200">
        Categories
      </h2>

      <div className="divide-y divide-gray-200">
        {allCategories.map((category) => (
          <div key={category.id} className="py-2 px-4">
            <div
              className={`flex items-center justify-between py-2 cursor-pointer ${category.id === mainCategory ? "font-medium text-blue-600" : ""}`}
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center">
                <span className="mr-2">{category.icon}</span>
                <span>{category.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-2">
                  {category.count}
                </span>
                {expandedCategories.includes(category.id) ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>

            {/* Subcategories - show predefined subcategories for all categories */}
            {expandedCategories.includes(category.id) && (
              <div className="ml-6 mt-1 space-y-1">
                {category.id === mainCategory
                  ? subcategories.length > 0
                    ? subcategories.map((subcatName) => {
                        // Find matching predefined subcategory if possible
                        const predefinedSubcat = category.subcategories.find(
                          (s) =>
                            s.name.toLowerCase() === subcatName.toLowerCase() ||
                            s.name
                              .toLowerCase()
                              .includes(subcatName.toLowerCase()) ||
                            subcatName
                              .toLowerCase()
                              .includes(s.name.toLowerCase()),
                        ) || { name: subcatName, count: 0 };

                        return (
                          <div
                            key={subcatName}
                            onClick={() => onSubcategorySelect(subcatName)}
                            className={`flex items-center justify-between py-1.5 px-2 rounded cursor-pointer transition-colors ${selectedSubcategory === subcatName ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`}
                          >
                            <span
                              className={
                                selectedSubcategory === subcatName
                                  ? "font-medium"
                                  : ""
                              }
                            >
                              {subcatName}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {predefinedSubcat.count || "—"}
                            </span>
                          </div>
                        );
                      })
                    : category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory.name}
                          onClick={() => onSubcategorySelect(subcategory.name)}
                          className={`flex items-center justify-between py-1.5 px-2 rounded cursor-pointer transition-colors ${selectedSubcategory === subcategory.name ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`}
                        >
                          <span
                            className={
                              selectedSubcategory === subcategory.name
                                ? "font-medium"
                                : ""
                            }
                          >
                            {subcategory.name}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {subcategory.count}
                          </span>
                        </div>
                      ))
                  : category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.name}
                        className="flex items-center justify-between py-1.5 px-2 rounded cursor-pointer transition-colors hover:bg-gray-50"
                        onClick={() => {
                          // Find the category in allCategories and set it as the main category
                          const targetCategory = allCategories.find(
                            (c) => c.id === category.id,
                          );
                          if (targetCategory) {
                            // This would require adding a prop for changing the main category
                            // For now, we'll just navigate to the category page
                            window.location.href = `/services/${category.id}`;
                          }
                        }}
                      >
                        <span>{subcategory.name}</span>
                        <span className="text-gray-500 text-xs">
                          {subcategory.count}
                        </span>
                      </div>
                    ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="font-medium mb-3">Price Range</h3>
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange}
          onChange={handlePriceRangeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">$0</span>
          <span className="text-sm text-gray-600">${priceRange}</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="font-medium mb-3">Rating</h3>
        <div className="space-y-3">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleRatingChange(5)}
          >
            <input
              type="checkbox"
              id="rating-5"
              className="mr-2"
              checked={currentRating === 5}
              readOnly
            />
            <label
              htmlFor="rating-5"
              className="flex items-center cursor-pointer"
            >
              <div className="flex text-yellow-400">★★★★★</div>
              <span className="ml-2 text-sm">& Up</span>
            </label>
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleRatingChange(4)}
          >
            <input
              type="checkbox"
              id="rating-4"
              className="mr-2"
              checked={currentRating === 4}
              readOnly
            />
            <label
              htmlFor="rating-4"
              className="flex items-center cursor-pointer"
            >
              <div className="flex text-yellow-400">★★★★</div>
              <span className="text-gray-400">☆</span>
              <span className="ml-2 text-sm">& Up</span>
            </label>
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleRatingChange(3)}
          >
            <input
              type="checkbox"
              id="rating-3"
              className="mr-2"
              checked={currentRating === 3}
              readOnly
            />
            <label
              htmlFor="rating-3"
              className="flex items-center cursor-pointer"
            >
              <div className="flex text-yellow-400">★★★</div>
              <span className="text-gray-400">☆☆</span>
              <span className="ml-2 text-sm">& Up</span>
            </label>
          </div>
        </div>
      </div>

      {/* Availability Filter */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="font-medium mb-3">Availability</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input type="checkbox" id="available-now" className="mr-2" />
            <label
              htmlFor="available-now"
              className="flex items-center cursor-pointer text-sm"
            >
              Available Now
            </label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="available-today" className="mr-2" />
            <label
              htmlFor="available-today"
              className="flex items-center cursor-pointer text-sm"
            >
              Available Today
            </label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="available-weekend" className="mr-2" />
            <label
              htmlFor="available-weekend"
              className="flex items-center cursor-pointer text-sm"
            >
              Available This Weekend
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
