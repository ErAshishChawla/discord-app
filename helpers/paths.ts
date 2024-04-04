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
};