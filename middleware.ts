import { authMiddleware } from "@clerk/nextjs";

import { paths } from "@/helpers/paths";

export default authMiddleware({
  publicRoutes: paths.publicUrls(),
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
