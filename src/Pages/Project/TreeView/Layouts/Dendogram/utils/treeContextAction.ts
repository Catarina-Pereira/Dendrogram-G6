import { ParseNewickOutputModel } from "../../../../../../Services/Visualization/models/parseNewick/ParseNewickOutputModel"
import { AdjCache } from "./buildAdjCache"
import { findNodeById } from "./findNodeById"
import { createSubtreeNode, limitTreeNodes, } from "./visibleTree"

export type TreeContextAction = | "show-tree-from-node" | "show-previous-level";

interface HandleTreeContextActionParams {
  action: TreeContextAction;
  nodeId: string;
  fullTree: ParseNewickOutputModel | null;
  visibleTree: ParseNewickOutputModel | null;
  cache: AdjCache | null;
  initialVisibleNodes: number;
  maxVisibleNodes: number;
  applyTreeView: (nextTree: ParseNewickOutputModel | null) => void;
}

function showTreeFromNode(
  fullTree: ParseNewickOutputModel,
  nodeId: string,
  initialVisibleNodes: number,
  applyTreeView: (nextTree: ParseNewickOutputModel | null) => void
): void {
  const subtree = findNodeById(fullTree, nodeId);

  if (!subtree) {
    return;
  }

  const limitedSubtree = limitTreeNodes(
    structuredClone(subtree),
    initialVisibleNodes,
    Number(process.env.SUBTREE_THRESHOLD),
    new Set(),
    "initial",
  );

  applyTreeView(limitedSubtree);
}

function showPreviousLevel(
  fullTree: ParseNewickOutputModel,
  visibleTree: ParseNewickOutputModel,
  cache: AdjCache,
  nodeId: string,
  maxVisibleNodes: number,
  applyTreeView: (nextTree: ParseNewickOutputModel | null) => void
): void {
  const parentId = cache.parentOf.get(nodeId);

  if (!parentId) {
    return;
  }

  const parentNode = findNodeById(fullTree, parentId);

  const currentVisibleBranch = findNodeById(visibleTree, nodeId);

  if (!parentNode || !currentVisibleBranch) {
    return;
  }

  const parentCopy = structuredClone(parentNode);
  const siblings = parentCopy.children ?? [];

  const slotsForCurrentBranch = Math.max(1, maxVisibleNodes - 1 - (siblings.length - 1));

  const limitedCurrentBranch = limitTreeNodes(
    structuredClone(currentVisibleBranch),
    slotsForCurrentBranch,
    Number(process.env.SUBTREE_THRESHOLD),
    new Set(),
    "initial",
  );

  parentCopy.children = siblings.map((child) => {
    if (child.id === nodeId) {
      return limitedCurrentBranch;
    }

    return createSubtreeNode(child);
  });

  const safeTree = limitTreeNodes(
    parentCopy,
    maxVisibleNodes,
    Number(process.env.SUBTREE_THRESHOLD),
    new Set([nodeId, parentId]),
    "initial",
  );

  applyTreeView(safeTree);
}

export function handleTreeContextAction({
  action,
  nodeId,
  fullTree,
  visibleTree,
  cache,
  initialVisibleNodes,
  maxVisibleNodes,
  applyTreeView
}: HandleTreeContextActionParams): void {
  if (!fullTree || !visibleTree || !cache) {
    return;
  }

  if (action === "show-tree-from-node") {
    showTreeFromNode(fullTree, nodeId, initialVisibleNodes, applyTreeView);
    return;
  }

  if (action === "show-previous-level") {
    showPreviousLevel(fullTree, visibleTree, cache, nodeId, maxVisibleNodes, applyTreeView);
  }
}
