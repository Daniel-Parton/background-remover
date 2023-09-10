import React from "react";
import { Group, Title } from "@mantine/core";
import { IconPhotoStar } from "@tabler/icons-react";

export const AppLogo = () => {
  return (
    <Group align="center">
      <IconPhotoStar size="2rem" />
      <Title order={3}>Background Remover</Title>
    </Group>
  );
};
