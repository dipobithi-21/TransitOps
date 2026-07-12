import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  ClipboardPlus,
  Download,
  FilePenLine,
  IdCard,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import RoleModuleView from "../../components/dashboard/RoleModuleView";

const metricIcons = {
  drivers: Users,
  licenses: IdCard,
  incidents: AlertTriangle,
  score: Award,
};

const actionIcons = {
  "Add Driver": UserPlus,
  "Update License": FilePenLine,
  "Record Incident": ClipboardPlus,
  "Export Report": Download,
};

const statusClasses = {
  Active: "active",
  "Expiring Soon": "expiring",
  Expired: "expired",
  Suspended: "suspended",
};

function SafetyOverview({ module }) {
  return (
    <section className="safety-module">
      <header className="safety-intro">
        <div>
          <div className="safety-title-row">
            <span className="safety-title-icon"><ShieldCheck size={20} /></span>
            <span className="safety-role-badge">Safety Officer</span>
          </div>
          <h2>Safety Officer Dashboard</h2>
          <p>Monitor driver compliance, license validity, and fleet safety.</p>
        </div>
        <div className="safety-period">Compliance snapshot <strong>July 2026</strong></div>
      </header>

      <div className="safety-kpis">
        {module.metrics.map((metric) => {
          const Icon = metricIcons[metric.icon];
          const TrendIcon = metric.trend === "down" ? ArrowDownRight : ArrowUpRight;
          return (
            <article className={`safety-kpi safety-kpi-${metric.tone}`} key={metric.label}>
              <span className="safety-kpi-icon"><Icon size={20} /></span>
              <div className="safety-kpi-label"><span>{metric.label}</span><TrendIcon size={16} /></div>
              <strong>{metric.value}</strong>
              <small className={metric.trend === "down" ? "trend-good" : "trend-watch"}>{metric.detail}</small>
            </article>
          );
        })}
      </div>

      <div className="safety-primary-grid">
        <section className="safety-card compliance-card">
          <div className="safety-card-heading">
            <div><p>Compliance registry</p><h3>Driver Compliance</h3></div>
            <button type="button">View all</button>
          </div>
          <div className="safety-table-wrap">
            <table className="safety-table">
              <thead><tr><th>Driver Name</th><th>License Number</th><th>License Expiry Date</th><th>Safety Score</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{module.drivers.map((driver) => (
                <tr key={driver.licenseNumber}>
                  <td><strong>{driver.name}</strong><small>{driver.vehicle}</small></td>
                  <td>{driver.licenseNumber}</td><td>{driver.expiryDate}</td>
                  <td><span className="safety-score">{driver.score}</span></td>
                  <td><span className={`safety-status ${statusClasses[driver.status]}`}>{driver.status}</span></td>
                  <td><div className="safety-row-actions"><button type="button">View</button><button type="button">Update</button><button type="button">Renew License</button></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>

        <aside className="safety-aside">
          <section className="safety-card license-card">
            <div className="safety-card-heading"><div><p>License tracker</p><h3>License Status</h3></div><IdCard size={21} /></div>
            <div className="license-donut"><strong>{module.licenseTracker.total}</strong><span>drivers</span></div>
            <div className="license-list">{module.licenseTracker.items.map((item) => <div key={item.label}><span><i style={{ backgroundColor: item.color }} />{item.label}</span><strong>{item.value}</strong></div>)}</div>
            <div className="license-progress"><b style={{ width: `${module.licenseTracker.validPercent}%` }} /><i style={{ width: `${module.licenseTracker.expiringPercent}%` }} /><em style={{ width: `${module.licenseTracker.expiredPercent}%` }} /></div>
          </section>
          <section className="safety-card incidents-card">
            <div className="safety-card-heading"><div><p>Latest events</p><h3>Recent Incidents</h3></div><AlertTriangle size={21} /></div>
            <div className="incident-list">{module.recentIncidents.map((incident) => <article key={`${incident.driver}-${incident.incident}`}><span className={`severity-dot ${incident.severity.toLowerCase()}`} /><div><strong>{incident.incident}</strong><small>{incident.driver} · {incident.date}</small></div><span className="incident-status">{incident.status}</span></article>)}</div>
          </section>
        </aside>
      </div>

      <div className="safety-analytics">
        <section className="safety-card chart-card"><div className="safety-card-heading"><div><p>Driver performance</p><h3>Driver Safety Scores</h3></div><span className="chart-caption">Score / 100</span></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><BarChart data={module.safetyScores} layout="vertical" margin={{ top: 4, right: 20, left: 10, bottom: 4 }}><XAxis type="number" domain={[0, 100]} hide /><YAxis type="category" dataKey="name" width={88} tick={{ fill: "#DAF1DE", fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: "rgba(142, 182, 155, 0.08)" }} contentStyle={{ background: "#163832", border: "1px solid rgba(218,241,222,.2)", borderRadius: "12px" }} /><Bar dataKey="score" radius={[0, 8, 8, 0]} fill="#8EB69B" barSize={18} /></BarChart></ResponsiveContainer></div></section>
        <section className="safety-card chart-card"><div className="safety-card-heading"><div><p>Document health</p><h3>License Status</h3></div><span className="chart-caption">{module.licenseTracker.total} licenses</span></div><div className="pie-layout"><div className="pie-area"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={module.licenseChart} dataKey="value" nameKey="name" innerRadius={48} outerRadius={73} paddingAngle={4} stroke="none">{module.licenseChart.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={{ background: "#163832", border: "1px solid rgba(218,241,222,.2)", borderRadius: "12px" }} /></PieChart></ResponsiveContainer></div><div className="pie-legend">{module.licenseChart.map((entry) => <div key={entry.name}><span><i style={{ backgroundColor: entry.color }} />{entry.name}</span><strong>{entry.value}</strong></div>)}</div></div></section>
      </div>

      <div className="safety-bottom-grid">
        <section className="safety-card quick-actions"><div className="safety-card-heading"><div><p>Common workflows</p><h3>Quick Actions</h3></div></div><div>{module.quickActions.map((action) => { const Icon = actionIcons[action]; return <button type="button" key={action}><Icon size={18} />{action}</button>; })}</div></section>
        <section className="safety-card activity-card"><div className="safety-card-heading"><div><p>Operational log</p><h3>Recent Activity</h3></div></div><div className="activity-timeline">{module.activity.map((activity) => <article key={activity.text}><span><CheckCircle2 size={15} /></span><div><strong>{activity.text}</strong><small>{activity.detail}</small></div><time>{activity.time}</time></article>)}</div></section>
      </div>
    </section>
  );
}

function SafetyOfficerContent({ activeNav, data }) {
  const module = data.modules[activeNav.id];

  if (activeNav.id === "safetyOverview") return <SafetyOverview module={module} />;

  return <RoleModuleView module={module} />;
}

export default SafetyOfficerContent;
