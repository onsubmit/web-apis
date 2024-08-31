import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import type { ReactNode } from "react";
import useStarlightTheme, { type Theme } from "src/hooks/useTheme";

type JoyThemeProviderProps = {
  children: ReactNode;
};

export default function JoyThemeProvider({ children }: JoyThemeProviderProps) {
  return (
    <CssVarsProvider>
      <JoyThemedComponent>{children}</JoyThemedComponent>
    </CssVarsProvider>
  );
}

type JoyThemedComponentProps = {
  children: ReactNode;
};

export function JoyThemedComponent({ children }: JoyThemedComponentProps) {
  const { setMode } = useColorScheme();

  useStarlightTheme((newTheme: Theme) => {
    setMode(newTheme);
  });

  return children;
}
