import { api, errorHandler } from "../authentification/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import MembersPanel from "./panel/memberPanel";
import CharacterPanel from "./panel/characterPanel";
import GMCard from "./panel/gmCard";
import InvitePanel from "./panel/invitePanel";
import DicePanel from "./panel/dicePanel";
import BackendConnection from "../ai/backendConnection";
import * as ui from "../../ui";

type CampaignData = {
  id: string;
  name: string;
  description: string | null;
  gm_user_id: string;
  game_system_id: string | null;
  is_active: boolean;
  dice_rolling_paused: boolean;
  created_at: string;
  updated_at: string;
};

export default function MainCampaignPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [isGm, setIsGm] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  async function loadPage() {
    try {
      const response = await api.get(`/campaigns/${campaignId}`);
      const res = response.data;
      setIsGm(res.my_role === "gm");
      setCampaignData(res.data);
      setUserId(res.user_id);
    } catch (err) {
      setError(errorHandler(err));
      toast.error(errorHandler(err));
    }
  }

  useEffect(() => {
    if (campaignId) loadPage();
  }, [campaignId]);

  if (!campaignId) return <p className={ui.loading}>No campaign selected!</p>;
  if (error && !campaignData)
    return (
      <div className={ui.centerScreen}>
        <div className={`${ui.panel} ${ui.authCard} ${ui.stack}`}>
          <p className={ui.message(true)}>{error}</p>
          <Link to="/" className={ui.link}>
            Return home
          </Link>
        </div>
      </div>
    );
  if (!campaignData) return <p className={ui.loading}>Unrolling the map…</p>;

  return (
    <div className={ui.page}>
      <header className={ui.pageHeader}>
        <div>
          <h1 className={ui.h1}>{campaignData.name}</h1>
          <p className={ui.mutedP}>
            {campaignData.description ?? "No description yet!"}
          </p>
        </div>
        <div className={ui.row}>
          {!campaignData.is_active && <span className={ui.badge()}>Frozen</span>}
          {campaignData.dice_rolling_paused && (
            <span className={ui.badge("danger")}>Dice paused</span>
          )}
          <span className={isGm ? ui.badge("gold") : ui.badge()}>
            {isGm ? "Game Master" : "Player"}
          </span>
          {isGm && (
            <Link to="/campaigns" className={ui.button("ghost", "sm")}>
              All campaigns
            </Link>
          )}
        </div>
      </header>

      <div className={ui.campaignGrid}>
        <DicePanel campaignId={campaignId} isGM={isGm} />
        <CharacterPanel isGM={isGm} campaignId={campaignId} myUserId={userId} />
        <MembersPanel isGM={isGm} campaignId={campaignId} />

        {isGm && (
          <>
            <GMCard
              isGM={isGm}
              campaignId={campaignId}
              name={campaignData.name}
              description={campaignData.description}
              is_active={campaignData.is_active}
              dice_rolling_paused={campaignData.dice_rolling_paused}
              onChanged={loadPage}
            />
            <InvitePanel isGM={isGm} campaignId={campaignId} />
            <BackendConnection />
          </>
        )}
      </div>
    </div>
  );
}
