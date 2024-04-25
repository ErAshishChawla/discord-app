"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";

import { useSocket } from "@/providers/socket-provider";

function SocketIndicator() {
  const { isConnected } = useSocket();

  let content: React.ReactNode = null;

  if (!isConnected) {
    content = (
      <Badge variant="outline" className="bg-yellow-600 text-white border-none">
        Fallback: Polling every 1s
      </Badge>
    );
  } else {
    content = (
      <Badge
        variant="outline"
        className="bg-emerald-600 text-white border-none"
      >
        Live: Real-time updates
      </Badge>
    );
  }

  return content;
}

export default SocketIndicator;
