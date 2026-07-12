export interface Vehicle {
  id: string;
  regNumber: string;
  name: string;
  type: string;
  maxLoadKg: number;
  odometer: number;
  acquisitionCost: number;
  region: string;
  status: "Available" | "OnTrip" | "InShop" | "Retired";
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseStatus: "Valid" | "RenewalDue" | "Expired";
  licenseExpiry: string;
  contact: string;
  safetyScore: number;
  shift: "Day" | "Night";
  status: "Available" | "OnTrip" | "OffDuty" | "Suspended";
  currentVehicleId: string | null;
  email?: string;
  emergencyContact?: string;
  licenseCategory?: "LMV" | "HMV" | "Transport";
  notes?: string;
}

export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeightKg: number;
  plannedDistance: number;
  eta: string;
  status: "Draft" | "Dispatched" | "Completed" | "Cancelled";
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  description: string;
  cost: number;
  status: "Open" | "Closed";
  openedAt: string;
  closedAt: string | null;
}
