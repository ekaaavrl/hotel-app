import React, { useEffect, useState } from "react";
import api from "../services/api";
import SummaryCardsGroup from "../components/SummaryCardsGroup";
import SummaryChart from "../components/SummaryChart";
import ReservationChart from "../components/ReservationChart";
import { Row, Col } from "react-bootstrap";


const Dashboard = () => {
    const [stats, setStats] = useState({
        guestsToday: 0,
        roomsAvailable: 0,
        activeReservations: 0,
        incomeToday: 0,
    });

    const [chartData, setChartData] = useState([]);
    const [reservationChart, setReservationChart] = useState([]); // ✅ tambahkan ini

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await api.get("/dashboard");
                setStats(statsRes.data);

                const chartRes = await api.get("/dashboard/summary-chart");
                setChartData(chartRes.data);

                const res2 = await api.get("/dashboard/reservation-chart");
                setReservationChart(res2.data);
            } catch (err) {
                console.error("Gagal ambil data dashboard:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-4">
            <h2 className="mb-4 fw-bold">Dashboard</h2>
            <SummaryCardsGroup stats={stats} />
            <Row className="g-3 mt-2">
                <Col xs={12} md={6}>
                    <SummaryChart data={chartData} />
                </Col>
                <Col xs={12} md={6}>
                    <ReservationChart data={reservationChart} />
                </Col>
            </Row>

        </div>
    );
};

export default Dashboard;
