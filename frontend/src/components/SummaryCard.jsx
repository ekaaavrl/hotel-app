import React from "react";
import { Card } from "react-bootstrap";

const iconMap = {
    "bi-people-fill": "bi bi-people-fill",
    "bi-door-closed-fill": "bi bi-door-closed-fill",
    "bi-calendar-check-fill": "bi bi-calendar-check-fill",
    "bi-cash-coin": "bi bi-cash-coin",
};

export default function SummaryCard({ title, value, icon, color = "primary" }) {
    return (
        <Card className={`border-left-${color} shadow h-100 py-2`}>
            <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="me-2">
                        <div className={`text-xs fw-bold text-${color} text-uppercase mb-1`}>
                            {title}
                        </div>
                        <div className="h5 mb-0 fw-bold text-gray-800">{value}</div>
                    </div>
                    <div className="col-auto">
                        <i className={`${iconMap[icon]} fs-2 text-gray-300`}></i>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
