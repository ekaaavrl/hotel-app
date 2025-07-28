import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Table, Form, Badge, Row, Col, Card, Button } from "react-bootstrap";

const ReportRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [activeTypeTab, setActiveTypeTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [summary, setSummary] = useState({ available: 0, occupied: 0, maintenance: 0 });

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchRooms();
        fetchRoomTypes();
    }, []);

    const fetchRooms = async () => {
        try {
            const endpoint = statusFilter === "all" ? "/reports/rooms" : `/reports/rooms?status=${statusFilter}`;
            const res = await api.get(endpoint);
            setRooms(res.data);

            // Summary
            const count = { available: 0, occupied: 0, maintenance: 0 };
            res.data.forEach((r) => {
                count[r.status] = (count[r.status] || 0) + 1;
            });
            setSummary(count);
        } catch (err) {
            console.error("Gagal ambil data kamar:", err);
        }
    };

    const fetchRoomTypes = async () => {
        try {
            const res = await api.get("/room-types");
            setRoomTypes(res.data);
        } catch (err) {
            console.error("Gagal ambil tipe kamar:", err);
        }
    };

    const getStatusBadge = (status) => {
        if (status === "available") return "success";
        if (status === "occupied") return "danger";
        if (status === "maintenance") return "warning";
        return "secondary";
    };

    const filteredRooms = rooms
        .filter((room) => statusFilter === "all" || room.status === statusFilter)
        .filter((room) =>
            room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.type_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((room) => activeTypeTab === "all" || room.type_name === activeTypeTab)
        .sort((a, b) => parseInt(a.room_number) - parseInt(b.room_number));

    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
    const displayedRooms = filteredRooms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container-fluid py-4">
            <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-dark">Laporan Kamar</h5>
                </Card.Header>
                <Card.Body>
                    {/* Filter & Search */}
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                size="sm"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">Semua Status</option>
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                            </Form.Select>
                        </Col>
                        <Col md={{ span: 4, offset: 4 }}>
                            <Form.Label>Cari</Form.Label>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Cari kamar..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </Col>
                    </Row>
                    {/* Summary */}
                    <Row className="mb-3">
                        <Col>
                            <Badge bg="success" className="p-2 w-100 text-start">
                                Tersedia: {summary.available}
                            </Badge>
                        </Col>
                        <Col>
                            <Badge bg="danger" className="p-2 w-100 text-start">
                                Ditempati: {summary.occupied}
                            </Badge>
                        </Col>
                        <Col>
                            <Badge bg="warning" text="dark" className="p-2 w-100 text-start">
                                Maintenance: {summary.maintenance}
                            </Badge>
                        </Col>
                    </Row>
                    {/* Tabs per Tipe */}
                    <ul className="nav nav-tabs mb-3 custom-tabs">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTypeTab === "all" ? "active" : ""}`}
                                onClick={() => {
                                    setActiveTypeTab("all");
                                    setCurrentPage(1);
                                }}
                            >
                                Semua
                            </button>
                        </li>
                        {roomTypes.map((type) => (
                            <li className="nav-item" key={type.room_type_id}>
                                <button
                                    className={`nav-link ${activeTypeTab === type.type_name ? "active" : ""}`}
                                    onClick={() => {
                                        setActiveTypeTab(type.type_name);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {type.type_name}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Tabel */}
                    <div className="table-responsive">
                        <Table bordered hover size="sm" style={{ fontSize: "13px" }}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>No Kamar</th>
                                    <th>Tipe</th>
                                    <th>Harga / Malam</th>
                                    <th>Status</th>
                                    <th>Deskripsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedRooms.map((room, i) => (
                                    <tr key={room.room_id}>
                                        <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                        <td>{room.room_number}</td>
                                        <td>{room.type_name}</td>
                                        <td>Rp{parseInt(room.price_per_night).toLocaleString("id-ID")}</td>
                                        <td>
                                            <Badge bg={getStatusBadge(room.status)}>{room.status}</Badge>
                                        </td>
                                        <td>{room.description || "-"}</td>
                                    </tr>
                                ))}
                                {displayedRooms.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted">
                                            Tidak ada data.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {/* Pagination & control */}
                    <div className="d-flex justify-content-between align-items-center mt-2 px-1 flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2">
                            <span>Show</span>
                            <Form.Select
                                size="sm"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                style={{ width: "80px" }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </Form.Select>
                            <span>entries</span>
                        </div>

                        <small className="text-muted">
                            Menampilkan {displayedRooms.length} dari {filteredRooms.length} entri
                        </small>

                        <div className="d-flex align-items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Prev
                            </Button>
                            <small>
                                Halaman {currentPage} / {totalPages || 1}
                            </small>
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage(currentPage + 1)}
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

export default ReportRooms;
