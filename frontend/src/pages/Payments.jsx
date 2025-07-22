import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Form, Button, Row, Col, Modal, Card } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        reservation_id: "",
        amount_paid: "",
        payment_method: "cash",
        notes: "",
    });

    const fetchPayments = async () => {
        const res = await api.get("/payments");
        setPayments(res.data);
    };

    const fetchReservations = async () => {
        const res = await api.get("/reservations");
        setReservations(res.data);
    };

    useEffect(() => {
        fetchPayments();
        fetchReservations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post("/payments", form);
        setShow(false);
        fetchPayments();
        setForm({
            reservation_id: "",
            amount_paid: "",
            payment_method: "cash",
            notes: "",
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin hapus data ini?")) {
            await api.delete(`/payments/${id}`);
            fetchPayments();
        }
    };

    return (
        <div className="container-fluid py-4">
            <Card className="shadow">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-primary">Pembayaran</h5>
                    <Button variant="primary" size="sm" onClick={() => setShow(true)}>
                        + Tambah Pembayaran
                    </Button>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table bordered hover className="table" style={{ fontSize: "13px" }}>
                            <thead className="thead-light">
                                <tr>
                                    <th>#</th>
                                    <th>Reservasi</th>
                                    <th>Tanggal</th>
                                    <th>Metode</th>
                                    <th>Jumlah</th>
                                    <th>Catatan</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((pay, i) => (
                                    <tr key={pay.payment_id}>
                                        <td>{i + 1}</td>
                                        <td>#{pay.reservation_id}</td>
                                        <td>{new Date(pay.payment_date).toLocaleString("id-ID")}</td>
                                        <td>{pay.payment_method.replace(/_/g, " ")}</td>
                                        <td>Rp{parseInt(pay.amount_paid).toLocaleString("id-ID")}</td>
                                        <td>{pay.notes}</td>
                                        <td>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(pay.payment_id)}
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

            {/* Modal Tambah Pembayaran */}
            <Modal show={show} onHide={() => setShow(false)} style={{ fontSize: "14px" }}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Pembayaran</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Reservasi</Form.Label>
                            <Form.Select
                                value={form.reservation_id}
                                onChange={(e) => setForm({ ...form, reservation_id: e.target.value })}
                                required
                            >
                                <option value="">-- Pilih --</option>
                                {reservations.map((r) => (
                                    <option key={r.reservation_id} value={r.reservation_id}>
                                        #{r.reservation_id} - {r.guest_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Jumlah Dibayar</Form.Label>
                            <Form.Control
                                type="number"
                                value={form.amount_paid}
                                onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Metode Pembayaran</Form.Label>
                            <Form.Select
                                value={form.payment_method}
                                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                                required
                            >
                                <option value="cash">Cash</option>
                                <option value="credit_card">Kartu Kredit</option>
                                <option value="debit_card">Kartu Debit</option>
                                <option value="bank_transfer">Transfer Bank</option>
                                <option value="online">Online</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Catatan</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
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

export default Payments;
