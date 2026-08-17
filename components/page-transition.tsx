"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition() {
  const pathname = usePathname();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      document.documentElement.classList.remove(
        "page-transition-active"
      );
    }, 460);

    document.documentElement.classList.add(
      "page-transition-active"
    );

    return () => {
      window.clearTimeout(timer);
      document.documentElement.classList.remove(
        "page-transition-active"
      );
    };
  }, [pathname]);

  return (
    <div
      className="page-transition"
      aria-hidden="true"
    >
      <div className="page-transition__loader">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
