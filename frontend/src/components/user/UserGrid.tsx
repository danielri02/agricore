

import { type GridColDef } from '@mui/x-data-grid'
import { isAdmin } from '../../context/roles'
import ListGrid from '../reusable/ListGrid'


function UserGrid() {

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", flex: 1, type: "number" },
        { field: "username", headerName: "Username", flex: 2, type: "string", editable: isAdmin() },
        { field: "hashed_password", headerName: "Hashed Password", flex: 1, type: "number", editable: isAdmin() },
        { field: "role", headerName: "Role", flex: 1, type: "singleSelect", editable: isAdmin(),
            valueOptions: ["Admin", "Operator", "Auditor"]
        }
    ]

    return <ListGrid label="Users" endpoint="/auth/users" columns={columns} />
}

export default UserGrid