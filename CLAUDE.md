# Claude Instructions

## Language
Always respond in English.

## Communication Style
- Explain what you're doing in simple, plain terms before doing it
- Avoid jargon — if you must use a technical term, define it briefly
- When something might be confusing, add a short "why" explanation

## Before Making Changes
- For small changes (fixing a typo, renaming a variable): just do it
- For bigger changes (new files, restructuring, changing how things work): describe the plan first and ask for approval

## Code Style
- Keep code simple and easy to read — prefer clarity over cleverness
- Use descriptive names for variables and functions (e.g., `getUserName` not `gUN`)
- Add short comments above any logic that isn't immediately obvious
- Don't over-engineer — solve the problem at hand, nothing more

## File Organization
- Create small, focused files — one file should do one thing
- Keep files short (under ~150 lines when possible)
- Split large files into smaller ones rather than letting them grow

## Comments
- Add a comment at the top of each file describing what it does
- Comment any loop, condition, or function that might be hard to follow at a glance
- Keep comments short and in plain English
