import {Dataset} from "../../../../../Services/Administration/models/projects/getProject/GetProjectOutputModel"
import {useNavigate, useParams} from "react-router-dom"
import {WebUiUris} from "../../../../../Pages/WebUiUris"
import {Delete, Edit, Info} from "@mui/icons-material"
import {useDeleteResourceBackdrop} from "../../../../Shared/DeleteResourceBackdrop"
import {useState} from "react"
import {TreeViewsIcon} from "../../../../Shared/Icons";
import {useProjectContext} from "../../../../../Pages/Project/useProject";
import { MockAdministrationService } from "../../../../../Services/Administration/MockAdministrationService"

export const computeTreeViewsOptions = (projectId: string, datasetId: string) => [
    {
        label: "Dendogram",
        url: WebUiUris.computeDendogram(projectId, datasetId)
    },
]

/**
 * Hook for the DatasetTreeItem component.
 */
export function useDatasetTreeItem(dataset: Dataset) {
    const {projectId} = useParams<{ projectId: string }>()
    const navigate = useNavigate()
    const {deleteBackdropOpen, handleDeleteBackdropOpen, handleDeleteBackdropClose} = useDeleteResourceBackdrop()
    const [error, setError] = useState<string | null>(null)
    const {onFileStructureUpdate} = useProjectContext()

    return {
        contextMenuItems: [
            {
                label: "Compute Tree View",
                icon: TreeViewsIcon,
                nestedItems: computeTreeViewsOptions(projectId!, dataset.datasetId).map((option) => {
                    return {
                        label: option.label,
                        icon: TreeViewsIcon,
                        onClick: () => navigate(option.url)
                    }
                })
            },
            {
                label: "Details",
                icon: Info,
                onClick: () => navigate(WebUiUris.dataset(projectId!, dataset.datasetId))
            },
            {
                label: "Edit",
                icon: Edit,
                onClick: () => navigate(WebUiUris.editDataset(projectId!, dataset.datasetId))
            },
            {
                label: "Delete",
                icon: Delete,
                onClick: handleDeleteBackdropOpen
            }
        ],
        deleteBackdropOpen,
        handleDeleteBackdropClose,
        handleDelete: () => {
            MockAdministrationService.deleteDataset(projectId!, dataset.datasetId)
                .then(() => {
                    handleDeleteBackdropClose()
                    navigate(WebUiUris.project(projectId!))
                    onFileStructureUpdate()
                })
                .catch(error => {
                    /*if (error instanceof Problem && error.title === "") {
                        setError("Cannot delete dataset. (...)") TODO Add possible errors (problems)
                    } else */
                    setError("Could not delete the dataset. An unexpected error occurred while trying to delete it.")
                })
        },
        error,
        clearError: () => setError(null)
    }
}