import { api, errorHandler } from "../../authentification/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PLAYER_STATUSES, memberName } from "./types";
import type { Member, PlayerStatus } from "./types";
import * as ui from "../../../ui";

export default function MembersPanel({
  campaignId,
  isGM,
}: {
  campaignId: string;
  isGM: boolean;
}) {
  const [members, setMembers] = useState<Member[]>([]);

  async function reload() {
    try {
      const response = await api.get(`/campaigns/${campaignId}/members`);
      setMembers(response.data.data);
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  useEffect(() => {
    reload();
  }, [campaignId]);

  async function updateMember(
    memberId: string,
    changes: { status?: PlayerStatus; can_roll_dice?: boolean },
  ) {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, ...changes } : m)),
    );
    try {
      await api.patch(`/campaigns/${campaignId}/members/${memberId}`, changes);
    } catch (error) {
      toast.error(errorHandler(error));
      reload();
    }
  }

  async function kickPlayer(member: Member) {
    if (!window.confirm(`Kick ${memberName(member)}?`)) return;
    try {
      await api.delete(`/campaigns/${campaignId}/members/${member.id}`);
      toast.success("Player kicked");
      reload();
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  return (
    <section className={ui.panel}>
      <div className={ui.panelTitle}>
        <h2 className={ui.h2}>Party</h2>
        <button type="button" className={ui.button("ghost", "sm")} onClick={reload}>
          Refresh
        </button>
      </div>

      <ul className={ui.list}>
        {members.map((member) => (
          <li key={member.id} className={ui.listItem}>
            <span>
              <span className={ui.name}>{memberName(member)}</span>{" "}
              {member.role === "gm" ? (
                <span className={ui.badge("gold")}>GM</span>
              ) : (
                <span className={ui.statusBadge(member.status)}>{member.status}</span>
              )}
              {member.role !== "gm" && !member.can_roll_dice && (
                <span className={ui.badge("danger")}>No dice</span>
              )}
            </span>

            {isGM && member.role !== "gm" && (
              <span className={ui.row}>
                <select
                  className={ui.selectCompact}
                  value={member.status}
                  onChange={(e) =>
                    updateMember(member.id, { status: e.target.value as PlayerStatus })
                  }
                >
                  {PLAYER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <label className={ui.labelInline}>
                  <input
                    type="checkbox"
                    className={ui.checkbox}
                    checked={member.can_roll_dice}
                    onChange={(e) =>
                      updateMember(member.id, { can_roll_dice: e.target.checked })
                    }
                  />
                  Dice
                </label>

                <button
                  type="button"
                  className={ui.button("danger", "sm")}
                  onClick={() => kickPlayer(member)}
                >
                  Kick
                </button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
