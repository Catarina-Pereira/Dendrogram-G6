/**
 * Contains the URIs of the Web UI.
 */
export namespace WebUiUris {
    export const HOME = "/"
    export const ABOUT = "/about"
    export const NEWS = "/news"
    export const API_INFO = "/api-info"
    export const NEW_PROJECT = "/new-project"
    export const OPEN_PROJECT = "/open-project"

    export const GET_STARTED = "https://github.com/bodybuilders-team/phyloviz-web-platform/wiki/getting-started"

    export const PROJECT = "/projects/:projectId"
    export const EDIT_PROJECT = `${PROJECT}/edit`
    export const CREATE_DATASET = `${PROJECT}/create-dataset`
    export const UPLOAD_FILES = `${PROJECT}/upload-files`


    export const TYPING_DATA = `${PROJECT}/typing-data/:typingDataId`
    export const ISOLATE_DATA = `${PROJECT}/isolate-data/:isolateDataId`

    export const DATASET = `${PROJECT}/datasets/:datasetId`
    export const EDIT_DATASET = `${DATASET}/edit`

    export const COMPUTE = `${DATASET}/compute`
    export const COMPUTE_TREE_VIEW = `${COMPUTE}/tree-view`


    export const COMPUTE_DENDOGRAM = `${COMPUTE_TREE_VIEW}/dendogram`

    export const project = (projectId: string) => `/projects/${projectId}`
    export const editProject = (projectId: string) => `/projects/${projectId}/edit`
    export const createDataset = (projectId: string) => `/projects/${projectId}/create-dataset`
    export const uploadFiles = (projectId: string) => `/projects/${projectId}/upload-files`


    export const typingData = (projectId: string, typingDataId: string) => `/projects/${projectId}/typing-data/${typingDataId}`
    export const isolateData = (projectId: string, isolateDataId: string) => `/projects/${projectId}/isolate-data/${isolateDataId}`

    export const dataset = (projectId: string, datasetId: string) => `/projects/${projectId}/datasets/${datasetId}`
    export const editDataset = (projectId: string, datasetId: string) => `/projects/${projectId}/datasets/${datasetId}/edit`

    export const computeDendogram = (projectId: string, datasetId: string) => `/projects/${projectId}/datasets/${datasetId}/compute/tree-view/dendogram`

}
