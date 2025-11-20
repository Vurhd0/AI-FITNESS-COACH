import jsPDF from 'jspdf'
import { FitnessPlan } from '@/types'

export function exportToPDF(plan: FitnessPlan) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20
  const margin = 20
  const lineHeight = 7

  // Helper function to add new page if needed
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPosition = 20
    }
  }

  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('💪 AI Fitness Coach Plan', margin, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated for: ${plan.userDetails.name}`, margin, yPosition)
  yPosition += 5
  doc.text(`Date: ${new Date(plan.generatedAt).toLocaleDateString()}`, margin, yPosition)
  yPosition += 15

  // User Details
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('User Details', margin, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const userDetails = [
    `Age: ${plan.userDetails.age} | Gender: ${plan.userDetails.gender}`,
    `Height: ${plan.userDetails.height} cm | Weight: ${plan.userDetails.weight} kg`,
    `Fitness Goal: ${plan.userDetails.fitnessGoal}`,
    `Fitness Level: ${plan.userDetails.fitnessLevel}`,
    `Workout Location: ${plan.userDetails.workoutLocation}`,
    `Dietary Preferences: ${plan.userDetails.dietaryPreferences}`,
  ]

  userDetails.forEach((detail) => {
    checkNewPage(lineHeight)
    doc.text(detail, margin, yPosition)
    yPosition += lineHeight
  })
  yPosition += 5

  // Workout Plan
  checkNewPage(20)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('🏋️ Workout Plan', margin, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  plan.workoutPlan.forEach((day) => {
    checkNewPage(15)
    doc.setFont('helvetica', 'bold')
    doc.text(`${day.day} - ${day.focus} (${day.duration})`, margin, yPosition)
    yPosition += 6

    doc.setFont('helvetica', 'normal')
    day.exercises.forEach((exercise) => {
      checkNewPage(8)
      const exerciseText = `${exercise.name}: ${exercise.sets} sets × ${exercise.reps} reps (Rest: ${exercise.rest})`
      doc.text(exerciseText, margin + 5, yPosition)
      yPosition += 5
    })
    yPosition += 3
  })
  yPosition += 5

  // Diet Plan
  checkNewPage(20)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('🥗 Diet Plan', margin, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  // Breakfast
  checkNewPage(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Breakfast:', margin, yPosition)
  yPosition += 6
  doc.setFont('helvetica', 'normal')
  doc.text(`${plan.dietPlan.breakfast.name}`, margin + 5, yPosition)
  yPosition += 5
  const breakfastDesc = doc.splitTextToSize(plan.dietPlan.breakfast.description, pageWidth - 2 * margin - 5)
  breakfastDesc.forEach((line: string) => {
    checkNewPage(lineHeight)
    doc.text(line, margin + 5, yPosition)
    yPosition += lineHeight
  })
  if (plan.dietPlan.breakfast.calories) {
    yPosition += 2
    doc.text(`Calories: ${plan.dietPlan.breakfast.calories} kcal`, margin + 5, yPosition)
    yPosition += lineHeight
  }
  yPosition += 3

  // Lunch
  checkNewPage(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Lunch:', margin, yPosition)
  yPosition += 6
  doc.setFont('helvetica', 'normal')
  doc.text(`${plan.dietPlan.lunch.name}`, margin + 5, yPosition)
  yPosition += 5
  const lunchDesc = doc.splitTextToSize(plan.dietPlan.lunch.description, pageWidth - 2 * margin - 5)
  lunchDesc.forEach((line: string) => {
    checkNewPage(lineHeight)
    doc.text(line, margin + 5, yPosition)
    yPosition += lineHeight
  })
  if (plan.dietPlan.lunch.calories) {
    yPosition += 2
    doc.text(`Calories: ${plan.dietPlan.lunch.calories} kcal`, margin + 5, yPosition)
    yPosition += lineHeight
  }
  yPosition += 3

  // Dinner
  checkNewPage(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Dinner:', margin, yPosition)
  yPosition += 6
  doc.setFont('helvetica', 'normal')
  doc.text(`${plan.dietPlan.dinner.name}`, margin + 5, yPosition)
  yPosition += 5
  const dinnerDesc = doc.splitTextToSize(plan.dietPlan.dinner.description, pageWidth - 2 * margin - 5)
  dinnerDesc.forEach((line: string) => {
    checkNewPage(lineHeight)
    doc.text(line, margin + 5, yPosition)
    yPosition += lineHeight
  })
  if (plan.dietPlan.dinner.calories) {
    yPosition += 2
    doc.text(`Calories: ${plan.dietPlan.dinner.calories} kcal`, margin + 5, yPosition)
    yPosition += lineHeight
  }
  yPosition += 3

  // Snacks
  if (plan.dietPlan.snacks.length > 0) {
    checkNewPage(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Snacks:', margin, yPosition)
    yPosition += 6
    doc.setFont('helvetica', 'normal')
    plan.dietPlan.snacks.forEach((snack) => {
      checkNewPage(8)
      doc.text(`${snack.name}`, margin + 5, yPosition)
      yPosition += 5
      const snackDesc = doc.splitTextToSize(snack.description, pageWidth - 2 * margin - 5)
      snackDesc.forEach((line: string) => {
        checkNewPage(lineHeight)
        doc.text(line, margin + 5, yPosition)
        yPosition += lineHeight
      })
      if (snack.calories) {
        yPosition += 2
        doc.text(`Calories: ${snack.calories} kcal`, margin + 5, yPosition)
        yPosition += lineHeight
      }
      yPosition += 3
    })
  }

  if (plan.dietPlan.totalCalories) {
    checkNewPage(10)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total Daily Calories: ${plan.dietPlan.totalCalories} kcal`, margin, yPosition)
    yPosition += 10
  }

  // Tips
  if (plan.tips && plan.tips.length > 0) {
    checkNewPage(20)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('💡 Lifestyle Tips', margin, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    plan.tips.forEach((tip) => {
      checkNewPage(8)
      const tipLines = doc.splitTextToSize(`• ${tip}`, pageWidth - 2 * margin)
      tipLines.forEach((line: string) => {
        checkNewPage(lineHeight)
        doc.text(line, margin, yPosition)
        yPosition += lineHeight
      })
      yPosition += 2
    })
  }

  // Motivation
  if (plan.motivation && plan.motivation.length > 0) {
    checkNewPage(20)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('✨ Daily Motivation', margin, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    plan.motivation.forEach((quote) => {
      checkNewPage(8)
      const quoteLines = doc.splitTextToSize(`"${quote}"`, pageWidth - 2 * margin)
      quoteLines.forEach((line: string) => {
        checkNewPage(lineHeight)
        doc.text(line, margin, yPosition)
        yPosition += lineHeight
      })
      yPosition += 5
    })
  }

  // Save PDF
  const fileName = `Fitness_Plan_${plan.userDetails.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

