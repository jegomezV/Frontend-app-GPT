import LoginForm from "@/app/components/forms/LoginForm";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-12 py-20 sm:p-24">
      <LoginForm/>
      <div className='flex flex-col'>
        <Link href='/auth/signup' className='w-full text-center translate-y-5 font-light hover:underline text-white/60 hover:text-white hover:duration-300'>You dont have a
          account?</Link>
        <Link href='/auth/lost-password' className='w-full text-center translate-y-5 font-light hover:underline text-white/60 hover:text-white hover:duration-300'>Forgot
          password?</Link>
      </div>
    </main>
  );
}
