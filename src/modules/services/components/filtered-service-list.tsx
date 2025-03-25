import Image from "next/image";
import { Service } from "@/types/models/Service";

interface FilteredServiceListProps {
  services: Service[];
  selectedSubcategory: string | null;
  viewMode: "grid" | "list";
  sortBy: string;
  loading: boolean;
  onSubcategorySelect?: (subcategory: string) => void;
}

export default function FilteredServiceList({
  services,
  selectedSubcategory,
  viewMode,
  sortBy,
  loading,
  onSubcategorySelect,
}: FilteredServiceListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-100 rounded-lg p-6 h-64"
          ></div>
        ))}
      </div>
    );
  }

  // Extract all subcategories from services for tabs
  // Use a Set to ensure unique values
  const subcategories = Array.from(
    new Set(services.map((s) => s.subcategory).filter(Boolean)),
  );

  // Filter services by selected subcategory
  let filteredServices = services;
  if (selectedSubcategory) {
    filteredServices = services.filter(
      (service) => service.subcategory === selectedSubcategory,
    );
  }

  // Sort services based on sortBy value
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "price-low") {
      return (a.startingPrice || 0) - (b.startingPrice || 0);
    } else if (sortBy === "price-high") {
      return (b.startingPrice || 0) - (a.startingPrice || 0);
    } else if (sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    } else if (sortBy === "reviews") {
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    } else if (sortBy === "newest") {
      // Use created_at if available, otherwise use a consistent ordering
      if (a.created_at && b.created_at) {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return 0;
    }
    return 0;
  });

  if (sortedServices.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          No services found for the selected criteria.
        </p>
        <p className="text-gray-400 mt-2">
          Try adjusting your filters or selecting a different subcategory.
        </p>
      </div>
    );
  }

  // Generate star rating display from actual data
  const renderRating = (rating: number = 0, reviewCount: number = 0) => {
    return (
      <div className="flex items-center">
        <div className="flex text-yellow-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star}>
              {star <= Math.floor(rating)
                ? "★"
                : star - 0.5 <= rating
                  ? "★"
                  : "☆"}
            </span>
          ))}
        </div>
        <span className="ml-2 text-gray-600 text-sm">
          ({reviewCount} reviews)
        </span>
      </div>
    );
  };

  // Display subcategories at the top
  const renderSubcategoryTabs = () => {
    if (subcategories.length <= 1) return null;

    return (
      <div className="mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto pb-2 gap-2">
          {subcategories.map((subcat) => (
            <button
              key={subcat}
              className={`px-4 py-2 whitespace-nowrap ${selectedSubcategory === subcat ? "border-b-2 border-blue-600 text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}
              onClick={() => onSubcategorySelect && onSubcategorySelect(subcat)}
            >
              {subcat}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Subcategory tabs */}
      {renderSubcategoryTabs()}

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Showing 1-{sortedServices.length} of {sortedServices.length} results
        </p>
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm text-blue-600 font-medium mr-2">
            Quick filters:
          </span>
          <button className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100">
            Available Today
          </button>
          <button className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100">
            Top Rated
          </button>
          <button className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100">
            Special Offers
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 w-full">
                {service.isFeatured && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    Featured
                  </div>
                )}
                <Image
                  src={
                    service.image ||
                    `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(service.name)}`
                  }
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{service.name}</h3>
                <p className="text-gray-500 text-sm mb-1">
                  {service.subcategory}
                </p>
                <p className="text-gray-600 mb-2">{service.description}</p>
                {renderRating(service.rating || 0, service.reviewCount || 0)}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-blue-600 font-bold">
                    ${service.startingPrice}/hr
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex"
            >
              <div className="relative h-40 w-40 flex-shrink-0">
                {service.isFeatured && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    Featured
                  </div>
                )}
                <Image
                  src={
                    service.image ||
                    `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(service.name)}`
                  }
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex-grow">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{service.name}</h3>
                    <p className="text-gray-500 text-sm mb-1">
                      {service.subcategory}
                    </p>
                    <p className="text-gray-600 mb-2">{service.description}</p>
                    {renderRating(
                      service.rating || 0,
                      service.reviewCount || 0,
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-blue-600 font-bold block mb-2">
                      ${service.startingPrice}/hr
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <nav className="flex items-center space-x-2">
          <button className="px-3 py-1 rounded border hover:bg-gray-100">
            &lt; Previous
          </button>
          <button className="px-3 py-1 rounded border bg-blue-600 text-white">
            1
          </button>
          <button className="px-3 py-1 rounded border hover:bg-gray-100">
            2
          </button>
          <button className="px-3 py-1 rounded border hover:bg-gray-100">
            3
          </button>
          <button className="px-3 py-1 rounded border hover:bg-gray-100">
            Next &gt;
          </button>
        </nav>
      </div>
    </div>
  );
}
