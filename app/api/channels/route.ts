import { NextResponse, NextRequest } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";

export const POST = async (request: NextRequest) => {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, type } = (await request.json()) as {
      name: string;
      type: string;
    };

    if (!name || !type) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Channel name cannot be 'general'", {
        status: 400,
      });
    }

    const channelType = type.toUpperCase() as ChannelType;

    if (!Object.values(ChannelType).includes(channelType)) {
      return new NextResponse("Invalid channel type", { status: 400 });
    }

    const { searchParams } = new URL(request.url);

    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.MODERATOR, MemberRole.ADMIN],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name: name,
            type: channelType,
          },
        },
      },
    });

    return NextResponse.json(server, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
