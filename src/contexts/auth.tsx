import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void
}

type AuthProvider = {
    children: ReactNode
}

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    } 
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider(props: AuthProvider){
    const [user, setUser] = useState<User | null>(null)


    const signInUrl = `http://github.com/login/oauth/authorize?scope=user&client_id=e5648804db3ebe3b652c`

    async function signIn(code: string){
        const response = await api.post<AuthResponse>('authenticate', {
            code: code,
        })

        const { token, user } = response.data

        localStorage.setItem('@dowhile:token', token)
        
        api.defaults.headers.common.authorization = `Bearer ${token}`

        setUser(user)

    }

    function signOut(){
        setUser(null)
        localStorage.removeItem("@dowhile:token")
    }

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token')

        if(token){
            api.defaults.headers.common.authorization = `Bearer ${token}`

            api.get<User>('profile').then(res => {
                setUser(res.data)
            })
        }

    }, [])


    useEffect(() => {
        const url = window.location.href
        const hasGitHubCode = url.includes("?code=")

        if(hasGitHubCode){
            const [urlWithoutCode, codeGitHub] = url.split('?code=')
            window.history.pushState({}, '', urlWithoutCode)
            
            signIn(codeGitHub)
        }
    } ,[])

    
    return(
        <AuthContext.Provider value={{
            signInUrl, user, signOut
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

