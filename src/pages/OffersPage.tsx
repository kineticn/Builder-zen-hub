import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Gift,
  CreditCard,
  DollarSign,
  Percent,
  Clock,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNavBar } from "@/components/BottomNavBar";
import { tokens } from "@/design-tokens";
import { cn } from "@/lib/utils";

interface Offer {
  id: string;
  title: string;
  company: string;
  description: string;
  reward: string;
  category: "credit-cards" | "banking" | "cashback" | "bill-pay" | "insurance";
  featured: boolean;
  rating: number;
  reviewCount: number;
  terms: string;
  expiresAt?: string;
  imageUrl?: string;
  link: string;
}

const mockOffers: Offer[] = [
  {
    id: "1",
    title: "Chase Freedom Unlimited",
    company: "Chase Bank",
    description:
      "Earn unlimited 1.5% cash back on every purchase. No rotating categories or annual fee.",
    reward: "$200 bonus + 1.5% cashback",
    category: "credit-cards",
    featured: true,
    rating: 4.8,
    reviewCount: 12543,
    terms: "Earn $200 after spending $500 in first 3 months",
    link: "https://chase.com/freedom-unlimited",
  },
  {
    id: "2",
    title: "High-Yield Savings Account",
    company: "Marcus by Goldman Sachs",
    description:
      "No minimum deposit, no fees, competitive APY for your emergency fund.",
    reward: "4.15% APY",
    category: "banking",
    featured: true,
    rating: 4.7,
    reviewCount: 8934,
    terms: "Rate subject to change. No minimum balance required.",
    link: "https://marcus.com/savings",
  },
  {
    id: "3",
    title: "Rakuten Cashback",
    company: "Rakuten",
    description: "Get cash back when you shop online at over 3,500 stores.",
    reward: "Up to 10% cashback",
    category: "cashback",
    featured: false,
    rating: 4.6,
    reviewCount: 25678,
    terms: "Cashback rates vary by store. Quarterly payouts available.",
    expiresAt: "2024-12-31",
    link: "https://rakuten.com",
  },
  {
    id: "4",
    title: "Autopay Discount Program",
    company: "BillBuddy Partners",
    description:
      "Set up autopay for your bills and earn cashback on every payment.",
    reward: "0.5% cashback on all bill payments",
    category: "bill-pay",
    featured: true,
    rating: 4.9,
    reviewCount: 3421,
    terms: "Available for all connected accounts. Cashback paid monthly.",
    link: "/dashboard",
  },
  {
    id: "5",
    title: "GEICO Auto Insurance",
    company: "GEICO",
    description:
      "Save up to 15% or more on car insurance. Get a quote in minutes.",
    reward: "Up to 15% savings",
    category: "insurance",
    featured: false,
    rating: 4.4,
    reviewCount: 45123,
    terms: "Savings vary. Additional discounts may apply.",
    link: "https://geico.com",
  },
  {
    id: "6",
    title: "Capital One Savor Card",
    company: "Capital One",
    description: "Earn 4% on dining and entertainment, 2% at grocery stores.",
    reward: "$300 bonus + 4% rewards",
    category: "credit-cards",
    featured: false,
    rating: 4.5,
    reviewCount: 9876,
    terms: "Earn $300 after spending $3,000 in first 3 months",
    link: "https://capitalone.com/savor",
  },
];

/**
 * Professional offers page for affiliate deals and cashback opportunities
 * Features categorized offers, ratings, and seamless integration with bill management
 * Mobile-first responsive design following FinTech best practices
 */
const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleOfferClick = (offer: Offer) => {
    if (offer.link.startsWith("http")) {
      window.open(offer.link, "_blank", "noopener,noreferrer");
    } else {
      navigate(offer.link);
    }
  };

  const getCategoryIcon = (category: Offer["category"]) => {
    switch (category) {
      case "credit-cards":
        return <CreditCard className="h-4 w-4" />;
      case "banking":
        return <DollarSign className="h-4 w-4" />;
      case "cashback":
        return <Percent className="h-4 w-4" />;
      case "bill-pay":
        return <CheckCircle className="h-4 w-4" />;
      case "insurance":
        return <Shield className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: Offer["category"]) => {
    switch (category) {
      case "credit-cards":
        return "bg-blue-100 text-blue-700";
      case "banking":
        return "bg-green-100 text-green-700";
      case "cashback":
        return "bg-purple-100 text-purple-700";
      case "bill-pay":
        return "bg-teal-100 text-teal-700";
      case "insurance":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredOffers =
    selectedCategory === "all"
      ? mockOffers
      : mockOffers.filter((offer) => offer.category === selectedCategory);

  const featuredOffers = mockOffers.filter((offer) => offer.featured);

  return (
    <div
      className="min-h-screen bg-gray-50 pb-20"
      style={{ opacity: 1, visibility: "visible" }}
    >
      {/* Header */}
      <header
        className="bg-gradient-to-r text-white p-6 pt-12"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.primary.navy[900]}, ${tokens.colors.primary.navy[800]})`,
        }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Gift className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Offers & Rewards</h1>
          </div>
        </div>

        <p className="text-navy-200 mb-4">
          Exclusive deals and cashback opportunities curated for BillBuddy users
        </p>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-teal-400">$1,247</div>
            <div className="text-xs opacity-80">Total Rewards Earned</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-teal-400">23</div>
            <div className="text-xs opacity-80">Active Offers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-teal-400">$156</div>
            <div className="text-xs opacity-80">This Month</div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Featured Offers */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Featured Offers
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredOffers.slice(0, 2).map((offer) => (
              <motion.div
                key={offer.id}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
              >
                <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-yellow-400">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            className={cn(
                              "text-xs",
                              getCategoryColor(offer.category),
                            )}
                          >
                            {getCategoryIcon(offer.category)}
                            <span className="ml-1 capitalize">
                              {offer.category.replace("-", " ")}
                            </span>
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            Featured
                          </Badge>
                        </div>
                        <CardTitle className="text-base text-gray-900">
                          {offer.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{offer.company}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-700">{offer.description}</p>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < Math.floor(offer.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {offer.rating} ({offer.reviewCount.toLocaleString()}{" "}
                        reviews)
                      </span>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-800">
                          {offer.reward}
                        </span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        {offer.terms}
                      </p>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => handleOfferClick(offer)}
                      style={{
                        backgroundColor: tokens.colors.primary.teal[400],
                        color: tokens.colors.primary.navy[900],
                      }}
                    >
                      View Offer
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* All Offers */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All Offers
          </h2>

          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="credit-cards" className="text-xs">
                Cards
              </TabsTrigger>
              <TabsTrigger value="banking" className="text-xs">
                Banking
              </TabsTrigger>
              <TabsTrigger value="cashback" className="text-xs">
                Cashback
              </TabsTrigger>
              <TabsTrigger value="bill-pay" className="text-xs">
                Bills
              </TabsTrigger>
              <TabsTrigger value="insurance" className="text-xs">
                Insurance
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="space-y-4">
              {filteredOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.3,
                    delay: shouldReduceMotion ? 0 : index * 0.1,
                  }}
                >
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge
                              className={cn(
                                "text-xs",
                                getCategoryColor(offer.category),
                              )}
                            >
                              {getCategoryIcon(offer.category)}
                              <span className="ml-1 capitalize">
                                {offer.category.replace("-", " ")}
                              </span>
                            </Badge>
                            {offer.featured && (
                              <Badge
                                variant="secondary"
                                className="bg-yellow-100 text-yellow-800 text-xs"
                              >
                                Featured
                              </Badge>
                            )}
                            {offer.expiresAt && (
                              <Badge
                                variant="outline"
                                className="text-xs text-orange-600 border-orange-200"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                Limited Time
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-semibold text-gray-900 mb-1">
                            {offer.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {offer.company}
                          </p>
                          <p className="text-sm text-gray-700 mb-3">
                            {offer.description}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-3 w-3",
                                    i < Math.floor(offer.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300",
                                  )}
                                />
                              ))}
                              <span className="ml-1">{offer.rating}</span>
                            </div>
                            <span>•</span>
                            <span>
                              {offer.reviewCount.toLocaleString()} reviews
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold text-green-600 mb-2">
                            {offer.reward}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleOfferClick(offer)}
                            className="min-w-[80px]"
                            style={{
                              backgroundColor: tokens.colors.primary.teal[400],
                              color: tokens.colors.primary.navy[900],
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default OffersPage;
