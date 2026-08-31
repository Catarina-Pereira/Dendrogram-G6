import {useState} from "react"
import {CreateWorkflowInputModel} from "../../../Services/Compute/models/createWorkflow/CreateWorkflowInputModel"
import {useProjectContext} from "../useProject"
import {useNavigate} from "react-router-dom"
import {WebUiUris} from "../../WebUiUris";
import { MockComputeService } from "../../../Services/Compute/MockComputeService"

/**
 * Hook that handles computations.
 */
export function useCompute() {
    const navigate = useNavigate()
    const {project, onWorkflowsUpdate} = useProjectContext()
    const [error, setError] = useState<string | null>(null)

    /**
     * Creates a new workflow.
     *
     * @param workflow The workflow to create
     */
    function createWorkflow(workflow: CreateWorkflowInputModel) {
        MockComputeService.createWorkflow(project?.projectId!, workflow)
            .catch((err) => setError(err.message))
            .finally(() => {
                onWorkflowsUpdate()
                navigate(WebUiUris.project(project?.projectId!))
            })
    }

    return {
        createWorkflow,
        error,
        clearError: () => setError(null)
    }
}