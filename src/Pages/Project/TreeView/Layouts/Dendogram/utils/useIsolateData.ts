import { useEffect, useState } from "react"
import { MockVisualizationService } from "../../../../../../Services/Visualization/MockVisualizationService"
import { Row } from "../../../../../../Services/Visualization/models/getIsolateDataProfiles/GetIsolateDataRowsOutputModel"
import { MAX_INTEGER } from "../../../../TypingData/useTypingData"

/**
 *  This hook is used to get the rows and headers of isolate data.
 *
 * @param projectId The id of the project
* @param isolateDataId The id of the isolate data
 * @returns The rows and headers of isolate data
 */
export function useIsolateData(
    projectId: string,
    isolateDataId: string | null | undefined) {
    const [isolateDataRows, setIsolateDataRows] = useState<Row[] | undefined>(undefined)
    const [loadingIsolateDataRows, setLoadingIsolateDataRows] = useState<Boolean>(true)
    const [isolateDataHeaders, setIsolateDataHeaders] = useState<string[]>([])

    useEffect(() => {
        async function getIsolateDataRows() {
            if (!isolateDataId)
                return

            setLoadingIsolateDataRows(true)
            const isolateData = await MockVisualizationService.getIsolateDataRows(projectId, isolateDataId, MAX_INTEGER, 0)
            setLoadingIsolateDataRows(false)
        }

        getIsolateDataRows()
    }, [isolateDataId])

    useEffect(() => {
        if (!isolateDataId || loadingIsolateDataRows || !isolateDataRows)
            return

        MockVisualizationService.getIsolateDataKeys(projectId, isolateDataId)
            .then(response => {
                setIsolateDataHeaders(response.keys)
            })
    }, [isolateDataId, loadingIsolateDataRows])

    return {
        isolateDataRows,
        loadingIsolateDataRows,
        isolateDataHeaders
    }
}	