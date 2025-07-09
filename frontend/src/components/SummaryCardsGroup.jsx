import React from "react";
import { Row, Col } from "react-bootstrap";
import SummaryCard from "./SummaryCard";

export default function SummaryCardsGroup({ stats }) {
    return (
        <Row className="g-3 mb-4">
            <Col xs={12} md={6} lg={3}>
                <SummaryCard
                    title="Tamu Hari Ini"
                    value={stats.guestsToday}
                    icon="bi-people-fill"
                    color="primary"
                />
            </Col>
            <Col xs={12} md={6} lg={3}>
                <SummaryCard
                    title="Kamar Tersedia"
                    value={stats.roomsAvailable}
                    icon="bi-door-closed-fill"
                    color="success"
                />
            </Col>
            <Col xs={12} md={6} lg={3}>
                <SummaryCard
                    title="Reservasi Aktif"
                    value={stats.activeReservations}
                    icon="bi-calendar-check-fill"
                    color="warning"
                />
            </Col>
            <Col xs={12} md={6} lg={3}>
                <SummaryCard
                    title="Pendapatan Hari Ini"
                    value={`Rp${stats.incomeToday.toLocaleString("id-ID")}`}
                    icon="bi-cash-coin"
                    color="danger"
                />
            </Col>
        </Row>
    );
}
