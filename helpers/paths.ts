export const paths = {
  home() {
    return "/";
  },
  signIn() {
    return process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in";
  },
  signUp() {
    return process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up";
  },
  specificServer(serverId: string) {
    return `/servers/${serverId}`;
  },
  publicUrls() {
    return ["/api/uploadthing"];
  },
};

export const apiPaths = {
  createServer() {
    return "/api/servers";
  },

  newInviteCode(serverId: string) {
    return `/api/servers/${serverId}/invite-code`;
  },

  editServer(serverId: string) {
    return `/api/servers/${serverId}`;
  },
};
