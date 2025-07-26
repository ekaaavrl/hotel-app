import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Card, Form, Row, Col } from "react-bootstrap";

const ReservationHistory = () => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState({ status: "all", search: "" });

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/reports/history-reservations", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error("Gagal ambil riwayat reservasi:", err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const filteredData = data.filter((item) => {
        const matchStatus = filter.status === "all" || item.status === filter.status;
        const matchSearch =
            item.guest_name?.toLowerCase().includes(filter.search.toLowerCase()) ||
            item.room_number?.toString().includes(filter.search);
        return matchStatus && matchSearch;
    });

    return (
        <div className="p-4">
            <Card className="shadow">
                <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-dark">Riwayat Reservasi</h5>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    size="sm"
                                    value={filter.status}
                                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                >
                                    <option value="all">Semua</option>
                                    <option value="booked">Booked</option>
                                    <option value="checked_in">Checked In</option>
                                    <option value="checked_out">Checked Out</option>
                                    <option value="cancelled">Cancelled</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={{ span: 4, offset: 4 }}>
                            <Form.Group>
                                <Form.Label>Pencarian</Form.Label>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="Cari tamu / kamar..."
                                    value={filter.search}
                                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="table-responsive">
                        <Table striped bordered hover responsive style={{ fontSize: "13px" }}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tamu</th>
                                    <th>Kamar</th>
                                    <th>Jenis</th>
                                    <th>Check-in</th>
                                    <th>Check-out</th>
                                    <th>Jumlah Tamu</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, i) => (
                                    <tr key={item.reservation_id}>
                                        <td>{i + 1}</td>
                                        <td>{item.guest_name}</td>
                                        <td>{item.room_number}</td>
                                        <td>{item.room_type}</td>
                                        <td>{item.check_in_date?.slice(0, 10)}</td>
                                        <td>{item.check_out_date?.slice(0, 10)}</td>
                                        <td>{item.number_of_guests}</td>
                                        <td><span
                                            className={`badge bg-${item.status === "cancelled"
                                                ? "danger"
                                                : item.status === "checked_in"
                                                    ? "info"
                                                    : item.status === "checked_out"
                                                        ? "success"
                                                        : "secondary"
                                                } text-capitalize`}
                                        >
                                            {item.status.replace("_", " ")}
                                        </span>
                                        </td>
                                        <td>Rp{parseInt(item.total_price || 0).toLocaleString("id-ID")}</td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center text-muted">
                                            Tidak ada data ditemukan.
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

export default ReservationHistory;
