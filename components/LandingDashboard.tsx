'use client'

import { motion } from 'framer-motion'
import { Dumbbell, UtensilsCrossed, Sparkles, Target, TrendingUp, Heart, Zap, ArrowRight } from 'lucide-react'

interface LandingDashboardProps {
  onGetStarted: () => void
}

export default function LandingDashboard({ onGetStarted }: LandingDashboardProps) {
  const features = [
    {
      icon: Dumbbell,
      title: 'Personalized Workouts',
      description: 'AI-generated workout plans tailored to your fitness level and goals',
      color: 'from-red-600 to-orange-600',
      delay: 0.1,
    },
    {
      icon: UtensilsCrossed,
      title: 'Custom Diet Plans',
      description: 'Nutrition plans designed for your dietary preferences and goals',
      color: 'from-green-600 to-emerald-600',
      delay: 0.2,
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set and track your fitness goals with AI-powered insights',
      color: 'from-blue-600 to-cyan-600',
      delay: 0.3,
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Monitor your progress with detailed analytics and recommendations',
      color: 'from-purple-600 to-pink-600',
      delay: 0.4,
    },
    {
      icon: Heart,
      title: 'Health Monitoring',
      description: 'Track your health metrics and get personalized recommendations',
      color: 'from-rose-600 to-red-600',
      delay: 0.5,
    },
    {
      icon: Zap,
      title: 'Quick Results',
      description: 'Get your personalized plan in seconds with AI-powered generation',
      color: 'from-yellow-600 to-orange-600',
      delay: 0.6,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="text-7xl sm:text-8xl lg:text-9xl mb-4">💪</div>
          </motion.div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent leading-tight">
            AI FITNESS COACH
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-400 max-w-3xl mx-auto mb-4 font-light">
            Transform Your Body with AI-Powered
          </p>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-8">
            Personalized workout and nutrition plans tailored to your unique goals
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-black rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all flex items-center gap-2 mx-auto"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={onGetStarted}
                className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 cursor-pointer hover:border-gray-700 transition-all overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-xl mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-4 flex items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold">Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-16 sm:mt-20"
        >
          {[
            { number: '10K+', label: 'Active Users' },
            { number: '50K+', label: 'Plans Generated' },
            { number: '95%', label: 'Success Rate' },
            { number: '24/7', label: 'AI Support' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="text-center p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-all"
            >
              <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                {stat.number}
              </div>
              <div className="text-sm sm:text-base text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-16 sm:mt-20"
        >
          <div className="inline-block p-8 sm:p-12 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-3xl">
            <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Ready to Transform Your Fitness?
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Get your personalized AI-powered fitness plan in seconds
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-black rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all flex items-center gap-2 mx-auto"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

