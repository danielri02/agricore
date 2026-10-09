import { DarkMode, LightMode } from "@mui/icons-material"
import { Button } from '@mui/material'
import { useMode } from "../../context/ThemeContext"


function DarkToggle() {

    const {mode,toggleMode} = useMode()


    if (mode == "dark") {
        return <>
            <Button sx={{color:"white"}} startIcon={<LightMode />} onClick={() => toggleMode()} />
        </>
    }
    return <>
            <Button sx={{color:"white"}} startIcon={<DarkMode />} onClick={() => toggleMode()} />
    </>
}

export default DarkToggle