import { DataGrid, type GridRowSelectionModel } from "@mui/x-data-grid"
import { useState } from "react"
import { createRows } from "../../api/persist"
import { Box, Button, Stack } from '@mui/material'
import { Add, Remove, Save } from "@mui/icons-material"


function CreateGrid({label, endpoint, columns }: any) {

    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<any>([])
    const [selection, setSelection] = useState<GridRowSelectionModel>({
        type: "include",
        ids: new Set(),
    })

    function addRow() {
        const row_id = Date.now()
        setRows((rows: any) => [
            ...rows,
            { ...Object.fromEntries(columns.map((c: any) => [c.field, ""])), row_id }
        ])
    }

    function updateRow(newRow: any) {
        setRows((prev: any[]) => prev.map(row => row.row_id == newRow.row_id ? newRow : row))
        return newRow
    }

    function removeRows() {
        setRows((prev: any[]) => prev.filter(row => !selection.ids.has(row.row_id)))
    }

    async function submit() {
        setLoading(true)
        try {
            await createRows(endpoint, rows)
            setRows([])
        }
        catch (error) {
        }
        finally {
            setLoading(false)
        }
    }

    return <>
        <Box sx={{ width: "100%" }}>
            <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={1}>
                    <Button startIcon={<Add />} variant="contained" onClick={addRow}>
                        Add {label}
                    </Button>
                    <Button startIcon={<Save/>} variant="contained" onClick={submit}>
                        Save All
                    </Button>
                    <Button startIcon={<Remove/>} variant="contained" onClick={removeRows}>
                        Remove Selected
                    </Button>
                </Stack>

                <Box sx={{ width: "100%" }}>
                    <DataGrid
                        label={`Create ${label}`} showToolbar
                        rows={rows} columns={columns}
                        getRowId={(row) => row.row_id}
                        editMode="row"
                        processRowUpdate={(newRow) => updateRow(newRow)}
                        onProcessRowUpdateError={(error) => console.log(error)}
                        loading={loading}
                        checkboxSelection
                        rowSelectionModel={selection}
                        onRowSelectionModelChange={setSelection}
                        disableRowSelectionOnClick
                    />
                </Box>
            </Stack>
        </Box>
    </>

}

export default CreateGrid