import { X } from "lucide-react";

/**
 * Shared application navigation. Each role supplies its own items, active item,
 * profile details, and navigation handler so the layout can be reused unchanged.
 */
function Sidebar({ brand = "TransitOps", brandIcon, items, activeItem, onNavigate, profile, isOpen, onClose }) {
  return (
    <aside className={`ops-sidebar ${isOpen ? "open" : ""}`}>
      <div className="ops-brand">
        <span className="ops-logo">{brandIcon}</span><span>{brand}</span>
        <button className="mobile-close" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
      </div>
      <nav aria-label="Primary navigation">
        {items.map(({ icon: Icon, label, badge }) => (
          <button key={label} className={label === activeItem ? "nav-active" : ""} onClick={() => onNavigate(label)}>
            <Icon size={18} /><span>{label}</span>{badge && <b className="nav-badge">{badge}</b>}
          </button>
        ))}
      </nav>
      {profile && <div className="sidebar-user">
        <span className="avatar">{profile.initials}</span>
        <div><strong>{profile.name}</strong><small>{profile.role}</small></div>
        {profile.trailing}
      </div>}
    </aside>
  );
}

export default Sidebar;
