'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FitnessPlan } from '@/types'
import { generateSpeech, generateImage } from '@/lib/api'
import { Volume2, Download, RefreshCw, X, Image as ImageIcon, Dumbbell, UtensilsCrossed, Lightbulb, Sparkles } from 'lucide-react'
import { exportToPDF } from '@/lib/pdf'
import { getCachedImage } from '@/lib/api'

interface PlanDisplayProps {
  plan: FitnessPlan
  onRegenerate: () => void
  onError: (error: string) => void
}

export default function PlanDisplay({ plan, onRegenerate, onError }: PlanDisplayProps) {
  const [playingAudio, setPlayingAudio] = useState<'workout' | 'diet' | null>(null)
  const [imageModal, setImageModal] = useState<{ url: string; name: string } | null>(null)
  const [loadingImage, setLoadingImage] = useState<string | null>(null)
  const [cachedImages, setCachedImages] = useState<Record<string, string>>({})

  const handlePlayAudio = async (section: 'workout' | 'diet') => {
    try {
      setPlayingAudio(section)
      const workoutText = plan.workoutPlan
        .map(day => `${day.day}: ${day.exercises.map(e => `${e.name} - ${e.sets} sets of ${e.reps}`).join(', ')}`)
        .join('. ')
      
      const dietText = `Breakfast: ${plan.dietPlan.breakfast.name} - ${plan.dietPlan.breakfast.description}. 
        Lunch: ${plan.dietPlan.lunch.name} - ${plan.dietPlan.lunch.description}. 
        Dinner: ${plan.dietPlan.dinner.name} - ${plan.dietPlan.dinner.description}. 
        Snacks: ${plan.dietPlan.snacks.map(s => s.name).join(', ')}`

      const text = section === 'workout' ? workoutText : dietText
      const audioUrl = await generateSpeech(text, section)
      
      const audio = new Audio(audioUrl)
      audio.onended = () => setPlayingAudio(null)
      audio.onerror = () => {
        setPlayingAudio(null)
        onError('Failed to play audio. Please check your ElevenLabs API key.')
      }
      await audio.play()
    } catch (error: any) {
      setPlayingAudio(null)
      onError(error.message || 'Failed to generate audio')
    }
  }

  const handleImageClick = async (name: string, type: 'exercise' | 'meal') => {
    try {
      // Check cache first (both in-memory and localStorage)
      const cacheKey = `${type}_${name}`
      let cachedUrl = cachedImages[cacheKey]
      
      if (!cachedUrl) {
        let cachedUrl: string | null = cachedImages[cacheKey] ?? null

        if (cachedUrl) {
          setCachedImages(prev => ({ ...prev, [cacheKey]: cachedUrl! }))
        }
      }
      
      if (cachedUrl && cachedUrl !== '' && !cachedUrl.includes('placeholder')) {
        console.log('Using cached image for:', name, cachedUrl)
        setImageModal({ url: cachedUrl, name })
        return
      }
      

      // If not cached, generate new image
      setLoadingImage(name)
      const imageUrl = await generateImage(name, type)
      
      if (imageUrl && imageUrl !== '' && !imageUrl.includes('placeholder')) {
        // Update both in-memory and localStorage cache
        setCachedImages(prev => ({ ...prev, [cacheKey]: imageUrl }))
        setImageModal({ url: imageUrl, name })
      } else {
        onError('Image generation returned empty result. Please check your Freepik API key.')
      }
    } catch (error: any) {
      console.error('Image generation error:', error)
      onError(error.message || 'Failed to generate image. Please check your Freepik API key and try again.')
    } finally {
      setLoadingImage(null)
    }
  }

  const handleExportPDF = () => {
    exportToPDF(plan)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header Actions */}
        <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-800 mb-8">
          <div className="flex flex-wrap gap-4 justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Your Personalized Fitness Plan
              </h2>
              <p className="text-base text-gray-400">
                Generated for <span className="font-semibold text-white">{plan.userDetails.name}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportPDF}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 shadow-lg flex items-center gap-2 font-medium transition-all"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRegenerate}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 shadow-lg flex items-center gap-2 font-medium transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </motion.button>
            </div>
          </div>

          {/* Voice Controls */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-red-600" />
              Listen to Your Plan
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePlayAudio('workout')}
                disabled={playingAudio === 'workout'}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:from-red-600 hover:to-orange-700 disabled:opacity-50 shadow-lg flex items-center justify-center gap-2 font-medium transition-all"
              >
                <Volume2 className="w-5 h-5" />
                {playingAudio === 'workout' ? 'Playing...' : 'Workout Plan'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePlayAudio('diet')}
                disabled={playingAudio === 'diet'}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 disabled:opacity-50 shadow-lg flex items-center justify-center gap-2 font-medium transition-all"
              >
                <Volume2 className="w-5 h-5" />
                {playingAudio === 'diet' ? 'Playing...' : 'Diet Plan'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Workout Plan */}
        <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white">
              Workout Plan
            </h3>
          </div>
          <div className="space-y-6">
            {plan.workoutPlan.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-6 p-5 bg-gray-800 rounded-xl border border-gray-700"
              >
                <div className="mb-4 pb-4 border-b border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">
                        {day.day}
                      </h4>
                      <p className="text-sm text-gray-400">
                        <span className="font-medium text-red-500">{day.focus}</span> • {day.duration}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {day.exercises.map((exercise, exIndex) => (
                    <motion.div
                      key={exIndex}
                      whileHover={{ scale: 1.01, y: -2 }}
                      className="bg-gray-800 rounded-xl p-4 cursor-pointer border border-gray-700 hover:shadow-lg hover:border-red-500 transition-all"
                      onClick={() => handleImageClick(exercise.name, 'exercise')}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-bold text-white text-lg">
                              {exercise.name}
                            </h5>
                            {loadingImage === exercise.name ? (
                              <span className="text-xs text-gray-500">Generating...</span>
                            ) : cachedImages[`exercise_${exercise.name}`] || getCachedImage(exercise.name, 'exercise') ? (
                              <span className="text-xs text-green-500">✓ Cached</span>
                            ) : (
                              <ImageIcon className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          {exercise.description && (
                            <p className="text-sm text-gray-400 mb-3 leading-relaxed">
                              {exercise.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="px-3 py-1 bg-red-900/30 text-red-300 rounded-lg font-medium border border-red-800">
                              {exercise.sets} sets
                            </span>
                            <span className="px-3 py-1 bg-orange-900/30 text-orange-300 rounded-lg font-medium border border-orange-800">
                              {exercise.reps} reps
                            </span>
                            <span className="px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-lg font-medium border border-yellow-800">
                              Rest: {exercise.rest}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Diet Plan */}
        <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white">
              Diet Plan
            </h3>
          </div>
          <div className="space-y-4">
            <MealCard
              meal={plan.dietPlan.breakfast}
              title="Breakfast"
              onImageClick={() => handleImageClick(plan.dietPlan.breakfast.name, 'meal')}
              loadingImage={loadingImage}
            />
            <MealCard
              meal={plan.dietPlan.lunch}
              title="Lunch"
              onImageClick={() => handleImageClick(plan.dietPlan.lunch.name, 'meal')}
              loadingImage={loadingImage}
            />
            <MealCard
              meal={plan.dietPlan.dinner}
              title="Dinner"
              onImageClick={() => handleImageClick(plan.dietPlan.dinner.name, 'meal')}
              loadingImage={loadingImage}
            />
            {plan.dietPlan.snacks.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-3 text-gray-800 dark:text-white">
                  Snacks
                </h4>
                <div className="space-y-2">
                  {plan.dietPlan.snacks.map((snack, index) => (
                    <MealCard
                      key={index}
                      meal={snack}
                      title=""
                      onImageClick={() => handleImageClick(snack.name, 'meal')}
                      loadingImage={loadingImage}
                    />
                  ))}
                </div>
              </div>
            )}
            {plan.dietPlan.totalCalories && (
              <div className="mt-6 p-5 bg-gray-800 rounded-xl border border-gray-700">
                <p className="text-lg font-bold text-white">
                  Total Daily Calories: <span className="text-red-500">{plan.dietPlan.totalCalories} kcal</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        {plan.tips && plan.tips.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
            <h3 className="text-3xl font-bold text-white">
              Lifestyle Tips
            </h3>
            </div>
            <ul className="space-y-3">
              {plan.tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-white/20 dark:border-white/10 hover:shadow-md transition-all"
                >
                  <span className="text-yellow-500 dark:text-yellow-400 mt-0.5 font-bold text-xl">•</span>
                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Motivation */}
        {plan.motivation && plan.motivation.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">
                Daily Motivation
              </h3>
            </div>
            <div className="space-y-4">
              {plan.motivation.map((quote, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-lg sm:text-xl italic text-white leading-relaxed p-4 bg-gray-800 rounded-xl border border-gray-700"
                >
                  &quot;{quote}&quot;
                </motion.p>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Image Modal */}
      {imageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setImageModal(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gray-900 rounded-2xl max-w-5xl max-h-[90vh] overflow-auto relative shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setImageModal(null)}
              className="absolute top-4 right-4 p-3 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 shadow-lg z-10 transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </motion.button>
            <div className="p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
                {imageModal.name}
              </h3>
              <img
                src={imageModal.url}
                alt={imageModal.name}
                className="w-full h-auto rounded-xl shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available'
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

function MealCard({
  meal,
  title,
  onImageClick,
  loadingImage,
}: {
  meal: { name: string; description: string; calories?: number }
  title: string
  onImageClick: () => void
  loadingImage: string | null
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className="bg-gray-800 rounded-xl p-5 cursor-pointer border border-gray-700 hover:shadow-lg hover:border-green-500 transition-all"
      onClick={onImageClick}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          {title && (
            <h4 className="font-bold text-lg mb-2 text-white">
              {title}
            </h4>
          )}
          <div className="flex items-center gap-2 mb-3">
            <h5 className="font-bold text-white text-xl">
              {meal.name}
            </h5>
            {loadingImage === meal.name ? (
              <span className="text-xs text-gray-500">Generating...</span>
            ) : getCachedImage(meal.name, 'meal') ? (
              <span className="text-xs text-green-500">✓ Cached</span>
            ) : (
              <ImageIcon className="w-5 h-5 text-green-500" />
            )}
          </div>
          <p className="text-gray-400 mb-3 leading-relaxed">
            {meal.description}
          </p>
          {meal.calories && (
            <span className="inline-block px-3 py-1 bg-green-900/30 text-green-300 rounded-lg font-semibold text-sm border border-green-800">
              {meal.calories} kcal
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

