'use client'
import Button from "@/app/components/atoms/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/auth/getUser";

export default function LoginForm() {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token retrieved from localStorage on mount:', token);

    if (token !== 'undefined' && token !== null) {
      getUser(token).then(user => {
        if (user) {
          router.push('/chats');
        }
      });
    }
  }, [router]);

  /**
   * @function saveToken - Función para guardar el token en el almacenamiento local.
   * @param token - El token a guardar.
   */
  const saveToken = (token: string) => {
    localStorage.setItem('token', token);
  }

  /**
   * @function handleLogin - Función para manejar el inicio de sesión del usuario.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (data.error) {
        setError(data.msg);
        return;
      }

      saveToken(data.token);
      router.push('/chats');
    } catch (e) {
      console.log(e);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className='flex w-[40%] border-[1px] drop-shadow-[0_1.5px_10px_rgba(255,255,255,0.1)] shadow-[0_5px_40px_-15px_rgba(255,255,255,0.3)] flex-col items-center justify-around gap-4 rounded-xl px-10 py-16'>
      <h3 className='text-2xl font-light text-white'>Summarizer</h3>
      <label htmlFor="email" className='flex flex-col w-[70%]'>Email
        <input type='email' name='email' required className='rounded px-2 py-1 text-black' value={email}
               onChange={e => setEmail(e.target.value)} />
      </label>
      <label htmlFor="password" className='flex flex-col w-[70%]'>Password
        <input type='password' required name='password' className='rounded px-2 py-1 text-black' value={password}
               onChange={e => setPassword(e.target.value)} />
      </label>
      <Button type='submit' loading={loading}>Login</Button>
      {error && <p className='text-red-600'>{error}</p>}
    </form>
  )
}
