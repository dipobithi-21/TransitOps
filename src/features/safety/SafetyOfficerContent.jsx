import RoleModuleView from "../../components/dashboard/RoleModuleView";

function SafetyOfficerContent({ activeNav, data }) {
  const module = data.modules[activeNav.id];

  return <RoleModuleView module={module} />;
}

export default SafetyOfficerContent;
