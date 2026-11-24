# Scoring

Each job gets a rules score (0-100). Jobs that overlap with the profile and score 40 or more
also get a second opinion from a local model. Final score = 0.6 * rules + 0.4 * AI. If the AI
call fails or returns something invalid, the rules score is used.

| Part | Points |
|---|---|
| Skills (matched / detected in the job text) | 50 |
| Role (title matches a target role) | 20 |
| Location or work mode | 15 |
| Seniority and years of experience | 15 |

Caps: avoided keyword in the title limits the score to 20. A job that lists skills but none of
your must-have skills is limited to 40.

## Versions
- v1: first version.
- v2: jobs with no known skills get 8 skill points instead of 20; the model is only called when the
  job overlaps with the profile by skill or role; profile skills typed as one long string are still
  recognised. Older v1 rows are kept; the dashboard shows the latest row per job.

Scores are estimates, not a guarantee of any outcome.
