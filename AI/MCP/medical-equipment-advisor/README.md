# Medical Equipment Advisor — MCP Server

An MCP (Model Context Protocol) server that helps **medical-equipment vendors** and hospital planners answer:

> *"Which machine should I buy for X patients per day suffering from disease Y, within budget Z?"*

Built with **Node.js + TypeScript + `@modelcontextprotocol/sdk`**.

---

## What it does

Given a **disease**, **daily patient volume** and an optional **budget**, the server:

1. Matches the disease against a catalog of ~25 conditions
2. Finds *required* + *optional* equipment
3. Calculates how many **units** are needed to cover patient volume
4. Ranks options by a score (coverage, cost efficiency, budget fit)
5. Returns total upfront cost, annual maintenance and reasoning per option

---

## Tools exposed

| Tool | Purpose |
|---|---|
| `recommend_equipment` | Main tool — recommend machines for a disease + volume + budget |
| `list_diseases` | Browse supported diseases (optionally by category) |
| `list_equipment` | Search catalog by text/category/price/capacity |
| `get_equipment_details` | Full spec sheet of one machine |
| `compare_equipment` | Side-by-side comparison table |
| `estimate_roi` | Revenue, maintenance, payback period for N units |

## Resources exposed

- `medadvisor://catalog/equipment` — full equipment JSON
- `medadvisor://catalog/diseases` — full disease JSON

---

## Project structure

```
medical-equipment-advisor/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # MCP server + tool registry
    ├── types/index.ts        # Shared types
    ├── data/
    │   ├── equipment.ts      # 15 machines (MRI, CT, dialysis, ventilator…)
    │   └── diseases.ts       # 27 diseases mapped to required equipment
    └── utils/recommend.ts    # Recommendation engine + ROI + compare
```

---

## Run locally

The server supports **two transports** — pick one:

### 🔌 Option A — stdio (default, for local integration)

```powershell
cd AI/MCP/medical-equipment-advisor
npm install
npm run build     # produces dist/index.js
npm start         # runs the compiled server on stdio
# or for dev with hot reload:
npm run dev
```

The server communicates via **stdio JSON-RPC** — you won't see interactive output.
It logs `[medical-equipment-advisor] MCP server started on stdio` to stderr and waits for requests.

### 🌐 Option B — HTTP (real server on localhost)

```powershell
cd AI/MCP/medical-equipment-advisor
npm install
npm run build
npm run start:http           # → http://localhost:3003/mcp
# or dev mode:
npm run dev:http
```

Endpoints:
- **MCP endpoint:** `POST/GET http://localhost:3003/mcp` (JSON-RPC over Streamable HTTP)
- **Health check:** `GET http://localhost:3003/health`

Customize with env vars:
```powershell
$env:MCP_HTTP_PORT = "4000"
$env:MCP_HTTP_PATH = "/medical-equipment-advisor"
npm run start:http
# → http://localhost:4000/medical-equipment-advisor
```

Quick smoke test:
```powershell
Invoke-RestMethod http://localhost:3003/health
```

---

## Connect to VS Code / Copilot

A workspace config is already created at [.vscode/mcp.json](../../../.vscode/mcp.json).

**For HTTP mode (recommended — no per-call approval prompts):**

```json
{
  "servers": {
    "medical-equipment-advisor": {
      "type": "http",
      "url": "http://localhost:3003/mcp"
    }
  }
}
```

**For stdio mode:**

```json
{
  "servers": {
    "medical-equipment-advisor": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/AI/MCP/medical-equipment-advisor/dist/index.js"]
    }
  }
}
```

**Activate it:**
1. Open the Command Palette → `MCP: List Servers`
2. Start the `medical-equipment-advisor` server
3. In Copilot Chat, select **Agent** mode → the tools appear under the tools picker (🛠️ icon)

---

## How to use it in this chat right now

1. **Open Command Palette** (`Ctrl+Shift+P`) → `MCP: List Servers`
2. Click **`medical-equipment-advisor`** → **Start Server**
3. In Copilot Chat, switch to **Agent** mode
4. Click the 🛠️ tools icon → verify the 6 tools appear under `medical-equipment-advisor`
5. Ask questions like:
   - *"I run a clinic expecting 80 diabetes patients/day, budget $100k — what should I buy?"*
   - *"Recommend equipment for 40 kidney-failure patients/day, prioritize cost."*
   - *"Compare mri-1-5t, mri-3t, ct-64."*
   - *"If I buy 10 dialysis machines and charge $180/session, what's my payback?"*

---

## Connect to Claude Desktop

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "medical-equipment-advisor": {
      "command": "node",
      "args": ["C:\\Views\\Other\\StudyNote\\AI\\MCP\\medical-equipment-advisor\\dist\\index.js"]
    }
  }
}
```

Restart Claude Desktop.

---

## Example prompts

Once the server is connected, try:

- *"I run a small clinic expecting 40 diabetes patients per day with a $60,000 budget — what should I buy?"*
- *"Recommend equipment for 100 kidney-failure patients per day."*
- *"Compare MRI 1.5T vs MRI 3T vs CT 64-slice."*
- *"If I buy 10 dialysis machines and charge $180 per session, what's my payback period?"*
- *"List all oncology equipment under $500,000."*

---

## Extending

- Add more equipment → edit [src/data/equipment.ts](src/data/equipment.ts)
- Add more diseases → edit [src/data/diseases.ts](src/data/diseases.ts)
- Tweak scoring → [src/utils/recommend.ts](src/utils/recommend.ts) `recommend()` function
- Plug into a real database (Prisma/Postgres) → replace the imports in `utils/recommend.ts`

---

## Sample output (recommend_equipment)

```json
{
  "disease": "diabetes",
  "patientsPerDay": 80,
  "budgetUSD": 100000,
  "matchedDiseases": [{ "id": "diabetes", "name": "Diabetes Mellitus" }],
  "recommendations": [
    {
      "equipment": { "id": "glucose-analyzer", "name": "HbA1c Glucose Analyzer", "priceUSD": 18000 },
      "score": 92.4,
      "reason": "Required • 1 unit covers ~80 patients/day • Within budget ($18,000 / $100,000)",
      "unitsSuggested": 1,
      "totalUpfrontUSD": 18000,
      "annualMaintenanceUSD": 2400
    },
    {
      "equipment": { "id": "blood-analyzer", "name": "Automated Hematology Analyzer", "priceUSD": 55000 },
      "score": 88.1,
      "reason": "Required • 1 unit covers ~200 patients/day • Within budget",
      "unitsSuggested": 1,
      "totalUpfrontUSD": 55000
    }
  ],
  "summary": "Matched 1 disease(s): Diabetes Mellitus. Minimum viable setup for 80 patients/day = $73,000 across 2 required machine types. Budget: $100,000 — FITS ✓."
}
```
