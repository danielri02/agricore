
import { Alert, Box, Button, Stack } from '@mui/material'
import { DataGrid, type GridRowSelectionModel } from "@mui/x-data-grid"
import { deleteRows, updateRow } from '../../api/persist'
import { Delete, Save } from '@mui/icons-material'
import { useState } from 'react'
import fetchData from '../../api/fetchData'
import { isAdmin } from '../../context/roles'



function ListGrid({ label, endpoint, columns }: any) {

    const [updated, setUpdated] = useState(0)
    const [refresh, setRefresh] = useState(0)
    const [selection, setSelection] = useState<GridRowSelectionModel>({
        type: "include",
        ids: new Set(),
    })

    const { data, setData, loading, error } = fetchData(endpoint, [refresh])

    function refreshGrid() {
        setSelection(s => { s.ids.clear(); return s })
        setUpdated(0)
        setRefresh(prev => prev + 1)
    }

    function onUpdate(newRow:any) {
        setData(d => d.map(r => r.id == newRow.id ? newRow : r))
        setSelection(s => { s.ids.add(newRow.id); return s })
        setUpdated(u => u + 1)
        return newRow
    }

    async function onSave() {
        const saveRows = data.filter(row => selection.ids.has(row.id))
        await Promise.all(saveRows.map(row => updateRow(endpoint, row)))
        refreshGrid()
    }

    async function onDelete() {
        console.log(Array.from(selection.ids.values()))
        const { deleted } = await deleteRows(endpoint, Array.from(selection.ids.values()) as number[])
        console.log("Deleted " + deleted)
        refreshGrid()
    }


    if (error) {
        return <Alert severity="error">{error}</Alert>
    }

    return <>
        <Box sx={{ width: "100%" }}>
            <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" startIcon={<Save/>} onClick={onSave} disabled={updated == 0 || selection.ids.size == 0}>
                        Save Selected
                    </Button>
                    <Button variant="contained" startIcon={<Delete />} onClick={onDelete} disabled={!isAdmin() || selection.ids.size == 0}>
                        Delete Selected
                    </Button>
                </Stack>
                <Box sx={{ width: "100%" }}>
                    <DataGrid
                        label={label} showToolbar
                        rows={data} columns={columns}
                        getRowId={(row) => row.id}
                        editMode="row"
                        checkboxSelection
                        rowSelectionModel={selection}
                        disableRowSelectionOnClick
                        disableRowSelectionExcludeModel
                        onRowSelectionModelChange={setSelection}
                        processRowUpdate={(newRow) => onUpdate(newRow)}
                        onProcessRowUpdateError={(error) => console.log(error)}
                        loading={loading}
                    />
                </Box>
            </Stack>
        </Box>
    </>
}

export default ListGrid