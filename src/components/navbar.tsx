import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { Bell, MapPin, Search, User } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" prefetch className="text-2xl font-bold text-blue-600">
            HomeServices
          </Link>

          <div className="hidden md:flex items-center gap-6 flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="search"
                className="w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for services..."
              />
            </div>
          </div>

          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <Link
                  href="/bookings"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Bell className="w-5 h-5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <Button variant="outline">My Bookings</Button>
                </Link>
                <UserProfile />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
