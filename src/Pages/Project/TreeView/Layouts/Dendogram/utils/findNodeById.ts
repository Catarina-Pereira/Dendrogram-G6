import { ParseNewickOutputModel } from "../../../../../../Services/Visualization/models/parseNewick/ParseNewickOutputModel"

export function findNodeById(node: ParseNewickOutputModel, id: string): ParseNewickOutputModel | null {

    if (node.id === id) {
        return node;
    }

    for (const child of node.children ?? []) {
        const foundNode = findNodeById(child, id);
        if (foundNode) {
            return foundNode;
        }
    }

    return null;
}
