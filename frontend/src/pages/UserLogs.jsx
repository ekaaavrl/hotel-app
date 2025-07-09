import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table } from "react-bootstrap";

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
        <div className="p-4">
            <h3 className="fw-bold mb-3">📄 Log Aktivitas Pengguna</h3>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Waktu</th>
                        <th>Nama Pengguna</th>
                        <th>Action</th>
                        <th>Deskripsi</th>
                        <th>IP Address</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, i) => (
                        <tr key={log.log_id}>
                            <td>{i + 1}</td>
                            <td>{new Date(log.log_time).toLocaleString("id-ID")}</td>
                            <td>{log.full_name}</td>
                            <td>{log.action_type}</td>
                            <td>{log.description}</td>
                            <td>{log.ip_address || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserLogs;
