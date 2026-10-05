
import { type GridColDef } from '@mui/x-data-grid'
import { isAdmin } from '../../context/roles'
import ListGrid from '../reusable/ListGrid'


function OperatorGrid() {

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", flex: 1, type: "number" },
        { field: "name", headerName: "Name", flex: 2, type: "string", editable: isAdmin() },
        { field: "farm_id", headerName: "Farm ID", flex: 1, type: "number", editable: isAdmin() },
    ]

    return <ListGrid label="Operators" endpoint="/operators" columns={columns} />
}

export default OperatorGrid