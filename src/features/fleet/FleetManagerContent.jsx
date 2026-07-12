import RoleModuleView from "../../components/dashboard/RoleModuleView";

function FleetManagerContent({ activeNav, data }) {
  const module = data.modules[activeNav.id];

  return <RoleModuleView module={module} />;
}

export default FleetManagerContent;
