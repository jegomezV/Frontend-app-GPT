'use client'
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {ArchiveIcon, DeleteIcon, LogoutIcon, MenuCloseIcon, MenuIcon} from "@/app/components/Icons";
import {useParams} from "next/navigation"
import {useRouter} from "next/navigation";
import {ChatTypes} from "../../types/chat.dto";

export default function SideBar() {
  const [chats, setChats] = useState<ChatTypes[]>([])
  const [tab, setTab] = useState(0);
  const [toggle, setToggle] = useState(false)
  const [user, setUser] = useState<UserTypes>()

  const router = useRouter()

  const params = useParams();

  const {id: active} = params;

  const getChats = async () => {
    console.log('getChats called');
  
    const token = localStorage.getItem('token');
    console.log('Token:', token);
  
    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/');
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }
  
      const data = await response.json();
      console.log('Fetched data: GET CHATS', data);
  
      // Verifica la estructura de la respuesta
      if (data && data.chats) {
        setChats(data.chats);
        console.log('Chats set:', data.chats);
      } else {
        console.log('No chats found in the response');
      }
    } catch (e) {
      console.log('Error fetching chats:', e);
    }
  }

  const logout = () => {
    console.log('Logout called');
    if (typeof localStorage !== 'undefined') localStorage.removeItem('token')
    router.push('/')
  }

  const handleArchive = async (id: string) => {
    console.log('handleArchive called with id:', id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/${id}/archive`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Archive response data:', data);
  
      if (data.error) {
        console.log('Archive error:', data.error);
        return;
      }
  
      setChats(chats.map((chat) => chat.id === id ? {...chat, hasArchive: !chat.hasArchive} : chat));
      console.log('Chats after archive:', chats);
    } catch (e) {
      console.log('Error archiving chat:', e);
    }
  };
  

  const handleDelete = async (id: string) => {
    console.log('handleDelete called with id:', id);
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      const data = await response.json()
      console.log('Delete response data:', data);

      if (data.error) {
        console.log('Delete error:', data.error)
        return
      }
      setChats(chats.filter((chat) => chat.id !== id))
      console.log('Chats after delete:', chats);
    } catch (e) {
      console.log('Error deleting chat:', e)
    }
  }

  const getUser = async () => {
    console.log('getUser called');
    const token = localStorage.getItem('token')
    console.log('Token:', token);

    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('Response status:', response.status);

      if (response.status === 401) {
        console.log('Unauthorized, redirecting to login');
        router.push('/');
        return;
      }

      const data = await response.json();
      console.log('Fetched user data:', data);
      setUser(data.user);
      console.log('User set:', data.user);
    } catch (e) {
      console.log('Error fetching user:', e);
    }
  };

  useEffect(() => {
    console.log('useEffect called');
    getUser()
    getChats()
  }, []);

  return (
    <div
      className='flex-shrink-0 inline-block overflow-x-hidden bg-[#171717] sm:max-h-screen transition-all duration-300'>
      <button
        onClick={() => setToggle(!toggle)}
        className='absolute top-1 left-1 z-50 sm:hidden'>{!toggle ?
        <MenuIcon className='h-8 w-8'/> : <MenuCloseIcon className='h-8 w-8'/>}</button>
      <div
        className={`${toggle ? "block fixed sm:flex z-10" : "hidden sm:block"} h-full w-full overflow-hidden bg-neutral-900 sm:w-[260px]`}>
        <div className='flex h-full min-h-0 flex-col'>
          <div className='flex h-full min-h-0 flex-col justify-between'>
            <div className='relative flex h-full w-full flex-col justify-between gap-10 px-5 py-10'>

              <Link href={'/chats'}
                    className={`group py-2 px-4 relative text-sm flex items-center text-white hover:bg-[#1E1E1E] hover:text-white rounded-lg transition-colors duration-200 ease-in-out`}>
                <p>New Chat</p> <span
                className='absolute right-4 rounded-full bg-neutral-300 px-2 text-xs text-black'>+</span>
              </Link>
              <nav className='flex h-full w-full flex-col pb-3.5'>

                <div className='mb-4 flex flex-row items-center justify-between'>
                  <h3
                    className='px-4 text-neutral-400'>{tab === 0 ? "Chat history" : "Chat archived"}</h3>
                  <button onClick={() => setTab(prev => prev === 0 ? 1 : 0)}>
                    <ArchiveIcon
                      className='mx-4 h-5 w-5 cursor-pointer text-neutral-400 transition-colors hover:text-neutral-200'
                    />
                  </button>
                </div>
                <ul className='h-full overflow-y-auto small-scroll'>
                  {chats?.length > 0 ? (
                    <>
                      {
                        chats.map((chat, index: number) => (
                          ((tab === 0 && !chat.hasArchive) || (tab === 1 && chat.hasArchive)) && (
                            <Link
                              className={`${active === chat.id && "bg-[#1E1E1E]"} group py-2 px-4 my-1 relative flex items-center text-white hover:bg-[#1E1E1E] hover:text-white rounded-lg transition-colors duration-200 ease-in-out overflow-hidden`}
                              href={`/chats/${chat.id}`}
                              key={index}
                            ><p className='truncate'>{chat.title}</p>
                              <div
                                className='bg-gradient-to-l from-70% from-[#1E1E1E] absolute hidden group-hover:flex h-full  items-center right-0 gap-1.5 pr-2 pl-8'>
                                <button
                                  onClick={() => handleArchive(chat.id)}
                                >
                                  <ArchiveIcon className='h-4 w-4 transition-opacity hover:opacity-80'/>
                                </button>
                                <button
                                  onClick={() => handleDelete(chat.id)}
                                >
                                  <DeleteIcon className='h-4 w-4 text-red-600 hover:opacity-80'/>
                                </button>
                              </div>
                            </Link>
                          )
                        ))
                      }
                    </>
                  ) : (
                    <p className='text-center text-neutral-400'>No chats yet</p>
                  )}
                </ul>

              </nav>
            </div>
          </div>
          <div className='mb-4 px-4'>
            <p className='px-4'>{user?.name}</p>
            <button
              type='button'
              onClick={logout}
              className={`py-2 w-full px-4 relative flex items-center justify-between text-white hover:bg-[#1E1E1E] hover:text-red-500 font-extralight rounded-lg transition-colors duration-200 ease-in-out`}>
              Logout
              <LogoutIcon className='ml-2 h-6 w-6'/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}