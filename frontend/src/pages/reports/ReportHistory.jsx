import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
    Table,
    Card,
    Form,
    Row,
    Col,
    Button
} from "react-bootstrap";

const ReportHistory = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await api.get("/reports/history");
            setData(res.data);
        } catch (err) {
            console.error("Gagal ambil data pembayaran:", err);
        }
    };

    const filtered = data.filter(
        (item) =>
            item.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.payment_method?.toLowerCase().includes(search.toLowerCase()) ||
            item.notes?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const displayed = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4">
            <Card className="shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold text-dark m-0">Laporan Pembayaran</h5>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={3}>
                            <Form.Label>Show entries</Form.Label>
                            <Form.Select
                                size="sm"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </Form.Select>
                        </Col>
                        <Col md={{ span: 4, offset: 5 }}>
                            <Form.Label>Cari</Form.Label>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Cari nama tamu, metode, atau catatan..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </Col>
                    </Row>

                    <div className="table-responsive">
                        <Table striped bordered hover size="sm" style={{ fontSize: "13px" }}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ID Reservasi</th>
                                    <th>Nama Tamu</th>
                                    <th>Metode</th>
                                    <th>Jumlah Bayar</th>
                                    <th>Tanggal Bayar</th>
                                    <th>Catatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayed.map((item, i) => (
                                    <tr key={item.payment_id}>
                                        <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                        <td>{item.reservation_id}</td>
                                        <td>{item.guest_name}</td>
                                        <td>{item.payment_method}</td>
                                        <td>Rp{parseInt(item.amount_paid).toLocaleString("id-ID")}</td>
                                        <td>{new Date(item.payment_date).toLocaleString("id-ID")}</td>
                                        <td>{item.notes || "-"}</td>
                                    </tr>
                                ))}
                                {displayed.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted">
                                            Tidak ada data ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <span style={{ fontSize: "13px" }}>
                            Menampilkan {displayed.length} dari {filtered.length} data
                        </span>
                        <div>
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="me-2"
                            >
                                Prev
                            </Button>
                            <span style={{ fontSize: "13px" }}>
                                Halaman {currentPage} / {totalPages || 1}
                            </span>
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="ms-2"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ReportHistory;
