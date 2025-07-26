import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Guests from "../pages/Guests";
import GuestForm from "../pages/GuestsForm";
import Layout from "../components/Layout";
import RoomTypes from "../pages/RoomsType";
import Rooms from "../pages/Rooms";
import ReservationForm from "../components/ReservationForm";
import Payments from "../pages/Payments";
import Staff from "../pages/Staff";
import Users from "../pages/Users";
import RoomServices from "../pages/Services";
import ReportHistory from "../pages/reports/ReportHistory";
import ReportReservations from "../pages/reports/ReportReservations";
import ReportIncome from "../pages/reports/ReportIncome";
import ReportRooms from "../pages/reports/ReportRooms";
import UserLogs from "../pages/UserLogs";
import PrivateRoute from "../components/PrivateRoute";
import ReservationHistory from "../components/ReservationHistory";
import Unauthorized from "../pages/Unauthorized";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Login />} />

        <Route
            path="/dashboard"
            element={
                <PrivateRoute allowedRoles={["admin", "resepsionis"]}>
                    <Layout>
                        <Dashboard />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/profile"
            element={
                <PrivateRoute allowedRoles={["admin", "resepsionis"]}>
                    <Layout>
                        <Profile />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/guests"
            element={
                <PrivateRoute allowedRoles={["admin", "resepsionis"]}>
                    <Layout>
                        <Guests />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/guest-form"
            element={
                <PrivateRoute allowedRoles={["admin", "resepsionis"]}>
                    <Layout>
                        <GuestForm />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/room-types"
            element={
                <PrivateRoute allowedRoles={["admin"]}>
                    <Layout>
                        <RoomTypes />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/rooms"
            element={
                <PrivateRoute allowedRoles={["admin", "resepsionis"]}>
                    <Layout>
                        <Rooms />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/reservation-form"
            element={
                <PrivateRoute allowedRoles={["admin", "resepsionis"]}>
                    <Layout>
                        <ReservationForm />
                    </Layout>
                </PrivateRoute>
            }
        />

        <Route
            path="/payments"
            element={
                <PrivateRoute allowedRoles={["admin", "resepsionis"]}>
                    <Layout>
                        <Payments />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/staff"
            element={
                <PrivateRoute allowedRoles={["admin"]}>
                    <Layout>
                        <Staff />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/users"
            element={
                <PrivateRoute allowedRoles={["admin"]}>
                    <Layout>
                        <Users />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/services"
            element={
                <PrivateRoute allowedRoles={["admin", "resepsionis"]}>
                    <Layout>
                        <RoomServices />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/reports/history"
            element={
                <PrivateRoute allowedRoles={["admin"]}>
                    <Layout>
                        <ReportHistory />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/reports/history-reservations"
            element={
                <PrivateRoute allowedRoles={["admin"]}>
                    <Layout>
                        <ReservationHistory />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/reports/reservations"
            element={
                <PrivateRoute allowedRoles={["admin", "resepsionis"]}>
                    <Layout>
                        <ReportReservations />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/reports/income"
            element={
                <PrivateRoute allowedRoles={["admin"]}>
                    <Layout>
                        <ReportIncome />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/reports/rooms"
            element={
                <PrivateRoute allowedRoles={["admin", "resepsionis"]}>
                    <Layout>
                        <ReportRooms />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/logs"
            element={
                <PrivateRoute allowedRoles={["admin"]}>
                    <Layout>
                        <UserLogs />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
);

export default AppRoutes;
