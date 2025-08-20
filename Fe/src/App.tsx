import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import './App.css';

// Lazy-loaded pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUp'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const HomePage = lazy(() => import('./pages/Home'));
const GridView = lazy(() => import('./pages/GridView'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const TeacherCourses = lazy(() => import('./pages/TeacherCourses'));
const Index = lazy(() => import('./pages/index'));
const VisiMisiPage = lazy(() => import('./pages/VisiMisi'));
const SejarahSekolah = lazy(() => import('./pages/SejarahSekolah'));
const NilaiBudayaSekolah = lazy(() => import('./pages/NilaiBudayaSekolah'));
const Organisasi = lazy(() => import('./pages/Organisasi'));
const ProgramAkuntansi = lazy(() => import('./pages/ProgramAkuntansi'));
const ProgramKuliner = lazy(() => import('./pages/ProgramKuliner'));
const ProgramPerhotelan = lazy(() => import('./pages/ProgramPerhotelan'));
const ProgramTI = lazy(() => import('./pages/ProgramTI'));
const ProgramDKV = lazy(() => import('./pages/ProgramDKV'));
const Ekstrakulikuler = lazy(() => import('./pages/Ekstrakulikuler'));
const BeritaSekolah = lazy(() => import('./pages/BeritaSekolah'));
const PPDBPage = lazy(() => import('./pages/PPDB'));
const PilloKaliana = lazy(() => import('./pages/PilloKaliana'));
const ArtisanBeveragesStudio = lazy(() => import('./pages/ArtisanBeveragesStudio'));
const MetschooDeli = lazy(() => import('./pages/MetschooDeli'));
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ScrollToTop />
          <Suspense fallback={null}>
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
            <Route path="/sejarah-sekolah" element={<SejarahSekolah />} />
            <Route path="/nilai-budaya-sekolah" element={<NilaiBudayaSekolah />} />
            <Route path="/organisasi" element={<Organisasi />} />
            <Route path="/program/akuntansi" element={<ProgramAkuntansi />} />
            <Route path="/program/kuliner" element={<ProgramKuliner />} />
            <Route path="/program/perhotelan" element={<ProgramPerhotelan />} />
            <Route path="/program/ti" element={<ProgramTI />} />
            <Route path="/program/dkv" element={<ProgramDKV />} />
            <Route path="/ekstrakulikuler" element={<Ekstrakulikuler />} />
            <Route path="/berita" element={<BeritaSekolah />} />
            <Route path="/ppdb" element={<PPDBPage />} />
            <Route path="/pillo" element={<PilloKaliana />} />
            <Route path="/artisan-beverages" element={<ArtisanBeveragesStudio />} />
            <Route path="/metschoo-deli" element={<MetschooDeli />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Catch all route - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          </Suspense>
          <BackToTop />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
