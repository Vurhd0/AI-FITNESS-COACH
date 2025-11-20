'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import UserForm from '@/components/UserForm'
import PlanDisplay from '@/components/PlanDisplay'
import LandingDashboard from '@/components/LandingDashboard'
import ThemeToggle from '@/components/ThemeToggle'
import { FitnessPlan } from '@/types'

export default function Home() {
  const [plan, setPlan] = useState<FitnessPlan | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load saved plan from localStorage
    const savedPlan = localStorage.getItem('fitnessPlan')
    if (savedPlan) {
      try {
        setPlan(JSON.parse(savedPlan))
        setShowForm(false)
      } catch (e) {
        console.error('Error loading saved plan:', e)
      }
    }
  }, [])

  const handlePlanGenerated = (newPlan: FitnessPlan) => {
    setPlan(newPlan)
    setShowForm(false)
    setError(null)
    // Save to localStorage
    localStorage.setItem('fitnessPlan', JSON.stringify(newPlan))
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setLoading(false)
  }

  const handleGetStarted = () => {
    setShowForm(true)
    setPlan(null)
    localStorage.removeItem('fitnessPlan')
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <ThemeToggle />
      
      <AnimatePresence mode="wait">
        {!plan && !showForm ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingDashboard onGetStarted={handleGetStarted} />
          </motion.div>
        ) : !plan && showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 rounded-r-lg"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-200">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(false)}
              className="mb-8 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-all flex items-center gap-2 text-white"
            >
              ← Back to Dashboard
            </motion.button>

            <UserForm
              onPlanGenerated={handlePlanGenerated}
              onError={handleError}
              loading={loading}
              setLoading={setLoading}
            />
          </motion.div>
        ) : (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 rounded-r-lg"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-200">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {plan && (
              <PlanDisplay
                plan={plan}
                onRegenerate={() => {
                  setPlan(null)
                  setShowForm(false)
                  localStorage.removeItem('fitnessPlan')
                }}
                onError={handleError}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

