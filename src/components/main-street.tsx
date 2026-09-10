import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  MS_GOODS,
  MS_INTENTS,
  MS_LESSONS,
  MS_MODES,
  MS_PLACES,
  MS_REGION_BY_ID,
  MS_REGIONS,
  NAV_APPROVE,
  NAV_DENY,
  NAV_LATER,
  NAV_NO_WALLET,
  NAV_RECEIPT,
  NAV_ROLE,
  NAV_WELCOME,
  bumpPlace,
  loadMs,
  msReceipt,
  saveMs,
  type MsIntent,
  type MsMode,
  type MsPlace,
  type MsReceipt,
  type MsRegionId,
  type MsState,
} from "@/lib/main-street";
import { cn } from "@/lib/utils";
import { useCompute } from "@/lib/compute";
import { ComputeDock } from "@/components/grid-chrome";
import { type MsGfx } from "@/lib/gfx";
import { ThresholdPortal } from "@/components/threshold-portal";

type WorldProps = {
  focus: MsRegionId | null;
  inside: MsRegionId | null;
  highlight: MsRegionId | null;
  gfx: MsGfx;
  mode: MsMode;
  onFocus: (id: MsRegionId) => void;
  onEnter: (id: MsRegionId) => void;
};

type Sheet =
  | { kind: "none" }
  | { kind: "explain"; text: string }
  | { kind: "confirm"; action: string; title: string; body: string; region: MsRegionId }
  | { kind: "receipt"; receipt: MsReceipt }
  | { kind: "list" }
  | { kind: "lesson"; title: string; body: string };

export function MainStreet({ onClose, onCity }: { onClose: () => void; onCity: () => void }) {
  const [World, setWorld] = useState<ComponentType<WorldProps> | null>(null);
  const [state, setState] = useState<MsState>(() => loadMs());
  const [focus, setFocus] = useState<MsRegionId>("plaza");
  const [inside, setInside] = useState<MsRegionId | null>(null);
  const [speech, setSpeech] = useState(NAV_WELCOME);
  const [dockOpen, setDockOpen] = useState(true);
  const [sheet, setSheet] = useState<Sheet>({ kind: "none" });
  const [compute, setCompute, gfx] = useCompute();
  const [pending, setPending] = useState<MsIntent | null>(null);

  useEffect(() => {
    if (compute === "minimum") {
      setWorld(null);
      return;
    }
    let alive = true;
    void import("@/components/main-street-world").then((mod) => {
      if (alive) setWorld(() => mod.MainStreetWorld);
    });
    return () => {
      alive = false;
    };
  }, [compute]);

  useEffect(() => {
    saveMs(state);
  }, [state]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      if (sheet.kind !== "none") {
        setSheet({ kind: "none" });
        return;
      }
      if (inside) {
        setInside(null);
        setSpeech("Back on the boulevard. Where next?");
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [inside, onClose, sheet.kind]);

  const region = MS_REGION_BY_ID[inside ?? focus];
  const highlight = pending ? MS_INTENTS.find((i) => i.id === pending)?.region ?? null : focus;
  const place = MS_PLACES.find((p) => p.id === state.place)!;
  const quest = Math.min(1, state.seen.length / MS_REGIONS.length);

  const markSeen = (id: MsRegionId) => {
    setState((s) => ({ ...s, seen: s.seen.includes(id) ? s.seen : [...s.seen, id] }));
  };

  const enter = (id: MsRegionId) => {
    if (id === "own" && state.mode === "web2") {
      setSpeech("Ownership is further down the street. You do not need it yet.");
      setFocus("own");
      setPending(null);
      return;
    }
    setInside(id);
    setFocus(id);
    markSeen(id);
    setPending(null);
    const r = MS_REGION_BY_ID[id];
    setSpeech(r.next);
    setSheet({ kind: "none" });
  };

  const recommend = (intent: MsIntent) => {
    const item = MS_INTENTS.find((i) => i.id === intent)!;
    setPending(intent);
    setFocus(item.region);
    setSpeech(item.line);
    setSheet({ kind: "none" });
  };

  const takeThere = () => {
    const id = pending ? MS_INTENTS.find((i) => i.id === pending)?.region : focus;
    if (id) enter(id);
  };

  const showMe = () => {
    const id = pending ? MS_INTENTS.find((i) => i.id === pending)?.region : focus;
    if (!id) return;
    setFocus(id);
    setInside(null);
    setSpeech(`This is ${MS_REGION_BY_ID[id].name}. Tap again when you want to go in.`);
  };

  const writeReceipt = (receipt: MsReceipt, placeTo?: MsPlace) => {
    setState((s) => ({
      ...s,
      receipts: [receipt, ...s.receipts].slice(0, 24),
      place: placeTo ? bumpPlace(s.place, placeTo) : s.place,
    }));
    setSheet({ kind: "receipt", receipt });
    setSpeech(NAV_RECEIPT);
  };

  const runAction = (actionId: string) => {
    const r = MS_REGION_BY_ID[inside ?? focus];
    const action = r.actions.find((a) => a.id === actionId);
    if (!action) {
      if (MS_INTENTS.some((i) => i.id === actionId)) {
        recommend(actionId as MsIntent);
        return;
      }
      return;
    }
    if (action.deny) {
      setSpeech(NAV_DENY);
      setSheet({
        kind: "explain",
        text: "No live wallet on this floor. I can explain custody, fees, and withdrawal. I cannot connect a wallet here.",
      });
      writeReceipt(
        msReceipt({
          region: r.id,
          action: actionId,
          title: "Wallet connect denied",
          mode: state.mode,
          observed: "User asked to connect a wallet.",
          verified: "No signer on this floor.",
          paid: "None",
          received: "None",
          owned: "None",
          withdraw: "None",
          note: "DENY. Guidance is not permission.",
        }),
      );
      return;
    }
    if (action.sensitive) {
      setSpeech(NAV_APPROVE);
      setSheet({
        kind: "confirm",
        action: actionId,
        region: r.id,
        title: action.label,
        body: confirmCopy(actionId, state.mode),
      });
      return;
    }
    applyAction(actionId, r.id);
  };

  const applyAction = (actionId: string, regionId: MsRegionId) => {
    const good = actionId === "buy-pin" ? MS_GOODS[0] : actionId === "buy-note" ? MS_GOODS[1] : null;
    if (good) {
      writeReceipt(
        msReceipt({
          region: regionId,
          action: actionId,
          title: `Preview checkout · ${good.name}`,
          mode: state.mode,
          observed: `User asked for ${good.name}.`,
          verified: "Local preview only. No payment rail.",
          paid: `${good.price} · not charged`,
          received: good.get,
          owned: good.own,
          withdraw: good.withdraw,
          note: "No money moved. This is a local receipt on this floor.",
        }),
        "look",
      );
      return;
    }
    if (actionId === "save") {
      setState((s) => ({ ...s, saved: true, place: bumpPlace(s.place, "save") }));
      writeReceipt(
        msReceipt({
          region: "services",
          action: "save",
          title: "Place saved on this device",
          mode: state.mode,
          observed: "User asked to save their place.",
          verified: "Written to this device only.",
          paid: "None",
          received: "A local resident mark.",
          owned: "None",
          withdraw: "None",
          note: "Not a city account. Not a wallet.",
        }),
        "save",
      );
      return;
    }
    if (actionId === "make") {
      const artifact = `Street note · ${new Date().toLocaleTimeString()}`;
      setState((s) => ({ ...s, artifact, place: bumpPlace(s.place, "work") }));
      writeReceipt(
        msReceipt({
          region: "creator",
          action: "make",
          title: "Something made on this floor",
          mode: state.mode,
          observed: "User made a local note.",
          verified: "Stored on this device.",
          paid: "None",
          received: artifact,
          owned: "Local only. Not published live.",
          withdraw: "None",
          note: "No live publish. No live payout.",
        }),
        "work",
      );
      return;
    }
    if (actionId === "publish") {
      writeReceipt(
        msReceipt({
          region: "creator",
          action: "publish",
          title: "Publish stayed local",
          mode: state.mode,
          observed: "User asked to publish.",
          verified: "No public host write on this floor.",
          paid: "None",
          received: state.artifact ?? "Nothing to send.",
          owned: "Local only",
          withdraw: "None",
          note: "Publish is local. The live city did not receive this.",
        }),
      );
      return;
    }
    if (actionId === "sample") {
      writeReceipt(
        msReceipt({
          region: "work",
          action: "sample",
          title: "Sample task finished",
          mode: state.mode,
          observed: "User ran a sample task.",
          verified: "SAMPLE. No employer. No payout.",
          paid: "None",
          received: "A practice receipt.",
          owned: "None",
          withdraw: "None",
          note: "There are no live jobs on this floor.",
        }),
        "work",
      );
      return;
    }
    if (actionId === "find" || actionId === "browse" || actionId === "play" || actionId === "account" || actionId === "help" || actionId === "receipts") {
      if (actionId === "receipts" || actionId === "account") {
        setSheet({ kind: "list" });
        setSpeech(state.receipts.length ? "Here are the receipts from this device." : "No receipts yet. Do one thing and I will write one.");
        return;
      }
      if (actionId === "help") {
        setSheet({ kind: "explain", text: NAV_ROLE + " " + NAV_NO_WALLET });
        setSpeech("Ask me to show you, take you there, or explain a word.");
        return;
      }
      if (actionId === "find") {
        setSpeech("No live jobs on this floor. You can still try a sample so you see how a receipt looks.");
        return;
      }
      if (actionId === "browse") {
        setSpeech("Previews only. No live show and no live store inventory.");
        return;
      }
      if (actionId === "play") {
        setSpeech("Preview loop. Nothing is streaming in.");
        return;
      }
    }
    if (actionId.startsWith("lesson-")) {
      const lesson = MS_LESSONS[actionId];
      if (lesson) {
        setSheet({ kind: "lesson", title: lesson.title, body: lesson.body });
        setSpeech("One lesson. Tell me when you want the next.");
        if (actionId === "lesson-wallet" && state.mode === "web2") {
          setSpeech("This idea lives further down the street. I can still explain it simply.");
        }
      }
      return;
    }
    if (actionId === "wallet" || actionId === "custody" || actionId === "fees" || actionId === "withdraw") {
      const text =
        actionId === "wallet"
          ? MS_LESSONS["lesson-wallet"].body
          : actionId === "custody"
            ? "Custody is who holds the key. If we hold it, we must say so. If you hold it, you can lose it. This floor holds nothing."
            : actionId === "fees"
              ? "Fees are what you pay to move value. They must be shown before you approve. No fee is charged here."
              : "Withdrawal is how you take value out. Terms must be plain. There is nothing to withdraw on this floor.";
      setSheet({ kind: "explain", text });
      setSpeech("Read first. I will not act for you.");
      setState((s) => ({ ...s, place: bumpPlace(s.place, "claim") }));
    }
  };

  const confirmGo = () => {
    if (sheet.kind !== "confirm") return;
    const { action, region: regionId } = sheet;
    setSheet({ kind: "none" });
    applyAction(action, regionId);
  };

  const mapMode = gfx === "map";
  const dockActions = useMemo(() => {
    if (pending) {
      return [
        { id: "show", label: "Show me", run: showMe },
        { id: "take", label: "Take me there", run: takeThere },
        { id: "later", label: "Not now", run: () => { setPending(null); setSpeech(NAV_LATER); } },
      ];
    }
    if (inside) {
      return [
        { id: "do", label: region.actions[0]?.label ?? "Continue", run: () => runAction(region.actions[0]?.id ?? "help") },
        { id: "explain", label: "Explain", run: () => { setSpeech(region.explain); setSheet({ kind: "explain", text: region.explain }); } },
        { id: "out", label: "Back out", run: () => { setInside(null); setSpeech("Back on the boulevard."); } },
      ];
    }
    return [
      { id: "show", label: "Show me", run: showMe },
      { id: "take", label: "Take me there", run: takeThere },
      { id: "explain", label: "Explain", run: () => { setSpeech(region.explain); setSheet({ kind: "explain", text: region.explain }); } },
    ];
  }, [pending, inside, region, focus]);

  return (
    <div data-main-street className="ms-root absolute inset-0 z-[55] flex flex-col bg-ms-black text-paper">
      <div className="ms-scan pointer-events-none absolute inset-0 z-10" aria-hidden />
      <header className="relative z-20 flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2 sm:px-4">
        <button
          type="button"
          data-ms-exit
          onClick={onClose}
          className="ms-trace h-11 shrink-0 px-3 font-display text-2xs font-semibold tracking-[0.16em] text-ms-cyan"
        >
          City
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold tracking-[0.14em] text-ms-cyan sm:text-base">MAIN STREET</p>
          <p className="truncate font-sans text-2xs tracking-[0.1em] text-mute uppercase">Working build · guide on duty</p>
        </div>
        <QuestRing value={quest} />
        <ModeToggle
          mode={state.mode}
          onMode={(mode) => {
            setState((s) => ({ ...s, mode }));
            setSpeech(MS_MODES.find((m) => m.id === mode)?.note ?? NAV_NO_WALLET);
          }}
        />
      </header>

      <div className="relative min-h-0 flex-1">
        <div className="ms-back" aria-hidden>
          {compute === "minimum" ? (
            <img src="/media/stills/street-bridge.jpg" alt="" />
          ) : (
            <video
              src="/media/stills/street-bridge.mp4"
              poster="/media/stills/street-bridge.jpg"
              autoPlay
              muted
              loop
              playsInline
            />
          )}
        </div>
        {mapMode || !World ? (
          <MapFallback
            focus={focus}
            mode={state.mode}
            onFocus={(id) => {
              setFocus(id);
              setSpeech(MS_REGION_BY_ID[id].next);
            }}
            onEnter={enter}
          />
        ) : (
          <World
            focus={focus}
            inside={inside}
            highlight={highlight}
            gfx={gfx}
            mode={state.mode}
            onFocus={(id) => {
              setFocus(id);
              markSeen(id);
              setSpeech(MS_REGION_BY_ID[id].lead);
            }}
            onEnter={enter}
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-3">
          <p className="ms-where pointer-events-auto max-w-[36rem] px-4 py-2 text-center text-sm text-paper">
            {inside ? region.short : place.plain}
          </p>
        </div>

        {!inside && focus && focus !== "plaza" ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-28 z-20 flex justify-center px-3 md:bottom-10">
            <ThresholdPortal label="Enter" onClick={() => enter(focus)} className="pointer-events-auto" data-ms-enter="" />
          </div>
        ) : null}

        {inside && sheet.kind === "none" ? (
          <div className="absolute inset-x-3 bottom-36 z-20 sm:inset-x-auto sm:right-3 sm:bottom-28 sm:w-80">
            <div className="ms-sheet p-4">
              <p className="font-display text-sm font-semibold tracking-[0.08em] text-ms-cyan">{region.short}</p>
              <p className="mt-1 text-sm text-mute">{region.next}</p>
              <div className="mt-3 grid gap-2">
                {region.actions
                  .filter((a) => !(a.id === "lesson-wallet" && state.mode === "web2" && !inside))
                  .slice(0, 4)
                  .map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => runAction(a.id)}
                      className={cn(
                        "ms-trace h-11 px-3 text-left text-sm",
                        a.deny ? "text-ms-red" : "text-paper",
                      )}
                    >
                      {a.label}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ) : null}

        {sheet.kind !== "none" ? (
          <SheetCard
            sheet={sheet}
            receipts={state.receipts}
            onClose={() => setSheet({ kind: "none" })}
            onConfirm={confirmGo}
          />
        ) : null}

        {dockOpen ? (
          <aside data-ms-dock className="ms-dock absolute inset-x-3 bottom-3 z-30 sm:inset-x-auto sm:left-3 sm:w-[22rem]">
            <div className="flex items-start gap-3 p-3">
              <img className="ms-avatar" src="/media/stills/hood.jpg" alt="" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-2xs font-semibold tracking-[0.16em] text-ms-cyan uppercase">NEURO · Avatar</p>
                <p className="mt-1 text-sm text-paper">{speech}</p>
              </div>
              <button
                type="button"
                className="size-11 shrink-0 text-mute"
                aria-label="Hide guide"
                onClick={() => setDockOpen(false)}
              >
                –
              </button>
            </div>
            {!inside && !pending ? (
              <div className="grid grid-cols-5 gap-1 px-3 pb-2">
                {MS_INTENTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => recommend(item.id)}
                    className="ms-trace h-11 px-1 text-2xs tracking-[0.08em] text-ms-cyan"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="flex gap-1 px-3 pb-3">
              {dockActions.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={a.run}
                  className="ms-trace h-11 flex-1 px-2 text-xs tracking-[0.08em] text-paper"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </aside>
        ) : (
          <button
            type="button"
            className="ms-dock absolute bottom-3 left-3 z-30 flex h-12 items-center gap-2 px-3 text-sm text-ms-cyan"
            onClick={() => setDockOpen(true)}
          >
            <span className="ms-avatar ms-avatar-sm" aria-hidden />
            NEURO
          </button>
        )}

        <div className="absolute top-3 right-3 z-20">
          <ComputeDock value={compute} onChange={setCompute} />
        </div>
      </div>

      <footer className="relative z-20 flex items-center justify-between gap-3 border-t border-white/10 px-3 py-2 text-2xs tracking-[0.12em] text-mute uppercase">
        <span>{place.label}</span>
        <button type="button" onClick={onCity} className="h-10 text-ms-cyan">
          City
        </button>
        <span>Web2 · Bridge · Web3</span>
      </footer>
    </div>
  );
}

function confirmCopy(action: string, mode: MsMode) {
  if (action === "buy-pin" || action === "buy-note") {
    const g = action === "buy-pin" ? MS_GOODS[0] : MS_GOODS[1];
    return `${g.name} · ${g.price}. ${g.get} ${g.withdraw} No money will move. Mode: ${mode}.`;
  }
  if (action === "save") return "This saves your visit on this device. It is not a city account and not a wallet.";
  if (action === "publish") return "Publish stays on this device. The live city will not receive it.";
  if (action === "sample") return "This is a sample task. There is no employer and no payout.";
  if (action === "connect") return "No live wallet on this floor. Connecting would be denied.";
  return "Please confirm. I will not act until you say so.";
}

function ModeToggle({ mode, onMode }: { mode: MsMode; onMode: (mode: MsMode) => void }) {
  return (
    <div className="ms-mode flex h-11 items-center p-1" role="tablist" aria-label="Street depth">
      {MS_MODES.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={mode === item.id}
          onClick={() => onMode(item.id)}
          className={cn(
            "h-9 px-2.5 text-2xs tracking-[0.12em] uppercase",
            mode === item.id ? "text-ms-black bg-ms-cyan" : "text-mute",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function QuestRing({ value }: { value: number }) {
  const deg = Math.round(value * 360);
  return (
    <div
      className="ms-quest"
      style={{ background: `conic-gradient(var(--color-ms-cyan) ${deg}deg, #111 0deg)` }}
      aria-label={`Route progress ${Math.round(value * 100)} percent`}
    >
      <span>{Math.round(value * 8)}</span>
    </div>
  );
}

function MapFallback({
  focus,
  mode,
  onFocus,
  onEnter,
}: {
  focus: MsRegionId;
  mode: MsMode;
  onFocus: (id: MsRegionId) => void;
  onEnter: (id: MsRegionId) => void;
}) {
  return (
    <div className="flex h-full flex-col justify-end overflow-x-auto px-3 pb-40 pt-16">
      <div className="flex min-w-max items-end gap-3">
        {MS_REGIONS.filter((r) => !(r.later && mode === "web2")).map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => (focus === r.id ? onEnter(r.id) : onFocus(r.id))}
            className={cn("ms-chip h-24 w-36 flex-col items-start justify-end p-3 text-left", focus === r.id && "ms-chip-hot")}
          >
            <span className="ms-chip-led" data-led={focus === r.id ? "here" : r.later ? "later" : "open"} />
            <span className="font-display text-xs tracking-[0.1em]">{r.short}</span>
            <span className="text-2xs text-mute">{r.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SheetCard({
  sheet,
  receipts,
  onClose,
  onConfirm,
}: {
  sheet: Sheet;
  receipts: MsReceipt[];
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="absolute inset-x-3 bottom-36 z-40 sm:inset-x-auto sm:right-3 sm:bottom-28 sm:w-80">
      <div className="ms-sheet p-4">
        {sheet.kind === "explain" || sheet.kind === "lesson" ? (
          <>
            <p className="font-display text-sm font-semibold text-ms-cyan">
              {sheet.kind === "lesson" ? sheet.title : "Plain words"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-paper">{sheet.kind === "lesson" ? sheet.body : sheet.text}</p>
          </>
        ) : null}
        {sheet.kind === "confirm" ? (
          <>
            <p className="font-display text-sm font-semibold text-ms-cyan">{sheet.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-paper">{sheet.body}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={onClose} className="ms-trace h-11 text-sm text-mute">
                Not now
              </button>
              <button type="button" onClick={onConfirm} className="ms-trace h-11 bg-ms-cyan text-sm text-ms-black">
                Yes, do it
              </button>
            </div>
          </>
        ) : null}
        {sheet.kind === "receipt" ? (
          <ReceiptView receipt={sheet.receipt} />
        ) : null}
        {sheet.kind === "list" ? (
          <div className="max-h-64 overflow-y-auto">
            <p className="font-display text-sm font-semibold text-ms-cyan">Receipts on this device</p>
            {receipts.length === 0 ? (
              <p className="mt-2 text-sm text-mute">None yet.</p>
            ) : (
              receipts.map((r) => (
                <p key={r.id} className="mt-2 border-t border-white/10 pt-2 text-2xs text-mute">
                  {r.title} · {r.id}
                </p>
              ))
            )}
          </div>
        ) : null}
        {sheet.kind !== "confirm" ? (
          <button type="button" onClick={onClose} className="ms-trace mt-3 h-11 w-full text-sm text-mute">
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ReceiptView({ receipt }: { receipt: MsReceipt }) {
  return (
    <div data-ms-receipt>
      <p className="font-display text-sm font-semibold text-ms-green">Receipt</p>
      <p className="mt-1 font-mono text-2xs text-mute">{receipt.id}</p>
      <dl className="mt-3 grid gap-1 text-2xs">
        <div className="flex justify-between gap-3"><dt className="text-mute">Paid</dt><dd>{receipt.paid}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-mute">Received</dt><dd className="text-right">{receipt.received}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-mute">Owned</dt><dd className="text-right">{receipt.owned}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-mute">Withdraw</dt><dd className="text-right">{receipt.withdraw}</dd></div>
      </dl>
      <p className="mt-3 text-sm leading-relaxed text-paper">{receipt.note}</p>
    </div>
  );
}
