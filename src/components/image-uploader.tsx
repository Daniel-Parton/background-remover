import { useEffect, useRef } from "react";
import { Button, Progress, Stack, Text, useMantineTheme } from "@mantine/core";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { IconUpload } from "@tabler/icons-react";
import { useStopWatch } from "hooks/use-stop-watch";

type Props = {
  onUploadSuccess: (file: FileWithPath) => void;
  isLoading?: boolean;
  disabled?: boolean;
  progressCaption: string;
  progressPercent: number;
};
export const ImageUploader = ({
  onUploadSuccess,
  disabled: disabledProp = false,
  isLoading = false,
  progressCaption,
  progressPercent,
}: Props) => {
  const openRef = useRef<() => void>(null);
  const disabled = disabledProp || isLoading;

  return (
    <Dropzone
      disabled={disabled}
      multiple={false}
      openRef={openRef}
      onDrop={(f) => {
        const file = f?.[0];
        if (file) {
          onUploadSuccess(file);
        }
      }}
      accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
      activateOnClick={false}
      styles={{ inner: { pointerEvents: "all" } }}
    >
      <Stack w="100%" spacing="0.4rem" align="center">
        {!isLoading ? (
          <>
            <Button
              size="lg"
              disabled={disabled}
              leftIcon={<IconUpload />}
              onClick={() => openRef.current!()}
            >
              Upload Image
            </Button>
            <Text>or drop a file to start</Text>
          </>
        ) : (
          <CountDownDisplay
            caption={progressCaption}
            percent={progressPercent}
          />
        )}
      </Stack>
    </Dropzone>
  );
};

type CountDownDisplayProps = {
  caption: string;
  percent: number;
};
const CountDownDisplay = ({ caption, percent }: CountDownDisplayProps) => {
  const [time, { start }] = useStopWatch();
  const theme = useMantineTheme();
  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Progress
        w="100%"
        size="xl"
        animate
        bg={theme.colorScheme === "dark" ? "blue.3" : "blue.1"}
        label={`${percent.toFixed(0)}%`}
        sections={[{ value: percent, color: "blue" }]}
      />
      <Text>{`${caption} ${
        percent >= 1 ? `${percent.toFixed(0)}%` : ""
      }`}</Text>

      <Text>
        {time.minutes.toString().padStart(2, "0")}:
        {time.seconds.toString().padStart(2, "0")}:
        {time.milliseconds.toString().padStart(2, "0")}
      </Text>
    </>
  );
};
