import { api, errorHandler } from "../authentification/api";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../authentification/AuthContext";
import * as ui from "../../ui";

type Campaign = {
  id: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export function CampaignListPage() {
  const { signOut } = useAuth();
  const [campaignList, setCampaign] = useState<Campaign[]>([]);
  const [message, setMessage] = useState("");
  const [campaignName, setName] = useState("");
  const [campaignDescription, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await api.get("/campaigns");
        setCampaign(responses.data.data);
      } catch (error) {
        setMessage(errorHandler(error));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    try {
      const result = await api.post("/campaigns", {
        name: campaignName,
        description: campaignDescription || null,
      });
      toast.success("Campaign created!");
      navigate(`/campaigns/${result.data.data.id}`);
    } catch (error) {
      toast.error(errorHandler(error));
      setMessage(errorHandler(error));
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <div className={ui.page}>
      <header className={ui.pageHeader}>
        <h1 className={ui.h1}>Your Campaigns</h1>
        <button type="button" className={ui.button("ghost", "sm")} onClick={handleSignOut}>
          Sign out
        </button>
      </header>

      <div className={ui.campaignGrid}>
        <section className={ui.panel}>
          <div className={ui.panelTitle}>
            <h2 className={ui.h2}>Worlds</h2>
            <span className={ui.badge()}>{campaignList.length}</span>
          </div>

          {loading ? (
            <p className={ui.mutedP}>Loading…</p>
          ) : campaignList.length === 0 ? (
            <p className={ui.mutedP}>No campaigns yet. Forge one!</p>
          ) : (
            <ul className={ui.list}>
              {campaignList.map((campaign) => (
                <li key={campaign.id} className={ui.listItem}>
                  <div>
                    <Link to={`/campaigns/${campaign.id}`} className={`${ui.link} ${ui.name}`}>
                      {campaign.name}
                    </Link>
                    {campaign.description && (
                      <div className={ui.muted}>{campaign.description}</div>
                    )}
                  </div>
                  {campaign.is_active === false && (
                    <span className={ui.badge()}>Frozen</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={ui.panel}>
          <div className={ui.panelTitle}>
            <h2 className={ui.h2}>Forge a New World</h2>
          </div>
          <form className={ui.stack} onSubmit={onCreate}>
            <label className={ui.label}>
              Name
              <input
                type="text"
                className={ui.input}
                placeholder="The Shattered Isles"
                value={campaignName}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className={ui.label}>
              Description
              <textarea
                className={ui.textarea}
                placeholder="A short hook for your campaign…"
                value={campaignDescription}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <button type="submit" className={ui.button("primary")}>
              Create campaign
            </button>
          </form>
          {message && <p className={ui.message(true)}>{message}</p>}
        </section>
      </div>
    </div>
  );
}
