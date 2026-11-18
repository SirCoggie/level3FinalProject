import { api, errorHandler } from "../../authentification/api";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CharacterCard from "./CharacterCard";
import { memberName } from "./types";
import type { Character, Member } from "./types";
import * as ui from "../../../ui";

type Props = {
  campaignId: string;
  isGM: boolean;
  myUserId: string;
};

export default function CharacterPanel({ campaignId, isGM, myUserId }: Props) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [ownerId, setOwnerId] = useState("");
  const [newName, setNewName] = useState("");

  async function loadCharacters() {
    try {
      const [characterRes, memberRes] = await Promise.all([
        api.get(`/campaigns/${campaignId}/characters`),
        api.get(`/campaigns/${campaignId}/members`),
      ]);
      setCharacters(characterRes.data.data);
      setMembers(memberRes.data.data);
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  useEffect(() => {
    loadCharacters();
  }, [campaignId]);

  async function handleCreate(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (ownerId === "") {
      toast.error("Please select the player first!");
      return;
    }
    try {
      await api.post(`/campaigns/${campaignId}/characters`, {
        user_id: ownerId,
        name: newName,
      });
      setOwnerId("");
      setNewName("");
      toast.success("Character created");
      loadCharacters();
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  function ownerName(userId: string) {
    return memberName(members.find((m) => m.user_id === userId));
  }

  const visible = isGM ? characters : characters.filter((c) => c.is_active);
  const mine = visible.filter((c) => c.user_id === myUserId);
  const others = visible.filter((c) => c.user_id !== myUserId);
  const players = members.filter((m) => m.role !== "gm");

  function renderCard(character: Character) {
    return (
      <CharacterCard
        key={character.id}
        character={character}
        ownerName={ownerName(character.user_id)}
        isGM={isGM}
        campaignId={campaignId}
        onChanged={loadCharacters}
      />
    );
  }

  return (
    <section className={ui.panel}>
      <div className={ui.panelTitle}>
        <h2 className={ui.h2}>Characters</h2>
        <button
          type="button"
          className={ui.button("ghost", "sm")}
          onClick={loadCharacters}
        >
          Refresh
        </button>
      </div>

      {isGM && (
        <form className={ui.formRow} onSubmit={handleCreate}>
          <select
            className={ui.select}
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
          >
            <option value="">Choose a player…</option>
            {players.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {memberName(member)}
              </option>
            ))}
          </select>
          <input
            className={ui.input}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Character name"
            required
          />
          <button type="submit" className={ui.button("primary")}>
            Create
          </button>
        </form>
      )}

      {!isGM && (
        <>
          <h3 className={ui.h3}>Your character</h3>
          {mine.length === 0 ? (
            <p className={ui.mutedP}>You don't have a character yet!</p>
          ) : (
            mine.map(renderCard)
          )}
          <hr className={ui.hr} />
        </>
      )}

      <h3 className={ui.h3}>{isGM ? "All characters" : "The party"}</h3>
      {others.length === 0 ? (
        <p className={ui.mutedP}>No characters here yet.</p>
      ) : (
        others.map(renderCard)
      )}
    </section>
  );
}
