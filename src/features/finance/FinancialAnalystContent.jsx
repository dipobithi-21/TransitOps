import { useMemo, useState } from "react";
import {
  BarChart3,
  Download,
  FileText,
  Fuel,
  Pencil,
  Plus,
  ReceiptText,
  TrendingUp,
  X,
} from "lucide-react";

const vehicles = [
  { id: "TRK-12", name: "TRK-12", acquisitionCost: 1800000 },
  { id: "VAN-05", name: "VAN-05", acquisitionCost: 850000 },
  { id: "MINI-08", name: "MINI-08", acquisitionCost: 620000 },
  { id: "TRK-04", name: "TRK-04", acquisitionCost: 1650000 },
];

// Completed trips and maintenance are the upstream driver/fleet records used by Finance.
const completedTrips = [
  { id: "TR002", vehicle: "TRK-12", distance: 430, revenue: 78000 },
  { id: "TR011", vehicle: "TRK-12", distance: 520, revenue: 92000 },
  { id: "TR013", vehicle: "VAN-05", distance: 286, revenue: 42000 },
  { id: "TR016", vehicle: "VAN-05", distance: 196, revenue: 29000 },
  { id: "TR020", vehicle: "MINI-08", distance: 150, revenue: 18000 },
  { id: "TR021", vehicle: "TRK-04", distance: 610, revenue: 120000 },
];

const maintenanceRecords = [
  { vehicle: "TRK-12", cost: 28000 },
  { vehicle: "VAN-05", cost: 8500 },
  { vehicle: "MINI-08", cost: 6200 },
  { vehicle: "TRK-04", cost: 36000 },
];

const initialFuelLogs = [
  { id: "FL-101", vehicle: "TRK-12", liters: 180, cost: 17820, date: "2026-07-08" },
  { id: "FL-102", vehicle: "VAN-05", liters: 64, cost: 6272, date: "2026-07-09" },
  { id: "FL-103", vehicle: "MINI-08", liters: 42, cost: 4116, date: "2026-07-10" },
  { id: "FL-104", vehicle: "TRK-04", liters: 210, cost: 20790, date: "2026-07-11" },
];

const initialExpenses = [
  { id: "EX-201", vehicle: "TRK-12", category: "Maintenance", description: "Tyre alignment", amount: 28000, date: "2026-07-07" },
  { id: "EX-202", vehicle: "VAN-05", category: "Tolls", description: "Mumbai–Nashik tolls", amount: 1840, date: "2026-07-09" },
  { id: "EX-203", vehicle: "MINI-08", category: "Other", description: "Parking and loading", amount: 1200, date: "2026-07-10" },
];

const money = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
const dateLabel = (date) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
const emptyFuel = { vehicle: "TRK-12", liters: "", cost: "", date: new Date().toISOString().slice(0, 10) };
const emptyExpense = { vehicle: "TRK-12", category: "Tolls", description: "", amount: "", date: new Date().toISOString().slice(0, 10) };

function FinancialAnalystContent({ activeNav }) {
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [fuelForm, setFuelForm] = useState(emptyFuel);
  const [expenseForm, setExpenseForm] = useState(emptyExpense);
  const [expenseFilter, setExpenseFilter] = useState("All");

  const analytics = useMemo(() => {
    const fuelCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
    const directExpenseCost = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const maintenanceCost = maintenanceRecords.reduce((sum, record) => sum + record.cost, 0);
    const distance = completedTrips.reduce((sum, trip) => sum + trip.distance, 0);
    const revenue = completedTrips.reduce((sum, trip) => sum + trip.revenue, 0);
    const liters = fuelLogs.reduce((sum, log) => sum + log.liters, 0);
    const operationalCost = fuelCost + directExpenseCost + maintenanceCost;
    const vehicleMetrics = vehicles.map((vehicle) => {
      const vehicleFuel = fuelLogs.filter((log) => log.vehicle === vehicle.id);
      const vehicleTrips = completedTrips.filter((trip) => trip.vehicle === vehicle.id);
      const fuel = vehicleFuel.reduce((sum, log) => sum + log.cost, 0);
      const vehicleMaintenance = maintenanceRecords.filter((record) => record.vehicle === vehicle.id).reduce((sum, record) => sum + record.cost, 0);
      const vehicleRevenue = vehicleTrips.reduce((sum, trip) => sum + trip.revenue, 0);
      const vehicleDistance = vehicleTrips.reduce((sum, trip) => sum + trip.distance, 0);
      const vehicleLiters = vehicleFuel.reduce((sum, log) => sum + log.liters, 0);
      return {
        ...vehicle,
        fuel,
        maintenance: vehicleMaintenance,
        revenue: vehicleRevenue,
        efficiency: vehicleLiters ? vehicleDistance / vehicleLiters : 0,
        roi: ((vehicleRevenue - (vehicleMaintenance + fuel)) / vehicle.acquisitionCost) * 100,
      };
    });
    return { fuelCost, directExpenseCost, maintenanceCost, distance, revenue, liters, operationalCost, vehicleMetrics, efficiency: liters ? distance / liters : 0, roi: ((revenue - (fuelCost + maintenanceCost)) / vehicles.reduce((sum, vehicle) => sum + vehicle.acquisitionCost, 0)) * 100 };
  }, [expenses, fuelLogs]);

  const openFuelModal = (log = null) => {
    setEditing(log);
    setFuelForm(log ? { ...log, liters: String(log.liters), cost: String(log.cost) } : emptyFuel);
    setModal("fuel");
  };

  const openExpenseModal = (expense = null) => {
    setEditing(expense);
    setExpenseForm(expense ? { ...expense, amount: String(expense.amount) } : emptyExpense);
    setModal("expense");
  };

  const saveFuel = (event) => {
    event.preventDefault();
    const record = { ...fuelForm, liters: Number(fuelForm.liters), cost: Number(fuelForm.cost) };
    if (!record.liters || record.liters <= 0 || !record.cost || record.cost < 0) return;
    setFuelLogs((logs) => editing ? logs.map((log) => log.id === editing.id ? { ...record, id: editing.id } : log) : [{ ...record, id: `FL-${Date.now().toString().slice(-5)}` }, ...logs]);
    setModal(null);
  };

  const saveExpense = (event) => {
    event.preventDefault();
    const record = { ...expenseForm, amount: Number(expenseForm.amount) };
    if (!record.description.trim() || !record.amount || record.amount <= 0) return;
    setExpenses((items) => editing ? items.map((item) => item.id === editing.id ? { ...record, id: editing.id } : item) : [{ ...record, id: `EX-${Date.now().toString().slice(-5)}` }, ...items]);
    setModal(null);
  };

  const exportCsv = (report = "operational") => {
    const rows = report === "fuel"
      ? [["Fuel Log", "Vehicle", "Date", "Liters", "Cost"], ...fuelLogs.map((log) => [log.id, log.vehicle, log.date, log.liters, log.cost])]
      : report === "roi"
        ? [["Vehicle", "Revenue", "Fuel", "Maintenance", "Acquisition Cost", "ROI %"], ...analytics.vehicleMetrics.map((item) => [item.name, item.revenue, item.fuel, item.maintenance, item.acquisitionCost, item.roi.toFixed(2)])]
        : [["Date", "Vehicle", "Category", "Description", "Amount"], ...expenses.map((expense) => [expense.date, expense.vehicle, expense.category, expense.description, expense.amount])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `transitops-${report}-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredExpenses = expenseFilter === "All" ? expenses : expenses.filter((expense) => expense.category === expenseFilter);

  if (activeNav.id === "fuel") return (
    <section className="finance-module">
      <ModuleHeader eyebrow="Fuel management" title="Fuel logs" description="Record, review, and correct fuel purchases by vehicle." action="Add fuel log" onAction={() => openFuelModal()} />
      <div className="finance-metrics"><Metric label="Fuel consumption" value={`${analytics.liters.toLocaleString()} L`} detail="Recorded fuel volume" icon={Fuel} /><Metric label="Fuel cost" value={money(analytics.fuelCost)} detail="Current reporting period" icon={ReceiptText} /><Metric label="Fuel efficiency" value={`${analytics.efficiency.toFixed(2)} km/L`} detail={`${analytics.distance.toLocaleString()} completed km`} icon={TrendingUp} /></div>
      <Panel title="Fuel log register" action="Export CSV" onAction={() => exportCsv("fuel")}><Table><thead><tr><th>Log</th><th>Vehicle</th><th>Date</th><th>Quantity</th><th>Cost</th><th>Cost / L</th><th /></tr></thead><tbody>{fuelLogs.map((log) => <tr key={log.id}><td><strong>{log.id}</strong></td><td>{log.vehicle}</td><td>{dateLabel(log.date)}</td><td>{log.liters} L</td><td>{money(log.cost)}</td><td>{money(log.cost / log.liters)}</td><td><button className="finance-icon-action" type="button" aria-label={`Edit ${log.id}`} onClick={() => openFuelModal(log)}><Pencil size={15} /></button></td></tr>)}</tbody></Table></Panel>
      {modal === "fuel" && <FuelModal form={fuelForm} setForm={setFuelForm} onClose={() => setModal(null)} onSubmit={saveFuel} editing={editing} />}
    </section>
  );

  if (activeNav.id === "expenses") return (
    <section className="finance-module">
      <ModuleHeader eyebrow="Expense management" title="Operational expenses" description="Track fuel, maintenance, tolls, and other operating expenses." action="Add expense" onAction={() => openExpenseModal()} />
      <div className="finance-metrics"><Metric label="Recorded expenses" value={money(analytics.directExpenseCost)} detail="Excludes fuel logs and fleet maintenance" icon={ReceiptText} /><Metric label="Maintenance cost" value={money(analytics.maintenanceCost)} detail="Synced from fleet records" icon={BarChart3} /><Metric label="Total operational cost" value={money(analytics.operationalCost)} detail="Fuel + maintenance + expenses" icon={TrendingUp} /></div>
      <div className="finance-filter-row"><span>Filter category</span>{["All", "Fuel", "Maintenance", "Tolls", "Other"].map((category) => <button type="button" key={category} className={expenseFilter === category ? "selected" : ""} onClick={() => setExpenseFilter(category)}>{category}</button>)}</div>
      <Panel title="Expense register" action="Export CSV" onAction={() => exportCsv("operational")}><Table><thead><tr><th>Expense</th><th>Date</th><th>Vehicle</th><th>Category</th><th>Description</th><th>Amount</th><th /></tr></thead><tbody>{filteredExpenses.map((expense) => <tr key={expense.id}><td><strong>{expense.id}</strong></td><td>{dateLabel(expense.date)}</td><td>{expense.vehicle}</td><td><span className="finance-category">{expense.category}</span></td><td>{expense.description}</td><td>{money(expense.amount)}</td><td><button className="finance-icon-action" type="button" aria-label={`Edit ${expense.id}`} onClick={() => openExpenseModal(expense)}><Pencil size={15} /></button></td></tr>)}</tbody></Table></Panel>
      {modal === "expense" && <ExpenseModal form={expenseForm} setForm={setExpenseForm} onClose={() => setModal(null)} onSubmit={saveExpense} editing={editing} />}
    </section>
  );

  if (activeNav.id === "reports") return (
    <section className="finance-module">
      <ModuleHeader eyebrow="Reports & analytics" title="Operational reporting" description="Export cost, fuel-efficiency, and vehicle-return analysis." />
      <div className="finance-report-grid">
        <ReportCard title="Operational Cost Report" value={money(analytics.operationalCost)} description="Fuel, maintenance, and recorded operating expenses." onExport={() => exportCsv("operational")} />
        <ReportCard title="Fuel Efficiency Report" value={`${analytics.efficiency.toFixed(2)} km/L`} description="Completed-trip distance divided by recorded fuel." onExport={() => exportCsv("fuel")} />
        <ReportCard title="Vehicle ROI Report" value={`${analytics.roi.toFixed(2)}%`} description="Revenue minus maintenance and fuel, divided by acquisition cost." onExport={() => exportCsv("roi")} />
      </div>
      <Panel title="Vehicle ROI analysis" action="Export CSV" onAction={() => exportCsv("roi")}><Table><thead><tr><th>Vehicle</th><th>Completed revenue</th><th>Fuel cost</th><th>Maintenance</th><th>Acquisition cost</th><th>Fuel efficiency</th><th>ROI</th></tr></thead><tbody>{analytics.vehicleMetrics.map((vehicle) => <tr key={vehicle.id}><td><strong>{vehicle.name}</strong></td><td>{money(vehicle.revenue)}</td><td>{money(vehicle.fuel)}</td><td>{money(vehicle.maintenance)}</td><td>{money(vehicle.acquisitionCost)}</td><td>{vehicle.efficiency.toFixed(2)} km/L</td><td><span className={vehicle.roi >= 0 ? "positive" : "negative"}>{vehicle.roi.toFixed(2)}%</span></td></tr>)}</tbody></Table></Panel>
    </section>
  );

  return <section className="finance-module">
    <ModuleHeader eyebrow="Financial dashboard" title="Operational cost control" description="A live view of fuel, maintenance, spending, and fleet return." action="Export expenses" onAction={() => exportCsv("operational")} />
    <div className="finance-metrics"><Metric label="Total operational cost" value={money(analytics.operationalCost)} detail="Fuel + maintenance + expenses" icon={ReceiptText} /><Metric label="Fuel consumption" value={`${analytics.liters.toLocaleString()} L`} detail={`${money(analytics.fuelCost)} fuel spend`} icon={Fuel} /><Metric label="Maintenance cost" value={money(analytics.maintenanceCost)} detail="Fleet manager records" icon={BarChart3} /><Metric label="Fleet ROI" value={`${analytics.roi.toFixed(2)}%`} detail="Revenue less fuel and maintenance" icon={TrendingUp} /><Metric label="Fuel efficiency" value={`${analytics.efficiency.toFixed(2)} km/L`} detail="Completed trips only" icon={Fuel} /></div>
    <div className="finance-summary-grid"><Panel title="Cost composition"><div className="finance-cost-list"><CostRow label="Fuel logs" amount={analytics.fuelCost} total={analytics.operationalCost} /><CostRow label="Maintenance records" amount={analytics.maintenanceCost} total={analytics.operationalCost} /><CostRow label="Other operating expenses" amount={analytics.directExpenseCost} total={analytics.operationalCost} /></div></Panel><Panel title="Quick actions"><div className="finance-quick-actions"><button type="button" onClick={() => openFuelModal()}><Plus size={17} />Add fuel log</button><button type="button" onClick={() => openExpenseModal()}><Plus size={17} />Add expense</button><button type="button" onClick={() => exportCsv("operational")}><Download size={17} />Export CSV</button></div></Panel></div>
    <Panel title="Vehicle performance" action="Full ROI report" onAction={() => exportCsv("roi")}><Table><thead><tr><th>Vehicle</th><th>Fuel efficiency</th><th>Fuel cost</th><th>Maintenance</th><th>Revenue</th><th>ROI</th></tr></thead><tbody>{analytics.vehicleMetrics.map((vehicle) => <tr key={vehicle.id}><td><strong>{vehicle.name}</strong></td><td>{vehicle.efficiency.toFixed(2)} km/L</td><td>{money(vehicle.fuel)}</td><td>{money(vehicle.maintenance)}</td><td>{money(vehicle.revenue)}</td><td><span className="positive">{vehicle.roi.toFixed(2)}%</span></td></tr>)}</tbody></Table></Panel>
    {modal === "fuel" && <FuelModal form={fuelForm} setForm={setFuelForm} onClose={() => setModal(null)} onSubmit={saveFuel} editing={editing} />}
    {modal === "expense" && <ExpenseModal form={expenseForm} setForm={setExpenseForm} onClose={() => setModal(null)} onSubmit={saveExpense} editing={editing} />}
  </section>;
}

function ModuleHeader({ eyebrow, title, description, action, onAction }) { return <header className="finance-module-header"><div><p className="dashboard-eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p></div>{action && <button type="button" onClick={onAction}><Plus size={17} />{action}</button>}</header>; }
function Metric({ label, value, detail, icon: Icon }) { return <article className="finance-metric"><span className="finance-metric-icon"><Icon size={19} /></span><div><small>{label}</small><strong>{value}</strong><em>{detail}</em></div></article>; }
function Table({ children }) { return <div className="finance-table-wrap"><table className="finance-table">{children}</table></div>; }
function Panel({ title, action, onAction, children }) { return <section className="finance-panel"><div className="finance-panel-title"><h3>{title}</h3>{action && <button type="button" onClick={onAction}>{action}</button>}</div>{children}</section>; }
function CostRow({ label, amount, total }) { return <div className="finance-cost-row"><div><span>{label}</span><strong>{money(amount)}</strong></div><i><b style={{ width: `${total ? (amount / total) * 100 : 0}%` }} /></i></div>; }
function ReportCard({ title, value, description, onExport }) { return <article className="finance-report-card"><FileText size={22} /><h3>{title}</h3><strong>{value}</strong><p>{description}</p><button type="button" onClick={onExport}><Download size={15} />Download CSV</button></article>; }
function Field({ label, children }) { return <label className="finance-field"><span>{label}</span>{children}</label>; }
function FuelModal({ form, setForm, onClose, onSubmit, editing }) { return <div className="finance-modal-backdrop" role="presentation"><form className="finance-modal" onSubmit={onSubmit}><div><h3>{editing ? "Update fuel record" : "Add fuel log"}</h3><button type="button" aria-label="Close" onClick={onClose}><X size={19} /></button></div><Field label="Vehicle"><select value={form.vehicle} onChange={(event) => setForm({ ...form, vehicle: event.target.value })}>{vehicles.map((vehicle) => <option key={vehicle.id}>{vehicle.name}</option>)}</select></Field><div className="finance-form-grid"><Field label="Fuel quantity (liters)"><input required min="0.01" step="0.01" type="number" value={form.liters} onChange={(event) => setForm({ ...form, liters: event.target.value })} /></Field><Field label="Total cost (₹)"><input required min="0" step="0.01" type="number" value={form.cost} onChange={(event) => setForm({ ...form, cost: event.target.value })} /></Field></div><Field label="Date"><input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></Field><div className="finance-modal-actions"><button type="button" onClick={onClose}>Cancel</button><button type="submit">{editing ? "Save changes" : "Record fuel"}</button></div></form></div>; }
function ExpenseModal({ form, setForm, onClose, onSubmit, editing }) { return <div className="finance-modal-backdrop" role="presentation"><form className="finance-modal" onSubmit={onSubmit}><div><h3>{editing ? "Update expense" : "Add operational expense"}</h3><button type="button" aria-label="Close" onClick={onClose}><X size={19} /></button></div><div className="finance-form-grid"><Field label="Vehicle"><select value={form.vehicle} onChange={(event) => setForm({ ...form, vehicle: event.target.value })}>{vehicles.map((vehicle) => <option key={vehicle.id}>{vehicle.name}</option>)}</select></Field><Field label="Category"><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{["Fuel", "Maintenance", "Tolls", "Other"].map((category) => <option key={category}>{category}</option>)}</select></Field></div><Field label="Description"><input required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="e.g. Highway toll receipt" /></Field><div className="finance-form-grid"><Field label="Amount (₹)"><input required min="0.01" step="0.01" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></Field><Field label="Date"><input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></Field></div><div className="finance-modal-actions"><button type="button" onClick={onClose}>Cancel</button><button type="submit">{editing ? "Save changes" : "Record expense"}</button></div></form></div>; }

export default FinancialAnalystContent;
