import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Form, Button, Row, Col, Alert, Tabs, Tab, Table, Card } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const maxGuestsByRoomType = {
    single: 2,
    double: 3,
    deluxe: 5,
    suite: 10,
};

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
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [editId, setEditId] = useState(null);
    const [days, setDays] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("form");

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { headers: { Authorization: `Bearer ${token}` } };

            const [guestRes, roomRes, reservationRes] = await Promise.all([
                api.get("/guests", headers),
                api.get("/rooms", headers),
                api.get("/reservations", headers),
            ]);

            setGuests(guestRes.data);
            setRooms(roomRes.data);
            setReservations(reservationRes.data);
        } catch (err) {
            console.error("Gagal fetch data:", err);
            setError("Gagal mengambil data. Pastikan Anda sudah login.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getMaxGuests = () => {
        const selectedRoom = rooms.find(r => r.room_id == form.room_id);
        return selectedRoom ? maxGuestsByRoomType[selectedRoom.type_name.toLowerCase()] || 1 : 1;
    };

    useEffect(() => {
        const d1 = new Date(form.check_in_date);
        const d2 = new Date(form.check_out_date);
        const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
        setDays(diff > 0 ? diff : 0);

        const selectedRoom = rooms.find(r => r.room_id == form.room_id);
        setTotalPrice(selectedRoom && diff > 0 ? selectedRoom.price_per_night * diff : 0);
    }, [form.check_in_date, form.check_out_date, form.room_id]);

    useEffect(() => {
        const maxGuests = getMaxGuests();
        if (form.number_of_guests > maxGuests) {
            setForm(prev => ({ ...prev, number_of_guests: maxGuests }));
        }
    }, [form.room_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const headers = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                guest_id: form.guest_id,
                room_id: form.room_id,
                check_in_date: form.check_in_date,
                check_out_date: form.check_out_date,
                number_of_guests: form.number_of_guests,
                status: form.status,
                total_price: totalPrice,
            };

            if (editId) {
                await api.put(`/reservations/${editId}`, payload, headers);
                setAlert({ show: true, message: "Reservasi berhasil diupdate", variant: "success" });
            } else {
                await api.post("/reservations", payload, headers);
                setAlert({ show: true, message: "Reservasi berhasil disimpan", variant: "success" });
            }

            setTimeout(() => {
                setAlert({ show: false, message: "", variant: "success" });
            }, 3000);

            fetchData();
            handleCancelEdit();
            setActiveTab("list");
        } catch (error) {
            console.error(error);
            setAlert({ show: true, message: "Terjadi kesalahan saat menyimpan", variant: "danger" });
        }
    };

    const handleEdit = (data) => {
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toISOString().split("T")[0]; // hasil: "2025-07-22"
        };

        setForm({
            guest_id: data.guest_id,
            room_id: data.room_id,
            check_in_date: formatDate(data.check_in_date),
            check_out_date: formatDate(data.check_out_date),
            number_of_guests: Number(data.number_of_guests),
            status: data.status,
        });

        setEditId(data.reservation_id);
        setActiveTab("form");
    };


    const handleCancelEdit = () => {
        setForm({
            guest_id: "",
            room_id: "",
            check_in_date: "",
            check_out_date: "",
            number_of_guests: 1,
            status: "booked",
        });
        setEditId(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus reservasi ini?")) {
            try {
                await api.delete(`/reservations/${id}`);
                fetchData();
            } catch (err) {
                console.error("Gagal menghapus reservasi:", err.response?.data || err.message);
                alert("Terjadi kesalahan saat menghapus reservasi.");
            }
        }
    };

    const maxGuests = getMaxGuests();

    return (
        <div className="p-4">
            <Card className="shadow">
                <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-dark">Manajemen Reservasi</h5>
                </Card.Header>

                <Card.Body>
                    <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                        <Tab eventKey="form" title={editId ? "Edit Reservasi" : "Form Reservasi"}>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Tamu</Form.Label>
                                            <Form.Select
                                                value={form.guest_id}
                                                onChange={(e) => setForm({ ...form, guest_id: e.target.value })}
                                                required
                                            >
                                                <option value="">-- Pilih Tamu --</option>
                                                {guests.map((g) => (
                                                    <option key={g.guest_id} value={g.guest_id}>
                                                        {g.full_name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Kamar</Form.Label>
                                            <Form.Select
                                                value={form.room_id}
                                                onChange={(e) => {
                                                    const roomId = e.target.value;
                                                    const selected = rooms.find(r => r.room_id == roomId);
                                                    const max = selected ? maxGuestsByRoomType[selected.type_name.toLowerCase()] : 1;
                                                    setForm({
                                                        ...form,
                                                        room_id: roomId,
                                                        number_of_guests: max, // reset sesuai kamar
                                                    });
                                                }}
                                                required
                                            >
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
                                        <Form.Control
                                            type="date"
                                            value={form.check_in_date}
                                            onChange={(e) => setForm({ ...form, check_in_date: e.target.value })}
                                            required
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Check-out</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={form.check_out_date}
                                            onChange={(e) => setForm({ ...form, check_out_date: e.target.value })}
                                            required
                                        />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Label>Jumlah Tamu</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            max={maxGuests}
                                            value={form.number_of_guests}
                                            onChange={(e) => {
                                                let input = e.target.value;

                                                // Hanya izinkan angka, kosong boleh
                                                if (input === "" || /^[0-9]+$/.test(input)) {
                                                    let value = parseInt(input) || "";

                                                    // Batasi maksimal sesuai tipe kamar
                                                    if (value > maxGuests) {
                                                        value = maxGuests;
                                                    }

                                                    // Batasi minimal 1 (kalau kamu mau default 1)
                                                    if (value !== "" && value < 1) {
                                                        value = 1;
                                                    }

                                                    setForm({
                                                        ...form,
                                                        number_of_guests: value,
                                                    });
                                                }
                                            }}
                                        />
                                        <Form.Text className="text-muted">
                                            Maksimal tamu untuk kamar ini: {maxGuests}
                                        </Form.Text>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                            value={form.status}
                                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        >
                                            <option value="booked">Booked</option>
                                            <option value="checked_in">Checked In</option>
                                            <option value="checked_out">Checked Out</option>
                                            <option value="cancelled">Cancelled</option>
                                        </Form.Select>
                                    </Col>
                                </Row>

                                <p>
                                    <strong>Total Hari:</strong> {days} |{" "}
                                    <strong>Total Harga:</strong> Rp{totalPrice.toLocaleString("id-ID")}
                                </p>

                                <div className="d-flex gap-2 mt-3">
                                    <Button type="submit" variant="primary">
                                        {editId ? "Update" : "Simpan"} Reservasi
                                    </Button>
                                    {editId && (
                                        <Button variant="secondary" onClick={handleCancelEdit}>
                                            Batal
                                        </Button>
                                    )}
                                </div>

                            </Form>
                        </Tab>

                        <Tab eventKey="list" title="Daftar Reservasi">
                            <Table striped bordered hover responsive style={{ fontSize: '12px' }}>
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
                                            <td>{r.check_in_date?.slice(0, 10)}</td>
                                            <td>{r.check_out_date?.slice(0, 10)}</td>
                                            <td>{r.number_of_guests}</td>
                                            <td>{r.status}</td>
                                            <td>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEdit(r)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(r.reservation_id)}
                                                >
                                                    <FaTrash />
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
