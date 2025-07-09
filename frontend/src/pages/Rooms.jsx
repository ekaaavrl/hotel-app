import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Button, Modal, Form } from "react-bootstrap";

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        room_number: "",
        room_type_id: "",
        price_per_night: "",
        status: "available",
        description: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all"); // 🔍 filter status

    const fetchRooms = async () => {
        const res = await api.get("/rooms");
        setRooms(res.data);
    };

    const fetchRoomTypes = async () => {
        const res = await api.get("/room-types");
        setRoomTypes(res.data);
    };

    useEffect(() => {
        fetchRooms();
        fetchRoomTypes();
    }, []);

    const handleShow = (data = null) => {
        setEditingId(data?.room_id || null);
        setForm(data || {
            room_number: "",
            room_type_id: "",
            price_per_night: "",
            status: "available",
            description: "",
        });
        setShow(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await api.put(`/rooms/${editingId}`, form);
        } else {
            await api.post("/rooms", form);
        }
        setShow(false);
        fetchRooms();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hapus kamar ini?")) {
            await api.delete(`/rooms/${id}`);
            fetchRooms();
        }
    };

    // 🔍 Filter data berdasarkan status
    const filteredRooms = rooms.filter((room) =>
        statusFilter === "all" ? true : room.status === statusFilter
    );

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">Data Kamar</h3>
                <Button onClick={() => handleShow()}>+ Tambah</Button>
            </div>

            {/* 🔽 Dropdown Filter */}
            <Form.Select
                className="mb-3"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="all">Semua Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
            </Form.Select>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nomor</th>
                        <th>Tipe</th>
                        <th>Harga/Malam</th>
                        <th>Status</th>
                        <th>Deskripsi</th>
                        <th>Aksi</th>
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
                                <span className={`badge bg-${room.status === "available" ? "success" : room.status === "maintenance" ? "warning" : "secondary"}`}>
                                    {room.status}
                                </span>
                            </td>
                            <td>{room.description}</td>
                            <td>
                                <Button size="sm" variant="warning" onClick={() => handleShow(room)}>Edit</Button>{" "}
                                <Button size="sm" variant="danger" onClick={() => handleDelete(room.room_id)}>Hapus</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingId ? "Edit" : "Tambah"} Kamar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Nomor Kamar</Form.Label>
                            <Form.Control value={form.room_number} onChange={(e) => setForm({ ...form, room_number: e.target.value })} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tipe Kamar</Form.Label>
                            <Form.Select value={form.room_type_id} onChange={(e) => setForm({ ...form, room_type_id: e.target.value })}>
                                <option value="">-- Pilih --</option>
                                {roomTypes.map((type) => (
                                    <option key={type.room_type_id} value={type.room_type_id}>{type.type_name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Harga / Malam</Form.Label>
                            <Form.Control type="number" value={form.price_per_night} onChange={(e) => setForm({ ...form, price_per_night: e.target.value })} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Deskripsi</Form.Label>
                            <Form.Control as="textarea" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="success">Simpan</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default Rooms;
