import { ParseNewickOutputModel } from "../../../../../../Services/Visualization/models/parseNewick/ParseNewickOutputModel"

export function annotateTreeMetadata(treeRoot: any): any {
  function annotateTreeNode(currentNode: any, currentDepth: number): any {
    const childNodes = currentNode.children ?? [];

    let descendantCount = 0;
    let leafCount = 0;

    const annotatedChildNodes = childNodes.map((childNode: any) => {
      const annotatedChildNode = annotateTreeNode(childNode, currentDepth + 1);

      descendantCount += 1 + (annotatedChildNode.metadata?.descendantCount ?? 0);

      leafCount += annotatedChildNode.metadata?.leafCount ?? 0;

      return annotatedChildNode;
    });

    if (annotatedChildNodes.length === 0) {
      leafCount = 1;
    }

    return {
      ...currentNode,
      metadata: {
        ...(currentNode.metadata ?? {}),
        depth: currentDepth,
        descendantCount,
        leafCount,
        isLeafNode: annotatedChildNodes.length === 0,
      },
      children: annotatedChildNodes,
    };
  }

  return annotateTreeNode(treeRoot, 0);
}

export function findNodeById(currentNode: ParseNewickOutputModel, targetNodeId: string): ParseNewickOutputModel | null {
  if (currentNode.id === targetNodeId) {
    return currentNode;
  }

  for (const childNode of currentNode.children ?? []) {
    const foundNode = findNodeById(childNode, targetNodeId);

    if (foundNode) {
      return foundNode;
    }
  }

  return null;
}
