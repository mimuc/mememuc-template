import Cookies from 'js-cookie';
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import {TemplateType} from "src/types";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

type TemplateStatProps = {
    template: TemplateType
}

export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: '',
      },
    },
  };

export const TemplateStat = ({template}: TemplateStatProps) => {
    const [data, setData] = useState<ChartData<"line">>();
    const componentIsMounted = useRef(true);

    useEffect(() => {
        // each useEffect can return a cleanup function
        async function fetchData() {
            try {
                const response_usage = await axios(`http://localhost:3001/templates/${template.id}/memes`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    }
                });

                const usages = response_usage.data;

                // Aggregate the data from the last daysAmount days
                const daysAmount = 7;
                const today = new Date();
                const days = Array.from({ length: daysAmount }, (_, i) => {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    const dayName = date.toLocaleDateString('en-UK', { weekday: 'short' });
                    return { date: dayName, usage: 0 };
                });
                days.reverse();

                for (const usage of usages) {
                    const viewDate = Date.parse(usage.createdAt);
                    const diffTime = Math.abs(today.getTime() - viewDate);
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays < 7) {
                        const day = days[6 - diffDays];
                        day.usage += 1;
                    }
                }

                const labels = days.map(d => d.date);

                const data = {
                    labels,
                    datasets: [
                        {
                            label: 'Usage',
                            data: days.map(d => d.usage),
                            borderColor: 'rgb(204, 52, 227)',
                            backgroundColor: 'rgba(204, 52, 227, 0.5)',
                        },
                    ]
                }

                if (componentIsMounted.current) {
                    setData(data);
                }

            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
      }, []);

    return (
        <div style={{height: 500}}>
            {data && <Line options={options} data={data} />}
        </div>
    )
}