"use client";

import { useEffect, useState } from "react";
import SubcategoryListDynamic from "./subcategory-list-dynamic";
import FilteredServiceList from "./filtered-service-list";
import { Service } from "@/types/models/Service";

interface CategoryPageProps {
  category: string;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("price-low");
  const [priceFilter, setPriceFilter] = useState<number>(500);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        setLoading(true);
        console.log(`Fetching data for category: ${category}`);

        // First fetch category details to get proper subcategories
        const categoriesResponse = await fetch(`/api/categories`);
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        console.log("Categories data:", categoriesData);

        // Find the current category and its subcategories
        const currentCategory = categoriesData.categories.find(
          (cat: any) => cat.slug === category,
        );

        console.log("Current category:", currentCategory);

        if (
          currentCategory &&
          currentCategory.subcategories &&
          currentCategory.subcategories.length > 0
        ) {
          const subcatNames = currentCategory.subcategories
            .map((subcat: any) => subcat.name || "")
            .filter((name) => name !== "");
          setSubcategories(subcatNames);

          // Set first subcategory as selected by default if available and none is selected
          if (subcatNames.length > 0 && !selectedSubcategory) {
            setSelectedSubcategory(subcatNames[0]);
          }
        } else {
          // If no subcategories found, fetch all services for the category
          console.log(
            "No subcategories found, fetching all services for category",
          );
          setSubcategories([]);
        }

        // Then fetch services for the category or selected subcategory directly from API
        let url = `/api/services?category=${category}`;
        if (selectedSubcategory) {
          url += `&subcategory=${encodeURIComponent(selectedSubcategory)}`;
        }
        if (priceFilter < 500) {
          url += `&maxPrice=${priceFilter}`;
        }
        if (ratingFilter) {
          url += `&minRating=${ratingFilter}`;
        }

        console.log("Fetching services from URL:", url);
        const servicesResponse = await fetch(url);
        if (!servicesResponse.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await servicesResponse.json();

        console.log("Services data:", data);

        if (data && data.services) {
          setServices(data.services);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesData();
  }, [category, priceFilter, ratingFilter, selectedSubcategory]);

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handlePriceFilterChange = (price: number) => {
    setPriceFilter(price);
  };

  const handleRatingFilterChange = (rating: number | null) => {
    setRatingFilter(rating);
  };

  const categoryDisplayName =
    category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");

  // Services are already filtered by the API call
  let filteredServices = services;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {categoryDisplayName} Services
          </h1>
          <p className="text-gray-600">
            Find trusted professionals for your{" "}
            {categoryDisplayName.toLowerCase()} needs
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar */}
          <div className="w-full md:w-1/4">
            <SubcategoryListDynamic
              mainCategory={category}
              subcategories={subcategories}
              selectedSubcategory={selectedSubcategory}
              onSubcategorySelect={handleSubcategorySelect}
              onPriceChange={handlePriceFilterChange}
              onRatingChange={handleRatingFilterChange}
              currentPrice={priceFilter}
              currentRating={ratingFilter}
            />
          </div>

          {/* Main content */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewModeChange("grid")}
                  className={`flex items-center justify-center w-12 h-10 rounded ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-2 h-2 bg-current rounded-sm"></div>
                    <div className="w-2 h-2 bg-current rounded-sm"></div>
                    <div className="w-2 h-2 bg-current rounded-sm"></div>
                    <div className="w-2 h-2 bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => handleViewModeChange("list")}
                  className={`flex items-center justify-center w-12 h-10 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  <div className="flex flex-col gap-1 items-start">
                    <div className="w-4 h-1 bg-current rounded-sm"></div>
                    <div className="w-4 h-1 bg-current rounded-sm"></div>
                    <div className="w-4 h-1 bg-current rounded-sm"></div>
                  </div>
                </button>
              </div>

              <div className="flex items-center">
                <span className="mr-2 text-gray-700">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="newest">Newest</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <FilteredServiceList
              services={filteredServices}
              selectedSubcategory={selectedSubcategory}
              viewMode={viewMode}
              sortBy={sortBy}
              loading={loading}
              onSubcategorySelect={handleSubcategorySelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
