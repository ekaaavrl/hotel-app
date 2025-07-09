import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Button, Modal, Form } from "react-bootstrap";

const Staff = () => {
    const [staffs, setStaffs] = useState([]);
    const [show, setShow] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        full_name: "",
        position: "",
        email: "",
        phone_number: "",
        hire_date: "",
        status: "active",
    });

    const fetchStaff = async () => {
        const res = await api.get("/staff");
        setStaffs(res.data);
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleShow = (data = null) => {
        setEditingId(data?.staff_id || null);
        setForm(
            data || {
                full_name: "",
                position: "",
                email: "",
                phone_number: "",
                hire_date: "",
                status: "active",
            }
        );
        setShow(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await api.put(`/staff/${editingId}`, form);
        } else {
            await api.post("/staff", form);
        }
        setShow(false);
        fetchStaff();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus data ini?")) {
            await api.delete(`/staff/${id}`);
            fetchStaff();
        }
    };

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">Data Karyawan</h3>
                <Button onClick={() => handleShow()}>+ Tambah</Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nama</th>
                        <th>Posisi</th>
                        <th>Email</th>
                        <th>HP</th>
                        <th>Tgl Masuk</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {staffs.map((s, i) => (
                        <tr key={s.staff_id}>
                            <td>{i + 1}</td>
                            <td>{s.full_name}</td>
                            <td>{s.position}</td>
                            <td>{s.email}</td>
                            <td>{s.phone_number}</td>
                            <td>{s.hire_date}</td>
                            <td>{s.status}</td>
                            <td>
                                <Button size="sm" variant="warning" onClick={() => handleShow(s)} className="me-2">
                                    Edit
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(s.staff_id)}>
                                    Hapus
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal Form Tambah/Edit */}
            <Modal show={show} onHide={() => setShow(false)}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingId ? "Edit" : "Tambah"} Staff</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                value={form.full_name}
                                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Posisi</Form.Label>
                            <Form.Control
                                value={form.position}
                                onChange={(e) => setForm({ ...form, position: e.target.value })}
                                required
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
                            <Form.Label>No HP</Form.Label>
                            <Form.Control
                                value={form.phone_number}
                                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Tanggal Masuk</Form.Label>
                            <Form.Control
                                type="date"
                                value={form.hire_date}
                                onChange={(e) => setForm({ ...form, hire_date: e.target.value })}
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
                        <Button type="submit" variant="success">
                            Simpan
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default Staff;
