"use client";

import { useEffect } from "react";

let printed = false;

/** A hidden message for anyone who opens the browser console. */
export default function ConsoleSignal() {
  useEffect(() => {
    if (printed) return;
    printed = true;

    const title = "font-size:38px;font-weight:800;color:#4fc3f7;text-shadow:0 0 12px rgba(79,195,247,0.6)";
    const sub = "color:#8892a0;letter-spacing:4px;font-size:11px";
    const blue = "color:#4fc3f7;font-size:12px";
    const purple = "color:#9c6aff;font-size:12px;letter-spacing:2px";
    const pink = "color:#e040fb;font-size:12px";
    const dim = "color:#e8eaed;font-size:12px";

    console.log("%cTMSTRY", title);
    console.log("%c// HUMAN // SIGNAL // AI", sub);
    console.log("%cYou opened the console. Of course you did.", dim);
    console.log("%cSome signals are hidden. Look for the static in the nav. ▓▓░", blue);
    console.log("%c01010100 01001101 01010011", purple);
    console.log("%cBuilders welcome. Work for hire? → contact@tmstry.com", pink);
  }, []);

  return null;
}
