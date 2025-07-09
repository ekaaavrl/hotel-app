import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Button, Modal, Form } from "react-bootstrap";

const RoomServices = () => {
    const [services, setServices] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        reservation_id: "",
        service_description: "",
        status: "pending",
    });
    const [editId, setEditId] = useState(null);

    const fetchServices = async () => {
        const res = await api.get("/services");
        setServices(res.data);
    };

    const fetchReservations = async () => {
        const res = await api.get("/reservations");
        setReservations(res.data);
    };

    useEffect(() => {
        fetchServices();
        fetchReservations();
    }, []);

    const handleShow = (data = null) => {
        setEditId(data?.request_id || null);
        setForm(
            data
                ? {
                    reservation_id: data.reservation_id,
                    service_description: data.service_description,
                    status: data.status,
                }
                : {
                    reservation_id: "",
                    service_description: "",
                    status: "pending",
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

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">Layanan Kamar</h3>
                <Button variant="primary" onClick={() => handleShow()}>
                    + Tambah
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tamu</th>
                        <th>Reservasi ID</th>
                        <th>Layanan</th>
                        <th>Waktu Permintaan</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((s, i) => (
                        <tr key={s.request_id}>
                            <td>{i + 1}</td>
                            <td>{s.full_name}</td>
                            <td>{s.reservation_id}</td>
                            <td>{s.service_description}</td>
                            <td>{new Date(s.request_time).toLocaleString("id-ID")}</td>
                            <td>{s.status}</td>
                            <td>
                                <Button size="sm" variant="warning" onClick={() => handleShow(s)}>
                                    Edit
                                </Button>{" "}
                                <Button size="sm" variant="danger" onClick={() => handleDelete(s.request_id)}>
                                    Hapus
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal */}
            <Modal show={show} onHide={() => setShow(false)}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editId ? "Edit" : "Tambah"} Layanan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Reservasi</Form.Label>
                            <Form.Select
                                value={form.reservation_id}
                                onChange={(e) => setForm({ ...form, reservation_id: e.target.value })}
                                required
                            >
                                <option value="">-- Pilih Reservasi --</option>
                                {reservations.map((r) => (
                                    <option key={r.reservation_id} value={r.reservation_id}>
                                        #{r.reservation_id} - {r.guest_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Layanan</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={form.service_description}
                                onChange={(e) => setForm({ ...form, service_description: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Selesai</option>
                                <option value="cancelled">Dibatalkan</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
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
