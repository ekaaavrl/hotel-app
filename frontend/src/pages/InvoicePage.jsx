import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api"; // pastikan baseURL nya benar
import InvoiceHotel from "../components/InvoiceHotel";

const InvoicePage = () => {
    const { reservationId } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await api.get(`/invoice/${reservationId}`);
                setInvoice(res.data);
            } catch (err) {
                console.error("Gagal ambil invoice:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [reservationId]);

    if (loading) return <p>Loading invoice...</p>;
    if (error || !invoice) return <p style={{ color: "red" }}>Gagal memuat invoice.</p>;

    return <InvoiceHotel invoice={invoice} />;
};

export default InvoicePage;
