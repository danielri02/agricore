import { type GridColDef } from "@mui/x-data-grid"
import { isAdmin } from "../../context/roles"
import ListGrid from "../reusable/ListGrid"

function EquipmentGrid() {

    const columns: GridColDef[] = [
        {
            field: "id", headerName: "ID", flex: 1, type: "number",
        },
        { field: "farm_id", headerName: "Farm ID", flex: 1, type: "number", editable: isAdmin() },
        { field: "serial_number", headerName: "Serial Number", flex: 2, type: "string", editable: isAdmin() },
        { field: "model", headerName: "Model", flex: 1, type: "string", editable: isAdmin() },
        { field: "fuel_level", headerName: "Fuel Level", flex: 2, type: "number", valueFormatter: (value) => `${value}%`, editable: isAdmin() },
        {
            field: "status", headerName: "Status", flex: 2, type: "singleSelect", editable: isAdmin(),
            valueOptions: ["Idle", "Maintenance", "In-Use", "Retired"]
        },
    ]

    return <ListGrid label="Equipment" endpoint="/equipment" columns={columns} />

}

export default EquipmentGrid