import { createClient } from "@/lib/supabase/client";

export async function fetchCategories() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchCategories:", error);
    throw error;
  }
}

export async function fetchPromotionalBanners() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("promotional_banners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching promotional banners:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchPromotionalBanners:", error);
    throw error;
  }
}

export async function fetchValuePropositions() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("value_propositions")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching value propositions:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchValuePropositions:", error);
    throw error;
  }
}

export async function fetchSubcategories(categoryId?: string) {
  try {
    const supabase = createClient();
    let query = supabase
      .from("subcategories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching subcategories:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchSubcategories:", error);
    throw error;
  }
}

export async function fetchServices(
  subcategoryId?: string,
  featured?: boolean,
) {
  try {
    const supabase = createClient();
    let query = supabase
      .from("services")
      .select(
        `
        *,
        subcategory:subcategories(name, slug, category_id),
        vendor:vendor_profiles(id, business_name, business_logo, avg_rating, total_reviews)
      `,
      )
      .eq("is_active", true);

    if (subcategoryId) {
      query = query.eq("subcategory_id", subcategoryId);
    }

    if (featured) {
      query = query.eq("is_featured", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching services:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchServices:", error);
    throw error;
  }
}

export async function fetchServiceById(id: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("services")
      .select(
        `
        *,
        subcategory:subcategories(name, slug, category_id),
        vendor:vendor_profiles(id, business_name, business_logo, avg_rating, total_reviews)
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching service ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error in fetchServiceById:`, error);
    throw error;
  }
}
