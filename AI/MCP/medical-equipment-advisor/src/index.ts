#!/usr/bin/env node
import { randomUUID } from "node:crypto";
import express, { type Request, type Response } from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  isInitializeRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import { equipmentCatalog } from "./data/equipment.js";
import { diseaseCatalog } from "./data/diseases.js";
import {
  compareEquipment,
  estimateRoi,
  findDiseases,
  getEquipmentById,
  recommend,
} from "./utils/recommend.js";

function createServer(): Server {
  const server = new Server(
    { name: "medical-equipment-advisor", version: "1.0.0" },
    { capabilities: { tools: {}, resources: {} } },
  );
  registerHandlers(server);
  return server;
}

// ---------- Zod schemas ----------
const RecommendSchema = z.object({
  disease: z.string().describe("Disease name or id (e.g. 'diabetes', 'cardiac', 'kidney-failure')"),
  patientsPerDay: z.number().int().positive().describe("Expected number of patients per day"),
  budgetUSD: z.number().positive().optional().describe("Total capital budget in USD"),
  includeRefurbished: z.boolean().optional().describe("Include refurbished units as options (default true)"),
  prioritize: z.enum(["cost", "capacity", "coverage"]).optional().describe("Ranking priority"),
});

const CompareSchema = z.object({
  equipmentIds: z.array(z.string()).min(2).describe("Two or more equipment ids to compare"),
});

const DetailsSchema = z.object({
  equipmentId: z.string().describe("Equipment id to fetch details for"),
});

const SearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  maxPriceUSD: z.number().optional(),
  minPatientsPerDay: z.number().optional(),
});

const RoiSchema = z.object({
  equipmentId: z.string(),
  units: z.number().int().positive(),
  chargePerPatientUSD: z.number().positive(),
  operatingDaysPerYear: z.number().int().positive().optional(),
  utilizationPct: z.number().min(1).max(100).optional(),
});

const ListDiseasesSchema = z.object({
  category: z.string().optional(),
});

// Helper: convert Zod schema to JSON Schema for MCP tool input
function toJsonSchema(schema: z.ZodObject<z.ZodRawShape>) {
  const shape = schema.shape;
  const props: Record<string, unknown> = {};
  const required: string[] = [];

  for (const key of Object.keys(shape)) {
    const field = shape[key];
    const jsonType = zodToJson(field);
    props[key] = jsonType;
    if (!field.isOptional()) required.push(key);
  }

  return {
    type: "object",
    properties: props,
    required,
    additionalProperties: false,
  };
}

function zodToJson(field: z.ZodTypeAny): Record<string, unknown> {
  const desc = field.description;
  const base = (t: Record<string, unknown>) => (desc ? { ...t, description: desc } : t);

  if (field instanceof z.ZodOptional) return zodToJson(field.unwrap());
  if (field instanceof z.ZodDefault) return zodToJson(field.removeDefault());
  if (field instanceof z.ZodString) return base({ type: "string" });
  if (field instanceof z.ZodNumber) return base({ type: "number" });
  if (field instanceof z.ZodBoolean) return base({ type: "boolean" });
  if (field instanceof z.ZodArray) return base({ type: "array", items: zodToJson(field.element) });
  if (field instanceof z.ZodEnum) return base({ type: "string", enum: field.options });
  return base({ type: "string" });
}

// ---------- Tools registry ----------
const tools = [
  {
    name: "recommend_equipment",
    description:
      "Recommend the best medical equipment to purchase for a given disease, patient volume and (optional) budget. Returns ranked options with reasoning, capacity fit, unit count and total cost.",
    inputSchema: toJsonSchema(RecommendSchema),
  },
  {
    name: "list_diseases",
    description: "List all supported diseases/conditions. Optionally filter by category (e.g. 'Oncology').",
    inputSchema: toJsonSchema(ListDiseasesSchema),
  },
  {
    name: "list_equipment",
    description:
      "Search the equipment catalog. Optional filters: text query, category, max price, minimum patients-per-day capacity.",
    inputSchema: toJsonSchema(SearchSchema),
  },
  {
    name: "get_equipment_details",
    description: "Get full technical & commercial details of a specific equipment by id.",
    inputSchema: toJsonSchema(DetailsSchema),
  },
  {
    name: "compare_equipment",
    description: "Side-by-side comparison of two or more equipment items (price, capacity, cost per patient/day, footprint).",
    inputSchema: toJsonSchema(CompareSchema),
  },
  {
    name: "estimate_roi",
    description:
      "Estimate revenue, annual maintenance, net profit and payback period for buying N units of a specific equipment at a given per-patient charge.",
    inputSchema: toJsonSchema(RoiSchema),
  },
];

// ---------- Register handlers on a Server instance ----------
function registerHandlers(server: Server) {
  // ---------- Tool listing ----------
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

  // ---------- Tool execution ----------
  server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;

  try {
    switch (name) {
      case "recommend_equipment": {
        const input = RecommendSchema.parse(args);
        const result = recommend(input);
        return textResult(result);
      }

      case "list_diseases": {
        const input = ListDiseasesSchema.parse(args ?? {});
        const list = input.category
          ? diseaseCatalog.filter((d) => d.category.toLowerCase().includes(input.category!.toLowerCase()))
          : diseaseCatalog;
        return textResult({
          count: list.length,
          diseases: list.map((d) => ({ id: d.id, name: d.name, category: d.category })),
        });
      }

      case "list_equipment": {
        const input = SearchSchema.parse(args ?? {});
        const q = input.query?.toLowerCase();
        const filtered = equipmentCatalog.filter((e) => {
          if (q && !`${e.name} ${e.vendor} ${e.category} ${e.usageFor.join(" ")}`.toLowerCase().includes(q))
            return false;
          if (input.category && !e.category.toLowerCase().includes(input.category.toLowerCase())) return false;
          if (input.maxPriceUSD != null && e.priceUSD > input.maxPriceUSD) return false;
          if (input.minPatientsPerDay != null && e.patientsPerDay < input.minPatientsPerDay) return false;
          return true;
        });
        return textResult({ count: filtered.length, equipment: filtered });
      }

      case "get_equipment_details": {
        const input = DetailsSchema.parse(args);
        const eq = getEquipmentById(input.equipmentId);
        if (!eq) return textResult({ error: `Equipment '${input.equipmentId}' not found.` });
        return textResult(eq);
      }

      case "compare_equipment": {
        const input = CompareSchema.parse(args);
        return textResult(compareEquipment(input.equipmentIds));
      }

      case "estimate_roi": {
        const input = RoiSchema.parse(args);
        return textResult(estimateRoi(input));
      }

      default:
        return textResult({ error: `Unknown tool: ${name}` }, true);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return textResult({ error: message }, true);
  }
});

// ---------- Resources (browsable data) ----------
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [
      {
        uri: "medadvisor://catalog/equipment",
        name: "Equipment Catalog",
        description: "Full JSON catalog of all medical equipment.",
        mimeType: "application/json",
      },
      {
        uri: "medadvisor://catalog/diseases",
        name: "Disease Catalog",
        description: "Full JSON catalog of supported diseases and their required equipment.",
        mimeType: "application/json",
      },
    ],
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
    const uri = req.params.uri;
    if (uri === "medadvisor://catalog/equipment") {
      return {
        contents: [
          { uri, mimeType: "application/json", text: JSON.stringify(equipmentCatalog, null, 2) },
        ],
      };
    }
    if (uri === "medadvisor://catalog/diseases") {
      return {
        contents: [
          { uri, mimeType: "application/json", text: JSON.stringify(diseaseCatalog, null, 2) },
        ],
      };
    }
    throw new Error(`Unknown resource: ${uri}`);
  });
}

// ---------- helpers ----------
function textResult(payload: unknown, isError = false) {
  return {
    isError,
    content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
  };
}

// ---------- Boot ----------
const useHttp =
  process.argv.includes("--http") || process.env.MCP_HTTP_PORT != null;

async function bootStdio() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stderr keeps stdout clean for JSON-RPC framing
  console.error("[medical-equipment-advisor] MCP server started on stdio");
}

async function bootHttp() {
  const port = Number(process.env.MCP_HTTP_PORT ?? 3003);
  const path = process.env.MCP_HTTP_PATH ?? "/mcp";

  // Session-based: each client gets its own Server + Transport, tracked by
  // the Mcp-Session-Id header. Required because VS Code's MCP client and
  // most other clients speak the session-based Streamable HTTP protocol.
  const transports: Record<string, StreamableHTTPServerTransport> = {};

  const app = express();
  app.use(express.json({ limit: "4mb" }));
  app.use((req, _res, next) => {
  if (req.path === "/mcp") {
    console.error("→", req.method, JSON.stringify(req.body).slice(0, 300));
  }
  next();
});

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", server: "medical-equipment-advisor", version: "1.0.0" });
  });

  app.post(path, async (req: Request, res: Response) => {
    try {
      const sessionId = req.headers["mcp-session-id"] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports[sessionId]) {
        transport = transports[sessionId];
      } else if (!sessionId && isInitializeRequest(req.body)) {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (id) => {
            transports[id] = transport;
            console.error(`[medical-equipment-advisor] session opened: ${id}`);
          },
        });
        transport.onclose = () => {
          if (transport.sessionId) {
            console.error(`[medical-equipment-advisor] session closed: ${transport.sessionId}`);
            delete transports[transport.sessionId];
          }
        };
        const server = createServer();
        await server.connect(transport);
      } else {
        res.status(400).json({
          jsonrpc: "2.0",
          error: { code: -32000, message: "Bad Request: no valid session ID and not an initialize request" },
          id: null,
        });
        return;
      }

      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      console.error("[medical-equipment-advisor] POST error:", err);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  const sessionRequestHandler = async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }
    await transports[sessionId].handleRequest(req, res);
  };

  app.get(path, sessionRequestHandler);
  app.delete(path, sessionRequestHandler);

  app.listen(port, () => {
    console.error(
      `[medical-equipment-advisor] MCP server listening at http://localhost:${port}${path}`,
    );
    console.error(`[medical-equipment-advisor] Health check: http://localhost:${port}/health`);
  });
}

async function main() {
  if (useHttp) await bootHttp();
  else await bootStdio();
}

main().catch((err) => {
  console.error("[medical-equipment-advisor] Fatal:", err);
  process.exit(1);
});
