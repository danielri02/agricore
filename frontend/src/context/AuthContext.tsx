
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";
import axios from "axios";


const AuthContext = createContext<any>(null)

const refreshClient = axios.create({
    baseURL: apiClient.defaults.baseURL,
    timeout: 10000
})

let refreshPromise: Promise<string> | null = null

function decodeToken(token: string) {
    const payloadSegment = token.split(".")[1]
    return JSON.parse(atob(payloadSegment))
}

export function AuthProvider({ children }: any) {
    const [token, setToken] = useState(() => localStorage.getItem("agricoreToken"))
    const user = useMemo(() => token ? decodeToken(token) : null, [token])

    const login = async (username: string, password: string) => {
        const formData = { username, password }
        const response = await apiClient.post("/auth/token", formData, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
        localStorage.setItem("agricoreRefresh", response.data.refresh_token)
        localStorage.setItem("agricoreToken", response.data.access_token)
        setToken(response.data.access_token)
    }
    const logout = () => {
        localStorage.removeItem("agricoreRefresh")
        localStorage.removeItem("agricoreToken")
        setToken(null)
    }

    useEffect(() => {
        const id = apiClient.interceptors.response.use(response => response, async error => {
            const req = error.config
            if (error.response?.status != 401 || req.url?.includes("/auth/token"))
                return Promise.reject(error)

            if (req._retry) {
                logout()
                return Promise.reject(error)
            }
            req._retry = true

            try {
                if (!refreshPromise) {
                    refreshPromise = (async () => {
                        const refresh = localStorage.getItem("agricoreRefresh")
                        if (!refresh) throw new Error("No refresh token")

                        const { data } = await refreshClient.post("/auth/refresh", {
                            refresh_token: refresh
                        })

                        localStorage.setItem("agricoreToken", data.access_token)
                        localStorage.setItem("agricoreRefresh", data.refresh_token)
                        setToken(data.access_token)
                        //setRefresh(data.refresh_token)

                        return data.access_token as string
                    })().finally(() => {
                        refreshPromise = null
                    })
                }

                const token = await refreshPromise
                req.headers.Authorization = `Bearer ${token}`
                return apiClient(req)

            } catch (error) {
                logout()
                return Promise.reject(error)
            }
        }
        )
        return () => apiClient.interceptors.response.eject(id)
    }, [])



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
