'use client'
import Button from "@/app/components/atoms/Button";
import {useState} from "react";

export default function LostPwd() {

  const [email, setEmail] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ error: boolean, msg: string }>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/lost-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
      })
      const data = await response.json()

      if (data) return setAlert({error: data.error, msg: data.msg})

    } catch (e) {
      console.log(e)
      setAlert({error: true, msg: "Something went wrong"})
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-5 bg-black px-12 py-20 sm:p-24">
      <form
        onSubmit={handleSubmit}
        className='flex w-full flex-col items-center justify-around gap-4 rounded-xl px-10 py-16'>
        <h3 className='text-2xl font-light text-white'>Summarizer</h3>
        <p>Recover your password</p>
        <label htmlFor="email" className='flex flex-col'>Email
          <input type='email' name='email' required className='rounded px-2 py-1 text-black' value={email}
                 onChange={e => setEmail(e.target.value)}/>
        </label>
        <Button type='submit' loading={loading}>Recover</Button>
        {alert && <p className={`${alert.error ? "text-red-600" : "text-green-600"}`}>{alert.msg}</p>}
      </form>
    </main>
  )
}
