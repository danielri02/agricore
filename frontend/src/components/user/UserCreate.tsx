

import { type GridColDef } from '@mui/x-data-grid'
import CreateGrid from '../reusable/CreateGrid'



function UserCreate() {
    const columns: GridColDef[] = [
        { field: "username", headerName: "Username", flex: 2, type: "string", editable: true },
        { field: "password", headerName: "Password", flex: 2, type: "string", editable: true },
        {
            field: "role", headerName: "Role", flex: 1, type: "singleSelect", editable: true,
            valueOptions: ["Admin", "Operator", "Auditor"]
        },
    ]

    return <CreateGrid label="Users" endpoint="/auth/users" columns={columns} />
}

export default UserCreate