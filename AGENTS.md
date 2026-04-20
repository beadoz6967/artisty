<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Universal Workflow Memory (Claude + Copilot)

Use this workflow by default unless the user explicitly overrides it.

## Operating Mode
- ACT mode first: execute directly, do not stall in planning.
- Do not spawn subagents unless the user explicitly asks for a subagent.
- Do not run no-op/probe loops.

## Execution Pattern
- Edit files directly in the requested target components/styles.
- Keep explanations short and practical.
- Only do extra research when the user asks for research.

## Validation
- After code changes, run `npm run build` unless the user asks for a different command.
- If the user asks for live check/dev mode, run `npm run dev`.

## Release Flow (when requested)
- `git add .`
- `git commit -m "<requested message or concise summary>"`
- `git push origin main`
- Deploy only when requested: `npx vercel --prod --yes`

## Response Style
- Report exactly what changed.
- Include command outcomes clearly.
- Keep momentum: fix-forward instead of over-discussing.
