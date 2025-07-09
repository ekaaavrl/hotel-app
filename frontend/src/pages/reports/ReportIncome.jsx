import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Table, Form, Row, Col, Button } from "react-bootstrap";

const ReportIncome = () => {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        start: "",
        end: "",
    });

    const fetchIncome = async () => {
        if (!filters.start || !filters.end) return;

        try {
            const res = await api.get(`/reports/income?start=${filters.start}&end=${filters.end}`);
            setData(res.data);
        } catch (err) {
            console.error("Gagal ambil data pendapatan:", err);
        }
    };

    useEffect(() => {
        if (filters.start && filters.end) fetchIncome();
    }, [filters]);

    const totalIncome = data.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);

    return (
        <div className="p-4">
            <h3 className="fw-bold mb-3">💰 Laporan Pendapatan</h3>

            <Row className="mb-3 g-2 align-items-end">
                <Col md={3}>
                    <Form.Label>Dari Tanggal</Form.Label>
                    <Form.Control
                        type="date"
                        value={filters.start}
                        onChange={(e) => setFilters({ ...filters, start: e.target.value })}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>Sampai Tanggal</Form.Label>
                    <Form.Control
                        type="date"
                        value={filters.end}
                        onChange={(e) => setFilters({ ...filters, end: e.target.value })}
                    />
                </Col>
                <Col md="auto">
                    <Button onClick={fetchIncome} className="mt-2">Tampilkan</Button>
                </Col>
            </Row>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tanggal</th>
                        <th>Total Pendapatan</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => (
                        <tr key={item.date}>
                            <td>{i + 1}</td>
                            <td>{item.date}</td>
                            <td>Rp{parseInt(item.total).toLocaleString("id-ID")}</td>
                        </tr>
                    ))}
                    {data.length > 0 && (
                        <tr>
                            <td colSpan={2} className="fw-bold text-end">Total</td>
                            <td className="fw-bold">Rp{totalIncome.toLocaleString("id-ID")}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default ReportIncome;
