'use client'
import Button from "@/app/components/atoms/Button";
import {useState} from "react";

export default function SignUpForm() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ error: boolean, msg: string }>()


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password, name})
      })

      const data = await response.json()

      if (data)
        setAlert({error: data.error, msg: data.msg})
    } catch (e) {
      console.log(e)
      setAlert({error: true, msg: "Something went wrong"})
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSignUp}
      className='flex w-full flex-col items-center justify-around gap-4 rounded-xl px-10 py-16 transition-all ease-in-out'>
      <h3 className='text-2xl font-light text-white'>Summarizer</h3>
      {(!alert || alert?.error) && (
        <>
          <label htmlFor="name" className='flex flex-col'>Name
            <input type='text' name='name' required className='rounded px-2 py-1 text-black' value={name}
                   onChange={e => setName(e.target.value)}/>
          </label>
          <label htmlFor="email" className='flex flex-col'>Email
            <input type='email' name='email' required className='rounded px-2 py-1 text-black' value={email}
                   onChange={e => setEmail(e.target.value)}/>
          </label>
          <label htmlFor="password" className='flex flex-col'>Password
            <input type='password' name='password' required className='rounded px-2 py-1 text-black' value={password}
                   onChange={e => setPassword(e.target.value)}/>
          </label>
          <Button type='submit' loading={loading}>Sign up</Button>
        </>
      )}
      {alert &&
          <p className={`${alert?.error ? "text-red-600" : "text-green-600 text-4xl font-semibold"}`}>{alert.msg}</p>}
    </form>
  )
}
