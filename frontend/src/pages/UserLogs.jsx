import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Card, Badge } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaUserPlus, FaEdit, FaTrash, FaCalendarPlus } from "react-icons/fa";

const UserLogs = () => {
    const [logs, setLogs] = useState([]);

    const fetchLogs = async () => {
        try {
            const res = await api.get("/logs");
            setLogs(res.data);
        } catch (err) {
            console.error("Gagal mengambil log aktivitas:", err);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const renderActionType = (type) => {
        switch (type) {
            case "login":
                return (
                    <Badge bg="success">
                        <FaSignInAlt className="me-1" /> Login
                    </Badge>
                );
            case "logout":
                return (
                    <Badge bg="danger">
                        <FaSignOutAlt className="me-1" /> Logout
                    </Badge>
                );
            case "add_guest":
                return (
                    <Badge bg="primary">
                        <FaUserPlus className="me-1" /> Tambah Tamu
                    </Badge>
                );
            case "edit_guest":
                return (
                    <Badge bg="warning" text="dark">
                        <FaEdit className="me-1" /> Edit Tamu
                    </Badge>
                );
            case "delete_guest":
                return (
                    <Badge bg="danger">
                        <FaTrash className="me-1" /> Hapus Tamu
                    </Badge>
                );
            case "edit_room":
                return (
                    <Badge bg="warning" text="dark">
                        <FaEdit className="me-1" /> Edit Kamar
                    </Badge>
                );
            case "delete_room":
                return (
                    <Badge bg="danger">
                        <FaTrash className="me-1" /> Hapus Kamar
                    </Badge>
                );
            case "create_reservation":
                return (
                    <Badge bg="info" text="dark">
                        <FaCalendarPlus className="me-1" /> Buat Reservasi
                    </Badge>
                );
            case "edit_reservation":
                return (
                    <Badge bg="warning" text="dark">
                        <FaEdit className="me-1" /> Edit Reservasi
                    </Badge>
                );
            case "delete_reservation":
                return (
                    <Badge bg="danger">
                        <FaTrash className="me-1" /> Hapus Reservasi
                    </Badge>
                );
            case "update_payment":
                return (
                    <Badge bg="warning" text="dark">
                        <FaEdit className="me-1" /> Edit Pembayaran
                    </Badge>
                );
            case "delete_payment":
                return (
                    <Badge bg="danger">
                        <FaTrash className="me-1" /> Hapus Pembayaran
                    </Badge>
                );

            // ✅ FIXED: log untuk layanan kamar
            case "add_service":
                return (
                    <Badge bg="info" text="dark">
                        <FaCalendarPlus className="me-1" /> Tambah Layanan
                    </Badge>
                );
            case "edit_service":
                return (
                    <Badge bg="warning" text="dark">
                        <FaEdit className="me-1" /> Edit Layanan
                    </Badge>
                );
            case "delete_service":
                return (
                    <Badge bg="danger">
                        <FaTrash className="me-1" /> Hapus Layanan
                    </Badge>
                );

            default:
                return <Badge bg="secondary">{type.replace(/_/g, " ")}</Badge>;
        }
    };

    return (
        <div className="container-fluid py-4">
            <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-dark">Log Aktivitas Pengguna</h5>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table bordered hover id="logTable" className="table" width="100%" style={{ fontSize: "13px" }}>
                            <thead className="thead-light">
                                <tr>
                                    <th>No</th>
                                    <th>Waktu</th>
                                    <th>Nama Pengguna</th>
                                    <th>Aksi</th>
                                    <th>Deskripsi</th>
                                    <th>IP Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted">
                                            Tidak ada log aktivitas.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log, i) => (
                                        <tr key={log.log_id}>
                                            <td>{i + 1}</td>
                                            <td>{new Date(log.log_time).toLocaleString("id-ID")}</td>
                                            <td>{log.full_name}</td>
                                            <td>{renderActionType(log.action_type)}</td>
                                            <td>{log.description}</td>
                                            <td>{log.ip_address || "-"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default UserLogs;
