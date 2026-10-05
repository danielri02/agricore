
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import apiClient from '../../api/client'
import { Alert, Box, CircularProgress } from '@mui/material'

const columns: GridColDef[] = [
    { field: "equipment_model", headerName: "Model", flex: 1, type: "string" },
    { field: "completed_job", headerName: "Completed Jobs", flex: 2, type: "number" },
    { field: "failed_job", headerName: "Failed Jobs", flex: 2, type: "number" },
    { field: "reliability_ratio", headerName: "Reliability Ratio", flex: 2, type: "number",valueFormatter:(value)=>`${value != null ? Number(value).toFixed(2) : "-"}` },
]

function ReliabilityRatios() {
    const [ratios, setRatios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError(null)
            try {
                const response = await apiClient.get("/equipment/reliability-ratios")
                setRatios(response.data)
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
            <DataGrid label="Reliability Ratios" rows={ratios} columns={columns} getRowId={(row) => row.equipment_model} showToolbar />
        </Box>
    </>
}

export default ReliabilityRatios