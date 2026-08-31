import * as React from "react";
import { Button, Collapse, FormControl, InputLabel, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


export interface TreeIsolateProps {
    isolateKeys: string[];
    selectedKey: string;
    setSelectedKey: (Value: string) => void;
}


export function TreeIsolateOptions({
    isolateKeys,
    selectedKey,
    setSelectedKey }: TreeIsolateProps
) {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedKey(event.target.value);
    };
    return <>
        <Button
            onClick={() => setExpanded(!expanded)}
            size={"small"}
            startIcon={<ExpandMoreIcon color={"inherit"} />}
        >
            Select Isolate Field
        </Button >
        <Collapse in={expanded} timeout={"auto"} unmountOnExit>
            <FormControl fullWidth size="small">
                <InputLabel id="isolate-key-select-label">Isolate Field</InputLabel>
                <Select
                    labelId="isolate-key-select-label"
                    label="Isolate Field"
                    value={selectedKey}
                    onChange={handleChange}
                >
                    {isolateKeys.map((key) => (
                        <MenuItem key={key} value={key}>
                            {key}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Collapse >
    </>
}
