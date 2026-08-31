import { ParseNewickOutputModel } from "../../../../../../Services/Visualization/models/parseNewick/ParseNewickOutputModel"

export function limitTreeNodes(
  root: ParseNewickOutputModel,
  maxNodes: number,
  subtreeThreshold = Number(process.env.SUBTREE_THRESHOLD),
  forceExpandedIds: Set<string> = new Set(),
  mode: "initial" | "expand" = "expand",
): ParseNewickOutputModel {
  let renderedCount = 0;

  function createVirtualSubtreeNode(node: any): any {
    renderedCount++;
    const totalNodes = (node.metadata?.descendantCount ?? 0) + 1;

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

  function buildLimitedTree(node: any, isRoot = false): any {

    renderedCount++;

    const children = node.children ?? [];
    const totalNodes = (node.metadata?.descendantCount ?? 0) + 1;


    if (mode === "expand" && !isRoot && totalNodes > subtreeThreshold && !forceExpandedIds.has(node.id)) {
      return createVirtualSubtreeNode(node);
    }

    return {
      ...node,
      metadata: {
        ...(node.metadata ?? {}),
        isVirtualSubtree: false,
        totalNodes,
      },
      children: children
        .map((child: any) => {
          if (renderedCount >= maxNodes) {
            return createVirtualSubtreeNode(child);
          }

          return buildLimitedTree(child, false);
        }),
    };
  }

  return buildLimitedTree(root, true);
}