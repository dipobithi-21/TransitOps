function DriverMetricGrid({ metrics }) {
  return (
    <section className="dashboard-metrics driver-metric-grid" aria-label="Driver summary">
      {metrics.map((metric) => (
        <article className={`metric-card metric-${metric.tone}`} key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <small>{metric.detail}</small>
        </article>
      ))}
    </section>
  );
}

export default DriverMetricGrid;
