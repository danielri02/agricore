
import { Alert, Box, Snackbar } from "@mui/material"
import AppHeader from "./AppHeader"
import { Outlet } from "react-router"
import AppSidebar from "./AppSidebar"
import { useAuth } from "../../context/AuthContext"
import { useEffect, useState } from "react"
import apiClient from "../../api/client"


function AppLayout() {
    const { user, logout } = useAuth()
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        const interceptor = apiClient.interceptors.response.use((response) => response, (error) => {
                const msg = JSON.stringify(error.response?.data?.detail) || "Unknown error"
                setError(msg)
                return Promise.reject(error)
            }
        )
        return () => {
            apiClient.interceptors.response.eject(interceptor);
        }
    }, [])


    return <>
        <Box sx={{ width: "100%", height: "100dvh", display: "flex", flexDirection: "column" }}>
            <AppHeader username={user?.sub} role={user?.role} onLogout={logout} />
            <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
                <Alert severity="error" variant="filled" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>
            <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
                <AppSidebar />
                <Box sx={{ p: 3, display: "flex", flex: 1, minWidth: 0, minHeight: 0 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    </>
}

export default AppLayout