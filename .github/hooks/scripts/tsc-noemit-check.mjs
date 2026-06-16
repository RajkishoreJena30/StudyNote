#!/usr/bin/env node
// PostToolUse hook: after the agent edits a TypeScript file inside a
// nama-yatra microservice, run `tsc --noEmit` for that service and BLOCK
// (exit 2) with the reported errors if the type check fails.
//
// Cross-platform: invoked as `node .github/hooks/scripts/tsc-noemit-check.mjs`.
// Reads the hook payload as JSON on stdin; emits a JSON block decision on stdout.

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";

function readStdin() {
    return new Promise((res) => {
        let data = "";
        process.stdin.setEncoding("utf8");
        process.stdin.on("data", (c) => (data += c));
        process.stdin.on("end", () => res(data));
        // Nothing piped (manual run) — don't hang.
        setTimeout(() => res(data), 100);
    });
}

// Only run for tools that actually modify files.
const EDIT_TOOL = /edit|replace|create_file|insert|write|apply_patch|patch/i;

// Recursively collect string values that look like .ts/.tsx file paths.
function collectTsPaths(value, out) {
    if (value == null) return;
    if (typeof value === "string") {
        if (/\.tsx?$/.test(value)) out.add(value);
        return;
    }
    if (Array.isArray(value)) {
        for (const v of value) collectTsPaths(v, out);
        return;
    }
    if (typeof value === "object") {
        for (const v of Object.values(value)) collectTsPaths(v, out);
    }
}

// Walk up to the nearest tsconfig.json, but only inside a nama-yatra service.
function findServiceRoot(filePath) {
    let dir = dirname(resolve(filePath));
    const marker = `${sep}nama-yatra${sep}`;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if ((dir + sep).includes(marker) && existsSync(resolve(dir, "tsconfig.json"))) {
            return dir;
        }
        const parent = dirname(dir);
        if (parent === dir) return null;
        dir = parent;
    }
}

async function main() {
    let input = {};
    try {
        const raw = await readStdin();
        if (raw.trim()) input = JSON.parse(raw);
    } catch {
        process.exit(0); // unparseable payload — never block
    }

    const toolName = input.tool_name ?? input.toolName ?? "";
    if (toolName && !EDIT_TOOL.test(toolName)) process.exit(0);

    const toolInput = input.tool_input ?? input.toolInput ?? input;
    const paths = new Set();
    collectTsPaths(toolInput, paths);

    const roots = new Set();
    for (const p of paths) {
        const root = findServiceRoot(p);
        if (root) roots.add(root);
    }
    if (roots.size === 0) process.exit(0); // no relevant TS edits

    const failures = [];
    for (const root of roots) {
        try {
            execSync("npx tsc --noEmit", { cwd: root, stdio: "pipe", encoding: "utf8" });
        } catch (err) {
            const out = `${err.stdout ?? ""}${err.stderr ?? ""}`.trim();
            failures.push(`${root}\n${out || "tsc failed with no output"}`);
        }
    }

    if (failures.length > 0) {
        process.stdout.write(
            JSON.stringify({
                decision: "block",
                reason:
                    "TypeScript check (tsc --noEmit) failed. Fix these type errors before continuing:\n\n" +
                    failures.join("\n\n"),
            })
        );
        process.exit(2); // blocking error
    }

    process.exit(0);
}

main();
