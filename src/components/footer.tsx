import Link from "next/link";
import { Twitter, Linkedin, Facebook, Instagram, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Services Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/cleaning"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Cleaning
                </Link>
              </li>
              <li>
                <Link
                  href="/services/plumbing"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Plumbing
                </Link>
              </li>
              <li>
                <Link
                  href="/services/electrical"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Electrical
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-600 hover:text-blue-600"
                >
                  All Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-600"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Customer Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-blue-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings"
                  className="text-gray-600 hover:text-blue-600"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/guarantee"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Service Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* For Professionals Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              For Service Providers
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/providers/sign-up"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Join as a Provider
                </Link>
              </li>
              <li>
                <Link
                  href="/providers/how-it-works"
                  className="text-gray-600 hover:text-blue-600"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/providers/resources"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/providers/success-stories"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Cities we serve */}
        <div className="mb-12">
          <h3 className="font-semibold text-gray-900 mb-4">Cities We Serve</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {[
              "New York",
              "Los Angeles",
              "Chicago",
              "Houston",
              "Phoenix",
              "Philadelphia",
              "San Antonio",
              "San Diego",
              "Dallas",
              "San Jose",
              "Austin",
              "San Francisco",
            ].map((city) => (
              <div key={city} className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                <Link
                  href={`/locations/${city.toLowerCase().replace(" ", "-")}`}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  {city}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <div className="text-gray-600 mb-4 md:mb-0">
            © {currentYear} HomeServices. All rights reserved.
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-blue-600">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
