'use client';
import {useFormStatus} from "react-dom";

export default function Button({children, onClick, loading = false, type = "submit"}: {
  children: React.ReactNode,
  onClick?: () => void,
  loading?: boolean,
  type?: "submit" | "button"
}) {

  const {pending} = useFormStatus();

  const isLoading = pending || loading;

  return (
    <button
      type={type}
      disabled={isLoading}
      onClick={onClick}
      className={` ${isLoading && 'animate-pulse'} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors`}>
      {isLoading ? "Loading..." : children}
    </button>
  )
}
