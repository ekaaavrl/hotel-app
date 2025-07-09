import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Table, Badge } from "react-bootstrap";

const Reservations = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        api.get("/reservations").then(res => setReservations(res.data));
    }, []);

    const statusColor = (status) => {
        switch (status) {
            case "booked": return "primary";
            case "checked_in": return "success";
            case "checked_out": return "secondary";
            case "cancelled": return "danger";
            default: return "dark";
        }
    };

    return (
        <div className="p-4">
            <h3 className="fw-bold mb-3">Data Reservasi</h3>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tamu</th>
                        <th>Kamar</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Jumlah</th>
                        <th>Status</th>
                        <th>Waktu Input</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((r, i) => (
                        <tr key={r.reservation_id}>
                            <td>{i + 1}</td>
                            <td>{r.guest_name}</td>
                            <td>{r.room_number} - {r.type_name}</td>
                            <td>{r.check_in_date}</td>
                            <td>{r.check_out_date}</td>
                            <td>{r.number_of_guests}</td>
                            <td><Badge bg={statusColor(r.status)}>{r.status}</Badge></td>
                            <td>{new Date(r.created_at).toLocaleString("id-ID")}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Reservations;
