import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Table, Form } from "react-bootstrap";

const ReportReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // format YYYY-MM-DD
    });

    const fetchReservations = async () => {
        try {
            const res = await api.get(`/reports/reservations?date=${selectedDate}`);
            setReservations(res.data);
        } catch (err) {
            console.error("Gagal ambil data reservasi:", err);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [selectedDate]);

    return (
        <div className="p-4">
            <h3 className="fw-bold mb-3">📅 Laporan Reservasi Harian</h3>

            <Form.Group className="mb-3">
                <Form.Label>Pilih Tanggal:</Form.Label>
                <Form.Control
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ maxWidth: "250px" }}
                />
            </Form.Group>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nama Tamu</th>
                        <th>Nomor Kamar</th>
                        <th>Check-In</th>
                        <th>Check-Out</th>
                        <th>Jumlah Tamu</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((rsv, i) => (
                        <tr key={rsv.reservation_id}>
                            <td>{i + 1}</td>
                            <td>{rsv.guest_name}</td>
                            <td>{rsv.room_number}</td>
                            <td>{rsv.check_in_date}</td>
                            <td>{rsv.check_out_date}</td>
                            <td>{rsv.number_of_guests}</td>
                            <td>{rsv.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ReportReservations;
