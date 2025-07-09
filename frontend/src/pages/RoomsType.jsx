import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Button, Modal, Form } from "react-bootstrap";

const RoomTypes = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({ type_name: "", description: "", default_price: "" });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search term

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

    // 🔍 Filter berdasarkan search term
    const filteredData = roomTypes.filter((item) =>
        item.type_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">Tipe Kamar</h3>
                <Button onClick={() => handleShow()}>+ Tambah</Button>
            </div>

            {/* 🔍 Search Bar */}
            <Form.Control
                type="text"
                placeholder="Cari tipe kamar..."
                className="mb-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Table striped bordered hover>
                <thead>
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
                                <Button size="sm" variant="warning" onClick={() => handleShow(item)}>Edit</Button>{" "}
                                <Button size="sm" variant="danger" onClick={() => handleDelete(item.room_type_id)}>Hapus</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingId ? "Edit" : "Tambah"} Tipe Kamar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Nama Tipe</Form.Label>
                            <Form.Control value={form.type_name} onChange={(e) => setForm({ ...form, type_name: e.target.value })} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Harga</Form.Label>
                            <Form.Control type="number" value={form.default_price} onChange={(e) => setForm({ ...form, default_price: e.target.value })} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Deskripsi</Form.Label>
                            <Form.Control as="textarea" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="success">Simpan</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default RoomTypes;
