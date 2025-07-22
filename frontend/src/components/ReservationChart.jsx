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
            year: "numeric", // atau bisa dihilangkan jika ingin ringkas
        }),
    }));

    return (
        <div className="bg-white shadow rounded p-4 h-100">
            <h2 style={{ fontSize: "18px" }} className="font-semibold mb-3">
                Grafik Reservasi
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} reservasi`} />
                    <Bar dataKey="total" fill="#00b894" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ReservationChart;
