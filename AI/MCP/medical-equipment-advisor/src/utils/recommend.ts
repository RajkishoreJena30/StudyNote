import { diseaseCatalog } from "../data/diseases.js";
import { equipmentCatalog } from "../data/equipment.js";
import type {
  Disease,
  Equipment,
  RecommendationInput,
  RecommendationItem,
  RecommendationResult,
} from "../types/index.js";

const norm = (s: string) => s.toLowerCase().trim().replace(/\s+/g, "-");

export function findDiseases(query: string): Disease[] {
  const q = norm(query);
  const exact = diseaseCatalog.filter((d) => d.id === q);
  if (exact.length) return exact;
  return diseaseCatalog.filter(
    (d) =>
      d.id.includes(q) ||
      norm(d.name).includes(q) ||
      norm(d.category).includes(q) ||
      norm(d.description).includes(q),
  );
}

export function getEquipmentById(id: string): Equipment | undefined {
  return equipmentCatalog.find((e) => e.id === id);
}

export function recommend(input: RecommendationInput): RecommendationResult {
  const {
    disease,
    patientsPerDay,
    budgetUSD,
    includeRefurbished = true,
    prioritize = "coverage",
  } = input;

  const matched = findDiseases(disease);

  if (matched.length === 0) {
    return {
      disease,
      patientsPerDay,
      budgetUSD,
      matchedDiseases: [],
      recommendations: [],
      summary: `No disease found matching "${disease}". Try list_diseases to see supported values.`,
    };
  }

  const requiredIds = new Set<string>();
  const optionalIds = new Set<string>();
  for (const d of matched) {
    d.requiredEquipmentIds.forEach((id) => requiredIds.add(id));
    d.optionalEquipmentIds.forEach((id) => optionalIds.add(id));
  }

  const candidates: Equipment[] = [];
  for (const id of [...requiredIds, ...optionalIds]) {
    const eq = getEquipmentById(id);
    if (!eq) continue;
    if (!includeRefurbished && eq.refurbishedAvailable === false) {
      // keep it, this flag only excludes refurbished purchasing later
    }
    candidates.push(eq);
  }

  const items: RecommendationItem[] = candidates.map((eq) => {
    const isRequired = requiredIds.has(eq.id);
    const unitsSuggested = Math.max(1, Math.ceil(patientsPerDay / eq.patientsPerDay));
    const totalUpfront = unitsSuggested * eq.priceUSD;
    const annualMaintenance = unitsSuggested * eq.monthlyMaintenanceUSD * 12;
    const capacityGap = Math.max(0, patientsPerDay - unitsSuggested * eq.patientsPerDay);
    const fitsBudget = budgetUSD == null ? true : totalUpfront <= budgetUSD;

    // scoring: higher is better
    let score = 0;
    if (isRequired) score += 50;
    else score += 15;

    // capacity fit (0..30)
    const capacityRatio = Math.min(1, (unitsSuggested * eq.patientsPerDay) / patientsPerDay);
    score += capacityRatio * 30;

    // cost efficiency (0..25) — cheaper per patient/day = better
    const costPerPatientDay = eq.priceUSD / eq.patientsPerDay;
    const costScore = Math.max(0, 25 - Math.log10(costPerPatientDay + 1) * 4);
    score += costScore;

    // budget penalty
    if (!fitsBudget) score -= 30;

    // priority tweaks
    if (prioritize === "cost") score += (1 - Math.min(1, totalUpfront / (budgetUSD || totalUpfront))) * 15;
    if (prioritize === "capacity") score += capacityRatio * 15;
    if (prioritize === "coverage" && isRequired) score += 10;

    const reasonParts: string[] = [];
    reasonParts.push(isRequired ? "Required for this condition" : "Optional / supporting");
    reasonParts.push(`${unitsSuggested} unit${unitsSuggested > 1 ? "s" : ""} covers ~${unitsSuggested * eq.patientsPerDay} patients/day`);
    if (!fitsBudget && budgetUSD != null) {
      reasonParts.push(`Over budget by $${(totalUpfront - budgetUSD).toLocaleString()}`);
    } else if (budgetUSD != null) {
      reasonParts.push(`Within budget ($${totalUpfront.toLocaleString()} / $${budgetUSD.toLocaleString()})`);
    }
    if (eq.refurbishedAvailable && includeRefurbished) {
      reasonParts.push("Refurbished option available (~30–50% cheaper)");
    }

    return {
      equipment: eq,
      score: Math.round(score * 100) / 100,
      reason: reasonParts.join(" • "),
      fitsBudget,
      capacityGapPerDay: capacityGap,
      unitsSuggested,
      totalUpfrontUSD: totalUpfront,
      annualMaintenanceUSD: annualMaintenance,
    };
  });

  items.sort((a, b) => b.score - a.score);

  const topRequired = items.filter((i) => requiredIds.has(i.equipment.id));
  const totalMinInvestment = topRequired.reduce((sum, i) => sum + i.totalUpfrontUSD, 0);

  const summary =
    `Matched ${matched.length} disease(s): ${matched.map((d) => d.name).join(", ")}. ` +
    `Minimum viable setup for ${patientsPerDay} patients/day = $${totalMinInvestment.toLocaleString()} ` +
    `across ${topRequired.length} required machine type(s).` +
    (budgetUSD != null
      ? ` Budget: $${budgetUSD.toLocaleString()} — ${totalMinInvestment <= budgetUSD ? "FITS ✓" : "EXCEEDS by $" + (totalMinInvestment - budgetUSD).toLocaleString()}.`
      : "");

  return {
    disease,
    patientsPerDay,
    budgetUSD,
    matchedDiseases: matched,
    recommendations: items,
    summary,
  };
}

export function compareEquipment(ids: string[]): {
  found: Equipment[];
  missing: string[];
  table: Record<string, string | number>[];
} {
  const found: Equipment[] = [];
  const missing: string[] = [];
  for (const id of ids) {
    const eq = getEquipmentById(id);
    if (eq) found.push(eq);
    else missing.push(id);
  }
  const table = found.map((eq) => ({
    id: eq.id,
    name: eq.name,
    vendor: eq.vendor,
    priceUSD: eq.priceUSD,
    monthlyMaintenanceUSD: eq.monthlyMaintenanceUSD,
    patientsPerDay: eq.patientsPerDay,
    costPerPatientPerDay: Math.round(eq.priceUSD / eq.patientsPerDay),
    staffRequired: eq.staffRequired,
    spaceSqFt: eq.spaceRequiredSqFt,
    warrantyYears: eq.warrantyYears,
    refurbishedAvailable: eq.refurbishedAvailable ? "yes" : "no",
  }));
  return { found, missing, table };
}

export function estimateRoi(params: {
  equipmentId: string;
  units: number;
  chargePerPatientUSD: number;
  operatingDaysPerYear?: number;
  utilizationPct?: number;
}) {
  const {
    equipmentId,
    units,
    chargePerPatientUSD,
    operatingDaysPerYear = 300,
    utilizationPct = 70,
  } = params;

  const eq = getEquipmentById(equipmentId);
  if (!eq) {
    return { error: `Equipment '${equipmentId}' not found.` };
  }

  const util = Math.max(0, Math.min(100, utilizationPct)) / 100;
  const patientsPerYear = eq.patientsPerDay * units * operatingDaysPerYear * util;
  const revenue = patientsPerYear * chargePerPatientUSD;
  const annualMaintenance = eq.monthlyMaintenanceUSD * 12 * units;
  const upfront = eq.priceUSD * units;
  const netAnnual = revenue - annualMaintenance;
  const paybackYears = netAnnual > 0 ? upfront / netAnnual : Infinity;

  return {
    equipment: eq.name,
    units,
    upfrontInvestmentUSD: upfront,
    patientsPerYear: Math.round(patientsPerYear),
    annualRevenueUSD: Math.round(revenue),
    annualMaintenanceUSD: annualMaintenance,
    netAnnualUSD: Math.round(netAnnual),
    paybackYears: Number.isFinite(paybackYears) ? Math.round(paybackYears * 100) / 100 : null,
    assumptions: { operatingDaysPerYear, utilizationPct, chargePerPatientUSD },
  };
}
