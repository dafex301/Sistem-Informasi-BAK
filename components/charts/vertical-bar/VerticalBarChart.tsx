import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface IVerticalBarChartProps {
  title: string;
  dataPermohonan: number[];
  dataSurat: number[];
}

export default function VerticalBarChart(props: IVerticalBarChartProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: props.title,
      },
    },
  };

  // Make array of last 12 months, including current month
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const now = new Date();
  const last12Months = Array.from(
    { length: 12 },
    (_, i) => monthNames[(now.getMonth() - i + 12) % 12]
  ).reverse();

  const data = {
    labels: last12Months,
    datasets: [
      {
        label: "Peminjaman Tempat",
        data: props.dataPermohonan,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Surat Menyurat",
        data: props.dataSurat,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
