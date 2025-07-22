import { useState } from "react";
import {
    FaHome,
    FaBed,
    FaUsers,
    FaMoneyBill,
    FaUserTie,
    FaUserShield,
    FaExchangeAlt,
    FaConciergeBell,
    FaClipboardList,
    FaFileInvoice,
    FaChartBar,
    FaDoorClosed,
    FaHistory,
    FaCogs,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function SidebarAdmin() {
    const [openMaster, setOpenMaster] = useState(false);
    const [openTransaksi, setOpenTransaksi] = useState(false);
    const [openLaporan, setOpenLaporan] = useState(false);
    const [openSistem, setOpenSistem] = useState(false);

    return (
        <div
            className="bg-light border-end"
            style={{
                width: "240px",
                height: "100vh",
                position: "fixed",
                top: "56px",
                left: 0,
                zIndex: 1030,
                fontSize: "14px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div style={{ flex: 1, overflowY: "auto" }}>
                <Nav className="flex-column p-3">
                    <h5 className="mb-4">Menu</h5>
                    <Nav.Link as={NavLink} to="/dashboard" end className="mb-2">
                        <FaHome className="me-2" /> Dashboard
                    </Nav.Link>

                    {/* Master Data */}
                    <div className="mb-2">
                        <div
                            className="d-flex align-items-center justify-content-between nav-link"
                            style={{ cursor: "pointer" }}
                            onClick={() => setOpenMaster(!openMaster)}
                        >
                            <span><FaBed className="me-2" /> Master Data</span>
                            {openMaster ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        {openMaster && (
                            <div className="ms-3 mt-2">
                                <Nav.Link as={NavLink} to="/room-types" className="mb-1">
                                    <FaBed className="me-2" /> Jenis Kamar
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/rooms" className="mb-1">
                                    <FaDoorClosed className="me-2" /> Data Kamar
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/guests" className="mb-1">
                                    <FaUsers className="me-2" /> Data Tamu
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/staff" className="mb-1">
                                    <FaUserTie className="me-2" /> Data Karyawan
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/users" className="mb-1">
                                    <FaUserShield className="me-2" /> Data Pengguna
                                </Nav.Link>
                            </div>
                        )}
                    </div>

                    {/* Transaksi */}
                    <div className="mb-2">
                        <div
                            className="d-flex align-items-center justify-content-between nav-link"
                            style={{ cursor: "pointer" }}
                            onClick={() => setOpenTransaksi(!openTransaksi)}
                        >
                            <span><FaExchangeAlt className="me-2" /> Transaksi</span>
                            {openTransaksi ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        {openTransaksi && (
                            <div className="ms-3 mt-2">
                                <Nav.Link as={NavLink} to="/guest-form" className="mb-1">
                                    <FaUsers className="me-2" /> Tamu
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/reservation-form" className="mb-1">
                                    <FaClipboardList className="me-2" /> Reservasi
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/services" className="mb-1">
                                    <FaConciergeBell className="me-2" /> Layanan Kamar
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/payments" className="mb-1">
                                    <FaMoneyBill className="me-2" /> Pembayaran
                                </Nav.Link>
                            </div>
                        )}
                    </div>

                    {/* Laporan */}
                    <div className="mb-2">
                        <div
                            className="d-flex align-items-center justify-content-between nav-link"
                            style={{ cursor: "pointer" }}
                            onClick={() => setOpenLaporan(!openLaporan)}
                        >
                            <span><FaChartBar className="me-2" /> Laporan</span>
                            {openLaporan ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        {openLaporan && (
                            <div className="ms-3 mt-2">
                                <Nav.Link as={NavLink} to="/reports/history" className="mb-1">
                                    <FaHistory className="me-2" /> History Pembayaran
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/reports/reservations" className="mb-1">
                                    <FaClipboardList className="me-2" /> Laporan Reservasi Harian
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/reports/income" className="mb-1">
                                    <FaFileInvoice className="me-2" /> Laporan Pendapatan
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/reports/rooms" className="mb-1">
                                    <FaDoorClosed className="me-2" /> Laporan Kamar
                                </Nav.Link>
                            </div>
                        )}
                    </div>

                    {/* Sistem */}
                    <div className="mb-2">
                        <div
                            className="d-flex align-items-center justify-content-between nav-link"
                            style={{ cursor: "pointer" }}
                            onClick={() => setOpenSistem(!openSistem)}
                        >
                            <span><FaCogs className="me-2" /> Sistem</span>
                            {openSistem ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        {openSistem && (
                            <div className="ms-3 mt-2">
                                <Nav.Link as={NavLink} to="/logs" className="mb-1">
                                    <FaHistory className="me-2" /> User Logs
                                </Nav.Link>
                            </div>
                        )}
                    </div>
                </Nav>
            </div>
        </div>
    );
}

export default SidebarAdmin;
