export type PatientVolume = "low" | "medium" | "high";

export interface Equipment {
  id: string;
  name: string;
  category: string;
  vendor: string;
  priceUSD: number;
  monthlyMaintenanceUSD: number;
  patientsPerDay: number;
  spaceRequiredSqFt: number;
  powerKW: number;
  staffRequired: number;
  diseases: string[];
  usageFor: string[];
  warrantyYears: number;
  refurbishedAvailable: boolean;
  notes?: string;
}

export interface Disease {
  id: string;
  name: string;
  category: string;
  requiredEquipmentIds: string[];
  optionalEquipmentIds: string[];
  description: string;
}

export interface RecommendationInput {
  disease: string;
  patientsPerDay: number;
  budgetUSD?: number;
  includeRefurbished?: boolean;
  prioritize?: "cost" | "capacity" | "coverage";
}

export interface RecommendationItem {
  equipment: Equipment;
  score: number;
  reason: string;
  fitsBudget: boolean;
  capacityGapPerDay: number;
  unitsSuggested: number;
  totalUpfrontUSD: number;
  annualMaintenanceUSD: number;
}

export interface RecommendationResult {
  disease: string;
  patientsPerDay: number;
  budgetUSD?: number;
  matchedDiseases: Disease[];
  recommendations: RecommendationItem[];
  summary: string;
}
