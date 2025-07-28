import React, { useEffect, useState } from "react";
import { Tabs, Tab, Card, Button, Table, Modal, Form, Row, Col } from "react-bootstrap";
import api from "../services/api";
import { FaEdit, FaTrash } from "react-icons/fa";

const GuestManagement = () => {
    const [guests, setGuests] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        address: "",
        id_number: "",
        nationality: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchGuests();
    }, []);

    const fetchGuests = async () => {
        const res = await api.get("/guests");
        const resv = await api.get("/reservations");
        setGuests(res.data);
        setReservations(resv.data);
    };

    const handleShow = (guest = null) => {
        setEditId(guest?.guest_id || null);
        setForm(
            guest || {
                full_name: "",
                email: "",
                phone_number: "",
                address: "",
                id_number: "",
                nationality: "",
            }
        );
        setShow(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await api.put(`/guests/${editId}`, form);
        } else {
            await api.post("/guests", form);
        }
        setShow(false);
        fetchGuests();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin hapus tamu ini?")) {
            await api.delete(`/guests/${id}`);
            fetchGuests();
        }
    };

    const filteredGuests = guests.filter((g) =>
        g.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.nationality?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getGuestStatus = (guest_id) => {
        const now = new Date();
        const resvs = reservations.filter((r) => r.guest_id === guest_id);
        for (const r of resvs) {
            const inDate = new Date(r.check_in_date);
            const outDate = new Date(r.check_out_date);
            if (now >= inDate && now <= outDate) return "in";
            if (now > outDate) return "out";
        }
        return "none";
    };

    const renderTable = (filter) => {
        const guestsFiltered = filteredGuests.filter((guest) => {
            const status = getGuestStatus(guest.guest_id);
            return filter === "all" || status === filter;
        });

        const totalPages = Math.ceil(guestsFiltered.length / itemsPerPage);
        const displayed = guestsFiltered.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        return (
            <>
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
                        <Form.Label>Cari Tamu</Form.Label>
                        <Form.Control
                            size="sm"
                            type="text"
                            placeholder="Cari nama, email, no hp..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
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
                                <th>Nama</th>
                                <th>Email</th>
                                <th>No HP</th>
                                <th>Alamat</th>
                                <th>KTP/Paspor</th>
                                <th>Negara</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayed.map((guest, i) => (
                                <tr key={guest.guest_id}>
                                    <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                    <td>{guest.full_name}</td>
                                    <td>{guest.email}</td>
                                    <td>{guest.phone_number || "-"}</td>
                                    <td>{guest.address}</td>
                                    <td>{guest.id_number}</td>
                                    <td>{guest.nationality}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            className="me-2"
                                            onClick={() => handleShow(guest)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => handleDelete(guest.guest_id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {displayed.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted">
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span style={{ fontSize: "13px" }}>
                        Menampilkan {displayed.length} dari {guestsFiltered.length} data
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
            </>
        );
    };

    return (
        <div className="p-4">
            <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-dark">Manajemen Tamu</h5>
                    <Button variant="dark" size="sm" onClick={() => handleShow()}>
                        + Tambah
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Tabs defaultActiveKey="all" id="guest-tabs" className="mb-3 custom-tabs">
                        <Tab eventKey="all" title="Semua Tamu">
                            {renderTable("all")}
                        </Tab>
                        <Tab eventKey="in" title="Tamu Menginap Saat Ini">
                            {renderTable("in")}
                        </Tab>
                        <Tab eventKey="out" title="Tamu Sudah Checkout">
                            {renderTable("out")}
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>

            <Modal
                show={show}
                onHide={() => setShow(false)}
                backdropClassName="modal-backdrop-custom"
                style={{ fontSize: "14px", zIndex: 2000 }}
            >
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editId ? "Edit" : "Tambah"} Tamu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Nama Lengkap</Form.Label>
                            <Form.Control
                                value={form.full_name}
                                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>No HP</Form.Label>
                            <Form.Control
                                value={form.phone_number}
                                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Alamat</Form.Label>
                            <Form.Control
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>No KTP / Paspor</Form.Label>
                            <Form.Control
                                value={form.id_number}
                                onChange={(e) => setForm({ ...form, id_number: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Kebangsaan</Form.Label>
                            <Form.Control
                                value={form.nationality}
                                onChange={(e) => setForm({ ...form, nationality: e.target.value })}
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

export default GuestManagement;
