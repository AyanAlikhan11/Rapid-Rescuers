"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  StarIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";

type Testimonial = {
  name: string;
  role: string;
  message: string;
  media: string; // image or video
  verified?: boolean;
};

const testimonials: Testimonial[] = [
  {
    name: "Ayan",
    role: "Blood Recipient",
    message:
      "This platform helped us find blood in just 10 minutes. Truly life-saving!",
    media: "/testimonials/ayan.jpg",
  },
  {
    name: "AIIMS Kalyani",
    role: "Hospital",
    message:
      "Extremely reliable during emergencies. The response time is impressive.",
    media: "/testimonials/hospital.jpeg",
    verified: true,
  },
  {
    name: "Volunteer",
    role: "Blood Donor",
    message:
      "I donated blood after seeing how fast help reaches people. Amazing system.",
    media: "/testimonials/volunteer.mp4",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = testimonials[index];
  const isVideo = t.media.endsWith(".mp4");
  const imageOnLeft = index % 2 === 0;

  // 🔁 Auto slide (pause aware)
  useEffect(() => {
    if (paused) return;

    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, paused]);

  // 📱 Swipe handling
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -100) {
      setIndex((prev) => (prev + 1) % testimonials.length);
    } else if (info.offset.x > 100) {
      setIndex((prev) =>
        prev === 0 ? testimonials.length - 1 : prev - 1
      );
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-red-50 to-white">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">What People Say</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Trusted voices from real users & hospitals across India.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className={`grid md:grid-cols-2 items-center gap-10 bg-white rounded-3xl shadow-xl overflow-hidden ${
              imageOnLeft ? "" : "md:flex-row-reverse"
            }`}
          >
            {/* IMAGE / VIDEO */}
            <div
              className={`relative h-[320px] md:h-full w-full ${
                imageOnLeft ? "md:order-1" : "md:order-2"
              }`}
            >
              {isVideo ? (
                <video
                  src={t.media}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={t.media}
                  alt={t.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}

              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <PlayCircleIcon className="w-16 h-16 text-white opacity-80" />
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className={`p-10 ${imageOnLeft ? "md:order-2" : "md:order-1"}`}>
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-red-500 mb-4" />

              <p className="text-lg italic text-gray-600 mb-6 leading-relaxed">
                “{t.message}”
              </p>

              {/* Stars */}
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 text-lg">{t.name}</p>
                {t.verified && (
                  <CheckBadgeIcon
                    className="w-5 h-5 text-blue-500"
                    title="Verified Hospital"
                  />
                )}
              </div>

              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-12 text-center text-sm text-gray-500">
        Swipe, hover, or relax — testimonials auto-play ✨
      </p>
    </section>
  );
}
