'use client';

import { useEffect, useRef, useState } from "react";
import { SendIcon } from "@/app/components/Icons";
import RenderMDX from "@/app/components/mdx/RenderMDX";
import { serialize } from 'next-mdx-remote/serialize'
import Loading from "@/app/components/loaders/Loading";
import { useRouter } from "next/navigation";
import { ChatTypes } from "@/app/types/chat.types";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export default function Page({ params }: { params: { id: string } }) {

  const [chat, setChat] = useState<Partial<ChatTypes>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const router = useRouter();

  if (!token) {
    router.push('/');
  }

  const fetchChat = async () => {
    if (!params.id) {
      setError('Chat ID is missing');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.error) {
        console.error('Error in response:', data.error);
        setError(data.error);
        setLoading(false);
        return;
      }

      const chat = data.chat as ChatTypes;

      const messages = (chat.messages || []).map(async (message) => {
        if (message.role === "assistant") {
          return {
            ...message, content: await serialize(message.content, {
              mdxOptions: {
                development: !!process.env.NEXT_PUBLIC_DEVELOPMENT,
              }
            })
          }
        }
        return message
      });

      data.chat.messages = await Promise.all(messages);

      setChat(data.chat);
    } catch (e) {
      console.error('Error fetching chat:', e);
      setError('Failed to fetch chat');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      console.log('Scrolled to bottom');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const copyChat: Partial<ChatTypes> = {
      ...chat,
      messages: [...(chat.messages || []), { content: message, role: "user" }]
    };
    setChat(copyChat);
    setMessage('');
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/${params.id}`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
      const data = await response.json();

      if (data.error) {
        console.error('Error in response:', data.error);
        throw new Error(data.error);
      }

      console.log('Updating chat with new message from assistant');
      const serializedContent = await serialize(data.chat.content, {
        mdxOptions: {
          development: !!process.env.NEXT_PUBLIC_DEVELOPMENT,
        }
      });
      console.log('Serialized content for assistant:', serializedContent);

      setChat({
        ...chat, messages: [...(chat.messages || []), {
          content: serializedContent,
          role: "assistant"
        }]

      });

      fetchChat()

    } catch (e) {
      console.error('Error submitting message:', e);
      setChat({
        ...chat, messages: [...(chat.messages || []), {
          content: await serialize("An error occurred", {
            mdxOptions: {
              development: true,
            }
          }),
          role: "assistant"
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='relative flex h-full max-h-screen text-white flex-col items-center justify-end gap-10 bg-stone-700 p-10 sm:px-10 md:px-20 lg:px-40'>
        {loading && <Loading />}
        <div ref={messageContainerRef} className="flex w-full flex-col items-center overflow-y-auto space-y-4 small-scroll text-purple-500">
          {chat?.messages?.map((message, index: number) => (
            <div key={index} className='w-full text-white'>
              <p className='font-semibold text-white/70'>{message.role === "assistant" ? "Q-bot" : "You"}</p>
              <div className={`w-full rounded px-10 font-light text-white text-wrap break-words`}>
                {message.role === "assistant"
                  ? <RenderMDX mdxSource={message.content as MDXRemoteSerializeResult} />
                  : typeof message.content === 'string' && message.content
                }
              </div>
            </div>
          ))}
        </div>
        {error && <div className='text-red-500'>{error}</div>}
        <form onSubmit={handleSubmit} className='relative bottom-0 mx-auto w-full max-w-3xl px-4 sm:px-25'>
          <input
            type='text'
            disabled={loading}
            placeholder={`${loading ? "Writing response" : "Do you have any questions?"}`}
            className='w-full rounded-lg border border-black bg-transparent py-5 pr-10 pl-2 placeholder:text-neutral-500 sm:px-10'
            value={message}
            onChange={e => setMessage(e.target.value)}
            spellCheck="false"
          />
          <button
            disabled={loading}
            className={`${loading && "animate-pulse"} absolute right-4 text-white h-full px-2`}
          >
            <SendIcon className='h-6 w-6 text-white transition-colors hover:text-neutral-200' />
          </button>
        </form>

      </div>
    </div>
  );
}
