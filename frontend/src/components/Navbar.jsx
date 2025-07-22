import { Navbar, Container, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

function TopNavbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            className="shadow-sm py-2 px-4"
            style={{ position: "fixed", width: "100%", top: 0, zIndex: 1000 }}
        >
            <Container fluid className="d-flex justify-content-between align-items-center">
                {/* Logo dan Judul */}
                <Navbar.Brand className="fw-bold text-white d-flex align-items-center gap-2">
                    {/* Bisa tambahkan logo di sini */}
                    <span style={{ fontSize: "1.25rem" }}>Hotel Management</span>
                </Navbar.Brand>

                {/* Profil Dropdown */}
                <Dropdown align="end">
                    <Dropdown.Toggle
                        variant="dark"
                        className="border-0 d-flex align-items-center gap-2 text-white"
                        id="dropdown-user"
                    >
                        <FaUserCircle size={22} />
                        <span className="d-none d-md-inline">
                            {user?.role || "User"}
                        </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item onClick={() => navigate("/profile")}>
                            <FaUserCircle className="me-2" /> Profil
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout} className="text-danger">
                            <FaSignOutAlt className="me-2" /> Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </Navbar>
    );
}

export default TopNavbar;
