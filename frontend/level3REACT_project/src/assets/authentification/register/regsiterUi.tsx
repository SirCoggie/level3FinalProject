import { useState } from "react";
import { registerUser } from "./register";
import type { AuthCredentials } from "./register";
import { Link, useNavigate } from "react-router-dom";
import { errorHandler } from "../api";
import { toast } from "react-toastify";
import * as ui from "../../../ui";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setResponse] = useState("");
  const [signup_code, setCode] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const credentials: AuthCredentials = { email, password, signup_code };

    try {
      await registerUser(credentials);
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(errorHandler(error));
      setResponse(errorHandler(error));
    }
  };

  return (
    <div className={ui.centerScreen}>
      <div className={`${ui.panelGlow} ${ui.authCard}`}>
        <h1 className={ui.h1}>Register</h1>
        <form className={ui.stack} onSubmit={handleSubmit}>
          <label className={ui.label}>
            Email
            <input
              type="email"
              className={ui.input}
              placeholder="gm@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className={ui.label}>
            Password
            <input
              type="password"
              className={ui.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className={ui.label}>
            GM sign-up code
            <input
              type="password"
              className={ui.input}
              placeholder="secret code"
              value={signup_code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </label>

          <button type="submit" className={ui.button("primary")}>
            Create GM account
          </button>
        </form>

        {message && <p className={ui.message(true)}>{message}</p>}

        <hr className={ui.hr} />
        <Link to="/" className={ui.link}>
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
