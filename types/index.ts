export interface SurveyResponse {
  id: string;
  created_at: string;
  source: string;
  age: number;
  gender: string;
  city: string;
  grade: number;
  daily_screen_time: number;
  primary_device: string;
  learning_percentage: number;
  entertainment_percentage: number;
  social_percentage: number;
  platforms_used: string[];
  skills_learned: string[];
  most_helpful_platform: string;
  creativity_rating: number;
  collaboration_rating: number;
  positive_impact: string;
  hobby_to_skill: boolean;
  hobby_to_skill_detail?: string;
  next_skill_to_learn: string;
  uses_ai_tools: boolean;
  ai_tools_used?: string[];
  ai_learning_rating?: number;
}

export interface ChatMessage { role: "user" | "assistant"; content: string; }
export interface Pledge { id: string; name: string; city?: string; signed_at: string; }
