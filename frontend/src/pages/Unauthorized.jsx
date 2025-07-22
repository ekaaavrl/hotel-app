import React from "react";

const Unauthorized = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                flexDirection: "column",
                backgroundColor: "#fff", // opsional
            }}
        >
            <h1 className="display-4 text-danger">Oops!</h1>
            <p className="lead">Kamu ga ada akses ke halaman ini!</p>
        </div>
    );
};

export default Unauthorized;
