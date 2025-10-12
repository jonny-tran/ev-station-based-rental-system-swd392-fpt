import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-8 p-6 md:p-10">
        <div className="flex justify-center">
          <Link href="/login" className="flex items-center gap-2 font-medium">
            <Image
              src="https://res.cloudinary.com/dmhjgnymn/image/upload/v1760269195/logo_EVRenter_SWD392_c1qh8d.png"
              alt="EVRenter Logo"
              width={120}
              height={120}
              className="size-36 object-contain"
            />
          </Link>
        </div>
        <div className="w-full max-w-xs">
          <LoginForm />
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="https://res.cloudinary.com/dmhjgnymn/image/upload/v1760270374/poster_EvRenter_SWD392_hhfee8.png"
          alt="Image"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
