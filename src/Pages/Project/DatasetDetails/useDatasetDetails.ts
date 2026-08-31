import {useNavigate, useParams} from "react-router-dom"
import {useEffect, useState} from "react"
import {Dataset} from "../../../Services/Administration/models/projects/getProject/GetProjectOutputModel"
import {WebUiUris} from "../../WebUiUris";
import { MockAdministrationService } from "../../../Services/Administration/MockAdministrationService";

/**
 * Hook for the DatasetDetails page.
 */
export function useDatasetDetails() {
    const {projectId, datasetId} = useParams<{ projectId: string, datasetId: string }>()
    const [dataset, setDataset] = useState<Dataset>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (projectId === undefined)
            throw new Error("Project id is undefined")
        if (datasetId === undefined)
            throw new Error("Dataset id is undefined")

        setLoading(true)
        MockAdministrationService.getDataset(projectId, datasetId)
            .then((res) => {
                setDataset(res)
                setLoading(false)
            })
            .catch((err) => {
                setError(err)
                setLoading(false)
            })
    }, [projectId, datasetId])

    return {
        dataset,
        loading,
        handleEditDataset: () => navigate(WebUiUris.editDataset(projectId!, datasetId!)),
        error,
        clearError: () => setError(null)
    }
}