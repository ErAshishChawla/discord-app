import { db } from "@/lib/db";

import { Profile } from "@prisma/client";

export const initialServer = async (profile: Profile) => {
  if (!profile) {
    return;
  }

  // we find the first server where the profile is a member. This is only for initial display
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return;
  }

  return server;
};
