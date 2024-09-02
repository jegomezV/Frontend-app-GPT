import React from "react";
import Link from "next/link";
import SignUpForm from "@/app/components/forms/SignUpForm";

export default function signup() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-5 bg-black px-12 py-20 sm:p-24">
      <div className="relative w-[40%]">
        <SignUpForm/>
        <Link href='/auth/login' className='w-full text-center font-semibold p-10 -translate-y-5 absolute text-white/60 hover:text-white hover:duration-300'>You already have a account?</Link>
      </div>
    </main>
  );
}
