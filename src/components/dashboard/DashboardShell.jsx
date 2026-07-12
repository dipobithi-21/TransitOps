import { useMemo, useState } from "react";
import { Bell, Bolt, LogOut, MoreHorizontal, Search, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DashboardShell({ user, roleConfig }) {
  const navigate = useNavigate();
  const [activeNavId, setActiveNavId] = useState(roleConfig.landingNavId);
  const activeNav = useMemo(
    () => roleConfig.navItems.find((item) => item.id === activeNavId) ?? roleConfig.navItems[0],
    [activeNavId, roleConfig.navItems],
  );
  const ContentComponent = roleConfig.ContentComponent;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
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
                onClick={() => setActiveNavId(item.id)}
                aria-pressed={isActive}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-user-card">
          <span>{(user.name ?? "TO").slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{user.name ?? user.email}</strong>
            <small>{roleConfig.label}</small>
          </div>
          <MoreHorizontal size={18} />
        </div>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <label className="dashboard-search">
            <Search size={18} />
            <input type="search" placeholder="Search trips, vehicles, drivers..." />
            <kbd>Ctrl K</kbd>
          </label>
          <div className="dashboard-actions">
            <button type="button" aria-label="Quick actions"><Bolt size={19} /></button>
            <button type="button" aria-label="Notifications"><Bell size={19} /><span>3</span></button>
            <strong>{(user.name ?? "RK").slice(0, 2).toUpperCase()}</strong>
          </div>
        </div>

        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">{roleConfig.label}</p>
            <h1>{activeNav.label}</h1>
          </div>
          <div className="dashboard-user">
            <span>{user.name ?? user.email}</span>
            <small>{roleConfig.label}</small>
            <button type="button" onClick={handleLogout} aria-label="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <ContentComponent activeNav={activeNav} data={roleConfig.data} user={user} />
      </div>
    </div>
  );
}

export default DashboardShell;
