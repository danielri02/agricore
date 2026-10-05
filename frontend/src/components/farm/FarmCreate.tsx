
import { type GridColDef } from '@mui/x-data-grid'
import CreateGrid from '../reusable/CreateGrid'


function FarmCreate() {
    const columns: GridColDef[] = [
        { field: "name", headerName: "Name", flex: 2, type: "string", editable: true },
        { field: "region", headerName: "Region", flex: 1, type: "string", editable: true },
        { field: "capacity", headerName: "Capacity", flex: 1, type: "number", editable: true },
        { field: "supervisor_id", headerName: "Supervisor ID", flex: 1, type: "number", editable: true },
    ]

    return <CreateGrid label="Farms" endpoint="/farms" columns={columns} />
}

export default FarmCreate