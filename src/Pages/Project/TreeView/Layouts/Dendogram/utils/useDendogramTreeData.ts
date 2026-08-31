import * as React from "react"
import { NewickVisualization } from "../../../../../../Services/Visualization/NewickVisualization"
import { ParseNewickOutputModel } from "../../../../../../Services/Visualization/models/parseNewick/ParseNewickOutputModel"
import { MockVisualizationService } from "../../../../../../Services/Visualization/MockVisualizationService"
import { AdjCache, buildAdjCache } from "./buildAdjCache"
import { annotateTreeMetadata } from "./annotateTreeMetadata"
import { limitTreeNodes } from "./visibleTree"

interface UseDendogramTreeDataParams {
  projectId?: string;
  isolateDataId: string;
  newickText: string;
  initialVisibleNodes: number;
}

interface UseDendogramTreeDataResult {
  treeData: ParseNewickOutputModel | null;
  setTreeData: React.Dispatch<React.SetStateAction<ParseNewickOutputModel | null>>;
  treeDataRef: React.MutableRefObject<ParseNewickOutputModel | null>;
  fullTreeRef: React.MutableRefObject<ParseNewickOutputModel | null>;
  adjCacheRef: React.MutableRefObject<AdjCache | null>;
  keys: string[];
}

export function useDendogramTreeData({
  projectId,
  isolateDataId,
  newickText,
  initialVisibleNodes,
}: UseDendogramTreeDataParams): UseDendogramTreeDataResult {
  const [treeData, setTreeData] = React.useState<ParseNewickOutputModel | null>(null);
  const [keys, setKeys] = React.useState<string[]>([]);
  const treeDataRef = React.useRef<ParseNewickOutputModel | null>(null);
  const fullTreeRef = React.useRef<ParseNewickOutputModel | null>(null);
  const adjCacheRef = React.useRef<AdjCache | null>(null);

  React.useEffect(() => {
    treeDataRef.current = treeData;
  }, [treeData]);

  React.useEffect(() => {
    if (!projectId) {
      return;
    }

    const parsedTree = NewickVisualization.getNewickData(newickText);
    const annotatedTree = annotateTreeMetadata(parsedTree);
    fullTreeRef.current = annotatedTree;

    adjCacheRef.current = buildAdjCache(annotatedTree);

    const visibleTree = limitTreeNodes(
      annotatedTree,
      initialVisibleNodes,
      Number(process.env.SUBTREE_THRESHOLD),
      new Set(),
      "initial",
    );

    setTreeData(visibleTree);


    MockVisualizationService.getIsolateDataKeys(projectId, isolateDataId).then((data) => {
      setKeys(data.keys);
    });
  }, [projectId, isolateDataId, newickText, initialVisibleNodes]);

  return {
    treeData,
    setTreeData,
    treeDataRef,
    fullTreeRef,
    adjCacheRef,
    keys,
  };
}
