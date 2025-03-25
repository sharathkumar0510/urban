"use client";

import { CheckCircle2, Shield, CreditCard, LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type ValueProposition = {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
};

type IconMap = {
  [key: string]: LucideIcon;
};

export default function FeatureList() {
  const [features, setFeatures] = useState<ValueProposition[]>([]);
  const [loading, setLoading] = useState(true);

  // Map of icon names to components
  const iconMap: IconMap = {
    CheckCircle2: CheckCircle2,
    Shield: Shield,
    CreditCard: CreditCard,
  };

  useEffect(() => {
    async function fetchValuePropositions() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("value_propositions")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) {
          console.error("Error fetching value propositions:", error);
          // Fallback to default features if there's an error
          setFeatures([
            {
              id: "1",
              title: "Vetted Professionals",
              description:
                "All service providers undergo thorough background checks and skill verification",
              icon: "CheckCircle2",
              display_order: 1,
              is_active: true,
            },
            {
              id: "2",
              title: "Quality Guarantee",
              description:
                "If you're not satisfied with the service, we'll make it right or refund your money",
              icon: "Shield",
              display_order: 2,
              is_active: true,
            },
            {
              id: "3",
              title: "Secure Payments",
              description:
                "Your payment information is encrypted and never stored on our servers",
              icon: "CreditCard",
              display_order: 3,
              is_active: true,
            },
          ]);
          return;
        }

        if (data && data.length > 0) {
          setFeatures(data);
        } else {
          // Fallback to default features if no data
          setFeatures([
            {
              id: "1",
              title: "Vetted Professionals",
              description:
                "All service providers undergo thorough background checks and skill verification",
              icon: "CheckCircle2",
              display_order: 1,
              is_active: true,
            },
            {
              id: "2",
              title: "Quality Guarantee",
              description:
                "If you're not satisfied with the service, we'll make it right or refund your money",
              icon: "Shield",
              display_order: 2,
              is_active: true,
            },
            {
              id: "3",
              title: "Secure Payments",
              description:
                "Your payment information is encrypted and never stored on our servers",
              icon: "CreditCard",
              display_order: 3,
              is_active: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching value propositions:", error);
        // Fallback to default features if there's an exception
        setFeatures([
          {
            id: "1",
            title: "Vetted Professionals",
            description:
              "All service providers undergo thorough background checks and skill verification",
            icon: "CheckCircle2",
            display_order: 1,
            is_active: true,
          },
          {
            id: "2",
            title: "Quality Guarantee",
            description:
              "If you're not satisfied with the service, we'll make it right or refund your money",
            icon: "Shield",
            display_order: 2,
            is_active: true,
          },
          {
            id: "3",
            title: "Secure Payments",
            description:
              "Your payment information is encrypted and never stored on our servers",
            icon: "CreditCard",
            display_order: 3,
            is_active: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchValuePropositions();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-xl shadow-sm animate-pulse"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded mb-1 w-full"></div>
            <div className="h-4 bg-gray-100 rounded mb-1 w-5/6"></div>
            <div className="h-4 bg-gray-100 rounded w-4/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (features.length === 0) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {features.map((feature) => {
        const IconComponent = iconMap[feature.icon] || CheckCircle2;

        return (
          <div
            key={feature.id}
            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-blue-600 mb-4">
              <IconComponent className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}
