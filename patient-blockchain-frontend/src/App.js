import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { BlockchainProvider } from "./context/BlockchainContext"

// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import PatientDashboard from "./pages/PatientDashboard"
import DoctorDashboard from "./pages/DoctorDashboard"
import AdminDashboard from "./pages/AdminDashboard"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

// Styles
import "./styles/global.css"

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  // Get user role from localStorage
  const userRole = localStorage.getItem("userRole")

  if (!userRole) {
    return <Navigate to="/login" />
  }

  if (role && userRole !== role) {
    return <Navigate to={`/${userRole}-dashboard`} />
  }

  return children
}

const App = () => {
  return (
    <BlockchainProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute role="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </BlockchainProvider>
  )
}

export default App
