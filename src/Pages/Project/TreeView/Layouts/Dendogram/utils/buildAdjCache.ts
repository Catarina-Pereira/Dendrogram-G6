import { ParseNewickOutputModel } from "../../../../../../Services/Visualization/models/parseNewick/ParseNewickOutputModel"

export interface AdjCache {
  childrenOf: Map<string, string[]>;
  parentOf: Map<string, string | null>;
  depthOf: Map<string, number>;
  nodesAtDepth: Map<number, string[]>;
}

export function buildAdjCache(root: ParseNewickOutputModel): AdjCache {
  const childrenOf = new Map<string, string[]>();
  const parentOf = new Map<string, string | null>();
  const depthOf = new Map<string, number>();
  const nodesAtDepth = new Map<number, string[]>();

  function buildRelations(
    node: ParseNewickOutputModel,
    parentId: string | null,
    depth: number,
  ) {
    if (!node.id) return;

    const nodeId = node.id;
    const children = node.children ?? [];

    childrenOf.set(nodeId,
      children.map((child) => child.id).filter(Boolean).map(String),
    );

    parentOf.set(nodeId, parentId);
    depthOf.set(nodeId, depth);

    const currentDepthNodes = nodesAtDepth.get(depth) ?? [];
    currentDepthNodes.push(nodeId);
    nodesAtDepth.set(depth, currentDepthNodes);

    children.forEach((child) => {
      buildRelations(child, nodeId, depth + 1);
    });
  }

  buildRelations(root, null, 0);

  return {
    childrenOf,
    parentOf,
    depthOf,
    nodesAtDepth,
  };
}
