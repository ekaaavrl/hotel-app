import SidebarAdmin from "./SidebarAdmin";
import SidebarResepsionis from "./SidebarResepsionis";

function Sidebar() {
    const role = JSON.parse(localStorage.getItem("user"))?.role;
    console.log("ROLE TERDETEKSI:", role);

    if (role === "admin" || role === "manager") return <SidebarAdmin />;
    if (role === "resepsionis") return <SidebarResepsionis />;
    return null;
}

export default Sidebar;
