import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Button, Modal, Form, Card, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const RoomServices = () => {
    const [services, setServices] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        reservation_id: "",
        service_description: "",
        status: "pending",
    });

    const [search, setSearch] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchServices();
        fetchReservations();
    }, []);

    const fetchServices = async () => {
        const res = await api.get("/services");
        setServices(res.data);
    };

    const fetchReservations = async () => {
        const res = await api.get("/reservations");
        setReservations(res.data);
    };

    const handleShow = (data = null) => {
        setEditId(data?.request_id || null);
        setForm(
            data
                ? {
                    reservation_id: data.reservation_id,
                    service_description: data.service_description,
                    status: data.status,
                    fee: data.fee ?? "", // ✅ tambahkan ini!
                }
                : {
                    reservation_id: "",
                    service_description: "",
                    status: "pending",
                    fee: "", // ✅ default juga
                }
        );
        setShow(true);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await api.put(`/services/${editId}`, form);
        } else {
            await api.post("/services", form);
        }
        setShow(false);
        fetchServices();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hapus layanan ini?")) {
            await api.delete(`/services/${id}`);
            fetchServices();
        }
    };

    const filtered = services.filter((s) =>
        s.service_description.toLowerCase().includes(search.toLowerCase()) ||
        s.full_name?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const displayed = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4">
            <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold text-dark m-0">Layanan Kamar</h5>
                    <Button size="sm" onClick={() => handleShow()}>+ Tambah</Button>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
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
                        <Col md={{ span: 4, offset: 5 }}>
                            <Form.Label>Cari</Form.Label>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Cari deskripsi / nama tamu..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </Col>
                    </Row>

                    <div className="table-responsive">
                        <Table striped bordered hover style={{ fontSize: "13px" }}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Tamu</th>
                                    <th>Reservasi ID</th>
                                    <th>Layanan</th>
                                    <th>Biaya</th>
                                    <th>Waktu Permintaan</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayed.map((s, i) => (
                                    <tr key={s.request_id}>
                                        <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                        <td>{s.full_name || "-"}</td>
                                        <td>RSV-{s.reservation_id}</td>
                                        <td>{s.service_description}</td>
                                        <td>Rp{parseInt(s.fee || 0).toLocaleString("id-ID")}</td>
                                        <td>{new Date(s.request_time).toLocaleString("id-ID")}</td>
                                        <td>
                                            <span className={`badge text-bg-${s.status === "pending"
                                                ? "warning"
                                                : s.status === "completed"
                                                    ? "success"
                                                    : "danger"
                                                }`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleShow(s)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(s.request_id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}

                                {displayed.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted">
                                            Tidak ada data ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <span style={{ fontSize: "13px" }}>
                            Menampilkan {displayed.length} dari {filtered.length} data
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

            {/* Modal Tambah/Edit */}
            <Modal show={show} onHide={() => setShow(false)} backdropClassName="modal-backdrop-custom" style={{ fontSize: "14px", zIndex: 2000 }}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editId ? "Edit" : "Tambah"} Layanan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Reservasi</Form.Label>
                            <Form.Select
                                value={form.reservation_id}
                                onChange={(e) =>
                                    setForm({ ...form, reservation_id: e.target.value })
                                }
                                required
                            >
                                <option value="">-- Pilih Reservasi --</option>
                                {reservations.map((r) => (
                                    <option key={r.reservation_id} value={r.reservation_id}>
                                        Tamu {r.reservation_id} - {r.guest_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Deskripsi Layanan</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={form.service_description}
                                onChange={(e) =>
                                    setForm({ ...form, service_description: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Biaya Layanan</Form.Label>
                            <Form.Control
                                type="number"
                                value={form.fee ?? ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setForm({ ...form, fee: value === "" ? "" : parseInt(value) });
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={form.status}
                                onChange={(e) =>
                                    setForm({ ...form, status: e.target.value })
                                }
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Selesai</option>
                                <option value="cancelled">Dibatalkan</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)}>
                            Batal
                        </Button>
                        <Button variant="success" type="submit">
                            Simpan
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default RoomServices;