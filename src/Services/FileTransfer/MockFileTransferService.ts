import { UploadTypingDataOutputModel } from "./models/uploadTypingData/UploadTypingDataOutputModel"
import { UploadIsolateDataOutputModel } from "./models/uploadIsolateData/UploadIsolateDataOutputModel"
import { MockAdministrationService } from "../Administration/MockAdministrationService"
import { TypingDataType } from "../../Pages/Project/CreateDataset/useCreateDataset"

export namespace MockFileTransferService {

    import mockProjects = MockAdministrationService.mockProjects;

    /** 
 * Uploads a typing data file to a project.
 *
 * @param projectId the name of the project to which the typing data will be uploaded
 * @param file the file to be uploaded
 * @param typingDataType the type of typing data to be uploaded
 * @return a promise that resolves to the uploaded typing data information
*/
    export async function uploadTypingData(
        projectId: string,
        file: File,
        typingDataType: TypingDataType
    ): Promise<UploadTypingDataOutputModel> {
        const typingDataId = file.name.replace(/\.[^/.]+$/, '');
        const filename = file.name.replace(/\.[^/.]+$/, '');
        const content = await file.text();
        const project = mockProjects.get(projectId);

        if (!project) {
            throw new Error(`Project with Id ${projectId} not found.`);
        }

        if (!project.files) {
            throw new Error(`Files missing in project.`);
        }

        project.files.typingData.push({
            typingDataId,
            name: filename,
            content,
        });


        return {
            projectId,
            typingDataId
        };
    }


    /**
     * Downloads the contents of a typing data file.
     *
     * @param projectId the name of the project the typing data belongs to
     * @param typingDataId the id of the typing data to be downloaded
     * @return a promise that resolves to the contents of the typing data file
     */
    export async function downloadTypingData(
        projectId: string,
        typingDataId: string
    ): Promise<any> {
        const project = mockProjects.get(projectId);
        const typingData = project?.files?.typingData?.find(
            (data) => data.typingDataId === typingDataId
        );

        return typingData?.content;
    }

    /**
     * Uploads an isolate data file to a project.
     *
     * @param projectId the name of the project to which the isolate data will be uploaded
     * @param file the file to be uploaded
     * @return a promise that resolves to the uploaded isolate data information
     */
    export async function uploadIsolateData(
        projectId: string,
        file: File
    ): Promise<UploadIsolateDataOutputModel> {
        const isolateDataId = file.name.replace(/\.[^/.]+$/, '');
        const filename = file.name.replace(/\.[^/.]+$/, '');
        const content = await file.text();
        const firstLine = content.trim().split("\n")[0];
        const keys = firstLine.split("\t");


        mockProjects.get(projectId)!.files.isolateData.push({
            isolateDataId,
            name: filename,
            keys: keys,
            content: content
        });

        return {
            projectId,
            isolateDataId
        }
    }

    /**
     * Downloads the contents of an isolate data file.
     * 
     * @param projectId the name of the project the isolate data belongs to
     * @param isolateDataId the id of the isolate data to be downloaded
     * @return a promise that resolves to the contents of the isolate data file
     */
    export async function downloadIsolateData(
        projectId: string,
        isolateDataId: string
    ): Promise<any> {
        const project = mockProjects.get(projectId);
        const isolateData = project?.files?.isolateData?.find(
            (data) => data.isolateDataId === isolateDataId
        );

        return isolateData?.content;
    }
}

