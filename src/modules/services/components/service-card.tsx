import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  name: string;
  startingPrice: string;
  link: string;
}

export function ServiceCard({
  icon,
  name,
  startingPrice,
  link,
}: ServiceCardProps) {
  return (
    <Link href={link}>
      <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:translate-y-[-5px] border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">{icon}</div>
          <div>
            <h3 className="text-xl font-semibold mb-1">{name}</h3>
            <p className="text-gray-600">From {startingPrice}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
