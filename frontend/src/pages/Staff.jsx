import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Card, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const StaffList = () => {
    const [staff, setStaff] = useState([]);

    const fetchStaff = async () => {
        try {
            const res = await api.get("/staff");
            setStaff(res.data);
        } catch (err) {
            console.error("Gagal ambil data staff:", err);
        }
    };

    const handleEdit = (staffId) => {
        console.log("Edit staff ID:", staffId);
        // Navigasi ke form edit jika sudah ada, misalnya:
        // navigate(`/staff/edit/${staffId}`);
    };

    const handleDelete = async (staffId) => {
        if (window.confirm("Yakin ingin menghapus data staff ini?")) {
            try {
                await api.delete(`/staff/${staffId}`);
                fetchStaff(); // Refresh setelah delete
            } catch (err) {
                console.error("Gagal hapus data staff:", err);
            }
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    return (
        <div className="container-fluid py-4">
            <Card className="shadow mb-4">
                <Card.Header className="py-3 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-dark">Data Staff</h5>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table bordered hover responsive className="table" style={{ fontSize: "13px" }}>
                            <thead className="thead-light">
                                <tr>
                                    <th>No</th>
                                    <th>Nama</th>
                                    <th>Posisi</th>
                                    <th>Email</th>
                                    <th>No. HP</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted">
                                            Tidak ada data staff.
                                        </td>
                                    </tr>
                                ) : (
                                    staff.map((s, i) => (
                                        <tr key={s.staff_id}>
                                            <td>{i + 1}</td>
                                            <td>{s.full_name}</td>
                                            <td>{s.position}</td>
                                            <td>{s.email}</td>
                                            <td>{s.phone_number}</td>
                                            <td>{s.status}</td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    className="me-2"
                                                    onClick={() => handleShow(s.staff_id)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => handleDelete(s.staff_id)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>
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

export default StaffList;
