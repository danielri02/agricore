
import { useState } from "react";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";


function LoginForm() {
    const { login } = useAuth()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<any>(null)

    const navigate = useNavigate()


    const handleSubmit = async (event: any) => {
        event.preventDefault()
        setError(null)
        try {
            await login(username, password)
            navigate("/")
        }
        catch {
            setError("Incorrect username or password")
        }
    }

    return (<>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <Paper component="form" onSubmit={handleSubmit} variant="outlined" sx={{ p: 4, width: 320 }}>
                <Typography variant="h6" gutterBottom>
                    AgriCore Login
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField label="Username" fullWidth margin="normal" value={username} onChange={(event) => setUsername(event.target.value)} />
                <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(event) => setPassword(event.target.value)} />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Log In</Button>
            </Paper>
        </Box>
    </>)
}

export default LoginForm
