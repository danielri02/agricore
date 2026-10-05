
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import apiClient from '../../api/client'
import { Alert, Box, CircularProgress } from '@mui/material'

const columns: GridColDef[] = [
    { field: "supervisor_id", headerName: "Regional Supervisor ID", flex: 1, type: "number" },
    { field: "operator_count", headerName: "Operators On Active Jobs", flex: 2, type: "number" },
]

function ReportingLines() {
    const [lines, setLines] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError(null)
            try {
                const response = await apiClient.get("/operators/reporting-lines")
                setLines(response.data)
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
            <DataGrid label="Reporting Lines" rows={lines} columns={columns} getRowId={(row) => row.supervisor_id} showToolbar />
        </Box>
    </>
}

export default ReportingLines