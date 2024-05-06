"use client";

import { useEffect, useState } from "react";
import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useUser } from "@clerk/nextjs";

import { Loader2 } from "lucide-react";

import { Channel } from "@prisma/client";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

function MediaRoom({ chatId, video, audio }: MediaRoomProps) {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) {
      return;
    }

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const response = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );

        const data = await response.json();

        setToken(data?.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (!token) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 my-4 animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        video={video}
        audio={audio}
        token={token}
        connect={true}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}

export default MediaRoom;
