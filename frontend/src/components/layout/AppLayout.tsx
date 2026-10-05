
import { Box } from "@mui/material"
import AppHeader from "./AppHeader"
import { Outlet } from "react-router"
import AppSidebar from "./AppSidebar"
import { useAuth } from "../../context/AuthContext"


function AppLayout() {
    const { user, logout } = useAuth()
    return <>
        <Box sx={{ width: "100%", height: "100dvh", display: "flex", flexDirection: "column" }}>
            <AppHeader username={user?.sub} role={user?.role} onLogout={logout} />
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