"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure it's only rendered on the client
  }, []);

  if (!isClient) {
    return null; // Optionally, return a loading state or nothing on SSR
  }

  return <SessionProvider>{children}</SessionProvider>;
};
