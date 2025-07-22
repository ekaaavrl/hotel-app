import { useState } from "react";
import {
    FaHome,
    FaBed,
    FaUsers,
    FaExchangeAlt,
    FaConciergeBell,
    FaClipboardList,
    FaChartBar,
    FaDoorClosed,
    FaChevronDown,
    FaChevronUp,
    FaMoneyBill,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

function SidebarResepsionis() {
    const [openMaster, setOpenMaster] = useState(false);
    const [openTransaksi, setOpenTransaksi] = useState(false);
    const [openLaporan, setOpenLaporan] = useState(false);

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
                height: "100vh",
                position: "fixed",
                top: "56px",
                left: 0,
                zIndex: 1030,
                backgroundColor: "#343a40",
                color: "#ffffff",
                overflowY: "auto",
                paddingTop: "20px",
            }}
        >
            <div className="px-3">
                <h5 className="text-white mb-4">Menu</h5>

                {/* Dashboard */}
                <NavLink
                    to="/dashboard"
                    end
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
                            <FaBed className="me-2" /> Master Data
                        </span>
                        {openMaster ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {openMaster && (
                        <div className="ms-3 mt-2 d-flex flex-column gap-2">
                            <NavLink
                                to="/rooms"
                                style={({ isActive }) =>
                                    isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle
                                }
                            >
                                <FaDoorClosed className="me-2" /> Data Kamar
                            </NavLink>
                            <NavLink
                                to="/guests"
                                style={({ isActive }) =>
                                    isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle
                                }
                            >
                                <FaUsers className="me-2" /> Data Tamu
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
                            <NavLink
                                to="/guest-form"
                                style={({ isActive }) =>
                                    isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle
                                }
                            >
                                <FaUsers className="me-2" /> Tamu
                            </NavLink>
                            <NavLink
                                to="/reservation-form"
                                style={({ isActive }) =>
                                    isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle
                                }
                            >
                                <FaClipboardList className="me-2" /> Reservasi
                            </NavLink>
                            <NavLink
                                to="/services"
                                style={({ isActive }) =>
                                    isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle
                                }
                            >
                                <FaConciergeBell className="me-2" /> Layanan Kamar
                            </NavLink>
                            <NavLink
                                to="/payments"
                                style={({ isActive }) =>
                                    isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle
                                }
                            >
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
                            <NavLink
                                to="/reports/reservations"
                                style={({ isActive }) =>
                                    isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle
                                }
                            >
                                <FaClipboardList className="me-2" /> Laporan Reservasi
                            </NavLink>
                            <NavLink
                                to="/reports/rooms"
                                style={({ isActive }) =>
                                    isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle
                                }
                            >
                                <FaDoorClosed className="me-2" /> Laporan Kamar
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SidebarResepsionis;
