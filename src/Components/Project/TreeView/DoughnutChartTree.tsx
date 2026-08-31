import * as React from "react";
import { Box, Button, Collapse, IconButton, Typography } from "@mui/material";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import { Doughnut } from "react-chartjs-2"


ChartJS.register(ArcElement, Tooltip, Legend);

export interface DoughnutChartData {
    labels: string[],
    datasets: {
        label: string,
        data: number[],
        backgroundColor: string[],
        borderWidth: number
    }[]
}

interface DoughnutChartProps {
    title: string;
    doughnutChartData: DoughnutChartData;
}

export function DoughnutChartTree({
    title,
    doughnutChartData,
}: DoughnutChartProps) {
    const [expanded, setExpanded] = React.useState(true);
    const chartRef = React.useRef<ChartJS<"doughnut"> | null>(null);

    const handleDownload = () => {
        const chart = chartRef.current;
        const url = chart?.toBase64Image();

        const link = document.createElement("a");
        link.href = url ?? '';
        link.download = `${title || "doughnut-chart"}.png`;
        link.click();
    }

    return (
        <Box
            sx={{
                position: "absolute",
                right: 10,
                bottom: 0,
                backgroundColor: "#FFF",
                borderRadius: 3,
                border: 1,
                width: expanded ? "300px" : "auto",
                overflow: "hidden",
            }}>
            <Button
                size="small"
                onClick={() => setExpanded(!expanded)}
                startIcon={
                    <ExpandMoreIcon
                        sx={{
                            transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
                            transition: "transform 0.2s ease"
                        }}
                    />
                }
                sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    px: 2,
                    py: 1,
                    borderRadius: 0,
                    backgroundColor: "#277BC0",
                    color: "#FFF",
                    "&:hover": {
                        backgroundColor: "#FFF",
                        color: "#277BC0"
                    }
                }}
            >
                {title}
            </Button>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box
                    sx={{
                        height: "500px",
                        display: "flex",
                        flexDirection: "column",
                        p: "1"
                    }}
                >
                    {doughnutChartData.labels.length === 0 ? (
                        <Box
                            sx={{
                                height: "500px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Typography>
                                <em>No data.</em>
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    height: "250px",
                                    width: "100%",
                                    p: "1"
                                }}
                            >
                                <Doughnut
                                    ref={chartRef}
                                    data={doughnutChartData}
                                    options={{
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        }
                                    }}>
                                </Doughnut>
                            </Box>
                            <Box
                                sx={{
                                    borderTop: 1,
                                    borderColor: "divider",
                                    flexGrow: 1,
                                    overflow: "auto",
                                    p: "1"
                                }}
                            >
                                {doughnutChartData.labels.map((label, index) => (
                                    <Box
                                        key={label}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            ml: 1,
                                            mb: 0.5
                                        }}
                                    >
                                        <span style={{
                                            backgroundColor: doughnutChartData.datasets[0].backgroundColor[index],
                                            width: "40px",
                                            height: "10px",
                                            marginRight: "10px"
                                        }}>
                                            <Typography>
                                                {label}
                                            </Typography>
                                        </span>
                                    </Box>
                                )
                                )}
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    borderTop: 1,
                                    justifyContent: "center",
                                    borderColor: "divider",
                                    pt: "1"
                                }}
                            >
                                <IconButton size="small" onClick={handleDownload} title="Export chart as PNG">
                                    <CameraAltIcon />
                                </IconButton>
                            </Box>

                        </>
                    )}
                </Box>

            </Collapse>

        </Box>
    )
}
