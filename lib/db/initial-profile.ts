import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    // it means the user is not logged in
    return redirectToSignIn();
  }

  // check if user has a profile
  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  // if the user has a profile, return it
  if (profile) {
    return profile;
  }

  // if the user has no profile, create one
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
    },
  });

  return newProfile;
};
