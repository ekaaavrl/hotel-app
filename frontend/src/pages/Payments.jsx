import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
    Table,
    Form,
    Row,
    Col,
    Button,
    Modal,
    Card
} from "react-bootstrap";

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [form, setForm] = useState({
        reservation_id: "",
        amount_paid: "",
        payment_method: "cash",
        notes: "",
    });
    const [show, setShow] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [additionalFee, setAdditionalFee] = useState(0);

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

        const totalAmount =
            parseInt(selectedReservation?.total_price || 0) + parseInt(additionalFee || 0);

        const payload = {
            ...form,
            amount_paid: totalAmount,
        };

        await api.post("/payments", payload);
        setShow(false);
        fetchPayments();

        setForm({
            reservation_id: "",
            amount_paid: "",
            payment_method: "cash",
            notes: "",
        });
        setAdditionalFee(0);
        setSelectedReservation(null);
    };

    return (
        <div className="container-fluid py-4">
            <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-dark">Data Pembayaran</h5>
                    <Button variant="primary" size="sm" onClick={() => setShow(true)}>
                        + Tambah
                    </Button>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table bordered hover responsive style={{ fontSize: "13px" }}>
                            <thead className="thead-light">
                                <tr>
                                    <th>#</th>
                                    <th>Reservasi</th>
                                    <th>Jumlah Dibayar</th>
                                    <th>Metode</th>
                                    <th>Catatan</th>
                                    <th>Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((item, i) => (
                                    <tr key={item.payment_id}>
                                        <td>{i + 1}</td>
                                        <td>#{item.reservation_id}</td>
                                        <td>Rp{parseInt(item.amount_paid).toLocaleString("id-ID")}</td>
                                        <td>{item.payment_method}</td>
                                        <td>{item.notes}</td>
                                        <td>{new Date(item.payment_date).toLocaleDateString("id-ID")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Modal Form */}
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
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const selected = reservations.find(r => r.reservation_id == selectedId);
                                    setForm({ ...form, reservation_id: selectedId });
                                    setSelectedReservation(selected || null);
                                }}
                                required
                            >
                                <option value="">-- Pilih Reservasi --</option>
                                {reservations.map((res) => (
                                    <option key={res.reservation_id} value={res.reservation_id}>
                                        Tamu {res.reservation_id} - {res.guest_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {selectedReservation && (
                            <Form.Group className="mb-2">
                                <Form.Label>Total Harga Reservasi</Form.Label>
                                <Form.Control
                                    type="text"
                                    readOnly
                                    value={`Rp${parseInt(selectedReservation.total_price).toLocaleString("id-ID")}`}
                                />
                            </Form.Group>
                        )}

                        <Form.Group className="mb-2">
                            <Form.Label>Biaya Tambahan (opsional)</Form.Label>
                            <Form.Control
                                type="number"
                                value={additionalFee}
                                onChange={(e) => setAdditionalFee(e.target.value)}
                                placeholder="Isi jika ada layanan tambahan"
                            />
                        </Form.Group>

                        {selectedReservation && (
                            <Form.Group className="mb-2">
                                <Form.Label>Total Keseluruhan</Form.Label>
                                <Form.Control
                                    type="text"
                                    readOnly
                                    value={`Rp${(
                                        parseInt(selectedReservation.total_price || 0) +
                                        parseInt(additionalFee || 0)
                                    ).toLocaleString("id-ID")}`}
                                />
                            </Form.Group>
                        )}

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
                                <option value="transfer">Transfer</option>
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
