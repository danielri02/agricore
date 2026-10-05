
import { type GridColDef } from '@mui/x-data-grid'
import CreateGrid from '../reusable/CreateGrid'



function EquipmentCreate() {
    const columns: GridColDef[] = [
        { field: "farm_id", headerName: "Farm ID", flex: 1, type: "number", editable: true },
        { field: "serial_number", headerName: "Serial Number", flex: 2, type: "string", editable: true },
        { field: "model", headerName: "Model", flex: 1, type: "string", editable: true },
        { field: "fuel_level", headerName: "Fuel Level", flex: 2, type: "number", valueFormatter: (value) => `${value}%`, editable: true },
        {
            field: "status", headerName: "Status", flex: 2, type: "singleSelect", editable: true,
            valueOptions: ["Idle", "Maintenance", "In-Use", "Retired"]
        },
    ]
    return <CreateGrid label="Equipment" endpoint="/equipment" columns={columns} />
}

export default EquipmentCreate