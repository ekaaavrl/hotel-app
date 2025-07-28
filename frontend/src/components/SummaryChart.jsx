import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const SummaryChart = ({ data }) => {
    const formattedData = data.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
        }),
    }));

    return (
        <div className="bg-white shadow rounded p-3 h-100">
            <h2 style={{ fontSize: "14px" }} className="fw-semibold mb-2">
                Pendapatan 7 Hari Terakhir
            </h2>
            <ResponsiveContainer width="100%" height={320}>
                <LineChart
                    data={formattedData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 10 }} // kasih ruang
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) =>
                            `Rp${(value / 1000000).toFixed(1)}jt`
                        }
                    />
                    <Tooltip
                        contentStyle={{ fontSize: "13px", borderRadius: "8px" }}
                        formatter={(value) => `Rp${value.toLocaleString("id-ID")}`}
                        labelStyle={{ fontWeight: "bold" }}
                    />
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#a3720f"
                        strokeWidth={2}
                        dot={{
                            r: 4,
                            stroke: "#a3720f",
                            strokeWidth: 2,
                            fill: "#fff",
                        }}
                        activeDot={{
                            r: 6,
                            stroke: "#a3720f",
                            strokeWidth: 2,
                            fill: "#fff",
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>

        </div>
    );
};

export default SummaryChart;
