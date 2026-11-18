import { supabase } from "../../supabaseClient";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { errorHandler } from "../api";
import * as ui from "../../../ui";

export default function ResetPassword() {
  const [newPassword, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast.success("Password updated!");
      navigate("/campaigns");
    } catch (error) {
      toast.error(errorHandler(error));
    }
  };

  return (
    <div className={ui.centerScreen}>
      <div className={`${ui.panelGlow} ${ui.authCard}`}>
        <h1 className={ui.h1}>Reset Password</h1>
        <form className={ui.stack} onSubmit={handleSubmit}>
          <label className={ui.label}>
            New password
            <input
              type="password"
              className={ui.input}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className={ui.button("primary")}>
            Save password
          </button>
        </form>
      </div>
    </div>
  );
}
