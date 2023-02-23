import Cookies from 'js-cookie';
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import {MemeType} from "src/types";
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

type MemeStatProps = {
    meme: MemeType
}

export const optionsTop = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Views/Comments',
      },
    },
  };

  export const optionsBottom = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Likes/Dislikes',
      },
    },
  };

export const MemeStat = ({meme}: MemeStatProps) => {
    const [dataTop, setDataTop] = useState<ChartData<"line">>();
    const [dataBottom, setDataBottom] = useState<ChartData<"line">>();
    const componentIsMounted = useRef(true);

    useEffect(() => {
        // each useEffect can return a cleanup function
        async function fetchData() {
            try {
                const response_views = await axios(`http://localhost:3001/memes/${meme.publicId}/views`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    }
                });

                const response_likes = await axios(`http://localhost:3001/memes/${meme.publicId}/likes`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    }
                });

                const response_dislikes = await axios(`http://localhost:3001/memes/${meme.publicId}/dislikes`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    }
                });

                const response_comments = await axios(`http://localhost:3001/memes/${meme.publicId}/comments`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    }
                });

                const views = response_views.data;
                const likes = response_likes.data;
                const dislikes = response_likes.data;
                const comments = response_comments.data;

                // Aggregate the data from the last daysAmount days
                const daysAmount = 7;
                const today = new Date();
                const days = Array.from({ length: daysAmount }, (_, i) => {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    return { date: dayName, views: 0, likes: 0, dislikes: 0, comments: 0 };
                });

                for (const view of views) {
                    const viewDate = Date.parse(view.createdAt);
                    const diffTime = Math.abs(today.getTime() - viewDate);
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays < 7) {
                        const day = days[6 - diffDays];
                        day.views += 1;
                    }
                }

                for (const like of likes) {
                    const viewDate = Date.parse(like.createdAt);
                    const diffTime = Math.abs(today.getTime() - viewDate);
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays < 7) {
                        const day = days[6 - diffDays];
                        day.likes += 1;
                    }
                }

                for (const dislike of dislikes) {
                    const viewDate = Date.parse(dislike.createdAt);
                    const diffTime = Math.abs(today.getTime() - viewDate);
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays < 7) {
                        const day = days[6 - diffDays];
                        day.dislikes += 1;
                    }
                }

                for (const comment of comments) {
                    const viewDate = Date.parse(comment.createdAt);
                    const diffTime = Math.abs(today.getTime() - viewDate);
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays < 7) {
                        const day = days[6 - diffDays];
                        day.comments += 1;
                    }
                }

                console.log("Days", days);

                const labels = days.map(d => d.date);

                const dataTop = {
                    labels,
                    datasets: [
                        {
                            label: 'Views',
                            data: days.map(d => d.views),
                            borderColor: 'rgb(204, 52, 227)',
                            backgroundColor: 'rgba(204, 52, 227, 0.5)',
                        },
                        {
                            label: 'Comments',
                            data: days.map(d => d.comments),
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        }
                    ]
                }

                const dataBottom = {
                    labels,
                    datasets: [
                        {
                            label: 'Likes',
                            data: days.map(d => d.likes),
                            borderColor: 'rgb(42, 222, 89)',
                            backgroundColor: 'rgba(42, 222, 89, 0.5)',
                        },
                        {
                            label: 'Disikes',
                            data: days.map(d => d.likes),
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        }
                    ]
                }

                if (componentIsMounted.current) {
                    setDataTop(dataTop);
                    setDataBottom(dataBottom);
                }

            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
      }, []);

    return (
        <div style={{height: 500}}>
            {dataTop && <Line options={optionsTop} data={dataTop} />}
            {dataBottom && <Line options={optionsBottom} data={dataBottom} />}
        </div>
    )
}