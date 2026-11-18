export type PlayerStatus =
  | "normal"
  | "poisoned"
  | "dead"
  | "rage"
  | "insane"
  | "love-sick";

export const PLAYER_STATUSES: PlayerStatus[] = [
  "normal",
  "poisoned",
  "dead",
  "rage",
  "insane",
  "love-sick",
];

export type Character = {
  id: string;
  user_id: string;
  name: string;
  sheet_data: Record<string, unknown>;
  notes: string | null;
  is_active: boolean;
  created_at: string;
};

export type Member = {
  id: string;
  user_id: string;
  role: "gm" | "players";
  status: PlayerStatus;
  can_roll_dice: boolean;
  joined_at: string;
  app_users: { email: string } | null;
};

export function memberName(member: Member | undefined): string {
  const email = member?.app_users?.email;
  if (!email) return "Unknown player";
  if (email.endsWith("@seats.invalid")) {
    return `Player ${email.replace("seat-", "").slice(0, 6)}`;
  }
  return email;
}
