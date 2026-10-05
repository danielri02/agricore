
import { ExpandMore } from "@mui/icons-material";
import { List, ListItemButton, ListItemText, Box, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { isAdmin, isOperator } from "../../context/roles";

function AppSidebar() {
    const navigate = useNavigate();

    function SublistItem({ label, endpoint }: any) {
        return <>
            <ListItemButton onClick={() => navigate(endpoint)}>
                <ListItemText primary={label} />
            </ListItemButton>
        </>
    }

    function Sublist({ header, children }: any) {
        return <>
            <Accordion disableGutters square>
                <AccordionSummary expandIcon={<ExpandMore />}><Typography>{header}</Typography></AccordionSummary>
                <AccordionDetails>
                    <List disablePadding>
                        {children}
                    </List>
                </AccordionDetails>
            </Accordion>
        </>
    }

    return <>
        <Box
            sx={{
                width: "15%",
                minHeight: 500,
                flexShrink: 0,
                borderRight: "1px solid #ddd",
            }}
        >
            <List>
                <SublistItem label="Dashboard" endpoint="/" />
            </List>
            <Sublist header="Farms">
                <SublistItem label="List" endpoint="/farms" />
                {isAdmin() && <SublistItem label="Create" endpoint="/farms/create" />}
                <SublistItem label="Maintenance Flags" endpoint="/farms/maintenance-flags" />
            </Sublist>
            <Sublist header="Equipment">
                <SublistItem label="List" endpoint="/equipment" />
                {isAdmin() && <SublistItem label="Create" endpoint="/equipment/create" />}
                <SublistItem label="Low Fuel Alerts" endpoint="/equipment/low-fuel-alerts" />
                <SublistItem label="Reliability Ratios" endpoint="/equipment/reliability-ratios" />
            </Sublist>
            <Sublist header="Operators">
                <SublistItem label="List" endpoint="/operators" />
                {isAdmin() && <SublistItem label="Create" endpoint="/operators/create" />}
                <SublistItem label="Reporting Lines" endpoint="/operators/reporting-lines" />
            </Sublist>
            <Sublist header="Jobs">
                <SublistItem label="List" endpoint="/jobs" />
                {isAdmin() && <SublistItem label="Create" endpoint="/jobs/create" />}
                <SublistItem label="Colocation Discrepancies" endpoint="/jobs/colocation-discrepancies" />
            </Sublist>
            <Sublist header="Reports">
                <SublistItem label="List" endpoint="/reports" />
                {(isAdmin() || isOperator()) && <SublistItem label="Create" endpoint="/reports/create" />}
            </Sublist>
            {isAdmin() &&
                <Sublist header="Users">
                    <SublistItem label="List" endpoint="/users" />
                    <SublistItem label="Create" endpoint="/users/create" />
                </Sublist>
            }
        </Box>
    </>
}

export default AppSidebar