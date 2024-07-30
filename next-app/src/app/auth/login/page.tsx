import LoginForm from "@/app/components/forms/LoginForm";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-12 py-20 sm:p-24">
      <LoginForm/>
      <div className='flex flex-col'>
        <Link href='/auth/signup' className='w-full text-center font-light hover:underline'>You dont have a
          account?</Link>
        <Link href='/auth/lost-password' className='w-full text-center font-light hover:underline'>Forgot
          password?</Link>
      </div>
    </main>
  );
}
