import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";
import "../dashboard-overrides.css";
import "../finance-dashboard.css";
import Sidebar from "../components/Sidebar";
import {
  Activity, AlertTriangle, BarChart3, Bell, Box, CalendarDays,
  CircleDollarSign, ClipboardList, Download, Droplets, Fuel, LayoutDashboard,
  Menu, MoreHorizontal, Package, Plus, Search, Settings, Truck, Users,
  Wrench, Zap,
} from "lucide-react";
import {
  Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";

const trips = [
  { id: "TR001", vehicle: "VAN-05", type: "Van", driver: "Alex", route: "Surat → Ahmedabad", cargo: "450 kg", status: "On Trip", eta: "45 min", region: "West" },
  { id: "TR002", vehicle: "TRK-12", type: "Truck", driver: "John", route: "Vadodara → Rajkot", cargo: "2200 kg", status: "Completed", eta: "—", region: "West" },
  { id: "TR003", vehicle: "MINI-08", type: "Mini Truck", driver: "Priya", route: "Anand → Nadiad", cargo: "300 kg", status: "Dispatched", eta: "1h 10m", region: "Central" },
  { id: "TR004", vehicle: "TRK-04", type: "Truck", driver: "Rahul", route: "Surat → Mumbai", cargo: "5000 kg", status: "Draft", eta: "Awaiting Driver", region: "West" },
  { id: "TR005", vehicle: "VAN-09", type: "Van", driver: "Meera", route: "Bharuch → Surat", cargo: "250 kg", status: "Pending", eta: "Awaiting Vehicle", region: "West" },
];

const tripsPerDay = [{ day: "Mon", trips: 18 }, { day: "Tue", trips: 21 }, { day: "Wed", trips: 25 }, { day: "Thu", trips: 17 }, { day: "Fri", trips: 28 }, { day: "Sat", trips: 23 }, { day: "Sun", trips: 12 }];
const maintenanceCosts = [{ month: "Jan", cost: 32 }, { month: "Feb", cost: 40 }, { month: "Mar", cost: 36 }, { month: "Apr", cost: 52 }, { month: "May", cost: 44 }, { month: "Jun", cost: 48 }];
const fuelTrend = [{ month: "Jan", fuel: 3800 }, { month: "Feb", fuel: 4100 }, { month: "Mar", fuel: 3900 }, { month: "Apr", fuel: 4300 }, { month: "May", fuel: 4500 }, { month: "Jun", fuel: 4200 }];
const vehicleMix = [{ name: "Truck", value: 40, color: "#61d3a0" }, { name: "Van", value: 34, color: "#a1ebbe" }, { name: "Mini Truck", value: 17, color: "#f3b542" }, { name: "Bike", value: 9, color: "#d98e45" }];

const nav = [
  [LayoutDashboard, "Dashboard"], [Truck, "Fleet"], [Users, "Drivers"], [Package, "Trips"],
  [Wrench, "Maintenance"], [Fuel, "Fuel & Expenses"], [BarChart3, "Analytics"], [Settings, "Settings"],
];

function StatCard({ icon: Icon, label, value, detail, color }) {
  return <article className="metric-card">
    <span className={`metric-icon ${color}`}><Icon size={20} /></span>
    <div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div>
  </article>;
}

function SectionHeader({ title, action }) {
  return <div className="section-header"><h2>{title}</h2>{action}</div>;
}

function Analytics() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ type: "All", status: "All", region: "All" });
  const [search, setSearch] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const selectFilter = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));
  const filteredTrips = useMemo(() => trips.filter((trip) =>
    (filters.type === "All" || trip.type === filters.type) &&
    (filters.status === "All" || trip.status === filters.status) &&
    (filters.region === "All" || trip.region === filters.region) &&
    `${trip.id} ${trip.vehicle} ${trip.driver} ${trip.route}`.toLowerCase().includes(search.toLowerCase())), [filters, search]);
  const runAction = (action) => { setNotice(`${action} is ready to continue.`); setTimeout(() => setNotice(""), 3200); };
  const handleNavigation = (label) => {
    if (label === "Dashboard") {
      navigate("/dashboard");
      return;
    }
    runAction(`${label} view`);
  };

  return <div className="ops-dashboard finance-dashboard">
    <Sidebar brandIcon={<Truck size={22} />} items={nav.map(([icon, label]) => ({ icon, label }))} activeItem="Analytics" onNavigate={handleNavigation} isOpen={navOpen} onClose={() => setNavOpen(false)} profile={{ initials: "RK", name: "Raven K.", role: "Finance Analyst", trailing: <MoreHorizontal size={18} /> }} />
    <main className="ops-main">
      <header className="topbar">
        <button className="menu-button" onClick={() => setNavOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
        <label className="searchbox"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search trips, vehicles, drivers..." /><kbd>⌘ K</kbd></label>
        <div className="top-actions"><button className="icon-button" onClick={() => runAction("Theme settings")}><Zap size={18} /></button><button className="icon-button notification" onClick={() => runAction("Notifications")}><Bell size={18} /><i>3</i></button><span className="top-avatar">RK</span></div>
      </header>

      <div className="dashboard-content">
        <div className="page-heading"><div><p className="eyebrow-dash">Operations overview</p><h1>Fleet Analytics</h1><span>Monitor fleet health, dispatch activity, and operational costs.</span></div><button className="export-button" onClick={() => runAction("Fleet report export")}><Download size={17} /> Export Report</button></div>

        <section className="filters" aria-label="Dashboard filters">
          <div className="filter-title"><Activity size={18} /><span>Filters</span></div>
          <label>Vehicle Type<select value={filters.type} onChange={selectFilter("type")}><option>All</option><option>Truck</option><option>Van</option><option>Mini Truck</option><option>Trailer</option><option>Bike</option></select></label>
          <label>Status<select value={filters.status} onChange={selectFilter("status")}><option>All</option><option>Available</option><option>On Trip</option><option>In Shop</option><option>Retired</option><option>Completed</option><option>Dispatched</option><option>Draft</option><option>Pending</option></select></label>
          <label>Region<select value={filters.region} onChange={selectFilter("region")}><option>All</option><option>North</option><option>South</option><option>East</option><option>West</option><option>Central</option></select></label>
          <button className="clear-filters" onClick={() => setFilters({ type: "All", status: "All", region: "All" })}>Clear filters</button>
        </section>

        <section className="metrics-grid">
          <StatCard icon={Truck} label="Active Vehicles" value="53" detail="Total registered vehicles" color="blue" />
          <StatCard icon={CircleDollarSign} label="Available Vehicles" value="42" detail="Ready for dispatch" color="green" />
          <StatCard icon={Wrench} label="In Maintenance" value="5" detail="Currently in workshop" color="orange" />
          <StatCard icon={RouteIcon} label="Active Trips" value="18" detail="Trips in progress" color="purple" />
          <StatCard icon={Package} label="Pending Trips" value="9" detail="Waiting for dispatch" color="orange" />
          <StatCard icon={Users} label="Drivers On Duty" value="26" detail="Available or on trip" color="cyan" />
          <StatCard icon={Activity} label="Fleet Utilization" value="81%" detail="Vehicles currently utilized" color="pink" />
        </section>

        <section className="dash-grid primary-grid">
          <article className="panel recent-trips"><SectionHeader title="Recent Trips" action={<button className="text-action" onClick={() => runAction("All trips")}>View all</button>} /><div className="table-scroll"><table><thead><tr><th>Trip ID</th><th>Vehicle</th><th>Driver</th><th>Route</th><th>Cargo</th><th>Status</th><th>ETA</th></tr></thead><tbody>{filteredTrips.length ? filteredTrips.map((trip) => <tr key={trip.id}><td className="trip-id">{trip.id}</td><td><span className="vehicle-chip"><Truck size={14} />{trip.vehicle}</span></td><td>{trip.driver}</td><td>{trip.route}</td><td>{trip.cargo}</td><td><span className={`status ${trip.status.toLowerCase().replace(" ", "-")}`}>{trip.status}</span></td><td className="muted-cell">{trip.eta}</td></tr>) : <tr><td colSpan="7" className="empty-state">No trips match the selected filters.</td></tr>}</tbody></table></div></article>
          <article className="panel status-panel"><SectionHeader title="Vehicle Status" /><div className="status-bars">{[["Available", 42, 80, "#39c892"], ["On Trip", 18, 34, "#3974ff"], ["In Shop", 5, 10, "#ff9d28"], ["Retired", 3, 6, "#8c98ae"]].map(([name, count, width, color]) => <div className="status-row" key={name}><div><span>{name}</span><strong>{count}</strong></div><div className="progress"><i style={{ width: `${width}%`, background: color }} /></div></div>)}</div><div className="fleet-total"><span>Total Fleet</span><strong>53 vehicles</strong></div></article>
        </section>

        <section className="dash-grid mid-grid">
          <article className="panel dispatch-panel"><SectionHeader title="Today's Dispatch" action={<CalendarDays size={17} />} /><div className="dispatch-list">{[["TRK-11", "Ravi", "Ahmedabad", "Dispatched"], ["VAN-05", "Alex", "Surat", "On Trip"], ["TRK-09", "Aman", "Rajkot", "Loading"], ["MINI-04", "Priya", "Vadodara", "Scheduled"]].map(([vehicle, driver, destination, status]) => <div className="dispatch-row" key={vehicle}><span className="dispatch-vehicle"><Truck size={16} /></span><div><strong>{vehicle}</strong><small>{driver} · {destination}</small></div><span className={`status ${status.toLowerCase().replace(" ", "-")}`}>{status}</span></div>)}</div></article>
          <article className="panel fuel-panel"><SectionHeader title="Fuel Overview" action={<Droplets size={18} />} /><div className="fuel-stat"><div><p>Today's Fuel Used</p><strong>620 <small>L</small></strong></div><div><p>Today's Fuel Cost</p><strong>₹38,600</strong></div><div><p>Average Mileage</p><strong>9.8 <small>km/L</small></strong></div></div><div className="fuel-note"><Fuel size={16} /> 5.2% less consumption than yesterday</div></article>
          <article className="panel alerts-panel"><SectionHeader title="Active Alerts" action={<span className="alert-count">5</span>} /><div className="alert-list">{["Vehicle TRK-08 maintenance due tomorrow", "Driver Alex's license expires in 12 days", "VAN-05 exceeded speed limit yesterday", "Fuel cost increased 8% this week", "Truck TRK-03 has high maintenance expenses"].map((alert, index) => <div className="alert-item" key={alert}><AlertTriangle size={16} /><span>{alert}</span>{index < 2 && <b>Action</b>}</div>)}</div></article>
        </section>

        <section className="dash-grid charts-grid">
          <article className="panel chart-panel"><SectionHeader title="Trips Per Day" action={<span className="chart-subtitle">This week</span>} /><ResponsiveContainer width="100%" height={220}><BarChart data={tripsPerDay} margin={{ top: 4, right: 0, left: -25, bottom: 0 }}><defs><linearGradient id="barBlue" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4b7dff" /><stop offset="1" stopColor="#2754ca" /></linearGradient></defs><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8a9ab2", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8a9ab2", fontSize: 11 }} /><Tooltip cursor={{ fill: "rgba(76, 112, 183, .08)" }} contentStyle={{ background: "#101d31", border: "1px solid #2a3a53", borderRadius: 8 }} /><Bar dataKey="trips" fill="url(#barBlue)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></article>
          <article className="panel chart-panel utilization"><SectionHeader title="Fleet Utilization" /><div className="util-content"><div className="donut"><div><strong>81%</strong><span>Utilized</span></div></div><div className="chart-legend"><p><i className="used" />Used <strong>81%</strong></p><p><i className="idle" />Idle <strong>19%</strong></p><small>42 of 53 vehicles are ready or on trip</small></div></div></article>
          <article className="panel chart-panel"><SectionHeader title="Vehicle Distribution" /><div className="pie-layout"><ResponsiveContainer width="52%" height={210}><PieChart><Pie data={vehicleMix} dataKey="value" innerRadius={48} outerRadius={76} paddingAngle={3}>{vehicleMix.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={{ background: "#101d31", border: "1px solid #2a3a53", borderRadius: 8 }} /></PieChart></ResponsiveContainer><div className="chart-legend">{vehicleMix.map((item) => <p key={item.name}><i style={{ background: item.color }} />{item.name}<strong>{item.value}%</strong></p>)}</div></div></article>
        </section>

        <section className="dash-grid bottom-grid">
          <article className="panel chart-panel line-panel"><SectionHeader title="Monthly Maintenance Cost" action={<span className="chart-subtitle">Jan — Jun</span>} /><ResponsiveContainer width="100%" height={205}><LineChart data={maintenanceCosts} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8a9ab2", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}K`} tick={{ fill: "#8a9ab2", fontSize: 10 }} /><Tooltip contentStyle={{ background: "#101d31", border: "1px solid #2a3a53", borderRadius: 8 }} formatter={(v) => [`₹${v}K`, "Cost"]} /><Line type="monotone" dataKey="cost" stroke="#ff9d28" strokeWidth={3} dot={{ r: 4, fill: "#ff9d28", strokeWidth: 0 }} /></LineChart></ResponsiveContainer></article>
          <article className="panel chart-panel line-panel"><SectionHeader title="Fuel Consumption Trend" action={<span className="chart-subtitle">Jan — Jun</span>} /><ResponsiveContainer width="100%" height={205}><LineChart data={fuelTrend} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8a9ab2", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} tick={{ fill: "#8a9ab2", fontSize: 10 }} /><Tooltip contentStyle={{ background: "#101d31", border: "1px solid #2a3a53", borderRadius: 8 }} formatter={(v) => [`${v}L`, "Fuel"]} /><Line type="monotone" dataKey="fuel" stroke="#3974ff" strokeWidth={3} dot={{ r: 4, fill: "#3974ff", strokeWidth: 0 }} /></LineChart></ResponsiveContainer></article>
          <article className="panel maintenance-panel"><SectionHeader title="Maintenance Overview" action={<button className="text-action" onClick={() => runAction("Maintenance schedule")}>View all</button>} /><div className="maintenance-list">{[["TRK-08", "Engine Service", "In Progress"], ["VAN-03", "Oil Change", "Scheduled"], ["TRK-14", "Brake Repair", "Waiting Parts"], ["MINI-02", "Tire Replacement", "Completed"]].map(([vehicle, issue, status]) => <div key={vehicle}><span><Wrench size={15} /></span><p><strong>{vehicle}</strong><small>{issue}</small></p><em className={status.toLowerCase().replace(" ", "-")}>{status}</em></div>)}</div></article>
        </section>

        <section className="dash-grid footer-grid">
          <article className="panel summary-panel"><SectionHeader title="Fleet & Driver Summary" /><div className="summary-groups"><div><h3>Fleet</h3><p><span>Total Fleet</span><strong>53</strong></p><p><span>Trucks · Vans · Mini Trucks · Bikes</span><strong>21 · 18 · 9 · 5</strong></p></div><div><h3>Drivers</h3><p><span>Total Drivers</span><strong>34</strong></p><p><span>Available · On Trip · Off Duty · Suspended</span><strong>8 · 18 · 6 · 2</strong></p></div></div></article>
          <article className="panel quick-panel"><SectionHeader title="Quick Actions" /><div className="quick-actions">{[[Plus, "Register Vehicle"], [Users, "Add Driver"], [Box, "Create Trip"], [Wrench, "Schedule Maintenance"], [Fuel, "Add Fuel Log"], [CircleDollarSign, "Add Expense"], [ClipboardList, "Generate Report"]].map(([Icon, label]) => <button key={label} onClick={() => runAction(label)}><Icon size={18} /><span>{label}</span></button>)}</div></article>
          <article className="panel notifications-panel"><SectionHeader title="Recent Notifications" action={<Bell size={17} />} /><div className="notification-list">{[["10:32 AM", "Trip TR001 dispatched successfully."], ["10:15 AM", "Vehicle VAN-05 assigned to Alex."], ["09:40 AM", "Maintenance completed for TRK-12."], ["09:05 AM", "Fuel log added for TRK-07."], ["Yesterday", "Driver Rahul completed Trip TR029."]].map(([time, text]) => <p key={time}><span>{time}</span>{text}</p>)}</div></article>
        </section>
      </div>
    </main>
    {notice && <div className="dashboard-toast"><CheckIcon />{notice}</div>}
  </div>;
}

function RouteIcon(props) { return <RouteSymbol {...props} />; }
function RouteSymbol({ size }) { return <Activity size={size} />; }
function CheckIcon() { return <span className="toast-check">✓</span>; }

export default Analytics;
