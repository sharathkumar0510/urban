export async function fetchServices(category?: string, location?: string) {
  try {
    let url = "/api/services";
    const params = new URLSearchParams();

    if (category) {
      params.append("category", category);
    }

    if (location) {
      params.append("location", location);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

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
