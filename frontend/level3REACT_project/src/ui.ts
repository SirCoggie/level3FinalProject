import type { PlayerStatus } from "./assets/campaigns/panel/types";

export const page = "mx-auto max-w-[1200px] px-4 pt-6 pb-12";
export const pageHeader =
  "mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-edge pb-3";
export const campaignGrid =
  "grid grid-cols-1 items-start gap-4 min-[601px]:grid-cols-[repeat(auto-fit,minmax(340px,1fr))]";
export const centerScreen = "grid min-h-screen place-items-center p-4";
export const authCard = "w-full max-w-[420px]";
export const stack = "flex flex-col gap-[0.6rem]";
export const row = "flex flex-wrap items-center gap-2";
export const rowBetween = "flex flex-wrap items-center justify-between gap-2";
export const nav = "mt-4 flex flex-wrap gap-4";

const panelBase =
  "relative rounded-md border bg-panel bg-linear-to-b from-white/[0.02] to-transparent to-40% px-[1.2rem] py-[1.1rem] hover:border-gold-dark " +
  "before:pointer-events-none before:absolute before:-top-px before:-left-px before:size-3.5 before:rounded-tl-md before:border-2 before:border-r-0 before:border-b-0 before:border-gold-dark before:content-[''] " +
  "after:pointer-events-none after:absolute after:-right-px after:-bottom-px after:size-3.5 after:rounded-br-md after:border-2 after:border-t-0 after:border-l-0 after:border-gold-dark after:content-['']";
export const panel = `${panelBase} border-edge shadow-[inset_0_0_0_1px_rgba(0,0,0,0.6),inset_0_0_24px_rgba(0,0,0,0.55),0_4px_14px_rgba(0,0,0,0.6)]`;
export const panelGlow = `${panelBase} border-gold-dark shadow-[inset_0_0_24px_rgba(0,0,0,0.55),0_0_8px_rgba(212,175,55,0.35)]`;
export const panelTitle =
  "-mt-[0.2rem] mb-[0.9rem] flex items-center justify-between gap-2 border-b border-edge pb-2";

const headingBase = "mb-[0.6em] font-display leading-[1.2] tracking-[0.04em] text-gold";
export const h1 = `${headingBase} text-[2rem] text-shadow-glow`;
export const h2 = `${headingBase} text-[1.4rem]`;
export const h3 = `${headingBase} text-[1.15rem]`;

export const p = "mb-[0.6em]";
export const muted = "text-[0.85em] text-parchment-dim";
export const mutedP = `${muted} mb-[0.6em]`;
export const name = "font-semibold";
export const link =
  "border-b border-dotted border-gold-dark text-gold-bright no-underline hover:text-[#fff3c4] hover:text-shadow-glow";
export const hr = "my-[1.2rem] h-px border-0 bg-linear-to-r from-transparent via-gold-dark to-transparent";
export const loading = "py-12 text-center font-display text-parchment-dim";
export const preWrap = "m-0 whitespace-pre-wrap";

export const label =
  "flex flex-col gap-1 font-display text-[0.8rem] uppercase tracking-[0.06em] text-parchment-dim";
export const labelInline = "flex flex-row items-center gap-2 font-body text-base text-parchment";

const fieldCore =
  "rounded border border-stone-light bg-input px-[0.7rem] py-2 font-body text-base normal-case tracking-normal text-parchment " +
  "shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-[border-color,box-shadow] duration-150 " +
  "placeholder:text-[#7d735e] placeholder:italic " +
  "focus:border-gold focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_0_8px_rgba(212,175,55,0.35)] focus:outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-55";
export const input = `${fieldCore} w-full`;
export const textarea = `${fieldCore} w-full min-h-[90px] resize-y`;
export const select = `${fieldCore} w-full cursor-pointer`;
export const selectCompact = `${fieldCore} w-auto cursor-pointer`;
export const checkbox = "size-[1.15rem] cursor-pointer accent-gold";
export const formRow =
  "mb-4 flex flex-wrap items-stretch gap-2 [&>input]:w-auto [&>input]:flex-[1_1_160px] [&>select]:w-auto [&>select]:flex-[1_1_160px]";
export const formRowTight =
  "flex flex-wrap items-stretch gap-2 [&>input]:w-auto [&>input]:flex-[1_1_160px] [&>select]:w-auto [&>select]:flex-[1_1_160px]";

type ButtonVariant = "stone" | "primary" | "danger" | "ghost";
type ButtonSize = "md" | "sm" | "dice";

const buttonBase =
  "inline-block cursor-pointer whitespace-nowrap rounded text-center font-display font-bold uppercase tracking-[0.06em] no-underline " +
  "[text-shadow:0_1px_1px_#000] transition-[transform,box-shadow,color] duration-150 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
  "not-disabled:active:translate-y-px not-disabled:active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] " +
  "disabled:cursor-not-allowed disabled:opacity-50";
const glowHover =
  "not-disabled:hover:text-gold-bright not-disabled:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_3px_rgba(0,0,0,0.7),0_0_8px_rgba(212,175,55,0.35)]";
const raisedShadow = "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_3px_rgba(0,0,0,0.7)]";

const buttonVariants: Record<ButtonVariant, string> = {
  stone: `border border-[#111] border-t-[#5d5d66] bg-linear-to-b from-stone-light via-stone via-55% to-stone-dark text-parchment ${raisedShadow} ${glowHover}`,
  primary: `border border-[#2a1a0e] border-t-[#8a5d3b] bg-linear-to-b from-leather-light via-leather via-60% to-[#3d2716] text-[#f3e3c3] ${raisedShadow} ${glowHover}`,
  danger: `border border-[#2b0b0b] border-t-[#b04848] bg-linear-to-b from-[#8c2e2e] to-danger-dark text-parchment ${raisedShadow} not-disabled:hover:text-[#ffd6d6] not-disabled:hover:shadow-[0_0_10px_rgba(178,58,58,0.6)]`,
  ghost: `border border-edge bg-transparent text-parchment shadow-none ${glowHover}`,
};

const buttonSizes: Record<ButtonSize, string> = {
  md: "px-4 py-2 text-[0.85rem]",
  sm: "px-[0.6rem] py-[0.3rem] text-[0.72rem]",
  dice: "px-0 py-3 text-base",
};

export function button(variant: ButtonVariant = "stone", size: ButtonSize = "md"): string {
  return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]}`;
}

type BadgeTone = "default" | "gold" | "danger" | "success";

const badgeBase =
  "inline-block rounded-full border bg-input px-2 py-[0.1rem] font-display text-[0.68rem] uppercase tracking-[0.08em]";

const badgeTones: Record<BadgeTone, string> = {
  default: "border-edge text-parchment-dim",
  gold: "border-gold-dark text-gold",
  danger: "border-danger text-[#f0a0a0]",
  success: "border-success text-[#a7d7a2]",
};

export function badge(tone: BadgeTone = "default"): string {
  return `${badgeBase} ${badgeTones[tone]}`;
}

const statusText: Record<PlayerStatus, string> = {
  normal: "text-parchment",
  poisoned: "text-[#8fd16a]",
  dead: "text-[#9b9b9b] line-through",
  rage: "text-[#ff6b4a]",
  insane: "text-[#c18cff]",
  "love-sick": "text-[#ff8fc8]",
};

export function statusBadge(status: PlayerStatus): string {
  return `${badgeBase} border-edge ${statusText[status] ?? "text-parchment-dim"}`;
}

const cardBase =
  "mb-3 rounded-md border border-l-[3px] border-stone-light bg-panel-raised px-4 py-[0.8rem] last:mb-0";

export function card(retired = false): string {
  return retired ? `${cardBase} border-l-stone-light opacity-50` : `${cardBase} border-l-gold-dark`;
}

export const cardTitle =
  "mb-2 flex flex-wrap items-baseline gap-[0.4rem] font-display text-[1.15rem] leading-[1.2] tracking-[0.04em] text-gold";

export const sheet = "mb-[0.6rem] grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-[0.4rem]";
export const sheetCell = "rounded border border-stone bg-input px-2 py-[0.3rem]";
export const sheetLabel = "font-display text-[0.7rem] uppercase tracking-[0.08em] text-parchment-dim";
export const sheetValue = "m-0 text-[1.1rem] font-semibold text-parchment";

export const list = "m-0 list-none p-0";
export const listItem =
  "flex flex-wrap items-center justify-between gap-2 border-b border-edge/45 px-[0.4rem] py-[0.55rem] last:border-b-0 hover:bg-gold/5";

export const diceGrid = "mb-4 grid grid-cols-[repeat(auto-fill,minmax(68px,1fr))] gap-2";
export const diceResult =
  "mt-1 mb-4 min-h-[1.2em] text-center font-display text-[3.5rem] font-bold text-gold-bright text-shadow-glow-strong max-[600px]:text-[2.8rem]";
export const diceLabel = "block text-[0.9rem] tracking-[0.1em] text-parchment-dim text-shadow-none";
export const rollHistory = "max-h-[260px] overflow-y-auto";
export const rollValue = "text-[1.2rem] text-gold-bright";

export const linkBox =
  "my-[0.4rem] break-all rounded border border-dashed border-gold-dark bg-input px-[0.7rem] py-2 font-mono text-[0.85rem]";

export function message(isError = false): string {
  return isError
    ? "mt-3 border-l-[3px] border-danger bg-danger/10 px-3 py-2"
    : "mt-3 border-l-[3px] border-gold-dark bg-gold/[0.06] px-3 py-2";
}
