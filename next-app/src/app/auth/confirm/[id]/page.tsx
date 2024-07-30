import Link from "next/link";

export default async function Confirm({params}: { params: { id: string } }) {
  console.log("Params:", params);

  const confirmed = await fetch(`http://localhost:3001/users/confirm/${params.id}`, {
    method: 'GET'
  });
  console.log("Fetch response:", confirmed);

  const data = await confirmed.json();
  console.log("Response data: DATA", data);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-5 bg-black px-12 py-20 sm:p-24">
      {confirmed && <p className={`${data?.error ? "text-red-600" : "text-green-600 text-4xl font-semibold"}`}>{data.msg}</p>}
      <Link href='/auth/login' className='rounded border px-2 py-1 font-light'>Login</Link>
    </main>
  );
}