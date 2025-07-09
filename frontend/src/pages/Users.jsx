import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Button, Modal, Form } from "react-bootstrap";

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
        const res = await api.get("/users");
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleShow = (data = null) => {
        setEditingId(data?.user_id || null);
        setForm(
            data
                ? { ...data, password: "" } // kosongkan password saat edit
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
        if (editingId) {
            await api.put(`/users/${editingId}`, form);
        } else {
            await api.post("/users", form);
        }
        setShow(false);
        fetchUsers();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin hapus user ini?")) {
            await api.delete(`/users/${id}`);
            fetchUsers();
        }
    };

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">Data Pengguna</h3>
                <Button variant="primary" onClick={() => handleShow()}>
                    + Tambah
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
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
                            <td>{u.status}</td>
                            <td>{new Date(u.created_at).toLocaleString("id-ID")}</td>
                            <td>
                                <Button
                                    size="sm"
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => handleShow(u)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleDelete(u.user_id)}
                                >
                                    Hapus
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal Form User */}
            <Modal show={show} onHide={() => setShow(false)}>
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
                                <option value="receptionist">Receptionist</option>
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
