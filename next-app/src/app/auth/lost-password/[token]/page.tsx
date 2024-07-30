'use client'
import Button from "@/app/components/atoms/Button";
import {useEffect, useState} from "react";
import Link from "next/link";

export default function Page({params}: { params: { token: string } }) {
  const [password, setPassword] = useState<{ pwd?: string, pwd2?: string }>()
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<{ msg: string, error: boolean }>()
  const [isValidToken, setIsValidToken] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || (password?.pwd !== password?.pwd2)) return setAlert({
      error: true,
      msg: "The passwords must be the same"
    })

    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/lost-password/${params.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({password: password.pwd})
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

  const checkToken = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/lost-password/${params.token}`)
      const data = await response.json()

      if (!data.error) return setIsValidToken(true)

      setIsValidToken(false)
    } catch (e) {
      console.log(e)
      setAlert({error: true, msg: "Something went wrong"})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkToken()
  }, []);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-5 bg-black px-12 py-20 sm:p-24">
      {
        loading ? <p>Loading...</p>
          : isValidToken
            ? (
              (!alert || alert.error) ? (
                <form
                  onSubmit={handleSubmit}
                  className='flex w-full flex-col items-center justify-around gap-4 rounded-xl px-10 py-16'>
                  <h3 className='text-2xl font-light text-white'>Summarizer</h3>
                  <p>Recover your password</p>
                  <label htmlFor="password" className='flex flex-col'>Password
                    <input type='password' required name='password' className='rounded px-2 py-1 text-black'
                           value={password?.pwd}
                           onChange={e => setPassword(prevPassword => ({
                             ...prevPassword,
                             pwd: e.target.value
                           }))}
                    />
                  </label>
                  <label htmlFor="password" className='flex flex-col'>Repeat password
                    <input type='password' required name='password' className='rounded px-2 py-1 text-black'
                           value={password?.pwd2}
                           onChange={e => setPassword(prevPassword => ({
                             ...prevPassword,
                             pwd2: e.target.value
                           }))}
                    />
                  </label>
                  <Button type='submit' loading={loading}>Recover</Button>
                </form>
              ) : (
                <>
                  {alert && <p className={`${alert.error ? "text-red-600" : "text-green-600"}`}>{alert.msg}</p>}
                  {!alert.error && <Link href='/auth/login' className='w-full text-center font-light'>Login</Link>}
                </>
              )
            )
            :
            (
              <p>Invalid token</p>
            )
      }
    </main>
  );
}
