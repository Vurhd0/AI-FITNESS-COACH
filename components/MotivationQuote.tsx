'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw } from 'lucide-react'

const defaultQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can do it. It's your mind you need to convince.",
  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
  "Take care of your body. It's the only place you have to live.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't stop when you're tired. Stop when you're done.",
  "Success is the sum of small efforts repeated day in and day out.",
]

export default function MotivationQuote() {
  const [quote, setQuote] = useState(defaultQuotes[0])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Rotate quotes every 12 seconds
    const interval = setInterval(() => {
      const randomQuote = defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)]
      setQuote(randomQuote)
    }, 12000)

    return () => clearInterval(interval)
  }, [])

  const fetchAIMotivation = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/motivation-quote')
      if (response.ok) {
        const data = await response.json()
        setQuote(data.quote)
      }
    } catch (error) {
      console.error('Error fetching motivation quote:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="max-w-4xl mx-auto mb-8 sm:mb-12"
    >
      <div className="glass-effect rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-white/10 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-indigo-500/20"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                Daily Motivation
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={fetchAIMotivation}
              disabled={loading}
              className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              title="Get new AI motivation"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              )}
            </motion.button>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.p
              key={quote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-800 dark:text-white leading-relaxed"
            >
              &quot;{quote}&quot;
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
