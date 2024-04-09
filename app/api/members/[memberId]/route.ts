import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { memberId: string } }
) => {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { memberId } = params;
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!serverId || !memberId) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const { role } = await req.json();

    if (!role) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    console.log(serverId, memberId, role);

    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        members: {
          update: {
            where: { id: memberId, profileId: { not: profile.id } },
            data: { role },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { memberId: string } }
) => {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { memberId } = params;
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!serverId || !memberId) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: { not: profile.id },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
