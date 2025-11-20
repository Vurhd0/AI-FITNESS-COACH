'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserDetails, FitnessPlan } from '@/types'
import { generatePlan } from '@/lib/api'
import { Sparkles, Loader2 } from 'lucide-react'

interface UserFormProps {
  onPlanGenerated: (plan: FitnessPlan) => void
  onError: (error: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export default function UserForm({ onPlanGenerated, onError, loading, setLoading }: UserFormProps) {
  const [formData, setFormData] = useState<Partial<UserDetails>>({
    fitnessGoal: 'General Fitness',
    fitnessLevel: 'Beginner',
    workoutLocation: 'Home',
    dietaryPreferences: 'Vegetarian',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'weight' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.age || !formData.gender || !formData.height || !formData.weight) {
      onError('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const plan = await generatePlan(formData as UserDetails)
      onPlanGenerated(plan)
    } catch (error: any) {
      onError(error.message || 'Failed to generate plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-gray-900 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-800">
                <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Create Your Plan
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></span>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                  required
                  min="1"
                  max="120"
                  placeholder="Your age"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Height (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height || ''}
                  onChange={handleChange}
                  required
                  min="50"
                  max="250"
                  placeholder="Your height"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  required
                  min="20"
                  max="300"
                  placeholder="Your weight"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Fitness Goals Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></span>
              Fitness Goals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Fitness Goal <span className="text-red-500">*</span>
                </label>
                <select
                  name="fitnessGoal"
                  value={formData.fitnessGoal || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Endurance">Endurance</option>
                  <option value="General Fitness">General Fitness</option>
                  <option value="Flexibility">Flexibility</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Fitness Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="fitnessLevel"
                  value={formData.fitnessLevel || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Workout Location <span className="text-red-500">*</span>
                </label>
                <select
                  name="workoutLocation"
                  value={formData.workoutLocation || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="Home">Home</option>
                  <option value="Gym">Gym</option>
                  <option value="Outdoor">Outdoor</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Dietary Preferences <span className="text-red-500">*</span>
                </label>
                <select
                  name="dietaryPreferences"
                  value={formData.dietaryPreferences || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Keto">Keto</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Stress Level
                </label>
                <select
                  name="stressLevel"
                  value={formData.stressLevel || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">Select (Optional)</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></span>
              Additional Information (Optional)
            </h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Medical History
              </label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory || ''}
                onChange={handleChange}
                rows={4}
                placeholder="Any medical conditions, injuries, or concerns..."
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-4 px-6 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Your Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate My Fitness Plan</span>
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}
