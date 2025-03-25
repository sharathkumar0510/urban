"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../../../components/ui/carousel";
import { createClient } from "../../../lib/supabase/client";

type PromotionalBanner = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  display_order: number;
  is_active: boolean;
};

export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [promotions, setPromotions] = useState<PromotionalBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPromotionalBanners() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("promotional_banners")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) {
          console.error("Error fetching promotional banners:", error);
          // Fallback to default promotions if there's an error
          setPromotions([
            {
              id: "1",
              title: "Get 20% Off Your First Cleaning",
              description:
                "Professional home cleaning services starting at just $89",
              image_url:
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
              cta_text: "Book Now",
              cta_link: "/services/cleaning",
              display_order: 1,
              is_active: true,
            },
            {
              id: "2",
              title: "Emergency Plumbing Services",
              description:
                "Available 24/7 - Qualified plumbers at your door in 60 minutes or less",
              image_url:
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
              cta_text: "Book Now",
              cta_link: "/services/plumbing",
              display_order: 2,
              is_active: true,
            },
            {
              id: "3",
              title: "Electrical Safety Inspection",
              description:
                "Ensure your home is safe with our comprehensive electrical inspection",
              image_url:
                "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
              cta_text: "Book Now",
              cta_link: "/services/electrical",
              display_order: 3,
              is_active: true,
            },
          ]);
          return;
        }

        if (data && data.length > 0) {
          setPromotions(data);
        } else {
          // Fallback to default promotions if no data
          setPromotions([
            {
              id: "1",
              title: "Get 20% Off Your First Cleaning",
              description:
                "Professional home cleaning services starting at just $89",
              image_url:
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
              cta_text: "Book Now",
              cta_link: "/services/cleaning",
              display_order: 1,
              is_active: true,
            },
            {
              id: "2",
              title: "Emergency Plumbing Services",
              description:
                "Available 24/7 - Qualified plumbers at your door in 60 minutes or less",
              image_url:
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
              cta_text: "Book Now",
              cta_link: "/services/plumbing",
              display_order: 2,
              is_active: true,
            },
            {
              id: "3",
              title: "Electrical Safety Inspection",
              description:
                "Ensure your home is safe with our comprehensive electrical inspection",
              image_url:
                "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
              cta_text: "Book Now",
              cta_link: "/services/electrical",
              display_order: 3,
              is_active: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching promotional banners:", error);
        // Fallback to default promotions if there's an exception
        setPromotions([
          {
            id: "1",
            title: "Get 20% Off Your First Cleaning",
            description:
              "Professional home cleaning services starting at just $89",
            image_url:
              "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
            cta_text: "Book Now",
            cta_link: "/services/cleaning",
            display_order: 1,
            is_active: true,
          },
          {
            id: "2",
            title: "Emergency Plumbing Services",
            description:
              "Available 24/7 - Qualified plumbers at your door in 60 minutes or less",
            image_url:
              "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
            cta_text: "Book Now",
            cta_link: "/services/plumbing",
            display_order: 2,
            is_active: true,
          },
          {
            id: "3",
            title: "Electrical Safety Inspection",
            description:
              "Ensure your home is safe with our comprehensive electrical inspection",
            image_url:
              "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
            cta_text: "Book Now",
            cta_link: "/services/electrical",
            display_order: 3,
            is_active: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchPromotionalBanners();
  }, []);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-slide functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  if (loading) {
    return (
      <div className="relative w-full max-w-5xl mx-auto h-[400px] bg-gray-100 animate-pulse rounded-xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400">Loading promotions...</span>
        </div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {promotions.map((promo) => (
            <CarouselItem key={promo.id}>
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${promo.image_url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                </div>
                <div className="relative h-full flex flex-col justify-center p-10 text-white">
                  <h2 className="text-4xl font-bold mb-4 max-w-md">
                    {promo.title}
                  </h2>
                  <p className="text-xl mb-8 max-w-md">{promo.description}</p>
                  <div>
                    <Link
                      href={promo.cta_link}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      {promo.cta_text}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows positioned at the sides */}
        <div className="absolute inset-y-0 left-4 flex items-center">
          <CarouselPrevious className="h-8 w-8 rounded-full bg-white/80 p-2" />
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center">
          <CarouselNext className="h-8 w-8 rounded-full bg-white/80 p-2" />
        </div>

        {/* Dots navigation centered at the bottom */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              className={`h-2 w-2 rounded-full transition-all ${i === current ? "bg-white w-4" : "bg-white/50"}`}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
