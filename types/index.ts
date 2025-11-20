export interface UserDetails {
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  height: number // in cm
  weight: number // in kg
  fitnessGoal: 'Weight Loss' | 'Muscle Gain' | 'Endurance' | 'General Fitness' | 'Flexibility'
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced'
  workoutLocation: 'Home' | 'Gym' | 'Outdoor'
  dietaryPreferences: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Keto'
  medicalHistory?: string
  stressLevel?: 'Low' | 'Medium' | 'High'
}

export interface Exercise {
  name: string
  sets: number
  reps: string
  rest: string
  description?: string
}

export interface Meal {
  name: string
  description: string
  calories?: number
}

export interface WorkoutPlan {
  day: string
  exercises: Exercise[]
  duration: string
  focus: string
}

export interface DietPlan {
  breakfast: Meal
  lunch: Meal
  dinner: Meal
  snacks: Meal[]
  totalCalories?: number
}

export interface FitnessPlan {
  userDetails: UserDetails
  workoutPlan: WorkoutPlan[]
  dietPlan: DietPlan
  tips: string[]
  motivation: string[]
  generatedAt: string
}

