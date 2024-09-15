import '@fontsource/inter';

import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import { type ReactNode, useEffect } from 'react';
import useStarlightTheme, { getInitialTheme, type Theme } from 'src/hooks/useStarlightTheme';

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

  useEffect(() => {
    setMode(getInitialTheme());
  }, [setMode]);

  useStarlightTheme((newTheme: Theme) => {
    setMode(newTheme);
  });

  return children;
}
