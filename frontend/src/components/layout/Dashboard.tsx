
import { Box, Stack, Typography } from "@mui/material"
import LowFuelAlerts from "../equipment/LowFuelAlerts"
import MaintenanceFlags from "../farm/MaintenanceFlags"
import ColocationDiscrepancies from "../job/ColocationDiscrepancies"
import ReportingLines from "../operator/ReportingLines"


function Dashboard() {
    return <>
        {/* <Container maxWidth="lg" sx={{ mt: 4 }}> */}
        <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
            <Typography variant='h5' component="h2" gutterBottom>
                Overview
            </Typography>
            <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
                <LowFuelAlerts />
            </Box>
            <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
                <ColocationDiscrepancies/>
            </Box>
            <Stack direction={"row"} sx={{display:"flex",flex:1,minHeight:0}}>


            <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
                <MaintenanceFlags/>
            </Box>

            <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
                <ReportingLines/>
            </Box>
            </Stack>
        </Box>
    </>
}

export default Dashboard