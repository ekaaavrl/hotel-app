import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
    Card,
    Table,
    Form,
    Row,
    Col,
    Button
} from "react-bootstrap";

const ReportIncome = () => {
    const [data, setData] = useState([]);

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const format = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [filters, setFilters] = useState({
        start: format(firstDay),
        end: format(today),
    });

    const fetchIncome = async () => {
        try {
            const response = await api.get("/reports/income", {
                params: {
                    start: filters.start,
                    end: filters.end,
                },
            });
            console.log("Income data:", response.data);
            setData(response.data);
        } catch (error) {
            console.error("Gagal fetch report income", error);
        }
    };

    useEffect(() => {
        if (filters.start && filters.end) {
            fetchIncome();
        }
    }, [filters]);

    const totalIncome = data.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);

    return (
        <div className="p-4">
            <Card className="shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold text-dark m-0">Laporan Pendapatan</h5>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3 g-3 align-items-end">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Dari Tanggal</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filters.start}
                                    onChange={(e) =>
                                        setFilters({ ...filters, start: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Sampai Tanggal</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filters.end}
                                    onChange={(e) =>
                                        setFilters({ ...filters, end: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col md="auto">
                            <Button variant="primary" onClick={fetchIncome}>
                                Tampilkan
                            </Button>
                        </Col>
                    </Row>

                    <div className="mb-3">
                        <h6 className="fw-semibold">Total Pendapatan</h6>
                        <h4 className="text-success">
                            Rp{totalIncome.toLocaleString("id-ID")}
                        </h4>
                    </div>

                    <div className="table-responsive">
                        <Table striped bordered hover size="sm" style={{ fontSize: "13px" }}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tanggal</th>
                                    <th>Total Pendapatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? (
                                    <>
                                        {data.map((item, i) => (
                                            <tr key={`${item.date}-${i}`}>
                                                <td>{i + 1}</td>
                                                <td>
                                                    {item.date && !isNaN(new Date(item.date))
                                                        ? new Date(item.date).toLocaleDateString("id-ID", {
                                                            dateStyle: "medium",
                                                        })
                                                        : "-"}
                                                </td>
                                                <td>
                                                    {item.total && !isNaN(parseFloat(item.total))
                                                        ? `Rp${parseFloat(item.total).toLocaleString("id-ID")}`
                                                        : "Rp0"}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="fw-bold">
                                            <td colSpan={2} className="text-end">
                                                Total
                                            </td>
                                            <td>Rp{totalIncome.toLocaleString("id-ID")}</td>
                                        </tr>
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center text-muted">
                                            Tidak ada data untuk rentang tanggal ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ReportIncome;
