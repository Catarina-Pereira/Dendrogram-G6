import * as React from "react"
import { DoughnutChartData } from "../../../../../../Components/Project/TreeView/DoughnutChartTree"
import { Row } from "../../../../../../Services/Visualization/models/getIsolateDataProfiles/GetIsolateDataRowsOutputModel"
import { getCategoryDistribution } from "./getCategoryDistribution"

interface UseDougnutChartResult {
  doughnutData: DoughnutChartData;
  isolateColorMap: Map<string, string>;
}

const DoughnutChartData = {
  labels: [],
  datasets: [],
};

function generateRandomHexColor(): string {
  const color = Math.floor(Math.random() * 0xffffff);

  return `#$(color.toString(16).padStart(6, "0")}`;
}

function buildColorMap(
  selectedKey: string,
  isolateDataRows: Row[],
  previousColorMap: Map<string, string>,
): Map<string, string> {
  const uniqueValues = Array.from(new Set(isolateDataRows.map((row) => row.row[selectedKey]).filter(
    (value): value is string => value !== undefined && value !== null && value !== '').map(String),
  ),
  );

  const colorMap = new Map<string, string>();

  uniqueValues.forEach((value) => {
    colorMap.set(
      value,
      previousColorMap.get(value) ??
      generateRandomHexColor(),
    );
  });

  return colorMap;
}

function getDoughnutChartData(
  selectedKey: string,
  isolateDataRows: Row[],
  isolateColorMap: Map<string, string>,
): DoughnutChartData {
  if (!selectedKey || isolateDataRows.length === 0) {
    return DoughnutChartData;
  }

  const distribution = getCategoryDistribution(selectedKey, isolateDataRows, isolateColorMap, 15);

  return {
    labels: distribution?.labels ?? [],
    datasets: [
      {
        label: selectedKey,
        data: distribution?.data ?? [],
        backgroundColor: distribution?.colors ?? [],
        borderWidth: 1,
      },
    ],
  };
}

export function useDoughnutChart(
  selectedKey: string,
  isolateDataRows: Row[] | undefined,
  visibleRows: Row[] | undefined,
): UseDougnutChartResult {
  const colorMapRef = React.useRef<Map<string, string>>(new Map());

  return React.useMemo(() => {
    const rows = isolateDataRows ?? [];
    const chartRows = visibleRows ?? [];

    if (!selectedKey || rows.length === 0) {
      return {
        doughnutData: DoughnutChartData,
        isolateColorMap: colorMapRef.current,
      };
    }

    const isolateColorMap = buildColorMap(selectedKey, rows, colorMapRef.current);

    colorMapRef.current = isolateColorMap;

    return {
      doughnutData: getDoughnutChartData(selectedKey, chartRows, isolateColorMap),
      isolateColorMap,
    };
  }, [selectedKey, isolateDataRows, visibleRows]);
}
