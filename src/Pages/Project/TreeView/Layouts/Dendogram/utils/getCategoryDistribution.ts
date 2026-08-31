import { Row } from "../../../../../../Services/Visualization/models/getIsolateDataProfiles/GetIsolateDataRowsOutputModel"

export function getCategoryDistribution(
    selectedKey: string,
    isolateDataRows: Row[] = [],
    isolateColorMap: Map<string, string>,
    maxCategories: number = 15
) {
    const total = isolateDataRows.length;

    if (!selectedKey || !total) {
        return;
    }

    const counts = new Map<string, number>();
    isolateDataRows.forEach((row) => {
        const value = row.row[selectedKey] || "Unknown";
        counts.set(value, (counts.get(value) ?? 0) + 1);
    });

    const sorted = Array.from(counts.entries())
        .map(([Label, count]) => ({
            Label,
            count,
            percentage: (count / total) * 100,
            color: isolateColorMap.get(Label) ?? "#cccccc",
        }))
        .sort((a, b) => b.count - a.count);

    let finalItems: any[] = [];

    if (sorted.length > maxCategories) {
        const mainItems = sorted.slice(0, maxCategories - 1);
        const otherItems = sorted.slice(maxCategories - 1);
        const othersCount = otherItems.reduce((sum, item) => sum + item.count, 0);

        const finalItems = [
            ...mainItems,
            {
                Label: "Others",
                count: othersCount,
                percentage: (othersCount / total) * 100,
                color: "#999999",
                otherDetails: otherItems,

            }
        ];
    } else {
        finalItems = sorted;
    }



    return {
        labels: finalItems.map((item) => item.Label),
        data: finalItems.map((item) => item.count),
        colors: finalItems.map((item) => item.color),
        summaryText: finalItems.map((item: any) => {
            const percent = `${item.percentage.toFixed(1)}%`;

            if (item.label === "Others" && item.otherDetails?.length) {
                const details = item.otherDetails
                    .map((detail: any) => `${detail.label} $ {detail.percentage.toFixed(1)}%`)
                    .join(";");
                return `Others ${percent} (${details})`;
            }

            return `${item.label} ${percent}`;
        }).join(";"),
    };
}
