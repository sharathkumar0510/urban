import { Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { ForgotPasswordForm } from "@/modules/auth/components";
import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <div className="text-red-500 border-l-2 px-4">
          {searchParams.message}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <ForgotPasswordForm />
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}
