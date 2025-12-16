import React from "react";
import { Star, CheckCircle } from "lucide-react";

const reviews = [
  {
    id: 1,
    author: "Alex M.",
    title: "FAST SHIPPING & GREAT QUALITY",
    text: "Ordered the hoodie on Monday and received it by Wednesday. The packaging was premium and the fit is exactly as described.",
    date: "2 days ago",
  },
  {
    id: 2,
    author: "Sarah J.",
    title: "LOVE THE NEW COLLECTION",
    text: "The denim fits perfectly. Honestly better than some luxury brands I've tried. Will definitely order again.",
    date: "5 days ago",
  },
  {
    id: 3,
    author: "David R.",
    title: "EXCELLENT CUSTOMER SERVICE",
    text: "Had an issue with sizing and the return process was super smooth. The support team was very helpful.",
    date: "1 week ago",
  },
  {
    id: 4,
    author: "Michael B.",
    title: "MY FAVORITE BRAND",
    text: "Third time ordering from Aureum. The quality consistency is unmatched. Highly recommend the heavyweight tees.",
    date: "2 weeks ago",
  },
];

const TrustpilotStar = () => (
  <div className="bg-[#00b67a] p-1">
    <Star className="w-4 h-4 text-white fill-white" />
  </div>
);

const ReviewsSection = () => {
  return (
    <section className="w-full bg-gray-50 py-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
        
        {/* --- HEADER TIPO TRUSTPILOT --- */}
        <div className="flex flex-col items-center justify-center mb-12 space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-gray-900">
            Excellent
          </h2>
          <div className="flex items-center gap-1">
             {/* 5 Estrellas verdes grandes */}
             {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-[#00b67a] p-1.5">
                    <Star className="w-5 h-5 text-white fill-white" />
                </div>
             ))}
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-1 mt-2">
            Based on <strong>485 reviews</strong> on 
            <span className="font-bold flex items-center gap-1 ml-1">
               <Star className="w-4 h-4 text-[#00b67a] fill-[#00b67a]" /> Trustpilot
            </span>
          </div>
        </div>

        {/* --- GRID DE RESEÑAS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
            >
              {/* Estrellas de la review */}
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                   <div key={i} className="bg-[#00b67a] p-0.5">
                      <Star className="w-3 h-3 text-white fill-white" />
                   </div>
                ))}
              </div>

              {/* Título */}
              <h3 className="font-bold text-sm uppercase text-gray-900 mb-2 line-clamp-1">
                {review.title}
              </h3>

              {/* Texto */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                "{review.text}"
              </p>

              {/* Autor y Fecha */}
              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1 font-medium text-gray-900">
                   {review.author} 
                   <CheckCircle className="w-3 h-3 text-gray-400" />
                </div>
                <span>{review.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* --- BOTÓN VER MÁS (Opcional) --- */}
        <div className="text-center mt-10">
            <a href="#" className="text-sm font-bold border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors">
                VIEW ALL REVIEWS
            </a>
        </div>

      </div>
    </section>
  );
};

export default ReviewsSection;