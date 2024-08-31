import { extendTheme } from "@mui/joy/styles";
import type { Theme } from "./hooks/useTheme";

const baseTheme = extendTheme();

const light = extendTheme({
  colorSchemes: {
    light: baseTheme.colorSchemes.light,
    dark: baseTheme.colorSchemes.light,
  },
});

const dark = extendTheme({
  colorSchemes: {
    light: baseTheme.colorSchemes.dark,
    dark: baseTheme.colorSchemes.dark,
  },
});

export function getJoyTheme(theme: Theme) {
  switch (theme) {
    case "light":
      return light;
    case "dark":
      return dark;
  }
}
