import { DoughnutChartData } from "../../../../../../Components/Project/TreeView/DoughnutChartTree"
import { Row } from "../../../../../../Services/Visualization/models/getIsolateDataProfiles/GetIsolateDataRowsOutputModel"
import { getCategoryDistribution } from "./getCategoryDistribution"

export function getDoughnutChartData(
	selectedKey: string,
	isolateDataRows: Row[] | undefined,
	isolateColorMap: Map<string, string>
): DoughnutChartData {
	if (!selectedKey || !isolateDataRows) {
		return { labels: [], datasets: [] };
	}

	const counts = new Map<string, number>();
	const distribution = getCategoryDistribution(
		selectedKey,
		isolateDataRows,
		isolateColorMap,
		15
	)


	return {
		labels: distribution?.labels ?? [],
		datasets: [
			{
				label: selectedKey,
				data: distribution?.data ?? [],
				backgroundColor: distribution?.colors ?? [],
				borderWidth: 1
			}
		]
	};
}
