---
mode: agent
description: 'FrontendForge — full pipeline: turn a tech-stack input into a complete production-grade frontend plan (14 deliverables).'
---

Run **FrontendForge**. Load and follow the canonical command at
`AI/FrontendForge/Commands/forge-init.prompt.md`, adopting the orchestrator persona in
`AI/FrontendForge/Agents/00-orchestrator.agent.md` and the pipeline in
`AI/FrontendForge/Docs/PIPELINE.md`.

Tech stack / framework: ${input:stack:e.g. React + TypeScript + Micro-Frontend}

Ask only the 2 intake questions (architecture, exclusions), then generate all deliverables. Never assume Next.js; always include AI streaming features.
