import { Suspense } from "react";
import { notFound } from "next/navigation";
import CategoryPage from "@/modules/services/components/category-page";
import MainNavbar from "@/modules/layout/components/main-navbar";
import MainFooter from "@/modules/layout/components/main-footer";

export default async function ServiceCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <MainNavbar />
      <div className="container mx-auto py-8 px-4">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-36 bg-gray-200 rounded"></div>
              </div>
            </div>
          }
        >
          <CategoryPage category={category} />
        </Suspense>
      </div>
      <MainFooter />
    </div>
  );
}
