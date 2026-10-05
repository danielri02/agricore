
import { type GridColDef } from '@mui/x-data-grid'
import CreateGrid from '../reusable/CreateGrid'


function OperatorCreate() {
    const columns: GridColDef[] = [
        { field: "name", headerName: "Name", flex: 2, type: "string", editable: true },
        { field: "farm_id", headerName: "Farm ID", flex: 1, type: "number", editable: true },
    ]

    return <CreateGrid label="Operators" endpoint="/operators" columns={columns} />
}

export default OperatorCreate