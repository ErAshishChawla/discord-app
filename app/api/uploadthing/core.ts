import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { auth } from "@clerk/nextjs";

export enum ApiEndpoints {
  serverImage = "serverImage",
  messageFile = "messageFile",
}

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();

  if (!userId) {
    throw new UploadThingError("Unauthorized");
  }

  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  [ApiEndpoints.serverImage]: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File url", file.url);

      return { imageUrl: file.url };
    }),

  [ApiEndpoints.messageFile]: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
