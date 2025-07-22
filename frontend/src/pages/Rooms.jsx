import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Button, Modal, Form, Card, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

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
    const [statusFilter, setStatusFilter] = useState("all");

    // pagination dan search
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

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

    const getStatusBadge = (status) => {
        if (status === "available") return "success";
        if (status === "maintenance") return "warning";
        if (status === "occupied") return "secondary";
        return "dark";
    };

    // filter status & search
    const filteredRooms = rooms
        .filter((room) =>
            statusFilter === "all" ? true : room.status === statusFilter
        )
        .filter((room) =>
            room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
    const displayedRooms = filteredRooms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container-fluid py-4">
            <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-dark">Data Kamar</h5>
                    <Button variant="primary" size="sm" onClick={() => handleShow()}>
                        + Tambah
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-2">
                        <Col md={3}>
                            <Form.Label>Show entries</Form.Label>
                            <Form.Select
                                size="sm"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                size="sm"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">Semua Status</option>
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                            </Form.Select>
                        </Col>
                        <Col md={{ span: 4, offset: 2 }}>
                            <Form.Label>Cari</Form.Label>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Cari kamar..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </Col>
                    </Row>

                    <div className="table-responsive">
                        <Table bordered hover className="table" style={{ fontSize: "13px" }}>
                            <thead className="thead-light">
                                <tr>
                                    <th>No</th>
                                    <th>No Kamar</th>
                                    <th>Tipe</th>
                                    <th>Harga/Malam</th>
                                    <th>Status</th>
                                    <th>Deskripsi</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedRooms.map((room, i) => (
                                    <tr key={room.room_id}>
                                        <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                        <td>{room.room_number}</td>
                                        <td>{room.type_name}</td>
                                        <td>Rp{parseInt(room.price_per_night).toLocaleString("id-ID")}</td>
                                        <td>
                                            <span className={`badge bg-${getStatusBadge(room.status)} text-white`}>
                                                {room.status}
                                            </span>
                                        </td>
                                        <td>{room.description}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleShow(room)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(room.room_id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {displayedRooms.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            Tidak ada data ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <span style={{ fontSize: "13px" }}>
                            Menampilkan {displayedRooms.length} dari {filteredRooms.length} data
                        </span>
                        <div>
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="me-2"
                            >
                                Prev
                            </Button>
                            <span style={{ fontSize: "13px" }}>
                                Halaman {currentPage} / {totalPages || 1}
                            </span>
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="ms-2"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Modal Input */}
            <Modal show={show} onHide={() => setShow(false)} style={{ fontSize: "14px" }}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingId ? "Edit" : "Tambah"} Kamar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Nomor Kamar</Form.Label>
                            <Form.Control
                                value={form.room_number}
                                onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Tipe Kamar</Form.Label>
                            <Form.Select
                                value={form.room_type_id}
                                onChange={(e) => setForm({ ...form, room_type_id: e.target.value })}
                            >
                                <option value="">-- Pilih --</option>
                                {roomTypes.map((type) => (
                                    <option key={type.room_type_id} value={type.room_type_id}>
                                        {type.type_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Harga / Malam</Form.Label>
                            <Form.Control
                                type="number"
                                value={form.price_per_night}
                                onChange={(e) => setForm({ ...form, price_per_night: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Deskripsi</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)}>
                            Batal
                        </Button>
                        <Button type="submit" variant="success">
                            Simpan
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default Rooms;
