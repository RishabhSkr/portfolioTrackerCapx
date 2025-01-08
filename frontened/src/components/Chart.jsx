import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
);

//  color array for stocks
const STOCK_COLORS = [
    'rgb(241, 16, 65)', // red
    'rgb(54, 162, 235)', // blue
    'rgb(255, 206, 86)', // yellow
    'rgb(75, 192, 192)', // teal
    'rgb(153, 102, 255)', // purple
    'rgb(255, 159, 64)', // orange
    'rgb(231, 233, 237)', // grey
    'rgb(255, 99, 132)', // light red
    'rgb(54, 162, 235)', // light blue
    'rgb(255, 206, 86)', // light yellow
    'rgb(75, 192, 192)', // light teal
    'rgb(153, 102, 255)', // light purple
    'rgb(255, 159, 64)', // light orange
    'rgb(231, 233, 237)', // light grey
    'rgb(255, 99, 132)', // dark red
    'rgb(54, 162, 235)', // dark blue
    'rgb(255, 206, 86)', // dark yellow
    'rgb(75, 192, 192)', // dark teal
    'rgb(153, 102, 255)', // dark purple
    'rgb(255, 159, 64)', // dark orange
];

export const PieChart = ({ value = [], labels = [] }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                data: value,
                backgroundColor: STOCK_COLORS,
                borderWidth: 1,
                borderColor: '#fff',
                // Pull-out "pizza slice" effect
                offset: ctx => {
                    const chart = ctx.chart;
                    const dataIndex = ctx.dataIndex;
                    const activeEls = chart.getActiveElements();
                    if (activeEls.length) {
                        const { datasetIndex, index } = activeEls[0];
                        if (datasetIndex === 0 && index === dataIndex) {
                            return 24; // adjust offset size here
                        }
                    }
                    return 0;
                },
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeInOutQuad',
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333',
                    font: {
                        size: 14,
                        weight: 600, // Using numeric value instead of "bold"
                        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    },
                    generateLabels: chart => {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => ({
                                text: `${label} ($${value[i]?.toFixed(2) || '0.00'})`,
                                fillStyle: STOCK_COLORS[i],
                                hidden: isNaN(data.datasets[0].data[i]),
                                index: i,
                            }));
                        }
                        return [];
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: context => {
                        const label = context.label || '';
                        const val = context.raw || 0;
                        const total = context.dataset.data.reduce(
                            (a, b) => a + b,
                            0
                        );
                        const percentage = ((val / total) * 100).toFixed(1);
                        return `${label}: $${val.toFixed(2)} (${percentage}%)`;
                    },
                },
                bodyFont: {
                    size: 14,
                },
                titleFont: {
                    size: 14,
                    weight: 600,
                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                },
            },
        },
        hover: {
            animationDuration: 400,
            mode: 'nearest',
            intersect: true,
        },
    };

    return <Pie data={data} options={options} />;
};
