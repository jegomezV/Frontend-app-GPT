import Link from 'next/link';
import {ParticlesIcon, TrophyIcon} from "@/app/components/Icons";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <main className="flex flex-1 flex-col items-center justify-center p-10">
        <h1 className="mb-8 text-4xl font-bold">Article Summarizer</h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Login Card */}
          <div className="flex flex-col items-center justify-center gap-8 rounded-lg bg-white p-6">
            <TrophyIcon className='h-12 w-12 text-black'/>
            <h2 className="text-xl font-semibold text-black">Login</h2>
            <p className="text-center text-gray-700 text-pretty">Already have an account? Log in to access your
              articles.</p>
            <Link href="/auth/login" className="rounded-lg bg-black px-6 py-3 text-white">Login
            </Link>
          </div>
          {/* Signup Card */}
          <div className="flex flex-col items-center justify-center gap-8 rounded-lg bg-white p-6">
            <ParticlesIcon className='h-12 w-12 text-black'/>
            <h2 className="mb-2 text-xl font-semibold text-black">Sign Up</h2>
            <p className="text-center text-gray-700 text-pretty">Dont have an account yet? Sign up to get started.</p>
            <Link href="/auth/signup" className="mt-4 rounded-lg bg-black px-6 py-3 text-white">Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
