
import { createContext, useContext, useMemo, useState } from "react";
import apiClient from "../api/client";


const AuthContext = createContext<any>(null)

function decodeToken(token:string) {
    const payloadSegment = token.split(".")[1]
    return JSON.parse(atob(payloadSegment))
}

export function AuthProvider({children}:any) {
    const [token, setToken] = useState(() => localStorage.getItem("agricoreToken"))
    const user = useMemo(() => token ? decodeToken(token) : null, [token])
    const login = async (username:string, password:string) => {
        const formData = { username, password }
        const response = await apiClient.post("/auth/token", formData, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
        localStorage.setItem("agricoreToken", response.data.access_token)
        setToken(response.data.access_token)
    }
    const logout = () => {
        localStorage.removeItem("agricoreToken")
        setToken(null)
    }
    const value = { token, user, isAuthenticated: Boolean(token), login, logout }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === null) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}
