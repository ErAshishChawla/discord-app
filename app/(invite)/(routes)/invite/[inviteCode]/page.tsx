import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { MemberRole } from "@prisma/client";
import { paths } from "@/helpers/paths";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

async function InviteCodePage({ params }: InviteCodePageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const { inviteCode } = params;

  if (!inviteCode) {
    return redirect(paths.home());
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(paths.specificServer(existingServer.id));
  }

  const server = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: {
          profileId: profile.id,
          role: MemberRole.GUEST,
        },
      },
    },
  });

  if (server) {
    return redirect(paths.specificServer(server.id));
  }

  return null;
}

export default InviteCodePage;
