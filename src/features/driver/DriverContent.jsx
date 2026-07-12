import CurrentTrip from "./pages/CurrentTrip";
import DriverDashboard from "./pages/DriverDashboard";
import DriverProfile from "./pages/DriverProfile";
import MyTrips from "./pages/MyTrips";
import TripHistory from "./pages/TripHistory";

const driverPages = {
  driverDashboard: DriverDashboard,
  myTrips: MyTrips,
  currentTrip: CurrentTrip,
  tripHistory: TripHistory,
  profile: DriverProfile,
};

function DriverContent({ activeNav, data, user }) {
  const PageComponent = driverPages[activeNav.id] ?? DriverDashboard;

  return <PageComponent data={data} user={user} />;
}

export default DriverContent;
