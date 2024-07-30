import React from "react";
import Link from "next/link";
import SignUpForm from "@/app/components/forms/SignUpForm";

export default function signup() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-5 bg-black px-12 py-20 sm:p-24">
      <SignUpForm/>
      <Link href='/auth/login' className='w-full text-center font-light'>You already have a account?</Link>
    </main>
  );
}
