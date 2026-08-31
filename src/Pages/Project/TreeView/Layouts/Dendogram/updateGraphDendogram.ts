import { Graph, treeToGraphData } from "@antv/g6"
import { TreeViewNodePropertiesOptionsProps } from "../../../../../Components/Project/TreeView/TreeViewNodeEdgePropertiesOption"
import { TreeData } from "@antv/g6"

interface ChangeProps {
  nodeSize?: boolean,
  labelSize?: boolean,
  showLabel?: boolean,
  edgeSize?: boolean,
  selectedKey?: boolean,
  nodesChanged?: boolean,
}

export default function updateGraphDendogram(
  graph: Graph,
  config: TreeViewNodePropertiesOptionsProps,
  changeProps?: ChangeProps,
) {
  if (changeProps?.nodeSize || changeProps?.labelSize || changeProps?.showLabel || changeProps?.edgeSize ||
    changeProps?.selectedKey || changeProps?.nodesChanged) {
    graph.setOptions({
      node: {
        style: {
          size: config.nodeSize,
          labelText: (d: any) => {
            if (d.id.startsWith("virtual-depth-root-")) {
              return config.showLabel ? (d.name ?? '') : '';
            }

            const children = d.children;
            const isLeaf = !children || children.length === 0;

            return config.showLabel && isLeaf ? (d.name ?? '') : '';
          },
          labelFontSize: config.labelSize,
          fill: (d: any) => {
            const isVirtual = d.metadata?.isVirtualSubtree === true;

            if (isVirtual) {
              return "#f39c12";
            }

            if (config.selectedKey && config.isolateDataRows && config.isolateColorMap && config.isolateDataKey) {
              const isolateRow = config.isolateDataRows.find(
                row => row.row[config.isolateDataKey] === d.id
              );

              if (isolateRow) {
                const value = isolateRow.row[config.selectedKey];

                if (value !== undefined && value !== null && value !== '') {
                  return (config.isolateColorMap.get(value) ?? "#277BC0");
                }
              }
            }
            return "#277BC0";
          },

        }
      },
      edge: {
        type: 'polyline',
        style: {
          lineWidth: config.edgeSize,
          router: {
            type: 'orth',
          },
        }
      }
    });
  }
}

export async function updateGraphTreeData(
  graph: Graph,
  treeData: TreeData
): Promise<void> {
  const graphData = treeToGraphData(treeData);

  graph.setData(graphData);

  await graph.draw()
}
