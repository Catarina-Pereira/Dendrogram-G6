import * as React from "react"
import { Box, Button, Collapse } from "@mui/material"
import { TreeViewNodeEdgePropertiesOptions } from "./TreeViewNodeEdgePropertiesOption"
import { TreeIsolateOptions } from "./TreeIsolate"
import { Row } from "../../../Services/Visualization/models/getIsolateDataProfiles/GetIsolateDataRowsOutputModel"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

/**
 * Props for TreeSettingsCard component.
 */
interface TreeSettingsCardProps {
    nodeSize: number;
    setNodeSize: (value: number) => void;
    showLabel: boolean;
    setShowLabel: (value: boolean) => void;
    labelSize: number;
    setLabelSize: (value: number) => void;
    edgeSize: number;
    setEdgeSize: (value: number) => void;
    isolateKeys: string[];
    selectedKey: string;
    setSelectedKey: (Value: string) => void;
    isolateDataRows: Row[] | undefined;
    isolateDataKey: string,
    onExport: () => void;
}

/**
 * Card with settings for the tree.
 */
export function TreeSettingsCard(
    {
        nodeSize,
        setNodeSize,
        showLabel,
        setShowLabel,
        labelSize,
        setLabelSize,
        edgeSize,
        setEdgeSize,
        isolateKeys,
        selectedKey,
        setSelectedKey,
        isolateDataRows,
        isolateDataKey,
        onExport,
    }: TreeSettingsCardProps
) {

    const [expanded, setExpanded] = React.useState(false);

    return (<Box sx={{
        opacity: 1,
        pointerEvents: "initial",
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 1,
        backgroundColor: "white",
        borderRadius: 1,
        p: 1,
        m: 1,
        border: 1,
        borderColor: "divider",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
    }}>
        <Button
            onClick={() => setExpanded(!expanded)}
            size={"small"}
            sx={{
                backgroundColor: "#277BC0", color: "#FFF",
                "&:hover": {
                    backgroundColor: "#FFF", color: "#277BC0"
                },
            }}
            startIcon={<ExpandMoreIcon color={"inherit"}
                sx={{
                    transform: expanded ? "rotate(0deg)" : "rotate(180deg)",
                    transition: "transform 0.2s ease",
                }} />}
        >
            Tree Settings
        </Button>
        <Collapse in={expanded} timeout={"auto"} unmountOnExit>
            <TreeViewNodeEdgePropertiesOptions
                nodeSize={nodeSize}
                setNodeSize={setNodeSize}
                showLabel={showLabel}
                setShowLabel={setShowLabel}
                labelSize={labelSize}
                setLabelSize={setLabelSize}
                edgeSize={edgeSize}
                setEdgeSize={setEdgeSize}
                selectedKey={selectedKey}
                isolateDataRows={isolateDataRows}
                isolateDataKey={isolateDataKey}
            />
            <TreeIsolateOptions
                isolateKeys={isolateKeys}
                selectedKey={selectedKey}
                setSelectedKey={setSelectedKey} />
            <Box sx={{ mt: 1, p: 1 }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={onExport}
                    sx={{ mt: 1 }} >
                    Export Graph in PNG
                </Button>
            </Box>
        </Collapse>
    </Box>
    )
}
