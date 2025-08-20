import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AdminUser = { id?: number; username?: string; email?: string };

type SectionKey =
	| 'overview'
	| 'hero'
	| 'trending'
	| 'programs'
	| 'partnerships'
	| 'news'
	| 'extracurricular'
	| 'footer'
	| 'settings';

const AdminDashboard: React.FC = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [active, setActive] = useState<SectionKey>('overview');
	const [collapsed, setCollapsed] = useState(false);
	const [msLearnTitle, setMsLearnTitle] = useState('');
	const [trendingText, setTrendingText] = useState('');
	const [programsNote, setProgramsNote] = useState('');
	const [newsNote, setNewsNote] = useState('');
	const [footerNote, setFooterNote] = useState('');
	const [success, setSuccess] = useState('');

	const adminUser: AdminUser | null = useMemo(() => {
		try {
			const raw = localStorage.getItem('admin_user');
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	}, []);

	const displayName = adminUser?.username || 'Admin';
	const displayEmail = adminUser?.email || 'admin@example.com';

	const getToken = (): string | null => localStorage.getItem('admin_token');

	useEffect(() => {
		const token = getToken();
		if (!token) {
			navigate('/admin/login', { replace: true });
			return;
		}
		// No server fetch (settings API removed per request)
		setLoading(false);
	}, [navigate]);

	const fakeSave = () => {
		setSaving(true);
		setTimeout(() => {
			setSaving(false);
			setSuccess('Perubahan disimpan (simulasi). Integrasi API dapat ditambahkan nanti.');
			setTimeout(() => setSuccess(''), 1500);
		}, 600);
	};

	const logout = () => {
		localStorage.removeItem('admin_token');
		localStorage.removeItem('admin_user');
		navigate('/admin/login');
	};

	const teal = '#035757';
	const cyan = '#00bcd4';
	const slate = '#334155';

	const styles: Record<string, React.CSSProperties> = {
		page: { minHeight: '100vh', background: '#ffffff', display: 'flex', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' },
		sidebar: { background: '#ffffff', color: '#0f172a', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb', transition: 'width 240ms ease' },
		brand: { padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #e5e7eb' },
		brandImg: { width: 30, height: 30, objectFit: 'contain', borderRadius: 6, background: '#fff' },
		brandText: { fontSize: 15, fontWeight: 800, color: teal, letterSpacing: 0.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
		nav: { padding: 8, display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflowY: 'auto' },
		navItem: { padding: '10px 12px', borderRadius: 8, cursor: 'pointer', color: '#0f172a', border: 'none', outline: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
		navItemActive: { background: `linear-gradient(135deg, ${teal}, ${cyan})`, color: 'white', fontWeight: 800, border: 'none', outline: 'none', boxShadow: 'none' },
		contentWrap: { flex: 1, background: '#ffffff', display: 'flex', flexDirection: 'column' },
		header: { height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid #e5e7eb', background: '#ffffff', position: 'sticky', top: 0, zIndex: 10 },
		headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
		headerTitle: { fontSize: 18, fontWeight: 800, color: teal },
		iconBtn: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontWeight: 800, color: teal, outline: 'none' },
		userBox: { display: 'flex', alignItems: 'center', gap: 12, background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: 10 },
		avatar: { width: 28, height: 28, borderRadius: 999, background: teal, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 },
		userMeta: { display: 'flex', flexDirection: 'column', lineHeight: 1 },
		userName: { fontSize: 12, fontWeight: 800, color: '#0f172a' },
		userEmail: { fontSize: 12, color: slate },
		main: { padding: 20, display: 'flex', flexDirection: 'column', gap: 16 },
		card: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, boxShadow: '0 6px 18px rgba(15,23,42,0.04)' },
		sectionTitle: { fontSize: 16, fontWeight: 800, color: teal, marginBottom: 10 },
		input: { width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 10, background: '#ffffff', outline: 'none' },
		textarea: { width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 10, background: '#ffffff', minHeight: 140, outline: 'none' },
		buttonRow: { display: 'flex', gap: 10, alignItems: 'center' },
		primaryBtn: { background: teal, color: 'white', border: 'none', borderRadius: 10, padding: '10px 14px', fontWeight: 800, cursor: 'pointer', outline: 'none' },
		ghostBtn: { background: '#ffffff', color: teal, border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontWeight: 700, cursor: 'pointer', outline: 'none' },
		success: { background: '#dcfce7', color: '#166534', padding: 10, borderRadius: 10, border: '1px solid #bbf7d0' },
		grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
	};

	const sections: { key: SectionKey; label: string }[] = [
		{ key: 'overview', label: 'Overview' },
		{ key: 'hero', label: 'Hero' },
		{ key: 'trending', label: 'Trending' },
		{ key: 'programs', label: 'Program Keahlian' },
		{ key: 'partnerships', label: 'Partnership' },
		{ key: 'news', label: 'Berita' },
		{ key: 'extracurricular', label: 'Ekstrakulikuler' },
		{ key: 'footer', label: 'Footer' },
		{ key: 'settings', label: 'Pengaturan' },
	];

	const avatarText = (displayName || 'A').toUpperCase().slice(0, 2);

	const sidebarComputed: React.CSSProperties = {
		...styles.sidebar,
		width: collapsed ? 0 : 260,
		overflow: 'hidden',
		willChange: 'width',
	};

	if (loading) {
		return (
			<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>Memuat...</div>
		);
	}

	return (
		<div style={styles.page}>
			{/* Sidebar */}
			<aside style={sidebarComputed}>
				<div style={styles.brand}>
					<img src="/SMK LOGO.png" alt="Metland School" style={styles.brandImg} />
					<div style={styles.brandText}>Metland Admin</div>
				</div>
				<nav style={styles.nav}>
					{sections.map((s) => (
						<div
							key={s.key}
							style={{
								...styles.navItem,
								...(active === s.key ? styles.navItemActive : {}),
							}}
							onClick={() => setActive(s.key)}
						>
							{s.label}
						</div>
					))}
				</nav>
			</aside>

			{/* Content */}
			<section style={styles.contentWrap}>
				{/* Header */}
				<header style={styles.header}>
					<div style={styles.headerLeft}>
						<button aria-label="Toggle sidebar" style={styles.iconBtn} onClick={() => setCollapsed((v) => !v)}>{collapsed ? '☰' : '✕'}</button>
						<h1 style={styles.headerTitle}>Dashboard</h1>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<div style={styles.userBox}>
							<div style={styles.avatar}>{avatarText}</div>
							<div style={styles.userMeta}>
								<span style={styles.userName}>{displayName}</span>
								<span style={styles.userEmail}>{displayEmail}</span>
							</div>
						</div>
						<button onClick={logout} style={styles.ghostBtn}>Logout</button>
					</div>
				</header>

				{/* Main */}
				<main style={styles.main}>
					{success && <div style={styles.success}>{success}</div>}

					{active === 'overview' && (
						<div style={styles.grid2}>
							<div style={styles.card}>
								<h3 style={styles.sectionTitle}>Selamat datang</h3>
								<p style={{ color: slate, margin: 0 }}>
									Gunakan navigasi di kiri untuk mengelola tampilan website sekolah. Perubahan saat ini bersifat demo (tanpa API).
								</p>
							</div>
							<div style={styles.card}>
								<h3 style={styles.sectionTitle}>Tips</h3>
								<ul style={{ margin: 0, paddingLeft: 18, color: slate }}>
									<li>Siapkan konten (teks & gambar) sebelum melakukan perubahan.</li>
									<li>Gunakan gambar berukuran optimal untuk performa terbaik.</li>
								</ul>
							</div>
						</div>
					)}

					{active === 'hero' && (
						<div style={styles.card}>
							<h3 style={styles.sectionTitle}>Hero Section</h3>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
								<input placeholder="Judul besar" style={styles.input} />
								<input placeholder="Subjudul" style={styles.input} />
								<div style={styles.buttonRow}>
									<button style={styles.primaryBtn} onClick={fakeSave} disabled={saving}>
										{saving ? 'Menyimpan...' : 'Simpan (demo)'}
									</button>
									<button style={styles.ghostBtn}>Batal</button>
								</div>
							</div>
						</div>
					)}

					{active === 'trending' && (
						<div style={styles.card}>
							<h3 style={styles.sectionTitle}>Trending</h3>
							<label style={{ fontSize: 13, color: slate, fontWeight: 700 }}>Judul bar MS Learn</label>
							<input value={msLearnTitle} onChange={(e) => setMsLearnTitle(e.target.value)} placeholder="Teks judul" style={{ ...styles.input, marginBottom: 10 }} />
							<label style={{ fontSize: 13, color: slate, fontWeight: 700 }}>Daftar Trending (satu baris per item)</label>
							<textarea value={trendingText} onChange={(e) => setTrendingText(e.target.value)} placeholder={"Judul trending 1\nJudul trending 2"} style={styles.textarea} />
							<div style={{ ...styles.buttonRow, marginTop: 10 }}>
								<button style={styles.primaryBtn} onClick={fakeSave} disabled={saving}>
									{saving ? 'Menyimpan...' : 'Simpan (demo)'}
								</button>
								<button style={styles.ghostBtn}>Batal</button>
							</div>
						</div>
					)}

					{active === 'programs' && (
						<div style={styles.card}>
							<h3 style={styles.sectionTitle}>Program Keahlian</h3>
							<textarea value={programsNote} onChange={(e) => setProgramsNote(e.target.value)} placeholder="Catatan / konfigurasi program (demo)" style={styles.textarea} />
							<div style={{ ...styles.buttonRow, marginTop: 10 }}>
								<button style={styles.primaryBtn} onClick={fakeSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan (demo)'}</button>
								<button style={styles.ghostBtn}>Batal</button>
							</div>
						</div>
					)}

					{active === 'partnerships' && (
						<div style={styles.card}>
							<h3 style={styles.sectionTitle}>Partnership</h3>
							<p style={{ color: slate, marginTop: 0 }}>Kelola logo dan urutan brand partner (demo).</p>
							<div style={styles.buttonRow}>
								<button style={styles.primaryBtn} onClick={fakeSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan (demo)'}</button>
								<button style={styles.ghostBtn}>Batal</button>
							</div>
						</div>
					)}

					{active === 'news' && (
						<div style={styles.card}>
							<h3 style={styles.sectionTitle}>Berita</h3>
							<textarea value={newsNote} onChange={(e) => setNewsNote(e.target.value)} placeholder="Catatan / konfigurasi berita (demo)" style={styles.textarea} />
							<div style={{ ...styles.buttonRow, marginTop: 10 }}>
								<button style={styles.primaryBtn} onClick={fakeSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan (demo)'}</button>
								<button style={styles.ghostBtn}>Batal</button>
							</div>
						</div>
					)}

					{active === 'extracurricular' && (
						<div style={styles.card}>
							<h3 style={styles.sectionTitle}>Ekstrakulikuler</h3>
							<p style={{ color: slate, marginTop: 0 }}>Kelola gambar slider dan deskripsi kegiatan (demo).</p>
							<div style={styles.buttonRow}>
								<button style={styles.primaryBtn} onClick={fakeSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan (demo)'}</button>
								<button style={styles.ghostBtn}>Batal</button>
							</div>
						</div>
					)}

					{active === 'footer' && (
						<div style={styles.card}>
							<h3 style={styles.sectionTitle}>Footer</h3>
							<textarea value={footerNote} onChange={(e) => setFooterNote(e.target.value)} placeholder="Catatan / konfigurasi footer (demo)" style={styles.textarea} />
							<div style={{ ...styles.buttonRow, marginTop: 10 }}>
								<button style={styles.primaryBtn} onClick={fakeSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan (demo)'}</button>
								<button style={styles.ghostBtn}>Batal</button>
							</div>
						</div>
					)}

					{active === 'settings' && (
						<div style={styles.card}>
							<h3 style={styles.sectionTitle}>Pengaturan</h3>
							<p style={{ color: slate, marginTop: 0 }}>Pengaturan umum panel admin (demo).</p>
							<div style={styles.buttonRow}>
								<button style={styles.primaryBtn} onClick={fakeSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan (demo)'}</button>
								<button style={styles.ghostBtn}>Batal</button>
							</div>
						</div>
					)}
				</main>
			</section>
		</div>
	);
};

export default AdminDashboard;