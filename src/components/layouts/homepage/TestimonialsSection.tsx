import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Chioma Adeleke",
    role: "Computer Science Student",
    university: "Covenant University",
    image: "https://ui-avatars.com/api/?name=Chioma+Adeleke&background=6366f1&color=fff",
    rating: 5,
    text: "Univyx has completely transformed my campus experience! From finding study materials to connecting with fellow gamers, everything I need is in one place.",
  },
  {
    name: "David Okonkwo",
    role: "Business Administration",
    university: "Babcock University",
    image: "https://ui-avatars.com/api/?name=David+Okonkwo&background=8b5cf6&color=fff",
    rating: 5,
    text: "I landed my first internship through Univyx Jobs! The platform made it so easy to find verified opportunities tailored for students.",
  },
  {
    name: "Fatima Ibrahim",
    role: "Mass Communication",
    university: "American University of Nigeria",
    image: "https://ui-avatars.com/api/?name=Fatima+Ibrahim&background=ec4899&color=fff",
    rating: 5,
    text: "The entertainment section keeps me updated on all campus events. I've never missed a concert or workshop since joining Univyx!",
  },
  {
    name: "Emmanuel Nwosu",
    role: "Engineering Student",
    university: "Bells University",
    image: "https://ui-avatars.com/api/?name=Emmanuel+Nwosu&background=10b981&color=fff",
    rating: 5,
    text: "Competing in esports tournaments through Univyx has been amazing! The platform brings together gamers from different universities.",
  },
  {
    name: "Blessing Adeyemi",
    role: "Law Student",
    university: "Bowen University",
    image: "https://ui-avatars.com/api/?name=Blessing+Adeyemi&background=f59e0b&color=fff",
    rating: 5,
    text: "The student store feature is a lifesaver! I can easily find and purchase everything I need for campus life at great prices.",
  },
  {
    name: "Michael Eze",
    role: "Medical Student",
    university: "Igbinedion University",
    image: "https://ui-avatars.com/api/?name=Michael+Eze&background=3b82f6&color=fff",
    rating: 5,
    text: "Univyx's academic resources section has been invaluable for my studies. The past questions and tutorials are top-notch!",
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Loved by Students Nationwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what students are saying about their Univyx experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-100" />
              
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-gray-500">{testimonial.university}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-2 mt-8"
        >
          {testimonials.slice(0, 6).map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex % 6 ? "bg-blue-600 w-8" : "bg-gray-300"
              }`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
