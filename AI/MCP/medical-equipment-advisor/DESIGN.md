# Medical Equipment Advisor — Design & Architecture

A deep-dive into **how** the `medical-equipment-advisor` MCP server was built, **why** each layer exists, and **how** requests flow end-to-end.

> Companion to the [README](README.md) — this document focuses on internal design, not usage.

---

## 1. High-Level Architecture

```mermaid
flowchart LR
    subgraph Client["AI Client"]
        A[VS Code Copilot / Claude Desktop]
    end

    subgraph Transport["Transport Layer"]
        B["Stdio<br/>(JSON-RPC 2.0)"]
    end

    subgraph Server["MCP Server (Node + TS)"]
        C[Server Bootstrap<br/>src/index.ts]
        D[Tools Registry]
        E[Resources Registry]
        F[Zod Input Validation]
        G[Recommendation Engine<br/>src/utils/recommend.ts]
    end

    subgraph Data["Static Data Layer"]
        H[Equipment Catalog<br/>15 machines]
        I[Disease Catalog<br/>27 diseases]
    end

    A <-->|"stdin/stdout<br/>JSON-RPC"| B
    B <--> C
    C --> D
    C --> E
    D --> F
    F --> G
    G --> H
    G --> I
    E --> H
    E --> I
```

**Key idea:** The server is a *pure function of static data* — no DB, no network, no state. This makes it fast, deterministic, and easy to test.

---

## 2. Folder Structure & Responsibilities

```
medical-equipment-advisor/
├── package.json           → ESM module, node ≥ 20, deps: @modelcontextprotocol/sdk + zod
├── tsconfig.json          → NodeNext + strict mode → catches errors at compile time
├── src/
│   ├── index.ts           → ENTRY POINT: transport, tool registry, request handlers
│   ├── types/index.ts     → Shared TS types (single source of truth for shapes)
│   ├── data/
│   │   ├── equipment.ts   → 15 medical machines (price, capacity, diseases…)
│   │   └── diseases.ts    → 27 conditions → required/optional equipment mapping
│   └── utils/recommend.ts → PURE LOGIC: recommend(), compareEquipment(), estimateRoi()
└── dist/                  → Compiled JS (what the AI client actually runs)
```

### Why this layering?

| Layer | Purpose | Analogy |
|---|---|---|
| `index.ts` | Protocol boundary — speaks JSON-RPC | Controller |
| `utils/recommend.ts` | Business logic — pure functions | Service |
| `data/*.ts` | Domain knowledge | Repository (in-memory) |
| `types/` | Contracts | DTOs |

Swap `data/` for a Prisma-backed repo tomorrow → nothing else changes.

---

## 3. Request Lifecycle (End-to-End)

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant AI as AI Client (Copilot)
    participant T as Stdio Transport
    participant S as MCP Server
    participant V as Zod Validator
    participant E as recommend()
    participant D as Data Catalog

    U->>AI: "Recommend equipment for 80 diabetes patients, budget $100k"
    AI->>AI: Decide to call tool `recommend_equipment`
    AI->>T: JSON-RPC: tools/call { name, arguments }
    T->>S: Deserialize request
    S->>V: Validate args against RecommendSchema
    V-->>S: Parsed & typed input
    S->>E: recommend({ disease, patientsPerDay, budgetUSD })
    E->>D: findDiseases("diabetes")
    D-->>E: [{ id: "diabetes", requiredEquipmentIds: [...] }]
    E->>D: Fetch equipment by IDs
    D-->>E: Equipment[]
    E->>E: Score each option (coverage + cost + budget)
    E->>E: Compute units, totalCost, maintenance
    E-->>S: RecommendationResult (ranked)
    S->>T: JSON-RPC response { content: [text] }
    T->>AI: Stream back
    AI->>U: Natural-language answer with numbers
```

**Total round-trip:** ~5–20 ms for typical queries (all in-memory).

---

## 4. The MCP Protocol Layer

### Why JSON-RPC over stdio?

- **stdio** = simplest transport, zero networking config
- **JSON-RPC 2.0** = standard request/response envelope with `id`, `method`, `params`, `result` / `error`
- The `@modelcontextprotocol/sdk` handles framing, correlation, and error formatting

### What the SDK gives us

```ts
new Server(
  { name: "medical-equipment-advisor", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {} } }
);
```

Declaring `capabilities` tells the client *what* the server supports so it advertises the right features.

### The four handlers we register

```mermaid
flowchart TB
    A[Server] --> B["ListToolsRequestSchema<br/>→ 'tools/list'<br/>→ returns 6 tools"]
    A --> C["CallToolRequestSchema<br/>→ 'tools/call'<br/>→ executes the tool"]
    A --> D["ListResourcesRequestSchema<br/>→ 'resources/list'<br/>→ returns 2 URIs"]
    A --> E["ReadResourceRequestSchema<br/>→ 'resources/read'<br/>→ returns JSON blob"]
```

---

## 5. Tools — What & Why

```mermaid
flowchart LR
    subgraph Tools["6 Registered Tools"]
        T1[recommend_equipment<br/>main decision tool]
        T2[list_diseases<br/>browse conditions]
        T3[list_equipment<br/>search catalog]
        T4[get_equipment_details<br/>spec sheet]
        T5[compare_equipment<br/>side-by-side]
        T6[estimate_roi<br/>payback calc]
    end

    T1 -.uses.-> R[recommend]
    T2 -.uses.-> DC[(diseaseCatalog)]
    T3 -.uses.-> EC[(equipmentCatalog)]
    T4 -.uses.-> G[getEquipmentById]
    T5 -.uses.-> C[compareEquipment]
    T6 -.uses.-> RO[estimateRoi]
```

Each tool declares:
1. **`name`** — the AI's function handle
2. **`description`** — helps the AI decide *when* to call it
3. **`inputSchema`** — JSON Schema (generated from Zod via `toJsonSchema()`)

### Why Zod → JSON Schema?

We author schemas in **Zod** because it gives us:
- ✅ Runtime validation
- ✅ TypeScript inference (`z.infer<typeof RecommendSchema>`)
- ✅ Single source of truth

Then we convert to JSON Schema at boot time (`toJsonSchema()`) because MCP requires JSON Schema for `inputSchema`. One authored form, two consumers.

---

## 6. Data Model

```mermaid
erDiagram
    DISEASE ||--o{ EQUIPMENT_LINK : "requires/optional"
    EQUIPMENT_LINK }o--|| EQUIPMENT : "references"

    DISEASE {
        string id PK
        string name
        string category
        string[] requiredEquipmentIds
        string[] optionalEquipmentIds
        string description
    }

    EQUIPMENT {
        string id PK
        string name
        string category
        string vendor
        number priceUSD
        number monthlyMaintenanceUSD
        number patientsPerDay
        number spaceRequiredSqFt
        number powerKW
        number staffRequired
        string[] diseases
        string[] usageFor
        number warrantyYears
        boolean refurbishedAvailable
    }
```

**Bidirectional linking:** each disease lists its equipment IDs, and each equipment lists the diseases it treats. This allows lookups in either direction with no join tables.

---

## 7. The Recommendation Algorithm

This is the heart of the server. Given `{ disease, patientsPerDay, budgetUSD, prioritize }`:

```mermaid
flowchart TB
    Start([Input: disease, patientsPerDay, budget]) --> M[findDiseases: fuzzy match id/name/category]
    M --> Q{matched.length > 0?}
    Q -- no --> Err[Return: 'no match, try list_diseases']
    Q -- yes --> Union[Union required + optional equipment IDs across matches]
    Union --> Loop[For each candidate equipment]
    Loop --> Units["unitsSuggested =<br/>ceil(patientsPerDay / capacity)"]
    Units --> Cost["totalUpfront = units × price<br/>annualMaintenance = units × monthly × 12"]
    Cost --> Score[Compute score]
    Score --> Sort[Sort by score DESC]
    Sort --> Summary[Build human summary + min-viable investment]
    Summary --> Out([RecommendationResult])
```

### Scoring formula

```
score = baseScore(required=50 | optional=15)
      + capacityFit  (0..30)   ← how well N units cover demand
      + costEfficiency (0..25) ← inverse log of cost per patient/day
      - budgetPenalty (30)     ← if over budget
      + priorityBonus (0..15)  ← cost | capacity | coverage weight
```

**Why log-scale for cost?** A machine that costs \$5,000 vs \$50,000 matters far more than \$3M vs \$3.5M — logarithm compresses the tail so cheap machines aren't crushed by absolute-dollar dominance.

### Why `ceil()` for unit count?

You can't buy 0.7 of an MRI scanner. If demand is 80 patients/day and one unit does 60/day → you need `ceil(80/60) = 2` units. The result reports `capacityGapPerDay = 40` (residual under 2 units × 60 = 120, so gap = 0).

---

## 8. Resources — Passive Data Exposure

```mermaid
flowchart LR
    A[AI Client] -->|"resources/list"| B[Server]
    B -->|"[equipment URI, disease URI]"| A
    A -->|"resources/read?uri=..."| B
    B -->|"JSON blob"| A
```

Resources let the AI **browse the raw catalog** without calling a tool — useful for open-ended exploration ("show me everything you have"). URIs:

- `medadvisor://catalog/equipment`
- `medadvisor://catalog/diseases`

Custom scheme (`medadvisor://`) makes them self-identifying and never collides with `file://` / `http://`.

---

## 9. Boot Sequence

```mermaid
sequenceDiagram
    participant N as node dist/index.js
    participant M as main()
    participant SV as new Server(...)
    participant TR as new StdioServerTransport()
    participant IO as process.stdin/stdout

    N->>M: run
    M->>SV: register capabilities
    SV->>SV: setRequestHandler × 4
    M->>TR: create stdio transport
    M->>SV: server.connect(transport)
    SV->>IO: attach to stdin/stdout
    SV->>SV: log "MCP server started" (stderr)
    Note over SV,IO: waits forever for JSON-RPC frames
```

**Critical detail:** all logs go to **stderr** (`console.error`), never stdout. Stdout is reserved for JSON-RPC framing — a stray `console.log` would corrupt the protocol.

---

## 10. Build & Deployment Pipeline

```mermaid
flowchart LR
    A[src/*.ts] -->|tsc| B[dist/*.js]
    B -->|node dist/index.js| C[Running MCP Server]
    D[.vscode/mcp.json] -->|"references dist path"| E[VS Code MCP Manager]
    E -->|spawn child_process| C
    F[Copilot Chat] <-->|stdio| C
```

**Why compile ahead of time?**
- Faster startup (no TS transform on every spawn)
- Same shipping artifact works for Claude Desktop, Cursor, VS Code, CI
- `tsx` is only for local dev (`npm run dev`)

---

## 11. How the Client Discovers the Server

```mermaid
sequenceDiagram
    participant U as User (Ctrl+Shift+P)
    participant VS as VS Code
    participant CFG as .vscode/mcp.json
    participant P as node process
    participant AI as Copilot Agent

    U->>VS: "MCP: List Servers"
    VS->>CFG: read config
    U->>VS: click "Start"
    VS->>P: spawn 'node dist/index.js'
    P->>P: connect stdio transport
    VS->>P: JSON-RPC initialize
    P-->>VS: capabilities + tools list
    U->>AI: opens Copilot Chat (Agent mode)
    AI->>VS: discover MCP tools
    VS-->>AI: 6 tools available
    Note over AI: Now the LLM can call our tools when relevant
```

---

## 12. Design Trade-offs & Decisions

| Decision | Chosen | Alternative | Why |
|---|---|---|---|
| Transport | stdio | HTTP/SSE | Simplest for local dev; no port conflicts |
| Language | Node + TS | Python | User asked for it + strong MCP SDK |
| Data | Static TS arrays | Postgres/Prisma | Zero setup; swappable later |
| Validation | Zod | Manual checks | Runtime + compile-time in one schema |
| Module system | ESM (`type: module`) | CommonJS | MCP SDK is ESM-only |
| Scoring | Weighted heuristic | ML model | Explainable, no training data needed |
| Response format | Pretty JSON in `text` block | Structured content | Universal — every LLM can parse it |

---

## 13. Extension Points

Want to grow this into a real product? Here's where to plug in:

```mermaid
flowchart LR
    subgraph Current
        A[static TS arrays]
        B[stdio transport]
        C[heuristic scoring]
    end

    subgraph Next-Steps
        D[Prisma + Postgres]
        E[HTTP/SSE transport]
        F[ML ranking model]
        G[User auth per vendor]
        H[Real-time price feed]
        I[Inventory + lead-times]
    end

    A -.replace with.-> D
    B -.add.-> E
    C -.upgrade to.-> F
    D --> G
    D --> H
    D --> I
```

Concrete first steps:

1. **DB-backed catalog** — move `data/*.ts` behind a `Repository` interface, swap impl for Prisma.
2. **Vendor auth** — introduce a `vendorId` context, filter equipment by vendor.
3. **Live pricing** — scheduled job pulls latest prices from vendor APIs; recommendation always uses freshest.
4. **Prompts capability** — add MCP `prompts/list` handler with templates like *"Draft a purchase justification for the CFO"*.

---

## 14. Testing Strategy (Recommended)

```mermaid
flowchart TB
    A[Unit Tests<br/>recommend.ts] --> B[Vitest / Jest]
    C[Contract Tests<br/>JSON-RPC smoke] --> D[Spawn node, pipe requests]
    E[Integration<br/>MCP Inspector] --> F[npx @modelcontextprotocol/inspector]

    style A fill:#e0f7fa
    style C fill:#fff3e0
    style E fill:#f3e5f5
```

Recommended split:
- **Unit** — `recommend()`, `estimateRoi()`, `compareEquipment()` are pure → easy to test
- **Contract** — spawn `dist/index.js`, send `tools/list`, assert 6 tools
- **Manual** — MCP Inspector gives you a GUI to poke every tool

---

## 15. Summary — Why This Design Scales

1. **Pure functions** at the core → trivial to test and reason about
2. **Zod schemas** → one authoring point for validation + types + JSON Schema
3. **Static data → Repository pattern-ready** → tomorrow's DB swap is 1 file
4. **Stdio transport** → runs anywhere Node runs, no ports to manage
5. **Explainable scoring** → users (and auditors) can trust the recommendation
6. **Clean protocol boundary** → `index.ts` is the only file that knows about MCP

The whole server is <500 LOC and does something a hospital planner would otherwise do in a spreadsheet — with the added bonus that an LLM can now *reason over it* in natural language.
