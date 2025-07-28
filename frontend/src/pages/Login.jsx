import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo2.png";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password,
            });

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/dashboard');
            } else {
                setError("Login gagal: Token tidak ditemukan");
            }
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            setError('Username atau password salah.');
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                backgroundColor: "#343a40", // background gelap
                padding: "1rem",
            }}
        >
            <div style={{
                background: "#fff", // card putih
                padding: "2.5rem",
                borderRadius: "1rem",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                width: "100%",
                maxWidth: "400px",
                color: "#212529" // teks gelap
            }}>
                {/* Logo */}
                <div className="text-center mb-3">
                    <img
                        src={logo}
                        alt="Hotel Logo"
                        style={{ width: "60px", height: "60px", objectFit: "contain" }}
                    />
                </div>

                {/* Judul */}
                <h3 className="mb-4 fw-bold text-center" style={{ color: "#343a40" }}>
                    Hotel App
                </h3>

                {/* Error */}
                {error && (
                    <div className="alert alert-danger text-center p-2 mb-3" style={{ fontSize: "14px" }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ fontSize: "14px" }}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ fontSize: "14px" }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 btn-lg shadow-sm"
                        style={{
                            borderRadius: "50px",
                            backgroundColor: "#343a40", // warna emas
                            color: "#fff",
                            border: "none",
                            fontSize: "14px"
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
