import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

import { InitialServeFormSchemaType } from "@/components/modals/initial-modal";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export const POST = async (req: NextRequest) => {
  try {
    const { name, imageUrl } = (await req.json()) as InitialServeFormSchemaType;

    if (!name || !imageUrl) {
      return new NextResponse("Bad request", { status: 400 });
    }

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: nanoid(),
        channels: {
          create: [{ name: "general", profileId: profile.id, type: "TEXT" }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(server, { status: 201 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
