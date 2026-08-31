import {useEffect, useState} from "react"
import {ProjectModel} from "../../Services/Administration/models/ProjectModel"
import {useNavigate} from "react-router-dom"
import {WebUiUris} from "../WebUiUris"
import { MockAdministrationService } from "../../Services/Administration/MockAdministrationService"

/**
 * Hook for the OpenProject page.
 */
export function useOpenProject() {
    const [projects, setProjects] = useState<ProjectModel[] | null>(null)
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [projectsUpdated, setProjectsUpdated] = useState<boolean>(false)

    useEffect(() => {
        MockAdministrationService.getProjects()
            .then((res) => setProjects(res.projects))
            .catch((err) => setError(err.message))
    }, [projectsUpdated])

    return {
        projects,
        handleOpenProject: (projectId: string) => navigate(WebUiUris.project(projectId)),
        handleDeleteProject: (projectId: string) => {
            MockAdministrationService.deleteProject(projectId)
                .then(() => setProjectsUpdated(projectsUpdated => !projectsUpdated))
                .catch((err) => setError(err.message))
        },
        error,
        clearError: () => setError(null)
    }
}