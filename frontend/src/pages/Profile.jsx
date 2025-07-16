import React, { useEffect, useState } from "react";
import api from "../services/api"; 
import profile_photo from "../assets/s_wun.jpg";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error("Gagal memuat data profil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Memuat profil...</p>;
  if (!user) return <p>Gagal memuat data profil.</p>;

  return (
   <div className="flex flex-col items-center">

      <h2 className="text-2xl font-semibold mb-4">Profil Pengguna</h2>
      <img
        src={profile_photo}
        alt="Avatar"
        className="w-32 h-32 rounded-full shadow mb-4"
        style={{
        width: "100px",
        height: "100px",
        borderRadius: "9999px",
        objectFit: "cover",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: "1rem",
        }}
      />
      <div className="bg-white p-4 rounded shadow w-full max-w-md">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Nama Lengkap:</strong> {user.full_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Status:</strong> {user.status}</p>
      </div>
    </div>
  );
};

export default Profile;
