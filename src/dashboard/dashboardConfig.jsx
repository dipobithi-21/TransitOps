import {
  ClipboardCheck,
  Clock3,
  Fuel,
  Gauge,
  History,
  LayoutDashboard,
  ReceiptText,
  Route,
  ShieldAlert,
  ShieldCheck,
  Truck,
  UserCheck,
  UserRound,
} from "lucide-react";
import FleetManagerContent from "../features/fleet/FleetManagerContent";
import DriverContent from "../features/driver/DriverContent";
import SafetyOfficerContent from "../features/safety/SafetyOfficerContent";
import FinancialAnalystContent from "../features/finance/FinancialAnalystContent";
import { roleDashboardData } from "../data/roleDashboardData";
import { driverMockData } from "../features/driver/data/driverMockData";

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
    landingNavId: "driverDashboard",
    searchPlaceholder: "Search assigned trips, routes, history...",
    navItems: [
      { id: "driverDashboard", path: "driver", label: "Dashboard", icon: LayoutDashboard },
      { id: "myTrips", path: "my-trips", label: "My Trips", icon: Route },
      { id: "currentTrip", path: "current-trip", label: "Current Trip", icon: Clock3 },
      { id: "tripHistory", path: "trip-history", label: "Trip History", icon: History },
    ],
    bottomNavItems: [
      { id: "profile", path: "profile", label: "Profile", icon: UserRound },
    ],
    ContentComponent: DriverContent,
    data: driverMockData,
  },
  "Safety Officer": {
    label: "Safety Officer",
    landingNavId: "safetyOverview",
    navItems: [
      { id: "safetyOverview", label: "Safety Overview", icon: ShieldCheck },
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
      { id: "financeOverview", label: "Analytics", icon: Gauge },
      { id: "fuel", label: "Fuel & Expenses", icon: Fuel },
      { id: "invoices", label: "Invoices", icon: ReceiptText },
    ],
    ContentComponent: FinancialAnalystContent,
    data: roleDashboardData["Financial Analyst"],
  },
};
