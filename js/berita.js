const newsData = [
    {
        id: 1,
        title: "Khataman & Wisuda Tahfidz Angkatan ke-5, 50 Santri Hafal 30 Juz",
        category: "Akademik",
        date: "2026-08-15",
        dateFormatted: "15 Agustus 2026",
        author: "Humas MHQ",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
        desc: "Ma'had Hamalatul Qur'an sukses menggelar upacara wisuda tahfidz angkatan ke-5 dengan meluluskan 50 santri yang telah menyelesaikan hafalan 30 juz..."
    },
    {
        id: 2,
        title: "Seminar Nasional Membumikan Al-Qur'an di Era Digital 2026",
        category: "Seminar",
        date: "2026-08-28",
        dateFormatted: "28 Agustus 2026",
        author: "Panitia Acara",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop",
        desc: "Mengundang pakar dan ulama untuk membahas strategi menjaga hafalan dan mengamalkan nilai-nilai Al-Qur'an di tengah tantangan teknologi modern."
    },
    {
        id: 3,
        title: "Penerimaan Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka",
        category: "Penerimaan",
        date: "2026-09-05",
        dateFormatted: "5 September 2026",
        author: "Panitia PSB",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=500&fit=crop",
        desc: "Segera daftarkan putra Anda untuk bergabung bersama kami di program tahfidz dan diniyah. Kuota terbatas hanya untuk 100 santri."
    },
    {
        id: 4,
        title: "Kajian Umum Bersama Syaikh dari Timur Tengah di Masjid Jami' MHQ",
        category: "Kajian",
        date: "2026-08-10",
        dateFormatted: "10 Agustus 2026",
        author: "Divisi Dakwah",
        image: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&h=500&fit=crop",
        desc: "Hadirilah kajian umum terbuka untuk kaum muslimin dengan tema 'Pentingnya Menjaga Hafalan Al-Qur'an'. Terbuka untuk ikhwan dan akhwat."
    },
    {
        id: 5,
        title: "Kunjungan Studi Banding Pesantren dari Malaysia",
        category: "Kunjungan",
        date: "2026-07-22",
        dateFormatted: "22 Juli 2026",
        author: "Humas MHQ",
        image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=500&fit=crop",
        desc: "Ma'had Hamalatul Qur'an menerima kunjungan dari delegasi pondok pesantren di Malaysia untuk bertukar metode pembelajaran tahfidz."
    },
    {
        id: 6,
        title: "Peresmian Asrama Santri Baru Kapasitas 200 Orang",
        category: "Fasilitas",
        date: "2026-06-15",
        dateFormatted: "15 Juni 2026",
        author: "Yayasan",
        image: "https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?w=800&h=500&fit=crop",
        desc: "Alhamdulillah, pembangunan asrama baru telah rampung dan siap digunakan untuk menyambut santri baru tahun ajaran 2026/2027."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('berita-grid');
    const sortSelect = document.getElementById('sort-select');
    const countText = document.getElementById('news-count');

    function renderNews(sortOrder = 'terbaru') {
        grid.innerHTML = '';
        
        let sorted = [...newsData];
        if (sortOrder === 'terbaru') {
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else {
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        countText.innerText = sorted.length;

        sorted.forEach(news => {
            const card = document.createElement('article');
            card.className = 'news-card';
            card.innerHTML = `
                <div class="news-img">
                    <img src="${news.image}" alt="${news.title}" loading="lazy">
                    <span class="news-cat">${news.category}</span>
                </div>
                <div class="news-body">
                    <div class="news-meta">
                        <span><i class='bx bx-calendar'></i> ${news.dateFormatted}</span>
                        <span><i class='bx bx-user'></i> ${news.author}</span>
                    </div>
                    <h3>${news.title}</h3>
                    <p>${news.desc}</p>
                    <a href="#" class="read-more">Baca Selengkapnya <i class='bx bx-right-arrow-alt'></i></a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Initial render
    renderNews('terbaru');

    // Handle sorting
    sortSelect.addEventListener('change', (e) => {
        renderNews(e.target.value);
    });
});
