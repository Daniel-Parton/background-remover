import { AppShell, Header, Group } from "@mantine/core";
import { AppLogo } from "components/app-logo";
import { ThemeSwitchButton } from "components/theme-switch-button";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export const AppLayout = ({ children }: Props) => {
  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="xs">
          <Group miw={380} noWrap position="apart" align="center">
            <AppLogo />
            <ThemeSwitchButton />
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};
