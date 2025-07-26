// Bagian atas tetap (import, useState, useEffect, dll)
import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
    Table,
    Form,
    Button,
    Modal,
    Card
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
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
    const [serviceDescriptions, setServiceDescriptions] = useState("");
    const [editId, setEditId] = useState(null);

    const fetchPayments = async () => {
        const res = await api.get("/payments");
        setPayments(res.data);
    };

    const fetchReservations = async () => {
        const res = await api.get("/reservations");
        setReservations(res.data);
    };

    const fetchAdditionalFee = async (reservationId) => {
        try {
            const res = await api.get(`/room-services?reservation_id=${reservationId}`);
            const completed = res.data.filter(item => item.status === 'completed');
            const totalFee = completed.reduce((sum, item) => sum + (item.fee || 0), 0);
            setAdditionalFee(totalFee);
        } catch (err) {
            console.error("Gagal mengambil layanan kamar:", err);
            setAdditionalFee(0);
        }
    };

    const fetchServiceDescriptions = async (reservationId) => {
        try {
            const res = await api.get(`/services/notes?reservation_id=${reservationId}`);
            console.log("Catatan layanan:", res.data);
            if (res.data && typeof res.data.notes === "string") {
                setServiceDescriptions(res.data.notes);
            } else {
                setServiceDescriptions("");
            }
        } catch (err) {
            console.error("Gagal ambil catatan layanan:", err);
            setServiceDescriptions("");
        }
    };

    useEffect(() => {
        fetchPayments();
        fetchReservations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            reservation_id: form.reservation_id,
            amount_paid: parseInt(form.amount_paid) || 0,
            payment_method: form.payment_method,
            additional_fee: parseInt(additionalFee) || 0,
            notes: form.notes || "",
        };

        if (editId) {
            await api.put(`/payments/${editId}`, payload);
        } else {
            await api.post("/payments", payload);
        }

        setShow(false);
        fetchPayments();
        resetForm();
    };

    const handleEdit = async (payment) => {
        const reservation = reservations.find(r => r.reservation_id === payment.reservation_id);
        setForm({
            reservation_id: payment.reservation_id,
            amount_paid: payment.amount_paid,
            payment_method: payment.payment_method,
            notes: payment.notes || "",
        });
        setSelectedReservation({
            ...reservation,
            total_price: reservation?.total_price || payment.total_price || 0 // fallback
        });
        setAdditionalFee(payment.additional_fee || 0);
        setEditId(payment.payment_id);

        try {
            const res = await api.get(`/services/notes?reservation_id=${payment.reservation_id}`);
            setServiceDescriptions(res.data?.notes || "");
        } catch (err) {
            console.error("Gagal ambil catatan layanan:", err);
            setServiceDescriptions("");
        }

        setShow(true);
    };


    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus pembayaran ini?")) {
            await api.delete(`/payments/${id}`);
            fetchPayments();
        }
    };

    const resetForm = () => {
        setForm({
            reservation_id: "",
            amount_paid: "",
            payment_method: "cash",
            notes: "",
        });
        setAdditionalFee(0);
        setSelectedReservation(null);
        setEditId(null);
        setServiceDescriptions("");
    };

    return (
        <div className="container-fluid py-4">
            <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-dark">Data Pembayaran</h5>
                    <Button variant="primary" size="sm" onClick={() => setShow(true)}>+ Tambah</Button>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table bordered hover responsive style={{ fontSize: "13px" }}>
                            <thead className="thead-light">
                                <tr>
                                    <th>#</th>
                                    <th>Reservasi</th>
                                    <th>Sisa Tagihan</th>
                                    <th>Jumlah Dibayar</th>
                                    <th>Tambahan Layanan</th>
                                    <th>Metode</th>
                                    <th>Catatan</th>
                                    <th>Tanggal</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((item, i) => {
                                    const relatedReservation = reservations.find(r => r.reservation_id === item.reservation_id);
                                    const totalPrice = relatedReservation ? parseInt(relatedReservation.total_price || 0) : 0;
                                    const sisaTagihan = totalPrice + parseInt(item.additional_fee || 0) - parseInt(item.amount_paid || 0);

                                    return (
                                        <tr key={item.payment_id}>
                                            <td>{i + 1}</td>
                                            <td>#{item.reservation_id}</td>
                                            <td className={`fw-bold ${sisaTagihan <= 0 ? "text-success" : "text-danger"}`}>
                                                Rp{sisaTagihan.toLocaleString("id-ID")}
                                            </td>
                                            <td>Rp{parseInt(item.amount_paid).toLocaleString("id-ID")}</td>
                                            <td>Rp{parseInt(item.additional_fee || 0).toLocaleString("id-ID")}</td>
                                            <td>{item.payment_method}</td>
                                            <td>{item.notes}</td>
                                            <td>{new Date(item.payment_date).toLocaleDateString("id-ID")}</td>
                                            <td>
                                                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(item)}>
                                                    <FaEdit />
                                                </Button>
                                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item.payment_id)}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Modal Form */}
            <Modal show={show} onHide={() => { setShow(false); resetForm(); }} backdropClassName="modal-backdrop-custom" style={{ fontSize: "14px", zIndex: 2000 }}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editId ? "Edit" : "Tambah"} Pembayaran</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Reservasi</Form.Label>
                            <Form.Select
                                value={form.reservation_id}
                                onChange={async (e) => {
                                    const selectedId = e.target.value;
                                    const selected = reservations.find(r => r.reservation_id == selectedId);
                                    setForm({ ...form, reservation_id: selectedId });
                                    setSelectedReservation(selected || null);

                                    if (selectedId) {
                                        await fetchAdditionalFee(selectedId);
                                        await fetchServiceDescriptions(selectedId);
                                    }
                                }}
                                required
                            >
                                <option value="">-- Pilih Reservasi --</option>
                                {reservations.map((res) => (
                                    <option key={res.reservation_id} value={res.reservation_id}>
                                        Tamu {res.reservation_id} - {res.guest_name || "N/A"}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Jumlah yang Dibayar</Form.Label>
                            <Form.Control
                                type="number"
                                required
                                value={form.amount_paid}
                                onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Biaya Tambahan (otomatis)</Form.Label>
                            <Form.Control type="number" value={additionalFee} disabled />
                        </Form.Group>

                        {selectedReservation && (
                            <div className="mt-3" style={{ fontSize: "13px", background: "#f8f9fa", padding: "10px", borderRadius: "5px" }}>
                                <p className="mb-1"><strong>Rincian Tagihan:</strong></p>
                                <p className="mb-1">Total Harga Reservasi: Rp{parseInt(selectedReservation.total_price || 0).toLocaleString("id-ID")}</p>
                                <p className="mb-1">Biaya Tambahan: Rp{parseInt(additionalFee || 0).toLocaleString("id-ID")}</p>
                                <p className="mb-1 text-danger fw-bold">Total Tagihan: Rp{(
                                    parseInt(selectedReservation.total_price || 0) + parseInt(additionalFee || 0)
                                ).toLocaleString("id-ID")}</p>
                                <p className="mb-1 text-primary fw-bold">Sisa Tagihan: Rp{(
                                    (parseInt(selectedReservation.total_price || 0) + parseInt(additionalFee || 0)) -
                                    parseInt(form.amount_paid || 0)
                                ).toLocaleString("id-ID")}</p>

                                {serviceDescriptions ? (
                                    <div className="mt-2">
                                        <p className="mb-1 fw-bold">Catatan Layanan:</p>
                                        <ul className="mb-1" style={{ paddingLeft: "16px" }}>
                                            {serviceDescriptions.split("\n").map((line, idx) => (
                                                <li key={idx}>{line.replace(/^•\s?/, "")}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="text-muted mt-2 fst-italic">Tidak ada catatan layanan.</p>
                                )}
                            </div>
                        )}

                        <Form.Group className="mb-2 mt-3">
                            <Form.Label>Metode Pembayaran</Form.Label>
                            <Form.Select
                                value={form.payment_method}
                                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                                required
                            >
                                <option value="cash">Cash</option>
                                <option value="credit_card">Kartu Kredit</option>
                                <option value="debit_card">Kartu Debit</option>
                                <option value="bank_transfer">Transfer</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Catatan</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Catatan pembayaran"
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setShow(false); resetForm(); }}>
                            Batal
                        </Button>
                        <Button type="submit" variant="success">Simpan</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default Payments;