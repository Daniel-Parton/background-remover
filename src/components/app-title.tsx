import { Text, Title } from "@mantine/core";

export const AppTitle = () => {
  return (
    <Title ta="center" order={1}>
      Upload an{" "}
      <Text
        span
        inherit
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan", deg: 45 }}
      >
        image
      </Text>{" "}
      to remove the{" "}
      <Text
        span
        inherit
        variant="gradient"
        gradient={{ from: "cyan", to: "indigo", deg: 45 }}
      >
        background
      </Text>
    </Title>
  );
};
