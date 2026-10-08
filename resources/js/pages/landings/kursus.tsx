// Landing page KELAS PINTAR, platform kursus online (coding, desain, bahasa Inggris).
// Self-contained: tidak memakai AuthenticatedLayout, tidak menerima props.
// Header/nav + footer inline.
import { useState, type FormEvent } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StickyMobileCta } from '@/components/sticky-mobile-cta';
import { StatCounter } from '@/components/stat-counter';
import {
    BadgeCheck,
    Brush,
    CheckCircle2,
    Clock,
    Code2,
    CreditCard,
    Infinity as InfinityIcon,
    Languages,
    Laptop,
    Medal,
    Menu,
    PlayCircle,
    Rocket,
    Star,
    Users,
    X,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Format rupiah gaya Indonesia.
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

interface Kelas {
    nama: string;
    harga: number;
    hargaCoret?: number;
    durasi: string;
    level: string;
    materi: string[];
    icon: LucideIcon;
    terlaris?: boolean;
}

const KATALOG: Record<'coding' | 'desain' | 'inggris', Kelas[]> = {
    coding: [
        {
            nama: 'Web Development dari Nol',
            harga: 499000,
            hargaCoret: 899000,
            durasi: '8 minggu • 40+ video',
            level: 'Pemula',
            materi: ['HTML, CSS, JavaScript modern', 'React + Tailwind', 'Deploy & portofolio 3 proyek'],
            icon: Code2,
            terlaris: true,
        },
        {
            nama: 'Python untuk Data',
            harga: 599000,
            hargaCoret: 999000,
            durasi: '10 minggu • 50+ video',
            level: 'Pemula, Menengah',
            materi: ['Python dasar & Pandas', 'Visualisasi data', 'Proyek analisis dataset nyata'],
            icon: Laptop,
        },
        {
            nama: 'Flutter Mobile Apps',
            harga: 699000,
            durasi: '12 minggu • 60+ video',
            level: 'Menengah',
            materi: ['Dart & Flutter widget', 'State management', 'Publish ke Play Store'],
            icon: Rocket,
        },
    ],
    desain: [
        {
            nama: 'UI/UX Design Fundamental',
            harga: 449000,
            hargaCoret: 799000,
            durasi: '6 minggu • 35+ video',
            level: 'Pemula',
            materi: ['Prinsip desain & Figma', 'Wireframe ke prototype', 'Portofolio studi kasus'],
            icon: Brush,
            terlaris: true,
        },
        {
            nama: 'Graphic Design untuk Sosmed',
            harga: 349000,
            durasi: '4 minggu • 28+ video',
            level: 'Pemula',
            materi: ['Canva & Photoshop dasar', 'Branding konten', 'Template siap pakai'],
            icon: PlayCircle,
        },
        {
            nama: 'Motion Graphic Dasar',
            harga: 549000,
            durasi: '8 minggu • 42+ video',
            level: 'Menengah',
            materi: ['After Effects dasar', 'Animasi teks & logo', 'Reel portofolio'],
            icon: Star,
        },
    ],
    inggris: [
        {
            nama: 'Speaking Confidence',
            harga: 399000,
            hargaCoret: 699000,
            durasi: '8 minggu • live class',
            level: 'Pemula, Menengah',
            materi: ['Live speaking 2x seminggu', 'Koreksi pronunciation', 'Kelompok kecil maks 8 orang'],
            icon: Languages,
            terlaris: true,
        },
        {
            nama: 'TOEFL/IELTS Preparation',
            harga: 749000,
            durasi: '12 minggu • live + rekaman',
            level: 'Menengah, Mahir',
            materi: ['Strategi tiap section', 'Try out + pembahasan', 'Target skor 550+/6.5'],
            icon: Medal,
        },
        {
            nama: 'Business English',
            harga: 649000,
            durasi: '10 minggu • live class',
            level: 'Menengah',
            materi: ['Email & meeting profesional', 'Presentasi & negosiasi', 'Simulasi interview kerja'],
            icon: Users,
        },
    ],
};

const TAB_KELAS = [
    { value: 'coding', label: 'Coding' },
    { value: 'desain', label: 'Desain' },
    { value: 'inggris', label: 'Bahasa Inggris' },
] as const;

const TESTIMONI = [
    {
        kutip: 'Dari nol banget soal coding, 2 bulan kemudian saya sudah punya 3 proyek portofolio dan diterima kerja sebagai junior web developer.',
        nama: 'Fajar Nugroho',
        peran: 'Junior Web Developer • Alumni Web Development 2024',
    },
    {
        kutip: 'Mentornya responsif banget. Setiap tugas selalu direview detail, jadi tahu persis bagian mana yang harus diperbaiki.',
        nama: 'Dinda Safitri',
        peran: 'UI/UX Designer • Alumni UI/UX Design 2025',
    },
    {
        kutip: 'Speaking class-nya bikin pede. Sekarang berani presentasi pakai bahasa Inggris di kantor tanpa grogi.',
        nama: 'Rizky Ramadhan',
        peran: 'Marketing Staff • Alumni Speaking Confidence 2024',
    },
];

const FAQ = [
    { q: 'Apakah kelasnya live atau rekaman?', a: 'Keduanya. Materi inti tersedia sebagai video rekaman yang bisa ditonton kapan saja, plus sesi live (tanya jawab & review tugas) tiap minggu sesuai jadwal kelas.' },
    { q: 'Apakah ada sertifikat kelulusan?', a: 'Ya, sertifikat digital diterbitkan setelah kamu menyelesaikan minimal 80% materi dan proyek akhir. Sertifikat bisa diverifikasi via kode unik.' },
    { q: 'Bagaimana jika saya ketinggalan materi?', a: 'Semua sesi live direkam dan akses materi berlaku selamanya, tidak ada batas waktu. Kamu bisa belajar mengikuti ritmemu sendiri.' },
    { q: 'Apakah ada garansi?', a: 'Ada garansi 7 hari uang kembali tanpa pertanyaan jika kamu merasa kelasnya tidak cocok. Cukup hubungi tim kami via WhatsApp.' },
    { q: 'Bisa cicilan?', a: 'Bisa. Tersedia cicilan 0% sebanyak 3x via kartu kredit dan paylater tertentu, tanpa biaya tambahan.' },
];

const STATS = [
    { label: 'Alumni lulus', value: 12400, suffix: '+' },
    { label: 'Mentor praktisi', value: 60, suffix: '+' },
    { label: 'Rata-rata rating', value: 49, suffix: '/50', display: '4.9' },
    { label: 'Tingkat kelulusan', value: 94, suffix: '%' },
];

export default function KursusLanding() {
    const [menuBuka, setMenuBuka] = useState(false);
    const [tabAktif, setTabAktif] = useState<'coding' | 'desain' | 'inggris'>('coding');

    // Form checkout, pilih kelas, hitung total.
    const [nama, setNama] = useState('');
    const [kelasDipilih, setKelasDipilih] = useState('');
    const [checkoutOk, setCheckoutOk] = useState(false);

    const semuaKelas = [...KATALOG.coding, ...KATALOG.desain, ...KATALOG.inggris];
    const kelasAktif = semuaKelas.find((k) => k.nama === kelasDipilih);

    function kirimCheckout(e: FormEvent) {
        e.preventDefault();
        if (!nama.trim() || !kelasDipilih) return;
        setCheckoutOk(true);
    }

    const navLinks = [
        { href: '#beranda', label: 'Beranda' },
        { href: '#kelas', label: 'Katalog Kelas' },
        { href: '#cara', label: 'Cara Ikut' },
        { href: '#testimoni', label: 'Testimoni' },
        { href: '#faq', label: 'FAQ' },
    ];

    return (
        <div className="min-h-screen bg-violet-50/60 pb-24 text-stone-900 md:pb-0">
            {/* Navbar */}
            <header className="sticky top-0 z-40 border-b border-violet-900/10 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                    <a href="#beranda" className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
                            <Rocket className="h-5 w-5 text-white" />
                        </span>
                        <span className="text-lg font-extrabold tracking-tight sm:text-xl">
                            KELAS <span className="text-violet-700">PINTAR</span>
                        </span>
                    </a>
                    <nav className="ml-8 hidden items-center gap-1 lg:flex">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-violet-900/5 hover:text-stone-900">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <Button className="ml-auto hidden bg-violet-700 hover:bg-violet-800 sm:inline-flex" asChild>
                        <a href="#kelas">Mulai Belajar</a>
                    </Button>
                    <Button variant="ghost" size="icon" className="ml-auto sm:hidden" onClick={() => setMenuBuka((v) => !v)} aria-label="Menu">
                        {menuBuka ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
                {menuBuka && (
                    <nav className="border-t border-violet-900/10 px-4 py-2 lg:hidden">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} onClick={() => setMenuBuka(false)} className="block rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-violet-900/5">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            {/* Hero */}
            <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-purple-800 to-fuchsia-900 text-white">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(255,255,255,.12) 0, transparent 40%)' }} aria-hidden />
                <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
                    <div>
                        <Badge className="mb-4 bg-white/15 text-white hover:bg-white/20">Kursus Online • 12.400+ Alumni</Badge>
                        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Dari Nol, <span className="text-fuchsia-300">Sampai Punya Portofolio.</span>
                        </h1>
                        <p className="mt-4 max-w-md text-violet-100/90">
                            94% alumni lulus dengan 3 proyek portofolio, coding, desain, atau bahasa Inggris.
                            Live class tiap minggu, mentor praktisi, sertifikat terverifikasi.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <Button size="lg" className="bg-white text-violet-800 hover:bg-violet-50" asChild>
                                <a href="#kelas">Lihat Katalog Kelas</a>
                            </Button>
                            <a href="#cara" className="text-sm font-semibold text-fuchsia-200 underline-offset-4 hover:underline">
                                atau lihat alur belajarnya →
                            </a>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-6 text-sm text-violet-100/90">
                            <span className="flex items-center gap-1.5"><InfinityIcon className="h-4 w-4" /> Akses selamanya</span>
                            <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4" /> Sertifikat terverifikasi</span>
                            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-yellow-300 text-yellow-300" /> 4.9 (8.200+ ulasan)</span>
                        </div>
                    </div>
                    <div className="relative mx-auto hidden w-full max-w-md sm:block" aria-hidden>
                        <img src="/images/landing-kursus/hero.jpg" alt="" className="h-72 w-full rounded-3xl object-cover shadow-2xl lg:h-96" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-violet-950/40 to-transparent" />
                        <div className="absolute top-4 right-4 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-violet-800 shadow-lg">Live Class Tiap Minggu</div>
                        <div className="absolute bottom-4 left-4 rounded-2xl bg-fuchsia-950 px-4 py-2 text-xs font-semibold text-fuchsia-100 shadow-lg">Garansi 7 Hari</div>
                    </div>
                </div>
            </section>

            {/* Statistik */}
            <section className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {STATS.map((s) => (
                        <Card key={s.label} className="text-center">
                            <CardContent className="p-5">
                                {s.display ? (
                                    <p className="text-3xl font-extrabold text-violet-700">{s.display}</p>
                                ) : (
                                    <StatCounter value={s.value} suffix={s.suffix} className="text-3xl font-extrabold text-violet-700" />
                                )}
                                <p className="mt-1 text-sm text-stone-600">{s.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Katalog kelas */}
            <section id="kelas" className="mx-auto max-w-6xl px-4 py-10">
                <div className="text-center">
                    <Badge variant="outline" className="border-violet-700/30 text-violet-700">Katalog Kelas</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Pilih Kelas Sesuai Tujuanmu</h2>
                    <p className="mx-auto mt-2 max-w-lg text-stone-600">Sekali bayar, akses selamanya. Termasuk update materi dan komunitas alumni.</p>
                </div>
                <Tabs value={tabAktif} onValueChange={(v) => setTabAktif(v as typeof tabAktif)} className="mt-8">
                    <TabsList className="mx-auto flex w-full max-w-xl bg-violet-900/10">
                        {TAB_KELAS.map((t) => (
                            <TabsTrigger key={t.value} value={t.value} className="flex-1 data-[state=active]:bg-white">
                                {t.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {TAB_KELAS.map((t) => (
                        <TabsContent key={t.value} value={t.value}>
                            <div className="overflow-hidden rounded-2xl pt-4">
                                <img src={`/images/landing-kursus/kategori-${t.value}.jpg`} alt={`Suasana belajar kelas ${t.label}`} className="h-44 w-full object-cover sm:h-56" loading="lazy" />
                            </div>
                            <div className="grid gap-4 pt-4 md:grid-cols-3">
                                {KATALOG[t.value].map((k) => (
                                    <Card key={k.nama} className={cn('relative flex flex-col', k.terlaris && 'border-2 border-violet-600 shadow-lg')}>
                                        {k.terlaris && <Badge className="absolute -top-3 left-4 bg-violet-700 hover:bg-violet-700">Terlaris</Badge>}
                                        <CardContent className="flex flex-1 flex-col p-5">
                                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-700/10">
                                                <k.icon className="h-5 w-5 text-violet-700" />
                                            </span>
                                            <p className="mt-3 font-bold">{k.nama}</p>
                                            <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
                                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{k.durasi}</span>
                                                <span>•</span>
                                                <span>{k.level}</span>
                                            </div>
                                            <ul className="mt-3 flex-1 space-y-1.5 text-sm text-stone-600">
                                                {k.materi.map((m) => (
                                                    <li key={m} className="flex items-start gap-1.5">
                                                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-700" /> {m}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-4">
                                                {k.hargaCoret && (
                                                    <p className="text-sm text-stone-400 line-through">{rupiah(k.hargaCoret)}</p>
                                                )}
                                                <p className="text-2xl font-extrabold text-violet-700">{rupiah(k.harga)}</p>
                                            </div>
                                            <Button className="mt-4 w-full bg-violet-700 hover:bg-violet-800" onClick={() => { setKelasDipilih(k.nama); document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                                Ambil Kelas Ini
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </section>

            {/* Cara ikut */}
            {/* Alur belajar: 8 minggu sampai portofolio */}
            <section id="cara" className="bg-violet-950 py-14 text-white">
                <div className="mx-auto max-w-3xl px-4">
                    <h2 className="font-display text-3xl font-extrabold tracking-tight">8 Minggu Sampai Punya Portofolio</h2>
                    <p className="mt-2 text-sm text-violet-200">Contoh alur kelas Web Development, pola yang sama berlaku di semua track.</p>
                    <ol className="relative mt-8 space-y-6 border-l-2 border-fuchsia-700/40 pl-6">
                        {[
                            { t: 'Minggu 1–2', judul: 'Fondasi', teks: 'HTML, CSS, JavaScript dasar. Tugas kecil tiap minggu, direview mentor maksimal 24 jam.' },
                            { t: 'Minggu 3–5', judul: 'Proyek 1 & 2', teks: 'Bangun 2 proyek nyata, landing page dan aplikasi CRUD. Live class tiap Sabtu buat bedah kode bareng.' },
                            { t: 'Minggu 6–7', judul: 'Proyek 3 + karier', teks: 'Proyek final pilihanmu + sesi CV, portofolio GitHub, dan simulasi interview.' },
                            { t: 'Minggu 8', judul: 'Demo day & sertifikat', teks: 'Presentasikan proyekmu di depan mentor dan alumni. Lulus → sertifikat terverifikasi.' },
                        ].map((s) => (
                            <li key={s.t} className="relative">
                                <span className="absolute -left-[38px] flex h-6 items-center rounded-full bg-fuchsia-500 px-2.5 text-xs font-extrabold whitespace-nowrap text-fuchsia-950">
                                    {s.t}
                                </span>
                                <p className="font-bold">{s.judul}</p>
                                <p className="mt-1 text-sm text-violet-100/85">{s.teks}</p>
                            </li>
                        ))}
                    </ol>
                    <p className="mt-6 text-xs text-violet-200/70">Sibuk kerja? Semua materi bisa diakses selamanya, ikuti live class-nya saja tiap Sabtu, atau tonton rekamannya.</p>
                </div>
            </section>

            {/* Testimoni alumni anonim */}
            <section id="testimoni" className="mx-auto max-w-6xl px-4 py-14">
                <div className="text-center">
                    <Badge variant="outline" className="border-violet-700/30 text-violet-700">Kata Alumni</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Mereka Sudah Membuktikannya</h2>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {TESTIMONI.map((t) => (
                        <Card key={t.nama}>
                            <CardContent className="p-5">
                                <div className="flex gap-0.5" aria-label="Rating 5 dari 5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="mt-3 text-sm italic text-stone-700">“{t.kutip}”</p>
                                <p className="mt-3 text-sm font-bold">{t.nama}</p>
                                <p className="text-xs font-semibold text-violet-700">{t.peran}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Checkout */}
            <section id="checkout" className="mx-auto max-w-6xl px-4 pb-14">
                <div className="grid items-start gap-8 lg:grid-cols-2">
                    <div>
                        <Badge variant="outline" className="border-violet-700/30 text-violet-700">Checkout</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Amankan Kursimu Sekarang</h2>
                        <p className="mt-2 text-stone-600">
                            Isi data di bawah, tim kami akan menghubungimu via WhatsApp untuk pembayaran
                            dan aktivasi akun belajar. Garansi 7 hari uang kembali.
                        </p>
                        <ul className="mt-5 space-y-3 text-sm text-stone-700">
                            {['Akses materi selamanya + update gratis', 'Sertifikat digital terverifikasi', 'Komunitas alumni & info lowongan kerja'].map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" /> {x}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-violet-700" /> Form Pendaftaran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {checkoutOk && kelasAktif ? (
                                <div className="rounded-xl bg-green-50 p-6 text-center">
                                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                                    <p className="mt-3 text-lg font-bold text-green-800">Pendaftaran diterima!</p>
                                    <p className="mt-1 text-sm text-green-700">
                                        Terima kasih, <span className="font-semibold">{nama}</span>. Kamu mendaftar kelas
                                        <span className="font-semibold"> {kelasAktif.nama}</span> ({rupiah(kelasAktif.harga)}).
                                        Instruksi pembayaran dikirim via WhatsApp dalam 15 menit.
                                    </p>
                                    <Button variant="outline" className="mt-4" onClick={() => { setCheckoutOk(false); setNama(''); setKelasDipilih(''); }}>
                                        Daftar kelas lain
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={kirimCheckout} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="ck-nama">Nama lengkap</Label>
                                        <Input id="ck-nama" placeholder="cth: Dimas Prasetyo" value={nama} onChange={(e) => setNama(e.target.value)} required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="ck-kelas">Pilih kelas</Label>
                                        <Select value={kelasDipilih} onValueChange={setKelasDipilih} required>
                                            <SelectTrigger id="ck-kelas"><SelectValue placeholder="Pilih kelas yang diinginkan" /></SelectTrigger>
                                            <SelectContent>
                                                {semuaKelas.map((k) => (
                                                    <SelectItem key={k.nama} value={k.nama}>{k.nama}, {rupiah(k.harga)}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {kelasAktif && (
                                        <div className="rounded-xl bg-violet-50 p-4 text-sm">
                                            <div className="flex justify-between"><span className="text-stone-600">Kelas</span><span className="font-semibold">{kelasAktif.nama}</span></div>
                                            <div className="mt-1 flex justify-between"><span className="text-stone-600">Durasi</span><span>{kelasAktif.durasi}</span></div>
                                            <div className="mt-2 flex justify-between border-t border-violet-200 pt-2"><span className="font-semibold">Total</span><span className="text-lg font-extrabold text-violet-700">{rupiah(kelasAktif.harga)}</span></div>
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full bg-violet-700 hover:bg-violet-800">Daftar & Bayar</Button>
                                    <p className="text-center text-xs text-stone-500">Bisa cicilan 0% 3x • Garansi 7 hari uang kembali.</p>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mx-auto max-w-3xl px-4 pb-16">
                <div className="text-center">
                    <Badge variant="outline" className="border-violet-700/30 text-violet-700">FAQ</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Masih Ragu? Ini Jawabannya</h2>
                </div>
                <Accordion type="single" collapsible className="mt-8">
                    {FAQ.map((f, i) => (
                        <AccordionItem key={f.q} value={`item-${i}`}>
                            <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                            <AccordionContent className="text-stone-600">{f.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* Footer */}
            <footer className="bg-violet-950 text-violet-200/80">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600">
                                <Rocket className="h-4 w-4 text-white" />
                            </span>
                            <span className="text-lg font-extrabold text-white">KELAS <span className="text-fuchsia-400">PINTAR</span></span>
                        </div>
                        <p className="mt-3 text-sm">Platform kursus online praktis untuk upgrade skill dan karier sejak 2020.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Kategori Kelas</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Coding & Programming</li>
                            <li>Desain Kreatif</li>
                            <li>Bahasa Inggris</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Kontak</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>WA: 0812-7777-8888</li>
                            <li>halo@kelaspintar.id</li>
                            <li>Senin, Sabtu, 09.00, 17.00</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-violet-900 py-4 text-center text-xs">© 2026 Kelas Pintar. PT Kelas Pintar Indonesia.</div>
            </footer>

            <StickyMobileCta
                variant="whatsapp"
                title="Kelas Pintar"
                subtitle="Konsultasi kelas gratis"
                actionLabel="Tanya Kelas"
            />
        </div>
    );
}
