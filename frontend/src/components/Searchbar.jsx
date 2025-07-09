import React from "react";

export default function SearchBar({ value, onChange, placeholder }) {
    return (
        <input
            type="text"
            className="form-control form-control-sm"
            style={{
                maxWidth: "280px",
                borderRadius: "20px",
                paddingLeft: "15px",
                fontSize: "0.9rem",
            }}
            value={value}
            onChange={onChange}
            placeholder={placeholder || "Cari..."}
        />
    );
}
