import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Star,
  Gift,
  CreditCard,
  Users,
  Award,
} from "lucide-react";

const MembersClub = () => {
  const benefits = [
    {
      icon: CheckCircle,
      title: "200 CREDITS FOR SIGNING UP",
      description: "Get 200 instant credits when you sign up",
      color: "text-blue-700",
    },
    {
      icon: Star,
      title: "EXCLUSIVE ACCESS",
      description: "Early access to new products",
      color: "text-blue-700",
    },
    {
      icon: Gift,
      title: "BIRTHDAY REWARDS",
      description: "A special gift on your birthday",
      color: "text-blue-700",
    },
    {
      icon: CreditCard,
      title: "POINTS ON EVERY PURCHASE",
      description: "Earn points for every euro spent",
      color: "text-blue-700",
    },
    {
      icon: Users,
      title: "MEMBERS-ONLY EVENTS",
      description: "Exclusive events and releases for members",
      color: "text-blue-700",
    },
    {
      icon: Award,
      title: "TIERED REWARDS",
      description: "Level up to unlock better benefits",
      color: "text-blue-700",
    },
  ];

  const membershipTiers = [
    {
      name: "BRONZE",
      requiredPoints: "0–999",
      benefits: [
        "2 points per €1 spent",
        "Access to exclusive sales",
        "Free standard shipping",
      ],
      color: "bg-amber-900",
    },
    {
      name: "SILVER",
      requiredPoints: "1,000–2,999",
      benefits: [
        "3 points per €1 spent",
        "24h early access",
        "Free express shipping",
        "Free returns",
      ],
      color: "bg-gray-400",
    },
    {
      name: "GOLD",
      requiredPoints: "3,000–4,999",
      benefits: [
        "4 points per €1 spent",
        "48h early access",
        "Free priority shipping",
        "Dedicated support",
        "Birthday gift",
      ],
      color: "bg-yellow-500",
    },
    {
      name: "PLATINUM",
      requiredPoints: "5,000+",
      benefits: [
        "5 points per €1 spent",
        "72h early access",
        "Free international shipping",
        "Personal shopper",
        "VIP events",
        "Exclusive discounts",
      ],
      color: "bg-gray-800",
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/memberbanner.png')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="text-center text-white z-10 px-6 max-w-6xl">
          <h1 className="text-4xl md:text-9xl font-bold mb-4 font-serif tracking-wide">
            MEMBERS CLUB
          </h1>
          <p className="text-xl md:text-2xl mb-1 max-w-3xl mx-auto">
            JOIN HOLOCREW CLUB AND GET REWARDED WHILE YOU SHOP
          </p>
          <p className="text-xl md:text-2xl mb-8">
            YOU'LL RECEIVE CREDITS FOR SIGNING UP
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="bg-white text-black hover:bg-black hover:text-white border border-white px-6 py-3 font-bold text-lg shadow-lg transition-all duration-300 w-full sm:w-auto">
                JOIN NOW
              </button>
            </Link>
            <Link to="/login">
              <button className="bg-white text-black hover:bg-black hover:text-white border border-white px-10 py-3 font-bold text-lg shadow-lg transition-all duration-300 w-full sm:w-auto">
                LOGIN
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              WHY JOIN THE CLUB?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover all the exclusive benefits you'll receive as a member
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-100 p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center mb-6">
                  <benefit.icon className={`w-12 h-12 mb-2 ${benefit.color}`} />
                  <h3 className="text-xl font-bold text-gray-900 ml-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              HOW IT WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                JOIN FOR FREE
              </h3>
              <p className="text-gray-600">
                Sign up for free and get your 200 welcome credits for free
              </p>
            </div>

            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                SHOP & EARN
              </h3>
              <p className="text-gray-600">
                Earn points with every purchase and level up in the program
              </p>
            </div>

            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                REDEEM REWARDS
              </h3>
              <p className="text-gray-600">
                Redeem your points for discounts, exclusive products, and more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              MEMBERSHIP TIERS
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The more you shop, the more rewards you unlock
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipTiers.map((tier, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className={`${tier.color} text-white py-3 px-6 text-center mb-6`}
                >
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {tier.requiredPoints}
                  </div>
                  <p className="text-gray-600">required points</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {index === 0 && (
                  <Link to="/register">
                    <button className="w-full bg-black text-white py-3  font-bold hover:bg-gray-800 transition-colors">
                      JOIN NOW
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-grey-900 mb-6">
            READY TO JOIN?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join now and start enjoying exclusive benefits from your very first
            purchase
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="bg-white text-black hover:bg-gray-100 border border-black px-12 py-4  font-bold text-lg shadow-lg transition-all duration-300 w-full sm:w-auto">
                JOIN NOW – GET 200 CREDITS
              </button>
            </Link>
            <Link to="/faq">
              <button className="bg-white text-black hover:bg-gray-100 border border-black px-12 py-4  font-bold text-lg shadow-lg transition-all duration-300 w-full sm:w-auto">
                LEARN MORE
              </button>
            </Link>
          </div>

          <div className="mt-12 text-gray-600">
            <p className="mb-2">Already a member?</p>
            <Link
              to="/login"
              className="text-grey-500 font-bold hover:text-gray-700"
            >
              Log in here to view your points and rewards →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MembersClub;
