import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Card, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const StaffList = () => {
    const [staff, setStaff] = useState([]);
    const [show, setShow] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        position: "",
        status: "active",
        username: "",
        password: "",
    });

    const fetchStaff = async () => {
        try {
            const res = await api.get("/staff");
            setStaff(res.data);
        } catch (err) {
            console.error("Gagal ambil data staff:", err);
        }
    };

    const handleShow = (id = null) => {
        if (id) {
            const selected = staff.find((s) => s.staff_id === id);
            if (selected) {
                setForm({
                    full_name: selected.full_name,
                    email: selected.email,
                    phone_number: selected.phone_number,
                    position: selected.position,
                    status: selected.status,
                    username: "", // kosongkan untuk edit
                    password: "",
                });
                setEditingId(id);
            }
        } else {
            setForm({
                full_name: "",
                email: "",
                phone_number: "",
                position: "",
                status: "active",
                username: "",
                password: "",
            });
            setEditingId(null);
        }
        setShow(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/staff/${editingId}`, form);
            } else {
                await api.post("/staff", form);
            }
            setShow(false);
            fetchStaff();
        } catch (err) {
            console.error("Gagal simpan staff:", err);
        }
    };

    const handleDelete = async (staffId) => {
        if (window.confirm("Yakin ingin menghapus data staff ini?")) {
            try {
                await api.delete(`/staff/${staffId}`);
                fetchStaff();
            } catch (err) {
                console.error("Gagal hapus data staff:", err);
            }
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    return (
        <div className="container-fluid py-4">
            <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-dark">Data Staff</h5>
                    <Button variant="success" size="sm" onClick={() => handleShow()}>
                        <FaPlus className="me-1" /> Tambah
                    </Button>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table bordered hover responsive className="table" style={{ fontSize: "13px" }}>
                            <thead className="thead-light">
                                <tr>
                                    <th>No</th>
                                    <th>Nama</th>
                                    <th>Posisi</th>
                                    <th>Email</th>
                                    <th>No. HP</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted">
                                            Tidak ada data staff.
                                        </td>
                                    </tr>
                                ) : (
                                    staff.map((s, i) => (
                                        <tr key={s.staff_id}>
                                            <td>{i + 1}</td>
                                            <td>{s.full_name}</td>
                                            <td>{s.position}</td>
                                            <td>{s.email}</td>
                                            <td>{s.phone_number}</td>
                                            <td>
                                                <span
                                                    className={`badge px-2 py-1 ${s.status === "active" ? "bg-success text-white" : "bg-danger text-white"}`}
                                                >
                                                    {s.status === "active" ? "Aktif" : "Nonaktif"}
                                                </span>
                                            </td>

                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    className="me-2"
                                                    onClick={() => handleShow(s.staff_id)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => handleDelete(s.staff_id)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Modal Form Tambah/Edit Staff */}
            <Modal show={show} onHide={() => setShow(false)} style={{ fontSize: "14px" }}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingId ? "Edit" : "Tambah"} Staff</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {!editingId && (
                            <>
                                <Form.Group className="mb-2">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        value={form.username}
                                        onChange={(e) =>
                                            setForm({ ...form, username: e.target.value })
                                        }
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={form.password}
                                        onChange={(e) =>
                                            setForm({ ...form, password: e.target.value })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </>
                        )}

                        <Form.Group className="mb-2">
                            <Form.Label>Nama Lengkap</Form.Label>
                            <Form.Control
                                value={form.full_name}
                                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>No. HP</Form.Label>
                            <Form.Control
                                value={form.phone_number}
                                onChange={(e) =>
                                    setForm({ ...form, phone_number: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Posisi</Form.Label>
                            <Form.Control
                                value={form.position}
                                onChange={(e) =>
                                    setForm({ ...form, position: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="active">Aktif</option>
                                <option value="inactive">Nonaktif</option>
                            </Form.Select>
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

export default StaffList;
