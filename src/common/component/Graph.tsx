import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { ChartConfig } from "../../dashboard/type/DashBoardPage.type";

interface ChartComponentProps {
  config: ChartConfig;
}

// 최근 7일 날짜 생성 함수
const getLastSevenDays = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
  }
  return dates;
};

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
        data: getLastSevenDays(),
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
