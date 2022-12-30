import route from "next/router";
import { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie'
import firebase from "../../firebase/config";
import User from "../../model/User";

interface AuthContextProps {
  user?: User
  loading?: boolean
  register?: (email: string, password: string) => Promise<void>
  login?: (email: string, password: string) => Promise<void>
  loginGoogle: () => Promise<void>
  logout?: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({
  loginGoogle: function (): Promise<void> {
    throw new Error("Function not implemented.");
  }
})

async function usuarioNormalizado(usuarioFirebase: firebase.User): Promise<User> {
  const token = await usuarioFirebase.getIdToken()
  return {
      uid: usuarioFirebase.uid,
      name: usuarioFirebase.displayName,
      email: usuarioFirebase.email,
      token,
      provider: usuarioFirebase.providerData[0].providerId,
      imageUrl: usuarioFirebase.photoURL
  }
}

function manageCookie(logged: boolean) {
  if(logged) {
    Cookies.set('admin-template-341a4-auth', logged, {
      expires: 7
    })
  } else {
    Cookies.remove('admin-template-341a4-auth')
  }
}

export function AuthProvider(props) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User>(null)

  async function configureSession(usuarioFirebase) {
    if(usuarioFirebase?.email) {
      const user = await usuarioNormalizado(usuarioFirebase)
      setUser(user)
      manageCookie(true)
      setLoading(false)
      return user.email
    } else {
      setUser(null)
      manageCookie(false)
      setLoading(false)
      return false
    }
  }

  async function login(email, password) {
    try {
      setLoading(true)
      const resp = await firebase.auth()
        .signInWithEmailAndPassword(email, password)

        await configureSession(resp.user)
        route.push('/')
    } finally {
      setLoading(false)
    }
  }

  async function register(email, password) {
    try {
      setLoading(true)
      const resp = await firebase.auth()
        .createUserWithEmailAndPassword(email, password)

        await configureSession(resp.user)
        route.push('/')
    } finally {
      setLoading(false)
    }
  }
  
  async function loginGoogle() {
    try {
      setLoading(true)
      const resp = await firebase.auth().signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      )
        await configureSession(resp.user)
        route.push('/')
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      setLoading(true)
      await firebase.auth().signOut()
      await configureSession(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(Cookies.get('admin-template-341a4-auth')) {
      const cancel = firebase.auth().onIdTokenChanged(configureSession)
      return () => cancel()
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      loginGoogle,
      logout
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext