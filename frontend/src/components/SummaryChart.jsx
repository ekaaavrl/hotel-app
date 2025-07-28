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
    // Format tanggal agar tidak tampil timezone
    const formattedData = data.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
        }),
    }));

    return (
        <div className="bg-white shadow rounded p-4 h-100">
            <h2 style={{ fontSize: "16px" }} className="font-semibold mb-3">
                Pendapatan 7 Hari Terakhir
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `Rp${value.toLocaleString("id-ID")}`} />
                    <Line type="monotone" dataKey="total" stroke="#a3720f" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SummaryChart;
