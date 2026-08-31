import {GetWorkflowStatusOutputModel, Workflow} from "./models/getWorkflow/GetWorkflowOutputModel"
import {CreateWorkflowOutputModel} from "./models/createWorkflow/CreateWorkflowOutputModel"
import {CreateWorkflowInputModel} from "./models/createWorkflow/CreateWorkflowInputModel"
import {GetWorkflowsOutputModel} from "./models/getWorkflows/GetWorkflowsOutputModel"
import {GetWorkflowOutputModel} from "./models/getWorkflow/GetWorkflowOutputModel";

export namespace MockComputeService {

    const projectsWorkflows = new Map<string, Map<string, Workflow>>()
    const WORKFLOW_DURATION = 5000

    /**
     * Create a workflow.
     *
     * @param projectId The project id.
     * @param createWorkflowInputModel The create workflow input model.
     * @returns The create workflow output model.
     */
    export async function createWorkflow(
        projectId: string,
        createWorkflowInputModel: CreateWorkflowInputModel
    ): Promise<CreateWorkflowOutputModel> {
        if (!projectsWorkflows.has(projectId))
            projectsWorkflows.set(projectId, new Map<string, GetWorkflowOutputModel>())

        const workflows = projectsWorkflows.get(projectId)
        const workflowId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        workflows!.set(workflowId, {
            workflowId,
            type: createWorkflowInputModel.type,
            name: `Test workflow - ${createWorkflowInputModel.type}`,
            status: "RUNNING",
            logs: {},
            progress: 0,
            data: createWorkflowInputModel.properties as Map<string, string>
        })

        setTimeout(() => {
            workflows!.set(workflowId, {
                workflowId,
                type: createWorkflowInputModel.type,
                name: `Test workflow - ${createWorkflowInputModel.type}`,
                status: "SUCCESS",
                logs: {},
                progress: 100,
                data: createWorkflowInputModel.properties
            })
        }, WORKFLOW_DURATION)

        return {
            workflowId
        }
    }

}