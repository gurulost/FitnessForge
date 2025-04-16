import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

async function runSchemaSync() {
  console.log("Creating database tables...");
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });
  
  // Define queries for creating tables
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        is_onboarded BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Users table created");

    // Create user_profiles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        age INTEGER,
        sex TEXT,
        height_feet INTEGER,
        height_inches INTEGER,
        weight INTEGER,
        fitness_level TEXT,
        primary_goal TEXT,
        workout_frequency INTEGER,
        preferred_workout_type TEXT,
        equipment_access TEXT,
        medical_conditions TEXT,
        body_fat INTEGER,
        bmi INTEGER,
        resting_heart_rate INTEGER,
        max_bench_press INTEGER,
        max_squat INTEGER,
        mile_time INTEGER,
        daily_calories INTEGER,
        protein_goal INTEGER,
        water_intake INTEGER,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("User profiles table created");

    // Create workout_plans table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workout_plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        focus TEXT,
        duration INTEGER NOT NULL,
        workout_type TEXT,
        difficulty TEXT,
        plan_data JSONB,
        ai_feedback TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Workout plans table created");

    // Create exercises table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exercises (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        muscle_group TEXT,
        equipment TEXT,
        difficulty TEXT,
        instructions TEXT,
        video_url TEXT,
        image_url TEXT
      );
    `);
    console.log("Exercises table created");

    // Create logged_workouts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logged_workouts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        workout_plan_id INTEGER REFERENCES workout_plans(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        duration INTEGER,
        notes TEXT,
        rating INTEGER,
        exercise_data JSONB,
        ai_feedback TEXT
      );
    `);
    console.log("Logged workouts table created");

    // Create progress_photos table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS progress_photos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        photo_url TEXT NOT NULL,
        caption TEXT,
        date TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Progress photos table created");

    // Create progress_metrics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS progress_metrics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date TIMESTAMP DEFAULT NOW(),
        weight INTEGER,
        body_fat REAL,
        chest_measurement REAL,
        waist_measurement REAL,
        hips_measurement REAL,
        arms_measurement REAL,
        thighs_measurement REAL
      );
    `);
    console.log("Progress metrics table created");

    console.log("All database tables created successfully!");
    
    // Now add default exercises
    const defaultExercises = [
      {
        name: "Bench Press",
        description: "A compound exercise that targets the chest, shoulders, and triceps",
        muscleGroup: "Chest",
        equipment: "Barbell, Bench",
        difficulty: "Intermediate",
        instructions: "Lie on a bench, lower the bar to your chest, and push it back up"
      },
      {
        name: "Squats",
        description: "A compound exercise that targets the quadriceps, hamstrings, and glutes",
        muscleGroup: "Legs",
        equipment: "Barbell",
        difficulty: "Intermediate",
        instructions: "Stand with feet shoulder-width apart, bend your knees, and lower your body as if sitting in a chair"
      },
      {
        name: "Deadlift",
        description: "A compound exercise that targets the back, hamstrings, and glutes",
        muscleGroup: "Back",
        equipment: "Barbell",
        difficulty: "Advanced",
        instructions: "Stand with feet hip-width apart, bend at the hips and knees to grip the bar, and lift by extending your hips and knees"
      },
      {
        name: "Pull-ups",
        description: "A compound exercise that targets the back and biceps",
        muscleGroup: "Back",
        equipment: "Pull-up bar",
        difficulty: "Intermediate",
        instructions: "Hang from a bar with palms facing away from you, pull your body up until your chin is over the bar"
      },
      {
        name: "Push-ups",
        description: "A bodyweight exercise that targets the chest, shoulders, and triceps",
        muscleGroup: "Chest",
        equipment: "None",
        difficulty: "Beginner",
        instructions: "Start in a plank position, lower your body until your chest nearly touches the floor, then push back up"
      }
    ];
    
    // Check if exercises table is empty
    const exercisesCount = await pool.query('SELECT COUNT(*) FROM exercises');
    if (parseInt(exercisesCount.rows[0].count) === 0) {
      console.log("Adding default exercises...");
      
      for (const exercise of defaultExercises) {
        await pool.query(`
          INSERT INTO exercises (name, description, muscle_group, equipment, difficulty, instructions)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          exercise.name,
          exercise.description,
          exercise.muscleGroup,
          exercise.equipment,
          exercise.difficulty,
          exercise.instructions
        ]);
      }
      
      console.log("Default exercises added successfully!");
    }
    
  } catch (error) {
    console.error("Error creating database tables:", error);
  } finally {
    await pool.end();
  }
}

runSchemaSync();