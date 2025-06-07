import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Shield,
  Smartphone,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Quote,
  BarChart3,
  CreditCard,
  Bell,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tokens } from "@/design-tokens";
import { cn } from "@/lib/utils";

/**
 * Professional FinTech landing page for BillBuddy
 * Features hero section, benefits, testimonials, and pricing
 * Mobile-first responsive design with accessibility compliance
 */
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const handleGetStarted = () => {
    navigate("/onboarding");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{ opacity: 1, visibility: "visible" }}
    >
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: tokens.colors.primary.navy[900] }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1
              className="text-xl font-bold"
              style={{ color: tokens.colors.primary.navy[900] }}
            >
              BillBuddy
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Reviews
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={handleSignIn}
              className="hidden sm:inline-flex"
            >
              Sign In
            </Button>
            <Button
              onClick={handleGetStarted}
              className="font-medium"
              style={{
                backgroundColor: tokens.colors.primary.teal[400],
                color: tokens.colors.primary.navy[900],
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
            >
              <Badge
                variant="outline"
                className="mb-6 border-teal-200 bg-teal-50 text-teal-700"
              >
                🚀 AI-Powered Bill Management
              </Badge>

              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                <span style={{ color: tokens.colors.primary.navy[900] }}>
                  Smart Bill Management for
                </span>
                <br />
                <span
                  className="bg-gradient-to-r bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${tokens.colors.primary.teal[400]}, ${tokens.colors.primary.navy[700]})`,
                  }}
                >
                  Modern Households
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl">
                Never miss a payment again. BillBuddy uses AI to track, predict,
                and manage all your bills across multiple properties and
                households. Get insights, automation, and peace of mind.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto font-semibold px-8 py-3 text-base"
                  style={{
                    backgroundColor: tokens.colors.primary.teal[400],
                    color: tokens.colors.primary.navy[900],
                  }}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-3 text-base"
                  onClick={() =>
                    document
                      .getElementById("demo")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Watch Demo
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Cancel anytime
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 hidden lg:block">
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
            transition={{
              duration: shouldReduceMotion ? 0 : 3,
              repeat: Infinity,
            }}
            className="rounded-lg bg-white p-4 shadow-lg"
          >
            <DollarSign className="h-6 w-6 text-green-500" />
          </motion.div>
        </div>

        <div className="absolute top-32 right-16 hidden lg:block">
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
            transition={{
              duration: shouldReduceMotion ? 0 : 4,
              repeat: Infinity,
            }}
            className="rounded-lg bg-white p-4 shadow-lg"
          >
            <Bell className="h-6 w-6 text-blue-500" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: tokens.colors.primary.navy[900] }}
            >
              Everything you need to manage bills
            </h2>
            <p className="mb-16 text-lg text-gray-600">
              Powerful features designed for modern households and enterprise
              users
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Smart Dashboard",
                description:
                  "Multi-view dashboard with calendar, list, and cash flow timeline views",
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "AI Predictions",
                description:
                  "Predict bill amounts and due dates using machine learning algorithms",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Household Management",
                description:
                  "Manage multiple properties and households with role-based access",
              },
              {
                icon: <CreditCard className="h-6 w-6" />,
                title: "Bank Integration",
                description:
                  "Connect with 11,000+ banks using Plaid for automatic bill detection",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Enterprise Security",
                description:
                  "Bank-level encryption and compliance monitoring for peace of mind",
              },
              {
                icon: <Smartphone className="h-6 w-6" />,
                title: "Mobile First",
                description:
                  "Fully responsive design optimized for mobile and tablet devices",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.5,
                  delay: shouldReduceMotion ? 0 : index * 0.1,
                }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div
                      className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${tokens.colors.primary.teal[400]}20`,
                      }}
                    >
                      <div style={{ color: tokens.colors.primary.teal[600] }}>
                        {feature.icon}
                      </div>
                    </div>
                    <h3
                      className="mb-2 text-lg font-semibold"
                      style={{ color: tokens.colors.primary.navy[900] }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2
              className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: tokens.colors.primary.navy[900] }}
            >
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that works best for your household needs
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
            {/* Starter Plan */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="relative h-full p-6 border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color: tokens.colors.primary.navy[900] }}
                    >
                      Starter
                    </h3>
                    <div className="mb-4">
                      <span
                        className="text-4xl font-bold"
                        style={{ color: tokens.colors.primary.navy[900] }}
                      >
                        Free
                      </span>
                    </div>
                    <p className="text-gray-600">Perfect for getting started</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Up to 10 bills",
                      "Basic dashboard",
                      "Mobile app access",
                      "Email reminders",
                      "1 household",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleGetStarted}
                  >
                    Get Started Free
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.5,
                delay: shouldReduceMotion ? 0 : 0.1,
              }}
              viewport={{ once: true }}
            >
              <Card
                className="relative h-full p-6 border-2 hover:shadow-lg transition-shadow"
                style={{ borderColor: tokens.colors.primary.teal[400] }}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge
                    className="px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: tokens.colors.primary.teal[400],
                      color: tokens.colors.primary.navy[900],
                    }}
                  >
                    Most Popular
                  </Badge>
                </div>
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color: tokens.colors.primary.navy[900] }}
                    >
                      Pro
                    </h3>
                    <div className="mb-4">
                      <span
                        className="text-4xl font-bold"
                        style={{ color: tokens.colors.primary.navy[900] }}
                      >
                        $9.99
                      </span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <p className="text-gray-600">
                      Everything you need to manage bills
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Unlimited bills",
                      "Multi-view dashboard",
                      "AI predictions & insights",
                      "Bank account integration",
                      "Up to 3 households",
                      "Calendar & timeline views",
                      "Smart notifications",
                      "Priority support",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full font-medium"
                    onClick={handleGetStarted}
                    style={{
                      backgroundColor: tokens.colors.primary.teal[400],
                      color: tokens.colors.primary.navy[900],
                    }}
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.5,
                delay: shouldReduceMotion ? 0 : 0.2,
              }}
              viewport={{ once: true }}
            >
              <Card className="relative h-full p-6 border-2 hover:shadow-lg transition-shadow border-gray-900">
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color: tokens.colors.primary.navy[900] }}
                    >
                      Enterprise
                    </h3>
                    <div className="mb-4">
                      <span
                        className="text-4xl font-bold"
                        style={{ color: tokens.colors.primary.navy[900] }}
                      >
                        Custom
                      </span>
                    </div>
                    <p className="text-gray-600">
                      For large households & businesses
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Everything in Pro",
                      "Unlimited households",
                      "Admin dashboard",
                      "Compliance monitoring",
                      "Risk management",
                      "Webhook integrations",
                      "Custom reporting",
                      "Dedicated support",
                      "SSO integration",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        "mailto:sales@billbuddy.com?subject=Enterprise Inquiry",
                        "_blank",
                      )
                    }
                  >
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Pricing FAQ */}
          <div className="mt-16 text-center">
            <h3
              className="text-lg font-semibold mb-6"
              style={{ color: tokens.colors.primary.navy[900] }}
            >
              Frequently asked questions
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
              <div>
                <h4 className="font-medium mb-2 text-gray-900">
                  Can I change plans anytime?
                </h4>
                <p className="text-sm text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time from
                  your account settings.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-900">
                  Is there a free trial?
                </h4>
                <p className="text-sm text-gray-600">
                  Yes! All paid plans include a 14-day free trial with full
                  access to features.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-900">
                  How secure is my data?
                </h4>
                <p className="text-sm text-gray-600">
                  We use bank-level 256-bit encryption and never store your
                  banking credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2
              className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: tokens.colors.primary.navy[900] }}
            >
              Trusted by households nationwide
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of families saving time and money with BillBuddy
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-16">
            {[
              { metric: "50K+", label: "Active Users" },
              { metric: "$2M+", label: "Bills Managed" },
              { metric: "99.9%", label: "Uptime" },
              { metric: "4.9/5", label: "User Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: tokens.colors.primary.teal[600] }}
                >
                  {stat.metric}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2
              className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: tokens.colors.primary.navy[900] }}
            >
              What our users say
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                role: "Property Manager",
                content:
                  "BillBuddy has transformed how I manage bills across 12 rental properties. The household management feature is a game-changer.",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Family CFO",
                content:
                  "The AI predictions are incredibly accurate. I haven't missed a bill payment in 8 months since starting with BillBuddy.",
                rating: 5,
              },
              {
                name: "Emma Davis",
                role: "Household Manager",
                content:
                  "Love the mobile app! I can check our family's bills anywhere. The calendar view makes planning so much easier.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.5,
                  delay: shouldReduceMotion ? 0 : index * 0.1,
                }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6">
                  <CardContent className="p-0">
                    <div className="mb-4 flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-gray-400 mb-4" />
                    <p className="mb-6 text-gray-700">{testimonial.content}</p>
                    <div>
                      <div
                        className="font-semibold"
                        style={{ color: tokens.colors.primary.navy[900] }}
                      >
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 sm:py-32"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.primary.navy[900]}, ${tokens.colors.primary.navy[800]})`,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to take control of your bills?
            </h2>
            <p className="mb-8 text-lg text-gray-300">
              Join thousands of users who never miss a payment. Start your free
              trial today.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="font-semibold px-8 py-3 text-base"
              style={{
                backgroundColor: tokens.colors.primary.teal[400],
                color: tokens.colors.primary.navy[900],
              }}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="mt-4 text-sm text-gray-400">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor: tokens.colors.primary.navy[900] }}
              >
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span
                className="font-semibold"
                style={{ color: tokens.colors.primary.navy[900] }}
              >
                BillBuddy
              </span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-700">
                Terms
              </a>
              <a href="#" className="hover:text-gray-700">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
