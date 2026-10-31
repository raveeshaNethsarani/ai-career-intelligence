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
