import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, LockKeyhole, Mail, ShieldCheck, Truck } from "lucide-react";
import users from "../data/users";

const roles = [{ label: "Fleet Mgr", value: "Fleet Manager" }, { label: "Driver", value: "Driver" }, { label: "Safety", value: "Safety Officer" }, { label: "Finance", value: "Financial Analyst" }];

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Fleet Manager");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState("");
  const handleLogin = (event) => {
    event.preventDefault();
    const user = users.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase() && candidate.password === password && candidate.role === role);
    if (!user) { setError("Check your role, email, and password, then try again."); return; }
    localStorage.setItem("user", JSON.stringify({ ...user, keepSignedIn }));
    navigate("/dashboard");
  };
  return (
    <main className="auth-page"><section className="auth-card" aria-labelledby="signin-heading">
      <div className="brand" aria-label="TransitOps"><span className="brand-mark"><Truck size={27} strokeWidth={2.5} /></span><span>TRANSITOPS</span></div>
      <div className="auth-layout">
        <aside className="platform-intro">
          <p className="eyebrow"><span /> TransitOps platform</p>
          <h2>Operations that move with you.</h2>
          <p>A smart transport management platform designed to streamline fleet operations, improve safety, and optimize logistics.</p>
        </aside>
      <div className="auth-content"><p className="eyebrow"><span /> Secure access <b>·</b> RBAC</p><h1 id="signin-heading">Sign in to command</h1><p className="auth-subtitle">Authenticate to access your fleet operations console.</p>
        <form onSubmit={handleLogin}><fieldset className="role-fieldset"><legend>Role</legend><div className="role-tabs" aria-label="Select your role">{roles.map((item) => <button type="button" key={item.value} className={role === item.value ? "active" : ""} onClick={() => { setRole(item.value); setError(""); }} aria-pressed={role === item.value}>{item.label}</button>)}</div></fieldset>
          <label className="field-label" htmlFor="email">Email</label><div className="input-shell"><Mail aria-hidden="true" /><input id="email" type="email" placeholder="operator@transitops.io" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} required /></div>
          <div className="label-row"><label className="field-label" htmlFor="password">Password</label><button className="forgot-password" type="button">Forgot?</button></div><div className="input-shell"><LockKeyhole aria-hidden="true" /><input id="password" type="password" placeholder="••••••••••••" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} required /></div>
          <label className="remember-option"><input type="checkbox" checked={keepSignedIn} onChange={(event) => setKeepSignedIn(event.target.checked)} /><span><Check size={14} strokeWidth={4} /></span>Keep this station signed in for 12 hours</label>{error && <p className="login-error" role="alert">{error}</p>}<button className="authenticate-button" type="submit">Authenticate <ArrowRight aria-hidden="true" size={23} strokeWidth={2.5} /></button></form>
        <div className="or-divider"><span>or</span></div><button className="sso-button" type="button"><ShieldCheck size={22} /> Continue with SSO</button><p className="seat-note">New to TransitOps? <button type="button">Request an operator seat</button></p>
      </div></div></section></main>
  );
}
export default Login;
