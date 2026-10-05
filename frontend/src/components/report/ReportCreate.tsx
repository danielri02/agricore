import { CloudUpload } from "@mui/icons-material";
import { Button, FormControl, FormLabel, Stack, TextField, Typography } from "@mui/material";
import apiClient from "../../api/client";
import { useState } from "react";

function ReportCreate() {
    const [jobId, setJobId] = useState(0)
    const [notes, setNotes] = useState("")
    const [file, setFile] = useState<any>(null)

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFile(event.target.files?.[0])
    }

    async function submit() {
        if (file) {

            try {
                const formData = new FormData();
                formData.append("file", file);

                const uploadResponse = await apiClient.post("/reports", formData)
                console.log(uploadResponse.data)
                const report = uploadResponse.data

                const response = await apiClient.put(`/reports/${report.id}`, {
                    ...report,
                    job_id: jobId, notes: notes
                }
                )
                console.log(response.data)

                setJobId(0)
                setNotes("")
                setFile(null)
            }
            catch (error) {}
        }
    }

    return <>
        <Stack direction={"column"} sx={{ minWidth: 500 }} spacing={1}>
            <Typography variant="h5">Create Report</Typography>
            <FormControl sx={{ p: 3 }}>
                <FormLabel>Job ID</FormLabel>
                <TextField type="number" value={jobId} onChange={(e: any) => setJobId(e.target.value)} />
            </FormControl>
            <FormControl sx={{ p: 3 }}>
                <FormLabel>Notes</FormLabel>
                <TextField multiline rows={4} value={notes} onChange={(e: any) => setNotes(e.target.value)} />
            </FormControl>
            <Stack direction={"row"} spacing={2}>
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUpload />}
                >
                    Attach Report
                    <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
                <Typography>{file?.name ?? ""}</Typography>
            </Stack>

            <Button
                component="label"
                variant="contained"
                onClick={submit}
            >
                Submit
            </Button>
        </Stack>
    </>
}

export default ReportCreate