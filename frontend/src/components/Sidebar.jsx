import SidebarAdmin from "./SidebarAdmin";
import SidebarResepsionis from "./SidebarResepsionis";
import SidebarManager from "./SidebarManager";

function Sidebar() {
    const role = JSON.parse(localStorage.getItem("user"))?.role;
    console.log("ROLE TERDETEKSI:", role);

    if (role === "admin") return <SidebarAdmin />;
    if (role === "resepsionis") return <SidebarResepsionis />;
    if (role === "manager") return <SidebarManager />
    return null;
}

export default Sidebar;
