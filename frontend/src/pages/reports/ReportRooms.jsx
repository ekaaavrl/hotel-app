import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Table, Form, Badge, Row, Col, Card } from "react-bootstrap";

const ReportRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [summary, setSummary] = useState({ available: 0, occupied: 0, maintenance: 0 });

    const fetchRooms = async () => {
        try {
            const endpoint = statusFilter === "all"
                ? "/reports/rooms"
                : `/reports/rooms?status=${statusFilter}`;
            const res = await api.get(endpoint);
            setRooms(res.data);

            if (statusFilter === "all") {
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

    const filteredRooms = rooms.filter((room) =>
        room.room_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4">
            <Card className="shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold text-dark m-0">Laporan Status Kamar</h5>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Semua</option>
                                    <option value="available">Tersedia</option>
                                    <option value="occupied">Ditempati</option>
                                    <option value="maintenance">Maintenance</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Cari Nomor Kamar</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Cari..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col>
                            <Badge bg="success" className="p-2 w-100 text-start">
                                Tersedia: {summary.available}
                            </Badge>
                        </Col>
                        <Col>
                            <Badge bg="danger" className="p-2 w-100 text-start">
                                Ditempati: {summary.occupied}
                            </Badge>
                        </Col>
                        <Col>
                            <Badge bg="warning" text="dark" className="p-2 w-100 text-start">
                                Maintenance: {summary.maintenance}
                            </Badge>
                        </Col>
                    </Row>

                    <div className="table-responsive">
                        <Table striped bordered hover size="sm" style={{ fontSize: "13px" }}>
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
                                {filteredRooms.map((room, i) => (
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
                                {filteredRooms.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted">
                                            Tidak ada data kamar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ReportRooms;
