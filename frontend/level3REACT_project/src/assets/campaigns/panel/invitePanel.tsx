import { api, errorHandler } from "../../authentification/api";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import * as ui from "../../../ui";

type Props = {
  isGM: boolean;
  campaignId: string;
};

type InviteData = {
  id: string;
  name: string;
  seat_user_id: string | null;
  link?: string;
};

export default function InvitePanel({ isGM, campaignId }: Props) {
  const [inviteList, setInviteList] = useState<InviteData[]>([]);
  const [inviteName, setInviteName] = useState("");
  const [latestLink, setLatestLink] = useState<{ name: string; link: string } | null>(null);

  async function listInvite() {
    try {
      const response = await api.get(`/campaigns/${campaignId}/invites`);
      setInviteList(response.data.data);
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  useEffect(() => {
    if (isGM) listInvite();
  }, [isGM, campaignId]);

  async function createInvite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await api.post(`/campaigns/${campaignId}/invites`, {
        name: inviteName,
      });
      setLatestLink({ name: response.data.name, link: response.data.link });
      setInviteName("");
      listInvite();
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  async function refreshInvite(invite: InviteData) {
    try {
      const response = await api.post(
        `/campaigns/${campaignId}/invites/${invite.id}/new-link`,
      );
      setLatestLink({ name: invite.name, link: response.data.link });
      listInvite();
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  async function deleteInvite(invite: InviteData) {
    if (!window.confirm(`Delete the invite for ${invite.name}?`)) return;
    try {
      const response = await api.delete(`/campaigns/${campaignId}/invites/${invite.id}`);
      toast.success(response.data.messages);
      listInvite();
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  async function copyLink(link: string) {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied!");
    } catch {
      toast.error("Link copying failed!");
    }
  }

  if (!isGM) return null;

  return (
    <section className={ui.panel}>
      <div className={ui.panelTitle}>
        <h2 className={ui.h2}>Invites</h2>
        <span className={ui.badge()}>{inviteList.length}</span>
      </div>

      <form className={ui.formRow} onSubmit={createInvite}>
        <input
          className={ui.input}
          value={inviteName}
          placeholder="Player or seat name"
          onChange={(e) => setInviteName(e.target.value)}
          required
        />
        <button type="submit" className={ui.button("primary")}>
          New invite
        </button>
      </form>

      {latestLink && (
        <div className={ui.message()}>
          <strong>{latestLink.name}</strong>
          <div className={ui.linkBox}>{latestLink.link}</div>
          <button
            type="button"
            className={ui.button("stone", "sm")}
            onClick={() => copyLink(latestLink.link)}
          >
            Copy link
          </button>
        </div>
      )}

      {inviteList.length === 0 ? (
        <p className={ui.mutedP}>No invites yet.</p>
      ) : (
        <ul className={ui.list}>
          {inviteList.map((invite) => (
            <li key={invite.id} className={ui.listItem}>
              <span>
                <span className={ui.name}>{invite.name}</span>{" "}
                {invite.seat_user_id ? (
                  <span className={ui.badge("success")}>Joined</span>
                ) : (
                  <span className={ui.badge()}>Waiting</span>
                )}
              </span>
              <span className={ui.row}>
                {invite.link && (
                  <button
                    type="button"
                    className={ui.button("stone", "sm")}
                    onClick={() => copyLink(invite.link!)}
                  >
                    Copy
                  </button>
                )}
                <button
                  type="button"
                  className={ui.button("stone", "sm")}
                  onClick={() => refreshInvite(invite)}
                >
                  New link
                </button>
                <button
                  type="button"
                  className={ui.button("danger", "sm")}
                  onClick={() => deleteInvite(invite)}
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
