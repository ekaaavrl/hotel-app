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
    FaFileInvoiceDollar,
    FaRegistered,
    FaAddressBook,
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

    const groupTitleStyle = {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#adb5bd",
        padding: "8px 16px 4px",
        marginBottom: "0",
        marginTop: "16px",
        textTransform: "uppercase",
    };

    return (
        <div
            style={{
                width: "240px",
                height: "calc(100vh - 56px)",
                position: "fixed",
                top: "56px",
                left: 0,
                zIndex: 1030,
                backgroundColor: "#343a40",
                color: "#ffffff",
                overflowY: "auto",
                overflowX: "hidden",
                paddingTop: "20px",
                fontSize: "14px",
                scrollbarWidth: "thin",
                scrollbarColor: "#888 #343a40",
            }}
        >
            <div className="px-3">
                {/* MAIN */}
                <p style={groupTitleStyle}>UTAMA</p>
                <NavLink
                    to="/dashboard"
                    style={({ isActive }) =>
                        isActive ? { ...navLinkStyle, ...navLinkActive } : navLinkStyle
                    }
                >
                    <FaHome className="me-2" /> Dashboard
                </NavLink>


                {/* LAPORAN */}
                <p style={groupTitleStyle}>LAPORAN</p>
                <SidebarToggle
                    title="Laporan"
                    icon={<FaChartBar />}
                    isOpen={openLaporan}
                    setIsOpen={setOpenLaporan}
                />
                {openLaporan && (
                    <div className="ms-3 d-flex flex-column gap-2 mt-2">
                        <SidebarLink to="/reports/rooms" icon={<FaDoorClosed />} text="Laporan Kamar" />
                        <SidebarLink to="/reports/history" icon={<FaFileInvoice />} text="Laporan Pembayaran" />
                        <SidebarLink to="/reports/income" icon={<FaFileInvoiceDollar />} text="Laporan Pendapatan" />
                        <SidebarLink to="/reports/history-reservations" icon={<FaAddressBook />} text="Laporan Reservasi" />
                        {/*<SidebarLink to="/reports/reservations" icon={<FaClipboardList />} text="Laporan Reservasi Harian" />*/}
                    </div>
                )}

            </div>
        </div>
    );
}

const SidebarToggle = ({ title, icon, isOpen, setIsOpen }) => (
    <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "14px",
            cursor: "pointer",
            justifyContent: "space-between",
        }}
    >
        <span className="d-flex align-items-center">
            {icon}
            <span className="ms-2">{title}</span>
        </span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
    </div>
);

const SidebarLink = ({ to, icon, text }) => (
    <NavLink
        to={to}
        style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            color: "#ffffff",
            padding: "8px 16px",
            textDecoration: "none",
            borderRadius: "6px",
            fontSize: "14px",
            backgroundColor: isActive ? "#495057" : "transparent",
        })}
    >
        {icon}
        <span className="ms-2">{text}</span>
    </NavLink>
);

export default SidebarAdmin;
