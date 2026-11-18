import { api, errorHandler } from "../../authentification/api";
import { useState } from "react";
import { toast } from "react-toastify";
import * as ui from "../../../ui";

type Props = {
  campaignId: string;
  name: string | null;
  description: string | null;
  is_active: boolean;
  dice_rolling_paused: boolean;
  isGM: boolean;
  onChanged: () => void;
};

export default function GMCard({
  isGM,
  campaignId,
  name,
  description,
  is_active,
  dice_rolling_paused,
  onChanged,
}: Props) {
  const [draftName, setName] = useState("");
  const [draftDescription, setDescription] = useState("");
  const [draftIsActive, setIsActive] = useState(true);
  const [draftDicePaused, setDicePaused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  async function saveCampaign() {
    try {
      await api.patch(`/campaigns/${campaignId}`, {
        name: draftName,
        description: draftDescription,
        is_active: draftIsActive,
        dice_rolling_paused: draftDicePaused,
      });
      setIsEditing(false);
      toast.success("Campaign updated");
      onChanged();
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  async function toggleDice() {
    try {
      await api.patch(`/campaigns/${campaignId}`, {
        dice_rolling_paused: !dice_rolling_paused,
      });
      onChanged();
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  function startEditing() {
    setName(name ?? "");
    setDescription(description ?? "");
    setIsActive(is_active);
    setDicePaused(dice_rolling_paused);
    setIsEditing(true);
  }

  if (!isGM) return null;

  return (
    <section className={ui.panel}>
      <div className={ui.panelTitle}>
        <h2 className={ui.h2}>World Settings</h2>
        {!isEditing && (
          <button type="button" className={ui.button("stone", "sm")} onClick={startEditing}>
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className={ui.stack}>
          <label className={ui.label}>
            Name
            <input
              type="text"
              className={ui.input}
              value={draftName}
              placeholder="Campaign name"
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className={ui.label}>
            Description
            <textarea
              className={ui.textarea}
              value={draftDescription}
              placeholder="Write description here!"
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label className={ui.labelInline}>
            <input
              type="checkbox"
              className={ui.checkbox}
              checked={draftDicePaused}
              onChange={(e) => setDicePaused(e.target.checked)}
            />
            Pause all dice rolls
          </label>

          <label className={ui.labelInline}>
            <input
              type="checkbox"
              className={ui.checkbox}
              checked={!draftIsActive}
              onChange={(e) => setIsActive(!e.target.checked)}
            />
            Freeze the world
          </label>

          <div className={ui.row}>
            <button type="button" className={ui.button("primary")} onClick={saveCampaign}>
              Save
            </button>
            <button type="button" className={ui.button("ghost")} onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className={ui.stack}>
          <p className={ui.p}>
            <strong>{name}</strong>{" "}
            {!is_active && <span className={ui.badge()}>Frozen</span>}
          </p>
          {description && <p className={ui.mutedP}>{description}</p>}
          <div className={ui.rowBetween}>
            <span>
              Dice:{" "}
              {dice_rolling_paused ? (
                <span className={ui.badge("danger")}>Paused</span>
              ) : (
                <span className={ui.badge("success")}>Allowed</span>
              )}
            </span>
            <button
              type="button"
              className={dice_rolling_paused ? ui.button("primary", "sm") : ui.button("danger", "sm")}
              onClick={toggleDice}
            >
              {dice_rolling_paused ? "Resume dice" : "Pause dice"}
            </button>
          </div>
          <small className={ui.muted}>ID: {campaignId}</small>
        </div>
      )}
    </section>
  );
}
