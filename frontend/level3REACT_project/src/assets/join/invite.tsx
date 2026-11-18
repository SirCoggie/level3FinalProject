import { api, errorHandler } from "../authentification/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import * as ui from "../../ui";

export function JoinCampaign() {
  const navigate = useNavigate();
  const { token } = useParams();
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function getInvite() {
      try {
        const response = await api.post(`/api/join/${token}`);
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        });
        if (sessionError) throw sessionError;
        toast.success("Entering the world and beyond!");
        navigate(`/campaigns/${response.data.campaign_id}`);
      } catch (err) {
        setError(errorHandler(err));
        toast.error(errorHandler(err));
      }
    }
    getInvite();
  }, [token, navigate]);

  return <p className={ui.loading}>{error || "Joining the campaign…"}</p>;
}
