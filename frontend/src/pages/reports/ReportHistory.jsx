import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Table } from "react-bootstrap";

const ReportHistory = () => {
    const [data, setData] = useState([]);

    const fetchPayments = async () => {
        try {
            const res = await api.get("/reports/history");
            setData(res.data);
        } catch (err) {
            console.error("Gagal ambil data pembayaran:", err);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div className="p-4">
            <h3 className="fw-bold mb-3">History Transaksi Pembayaran</h3>

            <Table striped bordered hover responsive>
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
                    {data.map((item, i) => (
                        <tr key={item.payment_id}>
                            <td>{i + 1}</td>
                            <td>{item.reservation_id}</td>
                            <td>{item.guest_name}</td>
                            <td>{item.payment_method}</td>
                            <td>Rp{parseInt(item.amount_paid).toLocaleString("id-ID")}</td>
                            <td>{new Date(item.payment_date).toLocaleString("id-ID")}</td>
                            <td>{item.notes || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ReportHistory;
