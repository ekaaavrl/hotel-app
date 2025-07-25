import React from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./Navbar";
function Layout({ children }) {
    return (
        <>
            {/* Navbar tetap di atas */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "56px",
                    zIndex: 1100,
                    backgroundColor: "#343a40", // atau warna navbar kamu
                }}
            >
                <TopNavbar />
            </div>

            {/* Sidebar tetap di kiri */}
            <div
                style={{
                    position: "fixed",
                    top: "56px",
                    left: 0,
                    width: "240px",
                    height: "calc(100vh - 56px)",
                    backgroundColor: "#f1f5f9",
                    borderRight: "1px solid #ddd",
                    zIndex: 1000,
                    overflowY: "auto",
                }}
            >
                <Sidebar />
            </div>

            {/* Konten utama */}
            <div
                style={{
                    marginTop: "56px",
                    marginLeft: "240px",
                    width: "calc(100vw - 240px)",
                    padding: "24px",
                    minHeight: "calc(100vh - 56px)",
                    backgroundColor: "#f8f9fa",
                    overflowX: "hidden",
                }}
            >
                {children}
            </div>
        </>
    );
}

export default Layout;
