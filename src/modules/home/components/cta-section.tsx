import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Book a Service?</h2>
        <p className="text-white/80 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust HomeServices for their
          home maintenance needs.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center px-6 py-3 text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          Book Now
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
