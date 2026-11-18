import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { errorHandler } from "./api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as ui from "../../ui";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) {
      setResponse(errorHandler(error));
      toast.error(errorHandler(error));
    } else {
      toast.success("login complete!");
      navigate("/campaigns");
    }
  };

  return (
    <>
      <form className={ui.stack} onSubmit={handleLogin}>
        <label className={ui.label}>
          Email
          <input
            type="email"
            className={ui.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="gm@example.com"
            required
          />
        </label>

        <label className={ui.label}>
          Password
          <input
            type="password"
            className={ui.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <button type="submit" className={ui.button("primary")}>
          Enter
        </button>
      </form>

      {response && <p className={ui.message(true)}>{response}</p>}
    </>
  );
}
