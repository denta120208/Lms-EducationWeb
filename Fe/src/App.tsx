import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUp';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/Home';
import GridView from './pages/GridView';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherCourses from './pages/TeacherCourses';
import Index from './pages/index';
import VisiMisiPage from './pages/VisiMisi';
import NilaiBudayaSekolah from './pages/NilaiBudayaSekolah';
import Organisasi from './pages/Organisasi';
import ProgramAkuntansi from './pages/ProgramAkuntansi';
import ProgramKuliner from './pages/ProgramKuliner';
import ProgramPerhotelan from './pages/ProgramPerhotelan';
import ProgramTI from './pages/ProgramTI';
import ProgramDKV from './pages/ProgramDKV';
import Ekstrakulikuler from './pages/Ekstrakulikuler';
import BeritaSekolah from './pages/BeritaSekolah';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Authentication routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            {/* Protected Home route */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Dashboard route */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Grid View route */}
            <Route 
              path="/grid" 
              element={
                <ProtectedRoute>
                  <GridView />
                </ProtectedRoute>
              } 
            />
            
            {/* Teacher routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/courses" element={<TeacherCourses />} />
            
            {/* Landing page as the default route */}
            <Route path="/" element={<Index />} />
            <Route path="/visi-misi" element={<VisiMisiPage />} />
            <Route path="/nilai-budaya-sekolah" element={<NilaiBudayaSekolah />} />
            <Route path="/organisasi" element={<Organisasi />} />
            <Route path="/program/akuntansi" element={<ProgramAkuntansi />} />
            <Route path="/program/kuliner" element={<ProgramKuliner />} />
            <Route path="/program/perhotelan" element={<ProgramPerhotelan />} />
            <Route path="/program/ti" element={<ProgramTI />} />
            <Route path="/program/dkv" element={<ProgramDKV />} />
            <Route path="/ekstrakulikuler" element={<Ekstrakulikuler />} />
            <Route path="/berita" element={<BeritaSekolah />} />
            
            {/* Catch all route - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
