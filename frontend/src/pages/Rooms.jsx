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
    const [activeTypeTab, setActiveTypeTab] = useState("all");

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchRooms();
        fetchRoomTypes();
    }, []);

    const fetchRooms = async () => {
        const res = await api.get("/rooms");
        setRooms(res.data);
    };

    const fetchRoomTypes = async () => {
        const res = await api.get("/room-types");
        setRoomTypes(res.data);
    };

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

    const filteredRooms = rooms
        .filter((room) => statusFilter === "all" || room.status === statusFilter)
        .filter((room) =>
            room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((room) =>
            activeTypeTab === "all" ? true : room.type_name === activeTypeTab
        )
        .sort((a, b) => parseInt(a.room_number) - parseInt(b.room_number));

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
                    {/* Filter & Search */}
                    <Row className="mb-3">
                        <Col md={4}>
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
                        <Col md={{ span: 4, offset: 4 }}>
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

                    {/* Tabs by room type */}
                    <ul className="nav nav-tabs mb-3 custom-tabs">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTypeTab === "all" ? "active" : ""}`}
                                onClick={() => {
                                    setActiveTypeTab("all");
                                    setCurrentPage(1);
                                }}
                            >
                                Semua
                            </button>
                        </li>
                        {roomTypes.map((type) => (
                            <li className="nav-item" key={type.room_type_id}>
                                <button
                                    className={`nav-link ${activeTypeTab === type.type_name ? "active" : ""}`}
                                    onClick={() => {
                                        setActiveTypeTab(type.type_name);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {type.type_name}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="table-responsive">
                        <Table bordered hover size="sm" style={{ fontSize: "13px" }}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>No Kamar</th>
                                    <th>Tipe</th>
                                    <th>Harga</th>
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
                                            <span className={`badge bg-${getStatusBadge(room.status)}`}>
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
                                        <td colSpan="7" className="text-center text-muted">
                                            Tidak ada data.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {/* Bawah: dropdown + info + pagination */}
                    <div className="d-flex justify-content-between align-items-center mt-2 px-1 flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2">
                            <span>Show</span>
                            <Form.Select
                                size="sm"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                style={{ width: "80px" }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </Form.Select>
                            <span>entries</span>
                        </div>

                        <small className="text-muted">
                            Menampilkan {displayedRooms.length} dari {filteredRooms.length} entri
                        </small>

                        <div className="d-flex align-items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Prev
                            </Button>
                            <small>
                                Halaman {currentPage} / {totalPages || 1}
                            </small>
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Modal Input */}
            <Modal show={show} onHide={() => setShow(false)} backdropClassName="modal-backdrop-custom" style={{ fontSize: "14px", zIndex: 2000 }}>
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
