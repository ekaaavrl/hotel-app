import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Table, Form, Badge, Row, Col, Card } from "react-bootstrap";

const ReportRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [summary, setSummary] = useState({ available: 0, occupied: 0, maintenance: 0 });

    const fetchRooms = async () => {
        try {
            const endpoint = statusFilter === "all" ? "/reports/rooms" : `/reports/rooms?status=${statusFilter}`;
            const res = await api.get(endpoint);
            setRooms(res.data);

            if (statusFilter === "all") {
                // Hitung ringkasan
                const count = { available: 0, occupied: 0, maintenance: 0 };
                res.data.forEach((r) => {
                    count[r.status] = (count[r.status] || 0) + 1;
                });
                setSummary(count);
            }
        } catch (err) {
            console.error("Gagal ambil data kamar:", err);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [statusFilter]);

    return (
        <div className="p-4">
            <h3 className="fw-bold mb-4">Laporan Status Kamar</h3>

            {/* Summary cards */}
            {statusFilter === "all" && (
                <Row className="mb-4">
                    <Col md={4}>
                        <Card className="text-center border-start border-success border-4">
                            <Card.Body>
                                <Card.Title className="text-success">Tersedia</Card.Title>
                                <h4>{summary.available}</h4>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center border-start border-danger border-4">
                            <Card.Body>
                                <Card.Title className="text-danger">Ditempati</Card.Title>
                                <h4>{summary.occupied}</h4>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center border-start border-warning border-4">
                            <Card.Body>
                                <Card.Title className="text-warning">Maintenance</Card.Title>
                                <h4>{summary.maintenance}</h4>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
            {/* Filter */}
            <Form.Group className="mb-3" style={{ maxWidth: "300px" }}>
                <Form.Label>Filter Status</Form.Label>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Semua</option>
                    <option value="available">Tersedia</option>
                    <option value="occupied">Ditempati</option>
                    <option value="maintenance">Maintenance</option>
                </Form.Select>
            </Form.Group>

            {/* Tabel data */}
            <Table striped bordered hover responsive>
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Nomor Kamar</th>
                        <th>Tipe</th>
                        <th>Harga / Malam</th>
                        <th>Status</th>
                        <th>Deskripsi</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room, i) => (
                        <tr key={room.room_id}>
                            <td>{i + 1}</td>
                            <td>{room.room_number}</td>
                            <td>{room.type_name}</td>
                            <td>Rp{parseInt(room.price_per_night).toLocaleString("id-ID")}</td>
                            <td>
                                <Badge bg={
                                    room.status === "available" ? "success" :
                                        room.status === "occupied" ? "danger" :
                                            "warning"
                                }>
                                    {room.status}
                                </Badge>
                            </td>
                            <td>{room.description || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ReportRooms;
