import React, { useEffect, useState } from "react";
import api from "../services/api";

const Guests = () => {
    const [guests, setGuests] = useState([]);
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        address: "",
        id_number: "",
        nationality: "",
    });
    const [editId, setEditId] = useState(null);

    const fetchGuests = async () => {
        try {
            const res = await api.get("/guests");
            setGuests(res.data);
        } catch (err) {
            console.error("Gagal ambil tamu:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/guests/${editId}`, form);
            } else {
                await api.post("/guests", form);
            }
            setForm({
                full_name: "",
                email: "",
                phone_number: "",
                address: "",
                id_number: "",
                nationality: "",
            });
            setEditId(null);
            fetchGuests();
        } catch (err) {
            console.error("Gagal simpan tamu:", err);
        }
    };

    const handleEdit = (guest) => {
        setForm(guest);
        setEditId(guest.guest_id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin hapus tamu ini?")) {
            await api.delete(`/guests/${id}`);
            fetchGuests();
        }
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Data Tamu</h2>

            {/* Form Tambah/Edit */}
            <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="No HP"
                    value={form.phone_number}
                    onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Alamat"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="No KTP / Paspor"
                    value={form.id_number}
                    onChange={(e) => setForm({ ...form, id_number: e.target.value })}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Kebangsaan"
                    value={form.nationality}
                    onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                    className="border p-2 rounded"
                />

                <button
                    type="submit"
                    className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {editId ? "Update" : "Tambah"} Tamu
                </button>
            </form>

            {/* Tabel Tamu */}
            <table className="w-full table-auto border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Nama</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">HP</th>
                        <th className="border p-2">Negara</th>
                        <th className="border p-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {guests.map((guest) => (
                        <tr key={guest.guest_id}>
                            <td className="border p-2">{guest.full_name}</td>
                            <td className="border p-2">{guest.email}</td>
                            <td className="border p-2">{guest.phone_number}</td>
                            <td className="border p-2">{guest.nationality}</td>
                            <td className="border p-2 text-center">
                                <button onClick={() => handleEdit(guest)} className="text-blue-600 mr-2">Edit</button>
                                <button onClick={() => handleDelete(guest.guest_id)} className="text-red-600">Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Guests;
