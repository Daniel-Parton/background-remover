import imglyRemoveBackground from "@imgly/background-removal";
import { AppProvider } from "components/app-provider";
import { AppLayout } from "components/app-layout";
import { Center, Stack, SimpleGrid, Image } from "@mantine/core";
import { ImageUploader } from "components/image-uploader";
import { useEvent } from "hooks/use-event";
import { FileWithPath } from "@mantine/dropzone";
import { useActionHandler } from "hooks/use-action-handler";
import { useState } from "react";
import { AppTitle } from "components/app-title";
import { notifications } from "@mantine/notifications";

const App = () => {
  const [handleAsync, { isHandling }] = useActionHandler();

  const [ogImage, setOgImage] = useState<string | null>(null);
  const [removedBgImage, setRemovedBgImage] = useState<string | null>(null);
  const [progressCaption, setProgressCaption] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const handleUploadAsync = useEvent((file: FileWithPath) => {
    setOgImage(URL.createObjectURL(file));
    setRemovedBgImage(null);
    return handleAsync(
      () =>
        imglyRemoveBackground(file, {
          progress: (key: string, current: number, total: number) => {
            setProgressPercent((current / total) * 100);
            setProgressCaption(
              key.startsWith("fetch") ? "Loading assets" : "Analyzing image"
            );
          },
        }),
      {
        onSuccess: (blob) => {
          setRemovedBgImage(URL.createObjectURL(blob!));
          notifications.show({
            title: "Success",
            message: "Background removed",
            color: "green",
          });
        },
      }
    );
  });

  return (
    <AppProvider>
      <AppLayout>
        <Center>
          <Stack miw={370} maw="500px">
            <AppTitle />
            <ImageUploader
              isLoading={isHandling}
              onUploadSuccess={handleUploadAsync}
              progressCaption={progressCaption}
              progressPercent={progressPercent}
            />
            <SimpleGrid
              cols={2}
              breakpoints={[{ maxWidth: "sm", cols: 1 }]}
              mt={!!ogImage || !!removedBgImage ? "xl" : 0}
            >
              {ogImage && (
                <Image
                  src={ogImage}
                  imageProps={{
                    height: 100,
                    width: "auto",
                  }}
                  withPlaceholder
                  alt="Original"
                  caption="Original"
                />
              )}
              {removedBgImage && (
                <Image
                  src={removedBgImage}
                  imageProps={{
                    height: 100,
                    width: "auto",
                  }}
                  withPlaceholder
                  alt="With background removed"
                  caption="With background removed"
                />
              )}
            </SimpleGrid>
          </Stack>
        </Center>
      </AppLayout>
    </AppProvider>
  );
};

export default App;
