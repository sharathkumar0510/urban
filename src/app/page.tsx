import { createClient } from "@/lib/supabase/server";
import MainNavbar from "@/modules/layout/components/main-navbar";
import MainFooter from "@/modules/layout/components/main-footer";
import HeroCarousel from "@/modules/home/components/hero-carousel";
import CtaSection from "@/modules/home/components/cta-section";
import ServiceList from "@/modules/services/components/service-list";
import FeatureList from "@/modules/services/components/feature-list";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <MainNavbar />

      <div className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Carousel */}
          <HeroCarousel />
        </div>
      </div>

      {/* Service Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <ServiceList />
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose HomeServices</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the highest quality home services
              with complete peace of mind
            </p>
          </div>

          <FeatureList />
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />

      <MainFooter />
    </div>
  );
}
