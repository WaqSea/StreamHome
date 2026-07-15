import { useLayoutEffect } from "react";
import type { AppView } from "./queryState";

export function useViewScrollToTop(view: AppView): void {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [view]);
}
