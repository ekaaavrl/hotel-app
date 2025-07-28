import { Navbar, Container, Dropdown } from "react-bootstrap";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo2.png";

function TopNavbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.error("Gagal logout ke server:", err);
        }

        localStorage.clear();
        navigate("/");
    };

    return (
        <Navbar
            expand="lg"
            className="shadow-sm py-2 px-4"
            style={{
                position: "fixed",
                width: "100%",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#ffffff",
            }}
        >
            <Container fluid className="d-flex justify-content-between align-items-center">
                {/* Logo dan Judul */}
                <Navbar.Brand
                    className="fw-bold d-flex align-items-center gap-2"
                    style={{ color: "#212529" }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ height: "30px", objectFit: "contain" }}
                    />
                    <span style={{ fontSize: "1.25rem", color: "#212529" }}>
                        Hotel Manajemen
                    </span>
                </Navbar.Brand>

                {/* Profil Dropdown */}
                <Dropdown align="end">
                    <Dropdown.Toggle
                        className="border-0 d-flex align-items-center gap-2"
                        style={{
                            backgroundColor: "transparent",
                            color: "#212529",
                            border: "none",
                        }}
                        id="dropdown-user"
                    >
                        <FaUserCircle size={22} />
                        <span className="d-none d-md-inline">
                            {user?.full_name || "User"}
                        </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "0.5rem",
                        }}
                    >
                        <Dropdown.Item
                            onClick={() => navigate("/profile")}
                            style={{ color: "#212529" }}
                        >
                            <FaUserCircle className="me-2" /> Profil
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                            onClick={handleLogout}
                            style={{ color: "#dc3545" }}
                        >
                            <FaSignOutAlt className="me-2" /> Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </Navbar>
    );
}

export default TopNavbar;
