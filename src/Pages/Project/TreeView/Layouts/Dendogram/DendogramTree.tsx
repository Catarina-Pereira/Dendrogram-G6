import * as React from "react"
import { ParseNewickOutputModel } from "../../../../../Services/Visualization/models/parseNewick/ParseNewickOutputModel"
import { useParams } from "react-router-dom"
import { Graph } from "@antv/g6"
import { useRef } from "react"
import { Box } from "@mui/material"
import createGraphDendogram from "./createGraphDendogram"
import updateGraphDendogram from "./updateGraphDendogram"
import { MockVisualizationService } from "../../../../../Services/Visualization/MockVisualizationService"
import { useIsolateData } from "./utils/useIsolateData"
import { DoughnutChartTree } from "../../../../../Components/Project/TreeView/DoughnutChartTree"
import { TreeSettingsCard } from "../../../../../Components/Project/TreeView/TreeSettingsCard"
import { ErrorAlert } from "../../../../../Components/Shared/ErrorAlert"
import { MockAdministrationService } from "../../../../../Services/Administration/MockAdministrationService"
import { updateGraphTreeData } from "./updateGraphDendogram"
import { createTreeExpansionManager } from "./utils/treeExpansion"
import { useDendogramController, collectVisibleLeafIds } from "./utils/useDendogramController"
import { exportGraphImage } from "./utils/exportGraphImage"
import { useDoughnutChart } from "./utils/useDoughnutChart"
import { useDendogramTreeData } from "./utils/useDendogramTreeData"
import { handleTreeContextAction } from "./utils/treeContextAction"

import mockProjects = MockAdministrationService.mockProjects;

export default function DendogramTree() {

  const { projectId } = useParams<{ projectId: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const treeExpansionManagerRef = useRef<any>(null);

  const [nodeSize, setNodeSize] = React.useState<number>(8);
  const [labelSize, setLabelSize] = React.useState<number>(8);
  const [showLabel, setShowLabel] = React.useState<boolean>(true);
  const [edgeSize, setEdgeSize] = React.useState<number>(1);

  const [selectedKey, setSelectedKey] = React.useState<string>("");

  const project = projectId ? mockProjects.get(projectId) : undefined;

  const isolateDataId = project?.files?.isolateData?.find((data) => !!data.content)?.isolateDataId ?? '';
  const { isolateDataRows } = useIsolateData(projectId!, isolateDataId)
  const { newickText } = MockVisualizationService.getUPGMATreeStat();
  const initialVisibleNodes = Number(process.env.INITIAL_VISIBLE_NODES);
  const maxVisibleNodes = Number(process.env.MAX_VISIBLE_NODES);

  const { treeData, setTreeData, treeDataRef, fullTreeRef, adjCacheRef, keys } = useDendogramTreeData({
    projectId,
    isolateDataId,
    newickText,
    initialVisibleNodes,
  })

  const dataset = project?.datasets?.find(dataset => dataset.isolateDataId === isolateDataId);
  const isolateDataKey = dataset?.isolateDataKey || "ST";


  const { handleExpand, treeError, clearTreeError } = useDendogramController(
    graphRef,
    fullTreeRef,
    treeExpansionManagerRef,
    maxVisibleNodes,
  );

  function usePrevious<T>(value: T): T | undefined {
    const ref = React.useRef<T>();
    React.useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  const prevNodeSize = usePrevious(nodeSize);
  const prevShowLabel = usePrevious(showLabel);
  const prevLabelSize = usePrevious(labelSize);
  const prevEdgeSize = usePrevious(edgeSize);
  const prevSelectedKey = usePrevious(selectedKey);

  const reapplyStyles = React.useCallback(() => {
    const g = graphRef.current;
    if (!g) return;

    updateGraphDendogram(
      g,
      {
        nodeSize,
        setNodeSize,
        labelSize,
        setLabelSize,
        showLabel,
        setShowLabel,
        edgeSize,
        setEdgeSize,
        selectedKey,
        isolateDataRows,
        isolateColorMap: isolateColorMap,
        isolateDataKey,
      },
      {
        nodeSize: false,
        labelSize: false,
        showLabel: false,
        edgeSize: false,
        selectedKey: false,
      }
    );
  }, [nodeSize, labelSize, showLabel, edgeSize, selectedKey, isolateDataRows, isolateDataKey]);

  function applyTreeView(nextTree: ParseNewickOutputModel | null) {
    if (!nextTree) return;

    treeDataRef.current = nextTree;

    graphRef.current?.destroy();
    graphRef.current = null;


    setTreeData(nextTree);
  }

  function handleNodeContextAction(action: string, nodeId: string): void {
    if (action !== "show-tree-from-node" && action !== "show-previous-level") {
      return;
    }

    handleTreeContextAction({
      action,
      nodeId,
      fullTree: fullTreeRef.current,
      visibleTree: treeDataRef.current,
      cache: adjCacheRef.current,
      initialVisibleNodes,
      maxVisibleNodes,
      applyTreeView,
    });
  }

  function handleNodeExpand(nodeId: string): void {
    setTreeData((previousTree) => handleExpand(nodeId, previousTree));
  }

  React.useEffect(() => {
    if (!treeData || !containerRef.current) return;

    if (!graphRef.current) {
      const graph = createGraphDendogram(containerRef.current, treeData,
        {
          onNodeExpand: handleNodeExpand,
          onNodeContextAction: handleNodeContextAction,
        }
      );

      graphRef.current = graph;

      treeExpansionManagerRef.current = createTreeExpansionManager(
        adjCacheRef.current,
        {
          maxVisibleNodes: maxVisibleNodes,
          subtreeThreshold: Number(process.env.SUBTREE_THRESHOLD),
        }
      );

      updateGraphDendogram(
        graph,
        {
          nodeSize,
          setNodeSize,
          labelSize,
          setLabelSize,
          showLabel,
          setShowLabel,
          edgeSize,
          setEdgeSize,
          selectedKey,
          isolateDataRows,
          isolateColorMap,
          isolateDataKey,
        },
        {
          nodeSize: false,
          labelSize: false,
          showLabel: false,
          edgeSize: false,
          selectedKey: false,
          nodesChanged: true,
        }
      );

      return;
    }

    updateGraphTreeData(
      graphRef.current,
      treeData,
    );

    updateGraphDendogram(
      graphRef.current,
      {
        nodeSize,
        setNodeSize,
        labelSize,
        setLabelSize,
        showLabel,
        setShowLabel,
        edgeSize,
        setEdgeSize,
        selectedKey,
        isolateDataRows,
        isolateColorMap,
        isolateDataKey,
      },
      {
        nodeSize: false,
        labelSize: false,
        showLabel: false,
        edgeSize: false,
        selectedKey: false,
        nodesChanged: true,
      }
    );

    reapplyStyles();

  }, [treeData, handleExpand, reapplyStyles]);


  const visibleIds = React.useMemo(() => {
    if (!treeData) {
      return new Set<string>();
    }

    return collectVisibleLeafIds(treeData);
  }, [treeData]);

  const visibleRows = React.useMemo(() => {
    if (!isolateDataRows?.length) {
      return [];
    }

    return Array.from(visibleIds).map(nodeId => isolateDataRows.find(row => row.row[isolateDataKey] === nodeId))
      .filter((row): row is NonNullable<typeof row> =>
        row !== undefined
      );

  }, [isolateDataRows, visibleIds, isolateDataKey]);

  const { doughnutData, isolateColorMap } = useDoughnutChart(selectedKey, isolateDataRows, visibleRows);


  React.useEffect(() => {
    const changeProps = {
      nodeSize: nodeSize !== prevNodeSize,
      labelSize: labelSize !== prevLabelSize,
      showLabel: showLabel !== prevShowLabel,
      edgeSize: edgeSize !== prevEdgeSize,
      selectedKey: selectedKey !== prevSelectedKey,
      nodesChanged: false,
    }
    if (graphRef.current) {
      updateGraphDendogram(
        graphRef.current, {
        nodeSize,
        setNodeSize,
        labelSize,
        setLabelSize,
        showLabel,
        setShowLabel,
        edgeSize,
        setEdgeSize,
        selectedKey,
        isolateDataRows,
        isolateColorMap: isolateColorMap,
        isolateDataKey,
      }, changeProps);
    }
  }, [nodeSize, showLabel, labelSize, edgeSize, selectedKey, isolateColorMap, isolateDataRows, isolateDataKey]);

  return (
    <><Box ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }} />
      <TreeSettingsCard
        nodeSize={nodeSize}
        setNodeSize={setNodeSize}
        showLabel={showLabel}
        setShowLabel={setShowLabel}
        labelSize={labelSize}
        setLabelSize={setLabelSize}
        edgeSize={edgeSize}
        setEdgeSize={setEdgeSize}
        selectedKey={selectedKey}
        isolateDataRows={isolateDataRows}
        isolateKeys={keys}
        setSelectedKey={setSelectedKey}
        isolateDataKey={isolateDataKey}
        onExport={() => exportGraphImage(graphRef.current)}
      />
      <>
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 20,
          }}
        >
          <ErrorAlert
            error={treeError}
            clearError={() => {
              clearTreeError();
            }}
          />
        </Box>
      </>
      {doughnutData.labels.length > 0 && doughnutData.datasets[0].data.length > 0 && (
        <DoughnutChartTree
          title={selectedKey}
          doughnutChartData={doughnutData}
        />
      )}
    </>
  );

}

