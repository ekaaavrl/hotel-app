import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Form, Button, Row, Col, Alert, Tabs, Tab, Table, Card } from "react-bootstrap";

const ReservationForm = () => {
    const [guests, setGuests] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [form, setForm] = useState({
        guest_id: "",
        room_id: "",
        check_in_date: "",
        check_out_date: "",
        number_of_guests: 1,
        status: "booked",
    });
    const [editId, setEditId] = useState(null);
    const [days, setDays] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("form");

    const fetchData = async () => {
        const [guestRes, roomRes, reservationRes] = await Promise.all([
            api.get("/guests"),
            api.get("/rooms"),
            api.get("/reservations"),
        ]);
        setGuests(guestRes.data);
        setRooms(roomRes.data);
        setReservations(reservationRes.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const d1 = new Date(form.check_in_date);
        const d2 = new Date(form.check_out_date);
        const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
        setDays(diff > 0 ? diff : 0);

        const selectedRoom = rooms.find(r => r.room_id == form.room_id);
        setTotalPrice(selectedRoom && diff > 0 ? selectedRoom.price_per_night * diff : 0);
    }, [form.check_in_date, form.check_out_date, form.room_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");
            if (editId) {
                await api.put(`/reservations/${editId}`, form);
            } else {
                await api.post("/reservations", form);
            }

            setForm({
                guest_id: "",
                room_id: "",
                check_in_date: "",
                check_out_date: "",
                number_of_guests: 1,
                status: "booked",
            });
            setDays(0);
            setTotalPrice(0);
            setEditId(null);
            fetchData();
            setActiveTab("list");
        } catch (err) {
            setError("Gagal menyimpan reservasi.");
        }
    };

    const handleEdit = (data) => {
        setForm({
            guest_id: data.guest_id,
            room_id: data.room_id,
            check_in_date: data.check_in_date,
            check_out_date: data.check_out_date,
            number_of_guests: data.number_of_guests,
            status: data.status,
        });
        setEditId(data.reservation_id);
        setActiveTab("form");
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus reservasi ini?")) {
            await api.delete(`/reservations/${id}`);
            fetchData();
        }
    };

    return (
        <div className="p-4">
            <h3 className="fw-bold mb-3">Manajemen Reservasi</h3>
            <Card>
                <Card.Body>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="form" title={editId ? "Edit Reservasi" : "Form Reservasi"}>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Tamu</Form.Label>
                                            <Form.Select value={form.guest_id} onChange={(e) => setForm({ ...form, guest_id: e.target.value })} required>
                                                <option value="">-- Pilih Tamu --</option>
                                                {guests.map((g) => (
                                                    <option key={g.guest_id} value={g.guest_id}>{g.full_name}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Kamar</Form.Label>
                                            <Form.Select value={form.room_id} onChange={(e) => setForm({ ...form, room_id: e.target.value })} required>
                                                <option value="">-- Pilih Kamar --</option>
                                                {rooms.map((r) => (
                                                    <option key={r.room_id} value={r.room_id}>
                                                        {r.room_number} - {r.type_name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Label>Check-in</Form.Label>
                                        <Form.Control type="date" value={form.check_in_date} onChange={(e) => setForm({ ...form, check_in_date: e.target.value })} required />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Check-out</Form.Label>
                                        <Form.Control type="date" value={form.check_out_date} onChange={(e) => setForm({ ...form, check_out_date: e.target.value })} required />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Label>Jumlah Tamu</Form.Label>
                                        <Form.Control type="number" min="1" value={form.number_of_guests} onChange={(e) => setForm({ ...form, number_of_guests: e.target.value })} />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                            <option value="booked">Booked</option>
                                            <option value="checked_in">Checked In</option>
                                            <option value="checked_out">Checked Out</option>
                                            <option value="cancelled">Cancelled</option>
                                        </Form.Select>
                                    </Col>
                                </Row>

                                <p><strong>Total Hari:</strong> {days} | <strong>Total Harga:</strong> Rp{totalPrice.toLocaleString("id-ID")}</p>

                                <Button type="submit" variant="primary">{editId ? "Update" : "Simpan"} Reservasi</Button>
                            </Form>
                        </Tab>

                        <Tab eventKey="list" title="Daftar Reservasi">
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Tamu</th>
                                        <th>Kamar</th>
                                        <th>Tgl Check-in</th>
                                        <th>Tgl Check-out</th>
                                        <th>Jumlah Tamu</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.map((r) => (
                                        <tr key={r.reservation_id}>
                                            <td>{guests.find(g => g.guest_id === r.guest_id)?.full_name || r.guest_id}</td>
                                            <td>{rooms.find(ro => ro.room_id === r.room_id)?.room_number || r.room_id}</td>
                                            <td>{r.check_in_date}</td>
                                            <td>{r.check_out_date}</td>
                                            <td>{r.number_of_guests}</td>
                                            <td>{r.status}</td>
                                            <td>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEdit(r)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(r.reservation_id)}
                                                >
                                                    Hapus
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ReservationForm;
