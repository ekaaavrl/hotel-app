import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Form, Button, Row, Col, Alert, Tabs, Tab, Table, Card } from "react-bootstrap";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { InputGroup } from "react-bootstrap";

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
    const [searchTerm, setSearchTerm] = useState("");

    const filteredReservations = reservations.filter((r) => {
        const guestName = guests.find((g) => g.guest_id === r.guest_id)?.full_name || "";
        const roomNumber = rooms.find((ro) => ro.room_id === r.room_id)?.room_number || "";
        const values = [
            `RSV-${r.reservation_id}`,
            guestName,
            roomNumber,
            r.check_in_date,
            r.check_out_date,
            r.number_of_guests?.toString(),
            r.status
        ];

        return values.some((val) =>
            val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });


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
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - offset * 60 * 1000);
            return localDate.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
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
    useEffect(() => {
        if (!form.reservation_date || !days || !form.room_id) return;

        const checkIn = new Date(`${form.reservation_date}T12:00:00`);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkIn.getDate() + Number(days));

        const selectedRoom = rooms.find(r => r.room_id == form.room_id);
        const price = selectedRoom ? selectedRoom.price_per_night : 0;

        setForm(prev => ({
            ...prev,
            check_in_date: checkIn.toISOString().slice(0, 16),
            check_out_date: checkOut.toISOString().slice(0, 16),
        }));

        setTotalPrice(days * price);
    }, [form.reservation_date, days, form.room_id]);


    return (
        <div className="p-4">
            <Card className="shadow">
                <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-dark">Manajemen Reservasi</h5>
                </Card.Header>

                <Card.Body>

                    <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3 custom-tabs">
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
                                            <Form.Label>Jenis Kamar</Form.Label>
                                            <Form.Select
                                                value={form.type_name || ""}
                                                onChange={(e) => {
                                                    const type = e.target.value;

                                                    const typeRanges = {
                                                        single: [101, 200],
                                                        double: [201, 300],
                                                        deluxe: [301, 400],
                                                        suite: [401, 500],
                                                    };

                                                    const [min, max] = typeRanges[type.toLowerCase()] || [0, Infinity];

                                                    // Ambil semua room_id yang sudah dibooked atau checked_in
                                                    const occupiedRoomIds = reservations
                                                        .filter(r => r.status === "booked" || r.status === "checked_in")
                                                        .map(r => r.room_id);

                                                    // Filter rooms berdasarkan type, rentang nomor, dan status kamar masih available
                                                    const availableRooms = rooms
                                                        .filter(r =>
                                                            r.type_name === type &&
                                                            Number(r.room_number) >= min &&
                                                            Number(r.room_number) <= max &&
                                                            !occupiedRoomIds.includes(r.room_id)
                                                        )
                                                        .sort((a, b) => Number(a.room_number) - Number(b.room_number));

                                                    const selectedRoom = availableRooms[0]; // ambil nomor terkecil yang tersedia

                                                    const maxGuests = maxGuestsByRoomType[type.toLowerCase()] || 1;

                                                    setForm(prev => ({
                                                        ...prev,
                                                        type_name: type,
                                                        room_id: selectedRoom?.room_id || "",
                                                        number_of_guests: maxGuests
                                                    }));
                                                }}

                                                required
                                            >
                                                <option value="">-- Pilih Jenis Kamar --</option>
                                                {[...new Set(rooms.map(r => r.type_name))].map((type, index) => (
                                                    <option key={index} value={type}>{type}</option>
                                                ))}
                                            </Form.Select>
                                            {form.room_id && (
                                                <Form.Text className="text-muted">
                                                    Nomor kamar otomatis: {rooms.find(r => r.room_id === form.room_id)?.room_number}
                                                </Form.Text>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Label>Tanggal Reservasi</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={form.reservation_date || ""}
                                            onChange={(e) => setForm({ ...form, reservation_date: e.target.value })}
                                            required
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Total Hari</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={days}
                                            onChange={(e) => setDays(Number(e.target.value))}
                                            required
                                        />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Label>Check-in</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={form.check_in_date}
                                            readOnly
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Check-out</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={form.check_out_date}
                                            readOnly
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
                                                if (input === "" || /^[0-9]+$/.test(input)) {
                                                    let value = parseInt(input) || "";
                                                    if (value > maxGuests) value = maxGuests;
                                                    if (value !== "" && value < 1) value = 1;

                                                    setForm({ ...form, number_of_guests: value });
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

                        <Tab eventKey="list" title={`Daftar Reservasi`}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Cari reservasi..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>


                            <Table striped bordered hover responsive style={{ fontSize: '12px' }}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>ID Reservasi</th>
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
                                    {filteredReservations.map((r, i) => (
                                        <tr key={r.reservation_id}>
                                            <td>{i + 1}</td>
                                            <td>RSV-{r.reservation_id}</td> {/* ✅ Ini yang ditambahkan */}
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