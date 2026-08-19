/**
 * JavaScript khusus untuk halaman pendaftaran
 * Mengelola form multi-step, validasi, dan konfirmasi.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Elements ----
    const form = document.getElementById('regForm');
    if (!form) return;

    // Steps
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const successScreen = document.getElementById('successScreen');

    // Indicators
    const ind1 = document.getElementById('step-ind-1');
    const ind2 = document.getElementById('step-ind-2');
    const ind3 = document.getElementById('step-ind-3');
    const lines = document.querySelectorAll('.step-line');

    // Buttons
    const btnToStep2 = document.getElementById('toStep2');
    const btnToStep1 = document.getElementById('toStep1');
    const btnToStep3 = document.getElementById('toStep3');
    const btnBackToStep2 = document.getElementById('backToStep2');
    
    // ---- Navigation Functions ----
    function showStep(stepNum) {
        // Hide all steps
        step1.classList.remove('active');
        step2.classList.remove('active');
        step3.classList.remove('active');
        
        // Update indicators
        ind1.className = 'step';
        ind2.className = 'step';
        ind3.className = 'step';
        
        lines.forEach(l => l.classList.remove('done'));

        if (stepNum === 1) {
            step1.classList.add('active');
            ind1.classList.add('active');
        } else if (stepNum === 2) {
            step2.classList.add('active');
            ind1.classList.add('done');
            ind2.classList.add('active');
            lines[0].classList.add('done');
            window.scrollTo({ top: 300, behavior: 'smooth' });
        } else if (stepNum === 3) {
            step3.classList.add('active');
            ind1.classList.add('done');
            ind2.classList.add('done');
            ind3.classList.add('active');
            lines[0].classList.add('done');
            lines[1].classList.add('done');
            generateSummary();
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    }

    // ---- Validation Functions ----
    function validateStep1() {
        let isValid = true;
        const fields = ['namaLengkap', 'nik', 'tempatLahir', 'tanggalLahir', 'jenisKelamin', 'alamat', 'noHp', 'emailPribadi', 'namaOrtu', 'hpOrtu'];
        
        fields.forEach(id => {
            const el = document.getElementById(id);
            const err = document.getElementById(`err-${id}`);
            if (!el.value.trim()) {
                el.classList.add('error');
                err.innerHTML = `<i class='bx bx-error-circle'></i> Field ini harus diisi`;
                isValid = false;
            } else {
                el.classList.remove('error');
                err.innerHTML = '';
            }
        });

        // NIK specific
        const nik = document.getElementById('nik');
        if (nik.value.trim() && !/^\d{16}$/.test(nik.value.trim())) {
            nik.classList.add('error');
            document.getElementById('err-nik').innerHTML = `<i class='bx bx-error-circle'></i> NIK harus 16 digit angka`;
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
            if (!el.value.trim()) {
                el.classList.add('error');
                err.innerHTML = `<i class='bx bx-error-circle'></i> Field ini harus diisi`;
                isValid = false;
            } else {
                el.classList.remove('error');
                err.innerHTML = '';
            }
        });

        // Jalur masuk radio
        const jalur = document.querySelector('input[name="jalurMasuk"]:checked');
        const errJalur = document.getElementById('err-jalurMasuk');
        if (!jalur) {
            errJalur.innerHTML = `<i class='bx bx-error-circle'></i> Pilih salah satu jalur masuk`;
            isValid = false;
        } else {
            errJalur.innerHTML = '';
        }

        return isValid;
    }

    // ---- Event Listeners ----
    btnToStep2.addEventListener('click', () => {
        if (validateStep1()) {
            showStep(2);
        }
    });

    btnToStep1.addEventListener('click', () => {
        showStep(1);
    });

    btnToStep3.addEventListener('click', () => {
        if (validateStep2()) {
            showStep(3);
        }
    });

    btnBackToStep2.addEventListener('click', () => {
        showStep(2);
    });

    // Remove error on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const err = document.getElementById(`err-${input.id}`);
            if (err) err.innerHTML = '';
        });
    });

    // Radio button error removal
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const err = document.getElementById(`err-${radio.name}`);
            if (err) err.innerHTML = '';
        });
    });

    // ---- Generate Summary for Step 3 ----
    function generateSummary() {
        const summaryCard = document.getElementById('summaryCard');
        
        // Get values
        const getVal = (id) => document.getElementById(id).value;
        const getRadio = (name) => {
            const checked = document.querySelector(`input[name="${name}"]:checked`);
            return checked ? checked.value : '-';
        };

        const html = `
            <div class="summary-section">
                <h5>Data Pribadi</h5>
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
                <h5>Data Akademik</h5>
                <dl class="summary-row">
                    <dt>Asal Sekolah</dt><dd>${getVal('asalSekolah')} (${getVal('jurusanSekolah')})</dd>
                    <dt>Tahun Lulus</dt><dd>${getVal('tahunLulus')}</dd>
                    <dt>Nilai Rata-rata</dt><dd>${getVal('nilaiRata')}</dd>
                    <dt>Pilihan 1</dt><dd>${getVal('prodiPilihan1')}</dd>
                    <dt>Pilihan 2</dt><dd>${getVal('prodiPilihan2') || '-'}</dd>
                    <dt>Jalur Masuk</dt><dd style="text-transform:capitalize">${getRadio('jalurMasuk')}</dd>
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
            document.getElementById('err-agreeTerms').innerHTML = `<i class='bx bx-error-circle'></i> Anda harus menyetujui syarat & ketentuan`;
            isValid = false;
        }
        
        if (!agree2.checked) {
            document.getElementById('err-agreePrivacy').innerHTML = `<i class='bx bx-error-circle'></i> Anda harus menyetujui kebijakan privasi`;
            isValid = false;
        }

        if (isValid) {
            // Simulate form submission
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Memproses...`;
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Hide form area
                form.style.display = 'none';
                document.querySelector('.step-indicator').style.display = 'none';
                
                // Set data on success screen
                document.getElementById('successName').innerText = document.getElementById('namaLengkap').value;
                document.getElementById('regNumber').innerText = 'REG-' + Math.floor(100000 + Math.random() * 900000);
                
                const today = new Date();
                const d = today.getDate().toString().padStart(2, '0');
                const m = (today.getMonth() + 1).toString().padStart(2, '0');
                const y = today.getFullYear();
                document.getElementById('regDate').innerText = `${d}/${m}/${y}`;
                
                // Show success screen
                successScreen.style.display = 'block';
                window.scrollTo({ top: 150, behavior: 'smooth' });
                
            }, 1500);
        }
    });
});
