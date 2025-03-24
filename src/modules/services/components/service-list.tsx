import Link from "next/link";
import Image from "next/image";

export default function ServiceList() {
  const serviceCategories = [
    {
      icon: "https://api.dicebear.com/7.x/icons/svg?seed=womensSalonSpa",
      name: "Women's Salon & Spa",
      link: "/services/womens-salon",
    },
    {
      icon: "https://api.dicebear.com/7.x/icons/svg?seed=mensSalon",
      name: "Men's Salon & Massage",
      link: "/services/mens-salon",
    },
    {
      icon: "https://api.dicebear.com/7.x/icons/svg?seed=acRepair",
      name: "AC & Appliance Repair",
      link: "/services/appliance-repair",
    },
    {
      icon: "https://api.dicebear.com/7.x/icons/svg?seed=cleaning",
      name: "Cleaning & Pest Control",
      link: "/services/cleaning",
    },
    {
      icon: "https://api.dicebear.com/7.x/icons/svg?seed=electrician",
      name: "Electrician, Plumber & Carpenter",
      link: "/services/home-repairs",
    },
    {
      icon: "https://api.dicebear.com/7.x/icons/svg?seed=waterPurifier",
      name: "Native Water Purifier",
      link: "/services/water-purifier",
    },
    {
      icon: "https://api.dicebear.com/7.x/icons/svg?seed=smartLock",
      name: "Native Smart Locks",
      link: "/services/smart-locks",
    },
    {
      icon: "https://api.dicebear.com/7.x/icons/svg?seed=painting",
      name: "Painting & Water proofing",
      link: "/services/painting",
    },
    {
      icon: "https://api.dicebear.com/7.x/icons/svg?seed=wallPanel",
      name: "Wall Panels",
      link: "/services/wall-panels",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-700">
          What are you looking for?
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {serviceCategories.map((service, index) => (
          <Link key={index} href={service.link} className="block">
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center h-40 hover:shadow-xl hover:scale-105 hover:bg-white transition-all duration-300 border border-transparent hover:border-gray-200">
              <div className="relative w-16 h-16 mb-3">
                <Image
                  src={service.icon}
                  alt={service.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h3 className="text-sm font-medium text-center text-gray-800">
                {service.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
