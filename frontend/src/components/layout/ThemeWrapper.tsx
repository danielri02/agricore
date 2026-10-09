import { useMode } from "../../context/ThemeContext"
import { ThemeProvider, CssBaseline } from '@mui/material'


function ThemeWrapper({children}:any) {
    const {theme} = useMode()

    return <>
    <ThemeProvider theme={theme}>
        <CssBaseline>
            {children}
        </CssBaseline>
    </ThemeProvider>
    </>
}

export default ThemeWrapper