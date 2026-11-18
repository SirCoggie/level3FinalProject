import { api, errorHandler } from "../../authentification/api";
import { useState } from "react";
import { toast } from "react-toastify";
import type { Character } from "./types";
import * as ui from "../../../ui";

type Props = {
  character: Character;
  ownerName: string;
  isGM: boolean;
  campaignId: string;
  onChanged: () => void;
};

export default function CharacterCard({
  character,
  ownerName,
  isGM,
  campaignId,
  onChanged,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftNotes, setDraftNotes] = useState("");
  const [draftSheet, setDraftSheet] = useState<Record<string, string>>({});

  const url = `/campaigns/${campaignId}/characters/${character.id}`;
  const sheet = character.sheet_data ?? {};

  function startEditing() {
    setDraftName(character.name);
    setDraftNotes(character.notes ?? "");
    const asText: Record<string, string> = {};
    for (const [label, value] of Object.entries(sheet)) {
      asText[label] = value == null ? "" : String(value);
    }
    setDraftSheet(asText);
    setIsEditing(true);
  }

  function updateState(label: string, text: string) {
    setDraftSheet((prev) => ({ ...prev, [label]: text }));
  }

  async function saveChanges() {
    try {
      await api.patch(url, {
        name: draftName,
        notes: draftNotes,
        sheet_data: draftSheet,
      });
      setIsEditing(false);
      toast.success("Character saved");
      onChanged();
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  async function retire() {
    if (!window.confirm(`Retire ${character.name}?`)) return;
    try {
      await api.patch(url, { is_active: false });
      onChanged();
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  if (isEditing) {
    return (
      <div className={`${ui.card()} ${ui.stack}`}>
        <label className={ui.label}>
          Name
          <input
            className={ui.input}
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
        </label>

        <div className={ui.sheet}>
          {Object.entries(draftSheet).map(([label, value]) => (
            <label key={label} className={ui.label}>
              {label}
              <input
                className={ui.input}
                value={value}
                onChange={(e) => updateState(label, e.target.value)}
              />
            </label>
          ))}
        </div>

        <label className={ui.label}>
          Notes
          <textarea
            className={ui.textarea}
            value={draftNotes}
            onChange={(e) => setDraftNotes(e.target.value)}
          />
        </label>

        <div className={ui.row}>
          <button type="button" className={ui.button("primary")} onClick={saveChanges}>
            Save
          </button>
          <button
            type="button"
            className={ui.button("ghost")}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={ui.card(!character.is_active)}>
      <h3 className={ui.cardTitle}>
        {character.name}
        <small className={ui.muted}>({ownerName})</small>
        {!character.is_active && <span className={ui.badge()}>Retired</span>}
      </h3>

      {Object.keys(sheet).length > 0 && (
        <dl className={ui.sheet}>
          {Object.entries(sheet).map(([label, value]) => (
            <div key={label} className={ui.sheetCell}>
              <dt className={ui.sheetLabel}>{label}</dt>
              <dd className={ui.sheetValue}>
                {value === "" || value == null ? "-" : String(value)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {character.notes && <p className={ui.mutedP}>{character.notes}</p>}

      {isGM && (
        <div className={ui.row}>
          <button type="button" className={ui.button("stone", "sm")} onClick={startEditing}>
            Edit
          </button>
          {character.is_active && (
            <button type="button" className={ui.button("danger", "sm")} onClick={retire}>
              Retire
            </button>
          )}
        </div>
      )}
    </div>
  );
}
