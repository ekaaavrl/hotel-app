import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        username: "",
        password: "",
        full_name: "",
        email: "",
        role: "staff",
        status: "active",
    });

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Gagal ambil pengguna:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleShow = (data = null) => {
        setEditingId(data?.user_id || null);
        setForm(
            data
                ? {
                    username: data.username,
                    password: "",
                    full_name: data.full_name,
                    email: data.email,
                    role: data.role,
                    status: data.status,
                }
                : {
                    username: "",
                    password: "",
                    full_name: "",
                    email: "",
                    role: "staff",
                    status: "active",
                }
        );
        setShow(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/users/${editingId}`, form);
            } else {
                await api.post("/users", form);
            }
            setShow(false);
            setEditingId(null);
            fetchUsers();
        } catch (err) {
            console.error("Gagal menyimpan user:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus pengguna ini?")) {
            await api.delete(`/users/${id}`);
            fetchUsers();
        }
    };

    return (
        <div className="container-fluid py-4">
            <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-dark">Data Pengguna</h5>
                    <Button variant="primary" size="sm" onClick={() => handleShow()}>
                        + Tambah
                    </Button>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table bordered hover id="dataTable" className="table" width="100%" style={{ fontSize: "13px" }}>
                            <thead className="thead-light">
                                <tr>
                                    <th>No</th>
                                    <th>Username</th>
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Ditambahkan</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, i) => (
                                    <tr key={u.user_id}>
                                        <td>{i + 1}</td>
                                        <td>{u.username}</td>
                                        <td>{u.full_name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.role}</td>
                                        <td>
                                            <span className={`badge px-2 py-1 ${u.status === "active" ? "bg-success text-white" : "bg-danger text-white"}`}>
                                                {u.status === "active" ? "Aktif" : "Nonaktif"}
                                            </span>
                                        </td>
                                        <td>{new Date(u.created_at).toLocaleString("id-ID")}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleShow(u)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(u.user_id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Modal Form */}
            <Modal show={show} onHide={() => setShow(false)} backdropClassName="modal-backdrop-custom" style={{ fontSize: "14px", zIndex: 2000 }}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingId ? "Edit" : "Tambah"} Pengguna</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {!editingId && (
                            <>
                                <Form.Group className="mb-2">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                            >
                                <option value="admin">Admin</option>
                                <option value="resepsionis">Resepsionis</option>
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                            </Form.Select>
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

export default Users;
