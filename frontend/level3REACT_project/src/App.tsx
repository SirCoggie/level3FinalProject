import { Link } from "react-router-dom";
import Login from "./assets/authentification/loginUi";
import { useAuth } from "./assets/authentification/AuthContext";
import * as ui from "./ui";

export default function App() {
  const { isAuthenticated, isLoading, user, signOut } = useAuth();

  if (isLoading) return <p className={ui.loading}>Summoning…</p>;

  return (
    <div className={ui.centerScreen}>
      <div className={`${ui.panelGlow} ${ui.authCard}`}>
        <h1 className={ui.h1}>Game Master's Keep</h1>

        {isAuthenticated ? (
          <div className={ui.stack}>
            <p className={ui.p}>
              Welcome back, <span className={ui.muted}>{user?.email}</span>
            </p>
            <Link to="/campaigns" className={ui.button("primary")}>
              Enter your campaigns
            </Link>
            <button type="button" className={ui.button("ghost")} onClick={signOut}>
              Sign out
            </button>
          </div>
        ) : (
          <>
            <Login />
            <hr className={ui.hr} />
            <div className={ui.nav}>
              <Link to="/register" className={ui.link}>
                Register as GM
              </Link>
              <Link to="/forgotPassword" className={ui.link}>
                Forgot password?
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
