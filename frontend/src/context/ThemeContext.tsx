
import { createContext, useContext, useMemo, useState } from "react";
import { useMediaQuery } from "@mui/material"
import getTheme from "../theme";


const ModeContext = createContext<any>(null)

export function ModeProvider({ children }: any) {
    const systemMode = useMediaQuery('(prefers-color-scheme: dark)') ? "dark" : "light"
    const [mode, setMode] = useState(() => localStorage.getItem("agricoreMode") ?? systemMode)
    const theme = useMemo(() => getTheme(mode), [mode])

    function toggleMode() {
        const newMode = mode == "light" ? "dark" : "light"
        localStorage.setItem("agricoreMode", newMode)
        setMode(newMode)
    }

    const value = { mode, toggleMode, theme }
    return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}

export function useMode() {
    const context = useContext(ModeContext)
    if (context === null) {
        throw new Error("useMode must be used within ModeProvider")
    }
    return context
}
