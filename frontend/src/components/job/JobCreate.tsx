

import { type GridColDef } from '@mui/x-data-grid'
import CreateGrid from '../reusable/CreateGrid'




function JobCreate() {
    const columns: GridColDef[] = [
        { field: "title", headerName: "Title", flex: 2, type: "string", editable: true },
        { field: "equipment_id", headerName: "Equipment ID", flex: 1, type: "number", editable: true },
        { field: "operator_id", headerName: "Operator ID", flex: 1, type: "number", editable: true },
        {
            field: "priority", headerName: "Priority", flex: 2, type: "singleSelect", editable: true,
            valueOptions: ["Low", "Medium", "Critical"]
        },
        {
            field: "status", headerName: "Status", flex: 2, type: "singleSelect", editable: true,
            valueOptions: ["Pending", "In-Progress", "Completed", "Failed"]
        },
    ]

    return <CreateGrid label="Jobs" endpoint="/jobs" columns={columns} />
}

export default JobCreate