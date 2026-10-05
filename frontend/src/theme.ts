
import { createTheme } from "@mui/material"

const theme = {
    ...createTheme({
        palette: {
            mode: "light",
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

export default theme