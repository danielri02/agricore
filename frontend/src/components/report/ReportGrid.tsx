
import { type GridColDef } from '@mui/x-data-grid'
import { Link } from '@mui/material'
import { isAdmin } from '../../context/roles'
import ListGrid from '../reusable/ListGrid'


function ReportGrid() {

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", flex: 1, type: "number" },
        { field: "job_id", headerName: "Job ID", flex: 1, type: "number", editable: isAdmin() },
        { field: "timestamp", headerName: "Timestamp", flex: 2, type: "dateTime", valueGetter: (value) => new Date(value) },
        { field: "notes", headerName: "Notes", flex: 2, type: "string", editable: isAdmin() },
        {
            field: "file_url", headerName: "File URL", flex: 2, type: "string", editable: false,
            renderCell: (params) => (
                <Link href={params.value} target="_blank" rel="noopener noreferrer">{params.value}</Link>
            )
        },
    ]

    return <ListGrid label="Reports" endpoint="/reports" columns={columns} />
}

export default ReportGrid