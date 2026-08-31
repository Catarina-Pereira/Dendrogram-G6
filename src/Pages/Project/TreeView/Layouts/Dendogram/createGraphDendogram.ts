import { Graph, treeToGraphData } from "@antv/g6"
import { NodeEvent } from "@antv/g6"


export default function createGraphDendogram(
  container: HTMLDivElement,
  treeData: any,
  options?: {
    onNodeExpand?: (nodeId: string) => void;
    onNodeContextAction?: (action: string, nodeId: string) => void;
  }
): Graph {
  let contextNodeId: string | null = null;
  const graphData = treeToGraphData(treeData);
  const nodeSize = 20;


  const graph = new Graph({
    container: container,
    data: graphData,
    animation: false,
    node: {
      style: {
        labelText: (d: any) => {
          const children = d.children;
          const isLeaf = !children || children.length === 0;
          if ((d.id).startsWith("virtual-depth-root-")) {
            return d.name;
          }
          return isLeaf ? (d.name ?? '') : '';
        },
        labelPlacement: (d) => ("right"),
        labelBackground: true,
        size: nodeSize,
        fill: (d: any) => {
          const isCollapsed = (d.collapsed === true)
          return isCollapsed ? "#f39c12" : "#277BC0";
        },
      },
      animation: {
        enter: false,
      },
    },
    edge: {
      type: 'polyline',
      style: {
        router: {
          type: 'orth',
        },
      },
    },
    layout: {
      type: 'dendrogram',
      direction: 'LR',
      nodeSep: 36,
      rankSep: 250,
    },
    behaviors: ['drag-canvas', 'zoom-canvas'],
    plugins: [{
      type: 'contextmenu',
      trigger: 'contextmenu',
      getItems: (event: any) => {
        const target = event?.target;
        contextNodeId = target?.id ?? null;
        return [
          { name: "Show tree from this node", value: "show-tree-from-node" },
          { name: "Show previous level", value: "show-previous-level" },
        ];
      },
      onClick: (value: string) => {
        if (!contextNodeId) return;
        options?.onNodeContextAction?.(value, contextNodeId);
      },
      enable: (event: any) => event.targetType === "node",
    },
    ],
  });

  graph.render();

  graph.on(NodeEvent.DBLCLICK, (evt) => {
    const target = (evt as any).target;

    if (!target?.id) return;

    const nodeId = target.id;

    options?.onNodeExpand?.(nodeId);
  });

  return graph;
} 