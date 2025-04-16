import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const MODEL = 'claude-3-7-sonnet-20250219';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Generate a personalized workout plan based on user profile and goals
export async function generateWorkoutPlan(userProfile: any): Promise<any> {
  try {
    const systemPrompt = `You are an expert fitness coach and exercise scientist specializing in creating personalized workout plans.
Based on the user profile information provided, create a detailed, scientifically-backed workout plan.
Your response should be in JSON format with the following structure:
{
  "planName": "Name of the plan",
  "planDescription": "Brief description of the plan",
  "duration": "Duration in weeks",
  "focus": "Main focus of the plan",
  "workoutDays": [
    {
      "day": "Day name (e.g. Monday)",
      "focus": "Focus of this day's workout",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": "Number of sets",
          "reps": "Number of reps or duration",
          "notes": "Any tips or form notes"
        }
      ]
    }
  ],
  "recommendations": {
    "nutrition": "Nutrition advice",
    "recovery": "Recovery advice",
    "progression": "Progression advice"
  }
}
Ensure your plan is appropriate for the user's fitness level, goals, and any limitations they have mentioned.`;

    const prompt = `Create a personalized workout plan for a person with the following characteristics:
- Age: ${userProfile.age}
- Sex: ${userProfile.sex}
- Height: ${userProfile.heightFeet}'${userProfile.heightInches}"
- Weight: ${userProfile.weight} lbs
- Fitness Level: ${userProfile.fitnessLevel}
- Primary Goal: ${userProfile.primaryGoal}
- Workout Frequency: ${userProfile.workoutFrequency} days per week
- Preferred Workout Type: ${userProfile.preferredWorkoutType}
- Equipment Access: ${userProfile.equipmentAccess}
- Medical Conditions: ${userProfile.medicalConditions || 'None'}

The plan should be evidence-based and aligned with current exercise science best practices.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      system: systemPrompt,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    // Parse the response to get the JSON structure
    const content = response.content[0].text;
    
    // Extract the JSON portion
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}') + 1;
    const jsonString = content.substring(jsonStart, jsonEnd);
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error generating workout plan:', error);
    throw new Error('Failed to generate workout plan');
  }
}

// Generate feedback for a completed workout
export async function generateWorkoutFeedback(workoutData: any, userProfile: any): Promise<string> {
  try {
    const systemPrompt = `You are an expert fitness coach providing personalized feedback on a user's completed workout.
Analyze the workout data and provide constructive, motivational feedback.
Focus on form improvements, progress observations, and suggestions for the next workout.
Keep your response concise (max 150 words) and encouraging.`;

    const prompt = `Provide feedback for this completed workout:
Workout Name: ${workoutData.name}
Duration: ${workoutData.duration} minutes
User's Fitness Level: ${userProfile.fitnessLevel}
User's Primary Goal: ${userProfile.primaryGoal}

Exercises completed:
${JSON.stringify(workoutData.exerciseData, null, 2)}

Previous performance for comparison (if available):
${workoutData.previousPerformance ? JSON.stringify(workoutData.previousPerformance, null, 2) : 'No previous data available'}

Notes from user: ${workoutData.notes || 'None'}`;

    const response = await anthropic.messages.create({
      model: MODEL,
      system: systemPrompt,
      max_tokens: 250,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.content[0].text.trim();
  } catch (error) {
    console.error('Error generating workout feedback:', error);
    return 'Great job completing your workout! Keep up the good work and stay consistent with your training.';
  }
}

// Generate health insights based on user's progress metrics
export async function generateHealthInsights(progressData: any, userProfile: any): Promise<string> {
  try {
    const systemPrompt = `You are a fitness and health analytics expert providing insights on a user's fitness progress.
Based on the progress data and user profile, provide personalized health insights and recommendations.
Focus on trends, achievements, and actionable advice for continued improvement.
Keep your response concise (max 150 words) and encouraging.`;

    const prompt = `Provide health insights based on this user's progress data:
User Profile:
- Age: ${userProfile.age}
- Sex: ${userProfile.sex}
- Primary Goal: ${userProfile.primaryGoal}
- Fitness Level: ${userProfile.fitnessLevel}

Recent Progress Metrics:
${JSON.stringify(progressData, null, 2)}

Provide insights on their progress and specific recommendations to help them reach their goals.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      system: systemPrompt,
      max_tokens: 250,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.content[0].text.trim();
  } catch (error) {
    console.error('Error generating health insights:', error);
    return 'Your progress is showing positive trends. Continue with your current routine and stay consistent with your workouts and nutrition.';
  }
}

// Answer fitness questions
export async function answerFitnessQuestion(question: string, userProfile: any): Promise<string> {
  try {
    const systemPrompt = `You are a fitness expert answering questions about exercise, nutrition, and overall wellness.
Provide evidence-based, accurate information tailored to the user's profile and needs.
If the question involves medical advice, include a disclaimer to consult a healthcare professional.
Keep your response informative, helpful and concise (max 200 words).`;

    const prompt = `User Profile:
- Age: ${userProfile.age}
- Sex: ${userProfile.sex}
- Fitness Level: ${userProfile.fitnessLevel}
- Primary Goal: ${userProfile.primaryGoal}
- Medical Conditions: ${userProfile.medicalConditions || 'None'}

Question: ${question}

Please provide an informative answer based on current exercise science and best practices.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      system: systemPrompt,
      max_tokens: 350,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.content[0].text.trim();
  } catch (error) {
    console.error('Error answering fitness question:', error);
    return 'I apologize, but I\'m unable to answer your question at the moment. Please try again later.';
  }
}
