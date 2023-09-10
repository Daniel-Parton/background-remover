import { FC, useState, ReactNode } from "react";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useEvent } from "hooks/use-event";
import { useColorScheme } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
type Props = {
  children: ReactNode;
};
export const AppProvider: FC<Props> = ({ children }) => {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(preferredColorScheme);
  const handleThemeToggle = useEvent((value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"))
  );

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={handleThemeToggle}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Notifications position="bottom-center" autoClose={4000} />
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
