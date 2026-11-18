import { api, errorHandler } from "../../authentification/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Character } from "./types";
import * as ui from "../../../ui";

type DiceHistory = {
  id: string;
  dice_type: string;
  result: number;
  rolled_at: string;
  user_id: string;
  characters: { name: string } | null;
};

const DICE = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"];

export default function DicePanel({
  campaignId,
  isGM,
}: {
  campaignId: string;
  isGM: boolean;
}) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [rolls, setRolls] = useState<DiceHistory[]>([]);
  const [lastResult, setLastResult] = useState<{ dice: string; value: number } | null>(null);
  const [rolling, setRolling] = useState(false);

  async function loadCharacter() {
    try {
      const response = await api.get(`/campaigns/${campaignId}/characters?mine=true`);
      const active = response.data.data.filter((c: Character) => c.is_active);
      setSelectedCharacter(active[0] ?? null);
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  async function getRollHistory() {
    try {
      const response = await api.get(`/campaigns/${campaignId}/rolls`);
      setRolls(response.data.data);
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  useEffect(() => {
    loadCharacter();
    getRollHistory();
  }, [campaignId]);

  async function rollDice(diceType: string) {
    setRolling(true);
    try {
      const response = await api.post(`/campaigns/${campaignId}/rolls`, {
        dice_type: diceType,
      });
      setLastResult({ dice: diceType, value: response.data.data.result });
      getRollHistory();
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      setRolling(false);
    }
  }

  const rollingAs = selectedCharacter?.name ?? (isGM ? "the Game Master" : null);

  return (
    <section className={ui.panelGlow}>
      <div className={ui.panelTitle}>
        <h2 className={ui.h2}>Dice</h2>
        <button
          type="button"
          className={ui.button("ghost", "sm")}
          onClick={() => {
            loadCharacter();
            getRollHistory();
          }}
        >
          Refresh
        </button>
      </div>

      <p className={ui.mutedP}>
        {rollingAs ? (
          <>
            Rolling as <strong>{rollingAs}</strong>
          </>
        ) : (
          "You need an active character to roll."
        )}
      </p>

      <div className={ui.diceResult}>
        {lastResult ? (
          <>
            {lastResult.value}
            <span className={ui.diceLabel}>{lastResult.dice}</span>
          </>
        ) : (
          <span className={ui.diceLabel}>Roll the bones</span>
        )}
      </div>

      <div className={ui.diceGrid}>
        {DICE.map((dice) => (
          <button
            type="button"
            key={dice}
            className={ui.button("stone", "dice")}
            onClick={() => rollDice(dice)}
            disabled={rolling || !rollingAs}
          >
            {dice}
          </button>
        ))}
      </div>

      <h3 className={ui.h3}>Recent rolls</h3>
      {rolls.length === 0 ? (
        <p className={ui.mutedP}>No one has rolled yet!</p>
      ) : (
        <ul className={`${ui.list} ${ui.rollHistory}`}>
          {rolls.map((roll) => (
            <li key={roll.id} className={ui.listItem}>
              <span>
                <span className={ui.name}>{roll.characters?.name ?? "GM"}</span>{" "}
                <span className={ui.muted}>{roll.dice_type}</span>
              </span>
              <span>
                <strong className={ui.rollValue}>{roll.result}</strong>{" "}
                <small className={ui.muted}>
                  {new Date(roll.rolled_at).toLocaleTimeString()}
                </small>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
