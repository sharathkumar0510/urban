"use client";

import { useState, useEffect } from "react";
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
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  image_url: string | null;
  display_order: number | null;
  is_active: boolean | null;
  subcategories: {
    id: string;
    name: string;
    slug: string;
    count?: number;
  }[];
}

export default function SubcategoryListDynamic({
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log("Fetching categories...");
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        console.log("Categories data:", data);

        // Categories already include subcategories from the API
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  // Find the current category
  const currentCategoryObj = categories.find(
    (cat) => cat.slug === mainCategory,
  );

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold p-4 border-b border-gray-200">
        Categories
      </h2>

      <div className="divide-y divide-gray-200">
        {categories.map((category) => (
          <div key={category.slug} className="py-2 px-4">
            <div
              className={`flex items-center justify-between py-2 cursor-pointer ${category.slug === mainCategory ? "font-medium text-blue-600" : ""}`}
              onClick={() => toggleCategory(category.slug)}
            >
              <div className="flex items-center">
                <span className="mr-2">{category.icon || "📁"}</span>
                <span>{category.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-2">
                  {category.subcategories?.length || 0}
                </span>
                {expandedCategories.includes(category.slug) ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>

            {/* Subcategories */}
            {expandedCategories.includes(category.slug) && (
              <div className="ml-6 mt-1 space-y-1">
                {/* Only show subcategories for the current category */}
                {category.slug === mainCategory && (
                  <>
                    {category.subcategories &&
                      category.subcategories.length > 0 && (
                        // Always use the subcategories from the category data
                        <>
                          {category.subcategories
                            .filter(
                              (subcategory) => subcategory && subcategory.name,
                            )
                            .map((subcategory) => (
                              <div
                                key={subcategory.id || subcategory.name}
                                onClick={() =>
                                  onSubcategorySelect(subcategory.name)
                                }
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
                                  {subcategory.count || 0}
                                </span>
                              </div>
                            ))}
                        </>
                      )}
                  </>
                )}

                {/* For other categories, show their subcategories as links to that category */}
                {category.slug !== mainCategory &&
                  category.subcategories?.map((subcategory) => (
                    <div
                      key={subcategory.name}
                      className="flex items-center justify-between py-1.5 px-2 rounded cursor-pointer transition-colors hover:bg-gray-50"
                      onClick={() => {
                        window.location.href = `/services/${category.slug}`;
                      }}
                    >
                      <span>{subcategory.name}</span>
                      <span className="text-gray-500 text-xs">
                        {subcategory.count || 0}
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
