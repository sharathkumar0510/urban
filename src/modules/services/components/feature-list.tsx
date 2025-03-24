import { CheckCircle2, Shield, CreditCard } from "lucide-react";

export default function FeatureList() {
  const features = [
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: "Vetted Professionals",
      description:
        "Every service provider undergoes thorough background checks and skill verification",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Guarantee",
      description:
        "Not satisfied? We'll send another professional to make it right at no extra cost",
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Secure Payments",
      description:
        "Your payment is held securely until you're completely satisfied with the service",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {features.map((feature, index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-blue-600 mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
