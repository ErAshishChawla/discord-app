import { spec } from "node:test/reporters";

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
  specificChannel(serverId: string, channelId: string) {
    return `/servers/${serverId}/channels/${channelId}`;
  },
  specificConversation(serverId: string, memberId: string) {
    return `/servers/${serverId}/conversations/${memberId}`;
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
