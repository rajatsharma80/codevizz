import { GoogleSignInButton, GithubSignInButton } from "../components/AuthButton";
import { CredentialsForm } from "../components/credentialsForm";
import { getServerSession } from "next-auth";
import { authConfig } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getServerSession(authConfig);

  // Redirect authenticated users to /main/dashboard
  if (session) {
    redirect("/main/dashboard");
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-10">
        <h1 className="mt-6 mb-4 text-4xl font-bold text-gray-800">Sign In</h1>
        <GoogleSignInButton />
        <GithubSignInButton />       
        <span className="text-2xl font-semibold text-black text-center mt-8">
          Or
        </span>
        {/* <CredentialsSignInButton /> */}
        <CredentialsForm />
      </div>
    </div>
  );
}
