
import { type GridColDef } from '@mui/x-data-grid'
import { isAdmin, isOperator } from '../../context/roles'
import ListGrid from '../reusable/ListGrid'


function JobGrid() {

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", flex: 1, type: "number" },
        { field: "title", headerName: "Title", flex: 2, type: "string", editable: isAdmin() },
        { field: "equipment_id", headerName: "Equipment ID", flex: 1, type: "number", editable: isAdmin() },
        { field: "operator_id", headerName: "Operator ID", flex: 1, type: "number", editable: isAdmin() },
        {
            field: "priority", headerName: "Priority", flex: 2, type: "singleSelect", editable: isAdmin(),
            valueOptions: ["Low", "Medium", "Critical"]
        },
        {
            field: "status", headerName: "Status", flex: 2, type: "singleSelect", editable: (isAdmin()||isOperator()),
            valueOptions: ["Pending", "In-Progress", "Completed", "Failed"]
        },
    ]

    return <ListGrid label="Jobs" endpoint="/jobs" columns={columns} />
}

export default JobGrid