import { ParseNewickOutputModel } from "./models/parseNewick/ParseNewickOutputModel"
import { parseNewick } from "../../Pages/Project/TreeView/Layouts/Dendogram/utils/parseNewick"

export namespace NewickVisualization {

    /**
     * Get the newick data.
     *
     * @param projectId The project id.
     * @param treeDataId The tree data id.
     * @return The tree in ParseNewickOutputModel format.
     */
    export function getNewickData(
        newickText: string
    ): ParseNewickOutputModel {
        return parseNewick(newickText);
    }
}
