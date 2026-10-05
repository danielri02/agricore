
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import apiClient from '../../api/client'
import { Alert, Box, CircularProgress } from '@mui/material'

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1, type: "number",
        // renderCell: (params) => (<Link to={`/farms/${params.row.id}`}>{params.value}</Link>)
    },
    { field: "farm_id", headerName: "Farm ID", flex: 1, type: "number" },
    { field: "serial_number", headerName: "Serial Number", flex: 2, type: "string" },
    { field: "model", headerName: "Model", flex: 1, type: "string" },
    { field: "fuel_level", headerName: "Fuel Level", flex: 2, type: "number",valueFormatter:(value:number)=>`${Number(value).toFixed(1)}%` },
    { field: "status", headerName: "Status", flex: 2, type: "string" },
]

function LowFuelAlerts() {
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError(null)
            try {
                const response = await apiClient.get("/equipment/low-fuel-alerts")
                setAlerts(response.data)
            }
            catch (error) {
                setError(error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return <CircularProgress />
    }
    if (error) {
        return <Alert severity="error">{error}</Alert>
    }

    return <>
        <Box sx={{ width: "100%" }}>
            <DataGrid label="Low Fuel Alerts" rows={alerts} columns={columns} getRowId={(row) => row.id} showToolbar />
        </Box>
    </>


}

export default LowFuelAlerts