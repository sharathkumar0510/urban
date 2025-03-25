import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { withErrorHandling } from "@/api/middleware/error-handling";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createClient();
  const searchParams = req.nextUrl.searchParams;
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const location = searchParams.get("location");
  const featured = searchParams.get("featured");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const limit = searchParams.get("limit") || "20";
  const page = searchParams.get("page") || "1";

  // Calculate offset for pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Start building the query
  let query = supabase
    .from("services")
    .select(
      `
      *,
      subcategory:subcategories(id, name, slug, category_id, category:categories(id, name, slug)),
      vendor:vendor_profiles(id, business_name, business_logo, avg_rating, total_reviews),
      service_features(*),
      service_locations(*),
      service_images(*)
      `,
      { count: "exact" },
    )
    .eq("is_active", true);

  // Apply filters
  if (category) {
    // Handle case sensitivity for category slugs
    query = query.or(`subcategory.category.slug.eq.${category}`);
  }

  if (subcategory) {
    // Filter by subcategory using contains filter
    query = query.ilike("subcategory.name", `%${subcategory}%`);
  }

  if (location) {
    // Use proper filter syntax for location search
    query = query.or(
      `service_locations.city.ilike.%${location}%,service_locations.state.ilike.%${location}%`,
    );
  }

  // Debug the query
  console.log("Final Query:", query);

  if (featured === "true") {
    query = query.eq("is_featured", true);
  }

  if (minPrice) {
    query = query.gte("starting_price", parseFloat(minPrice));
  }

  if (maxPrice) {
    query = query.lte("starting_price", parseFloat(maxPrice));
  }

  if (minRating) {
    query = query.gte("avg_rating", parseFloat(minRating));
  }

  // Apply pagination
  query = query.range(offset, offset + parseInt(limit) - 1);

  // Execute the query
  const { data: services, error, count } = await query;

  if (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform the data to match the expected format
  const transformedServices = services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    startingPrice: service.starting_price,
    image: service.image_url || service.service_images?.[0]?.image_url,
    category: service.subcategory?.category?.name,
    categorySlug: service.subcategory?.category?.slug,
    subcategory: service.subcategory?.name,
    subcategorySlug: service.subcategory?.slug,
    features: service.service_features?.map((feature) => feature.name) || [],
    duration: service.duration,
    rating: service.avg_rating,
    reviewCount: service.total_reviews,
    locations: service.service_locations?.map(
      (location) => `${location.city}, ${location.state}`,
    ),
    vendor: {
      id: service.vendor?.id,
      name: service.vendor?.business_name,
      logo: service.vendor?.business_logo,
      rating: service.vendor?.avg_rating,
      reviewCount: service.vendor?.total_reviews,
    },
    images: service.service_images?.map((image) => image.image_url) || [],
    isFeatured: service.is_featured,
  }));

  return NextResponse.json({
    services: transformedServices,
    count,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil((count || 0) / parseInt(limit)),
  });
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if the user is a vendor
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "vendor") {
    return NextResponse.json(
      { error: "Only vendors can create services" },
      { status: 403 },
    );
  }

  // Parse the request body
  const body = await req.json();

  // Validate required fields
  const requiredFields = ["name", "subcategoryId", "startingPrice"];
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 },
      );
    }
  }

  // Create the service
  const { data: service, error } = await supabase
    .from("services")
    .insert({
      vendor_id: user.id,
      subcategory_id: body.subcategoryId,
      name: body.name,
      description: body.description,
      short_description: body.shortDescription,
      image_url: body.imageUrl,
      starting_price: body.startingPrice,
      duration: body.duration,
      is_featured: body.isFeatured || false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Add service features if provided
  if (body.features && body.features.length > 0) {
    const featuresData = body.features.map((feature: any) => ({
      service_id: service.id,
      name: feature.name,
      description: feature.description,
      is_included: feature.isIncluded !== false,
    }));

    const { error: featuresError } = await supabase
      .from("service_features")
      .insert(featuresData);

    if (featuresError) {
      console.error("Error adding service features:", featuresError);
    }
  }

  // Add service locations if provided
  if (body.locations && body.locations.length > 0) {
    const locationsData = body.locations.map((location: any) => ({
      service_id: service.id,
      city: location.city,
      state: location.state,
      zip_code: location.zipCode,
    }));

    const { error: locationsError } = await supabase
      .from("service_locations")
      .insert(locationsData);

    if (locationsError) {
      console.error("Error adding service locations:", locationsError);
    }
  }

  // Add service images if provided
  if (body.images && body.images.length > 0) {
    const imagesData = body.images.map((imageUrl: string, index: number) => ({
      service_id: service.id,
      image_url: imageUrl,
      display_order: index,
    }));

    const { error: imagesError } = await supabase
      .from("service_images")
      .insert(imagesData);

    if (imagesError) {
      console.error("Error adding service images:", imagesError);
    }
  }

  return NextResponse.json({
    service: {
      id: service.id,
      name: service.name,
      description: service.description,
      startingPrice: service.starting_price,
      image: service.image_url,
      duration: service.duration,
      isFeatured: service.is_featured,
    },
  });
});

export const PUT = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse the request body
  const body = await req.json();

  if (!body.id) {
    return NextResponse.json(
      { error: "Service ID is required" },
      { status: 400 },
    );
  }

  // Check if the service exists and belongs to the user
  const { data: existingService, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .eq("id", body.id)
    .eq("vendor_id", user.id)
    .single();

  if (serviceError || !existingService) {
    return NextResponse.json(
      { error: "Service not found or you don't have permission to update it" },
      { status: 404 },
    );
  }

  // Update the service
  const { data: service, error } = await supabase
    .from("services")
    .update({
      name: body.name || existingService.name,
      description:
        body.description !== undefined
          ? body.description
          : existingService.description,
      short_description:
        body.shortDescription !== undefined
          ? body.shortDescription
          : existingService.short_description,
      image_url:
        body.imageUrl !== undefined ? body.imageUrl : existingService.image_url,
      starting_price: body.startingPrice || existingService.starting_price,
      duration:
        body.duration !== undefined ? body.duration : existingService.duration,
      is_active:
        body.isActive !== undefined ? body.isActive : existingService.is_active,
      is_featured:
        body.isFeatured !== undefined
          ? body.isFeatured
          : existingService.is_featured,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update service features if provided
  if (body.features) {
    // Delete existing features
    await supabase.from("service_features").delete().eq("service_id", body.id);

    // Add new features
    if (body.features.length > 0) {
      const featuresData = body.features.map((feature: any) => ({
        service_id: service.id,
        name: feature.name,
        description: feature.description,
        is_included: feature.isIncluded !== false,
      }));

      await supabase.from("service_features").insert(featuresData);
    }
  }

  // Update service locations if provided
  if (body.locations) {
    // Delete existing locations
    await supabase.from("service_locations").delete().eq("service_id", body.id);

    // Add new locations
    if (body.locations.length > 0) {
      const locationsData = body.locations.map((location: any) => ({
        service_id: service.id,
        city: location.city,
        state: location.state,
        zip_code: location.zipCode,
      }));

      await supabase.from("service_locations").insert(locationsData);
    }
  }

  // Update service images if provided
  if (body.images) {
    // Delete existing images
    await supabase.from("service_images").delete().eq("service_id", body.id);

    // Add new images
    if (body.images.length > 0) {
      const imagesData = body.images.map((imageUrl: string, index: number) => ({
        service_id: service.id,
        image_url: imageUrl,
        display_order: index,
      }));

      await supabase.from("service_images").insert(imagesData);
    }
  }

  return NextResponse.json({
    service: {
      id: service.id,
      name: service.name,
      description: service.description,
      startingPrice: service.starting_price,
      image: service.image_url,
      duration: service.duration,
      isActive: service.is_active,
      isFeatured: service.is_featured,
    },
  });
});

export const DELETE = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the service ID from the URL
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Service ID is required" },
      { status: 400 },
    );
  }

  // Check if the service exists and belongs to the user
  const { data: existingService, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .eq("vendor_id", user.id)
    .single();

  if (serviceError || !existingService) {
    return NextResponse.json(
      { error: "Service not found or you don't have permission to delete it" },
      { status: 404 },
    );
  }

  // Delete the service
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
});
