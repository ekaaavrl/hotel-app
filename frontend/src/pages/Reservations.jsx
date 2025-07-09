import React, { useEffect, useState } from "react";
import api from "../services/api";
import ReservationTable from "../components/ReservationTable";
import ReservationForm from "../components/ReservationForm";
import { Button } from "react-bootstrap";

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const fetchReservations = async () => {
        try {
            const res = await api.get("/reservations");
            setReservations(res.data);
        } catch (err) {
            console.error("Gagal ambil data reservasi:", err);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleEdit = (data) => {
        setSelectedData(data);
        setShowForm(true);
    };

    const handleAdd = () => {
        setSelectedData(null);
        setShowForm(true);
    };

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">Daftar Reservasi</h3>
                <Button variant="primary" onClick={handleAdd}>
                    + Tambah Reservasi
                </Button>
            </div>

            <ReservationTable
                data={reservations}
                onEdit={handleEdit}
                onRefresh={fetchReservations}
            />

            {/* Form Modal */}
            <ReservationForm
                show={showForm}
                onClose={() => setShowForm(false)}
                onSuccess={fetchReservations}
                selectedData={selectedData}
            />
        </div>
    );
};

export default Reservations;
