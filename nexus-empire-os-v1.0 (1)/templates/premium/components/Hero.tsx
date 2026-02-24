'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl sm:text-7xl font-bold text-white mb-6"
        >
          {headline}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
        >
          {subheadline}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition">
            Start Free Trial
          </button>
          <button className="px-8 py-4 bg-slate-700 text-white rounded-full font-semibold text-lg hover:bg-slate-600 transition">
            Learn More
          </button>
        </motion.div>
      </div>
    </section>
  )
}
