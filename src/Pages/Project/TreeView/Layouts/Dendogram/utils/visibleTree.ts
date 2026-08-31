import { ParseNewickOutputModel } from "../../../../../../Services/Visualization/models/parseNewick/ParseNewickOutputModel"

export function countTreeNodes(tree: any): number {
  if (!tree) return 0;

  let totalNodes = 0;

  function countNode(currentNode: any) {
    totalNodes++;

    for (const childNode of currentNode.children ?? []) {
      countNode(childNode);
    }
  }

  countNode(tree);

  return totalNodes;
}

export function createSubtreeNode(node: any): any {
  const totalNodes = (node.metadata?.descendantCount ?? 0) + 1;
  const leafCount = node.metadata?.leafCount ?? 0;

  if (leafCount === 1) {
    return {
      ...node,
      metadata: {
        ...(node.metadata ?? {}),
        isVirtualSubtree: false,
        originalNodeId: node.id,
        totalNodes,
      },
      collapsed: false,
    };
  }

  return {
    ...node,
    id: node.id,
    name: `Subtree (${totalNodes})`,
    metadata: {
      ...(node.metadata ?? {}),
      isVirtualSubtree: true,
      originalNodeId: node.id,
      totalNodes,
    },
    collapsed: true,
    children: [],
  };
}

export function collapseNodeToVirtualSubtree(
  tree: any,
  nodeId: string
): any {
  function visit(currentNode: any): any {
    if (currentNode.id === nodeId) {
      return createSubtreeNode(currentNode);
    }

    return {
      ...currentNode,
      children: (currentNode.children ?? []).map((childNode: any) =>
        visit(childNode)
      ),
    };
  }

  return visit(tree);
}

export function limitTreeNodes(
  root: ParseNewickOutputModel,
  maxNodes: number,
  subtreeThreshold = Number(process.env.SUBTREE_THRESHOLD),
  forceExpandedIds: Set<string> = new Set(),
  mode: "initial" | "expand" = "expand",
): ParseNewickOutputModel {
  let renderedCount = 0;

  function buildLimitedTree(node: any, isRoot = false): any {
    if (renderedCount >= maxNodes) {
      return createSubtreeNode(node);
    }

    renderedCount++;

    const children = node.children ?? [];
    const totalNodes = (node.metadata?.descendantCount ?? 0) + 1;

    if (mode === "expand" && !isRoot && totalNodes > subtreeThreshold && !forceExpandedIds.has(node.id)) {
      return createSubtreeNode(node);
    }

    return {
      ...node,
      metadata: {
        ...(node.metadata ?? {}),
        isVirtualSubtree: false,
        totalNodes,
      },
      children: children.map((child: any) => {
        if (renderedCount >= maxNodes) {
          return createSubtreeNode(child);
        }

        const limitedChild = buildLimitedTree(child, false);

        if (renderedCount > maxNodes) {
          return createSubtreeNode(child);
        }

        return limitedChild;
      }),
    };
  }

  return buildLimitedTree(root, true);
}
