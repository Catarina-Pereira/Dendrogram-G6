import * as React from "react"
import { Graph, treeToGraphData } from "@antv/g6"
import { ParseNewickOutputModel } from "../../../../../../Services/Visualization/models/parseNewick/ParseNewickOutputModel"
import { findNodeById } from "./findNodeById"
import { collapseNodeToVirtualSubtree, countTreeNodes, } from "./visibleTree"

export function useDendogramController(
  graphRef: React.MutableRefObject<Graph | null>,
  fullTreeRef: React.MutableRefObject<ParseNewickOutputModel | null>,
  treeExpansionManagerRef: React.MutableRefObject<any>,
  maxVisibleNodes: number,
) {
  const expandedIdsRef = React.useRef<Set<string>>(new Set);
  const lastHighlightedNodeRef = React.useRef<string | null>(null);

  const [treeError, setTreeError] = React.useState<string | null>(null);

  function clearTreeError() {
    setTreeError(null);
  }

  function highlightNodeAfterRender(nodeId: string) {
    setTimeout(() => {
      const graph = graphRef.current;

      if (!graph) return;

      if (lastHighlightedNodeRef.current) {
        graph.setElementState(lastHighlightedNodeRef.current, []);
      }

      graph.setElementState(nodeId, "highlight");

      lastHighlightedNodeRef.current = nodeId;
    }, 0);
  }

  function renderTreeAndFocusNode(tree: any, nodeId: string) {
    const graph = graphRef.current;

    if (!graph) return;

    graph.once("afterrender", () => {
      graph.focusElement(nodeId, { duration: 0 });

      highlightNodeAfterRender(nodeId);
    });

    graph.setData(treeToGraphData(tree));
    graph.render();
  }

  function collectVisibleOpenNodeIds(tree: any): Set<string> {
    const ids = new Set<string>();

    function visit(node: any) {
      const children = node.children ?? [];
      const isVirtual = node.metadata?.isVirtualSubtree === true;

      if (!isVirtual && children.length > 0) {
        ids.add(node.id);
      }

      children.forEach(visit);
    }

    visit(tree);

    return ids;
  }

  const handleExpand = React.useCallback((
    nodeId: string,
    previousTree: ParseNewickOutputModel | null): ParseNewickOutputModel | null => {

    if (!treeExpansionManagerRef.current) return previousTree;
    if (!fullTreeRef.current) return previousTree;

    if (!previousTree) return previousTree;
    const clickedNode = findNodeById(previousTree, nodeId) as any;
    const clickedChildren = clickedNode?.children ?? [];
    const isOpenSubtree = clickedNode && clickedNode.metadata?.isVirtualSubtree !== true && clickedChildren.length > 0;

    if (isOpenSubtree) {
      const collapsedTree = collapseNodeToVirtualSubtree(previousTree, nodeId);
      expandedIdsRef.current.delete(nodeId);

      clearTreeError();

      renderTreeAndFocusNode(collapsedTree, nodeId);
      return collapsedTree;
    }

    const currentVisibleNodes = countTreeNodes(previousTree);
    const availableSlots = Math.max(0, maxVisibleNodes - currentVisibleNodes);

    if (availableSlots <= 0) {

      setTreeError(`Maximum number of visible nodes reached (${maxVisibleNodes}). Collapse a subtree before expanding another one.`);

      return previousTree;
    }

    const realNodeId = clickedNode?.metadata?.originalNodeId ?? nodeId;
    const fullNode = findNodeById(fullTreeRef.current, realNodeId);

    if (!fullNode) return previousTree;

    expandedIdsRef.current.add(realNodeId);

    const forceExpandedIds = collectVisibleOpenNodeIds(previousTree);

    expandedIdsRef.current.forEach((id) => {
      forceExpandedIds.add(id);
    });

    forceExpandedIds.add(realNodeId);
    forceExpandedIds.add(nodeId);

    const finalTree = treeExpansionManagerRef.current.handleExpand({
      visibleTree: previousTree, fullNode, nodeId, maxVisibleNodes, forceExpandedIds,
    });

    renderTreeAndFocusNode(finalTree, nodeId);
    return finalTree;
  }, [fullTreeRef, treeExpansionManagerRef, expandedIdsRef, maxVisibleNodes, renderTreeAndFocusNode, setTreeError]);

  return {
    handleExpand,
    treeError,
    clearTreeError,
  };
}

export function collectVisibleNodeIds(tree: any): Set<string> {
  const ids = new Set<string>();

  function visit(node: any) {
    if (!node) return;

    const isVirtual = node.metadata?.isVirtualSubtree === true;

    if (!isVirtual && node.id !== undefined && node.id !== null) {
      ids.add(node.id);
    }

    (node.children ?? [].forEach(visit));
  }

  visit(tree);

  return ids;
}

export function collectVisibleLeafIds(tree: any): Set<string> {
  const ids = new Set<string>();

  function visit(node: any) {
    if (!node) return;

    const children = node.children ?? [];
    const isVirtual = node.metadata?.isVirtualSubtree === true;
    const isLeaf = children.length === 0;

    if (isLeaf && !isVirtual && node.id !== undefined && node.id !== null) {
      ids.add(node.id);
    }

    children.forEach(visit);
  }

  visit(tree);

  return ids;
}
