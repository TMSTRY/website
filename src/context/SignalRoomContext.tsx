"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import TransmissionTransition from "@/components/signal/TransmissionTransition";

const SignalRoom = dynamic(() => import("@/components/signal/SignalRoom"), { ssr: false });

interface SignalRoomValue {
  open: (options?: { terminal?: boolean }) => void;
  close: () => void;
  isOpen: boolean;
  /** When true, the Signal Room opens with the terminal already active. */
  wantTerminal: boolean;
  clearWantTerminal: () => void;
}

const SignalRoomContext = createContext<SignalRoomValue>({
  open: () => {},
  close: () => {},
  isOpen: false,
  wantTerminal: false,
  clearWantTerminal: () => {},
});

export function SignalRoomProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [wantTerminal, setWantTerminal] = useState(false);
  const [transition, setTransition] = useState<null | "in" | "out">(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const open = useCallback((options?: { terminal?: boolean }) => {
    clearTimers();
    setWantTerminal(!!options?.terminal);
    setTransition("in");
    timers.current.push(setTimeout(() => setIsOpen(true), 650));
    timers.current.push(setTimeout(() => setTransition(null), 1150));
  }, []);

  const close = useCallback(() => {
    clearTimers();
    setWantTerminal(false);
    setTransition("out");
    timers.current.push(setTimeout(() => setIsOpen(false), 500));
    timers.current.push(setTimeout(() => setTransition(null), 1100));
  }, []);

  const clearWantTerminal = useCallback(() => setWantTerminal(false), []);

  return (
    <SignalRoomContext.Provider value={{ open, close, isOpen, wantTerminal, clearWantTerminal }}>
      {children}
      {isOpen && <SignalRoom />}
      <AnimatePresence>
        {transition && <TransmissionTransition key="signal-transition" mode={transition} />}
      </AnimatePresence>
    </SignalRoomContext.Provider>
  );
}

export const useSignalRoom = () => useContext(SignalRoomContext);
