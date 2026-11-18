"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "talbetal_visitor_id";

function visitorId() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;
  const value = crypto.randomUUID().replaceAll("-", "");
  window.localStorage.setItem(STORAGE_KEY, value);
  return value;
}

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const id = visitorId();
    const record = () => {
      if (document.visibilityState === "visible") {
        void fetch("/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId: id }),
          keepalive: true,
        });
      }
    };
    record();
    const timer = window.setInterval(record, 60_000);
    document.addEventListener("visibilitychange", record);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", record);
    };
  }, [pathname]);

  return null;
}
