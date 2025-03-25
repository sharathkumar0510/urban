export async function fetchServices(
  category?: string,
  location?: string,
  filters?: Record<string, any>,
) {
  try {
    let url = "/api/services";
    const params = new URLSearchParams();

    if (category) {
      params.append("category", category);
    }

    if (location) {
      params.append("location", location);
    }

    // Add additional filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log("Fetching services with URL:", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

export async function fetchServiceById(id: string) {
  try {
    const response = await fetch(`/api/services/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch service");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    throw error;
  }
}

export async function fetchCategories() {
  try {
    const response = await fetch("/api/categories");

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function fetchSubcategories(
  categoryId?: string,
  categorySlug?: string,
) {
  try {
    const params = new URLSearchParams();

    if (categoryId) {
      params.append("categoryId", categoryId);
    }

    if (categorySlug) {
      params.append("categorySlug", categorySlug);
    }

    let url = "/api/subcategories";
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch subcategories");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
}

export async function createService(serviceData: any) {
  try {
    const response = await fetch("/api/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create service");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

export async function updateService(serviceId: string, serviceData: any) {
  try {
    const response = await fetch("/api/services", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: serviceId, ...serviceData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update service");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

export async function deleteService(serviceId: string) {
  try {
    const response = await fetch(`/api/services?id=${serviceId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete service");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}

export async function fetchServiceReviews(serviceId: string) {
  try {
    const response = await fetch(`/api/reviews?serviceId=${serviceId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch service reviews");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching reviews for service ${serviceId}:`, error);
    throw error;
  }
}

export async function submitServiceReview(reviewData: any) {
  try {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit review");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
}
