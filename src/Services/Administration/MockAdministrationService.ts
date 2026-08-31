import {CreateProjectInputModel} from "./models/projects/createProject/CreateProjectInputModel"
import {CreateProjectOutputModel} from "./models/projects/createProject/CreateProjectOutputModel"
import {GetProjectsOutputModel} from "./models/projects/getProjects/GetProjectsOutputModel"
import {DeleteProjectOutputModel} from "./models/projects/deleteProject/DeleteProjectOutputModel"
import {DeleteTypingDataOutputModel} from "./models/files/deleteTypingData/DeleteTypingDataOutputModel"
import {GetProjectOutputModel, Project} from "./models/projects/getProject/GetProjectOutputModel"
import {DeleteTreeViewOutputModel} from "./models/treeViews/deleteTreeView/DeleteTreeViewOutputModel"
import {DeleteIsolateDataOutputModel} from "./models/files/deleteIsolateData/DeleteIsolateDataOutputModel"
import {CreateDatasetInputModel} from "./models/datasets/createDataset/CreateDatasetInputModel"
import {CreateDatasetOutputModel} from "./models/datasets/createDataset/CreateDatasetOutputModel"
import {GetDatasetOutputModel} from "./models/datasets/getDataset/GetDatasetOutputModel"
import {GetDatasetsOutputModel} from "./models/datasets/getDatasets/GetDatasetsOutputModel"
import {DeleteDatasetOutputModel} from "./models/datasets/deleteDataset/DeleteDatasetOutputModel"
import {UpdateProjectOutputModel} from "./models/projects/updateProject/UpdateProjectOutputModel";
import {UpdateProjectInputModel} from "./models/projects/updateProject/UpdateProjectInputModel";
import {UpdateTreeViewOutputModel} from "./models/treeViews/updateTreeView/UpdateTreeViewOutputModel";
import {UpdateTreeViewInputModel} from "./models/treeViews/updateTreeView/UpdateTreeViewInputModel";
import {UpdateDatasetInputModel} from "./models/datasets/updateDataset/UpdateDatasetInputModel";
import {UpdateDatasetOutputModel} from "./models/datasets/updateDataset/UpdateDatasetOutputModel";
import {
    SetIsolateDataOfDatasetInputModel
} from "./models/datasets/setIsolateDataOfDataset/SetIsolateDataOfDatasetInputModel";
import {
    SetIsolateDataOfDatasetOutputModel
} from "./models/datasets/setIsolateDataOfDataset/SetIsolateDataOfDatasetOutputModel";

export namespace MockAdministrationService {

    export const mockProjects = new Map<string, Project>(
        [
            ["project1", {
                projectId: "project1",
                name: "Project 1",
                description: "Project 1 description",
                owner: "user1",
                datasets: [
                    {
                        datasetId: "dataset1",
                        name: "Dataset 1",
                        description: "Dataset 1 description",
                        typingDataId: "typingData1",
                        isolateDataId: "isolateData1",
                        isolateDataKey: "continent",
                        distanceMatrices: [
                            {
                                distanceMatrixId: "distanceMatrix1",
                                name: "Hamming Distance",
                                sourceType: "function",
                                source: {
                                    function: "hamming"
                                }
                            }
                        ],
                        trees: [
                            {
                                treeId: "tree1",
                                name: "GoeBurst",
                                sourceType: "algorithm_distance_matrix",
                                source: {
                                    algorithm: "goeBURST",
                                    distanceMatrixId: "distanceMatrix1",
                                    parameters: "{ level: 'SLV' }"
                                }
                            },
                            {
                                treeId: "tree2",
                                name: "GoeBurst Dynamic",
                                sourceType: "algorithm_typing_data",
                                source: {
                                    algorithm: "goeBURST",
                                    parameters: "{ level: 'SLV' }"
                                }
                            },
                            {
                                treeId: "tree3",
                                name: "Newick",
                                sourceType: "file",
                                source: {
                                    fileType: "newick",
                                    fileName: "tree2023.tree"
                                }
                            }
                        ],
                        treeViews: [
                            {
                                treeViewId: "treeView1",
                                name: "Tree View 1",
                                layout: "force-directed",
                                source: {
                                    treeId: "tree1"
                                }
                            }
                        ]
                    }
                ],
                files: {
                    typingData: [
                        {
                            typingDataId: "typingData1",
                            name: "Typing Data 1",
                        }
                    ],
                    isolateData: [
                        {
                            isolateDataId: "isolateData1",
                            name: "Isolate Data 1",
                            keys: ["id", "isolate", "aliases", "country", "continent", "region", "town_or_city",
                                "year", "month", "isolation_date", "received_date", "age_yr", "age_mth", "sex"]
                        }
                    ]
                }
            }
            ]
        ]
    )
    const DELAY = 1000

    /**
     * Gets all projects belonging to a certain user.
     *
     * @return the projects
     */
    export async function getProjects(): Promise<GetProjectsOutputModel> {
        return new Promise(resolve => setTimeout(resolve, DELAY))
            .then(() => ({
                projects: Array.from(mockProjects.values()).map(project => ({
                    projectId: project.projectId,
                    name: project.name,
                    description: project.description
                }))
            }))
    }

    /**
     * Gets a project.
     *
     * @param projectId the id of the project to be retrieved
     * @return the project
     */
    export async function getProject(
        projectId: string
    ): Promise<GetProjectOutputModel> {
        return mockProjects.get(projectId)!
    }

    /**
     * Creates a project.
     *
     * @param createProjectInputModel the project to be created following the CreateProjectModel format
     * @return a promise that resolves to the created project information
     */
    export async function createProject(
        createProjectInputModel: CreateProjectInputModel
    ): Promise<CreateProjectOutputModel> {
        const projectId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

        mockProjects.set(projectId, {
            projectId: projectId,
            name: createProjectInputModel.name,
            description: createProjectInputModel.description,
            owner: "user1",
            datasets: [],
            files: {
                typingData: [],
                isolateData: []
            }
        })

        return {
            projectId
        }
    }

    /**
     * Deletes a project.
     *
     * @param projectId   the id of the project to be deleted
     * @return a promise that resolves to the deleted project information
     */
    export async function deleteProject(
        projectId: string
    ): Promise<DeleteProjectOutputModel> {
        mockProjects.delete(projectId)

        return {
            projectId
        }
    }

    /**
     * Updates a project.
     *
     * @param projectId the id of the project to be updated
     * @param updateProjectInputModel the project to be updated following the UpdateProjectModel format
     * @return a promise that resolves to the updated project information
     */
    export async function updateProject(
        projectId: string,
        updateProjectInputModel: UpdateProjectInputModel
    ): Promise<UpdateProjectOutputModel> {
        const project = mockProjects.get(projectId)!

        project.name = updateProjectInputModel.name
        project.description = updateProjectInputModel.description

        return {
            name: project.name,
            description: project.description
        }
    }

    /**
     * Deletes a typing data file.
     *
     * @param projectId the name of the project to which the typing data will be deleted
     * @param typingDataId   the id of the typing data to be deleted
     */
    export async function deleteTypingData(
        projectId: string,
        typingDataId: string
    ): Promise<DeleteTypingDataOutputModel> {
        mockProjects.get(projectId)!.files.typingData = mockProjects.get(projectId)!.files.typingData.filter(
            typingData => typingData.typingDataId !== typingDataId
        )

        return {
            projectId,
            typingDataId
        }
    }

    /**
     * Deletes an isolate data file.
     *
     * @param projectId the name of the project to which the isolate data will be deleted
     * @param isolateDataId   the id of the isolate data to be deleted
     * @return a promise that resolves to the deleted isolate data information
     */
    export async function deleteIsolateData(
        projectId: string,
        isolateDataId: string
    ): Promise<DeleteIsolateDataOutputModel> {
        mockProjects.get(projectId)!.files.isolateData = mockProjects.get(projectId)!.files.isolateData.filter(
            isolateData => isolateData.isolateDataId !== isolateDataId
        )

        return {
            projectId,
            isolateDataId
        }
    }


    /**
     * Deletes a tree view.
     *
     * @param projectId the name of the project to which the tree view will be deleted
     * @param datasetId the id of the dataset to which the tree view will be deleted
     * @param treeViewId the id of the tree view to be deleted
     * @return a promise that resolves to the deleted tree view information
     */
    export async function deleteTreeView(
        projectId: string,
        datasetId: string,
        treeViewId: string
    ): Promise<DeleteTreeViewOutputModel> {
        mockProjects.get(projectId)!.datasets = mockProjects.get(projectId)!.datasets.map(dataset => {
            if (dataset.datasetId === datasetId) {
                dataset.treeViews = dataset.treeViews.filter(treeView => treeView.treeViewId !== treeViewId)
            }
            return dataset
        })

        return {
            projectId,
            datasetId,
            treeViewId
        }
    }

    /**
     * Updates a tree view.
     *
     * @param projectId    the id of the project that contains the tree view
     * @param datasetId    the id of the dataset that contains the tree view
     * @param treeViewId the id of the tree view to be updated
     * @param updateTreeViewInputModel the tree view to be updated following the UpdateTreeViewModel format
     * @return information about the updated tree view
     */
    export async function updateTreeView(
        projectId: string,
        datasetId: string,
        treeViewId: string,
        updateTreeViewInputModel: UpdateTreeViewInputModel
    ): Promise<UpdateTreeViewOutputModel> {
        const treeView = mockProjects.get(projectId)!.datasets
            .find(dataset => dataset.datasetId === datasetId)!
            .treeViews.find(treeView => treeView.treeViewId === treeViewId)!

        treeView.name = updateTreeViewInputModel.name

        return {
            name: treeView.name
        }
    }

    /**
     * Create a dataset.
     *
     * @param projectId the name of the project to which the dataset will be created
     * @param createDatasetInputModel the input model for creating a dataset
     * @return a promise that resolves to the created dataset information
     */
    export async function createDataset(
        projectId: string,
        createDatasetInputModel: CreateDatasetInputModel
    ): Promise<CreateDatasetOutputModel> {
        const datasetId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        mockProjects.get(projectId)!.datasets.push({
            datasetId,
            name: createDatasetInputModel.name,
            description: createDatasetInputModel.description,
            typingDataId: createDatasetInputModel.typingDataId,
            isolateDataId: createDatasetInputModel.isolateDataId,
            isolateDataKey: createDatasetInputModel.isolateDataKey,
            distanceMatrices: [],
            trees: [],
            treeViews: []
        })

        return {
            projectId,
            datasetId
        }
    }

    /**
     * Get a dataset.
     *
     * @param projectId the name of the project to which the dataset belongs
     * @param datasetId the id of the dataset to be retrieved
     * @return a promise that resolves to the retrieved dataset information
     */
    export async function getDataset(
        projectId: string,
        datasetId: string
    ): Promise<GetDatasetOutputModel> {
        return mockProjects.get(projectId)!.datasets.find(dataset => dataset.datasetId === datasetId)!
    }

    /**
     * Get a list of datasets.
     *
     * @param projectId the name of the project to which the datasets belong
     * @return a promise that resolves to the retrieved list of datasets
     */
    export async function getDatasets(
        projectId: string
    ): Promise<GetDatasetsOutputModel> {
        return {
            datasets: mockProjects.get(projectId)!.datasets
        }
    }

    /**
     * Delete a dataset.
     *
     * @param projectId the name of the project to which the dataset belongs
     * @param datasetId the id of the dataset to be deleted
     * @return a promise that resolves to the deleted dataset information
     */
    export async function deleteDataset(
        projectId: string,
        datasetId: string
    ): Promise<DeleteDatasetOutputModel> {
        mockProjects.get(projectId)!.datasets = mockProjects.get(projectId)!.datasets.filter(
            dataset => dataset.datasetId !== datasetId
        )

        return {
            projectId,
            datasetId
        }
    }

    /**
     * Updates a dataset.
     *
     * @param projectId the id of the project to which the dataset belongs
     * @param datasetId the id of the dataset to be updated
     * @param inputModel the input model with the dataset information to be updated
     * @return information about the update
     */
    export async function updateDataset(
        projectId: string,
        datasetId: string,
        inputModel: UpdateDatasetInputModel
    ): Promise<UpdateDatasetOutputModel> {
        const dataset = mockProjects.get(projectId)!.datasets.find(dataset => dataset.datasetId === datasetId)!

        dataset.name = inputModel.name
        dataset.description = inputModel.description

        return {
            name: dataset.name,
            description: dataset.description
        }
    }

    /**
     * Sets the isolate data of a dataset.
     *
     * @param projectId  the id of the project to which the dataset belongs
     * @param datasetId  the id of the dataset to be updated
     * @param inputModel the input model with the isolate data information to be set
     * @return information about the update
     */
    export async function setIsolateDataOfDataset(
        projectId: string,
        datasetId: string,
        inputModel: SetIsolateDataOfDatasetInputModel
    ): Promise<SetIsolateDataOfDatasetOutputModel> {
        const dataset = mockProjects.get(projectId)!.datasets.find(dataset => dataset.datasetId === datasetId)!

        const isolateData = mockProjects.get(projectId)!.files.isolateData.find(isolateData => isolateData.isolateDataId === inputModel.isolateDataId)

        if (!isolateData) {
            throw new Error('Isolate data not found')
        }

        if(isolateData.keys.indexOf(inputModel.isolateDataKey) === -1) {
            throw new Error('Isolate data key not found')
        }

        dataset.isolateDataId = inputModel.isolateDataId
        dataset.isolateDataKey = inputModel.isolateDataKey

        return {
            isolateDataId: dataset.isolateDataId,
            isolateDataKey: dataset.isolateDataKey
        }
    }
}
