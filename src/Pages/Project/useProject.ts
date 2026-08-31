import {useNavigate, useParams} from "react-router-dom"
import * as React from "react"
import {useContext, useEffect, useState} from "react"
import {Project} from "../../Services/Administration/models/projects/getProject/GetProjectOutputModel"
import {WebUiUris} from "../WebUiUris";
import {Problem} from "../../Services/utils/Problem";
import { MockAdministrationService } from "../../Services/Administration/MockAdministrationService"

/**
 * Properties of the context for the Project page.
 *
 * @property project the project to display
 * @property onFileStructureUpdate callback when the file structure has been updated
 */
export interface ProjectContextProps {
    project: Project | null
    onFileStructureUpdate: () => void
    onWorkflowsUpdate: () => void
}

/**
 * Context for the Project page.
 *
 * @property project the project to display
 * @property onFileStructureUpdate callback when the file structure has been updated
 */
export const ProjectContext = React.createContext<ProjectContextProps>({
    project: null,
    onFileStructureUpdate: () => {
        console.log("being called for some reason")
    },
    onWorkflowsUpdate: () => {
        console.log("workflow update")
    },

})


/**
 * Hook for the Project page.
 */
export function useProject() {
    const projectId = (useParams<{ projectId: string }>().projectId)!

    const [project, setProject] = useState<Project | null>(null)

    const [loadingProject, setLoadingProject] = useState<boolean>(true)

    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        setLoadingProject(true)
        loadProject().finally(() => setLoadingProject(false))

    }, [projectId])

    function loadProject() {
        return MockAdministrationService.getProject(projectId)
            .then((res) => {
                setProject(res)
                setError(null)
            })
            .catch((err: Error) => {
                if(err instanceof Problem && err.status === 404) {
                    navigate("not-found")
                }
                setError("Could not load project: " + err.message)}
            )
    }

    return {
        project,

        loadingFiles: loadingProject,
        onFileStructureUpdate: () => loadProject(),
        onWorkflowsUpdate: () => loadProject(),
        handleEditProject: () => navigate(WebUiUris.editProject(projectId!)),

        error,
        clearError: () => setError(null)
    }
}

/**
 * Hook to use the project context.
 */
export function useProjectContext() {
    return useContext(ProjectContext)
}