"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  image_url: string;
  slug: string;
  is_active: boolean;
  display_order: number;
};

export default function ServiceList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) {
          console.error("Error fetching categories:", error);
          // Fallback to default categories if there's an error
          setCategories([
            {
              id: "1",
              name: "Cleaning",
              description: "Professional cleaning services for your home",
              icon: "🧹",
              image_url:
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80",
              slug: "cleaning",
              is_active: true,
              display_order: 1,
            },
            {
              id: "2",
              name: "Plumbing",
              description: "Expert plumbing services for any issue",
              icon: "🔧",
              image_url:
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=80",
              slug: "plumbing",
              is_active: true,
              display_order: 2,
            },
            {
              id: "3",
              name: "Electrical",
              description: "Professional electrical services",
              icon: "⚡",
              image_url:
                "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&q=80",
              slug: "electrical",
              is_active: true,
              display_order: 3,
            },
            {
              id: "4",
              name: "Landscaping",
              description: "Professional landscaping services",
              icon: "🌱",
              image_url:
                "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=300&q=80",
              slug: "landscaping",
              is_active: true,
              display_order: 4,
            },
            {
              id: "5",
              name: "Painting",
              description: "Professional painting services",
              icon: "🖌️",
              image_url:
                "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300&q=80",
              slug: "painting",
              is_active: true,
              display_order: 5,
            },
            {
              id: "6",
              name: "Handyman",
              description: "General handyman services",
              icon: "🔨",
              image_url:
                "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=300&q=80",
              slug: "handyman",
              is_active: true,
              display_order: 6,
            },
          ]);
          return;
        }

        if (data && data.length > 0) {
          setCategories(data);
        } else {
          // Fallback to default categories if no data
          setCategories([
            {
              id: "1",
              name: "Cleaning",
              description: "Professional cleaning services for your home",
              icon: "🧹",
              image_url:
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80",
              slug: "cleaning",
              is_active: true,
              display_order: 1,
            },
            {
              id: "2",
              name: "Plumbing",
              description: "Expert plumbing services for any issue",
              icon: "🔧",
              image_url:
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=80",
              slug: "plumbing",
              is_active: true,
              display_order: 2,
            },
            {
              id: "3",
              name: "Electrical",
              description: "Professional electrical services",
              icon: "⚡",
              image_url:
                "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&q=80",
              slug: "electrical",
              is_active: true,
              display_order: 3,
            },
            {
              id: "4",
              name: "Landscaping",
              description: "Professional landscaping services",
              icon: "🌱",
              image_url:
                "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=300&q=80",
              slug: "landscaping",
              is_active: true,
              display_order: 4,
            },
            {
              id: "5",
              name: "Painting",
              description: "Professional painting services",
              icon: "🖌️",
              image_url:
                "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300&q=80",
              slug: "painting",
              is_active: true,
              display_order: 5,
            },
            {
              id: "6",
              name: "Handyman",
              description: "General handyman services",
              icon: "🔨",
              image_url:
                "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=300&q=80",
              slug: "handyman",
              is_active: true,
              display_order: 6,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to default categories if there's an exception
        setCategories([
          {
            id: "1",
            name: "Cleaning",
            description: "Professional cleaning services for your home",
            icon: "🧹",
            image_url:
              "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80",
            slug: "cleaning",
            is_active: true,
            display_order: 1,
          },
          {
            id: "2",
            name: "Plumbing",
            description: "Expert plumbing services for any issue",
            icon: "🔧",
            image_url:
              "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=80",
            slug: "plumbing",
            is_active: true,
            display_order: 2,
          },
          {
            id: "3",
            name: "Electrical",
            description: "Professional electrical services",
            icon: "⚡",
            image_url:
              "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&q=80",
            slug: "electrical",
            is_active: true,
            display_order: 3,
          },
          {
            id: "4",
            name: "Landscaping",
            description: "Professional landscaping services",
            icon: "🌱",
            image_url:
              "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=300&q=80",
            slug: "landscaping",
            is_active: true,
            display_order: 4,
          },
          {
            id: "5",
            name: "Painting",
            description: "Professional painting services",
            icon: "🖌️",
            image_url:
              "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300&q=80",
            slug: "painting",
            is_active: true,
            display_order: 5,
          },
          {
            id: "6",
            name: "Handyman",
            description: "General handyman services",
            icon: "🔨",
            image_url:
              "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=300&q=80",
            slug: "handyman",
            is_active: true,
            display_order: 6,
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-medium text-gray-700">
            What are you looking for?
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center h-40 animate-pulse"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-700">
          What are you looking for?
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/services/${category.slug}`}
            className="block"
          >
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center h-40 hover:shadow-xl hover:scale-105 hover:bg-white transition-all duration-300 border border-transparent hover:border-gray-200">
              <div className="relative w-16 h-16 mb-3">
                <Image
                  src={
                    category.image_url ||
                    `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(category.name.toLowerCase())}`
                  }
                  alt={category.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h3 className="text-sm font-medium text-center text-gray-800">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
