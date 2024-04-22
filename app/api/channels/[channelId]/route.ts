import { NextRequest, NextResponse } from "next/server";

import { MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface DeleteMethodProps {
  params: {
    channelId: string;
  };
}

export const DELETE = async (
  request: NextRequest,
  { params }: DeleteMethodProps
) => {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const channelId = params.channelId;

    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId");

    if (!serverId || !channelId) {
      return new NextResponse("Bad request", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

interface PatchMethodProps {
  params: {
    channelId: string;
  };
}

export const PATCH = async (
  request: NextRequest,
  { params }: PatchMethodProps
) => {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const channelId = params.channelId;

    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId");

    if (!serverId || !channelId) {
      return new NextResponse("Bad request", { status: 400 });
    }

    const { name, type } = await request.json();

    if (!name || !type) {
      return new NextResponse("Bad request", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Channel name cannot be 'general'", {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
