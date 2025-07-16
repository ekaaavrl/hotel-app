import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaHotel } from "react-icons/fa";

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
            fixed="top"
            className="shadow-sm px-4"
            style={{ zIndex: 1040 }}
        >
            <Container fluid>
                <Navbar.Brand className="fw-bold d-flex align-items-center gap-2">
                    <FaHotel />
                    Hotel
                </Navbar.Brand>
                <Nav className="ms-auto">
                    <NavDropdown
                        title={<FaUserCircle size={22} />}
                        id="profile-dropdown"
                        align="end"
                    >
                        <NavDropdown.Item onClick={() => navigate("/profile")}>
                            <FaUserCircle className="me-2" /> Profil
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLogout} className="text-danger">
                            <FaSignOutAlt className="me-2" /> Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default TopNavbar;
