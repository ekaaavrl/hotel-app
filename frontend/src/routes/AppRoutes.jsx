import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Guests from "../pages/Guests";
import Layout from "../components/Layout";
import RoomTypes from "../pages/RoomsType";
import Rooms from "../pages/Rooms";
import ReservationForm from "../components/ReservationForm";
import Reservations from "../components/Reservations";
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

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Login />} />

        <Route
            path="/dashboard"
            element={
                <PrivateRoute>
                    <Layout>
                        <Dashboard />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/guests"
            element={
                <PrivateRoute>
                    <Layout>
                        <Guests />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/room-types"
            element={
                <PrivateRoute>
                    <Layout>
                        <RoomTypes />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/rooms"
            element={
                <PrivateRoute>
                    <Layout>
                        <Rooms />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/reservation-form"
            element={
                <PrivateRoute>
                    <Layout>
                        <ReservationForm />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/reservations"
            element={
                <PrivateRoute>
                    <Layout>
                        <Reservations />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/payments"
            element={
                <PrivateRoute>
                    <Layout>
                        <Payments />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/staff"
            element={
                <PrivateRoute>
                    <Layout>
                        <Staff />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/users"
            element={
                <PrivateRoute>
                    <Layout>
                        <Users />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/services"
            element={
                <PrivateRoute>
                    <Layout>
                        <RoomServices />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/reports/history"
            element={
                <PrivateRoute>
                    <Layout>
                        <ReportHistory />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/reports/reservations"
            element={
                <PrivateRoute>
                    <Layout>
                        <ReportReservations />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/reports/income"
            element={
                <PrivateRoute>
                    <Layout>
                        <ReportIncome />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/reports/rooms"
            element={
                <PrivateRoute>
                    <Layout>
                        <ReportRooms />
                    </Layout>
                </PrivateRoute>
            }
        />
        <Route
            path="/logs"
            element={
                <PrivateRoute>
                    <Layout>
                        <UserLogs />
                    </Layout>
                </PrivateRoute>
            }
        />
    </Routes>
);

export default AppRoutes;
