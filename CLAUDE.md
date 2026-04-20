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

## Universal Workflow Memory (Claude + Copilot)
- ACT mode first: execute directly and avoid unnecessary planning.
- Do not spawn subagents unless the user explicitly asks.
- Do not run no-op checks.
- Patch requested files directly and keep communication concise.
- Run `npm run build` after code edits unless the user asks for another command.
- If the user asks for dev/live verification, run `npm run dev`.
- For release tasks (when requested):
	- `git add .`
	- `git commit -m "<requested message or concise summary>"`
	- `git push origin main`
	- Deploy on request with `npx vercel --prod --yes`
- In status updates, report exact changed files and command results.
