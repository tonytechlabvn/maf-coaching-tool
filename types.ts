export interface UserInput {
  goal: string;
  age: string;
  vo2max: string;
  status: string;
  customDistance: string;
  heartRate: string;
  pace: string;
  trainingDays: string;
  targetTime: string;
  trainingDuration: string;
  customTrainingDuration: string;
  stravaProfile: string;
  weight: string;
  height: string;
  gender: string;
  model: string;
}

export interface DailyPlan {
  day: string;
  activity: string;
}

export interface WeeklyPlan {
  week: number;
  focus: string;
  dailyPlan: DailyPlan[];
}

export interface ExpertTip {
  title: string;
  content: string;
}

export interface SupplementaryExercises {
    title: string;
    content: string;
}

export interface Analysis {
  title: string;
  content: string;
}

export interface NutritionGuide {
  title: string;
  content: string;
}

export interface RunningPlan {
  isFeasible: boolean;
  planTitle: string;
  analysis?: Analysis;
  trainingSchedule?: WeeklyPlan[];
  expertTip: ExpertTip;
  supplementaryExercises?: SupplementaryExercises;
  nutritionGuide?: NutritionGuide;
  disclaimer: string;
}