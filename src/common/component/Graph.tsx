import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { ChartConfig } from "../../dashboard/type/DashBoardPage.type";

interface ChartComponentProps {
    config: ChartConfig;
}

const Graph: React.FC<ChartComponentProps> = ({ config }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chartInstance = echarts.init(chartRef.current);
        const option = {
            animation: false,
            title: {
                text: config.title,
                left: "center",
                textStyle: {
                    fontSize: 14,
                    fontWeight: "normal",
                },
            },
            tooltip: {
                trigger: "axis",
            },
            xAxis: {
                type: "category",
                data: ["5/3", "5/4", "5/5", "5/6", "5/7", "5/8", "5/9"],
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    data: config.data,
                    type: "line",
                    smooth: true,
                    lineStyle: {
                        color: config.color,
                    },
                    itemStyle: {
                        color: config.color,
                    },
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: `${config.color}80`,
                                },
                                {
                                    offset: 1,
                                    color: `${config.color}10`,
                                },
                            ],
                        },
                    },
                },
            ],
        };

        chartInstance.setOption(option);

        const handleResize = () => {
            chartInstance.resize();
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chartInstance.dispose();
        };
    }, [config]);

    return <div ref={chartRef} className="w-full h-72"></div>;
};

export default Graph;