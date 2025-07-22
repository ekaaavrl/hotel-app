import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Card } from "react-bootstrap";

const UserLogs = () => {
    const [logs, setLogs] = useState([]);

    const fetchLogs = async () => {
        try {
            const res = await api.get("/logs");
            setLogs(res.data);
        } catch (err) {
            console.error("Gagal ambil data logs:", err);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="container-fluid py-4">
            <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-primary">Log Aktivitas Pengguna</h5>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table bordered hover responsive className="table" style={{ fontSize: "13px" }}>
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
                                            Tidak ada aktivitas ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log, i) => (
                                        <tr key={log.log_id}>
                                            <td>{i + 1}</td>
                                            <td>{new Date(log.log_time).toLocaleString("id-ID")}</td>
                                            <td>{log.full_name}</td>
                                            <td>{log.action_type.replace(/_/g, " ")}</td>
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
