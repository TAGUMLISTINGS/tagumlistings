// components
import LoginForm from "@/app/(auth)/login/_components/login-form"
import BounceWrapper from "@/components/shared/bounce"

// utils
import Image from "next/image"
import Link from "next/link"

// types
import type { Metadata } from "next"

// meta data
export const metadata: Metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <BounceWrapper>
        <div className="flex h-full max-h-[27rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
          <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
            <h1 className="text-center text-3xl font-bold">Welcome back</h1>
            <div className="space-y-5">
              {/* <GoogleSignInButton /> */}

              {/* login form */}
              <LoginForm />

              <Link
                href="/register"
                className="block text-center hover:underline"
                prefetch={false}
              >
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </div>

          {/* bg */}
          <Image
            src="/images/login.jpg"
            alt=""
            className="hidden w-1/2 object-cover md:block"
            width={1920}
            height={1080}
            priority
          />
        </div>
      </BounceWrapper>
    </main>
  )
}