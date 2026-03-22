"use client";

// AUTH GUARD — commented out while login is disabled.
// To re-enable: uncomment the function body below.

/* ORIGINAL IMPORTS — restore when re-enabling auth
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
*/

/**
 * Redirects users to the home page if they are not authenticated.
 * Currently a no-op — login is disabled.
 */
export function loginIsRequiredClient() {
  // AUTH GUARD DISABLED — uncomment below to re-enable
  /*
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);
  */
}
