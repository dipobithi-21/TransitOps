import { Download } from "lucide-react";

function RoleModuleView({ module }) {
  const maxStatusValue = Math.max(...module.statusBars.map((item) => item.value), 1);

  return (
    <section className="role-module">
      <div className="role-module-heading">
        <div>
          <p className="dashboard-eyebrow">{module.eyebrow}</p>
          <h2>{module.title}</h2>
          <p>{module.description}</p>
        </div>
        <button type="button">
          <Download size={17} />
          {module.actionLabel}
        </button>
      </div>

      <div className="dashboard-metrics">
        {module.metrics.map((metric) => (
          <article className={`metric-card metric-${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-table-card">
          <div className="panel-title-row">
            <h3>{module.tableTitle}</h3>
            <button type="button">View all</button>
          </div>
          <div className="dashboard-table-wrap">
            <table>
              <thead>
                <tr>
                  {module.tableColumns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {module.tableRows.map((row) => (
                  <tr key={row.join("-")}>
                    {row.map((cell, index) => (
                      <td key={`${cell}-${index}`}>
                        {index === 0 ? <strong>{cell}</strong> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="status-card">
          <h3>{module.statusTitle}</h3>
          <div className="status-bars">
            {module.statusBars.map((item) => (
              <div className="status-row" key={item.label}>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <i>
                  <b
                    style={{
                      width: `${Math.min((item.value / maxStatusValue) * 100, 100)}%`,
                      background: item.color,
                    }}
                  />
                </i>
              </div>
            ))}
          </div>
          <div className="status-total">
            <span>Total</span>
            <strong>{module.statusTotal}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default RoleModuleView;
