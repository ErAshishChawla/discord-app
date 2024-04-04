import { ModeToggle } from "@/components/mode-toggle";
import { paths } from "@/helpers/paths";

import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <UserButton afterSignOutUrl={paths.signIn()} />
      <ModeToggle />
    </div>
  );
}
