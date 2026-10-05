
import { type GridColDef } from '@mui/x-data-grid'
import { isAdmin } from '../../context/roles'
import ListGrid from '../reusable/ListGrid'



function FarmGrid() {

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", flex: 1, type: "number" },
        { field: "name", headerName: "Name", flex: 2, type: "string", editable: isAdmin() },
        { field: "region", headerName: "Region", flex: 1, type: "string", editable: isAdmin() },
        { field: "capacity", headerName: "Capacity", flex: 1, type: "number", editable: isAdmin() },
        { field: "supervisor_id", headerName: "Supervisor ID", flex: 1, type: "number", editable: isAdmin() },
    ]

    return <ListGrid label="Farms" endpoint="/farms" columns={columns} />
}

export default FarmGrid