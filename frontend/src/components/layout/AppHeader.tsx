

import { FoodBank } from '@mui/icons-material'
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material'
import DarkToggle from './DarkToggle'


function AppHeader({ username, role, onLogout }: any) {
    return <>
        <AppBar position="static" sx={{ maxHeight: "5%" }}>
            <Toolbar>
                <Typography variant="h4" component="h1" sx={{WebkitTextStroke:"0.5px black" }}>
                    <FoodBank fontSize="large"/>
                    AgriCore Operations Command
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                {username && (
                    <Box sx={{display:"flex",gap:2}}>
                        <Typography variant='h6'>{username} ({role})</Typography>
                        <Button color="inherit" onClick={onLogout}>Log Out</Button>
                    </Box>
                )}
                <DarkToggle/>
            </Toolbar>
        </AppBar>
    </>
}


export default AppHeader