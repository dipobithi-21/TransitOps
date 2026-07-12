import { useMemo } from "react";
import { Bell, Bolt, LogOut, MoreHorizontal, Search, Truck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDriverOptional } from "../../features/driver/state/DriverContext";

function DashboardShell({ user, roleConfig }) {
  const navigate = useNavigate();
  const { section } = useParams();
  const driverContext = useDriverOptional();
  const displayUser = driverContext?.state.profile ?? user;
  const unreadCount = driverContext?.selectors.unreadCount ?? 3;
  const allNavItems = useMemo(
    () => [...roleConfig.navItems, ...(roleConfig.bottomNavItems ?? [])],
    [roleConfig.navItems, roleConfig.bottomNavItems],
  );
  const activeNav = useMemo(
    () => allNavItems.find((item) => (item.path ?? item.id) === section) ?? allNavItems.find((item) => item.id === roleConfig.landingNavId) ?? roleConfig.navItems[0],
    [allNavItems, roleConfig.landingNavId, roleConfig.navItems, section],
  );
  const ContentComponent = roleConfig.ContentComponent;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleNavClick = (item) => {
    navigate(`/dashboard/${item.path ?? item.id}`);
  };

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span><Truck size={23} strokeWidth={2.5} /></span>
          <strong>TransitOps</strong>
        </div>

        <nav className="dashboard-nav" aria-label={`${roleConfig.label} navigation`}>
          {roleConfig.navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeNav.id;

            return (
              <button
                key={item.id}
                type="button"
                className={isActive ? "active" : ""}
                onClick={() => handleNavClick(item)}
                aria-pressed={isActive}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {roleConfig.bottomNavItems?.length > 0 && (
          <nav className="dashboard-nav dashboard-bottom-nav" aria-label={`${roleConfig.label} profile navigation`}>
            {roleConfig.bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeNav.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={isActive ? "active" : ""}
                  onClick={() => handleNavClick(item)}
                  aria-pressed={isActive}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        <div className="sidebar-user-card">
          <span>{(displayUser.name ?? "TO").slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{displayUser.name ?? displayUser.email}</strong>
            <small>{roleConfig.label}</small>
          </div>
          <MoreHorizontal size={18} />
        </div>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <label className="dashboard-search">
            <Search size={18} />
            <input type="search" placeholder={roleConfig.searchPlaceholder ?? "Search trips, vehicles, drivers..."} />
            <kbd>Ctrl K</kbd>
          </label>
          <div className="dashboard-actions">
            <button type="button" aria-label="Quick actions"><Bolt size={19} /></button>
            <button type="button" aria-label="Notifications">
              <Bell size={19} />
              {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>
            <strong>{(displayUser.name ?? "RK").slice(0, 2).toUpperCase()}</strong>
          </div>
        </div>

        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">{roleConfig.label}</p>
            <h1>{activeNav.label}</h1>
          </div>
          <div className="dashboard-user">
            <span>{displayUser.name ?? displayUser.email}</span>
            <small>{roleConfig.label}</small>
            <button type="button" onClick={handleLogout} aria-label="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <ContentComponent activeNav={activeNav} data={roleConfig.data} user={user} />
      </div>
      {driverContext?.state.toast && (
        <div className={`app-toast toast-${driverContext.state.toast.type}`}>
          <span>{driverContext.state.toast.message}</span>
          <button type="button" onClick={() => driverContext.dispatch({ type: "CLEAR_TOAST" })}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default DashboardShell;
