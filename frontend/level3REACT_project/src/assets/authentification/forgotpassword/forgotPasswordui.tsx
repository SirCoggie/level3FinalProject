import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";
import { errorHandler } from "../api";
import * as ui from "../../../ui";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMessage("Check your email for the reset link!");
      toast.success("Check your email for the reset link!");
    } catch (error) {
      toast.error(errorHandler(error));
    }
  };

  return (
    <div className={ui.centerScreen}>
      <div className={`${ui.panelGlow} ${ui.authCard}`}>
        <h1 className={ui.h1}>Forgot Password</h1>
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
          <button type="submit" className={ui.button("primary")}>
            Send reset link
          </button>
        </form>

        {message && <p className={ui.message()}>{message}</p>}

        <hr className={ui.hr} />
        <Link to="/" className={ui.link}>
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
