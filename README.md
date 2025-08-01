# LMS Arma Garage - Learning Management System

## 🚀 Project Overview
Sistem manajemen pembelajaran berbasis web dengan fitur lengkap untuk siswa dan admin/guru.

## 📁 Struktur Project
```
Lms Arma garage dev/
├── Fe/                 # Frontend (React + Vite + TypeScript)
├── Be/                 # Backend (Golang + MySQL)
└── README.md          # Dokumentasi utama
```

## 🛠️ Tech Stack
- **Frontend**: React 19 + Vite + TypeScript + React Router
- **Backend**: Golang + Gorilla Mux + MySQL
- **Database**: MySQL
- **Icons**: Lucide React

## 🏃‍♂️ Cara Menjalankan

### Frontend (React)
```bash
cd Fe
npm install
npm run dev
```
Server akan berjalan di: http://localhost:5173 atau http://localhost:5174

### Backend (Golang)
```bash
cd Be
go run .
```
Server akan berjalan di: http://localhost:8080

## 🔗 Routes & Navigation

### Frontend Routes:
- `/` → Redirect ke `/login`
- `/login` → Halaman login
- `/signup` → Halaman registrasi
- `/dashboard` → Dashboard siswa
- `*` → Redirect ke `/login` (404 handler)

### Backend Endpoints:
- `GET /api/health` → Health check
- `POST /api/auth/login` → Login endpoint (dummy)
- `GET /api/users` → Users endpoint (dummy)
- `GET /api/materials` → Materials endpoint (dummy)
- `GET /api/quizzes` → Quizzes endpoint (dummy)

## ✨ Fitur yang Sudah Implementasi

### ✅ Frontend:
- ✅ Routing dengan React Router
- ✅ Login page dengan form validation
- ✅ Sign up page dengan form validation
- ✅ Dashboard page dengan course overview
- ✅ Navigation antar halaman (Login ↔ Sign Up)
- ✅ Logo assets yang terbaca dengan benar
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Logout functionality

### ✅ Backend:
- ✅ Database connection ke MySQL
- ✅ Auto-create tables
- ✅ RESTful API structure
- ✅ Health check endpoint
- ✅ CORS ready
- ✅ Environment variables support

## 🎨 UI/UX Features
- Modern dan clean design
- Hover effects pada buttons dan cards
- Focus states pada input fields
- Consistent color scheme
- Responsive layout
- Loading states ready

## 🔧 Development Notes

### Logo Assets:
- Logo tersimpan di: `Fe/public/logo.svg`
- Diakses dengan path: `/logo.svg`
- Format: SVG dengan gradient shield design

### Navigation Flow:
- Login page → Click "Sign Up" → Navigate to Sign Up page
- Sign Up page → Click "Login" → Navigate to Login page
- Login success → Navigate to Dashboard
- Dashboard → Click logout icon → Navigate to Login

### Database:
- Database name: `lms_garage`
- Connection: `root@localhost:3306`
- Auto-creates tables: users, materials, quizzes, quiz_questions

## 🚧 Next Steps (Belum Implementasi)
- Authentication dengan JWT
- API integration antara frontend dan backend
- User management
- Course management
- Quiz system
- File upload untuk materials
- Real-time notifications
- Progress tracking

## 📝 Environment Setup

### Frontend (.env):
```
VITE_API_URL=http://localhost:8080
```

### Backend (.env):
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=lms_garage
PORT=8080
```

## 🎯 Status Project
- ✅ **Frontend**: Routing, UI, Navigation - SELESAI
- ✅ **Backend**: Database, API structure - SELESAI  
- 🚧 **Integration**: API calls - BELUM
- 🚧 **Authentication**: JWT - BELUM
- 🚧 **Features**: Course, Quiz, User management - BELUM

**Project siap untuk development lanjutan!** 🎉