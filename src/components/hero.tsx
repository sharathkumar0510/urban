import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export default function Hero() {
  const promotions = [
    {
      title: "Get 20% Off Your First Cleaning",
      description: "Professional home cleaning services starting at just $89",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
      cta: "Book Now",
      link: "/services/cleaning",
    },
    {
      title: "Emergency Plumbing Services",
      description:
        "Available 24/7 - Qualified plumbers at your door in 60 minutes or less",
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
      cta: "Book Now",
      link: "/services/plumbing",
    },
    {
      title: "Electrical Safety Inspection",
      description:
        "Ensure your home is safe with our comprehensive electrical inspection",
      image:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
      cta: "Book Now",
      link: "/services/electrical",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Location selector */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="font-medium">San Francisco, CA</span>
            <button className="text-blue-600 text-sm font-medium">
              Change
            </button>
          </div>
        </div>

        {/* Carousel */}
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {promotions.map((promo, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${promo.image})` }}
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
                        href={promo.link}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        {promo.cta}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <CarouselPrevious className="h-8 w-8 rounded-full bg-white/80 p-2" />
            <CarouselNext className="h-8 w-8 rounded-full bg-white/80 p-2" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
