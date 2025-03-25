import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { withErrorHandling } from "@/api/middleware/error-handling";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select(
      `*, 
      subcategories:subcategories(id, name, slug, service_count)
    `,
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform the data to match the expected format
  const transformedCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon,
    imageUrl: category.image_url,
    slug: category.slug,
    displayOrder: category.display_order,
    serviceCount: category.service_count || 0,
    subcategories: category.subcategories
      ? category.subcategories.map((subcat: any) => ({
          id: subcat.id,
          name: subcat.name,
          slug: subcat.slug,
          count: subcat.service_count || 0,
        }))
      : [],
  }));

  return NextResponse.json({ categories: transformedCategories });
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

  // Check if the user is an admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json(
      { error: "Only admins can create categories" },
      { status: 403 },
    );
  }

  // Parse the request body
  const body = await req.json();

  // Validate required fields
  if (!body.name || !body.slug) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 },
    );
  }

  // Create the category
  const { data: category, error } = await supabase
    .from("categories")
    .insert({
      name: body.name,
      description: body.description,
      icon: body.icon,
      image_url: body.imageUrl,
      slug: body.slug,
      display_order: body.displayOrder || 0,
      is_active: body.isActive !== false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    category: {
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      imageUrl: category.image_url,
      slug: category.slug,
      displayOrder: category.display_order,
      isActive: category.is_active,
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

  // Check if the user is an admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json(
      { error: "Only admins can update categories" },
      { status: 403 },
    );
  }

  // Parse the request body
  const body = await req.json();

  if (!body.id) {
    return NextResponse.json(
      { error: "Category ID is required" },
      { status: 400 },
    );
  }

  // Update the category
  const { data: category, error } = await supabase
    .from("categories")
    .update({
      name: body.name,
      description: body.description,
      icon: body.icon,
      image_url: body.imageUrl,
      slug: body.slug,
      display_order: body.displayOrder,
      is_active: body.isActive,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    category: {
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      imageUrl: category.image_url,
      slug: category.slug,
      displayOrder: category.display_order,
      isActive: category.is_active,
    },
  });
});
