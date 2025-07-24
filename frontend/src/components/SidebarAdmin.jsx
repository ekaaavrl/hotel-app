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
    FaDatabase,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

function SidebarAdmin() {
    const [openMaster, setOpenMaster] = useState(false);
    const [openTransaksi, setOpenTransaksi] = useState(false);
    const [openLaporan, setOpenLaporan] = useState(false);
    const [openSistem, setOpenSistem] = useState(false);

    const navLinkStyle = {
        display: "flex",
        alignItems: "center",
        color: "#ffffff",
        padding: "8px 16px",
        textDecoration: "none",
        borderRadius: "6px",
        fontSize: "14px",
    };

    const navLinkActive = {
        backgroundColor: "#495057",
    };

    return (
        <div
            style={{
                width: "240px",
                height: "calc(100vh - 56px)", // agar tidak lewat navbar
                position: "fixed",
                top: "56px",
                left: 0,
                zIndex: 1030,
                backgroundColor: "#343a40",
                color: "#ffffff",
                overflowY: "auto",
                overflowX: "hidden", // cegah scroll horizontal
                paddingTop: "20px",
                fontSize: "14px",
                scrollbarWidth: "thin", // Firefox
                scrollbarColor: "#888 #343a40", // Firefox
            }}
        >
            <div className="px-3">
                <h5 className="text-white mb-4">Menu</h5>

                {/* Dashboard */}
                <NavLink
                    to="/dashboard"
                    style={({ isActive }) =>
                        isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle
                    }
                >
                    <FaHome className="me-2" /> Dashboard
                </NavLink>

                {/* Master Data */}
                <div className="mt-3">
                    <div
                        onClick={() => setOpenMaster(!openMaster)}
                        style={{
                            ...navLinkStyle,
                            justifyContent: "space-between",
                            cursor: "pointer",
                        }}
                    >
                        <span>
                            <FaDatabase className="me-2" /> Master Data
                        </span>
                        {openMaster ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {openMaster && (
                        <div className="ms-3 mt-2 d-flex flex-column gap-2">
                            <NavLink to="/room-types" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaBed className="me-2" /> Jenis Kamar
                            </NavLink>
                            <NavLink to="/rooms" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaDoorClosed className="me-2" /> Data Kamar
                            </NavLink>
                            <NavLink to="/guests" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaUsers className="me-2" /> Data Tamu
                            </NavLink>
                            <NavLink to="/staff" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaUserTie className="me-2" /> Data Karyawan
                            </NavLink>
                            <NavLink to="/users" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaUserShield className="me-2" /> Data Pengguna
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Transaksi */}
                <div className="mt-3">
                    <div
                        onClick={() => setOpenTransaksi(!openTransaksi)}
                        style={{
                            ...navLinkStyle,
                            justifyContent: "space-between",
                            cursor: "pointer",
                        }}
                    >
                        <span>
                            <FaExchangeAlt className="me-2" /> Transaksi
                        </span>
                        {openTransaksi ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {openTransaksi && (
                        <div className="ms-3 mt-2 d-flex flex-column gap-2">
                            <NavLink to="/guest-form" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaUsers className="me-2" /> Tamu
                            </NavLink>
                            <NavLink to="/reservation-form" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaClipboardList className="me-2" /> Reservasi
                            </NavLink>
                            <NavLink to="/services" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaConciergeBell className="me-2" /> Layanan Kamar
                            </NavLink>
                            <NavLink to="/payments" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaMoneyBill className="me-2" /> Pembayaran
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Laporan */}
                <div className="mt-3">
                    <div
                        onClick={() => setOpenLaporan(!openLaporan)}
                        style={{
                            ...navLinkStyle,
                            justifyContent: "space-between",
                            cursor: "pointer",
                        }}
                    >
                        <span>
                            <FaChartBar className="me-2" /> Laporan
                        </span>
                        {openLaporan ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {openLaporan && (
                        <div className="ms-3 mt-2 d-flex flex-column gap-2">
                            <NavLink to="/reports/history" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaHistory className="me-2" /> History Pembayaran
                            </NavLink>
                            <NavLink to="/reports/reservations" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaClipboardList className="me-2" /> Laporan Reservasi Harian
                            </NavLink>
                            <NavLink to="/reports/income" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaFileInvoice className="me-2" /> Laporan Pendapatan
                            </NavLink>
                            <NavLink to="/reports/rooms" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaDoorClosed className="me-2" /> Laporan Kamar
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Sistem */}
                <div className="mt-3 mb-4">
                    <div
                        onClick={() => setOpenSistem(!openSistem)}
                        style={{
                            ...navLinkStyle,
                            justifyContent: "space-between",
                            cursor: "pointer",
                        }}
                    >
                        <span>
                            <FaCogs className="me-2" /> Sistem
                        </span>
                        {openSistem ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {openSistem && (
                        <div className="ms-3 mt-2 d-flex flex-column gap-2">
                            <NavLink to="/logs" style={({ isActive }) =>
                                isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle}>
                                <FaHistory className="me-2" /> User Logs
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SidebarAdmin;
