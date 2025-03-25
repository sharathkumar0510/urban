import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { withErrorHandling } from "@/api/middleware/error-handling";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createClient();
  const searchParams = req.nextUrl.searchParams;
  const categoryId = searchParams.get("categoryId");
  const categorySlug = searchParams.get("categorySlug");

  let query = supabase
    .from("subcategories")
    .select(
      `
      *,
      category:categories(id, name, slug)
      `,
      { count: "exact" },
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (categorySlug) {
    query = query.eq("category.slug", categorySlug);
    console.log(`Filtering subcategories by category slug: ${categorySlug}`);
  }

  const { data: subcategories, error, count } = await query;

  if (error) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform the data to match the expected format
  const transformedSubcategories = subcategories.map((subcategory) => ({
    id: subcategory.id,
    name: subcategory.name,
    description: subcategory.description,
    icon: subcategory.icon,
    imageUrl: subcategory.image_url,
    slug: subcategory.slug,
    categoryId: subcategory.category_id,
    category: subcategory.category?.name,
    categorySlug: subcategory.category?.slug,
    displayOrder: subcategory.display_order,
  }));

  return NextResponse.json({
    subcategories: transformedSubcategories,
    count,
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

  // Check if the user is an admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json(
      { error: "Only admins can create subcategories" },
      { status: 403 },
    );
  }

  // Parse the request body
  const body = await req.json();

  // Validate required fields
  if (!body.name || !body.slug || !body.categoryId) {
    return NextResponse.json(
      { error: "Name, slug, and categoryId are required" },
      { status: 400 },
    );
  }

  // Create the subcategory
  const { data: subcategory, error } = await supabase
    .from("subcategories")
    .insert({
      name: body.name,
      description: body.description,
      icon: body.icon,
      image_url: body.imageUrl,
      slug: body.slug,
      category_id: body.categoryId,
      display_order: body.displayOrder || 0,
      is_active: body.isActive !== false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    subcategory: {
      id: subcategory.id,
      name: subcategory.name,
      description: subcategory.description,
      icon: subcategory.icon,
      imageUrl: subcategory.image_url,
      slug: subcategory.slug,
      categoryId: subcategory.category_id,
      displayOrder: subcategory.display_order,
      isActive: subcategory.is_active,
    },
  });
});
