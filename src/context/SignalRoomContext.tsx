"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import TransmissionTransition from "@/components/signal/TransmissionTransition";

const SignalRoom = dynamic(() => import("@/components/signal/SignalRoom"), { ssr: false });

interface SignalRoomValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const SignalRoomContext = createContext<SignalRoomValue>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

export function SignalRoomProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [transition, setTransition] = useState<null | "in" | "out">(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const open = useCallback(() => {
    clearTimers();
    setTransition("in");
    timers.current.push(setTimeout(() => setIsOpen(true), 650));
    timers.current.push(setTimeout(() => setTransition(null), 1150));
  }, []);

  const close = useCallback(() => {
    clearTimers();
    setTransition("out");
    timers.current.push(setTimeout(() => setIsOpen(false), 500));
    timers.current.push(setTimeout(() => setTransition(null), 1100));
  }, []);

  return (
    <SignalRoomContext.Provider value={{ open, close, isOpen }}>
      {children}
      {isOpen && <SignalRoom />}
      <AnimatePresence>
        {transition && <TransmissionTransition key="signal-transition" mode={transition} />}
      </AnimatePresence>
    </SignalRoomContext.Provider>
  );
}

export const useSignalRoom = () => useContext(SignalRoomContext);
