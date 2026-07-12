import { useDriver } from "../state/DriverContext";

function DriverNotifications() {
  const { state, dispatch } = useDriver();

  return (
    <section className="driver-notifications">
      <div className="panel-title-row">
        <h3>Notifications</h3>
      </div>
      <div className="notification-list">
        {state.notifications.length === 0 && <div className="driver-empty-state">No notifications yet.</div>}
        {state.notifications.map((notification) => (
          <article className={notification.read ? "read" : ""} key={notification.id}>
            <span>{notification.type}</span>
            <div>
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
              <small>{notification.time}</small>
            </div>
            <div className="notification-actions">
              {!notification.read && (
                <button type="button" onClick={() => dispatch({ type: "MARK_NOTIFICATION_READ", id: notification.id })}>
                  Mark read
                </button>
              )}
              <button type="button" onClick={() => dispatch({ type: "DISMISS_NOTIFICATION", id: notification.id })}>
                Dismiss
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DriverNotifications;
