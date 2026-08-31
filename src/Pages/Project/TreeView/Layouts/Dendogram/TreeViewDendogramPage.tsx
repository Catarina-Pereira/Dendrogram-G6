import * as React from "react"
import { useState } from "react"
import Box from "@mui/material/Box"
import TreeViewConfigurationCard from "../../../../../Components/Project/TreeView/TreeViewConfigurationCard"
import DendogramTree from "./DendogramTree"

export default function TreeViewDendogramPage() {
    const [showDendogram, setShowDendogram] = useState<boolean>(false)

    function handleGenerateTreeViewUpgma() {
        setShowDendogram(true);
    }

    return (
        <Box sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
        }} >
            {!showDendogram && (
                <TreeViewConfigurationCard
                    onGenerateTreeView={handleGenerateTreeViewUpgma}
                />
            )}
            {
                showDendogram && (
                    <DendogramTree />
                )
            }
        </Box>
    )
}
