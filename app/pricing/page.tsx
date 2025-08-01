import type { Metadata } from "next";
import { CheckCircle, ArrowRight, Info, Star } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing · SchedulePro",
  description: "Simple, transparent pricing for SchedulePro. Start free with unlimited features. Premium plans coming soon with advanced capabilities.",
};

const pricingTiers = [
  {
    name: "Starter",
    priceMonthly: "Free",
    priceAnnual: "Free",
    description: "Perfect for solo practitioners and small teams getting started.",
    features: [
      "Unlimited staff seats",
      "Unlimited calendar syncs",
      "Email reminders & notifications",
      "Custom booking page",
      "Analytics dashboard",
      "Client management",
    ],
    mostPopular: true,
    cta: "Get Started Free",
    badge: "Currently Free"
  },
  {
    name: "Professional",
    priceMonthly: "Coming Soon",
    priceAnnual: "Coming Soon",
    description: "Advanced features for growing businesses (launching soon).",
    features: [
      "Everything in Starter",
      "SMS reminders",
      "Advanced reporting",
      "API access",
      "Priority support",
      "Custom integrations",
    ],
    mostPopular: false,
    cta: "Notify Me",
    badge: "Coming Soon"
  },
  {
    name: "Enterprise",
    priceMonthly: "Coming Soon",
    priceAnnual: "Coming Soon",
    description: "Custom solutions for large organizations (launching soon).",
    features: [
      "Everything in Professional",
      "Multi-location support",
      "SSO/SAML authentication",
      "White-label branding",
      "Dedicated support",
      "Custom onboarding",
    ],
    mostPopular: false,
    cta: "Contact Sales",
    badge: "Coming Soon"
  },
];

const faqs = [
  {
    q: "Is SchedulePro really free right now?",
    a: "Yes! We're currently in beta and all features are completely free. No credit card required, no hidden fees, no time limits.",
  },
  {
    q: "When will paid plans be introduced?",
    a: "We'll introduce premium features and paid plans in the future, but we'll give plenty of advance notice to all users.",
  },
  {
    q: "Will my data be safe during the beta?",
    a: "Absolutely. We use enterprise-grade security and backup systems to keep your data safe and secure.",
  },
  {
    q: "Can I use this for my business right now?",
    a: "Yes! SchedulePro is fully functional and ready for business use. Many businesses are already using it successfully.",
  },
  {
    q: "What happens to my account when paid plans launch?",
    a: "Your account and data will remain intact. You'll have the option to continue with a free tier or upgrade to premium features.",
  },
  {
    q: "How do I get support?",
    a: "You can reach out through our help center or contact us directly. We provide support to all users, even during the free beta.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white/95 backdrop-blur-sm">
      {/* Header with Logo */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-blue-600 hover:scale-105 transition-transform">
              SchedulePro
            </Link>
            <Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Star className="h-4 w-4 mr-2" />
            Currently Free for Everyone!
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Simple Pricing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Start using SchedulePro completely free. Premium features coming soon with transparent pricing.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pricingTiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/50 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white/90 ${
                tier.mostPopular ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            >
              {/* Badge */}
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                tier.badge === 'Currently Free' 
                  ? 'bg-green-500 text-white' 
                  : tier.mostPopular 
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-700'
              }`}>
                {tier.badge}
              </div>

              {/* Plan Name */}
              <div className="text-center mb-6 mt-4">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                <p className="text-slate-600">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-slate-900 mb-2">
                  {tier.priceMonthly}
                </div>
                {tier.priceMonthly === 'Free' && (
                  <p className="text-green-600 font-semibold">Forever • No Credit Card Required</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link href={tier.cta === 'Contact Sales' ? '/contact' : '/auth/register'} className="block">
                <button className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  tier.mostPopular
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    : tier.cta === 'Contact Sales'
                      ? 'bg-slate-800 text-white hover:bg-slate-900'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                } group-hover:scale-105`}>
                  {tier.cta}
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </button>
              </Link>
            </div>
          ))}
        </div>
        {/* Current Status Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-16 text-center border border-green-200/50">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">🎉 Everything is Free Right Now!</h3>
          <p className="text-lg text-slate-700 mb-4">
            We're currently in beta and all features are completely free. Enjoy unlimited access to:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Unlimited Staff
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Unlimited Bookings
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Full Analytics
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Email Notifications
            </div>
          </div>
        </div>
        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start mb-3">
                  <Info className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <h4 className="font-semibold text-slate-900">{faq.q}</h4>
                </div>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
        {/* CTA Section */}
        <div className="text-center mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of businesses already using SchedulePro to streamline their scheduling.
          </p>
          <Link href="/auth/register">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 hover:scale-105 shadow-lg">
              Start Using SchedulePro Free
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
