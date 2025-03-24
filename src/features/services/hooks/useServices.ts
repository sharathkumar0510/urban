import { useState, useEffect } from "react";
import { fetchServices } from "../api/servicesApi";
import { Service } from "@/types/models/Service";

export function useServices(category?: string, location?: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const { services } = await fetchServices(category, location);
        setServices(services);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, [category, location]);

  return { services, loading, error };
}
