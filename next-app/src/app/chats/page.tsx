'use client'

import { SendIcon } from "@/app/components/Icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/loaders/Loading";
import { cp } from "fs";

export default function Chat() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setError('No token found. Please log in.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/summary`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: message })
      });

      const data = await res.json();
      console.log(`ESTA ES LA URL${data.url}`);

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      if (data) {
        router.push(`/chats/${data.id}`);
      }
    } catch (e) {
      console.error('Error occurred:', e);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex w-full flex-col justify-end bg-stone-700 px-25'>
      <h2 className='p-4 text-center text-xl sm:p-0 sm:text-2xl text-white/80'>
        Hey! Paste a URL of the article you want to summarize,<br/> so you can ask questions about it in the chat afterward.
      </h2>
      {error && <p className='text-center font-extralight text-red-600'>{error}</p>}
      {loading && <Loading />}
      <form
        onSubmit={handleSubmit}
        className='relative mx-auto my-10 w-full max-w-3xl p-25 px-5 text-black'>
        <input
          disabled={loading}
          type='url'
          pattern="https?://.*"
          placeholder='Paste the URL here'
          className='w-full rounded-lg border border-black/70 bg-transparent px-10 py-5 placeholder:text-neutral-500'
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button
          disabled={loading}
          className='absolute right-4 h-full px-2 text-white'>
          <SendIcon className='h-6 w-6 transition-colors hover:text-neutral-200' />
        </button>
      </form>
    </div>
  );
}