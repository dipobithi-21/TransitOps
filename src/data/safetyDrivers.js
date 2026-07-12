// Shared Safety Officer mock API. Trip Management can import these helpers directly.
const names = ["Alex Johnson", "Sarah Williams", "Michael Chen", "Emily Davis", "David Wilson", "Priya Nair", "Rahul Mehta", "Nisha Patel", "Arjun Kapoor", "Meera Shah", "Vikram Singh", "Ananya Roy", "Rohan Das", "Kavya Iyer", "Sanjay Kumar", "Neha Verma", "Amit Joshi", "Pooja Menon", "Karan Malhotra", "Ishita Bose"];
const statuses = ["Available", "On Trip", "Off Duty", "Suspended"];
const categories = ["LMV", "HMV", "Transport", "Hazardous Goods"];
const expiryDates = ["2027-12-18", "2026-07-24", "2026-07-09", "2027-03-15", "2027-08-01", "2026-07-30", "2028-01-12", "2026-06-28", "2027-10-20", "2026-08-05", "2027-06-14", "2026-07-20", "2028-04-02", "2027-09-08", "2026-06-10", "2027-11-22", "2026-08-12", "2028-02-14", "2027-05-18", "2026-07-01"];

export const createSafetyDrivers = () => names.map((name, index) => ({
  id: `DRV-${String(index + 1).padStart(3, "0")}`,
  name, licenseNumber: `DL-${548732 + index * 713}`, licenseCategory: categories[index % categories.length],
  licenseExpiry: expiryDates[index], contact: `+91 98${String(12000000 + index * 18731).slice(-8)}`,
  email: `${name.toLowerCase().replace(/ /g, ".")}@transitops.io`, emergencyContact: `${["Anita", "Ravi", "Maya", "Suresh"][index % 4]} · +91 99${String(20000000 + index * 927).slice(-8)}`,
  safetyScore: [98, 95, 58, 89, 54, 91, 76, 63, 87, 93, 82, 59, 97, 70, 52, 88, 79, 96, 68, 57][index],
  status: statuses[index % 4], vehicle: index % 4 === 0 ? "TRK-12" : index % 4 === 1 ? "VAN-05" : index % 4 === 2 ? "MINI-08" : null,
  notes: index % 5 === 0 ? "Safety refresher scheduled." : "No active notes.",
  joiningDate: `202${1 + (index % 4)}-${String((index % 11) + 1).padStart(2, "0")}-${String(8 + (index % 18)).padStart(2, "0")}`,
}));

export function getLicenseStatus(driver, today = new Date("2026-07-12")) {
  const expiry = new Date(`${driver.licenseExpiry}T00:00:00`);
  const days = Math.ceil((expiry - today) / 86400000);
  return days < 0 ? "Expired" : days <= 30 ? "Expiring Soon" : "Valid";
}
export function getRiskLevel(driver) { return driver.safetyScore < 60 ? "High" : driver.safetyScore < 75 ? "Medium" : "Low"; }
export function isEligibleForTrip(driver) { return driver.status === "Available" && getLicenseStatus(driver) === "Valid"; }
export const getTripEligibleDrivers = (drivers) => drivers.filter(isEligibleForTrip);
