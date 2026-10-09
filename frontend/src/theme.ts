
import { createTheme } from "@mui/material"


function getTheme(mode: string) {
    const theme = {
        ...createTheme({
            palette: {
                mode: mode as "light" | "dark",
                primary: {
                    main: "#0da139"
                },
                secondary: {
                    main: "#0099ff"
                },
            }
        }),
        shape: { borderRadius: 8 }
    }
    return theme
}


export default getTheme