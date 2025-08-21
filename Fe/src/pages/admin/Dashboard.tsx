import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, siteAPI } from '../../services/api';
import { Plus, Edit2, Trash2, X, Calendar } from 'lucide-react';

type AdminUser = { id?: number; username?: string; email?: string };

type NewsItem = {
	id: number;
	title: string;
	content: string;
	date: string;
	image_url: string;
	is_featured: number;
};

type SectionKey =
	| 'overview'
	| 'infographics'
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
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const [msLearnTitle, setMsLearnTitle] = useState('');
	const [trendingText, setTrendingText] = useState('');
	const [programsNote, setProgramsNote] = useState('');
	const [footerNote, setFooterNote] = useState('');
	const [success, setSuccess] = useState('');
	const [siswa, setSiswa] = useState<number | ''>('');
	const [guru, setGuru] = useState<number | ''>('');
	const [tendik, setTendik] = useState<number | ''>('');

	// News management state
	const [newsList, setNewsList] = useState<NewsItem[]>([]);
	const [showNewsForm, setShowNewsForm] = useState(false);
	const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState<NewsItem | null>(null);
	const [newsForm, setNewsForm] = useState({
		title: '',
		content: '',
		date: '',
		image_url: '',
		is_featured: 0
	});
	const [uploadingImage, setUploadingImage] = useState(false);
	const [imagePreview, setImagePreview] = useState<string>('');

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

	// News management functions
	const loadNews = useCallback(async () => {
		try {
			const news = await siteAPI.getNews();
			setNewsList(news || []); // Ensure we always set an array even if API returns null
		} catch (error: any) {
			console.error('Failed to load news:', error);
			setSuccess('Gagal memuat berita.');
			setTimeout(() => setSuccess(''), 2000);
			setNewsList([]); // Set empty array on error
		}
	}, []);

	useEffect(() => {
		const token = getToken();
		if (!token) {
			navigate('/admin/login', { replace: true });
			return;
		}
		// preload infographics values
		siteAPI.getInfographics().then((d) => {
			if (typeof d.siswa === 'number') setSiswa(d.siswa);
			if (typeof d.guru === 'number') setGuru(d.guru);
			if (typeof d.tendik === 'number') setTendik(d.tendik);
		}).finally(() => setLoading(false));

		// Load news from backend with a small delay to ensure everything is ready
		setTimeout(() => {
			loadNews();
		}, 500);
	}, [navigate, loadNews]);

	const fakeSave = () => {
		setSaving(true);
		setTimeout(() => {
			setSaving(false);
			setSuccess('Perubahan disimpan (simulasi). Integrasi API dapat ditambahkan nanti.');
			setTimeout(() => setSuccess(''), 1500);
		}, 600);
	};

	const saveInfographics = async () => {
		try {
			setSaving(true);
			await adminAPI.updateInfographics({
				siswa: siswa === '' ? undefined : Number(siswa),
				guru: guru === '' ? undefined : Number(guru),
				tendik: tendik === '' ? undefined : Number(tendik),
			});
			setSuccess('Info Grafis tersimpan.');
			setTimeout(() => setSuccess(''), 2000);
		} catch {
			setSuccess('Gagal menyimpan Info Grafis.');
		} finally { setSaving(false); }
	};

	const openNewsForm = (news?: NewsItem) => {
		if (news) {
			setEditingNews(news);
			setNewsForm({
				title: news.title,
				content: news.content,
				date: news.date,
				image_url: news.image_url,
				is_featured: news.is_featured
			});
			setImagePreview(news.image_url);
		} else {
			setEditingNews(null);
			setNewsForm({
				title: '',
				content: '',
				date: new Date().toISOString().split('T')[0],
				image_url: '',
				is_featured: 0
			});
			setImagePreview('');
		}
		setShowNewsForm(true);
	};

	const closeNewsForm = () => {
		setShowNewsForm(false);
		setEditingNews(null);
		setNewsForm({
			title: '',
			content: '',
			date: '',
			image_url: '',
			is_featured: 0
		});
		setImagePreview('');
		setUploadingImage(false);
	};

	const handleImageUpload = async (file: File) => {
		if (!file) return;

		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			setSuccess('Tipe file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.');
			setTimeout(() => setSuccess(''), 3000);
			return;
		}

		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			setSuccess('Ukuran file terlalu besar. Maksimal 5MB.');
			setTimeout(() => setSuccess(''), 3000);
			return;
		}

		setUploadingImage(true);
		try {
			const result = await adminAPI.uploadNewsImage(file);
			if (result.success) {
				setNewsForm(prev => ({ ...prev, image_url: result.file_path }));
				setImagePreview(result.file_path);
				setSuccess('Gambar berhasil diupload!');
				setTimeout(() => setSuccess(''), 2000);
			} else {
				setSuccess('Gagal upload gambar: ' + result.message);
				setTimeout(() => setSuccess(''), 3000);
			}
		} catch (error: any) {
			console.error('Image upload error:', error);
			setSuccess('Gagal upload gambar: ' + (error.response?.data?.message || error.message));
			setTimeout(() => setSuccess(''), 3000);
		} finally {
			setUploadingImage(false);
		}
	};

	const saveNews = async () => {
		if (!newsForm.title.trim() || !newsForm.content.trim()) {
			setSuccess('Judul dan konten berita wajib diisi.');
			setTimeout(() => setSuccess(''), 2000);
			return;
		}

		try {
			setSaving(true);
			if (editingNews) {
				// Update existing news
				await adminAPI.updateNews(editingNews.id, newsForm);
				setSuccess('Berita berhasil diperbarui.');
			} else {
				// Add new news
				await adminAPI.createNews(newsForm);
				setSuccess('Berita berhasil ditambahkan.');
			}
			await loadNews(); // Refresh the list
			setTimeout(() => setSuccess(''), 2000);
			closeNewsForm();
		} catch (error) {
			setSuccess('Gagal menyimpan berita.');
			setTimeout(() => setSuccess(''), 2000);
		} finally {
			setSaving(false);
		}
	};

	const confirmDelete = (news: NewsItem) => {
		setDeleteConfirm(news);
	};

	const deleteNews = async () => {
		if (!deleteConfirm) return;

		try {
			setSaving(true);
			await adminAPI.deleteNews(deleteConfirm.id);
			setSuccess('Berita berhasil dihapus.');
			setTimeout(() => setSuccess(''), 2000);
			setDeleteConfirm(null);
			await loadNews(); // Refresh the list
		} catch (error) {
			setSuccess('Gagal menghapus berita.');
			setTimeout(() => setSuccess(''), 2000);
		} finally {
			setSaving(false);
		}
	};

	const logout = () => {
		localStorage.removeItem('admin_token');
		localStorage.removeItem('admin_user');
		navigate('/admin/login');
	};

	const teal = '#035757';
	const cyan = '#00bcd4';
	const isDark = theme === 'dark';
	const bg = isDark ? '#0f172a' : '#ffffff';
	const surface = isDark ? '#111827' : '#ffffff';
	const border = isDark ? '#1f2937' : '#e5e7eb';
	const text = isDark ? '#e5e7eb' : '#0f172a';
	const subtext = isDark ? '#cbd5e1' : '#334155';
	const cardBorder = isDark ? '#263244' : '#e2e8f0';
	const shadowAlpha = isDark ? '0.10' : '0.04';

	const styles: Record<string, React.CSSProperties> = {
		page: { minHeight: '100vh', background: bg, display: 'flex', color: text, fontFamily: 'Inter, system-ui, sans-serif' },
		sidebar: { background: surface, color: text, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${border}`, transition: 'width 240ms ease' },
		brand: { padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${border}` },
		brandImg: { width: 30, height: 30, objectFit: 'contain', borderRadius: 6, background: '#fff' },
		brandText: { fontSize: 15, fontWeight: 800, color: teal, letterSpacing: 0.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
		nav: { padding: 8, display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflowY: 'auto' },
		navItem: { padding: '10px 12px', borderRadius: 8, cursor: 'pointer', color: text, border: 'none', outline: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
		navItemActive: { background: `linear-gradient(135deg, ${teal}, ${cyan})`, color: 'white', fontWeight: 800, border: 'none', outline: 'none', boxShadow: 'none' },
		contentWrap: { flex: 1, background: bg, display: 'flex', flexDirection: 'column' },
		header: { height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: `1px solid ${border}`, background: surface, position: 'sticky', top: 0, zIndex: 10 },
		headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
		headerTitle: { fontSize: 18, fontWeight: 800, color: teal },
		iconBtn: { background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontWeight: 800, color: teal, outline: 'none' },
		userBox: { display: 'flex', alignItems: 'center', gap: 12, background: surface, border: `1px solid ${border}`, padding: '8px 12px', borderRadius: 10 },
		avatar: { width: 28, height: 28, borderRadius: 999, background: teal, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 },
		userMeta: { display: 'flex', flexDirection: 'column', lineHeight: 1 },
		userName: { fontSize: 12, fontWeight: 800, color: text },
		userEmail: { fontSize: 12, color: subtext },
		main: { padding: 20, display: 'flex', flexDirection: 'column', gap: 16 },
		card: { background: surface, border: `1px solid ${cardBorder}`, borderRadius: 12, padding: 16, boxShadow: `0 6px 18px rgba(15,23,42,${shadowAlpha})` },
		sectionTitle: { fontSize: 16, fontWeight: 800, color: teal, marginBottom: 10 },
		input: { width: '100%', padding: '10px 12px', border: `1px solid ${cardBorder}`, borderRadius: 10, background: surface, color: text, outline: 'none' },
		textarea: { width: '100%', padding: '10px 12px', border: `1px solid ${cardBorder}`, borderRadius: 10, background: surface, color: text, minHeight: 140, outline: 'none' },
		buttonRow: { display: 'flex', gap: 10, alignItems: 'center' },
		primaryBtn: { background: teal, color: 'white', border: 'none', borderRadius: 10, padding: '10px 14px', fontWeight: 800, cursor: 'pointer', outline: 'none' },
		ghostBtn: { background: surface, color: teal, border: `1px solid ${border}`, borderRadius: 10, padding: '10px 14px', fontWeight: 700, cursor: 'pointer', outline: 'none' },
		success: { background: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#d1fae5' : '#166534', padding: 10, borderRadius: 10, border: `1px solid ${isDark ? '#065f46' : '#bbf7d0'}` },
		grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
		themeBtn: { background: surface, border: `1px solid ${border}`, color: teal, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontWeight: 800 },

		// News management styles
		newsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 20 },
		newsCard: { background: surface, border: `1px solid ${cardBorder}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 4px 12px rgba(15,23,42,${shadowAlpha})`, cursor: 'pointer', transition: 'all 0.2s ease' },
		newsImage: { width: '100%', height: 160, objectFit: 'cover', background: '#f1f5f9' },
		newsContent: { padding: 16 },
		newsTitle: { fontSize: 16, fontWeight: 700, color: text, marginBottom: 8, lineHeight: 1.4 },
		newsDate: { fontSize: 12, color: subtext, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 },
		newsExcerpt: { fontSize: 13, color: subtext, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
		newsActions: { padding: '12px 16px', borderTop: `1px solid ${cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
		newsActionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, transition: 'background 0.2s' },
		newsFeatured: { background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 },

		floatingBtn: { position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, background: teal, color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(3,87,87,0.3)', zIndex: 1000, transition: 'all 0.2s ease' },
		floatingBtnHover: { transform: 'scale(1.1)', boxShadow: '0 6px 20px rgba(3,87,87,0.4)' },

		modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 20 },
		modalContent: { background: surface, borderRadius: 16, padding: 24, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto', position: 'relative' },
		modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
		modalTitle: { fontSize: 20, fontWeight: 700, color: text, margin: 0 },
		closeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, color: subtext },

		formGroup: { marginBottom: 16 },
		formLabel: { display: 'block', fontSize: 13, fontWeight: 700, color: subtext, marginBottom: 6 },
		formInput: { width: '100%', padding: '12px', border: `1px solid ${cardBorder}`, borderRadius: 8, background: surface, color: text, fontSize: 14 },

		checkboxContainer: { display: 'flex', alignItems: 'center', gap: 8 },
		checkbox: { width: 16, height: 16, accentColor: teal },

		confirmDialog: { background: surface, borderRadius: 12, padding: 20, maxWidth: 400, textAlign: 'center' },
		confirmTitle: { fontSize: 18, fontWeight: 700, color: text, marginBottom: 8 },
		confirmText: { color: subtext, marginBottom: 20, lineHeight: 1.5 },
		confirmButtons: { display: 'flex', gap: 10, justifyContent: 'center' },

		emptyState: { textAlign: 'center', padding: '40px 20px', color: subtext },
		emptyIcon: { fontSize: 48, marginBottom: 16, opacity: 0.5 },
		emptyText: { fontSize: 16, marginBottom: 8 },
		emptySubtext: { fontSize: 14 },

		newsCardHover: { transform: 'translateY(-2px)', boxShadow: `0 8px 24px rgba(15,23,42,${shadowAlpha})` },
	};

	const sections: { key: SectionKey; label: string }[] = [
		{ key: 'overview', label: 'Overview' },
		{ key: 'news', label: 'Berita' },
		{ key: 'trending', label: 'Trending' },
		{ key: 'infographics', label: 'Info Grafis' },
		{ key: 'programs', label: 'Program Keahlian' },
		{ key: 'partnerships', label: 'Partnership' },
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
			<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: text }}>Memuat...</div>
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
						<button style={styles.themeBtn} onClick={() => setTheme(isDark ? 'light' : 'dark')}>{isDark ? '☀️ Bright' : '🌙 Night'}</button>
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

					{/* Overview */}
					{active === 'overview' && (
						<div style={styles.grid2}>
							<div style={styles.card}>
								<h3 style={styles.sectionTitle}>Selamat datang</h3>
								<p style={{ color: subtext, margin: 0 }}>
									Gunakan navigasi di kiri untuk mengelola tampilan website sekolah. Perubahan saat ini bersifat demo (tanpa API).
								</p>
							</div>
							<div style={styles.card}>
								<h3 style={styles.sectionTitle}>Tips</h3>
								<ul style={{ margin: 0, paddingLeft: 18, color: subtext }}>
									<li>Siapkan konten (teks & gambar) sebelum melakukan perubahan.</li>
									<li>Gunakan gambar berukuran optimal untuk performa terbaik.</li>
								</ul>
							</div>
						</div>
					)}

					{/* News */}
					{active === 'news' && (
						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
								<h3 style={styles.sectionTitle}>Kelola Berita</h3>
								<div style={{ fontSize: 12, color: subtext }}>
									Total: {newsList.length} berita
								</div>
							</div>

							{newsList.length === 0 ? (
								<div style={styles.emptyState}>
									<div style={styles.emptyIcon}>📰</div>
									<div style={styles.emptyText}>Belum ada berita</div>
									<div style={styles.emptySubtext}>Klik tombol + untuk menambah berita pertama</div>
								</div>
							) : (
								<div style={styles.newsGrid}>
									{newsList.map((news) => (
										<div
											key={news.id}
											style={styles.newsCard}
											onClick={() => openNewsForm(news)}
											onMouseEnter={(e) => {
												e.currentTarget.style.transform = 'translateY(-2px)';
												e.currentTarget.style.boxShadow = `0 8px 24px rgba(15,23,42,${shadowAlpha})`;
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.transform = 'translateY(0)';
												e.currentTarget.style.boxShadow = `0 4px 12px rgba(15,23,42,${shadowAlpha})`;
											}}
										>
											<img
												src={news.image_url || '/SMK LOGO.png'}
												alt={news.title}
												style={styles.newsImage}
												onError={(e) => {
													e.currentTarget.src = '/SMK LOGO.png';
												}}
											/>
											<div style={styles.newsContent}>
												<h4 style={styles.newsTitle}>{news.title}</h4>
												<div style={styles.newsDate}>
													<Calendar size={12} />
													{news.date}
													{news.is_featured === 1 && (
														<span style={styles.newsFeatured}>Featured</span>
													)}
												</div>
												<p style={styles.newsExcerpt}>
													{news.content.length > 150
														? news.content.substring(0, 150) + '...'
														: news.content}
												</p>
											</div>
											<div style={styles.newsActions}>
												<div>
													{news.is_featured === 1 && (
														<span style={styles.newsFeatured}>Featured</span>
													)}
												</div>
												<div style={{ display: 'flex', gap: 4 }}>
													<button
														style={{ ...styles.newsActionBtn, color: teal }}
														onClick={(e) => {
															e.stopPropagation();
															openNewsForm(news);
														}}
														title="Edit berita"
													>
														<Edit2 size={14} />
													</button>
													<button
														style={{ ...styles.newsActionBtn, color: '#dc2626' }}
														onClick={(e) => {
															e.stopPropagation();
															confirmDelete(news);
														}}
														title="Hapus berita"
													>
														<Trash2 size={14} />
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}

							{/* Floating Action Button */}
							<button
								style={styles.floatingBtn}
								onClick={() => openNewsForm()}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'scale(1.1)';
									e.currentTarget.style.boxShadow = '0 6px 20px rgba(3,87,87,0.4)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'scale(1)';
									e.currentTarget.style.boxShadow = '0 4px 16px rgba(3,87,87,0.3)';
								}}
								title="Tambah berita baru"
							>
								<Plus size={24} />
							</button>
						</div>
					)}

					{/* Trending */}
					{active === 'trending' && (
						<div style={styles.card}>
							<h3 style={styles.sectionTitle}>Trending</h3>
							<label style={{ fontSize: 13, color: subtext, fontWeight: 700 }}>Judul bar MS Learn</label>
							<input value={msLearnTitle} onChange={(e) => setMsLearnTitle(e.target.value)} placeholder="Teks judul" style={{ ...styles.input, marginBottom: 10 }} />
							<label style={{ fontSize: 13, color: subtext, fontWeight: 700 }}>Daftar Trending (satu baris per item)</label>
							<textarea value={trendingText} onChange={(e) => setTrendingText(e.target.value)} placeholder={"Judul trending 1\nJudul trending 2"} style={styles.textarea} />
							<div style={{ ...styles.buttonRow, marginTop: 10 }}>
								<button style={styles.primaryBtn} onClick={fakeSave} disabled={saving}>
									{saving ? 'Menyimpan...' : 'Simpan (demo)'}
								</button>
								<button style={styles.ghostBtn}>Batal</button>
							</div>
						</div>
					)}

					{/* Info Grafis */}
					{active === 'infographics' && (
						<div style={styles.card}>
							<h3 style={styles.sectionTitle}>Info Grafis</h3>
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
								<div>
									<label style={{ fontSize: 13, color: subtext, fontWeight: 700 }}>Siswa</label>
									<input type="number" value={siswa} onChange={(e) => setSiswa(e.target.value === '' ? '' : Number(e.target.value))} style={styles.input} />
								</div>
								<div>
									<label style={{ fontSize: 13, color: subtext, fontWeight: 700 }}>Guru</label>
									<input type="number" value={guru} onChange={(e) => setGuru(e.target.value === '' ? '' : Number(e.target.value))} style={styles.input} />
								</div>
								<div>
									<label style={{ fontSize: 13, color: subtext, fontWeight: 700 }}>Tendik</label>
									<input type="number" value={tendik} onChange={(e) => setTendik(e.target.value === '' ? '' : Number(e.target.value))} style={styles.input} />
								</div>
							</div>
							<div style={{ ...styles.buttonRow, marginTop: 12 }}>
								<button style={styles.primaryBtn} onClick={saveInfographics} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
								<button style={styles.ghostBtn}>Batal</button>
							</div>
						</div>
					)}

					{/* Programs */}
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

					{/* Partnerships */}
					{active === 'partnerships' && (
						<div style={styles.card}>
							<h3 style={styles.sectionTitle}>Partnership</h3>
							<p style={{ color: subtext, marginTop: 0 }}>Kelola logo dan urutan brand partner (demo).</p>
							<div style={styles.buttonRow}>
								<button style={styles.primaryBtn} onClick={fakeSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan (demo)'}</button>
								<button style={styles.ghostBtn}>Batal</button>
							</div>
						</div>
					)}

					{/* Extracurricular */}
					{active === 'extracurricular' && (
						<div style={styles.card}>
							<h3 style={styles.sectionTitle}>Ekstrakulikuler</h3>
							<p style={{ color: subtext, marginTop: 0 }}>Kelola gambar slider dan deskripsi kegiatan (demo).</p>
							<div style={styles.buttonRow}>
								<button style={styles.primaryBtn} onClick={fakeSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan (demo)'}</button>
								<button style={styles.ghostBtn}>Batal</button>
							</div>
						</div>
					)}

					{/* Footer */}
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

					{/* Settings */}
					{active === 'settings' && (
						<div style={styles.card}>
							<h3 style={styles.sectionTitle}>Pengaturan</h3>
							<p style={{ color: subtext, marginTop: 0 }}>Pengaturan umum panel admin (demo).</p>
							<div style={styles.buttonRow}>
								<button style={styles.primaryBtn} onClick={fakeSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan (demo)'}</button>
								<button style={styles.ghostBtn}>Batal</button>
							</div>
						</div>
					)}
				</main>
			</section>

			{/* News Form Modal */}
			{showNewsForm && (
				<div style={styles.modal}>
					<div style={styles.modalContent}>
						<div style={styles.modalHeader}>
							<h2 style={styles.modalTitle}>
								{editingNews ? 'Edit Berita' : 'Tambah Berita Baru'}
							</h2>
							<button style={styles.closeBtn} onClick={closeNewsForm}>
								<X size={20} />
							</button>
						</div>

						<div style={styles.formGroup}>
							<label style={styles.formLabel}>Judul Berita</label>
							<input
								type="text"
								value={newsForm.title}
								onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))}
								style={styles.formInput}
								placeholder="Masukkan judul berita..."
							/>
						</div>

						<div style={styles.formGroup}>
							<label style={styles.formLabel}>Konten Berita</label>
							<textarea
								value={newsForm.content}
								onChange={(e) => setNewsForm(prev => ({ ...prev, content: e.target.value }))}
								style={{ ...styles.formInput, minHeight: 120, resize: 'vertical' }}
								placeholder="Masukkan konten berita..."
							/>
						</div>

						<div style={styles.formGroup}>
							<label style={styles.formLabel}>Tanggal</label>
							<input
								type="date"
								value={newsForm.date}
								onChange={(e) => setNewsForm(prev => ({ ...prev, date: e.target.value }))}
								style={styles.formInput}
							/>
						</div>

						<div style={styles.formGroup}>
							<label style={styles.formLabel}>Gambar Berita</label>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) {
											handleImageUpload(file);
										}
									}}
									style={{
										...styles.formInput,
										padding: '8px',
										border: `2px dashed ${subtext}`,
										background: surface
									}}
									disabled={uploadingImage}
								/>
								{uploadingImage && (
									<div style={{ textAlign: 'center', color: teal, fontSize: 14 }}>
										⏳ Mengupload gambar...
									</div>
								)}
								{(imagePreview || newsForm.image_url) && (
									<div style={{ textAlign: 'center' }}>
										<img
											src={imagePreview || newsForm.image_url}
											alt="Preview"
											style={{
												maxWidth: '200px',
												maxHeight: '150px',
												borderRadius: 8,
												border: `1px solid ${border}`,
												background: bg
											}}
											onError={(e) => {
												e.currentTarget.style.display = 'none';
											}}
										/>
									</div>
								)}
							</div>
						</div>

						<div style={styles.formGroup}>
							<label style={styles.checkboxContainer}>
								<input
									type="checkbox"
									checked={newsForm.is_featured === 1}
									onChange={(e) => setNewsForm(prev => ({ ...prev, is_featured: e.target.checked ? 1 : 0 }))}
									style={styles.checkbox}
								/>
								<span style={{ fontSize: 13, color: subtext, fontWeight: 700 }}>Berita Featured</span>
							</label>
						</div>

						<div style={{ ...styles.buttonRow, marginTop: 24 }}>
							<button style={styles.primaryBtn} onClick={saveNews} disabled={saving}>
								{saving ? 'Menyimpan...' : (editingNews ? 'Update Berita' : 'Tambah Berita')}
							</button>
							<button style={styles.ghostBtn} onClick={closeNewsForm}>
								Batal
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{deleteConfirm && (
				<div style={styles.modal}>
					<div style={{ ...styles.modalContent, maxWidth: 400 }}>
						<div style={styles.confirmDialog}>
							<div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
							<h3 style={styles.confirmTitle}>Hapus Berita</h3>
							<p style={styles.confirmText}>
								Apakah Anda yakin ingin menghapus berita "{deleteConfirm.title}"?
								Tindakan ini tidak dapat dibatalkan.
							</p>
							<div style={styles.confirmButtons}>
								<button
									style={styles.ghostBtn}
									onClick={() => setDeleteConfirm(null)}
								>
									Batal
								</button>
								<button
									style={{ ...styles.primaryBtn, background: '#dc2626' }}
									onClick={deleteNews}
								>
									Hapus
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminDashboard;