/**
 * JavaScript khusus untuk halaman pendaftaran
 * Mengelola form multi-step (4 Step), validasi berkas upload, dan konfirmasi pendaftaran.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Elements ----
    const form = document.getElementById('regForm');
    if (!form) return;

    // Steps
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    const successScreen = document.getElementById('successScreen');

    // Indicators
    const ind1 = document.getElementById('step-ind-1');
    const ind2 = document.getElementById('step-ind-2');
    const ind3 = document.getElementById('step-ind-3');
    const ind4 = document.getElementById('step-ind-4');
    const lines = document.querySelectorAll('.step-line');

    // Navigation Buttons
    const btnToStep2 = document.getElementById('toStep2');
    const btnToStep1 = document.getElementById('toStep1');
    const btnToStep3 = document.getElementById('toStep3');
    const btnToStep2From3 = document.getElementById('toStep2From3');
    const btnToStep4 = document.getElementById('toStep4');
    const btnBackToStep3 = document.getElementById('backToStep3');
    
    // ---- Navigation Functions ----
    function showStep(stepNum) {
        // Hide all steps
        step1.classList.remove('active');
        step2.classList.remove('active');
        step3.classList.remove('active');
        step4.classList.remove('active');
        
        // Reset indicators
        ind1.className = 'step';
        ind2.className = 'step';
        ind3.className = 'step';
        ind4.className = 'step';
        
        lines.forEach(l => l.classList.remove('done'));

        if (stepNum === 1) {
            step1.classList.add('active');
            ind1.classList.add('active');
            window.scrollTo({ top: 300, behavior: 'smooth' });
        } else if (stepNum === 2) {
            step2.classList.add('active');
            ind1.classList.add('done');
            ind2.classList.add('active');
            if (lines[0]) lines[0].classList.add('done');
            window.scrollTo({ top: 300, behavior: 'smooth' });
        } else if (stepNum === 3) {
            step3.classList.add('active');
            ind1.classList.add('done');
            ind2.classList.add('done');
            ind3.classList.add('active');
            if (lines[0]) lines[0].classList.add('done');
            if (lines[1]) lines[1].classList.add('done');
            window.scrollTo({ top: 300, behavior: 'smooth' });
        } else if (stepNum === 4) {
            step4.classList.add('active');
            ind1.classList.add('done');
            ind2.classList.add('done');
            ind3.classList.add('done');
            ind4.classList.add('active');
            if (lines[0]) lines[0].classList.add('done');
            if (lines[1]) lines[1].classList.add('done');
            if (lines[2]) lines[2].classList.add('done');
            generateSummary();
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    }

    // ---- File Upload Preview & Validation ----
    const fileInputs = ['fotoPas', 'fotoKtp', 'fotoIjazah', 'fotoRapor'];
    fileInputs.forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('change', () => {
            const nameSpan = document.getElementById(`name-${id}`);
            const errSpan = document.getElementById(`err-${id}`);
            
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const maxSize = 2 * 1024 * 1024; // 2MB

                if (file.size > maxSize) {
                    if (errSpan) errSpan.innerHTML = `<i class='bx bx-error-circle'></i> Ukuran file melebihi 2MB`;
                    if (nameSpan) nameSpan.innerText = 'File terlalu besar (>2MB)';
                    input.value = '';
                    return;
                }

                if (errSpan) errSpan.innerHTML = '';
                if (nameSpan) {
                    nameSpan.innerHTML = `<i class='bx bx-check-circle' style='color:#2e7d32'></i> ${file.name}`;
                }
            } else {
                if (nameSpan) nameSpan.innerText = 'Belum ada file dipilih';
            }
        });
    });

    // ---- Validation Functions ----
    function validateStep1() {
        let isValid = true;
        const fields = ['namaLengkap', 'nik', 'tempatLahir', 'tanggalLahir', 'jenisKelamin', 'alamat', 'noHp', 'emailPribadi', 'namaOrtu', 'hpOrtu'];
        
        fields.forEach(id => {
            const el = document.getElementById(id);
            const err = document.getElementById(`err-${id}`);
            if (!el || !el.value.trim()) {
                if (el) el.classList.add('error');
                if (err) err.innerHTML = `<i class='bx bx-error-circle'></i> Field ini harus diisi`;
                isValid = false;
            } else {
                if (el) el.classList.remove('error');
                if (err) err.innerHTML = '';
            }
        });

        // NIK specific validation
        const nik = document.getElementById('nik');
        if (nik && nik.value.trim() && !/^\d{16}$/.test(nik.value.trim())) {
            nik.classList.add('error');
            const errNik = document.getElementById('err-nik');
            if (errNik) errNik.innerHTML = `<i class='bx bx-error-circle'></i> NIK harus 16 digit angka`;
            isValid = false;
        }

        return isValid;
    }

    function validateStep2() {
        let isValid = true;
        const fields = ['asalSekolah', 'jurusanSekolah', 'tahunLulus', 'nilaiRata', 'prodiPilihan1', 'motivasi'];
        
        fields.forEach(id => {
            const el = document.getElementById(id);
            const err = document.getElementById(`err-${id}`);
            if (!el || !el.value.trim()) {
                if (el) el.classList.add('error');
                if (err) err.innerHTML = `<i class='bx bx-error-circle'></i> Field ini harus diisi`;
                isValid = false;
            } else {
                if (el) el.classList.remove('error');
                if (err) err.innerHTML = '';
            }
        });

        // Jalur masuk radio
        const jalur = document.querySelector('input[name="jalurMasuk"]:checked');
        const errJalur = document.getElementById('err-jalurMasuk');
        if (!jalur) {
            if (errJalur) errJalur.innerHTML = `<i class='bx bx-error-circle'></i> Pilih salah satu jalur masuk`;
            isValid = false;
        } else {
            if (errJalur) errJalur.innerHTML = '';
        }

        return isValid;
    }

    function validateStep3() {
        let isValid = true;
        const requiredDocs = ['fotoPas', 'fotoKtp', 'fotoIjazah'];

        requiredDocs.forEach(id => {
            const el = document.getElementById(id);
            const err = document.getElementById(`err-${id}`);
            if (!el || !el.files || el.files.length === 0) {
                if (err) err.innerHTML = `<i class='bx bx-error-circle'></i> Berkas wajib diunggah`;
                isValid = false;
            } else {
                if (err) err.innerHTML = '';
            }
        });

        return isValid;
    }

    // ---- Event Listeners ----
    if (btnToStep2) btnToStep2.addEventListener('click', () => { if (validateStep1()) showStep(2); });
    if (btnToStep1) btnToStep1.addEventListener('click', () => showStep(1));
    if (btnToStep3) btnToStep3.addEventListener('click', () => { if (validateStep2()) showStep(3); });
    if (btnToStep2From3) btnToStep2From3.addEventListener('click', () => showStep(2));
    if (btnToStep4) btnToStep4.addEventListener('click', () => { if (validateStep3()) showStep(4); });
    if (btnBackToStep3) btnBackToStep3.addEventListener('click', () => showStep(3));

    // Remove error on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const err = document.getElementById(`err-${input.id}`);
            if (err) err.innerHTML = '';
        });
    });

    // ---- Generate Summary for Step 4 ----
    function generateSummary() {
        const summaryCard = document.getElementById('summaryCard');
        if (!summaryCard) return;
        
        const getVal = (id) => {
            const el = document.getElementById(id);
            return el ? el.value : '-';
        };

        const getFileName = (id) => {
            const el = document.getElementById(id);
            if (el && el.files && el.files[0]) {
                return `<span class="summary-badge-file"><i class='bx bx-check-circle'></i> ${el.files[0].name}</span>`;
            }
            return '<span class="summary-badge-none">Belum diunggah</span>';
        };

        const getRadio = (name) => {
            const checked = document.querySelector(`input[name="${name}"]:checked`);
            return checked ? checked.value : '-';
        };

        const html = `
            <div class="summary-section">
                <h5><i class='bx bx-user'></i> Data Pribadi</h5>
                <dl class="summary-row">
                    <dt>Nama Lengkap</dt><dd>${getVal('namaLengkap')}</dd>
                    <dt>NIK</dt><dd>${getVal('nik')}</dd>
                    <dt>Tempat, Tgl Lahir</dt><dd>${getVal('tempatLahir')}, ${getVal('tanggalLahir')}</dd>
                    <dt>Jenis Kelamin</dt><dd>${getVal('jenisKelamin') === 'L' ? 'Laki-laki' : 'Perempuan'}</dd>
                    <dt>Alamat</dt><dd>${getVal('alamat')}</dd>
                    <dt>No. HP/WA</dt><dd>${getVal('noHp')}</dd>
                    <dt>Email</dt><dd>${getVal('emailPribadi')}</dd>
                </dl>
            </div>
            <div class="summary-section">
                <h5><i class='bx bx-book'></i> Data Akademik & Program Studi</h5>
                <dl class="summary-row">
                    <dt>Asal Sekolah</dt><dd>${getVal('asalSekolah')} (${getVal('jurusanSekolah')})</dd>
                    <dt>Tahun Lulus</dt><dd>${getVal('tahunLulus')}</dd>
                    <dt>Nilai Rata-rata</dt><dd>${getVal('nilaiRata')}</dd>
                    <dt>Pilihan Prodi 1</dt><dd><strong>${getVal('prodiPilihan1')}</strong></dd>
                    <dt>Pilihan Prodi 2</dt><dd>${getVal('prodiPilihan2') || '-'}</dd>
                    <dt>Jalur Masuk</dt><dd style="text-transform:capitalize">${getRadio('jalurMasuk')}</dd>
                </dl>
            </div>
            <div class="summary-section">
                <h5><i class='bx bx-file'></i> Berkas Dokumen Upload</h5>
                <dl class="summary-row">
                    <dt>Pas Foto 3x4</dt><dd>${getFileName('fotoPas')}</dd>
                    <dt>Scan KTP/KK</dt><dd>${getFileName('fotoKtp')}</dd>
                    <dt>Scan Ijazah/SKL</dt><dd>${getFileName('fotoIjazah')}</dd>
                    <dt>Sertifikat/Rapor</dt><dd>${getFileName('fotoRapor')}</dd>
                </dl>
            </div>
        `;
        
        summaryCard.innerHTML = html;
    }

    // ---- Form Submission ----
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const agree1 = document.getElementById('agreeTerms');
        const agree2 = document.getElementById('agreePrivacy');
        
        if (!agree1.checked) {
            const err1 = document.getElementById('err-agreeTerms');
            if (err1) err1.innerHTML = `<i class='bx bx-error-circle'></i> Anda harus menyetujui syarat & ketentuan`;
            isValid = false;
        }
        
        if (!agree2.checked) {
            const err2 = document.getElementById('err-agreePrivacy');
            if (err2) err2.innerHTML = `<i class='bx bx-error-circle'></i> Anda harus menyetujui kebijakan privasi`;
            isValid = false;
        }

        if (isValid) {
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Memproses & Mengunggah...`;
            submitBtn.disabled = true;
            
            setTimeout(() => {
                form.style.display = 'none';
                const stepInd = document.querySelector('.step-indicator');
                if (stepInd) stepInd.style.display = 'none';
                
                document.getElementById('successName').innerText = document.getElementById('namaLengkap').value;
                document.getElementById('regNumber').innerText = 'REG-STAIHA-' + Math.floor(100000 + Math.random() * 900000);
                
                const today = new Date();
                const d = today.getDate().toString().padStart(2, '0');
                const m = (today.getMonth() + 1).toString().padStart(2, '0');
                const y = today.getFullYear();
                document.getElementById('regDate').innerText = `${d}/${m}/${y}`;
                
                successScreen.style.display = 'block';
                window.scrollTo({ top: 150, behavior: 'smooth' });
            }, 1800);
        }
    });
});
