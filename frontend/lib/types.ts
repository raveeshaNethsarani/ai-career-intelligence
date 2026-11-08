export type Job = {
  id: number;
  source: string;
  source_url: string;
  title: string;
  company: string | null;
  location: string | null;
  work_mode: "remote" | "hybrid" | "onsite" | "unknown";
  employment_type: string | null;
  posted_at: string | null;
  snippet: string | null;
  final_score: number | null;
  rules_score: number | null;
  ai_score: number | null;
  matched_skills: string[] | null;
  missing_skills: string[] | null;
  reasoning: string | null;
  saved: boolean | null;
  action_status: string | null;
};

export type WorkflowRun = {
  id: number;
  workflow_name: string;
  status: "success" | "partial" | "failed";
  fetched: number;
  rejected: number;
  duplicates: number;
  inserted: number;
  started_at: string;
};

export type Profile = {
  id: number;
  display_name: string;
  target_roles: string[];
  skills: string[];
  must_have: string[];
  avoid_keywords: string[];
  experience_years: number;
  preferred_locations: string[];
  work_modes: string[];
  updated_at: string;
};

export type ProfileInput = Omit<Profile, "id" | "updated_at">;

export type ReportMatch = {
  id: number;
  source: string;
  source_url: string;
  title: string;
  company: string | null;
  location: string | null;
  work_mode: string;
  fetched_at: string;
  final_score: number;
  matched_skills: string[] | null;
  missing_skills: string[] | null;
  reasoning: string | null;
  red_flags: string[] | null;
  needs_review: boolean;
};

export type ReportData = {
  new_jobs: number;
  total_jobs: number;
  scored: number;
  strong: number;
  moderate: number;
  needs_review: number;
  top: ReportMatch[];
  gaps: { skill: string; count: number }[];
};

export type Report = {
  id: number;
  report_date: string;
  title: string;
  markdown: string;
  data: ReportData;
  created_at: string;
};
