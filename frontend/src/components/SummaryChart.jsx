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
    return (
        <div className="bg-white shadow rounded p-4 h-100">
            <h2 className="text-lg font-semibold mb-3">Pendapatan 7 Hari Terakhir</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `Rp${value.toLocaleString("id-ID")}`} />
                    <Line type="monotone" dataKey="total" stroke="#007bff" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SummaryChart;
