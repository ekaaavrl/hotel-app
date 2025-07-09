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
    return (
        <div className="bg-white shadow rounded p-4 h-100">
            <h5 className="mb-3 fw-semibold">Grafik Reservasi</h5>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
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

export default ReservationChart; // ✅ ini WAJIB ada
