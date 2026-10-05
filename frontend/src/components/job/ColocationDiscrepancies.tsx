
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import apiClient from '../../api/client'
import { Alert, Box, CircularProgress } from '@mui/material'

const columns: GridColDef[] = [
    { field: "job_id", headerName: "Job ID", flex: 1, type: "number" },
    { field: "equipment_farm_id", headerName: "Equipment Farm ID", flex: 1, type: "number" },
    { field: "operator_farm_id", headerName: "Operator Farm ID", flex: 1, type: "number" },
    { field: "job_priority", headerName: "Priority", flex: 1, type: "string" },
    { field: "job_status", headerName: "Status", flex: 1, type: "string" },
]

function ColocationDiscrepancies() {
    const [discrepancies, setDiscrepancies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError(null)
            try {
                const response = await apiClient.get("/jobs/colocation-discrepancies")
                setDiscrepancies(response.data)
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
            <DataGrid label="Colocation Discrepancies" rows={discrepancies} columns={columns} getRowId={(row) => row.job_id} showToolbar />
        </Box>
    </>
}

export default ColocationDiscrepancies