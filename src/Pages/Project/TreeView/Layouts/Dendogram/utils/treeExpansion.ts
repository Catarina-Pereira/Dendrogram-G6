import { AdjCache } from "./buildAdjCache"
import { countTreeNodes, createSubtreeNode, limitTreeNodes } from "./visibleTree"

export function expandNodeByRadius(
  visibleTree: any,
  fullNode: any,
  nodeId: string,
  subtreeThreshold = 500,
  availableSlots: number = Number.MAX_SAFE_INTEGER
): any {

  const totalNodes = (fullNode.metadata?.descendantCount ?? 0) + 1;

  function cloneSubtree(node: any): any {
    const childNodes = node.children ?? [];
    const nodeTotalNodes = (node.metadata?.descendantCount ?? 0) + 1;

    return {
      ...node,
      metadata: {
        ...(node.metadata ?? {}),
        isVirtualSubtree: false,
        originalNodeId: node.id,
        totalNodes: nodeTotalNodes,
      },
      collapsed: false,
      children: childNodes.map((childNode: any) => cloneSubtree(childNode)),
    };
  }

  function createExpandedNode(currentVisibleNode: any): any {
    const currentVisibleChildren = currentVisibleNode.children ?? [];

    const visibleChildren = new Map<string, any>(
      currentVisibleChildren.map((childNode: any) => [
        childNode.id,
        childNode,
      ]),
    );

    const openSubtree = totalNodes <= subtreeThreshold && totalNodes <= availableSlots;

    if (openSubtree) {
      return {
        ...cloneSubtree(fullNode),
        metadata: {
          ...(fullNode.metadata ?? {}),
          isVirtualSubtree: false,
          originalNodeId: fullNode.id,
          totalNodes,
        },
        collapsed: false,
      };
    }

    return {
      ...currentVisibleNode,
      name: fullNode.name ?? currentVisibleNode.name,
      metadata: {
        ...(fullNode.metadata ?? {}),
        isVirtualSubtree: false,
        originalNodeId: fullNode.id,
        totalNodes,
      },
      collapsed: false,
      children: (fullNode.children ?? []).map((childNode: any) => {
        const visibleChild = visibleChildren.get(childNode.id);

        if (visibleChild && visibleChild.metadata?.isVirtualSubtree === false) {
          return visibleChild;
        }

        return createSubtreeNode(childNode);
      }),
    };
  }

  function replaceNode(currentNode: any): any {
    if (currentNode.id === nodeId) {
      return createExpandedNode(currentNode);
    }

    return {
      ...currentNode,
      children: (currentNode.children ?? []).map((childNode: any) =>
        replaceNode(childNode),
      ),
    };
  }
  return replaceNode(visibleTree);
}

export function createTreeExpansionManager(
  cache: AdjCache | null,
  options?: {
    maxVisibleNodes?: number;
    subtreeThreshold?: number;
  },
) {
  const maxVisibleNodes = options?.maxVisibleNodes ?? 1000;
  const subtreeThreshold = options?.subtreeThreshold ?? 500;

  function handleExpand(args: {
    visibleTree: any;
    fullNode: any;
    nodeId: string;
    maxVisibleNodes?: number;
    forceExpandedIds?: Set<string>
  }) {
    const { visibleTree, fullNode, nodeId } = args;
    const limit = args.maxVisibleNodes ?? maxVisibleNodes;
    const currentVisibleNodes = countTreeNodes(visibleTree);
    const availableSlots = Math.max(0, limit - currentVisibleNodes);

    const expandedTree = expandNodeByRadius(
      visibleTree,
      fullNode,
      nodeId,
      subtreeThreshold,
      availableSlots,
    );

    const forceExpandedIds = new Set<string>(
      Array.from(args.forceExpandedIds ?? []),
    );

    forceExpandedIds.add(nodeId);
    forceExpandedIds.add(fullNode.id);

    return limitTreeNodes(
      expandedTree,
      limit,
      subtreeThreshold,
      forceExpandedIds,
    );
  }

  return {
    handleExpand,
  };
}
