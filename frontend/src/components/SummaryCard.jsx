import React from "react";
import { Card } from "react-bootstrap";

const iconMap = {
    "bi-people-fill": "bi bi-people-fill",
    "bi-door-closed-fill": "bi bi-door-closed-fill",
    "bi-calendar-check-fill": "bi bi-calendar-check-fill",
    "bi-cash-coin": "bi bi-cash-coin",
};

export default function SummaryCard({ title, value, icon }) {
    const customColor = "#a3720f";

    return (
        <Card className="shadow h-100 py-2 border-0">
            <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="me-2">
                        <div
                            className="text-uppercase fw-bold small mb-1"
                            style={{ color: "dark" }} // warna title tetap abu seperti default
                        >
                            {title}
                        </div>
                        <div className="h5 mb-0 fw-bold" style={{ color: customColor }}>
                            {value}
                        </div>
                    </div>
                    <div className="col-auto">
                        <i className={`${iconMap[icon]} fs-2`} style={{ color: customColor }}></i>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
