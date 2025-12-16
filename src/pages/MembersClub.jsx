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

  // Colores específicos para el hover y el shadow de cada Tier
  const tierColors = {
    BRONZE: {
      hoverBorder: "hover:border-[#cd7f32]",
      hoverText: "group-hover:text-[#cd7f32]",
      // Sombra color bronce
      hoverShadow: "hover:shadow-[0_10px_30px_-10px_rgba(205,127,50,0.5)]", 
    },
    SILVER: {
      hoverBorder: "hover:border-[#c0c0c0]",
      hoverText: "group-hover:text-[#c0c0c0]",
      // Sombra color plata
      hoverShadow: "hover:shadow-[0_10px_30px_-10px_rgba(192,192,192,0.5)]",
    },
    GOLD: {
      hoverBorder: "hover:border-[#ffd700]",
      hoverText: "group-hover:text-[#ffd700]",
      // Sombra color oro
      hoverShadow: "hover:shadow-[0_10px_30px_-10px_rgba(255,215,0,0.5)]",
    },
    PLATINUM: {
      hoverBorder: "hover:border-[#0ea5e9]",
      hoverText: "group-hover:text-[#0ea5e9]",
      // Sombra color platino (azul cielo)
      hoverShadow: "hover:shadow-[0_10px_30px_-10px_rgba(14,165,233,0.5)]",
    },
  };

  const membershipTiers = [
    {
      name: "BRONZE",
      image: "/images/Bronze3D.png",
      requiredPoints: "0–999",
      benefits: [
        "2 points per €1 spent",
        "Access to exclusive sales",
        "Free standard shipping",
      ],
      // Asignamos el objeto de colores correspondiente
      colors: tierColors.BRONZE,
    },
    {
      name: "SILVER",
      image: "/images/Silver3D.png",
      requiredPoints: "1,000–2,999",
      benefits: [
        "3 points per €1 spent",
        "24h early access",
        "Free express shipping",
        "Free returns",
      ],
      colors: tierColors.SILVER,
    },
    {
      name: "GOLD",
      image: "/images/Gold3D.png",
      requiredPoints: "3,000–4,999",
      benefits: [
        "4 points per €1 spent",
        "48h early access",
        "Free priority shipping",
        "Dedicated support",
        "Birthday gift",
      ],
      colors: tierColors.GOLD,
    },
    {
      name: "PLATINUM",
      image: "/images/Platinum3D.png",
      requiredPoints: "5,000+",
      benefits: [
        "5 points per €1 spent",
        "72h early access",
        "Free international shipping",
        "Personal shopper",
        "VIP events",
        "Exclusive discounts",
      ],
      colors: tierColors.PLATINUM,
    },
  ];

  return (
    <div className="pt-20 bg-white text-black font-sans">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: "url('/images/memberbanner.png')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>

        <div className="text-center text-white z-10 px-6 max-w-5xl relative">
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-none">
            Members Club
          </h1>
          <p className="text-lg md:text-xl font-medium tracking-widest mb-2 uppercase text-gray-300">
            Join Holocrew Club & Get Rewarded
          </p>
          <div className="w-24 h-1 bg-white mx-auto my-8"></div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
            <Link to="/register">
              <button className="bg-white text-black px-10 py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-transparent hover:text-white border border-white transition-all duration-300 min-w-[200px]">
                Join Now
              </button>
            </Link>
            <Link to="/login">
              <button className="bg-transparent text-white border border-white px-10 py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300 min-w-[200px]">
                Login
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
              Unlock Exclusive Perks
            </h2>
            <div className="w-12 h-0.5 bg-black mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-10 flex flex-col items-center text-center hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="mb-4 p-4 rounded-none">
                    <benefit.icon className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="text-m font-bold uppercase tracking-wider mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 text-sm uppercase tracking-widest">Simple steps to rewards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
                { title: "Join for Free", desc: "Sign up and get 200 welcome credits instantly.", step: "01" },
                { title: "Shop & Earn", desc: "Earn points with every purchase to level up.", step: "02" },
                { title: "Redeem Rewards", desc: "Use points for discounts and exclusive products.", step: "03" }
            ].map((item, index) => (
                <div key={index} className="relative p-8 border border-gray-200 bg-white text-center group hover:border-black transition-colors duration-300">
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-50 px-4 text-4xl font-black text-gray-200 group-hover:text-black transition-colors duration-300">
                        {item.step}
                    </span>
                    <h3 className="text-lg font-bold uppercase tracking-wider mt-6 mb-3">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers (SECCIÓN REDISEÑADA CON HOVER POR COLOR + SHADOW) */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
              Membership Tiers
            </h2>
            <p className="text-gray-500 text-sm uppercase tracking-widest max-w-md mx-auto border-t border-black pt-6">
              Escalate your status. Unlock superior rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {membershipTiers.map((tier, index) => (
              <div
                key={index}
                // APLICAMOS LAS CLASES DE COLOR Y SHADOW AQUÍ
                className={`flex flex-col border-2 border-gray-100 group transition-all duration-300 ${tier.colors.hoverBorder} ${tier.colors.hoverShadow}`} 
              >
                {/* 1. IMAGEN GRANDE Y LIMPIA */}
                <div className="w-full h-72 p-8 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 z-10"></div>
                  <img
                    src={tier.image}
                    alt={`${tier.name} tier`}
                    className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-700 z-0"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = '<div class="text-gray-200 text-8xl font-black opacity-20">★</div>';
                    }}
                  />
                </div>

                {/* 2. CONTENIDO */}
                <div className="p-8 text-center flex-grow flex flex-col bg-white relative z-20">
                  {/* Nombre del Tier */}
                  {/* Usamos tier.colors.hoverText */}
                  <h3 className={`text-2xl font-black tracking-[0.15em] uppercase text-black mb-1 transition-colors duration-300 ${tier.colors.hoverText}`}>
                    {tier.name}
                  </h3>
                  
                  {/* Puntos */}
                  <div className="mb-8">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Required Points</span>
                    {/* Usamos tier.colors.hoverBorder para el subrayado */}
                    <span className={`text-lg font-medium text-black border-b-2 border-transparent transition-all duration-300 inline-block pb-0.5 ${tier.colors.hoverBorder.replace('hover:', 'group-hover:')}`}>
                        {tier.requiredPoints}
                    </span>
                  </div>

                  {/* Lista de Beneficios */}
                  <ul className="space-y-4 text-left mt-auto border-t border-gray-100 pt-6">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      // Usamos tier.colors.hoverText para el punto
                      <li key={benefitIndex} className={`flex items-start text-xs text-gray-600 transition-colors duration-300 ${tier.colors.hoverText}`}>
                        <span className="mr-3 font-bold">•</span>
                        <span className="uppercase tracking-wide leading-relaxed text-black">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
            Ready to Join?
          </h2>
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-12 max-w-xl mx-auto">
            Start your journey today. Sign up now and receive 200 complimentary credits.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/register">
              <button className="bg-white text-black px-12 py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white border border-white transition-all duration-300 w-full sm:w-auto">
                Join Now
              </button>
            </Link>
            <Link to="/faq">
              <button className="bg-transparent text-white border border-white px-12 py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto">
                Learn More
              </button>
            </Link>
          </div>

          <div className="text-gray-500 text-xs uppercase tracking-widest">
            <p className="mb-2">Already a member?</p>
            <Link
              to="/login"
              className="text-white border-b border-white pb-0.5 hover:text-gray-300 hover:border-gray-300 transition-all"
            >
              Log in to view rewards
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MembersClub;