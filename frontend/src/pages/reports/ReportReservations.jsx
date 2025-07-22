import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
    Card,
    Table,
    Form,
    Row,
    Col
} from "react-bootstrap";

const ReportReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // format YYYY-MM-DD
    });

    const fetchReservations = async () => {
        try {
            const res = await api.get(`/reports/reservations?date=${selectedDate}`);
            setReservations(res.data);
        } catch (err) {
            console.error("Gagal ambil data reservasi:", err);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [selectedDate]);

    return (
        <div className="p-4">
            <Card className="shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold text-primary m-0">Laporan Reservasi Harian</h5>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Pilih Tanggal</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="table-responsive">
                        <Table striped bordered hover size="sm" style={{ fontSize: '13px' }}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama Tamu</th>
                                    <th>Nomor Kamar</th>
                                    <th>Check-In</th>
                                    <th>Check-Out</th>
                                    <th>Jumlah Tamu</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.length > 0 ? (
                                    reservations.map((rsv, i) => (
                                        <tr key={rsv.reservation_id}>
                                            <td>{i + 1}</td>
                                            <td>{rsv.guest_name}</td>
                                            <td>{rsv.room_number}</td>
                                            <td>{new Date(rsv.check_in_date).toLocaleDateString("id-ID", {
                                                dateStyle: "medium"
                                            })}</td>
                                            <td>{new Date(rsv.check_out_date).toLocaleDateString("id-ID", {
                                                dateStyle: "medium"
                                            })}</td>
                                            <td>{rsv.number_of_guests}</td>
                                            <td>
                                                <span
                                                    className={`badge bg-${rsv.status === "cancelled"
                                                        ? "danger"
                                                        : rsv.status === "checked_in"
                                                            ? "info"
                                                            : rsv.status === "checked_out"
                                                                ? "success"
                                                                : "secondary"
                                                        }`}
                                                >
                                                    {rsv.status.replace("_", " ")}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted">
                                            Tidak ada data untuk tanggal ini.
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

export default ReportReservations;
