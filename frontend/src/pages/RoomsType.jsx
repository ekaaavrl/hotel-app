import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { InputGroup } from "react-bootstrap";

const RoomTypes = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({ type_name: "", description: "", default_price: "" });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        const res = await api.get("/room-types");
        setRoomTypes(res.data);
    };

    useEffect(() => { fetchData(); }, []);

    const handleShow = (data = null) => {
        setEditingId(data?.room_type_id || null);
        setForm(data || { type_name: "", description: "", default_price: "" });
        setShow(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await api.put(`/room-types/${editingId}`, form);
        } else {
            await api.post("/room-types", form);
        }
        setShow(false);
        fetchData();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hapus data ini?")) {
            await api.delete(`/room-types/${id}`);
            fetchData();
        }
    };

    const filteredData = roomTypes.filter((item) =>
        item.type_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid py-4">
            <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-dark">Data Tipe Kamar</h5>
                    <Button variant="primary" size="sm" onClick={() => handleShow()}>
                        + Tambah
                    </Button>
                </Card.Header>
                <Card.Body>
                    <InputGroup className="mb-3" style={{ maxWidth: "250px", fontSize: "13px" }}>
                        <InputGroup.Text>
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Cari tipe kamar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    <div className="table-responsive">
                        <Table bordered hover className="table" width="100%" style={{ fontSize: "13px" }}>
                            <thead className="thead-light">
                                <tr>
                                    <th>#</th>
                                    <th>Nama Tipe</th>
                                    <th>Harga Default</th>
                                    <th>Deskripsi</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, i) => (
                                    <tr key={item.room_type_id}>
                                        <td>{i + 1}</td>
                                        <td>{item.type_name}</td>
                                        <td>Rp{parseInt(item.default_price).toLocaleString("id-ID")}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                className="me-2"
                                                onClick={() => handleShow(item)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => handleDelete(item.room_type_id)}
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

            <Modal show={show} onHide={() => setShow(false)} style={{ fontSize: "14px" }}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingId ? "Edit" : "Tambah"} Tipe Kamar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Nama Tipe</Form.Label>
                            <Form.Control
                                value={form.type_name}
                                onChange={(e) => setForm({ ...form, type_name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Harga Default</Form.Label>
                            <Form.Control
                                type="number"
                                value={form.default_price}
                                onChange={(e) => setForm({ ...form, default_price: e.target.value })}
                                required
                            />
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

export default RoomTypes;
