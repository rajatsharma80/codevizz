// LOGIN PAGE — commented out while login is disabled.
// To re-enable: uncomment everything below and remove the redirect above.

import { redirect } from "next/navigation";

export default async function SignInPage() {
  // Skip login — send everyone straight to the app
  redirect("/main/dashboard");

  /* ORIGINAL SIGN-IN PAGE — uncomment to restore login screen
  import { GoogleSignInButton, GithubSignInButton } from "../components/AuthButton";
  import { getServerSession } from "next-auth";
  import { authConfig } from "../lib/auth";

  const session = await getServerSession(authConfig);
  if (session) {
    redirect("/main/dashboard");
  }

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-10">
        <h1 className="mt-6 mb-4 text-4xl font-bold text-gray-800">Sign In</h1>
        <GoogleSignInButton />
        <GithubSignInButton />
      </div>
    </div>
  );
  */
}
