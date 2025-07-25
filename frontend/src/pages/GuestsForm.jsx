import React, { useEffect, useState } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import api from "../services/api";

const GuestForm = () => {
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        address: "",
        id_number: "",
        nationality: "",
    });
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
            setError("");
            setSuccess("Data tamu berhasil disimpan.");
        } catch (err) {
            console.error("Gagal simpan tamu:", err);
            setError("Gagal menyimpan data tamu.");
            setSuccess("");
        }
    };

    return (
        <div className="container-fluid py-4">
            <Card className="shadow mb-4">
                <Card.Header className="py-3">
                    <h5 className="m-0 fw-bold text-dark">{editId ? "Edit Tamu" : "Form Tambah Tamu"}</h5>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Nama Lengkap</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Masukkan nama lengkap"
                                    value={form.full_name}
                                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Masukkan email"
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
                                    type="number"
                                    placeholder="Masukkan nomor HP"
                                    value={form.phone_number}
                                    onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Alamat</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Masukkan alamat"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>No KTP / Paspor</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Masukkan nomor identitas"
                                    value={form.id_number}
                                    onChange={(e) => setForm({ ...form, id_number: e.target.value })}
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Kebangsaan</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Masukkan negara asal"
                                    value={form.nationality}
                                    onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                                />
                            </Col>
                        </Row>
                        <div className="d-flex gap-2">
                            <Button type="submit" variant="primary">
                                {editId ? "Update" : "Simpan"} Tamu
                            </Button>
                            {editId && (
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setForm({
                                            full_name: "",
                                            email: "",
                                            phone_number: "",
                                            address: "",
                                            id_number: "",
                                            nationality: "",
                                        });
                                        setEditId(null);
                                    }}
                                >
                                    Batal
                                </Button>
                            )}
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default GuestForm;
