/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import AuthInput from "../components/auth/AuthInput";
import { WarnIcon } from "../components/icons";
import useAuth from "../data/hook/useAuth";

export default function Authentication() {

  const { register, login, loginGoogle } = useAuth()

  const [erro, setErro] = useState(null)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function displayError(msg, timeInSeconds = 5) {
    setErro(msg)
    setTimeout(() => setErro(null), timeInSeconds * 1000)
}

  async function submit() {
    try {
      if(mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password)
      }
    } catch(e) {
      displayError(e?.msg ?? 'Unknown error!')
    }
  }
  
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="hidden md:block md:w-1/2 lg:w-2/3">
        <img 
          src="https://source.unsplash.com/random" 
          alt="Image authentication screen"
          className="h-screen w-full object-cover"
        />
      </div>
      <div className="m-10 w-full md:w-1/2 lg:w-1/3">
        <h1 className={`
          text-xl font-bold mb-5
        `}>
          {mode === 'login' ? 'Sign in with your account' : 'Register on the platform'}
        </h1>

        {erro ? (
          <div className={`
            flex items-center
            bg-red-400 text-white py-3 px-5 my-2
            border border-red-700 rounded-lg
          `}>
            {WarnIcon()}
            <span className="ml-3">{erro}</span>
          </div>
        ) : false}


        <AuthInput 
          label="Email"
          type="email"
          value={email}
          valueChange={setEmail}
          mandatory
        />
        <AuthInput 
          label="Password"
          type="password"
          value={password}
          valueChange={setPassword}
          mandatory
        />
        <button onClick={submit} className={`
          w-full bg-indigo-500 hover:bg-indigo-400
          text-white rounded-lg px-4 py-3 mt-6
        `}>
          {mode === 'login' ? 'Sign' : 'Register'}
        </button>

        <hr className="my-6 border-gray-300 w-full" />

        <button onClick={loginGoogle} className={`
          w-full bg-red-500 hover:bg-red-400
          text-white rounded-lg px-4 py-3 mt-6
        `}>
          Sign in with Google
        </button>

        {mode === 'login' ? (
          <p className="mt-8">
            New around here?
            <a onClick={() => setMode('register')} className={`
              text-blue-500 hover:text-blue-700 font-semibold
              cursor-pointer
            `}> Create an account for free</a>
          </p>
        ):(
          <p className="mt-8">
            Be part for our community?
            <a onClick={() => setMode('login')} className={`
              text-blue-500 hover:text-blue-700 font-semibold
              cursor-pointer
            `}> Login with your credentials</a>
          </p>
        )}
      </div>
    </div>
  )
}