
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import apiClient from '../../api/client'
import { Alert, Box, CircularProgress } from '@mui/material'

const columns: GridColDef[] = [
    { field: "farm_id", headerName: "Farm ID", flex: 1, type: "number" },
    { field: "pct_maintenance", headerName: "Equipment Needing Maintenance %", flex: 2, type: "number",valueFormatter:(value)=>`${value != null ? `${Number(value).toFixed(1)}%` : "-"}` },
]

function MaintenanceFlags() {
    const [flags, setFlags] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError(null)
            try {
                const response = await apiClient.get("/farms/maintenance-flags")
                setFlags(response.data)
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
            <DataGrid label="Maintenance Flags" rows={flags} columns={columns} getRowId={(row) => row.farm_id} showToolbar />
        </Box>
    </>
}

export default MaintenanceFlags