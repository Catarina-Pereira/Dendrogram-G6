import * as React from "react"
import { Button, Container } from "@mui/material"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import FinishIcon from "@mui/icons-material/Done"
import { FileUploader } from "react-drag-drop-files"
import CancelIcon from "@mui/icons-material/Cancel"
import LoadingSpinner from "../../Shared/LoadingSpinner"
import { ErrorAlert } from "../../Shared/ErrorAlert"
import { TreeViewNewickLoaderCard } from "./TreeViewNewickLoaderCard"

interface TreeViewConfigurationCardProps {
    onGenerateTreeView: () => void;
}


/**
 * Upload Files page.
 */
export default function TreeViewConfigurationCard({
    onGenerateTreeView,
}: TreeViewConfigurationCardProps) {
    const {
        file,
        isUploading,
        handleFileChange,
        handleCancel,
        handleSubmit,
        error,
        clearError
    } = TreeViewNewickLoaderCard({ onGenerateTreeView })

    return (
        <Container maxWidth={false}
            sx={{
                width: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Paper sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                mt: 4,
                mb: 4,
                alignItems: "center",
                width: "auto"
            }}>
                <Typography component="h1" variant="h4">
                    Upload File UPGMA
                </Typography>
                <Box sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                    <Box sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mt: 4,
                        mb: 4
                    }}>
                        <FileUploader handleChange={handleFileChange} name="file" required />
                        <ErrorAlert error={error} clearError={clearError} />
                    </Box>

                    {
                        isUploading && (
                            <LoadingSpinner text={"Uploading…"} />
                        )
                    }
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                        <Button
                            variant="contained"
                            startIcon={<CancelIcon />}
                            onClick={handleCancel}
                            disabled={isUploading}
                            sx={{ mt: 4, width: "50" }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<FinishIcon />}
                            onClick={handleSubmit}
                            disabled={isUploading}
                            sx={{ mt: 4, ml: 2, width: "50%" }}
                        >
                            Upload
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container >
    )
}
