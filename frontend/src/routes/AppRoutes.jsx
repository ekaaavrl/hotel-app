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

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route
            path="/dashboard"
            element={
                <Layout>
                    <Dashboard />
                </Layout>
            }
        />
        <Route
            path="/guests"
            element={
                <Layout>
                    <Guests />
                </Layout>
            }
        />
        <Route
            path="/room-types"
            element={
                <Layout>
                    <RoomTypes />
                </Layout>}
        />
        <Route
            path="/rooms"
            element={
                <Layout>
                    <Rooms />
                </Layout>}
        />
        <Route
            path="/reservation-form"
            element={<Layout>
                <ReservationForm />
            </Layout>}
        />
        <Route
            path="/reservations"
            element={<Layout>
                <Reservations />
            </Layout>}
        />
        <Route
            path="/payments"
            element={<Layout>
                <Payments />
            </Layout>}
        />
        <Route
            path="/staff"
            element={<Layout>
                <Staff />
            </Layout>}
        />
        <Route
            path="/users"
            element={<Layout>
                <Users />
            </Layout>}
        />
        <Route
            path="/services"
            element={<Layout>
                <RoomServices />
            </Layout>}
        />
        <Route
            path="/reports/history"
            element={<Layout>
                <ReportHistory />
            </Layout>}
        />
        <Route
            path="/reports/reservations"
            element={<Layout>
                <ReportReservations />
            </Layout>}
        />
        <Route
            path="/reports/income"
            element={<Layout>
                <ReportIncome />
            </Layout>}
        />
        <Route
            path="/reports/rooms"
            element={<Layout>
                <ReportRooms />
            </Layout>}
        />
        <Route
            path="/logs"
            element={<Layout>
                <UserLogs />
            </Layout>}
        />

    </Routes>
);

export default AppRoutes;
