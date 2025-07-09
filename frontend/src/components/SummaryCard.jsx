import React from 'react';
import { Card } from 'react-bootstrap';

// Komponen card hotel dashboard
export default function SummaryCard({ title, value, icon, color }) {
    return (
        <Card className={`shadow-sm border-start border-${color} border-4 h-100`}>
            <Card.Body>
                <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                        <div className={`text-uppercase fw-bold text-${color} small mb-1`}>
                            {title}
                        </div>
                        <div className="h5 mb-0 fw-bold text-dark">{value}</div>
                    </div>
                    <div className="col-auto">
                        <i className={`bi ${icon} fs-2 text-gray-300`}></i>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
