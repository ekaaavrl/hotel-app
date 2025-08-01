import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

const ReservationChart = ({ data }) => {
    const formattedData = data.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
        }),
    }));

    return (
        <div className="bg-white shadow rounded p-4 h-100">
            <h2 style={{ fontSize: "16px" }} className="fw-semibold mb-3">
                Grafik Reservasi
            </h2>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} reservasi`} />
                    <Bar dataKey="total" fill="#a3720f" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ReservationChart;
