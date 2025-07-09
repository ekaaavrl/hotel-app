import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

export default function Guests() {
    const [guests, setGuests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
        id_number: '',
        nationality: ''
    });

    useEffect(() => {
        fetchGuests();
    }, []);

    const fetchGuests = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/guests');
            setGuests(res.data);
        } catch (err) {
            console.error('Gagal memuat tamu:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/guests', formData);
            setShowModal(false);
            fetchGuests();
        } catch (err) {
            console.error('Gagal tambah tamu:', err);
        }
    };

    return (
        <div className="p-4">
            <h3 className="mb-4">Data Tamu</h3>
            <Button onClick={() => setShowModal(true)} className="mb-3">
                Tambah Tamu
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Telepon</th>
                        <th>Alamat</th>
                        <th>No. ID</th>
                        <th>Kebangsaan</th>
                    </tr>
                </thead>
                <tbody>
                    {guests.map((guest) => (
                        <tr key={guest.guest_id}>
                            <td>{guest.full_name}</td>
                            <td>{guest.email}</td>
                            <td>{guest.phone_number}</td>
                            <td>{guest.address}</td>
                            <td>{guest.id_number}</td>
                            <td>{guest.nationality}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Tamu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-2">
                            <Form.Label>Nama Lengkap</Form.Label>
                            <Form.Control name="full_name" value={formData.full_name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>No. Telepon</Form.Label>
                            <Form.Control name="phone_number" value={formData.phone_number} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Alamat</Form.Label>
                            <Form.Control name="address" value={formData.address} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>No. Identitas</Form.Label>
                            <Form.Control name="id_number" value={formData.id_number} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Kebangsaan</Form.Label>
                            <Form.Control name="nationality" value={formData.nationality} onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">Simpan</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
