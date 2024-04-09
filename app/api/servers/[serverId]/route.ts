import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";

import { EditServerFormSchemaType } from "@/components/modals/edit-server-modal";
import { db } from "@/lib/db";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { serverId: string } }
) => {
  try {
    const { serverId } = params;

    if (!serverId) {
      return new NextResponse("Bad request", { status: 400 });
    }

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, imageUrl } = (await req.json()) as EditServerFormSchemaType;

    if (!name || !imageUrl) {
      return new NextResponse("Bad request", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { serverId: string } }
) => {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const serverId = params?.serverId;

    if (!serverId) {
      return new NextResponse("Bad request", { status: 400 });
    }

    const server = await db.server.deleteMany({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
