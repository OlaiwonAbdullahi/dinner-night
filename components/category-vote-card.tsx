"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Share01Icon,
  PlusSignIcon,
  MinusSignIcon,
  CheckmarkCircle01Icon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VotingCategory } from "@/lib/data";

const PRICE_PER_VOTE = 50;
const MIN_VOTES = 2; // minimum spend ₦100

function avatarUrl(name: string) {
  return `https://tapback.co/api/avatar/${encodeURIComponent(name)}.webp`;
}

type Props = {
  category: VotingCategory;
  index: number;
};

export function CategoryVoteCard({ category, index }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(MIN_VOTES);
  const [voted, setVoted] = useState(false);
  const [open, setOpen] = useState(false);

  const total = quantity * PRICE_PER_VOTE;
  const selectedContestant = category.contestants.find(
    (c) => c.id === selected,
  );

  function handleVote() {
    if (!selected) return;
    setVoted(true);
  }

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (!v && !voted) {
      setSelected(null);
      setQuantity(MIN_VOTES);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* ── Card ────────────────────────────────────────── */}
      <DialogTrigger asChild>
        <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_oklch(0.745_0.14_86/0.08)]">
          {/* Banner image */}
          <div className="relative h-44 w-full overflow-hidden">
            <Image
              src="/image.png"
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

            <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest text-white/30">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white group-hover:text-primary transition-colors">
                {category.name}
              </h3>
            </div>
          </div>

          {/* Contestant avatars row */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex -space-x-2.5">
              {category.contestants.slice(0, 4).map((c, i) => (
                <div
                  key={c.id}
                  style={{ zIndex: 4 - i }}
                  className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-card bg-card"
                >
                  <img
                    src={avatarUrl(c.name)}
                    alt={c.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              ))}
            </div>
            <span className="text-[11px] text-white/30">
              {category.contestants.length} nominees
            </span>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
            <span className="text-[10px] font-bold tracking-widest text-primary/50 uppercase">
              ₦{PRICE_PER_VOTE.toLocaleString()}/vote · min ₦{(PRICE_PER_VOTE * MIN_VOTES).toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-primary/60 group-hover:text-primary transition-colors">
              <HugeiconsIcon
                icon={ThumbsUpIcon}
                size={12}
                color="currentColor"
              />
              Vote
            </span>
          </div>
        </div>
      </DialogTrigger>

      {/* ── Dialog ──────────────────────────────────────── */}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {voted ? (
          /* ── Success ── */
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
              <HugeiconsIcon
                icon={CheckmarkCircle01Icon}
                size={30}
                color="currentColor"
                className="text-primary"
              />
            </div>
            <p className="text-base font-bold text-white">Vote Submitted!</p>
            <p className="text-sm text-white/40">
              You voted for{" "}
              <span className="font-semibold text-primary">
                {selectedContestant?.name}
              </span>{" "}
              with {quantity} {quantity === 1 ? "vote" : "votes"}.
            </p>
            <Button
              className="mt-2 bg-primary text-black hover:bg-primary/80 font-bold"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row">
            {/* ── Left: banner image ── */}
            <div className="relative hidden sm:block w-56 shrink-0">
              <Image
                src="/image.png"
                alt={category.name}
                fill
                className="object-cover rounded-l-2xl"
                sizes="224px"
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent to-black/60 rounded-l-2xl" />
            </div>

            {/* ── Right: voting details ── */}
            <div className="flex flex-col flex-1 p-6">
              <DialogHeader>
                <div className="mb-1 text-[10px] font-bold tracking-[0.25em] text-primary/60 uppercase">
                  Award Category
                </div>
                <DialogTitle className="uppercase tracking-wide leading-tight">
                  {category.name}
                </DialogTitle>
              </DialogHeader>

              {/* Share + price */}
              <div className="mt-4 mb-5 flex items-center justify-between">
                <button className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/50 hover:border-primary/30 hover:text-primary transition-all">
                  <HugeiconsIcon
                    icon={Share01Icon}
                    size={13}
                    color="currentColor"
                  />
                  Share
                </button>
                <div className="text-right">
                  <span className="text-xs text-white/30">per vote</span>
                  <p className="text-sm font-extrabold text-primary">
                    ₦{PRICE_PER_VOTE.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-4 h-px bg-white/5" />

              <p className="mb-3 text-[11px] font-semibold tracking-wider text-white/30 uppercase">
                Select a nominee
              </p>

              {/* Contestants grid */}
              <div className="mb-4 grid grid-cols-2 gap-2">
                {category.contestants.map((c) => {
                  const isSelected = selected === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c.id)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all",
                        isSelected
                          ? "border-primary/60 bg-primary/8"
                          : "border-white/8 bg-white/3 hover:border-white/20",
                      )}
                    >
                      {/* Radio dot */}
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all",
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-white/20",
                        )}
                      >
                        {isSelected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-black" />
                        )}
                      </span>

                      {/* DiceBear avatar */}
                      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-card">
                        <img
                          src={avatarUrl(c.name)}
                          alt={c.name}
                          fill
                          className="object-cover"
                          sizes="28px"
                        />
                      </div>

                      <span
                        className={cn(
                          "truncate text-xs font-semibold leading-tight",
                          isSelected ? "text-white" : "text-white/60",
                        )}
                      >
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mb-4 h-px bg-white/5" />

              {/* Quantity stepper */}
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-semibold text-white/50">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(MIN_VOTES, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-primary/40 hover:text-primary transition-all"
                  >
                    <HugeiconsIcon
                      icon={MinusSignIcon}
                      size={14}
                      color="currentColor"
                    />
                  </button>
                  <span className="w-6 text-center text-sm font-extrabold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-primary/40 hover:text-primary transition-all"
                  >
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      size={14}
                      color="currentColor"
                    />
                  </button>
                </div>
              </div>

              {/* Vote button */}
              <Button
                className="w-full bg-primary text-black hover:bg-primary/80 font-extrabold tracking-wider"
                onClick={handleVote}
                disabled={!selected}
              >
                Vote for ₦{total.toLocaleString()}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
