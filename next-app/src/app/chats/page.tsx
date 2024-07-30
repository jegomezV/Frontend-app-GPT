'use client'

import { SendIcon } from "@/app/components/Icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/loaders/Loading";

export default function Chat() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('Stored token:', storedToken);
    if (storedToken) {
      setToken(storedToken);
    } else {
      setError('No token found. Please log in.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Form submitted');
    console.log('Current token:', token);

    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending request to backend');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/articles`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: message })
      });

      const data = await res.json();
      console.log('Response from backend:', data);

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      if (data) {
        console.log('Navigating to chat:', data._id);
        router.push(`/chats/${data._id}`);
      }
    } catch (e) {
      console.error('Error occurred:', e);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex w-full flex-col justify-end bg-neutral-800 px-25'>
      <h2 className='p-4 text-center text-xl sm:p-0 sm:text-2xl'>
        Put the link of the article to start the conversation
      </h2>
      {error && <p className='text-center font-extralight text-red-600'>{error}</p>}
      {loading && <Loading />}
      <form
        onSubmit={handleSubmit}
        className='relative mx-auto my-10 w-full max-w-3xl p-25 px-5'>
        <input
          disabled={loading}
          type='url'
          pattern="https?://.*"
          placeholder='Start writing the article link...'
          className='w-full rounded-lg border border-neutral-600 bg-transparent px-10 py-5 placeholder:text-neutral-500'
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button
          disabled={loading}
          className='absolute right-4 h-full px-2 text-black'>
          <SendIcon className='h-6 w-6 text-neutral-500 transition-colors hover:text-neutral-200' />
        </button>
      </form>
    </div>
  );
}