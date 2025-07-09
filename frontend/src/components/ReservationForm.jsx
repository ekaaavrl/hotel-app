import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";

const ReservationForm = () => {
    const [guests, setGuests] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState({
        guest_id: "",
        room_id: "",
        check_in_date: "",
        check_out_date: "",
        number_of_guests: 1,
        status: "booked",
    });
    const [days, setDays] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/guests").then(res => setGuests(res.data));
        api.get("/rooms").then(res => setRooms(res.data));
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
            await api.post("/reservations", form);
            alert("Reservasi berhasil disimpan!");
            setForm({ guest_id: "", room_id: "", check_in_date: "", check_out_date: "", number_of_guests: 1, status: "booked" });
            setDays(0);
            setTotalPrice(0);
        } catch (err) {
            setError(err.response?.data?.message || "Terjadi kesalahan saat menyimpan.");
        }
    };

    return (
        <div className="p-4">
            <h3 className="fw-bold mb-3">Form Reservasi</h3>
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

                <Button type="submit" variant="primary">Simpan</Button>
            </Form>
        </div>
    );
};

export default ReservationForm;
