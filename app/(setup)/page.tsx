import React from "react";
import { notFound, redirect } from "next/navigation";

import InitialModal from "@/components/modals/initial-modal";

import { initialProfile, initialServer } from "@/lib/db";
import { paths } from "@/helpers/paths";

async function SetupPage() {
  const profile = await initialProfile();

  if (!profile) {
    notFound();
  }

  //if the user has profile we will find if user is a member of a server
  const server = await initialServer(profile);

  if (server) {
    return redirect(paths.specificServer(server.id));
  }

  return (
    <main className="flex-1 flex flex-col">
      <InitialModal />
    </main>
  );
}

export default SetupPage;
