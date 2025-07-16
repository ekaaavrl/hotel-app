import React, { useEffect, useState } from "react";
import { Tabs, Tab, Form, Button, Table, Card, Row, Col, Alert } from "react-bootstrap";
import api from "../services/api";

const Guest = () => {
    const [activeTab, setActiveTab] = useState("form");
    const [guests, setGuests] = useState([]);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        address: "",
        id_number: "",
        nationality: "",
    });
    const [error, setError] = useState("");

    const fetchGuests = async () => {
        try {
            const res = await api.get("/guests");
            setGuests(res.data);
        } catch (err) {
            console.error("Gagal ambil tamu:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/guests/${editId}`, form);
            } else {
                await api.post("/guests", form);
            }
            setForm({
                full_name: "",
                email: "",
                phone_number: "",
                address: "",
                id_number: "",
                nationality: "",
            });
            setEditId(null);
            fetchGuests();
            setActiveTab("list");
            setError("");
        } catch (err) {
            console.error("Gagal simpan tamu:", err);
            setError("Gagal menyimpan data tamu.");
        }
    };

    const handleEdit = (guest) => {
        setForm(guest);
        setEditId(guest.guest_id);
        setActiveTab("form");
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin hapus tamu ini?")) {
            await api.delete(`/guests/${id}`);
            fetchGuests();
        }
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    return (
        <div className="p-4">
            <h4>Manajemen Data Tamu</h4>
            <Card>
                <Card.Body>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="form" title="Form Tamu">
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Label>Nama Lengkap</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={form.full_name}
                                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                            required
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            required
                                        />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Label>No HP</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={form.phone_number}
                                            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                                            required
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Alamat</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Label>No KTP / Paspor</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={form.id_number}
                                            onChange={(e) => setForm({ ...form, id_number: e.target.value })}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Kebangsaan</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={form.nationality}
                                            onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                                        />
                                    </Col>
                                </Row>

                                <Button type="submit" variant="primary">
                                    {editId ? "Update" : "Tambah"} Tamu
                                </Button>
                            </Form>
                        </Tab>

                        <Tab eventKey="list" title="Daftar Tamu">
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>HP</th>
                                        <th>Negara</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guests.map((guest) => (
                                        <tr key={guest.guest_id}>
                                            <td>{guest.full_name}</td>
                                            <td>{guest.email}</td>
                                            <td>{guest.phone_number}</td>
                                            <td>{guest.nationality}</td>
                                            <td>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEdit(guest)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(guest.guest_id)}
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

export default Guest;
