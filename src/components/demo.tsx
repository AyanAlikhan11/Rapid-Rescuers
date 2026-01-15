'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Hospital {
  id: number
  name: string
  location: string
  icon: string
  specialties: string[]
  description: string
  stats: {
    label: string
    value: string
  }[]
}

const hospitals: Hospital[] = [
  {
    id: 1,
    name: 'City General Hospital',
    location: 'New York, NY',
    icon: 'fa-hospital',
    specialties: ['Cardiology', 'Neurology', 'Oncology'],
    description:
      'A leading multi-specialty hospital providing comprehensive healthcare services for over 50 years.',
    stats: [
      { label: 'Beds', value: '500+' },
      { label: 'Doctors', value: '200+' }
    ]
  },
  {
    id: 2,
    name: 'Heart Care Institute',
    location: 'Los Angeles, CA',
    icon: 'fa-heartbeat',
    specialties: ['Cardiac Surgery', 'Interventional'],
    description:
      'Specialized cardiac care center with state-of-the-art facilities and renowned heart specialists.',
    stats: [
      { label: 'Surgeries', value: '15K+' },
      { label: 'Success Rate', value: '98%' }
    ]
  },
  {
    id: 3,
    name: "Children's Medical Center",
    location: 'Chicago, IL',
    icon: 'fa-baby',
    specialties: ['Pediatrics', 'Neonatal Care', 'Child Psychology'],
    description:
      'Dedicated to providing exceptional healthcare for infants, children, and adolescents.',
    stats: [
      { label: 'Beds', value: '300+' },
      { label: 'Kids Treated', value: '50K+' }
    ]
  }
]

export default function PartnerHospitals() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((p) => (p + 1) % hospitals.length)
  const prev = () =>
    setCurrent((p) => (p - 1 + hospitals.length) % hospitals.length)

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* FLOATING GLOW */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.35),transparent_60%)] blur-3xl"
      />

      {/* HERO */}
      <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm text-cyan-300"
        >
          <i className="fas fa-handshake" />
          Trusted Partnerships
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-extrabold md:text-6xl"
        >
          Our Partner{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Hospitals
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-6 max-w-2xl text-lg text-white/70"
        >
          We collaborate with leading healthcare institutions to provide trusted,
          world-class medical services.
        </motion.p>

        <div className="mt-10 flex gap-10">
          {[
            ['50+', 'Hospitals'],
            ['1M+', 'Patients'],
            ['15+', 'Cities']
          ].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{v}</div>
              <div className="text-sm text-white/60">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CAROUSEL */}
      <section className="relative z-10 mt-24 flex items-center justify-center">
        <button
          onClick={prev}
          className="absolute left-6 rounded-full bg-white/10 p-3 backdrop-blur hover:bg-white/20"
        >
          <i className="fas fa-chevron-left" />
        </button>

        <div className="relative h-[480px] w-[340px]">
          <AnimatePresence>
            {hospitals.map(
              (h, i) =>
                i === current && (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, scale: 0.85, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.45 }}
                    className="absolute inset-0 flex flex-col rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl"
                  >
                    <span className="mb-3 self-start rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-300">
                      ✔ Verified
                    </span>

                    <div className="mb-4 text-4xl text-cyan-400">
                      <i className={`fas ${h.icon}`} />
                    </div>

                    <h3 className="text-xl font-bold">{h.name}</h3>

                    <p className="mt-1 text-sm text-white/60">
                      <i className="fas fa-map-marker-alt mr-1 text-cyan-400" />
                      {h.location}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {h.specialties.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs text-cyan-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-sm text-white/60">
                      {h.description}
                    </p>

                    <div className="mt-auto flex justify-between pt-6">
                      {h.stats.map((s) => (
                        <div key={s.label}>
                          <div className="text-lg font-bold text-cyan-400">
                            {s.value}
                          </div>
                          <div className="text-xs text-white/50">
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={next}
          className="absolute right-6 rounded-full bg-white/10 p-3 backdrop-blur hover:bg-white/20"
        >
          <i className="fas fa-chevron-right" />
        </button>
      </section>

      {/* CTA */}
      <section className="relative z-10 mt-28 flex flex-col items-center px-6 pb-24 text-center">
        <motion.i
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="fas fa-hospital-user mb-6 text-6xl text-cyan-400"
        />

        <h2 className="text-4xl font-bold">
          Ready to{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Get Started?
          </span>
        </h2>

        <p className="mt-4 max-w-xl text-white/70">
          Connect with our partner hospitals and book appointments instantly.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="mt-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-3 font-semibold text-black shadow-lg"
        >
          Book Appointment
        </motion.button>
      </section>
    </div>
  )
}


