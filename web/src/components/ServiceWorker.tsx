"use client";

import { useEffect } from "react";

/** Uygulamanın ana ekrana eklenebilmesi için servis çalışanını kaydeder. */
export default function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
  }, []);
  return null;
}
