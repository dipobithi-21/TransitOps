import {
  ClipboardCheck,
  FileText,
  Fuel,
  Gauge,
  LayoutDashboard,
  Map,
  ReceiptText,
  Route,
  ShieldAlert,
  ShieldCheck,
  Truck,
  UserCheck,
} from "lucide-react";
import FleetManagerContent from "../features/fleet/FleetManagerContent";
import DriverContent from "../features/driver/DriverContent";
import SafetyOfficerContent from "../features/safety/SafetyOfficerContent";
import FinancialAnalystContent from "../features/finance/FinancialAnalystContent";
import { roleDashboardData } from "../data/roleDashboardData";

export const dashboardConfig = {
  "Fleet Manager": {
    label: "Fleet Manager",
    landingNavId: "fleetOverview",
    navItems: [
      { id: "fleetOverview", label: "Analytics", icon: LayoutDashboard },
      { id: "vehicles", label: "Fleet", icon: Truck },
      { id: "drivers", label: "Drivers", icon: UserCheck },
      { id: "trips", label: "Trips", icon: Route },
    ],
    ContentComponent: FleetManagerContent,
    data: roleDashboardData["Fleet Manager"],
  },
  Driver: {
    label: "Driver",
    landingNavId: "myTrips",
    navItems: [
      { id: "myTrips", label: "My Trips", icon: Route },
      { id: "routeSheet", label: "Route Sheet", icon: Map },
      { id: "documents", label: "Documents", icon: FileText },
    ],
    ContentComponent: DriverContent,
    data: roleDashboardData.Driver,
  },
  "Safety Officer": {
    label: "Safety Officer",
    landingNavId: "safetyOverview",
    navItems: [
      { id: "safetyOverview", label: "Safety Overview", icon: ShieldCheck },
      { id: "drivers", label: "Driver Management", icon: UserCheck },
      { id: "compliance", label: "Driver Compliance", icon: ClipboardCheck },
      { id: "inspections", label: "Inspections", icon: ClipboardCheck },
      { id: "incidents", label: "Incidents", icon: ShieldAlert },
    ],
    ContentComponent: SafetyOfficerContent,
    data: roleDashboardData["Safety Officer"],
  },
  "Financial Analyst": {
    label: "Financial Analyst",
    landingNavId: "financeOverview",
    navItems: [
      { id: "financeOverview", label: "Dashboard", icon: Gauge },
      { id: "fuel", label: "Fuel Management", icon: Fuel },
      { id: "expenses", label: "Expense Management", icon: ReceiptText },
      { id: "reports", label: "Reports & Analytics", icon: FileText },
    ],
    ContentComponent: FinancialAnalystContent,
    data: roleDashboardData["Financial Analyst"],
  },
};
