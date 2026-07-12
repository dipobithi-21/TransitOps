import { Navigate } from "react-router-dom";
import DashboardShell from "../components/dashboard/DashboardShell";
import { dashboardConfig } from "../dashboard/dashboardConfig";
import { DriverProvider } from "../features/driver/state/DriverContext";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const roleConfig = dashboardConfig[user?.role];

  if (!user || !roleConfig) {
    return <Navigate to="/" replace />;
  }

  if (user.role === "Driver") {
    return (
      <DriverProvider>
        <DashboardShell user={user} roleConfig={roleConfig} />
      </DriverProvider>
    );
  }

  return <DashboardShell user={user} roleConfig={roleConfig} />;
}

export default Dashboard;
