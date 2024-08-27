import { useEffect, type Dispatch, type SetStateAction } from "react";

export type StarlightTheme = "dark" | "light";

export default function useStarlightTheme(setTheme: Dispatch<SetStateAction<StarlightTheme>>) {
  return useEffect(() => {
    const handleThemeChange = (e: Event) => {
      if (e.currentTarget instanceof HTMLSelectElement) {
        setTheme(parseTheme(e.currentTarget.value));
      }
    };

    const themeChangeAbortController = new AbortController();
    document
      .querySelector("starlight-theme-select select")
      ?.addEventListener("change", handleThemeChange, {
        signal: themeChangeAbortController.signal,
      });

    return () => themeChangeAbortController.abort();
  }, []);
}

export function getInitialTheme(): StarlightTheme {
  const storedTheme =
    document.documentElement.dataset.theme || localStorage?.getItem("starlight-theme");

  return parseTheme(storedTheme);
}

function parseTheme(theme: unknown): StarlightTheme {
  if (theme === "dark" || theme === "light") {
    return theme;
  }

  return getPreferredColorScheme();
}

function getPreferredColorScheme(): StarlightTheme {
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
