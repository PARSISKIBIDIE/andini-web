// ==========================================
// 1. LOGIKA KUCING KURSOR (🐾)
// ==========================================
const cat = document.getElementById('cursorCat');
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (cat && !isTouchDevice) {
    let lastX = 0;

    document.addEventListener('mousemove', () => {
        cat.style.opacity = '1';
        cat.style.position = 'fixed'; 
        cat.style.pointerEvents = 'none'; 
        cat.style.transition = 'transform 0.1s ease-out'; 
        cat.style.zIndex = '9999'; 
    }, { once: true });

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        if (mouseX > lastX) {
            cat.style.transform = 'scaleX(1)'; 
        } else if (mouseX < lastX) {
            cat.style.transform = 'scaleX(-1)';
        }

        cat.style.left = (mouseX - 15) + 'px';
        cat.style.top = (mouseY - 15) + 'px';
        lastX = mouseX;
    });

    document.addEventListener('mousedown', () => { cat.style.scale = '0.8'; });
    document.addEventListener('mouseup', () => { cat.style.scale = '1'; });
}

// ... (Kodingan Kucing Kursor biarkan tetap di atas) ...

// ==========================================
// LOGIKA SWEETALERT (NOTIF SAPA AKU) - FIXED
// ==========================================
const sapaBtn = document.querySelector('.btn-magical');

if (sapaBtn) {
    sapaBtn.addEventListener('click', (e) => {
        e.preventDefault(); 

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Halo Cantik! 🌸',
                text: 'Terima kasih sudah berkunjung ke ruang kreatifku. Mari berteman baik!',
                iconHtml: '✨',
                confirmButtonText: 'Siap! 🥰',
                confirmButtonColor: '#e91e63',
                background: '#fffaf0',
                backdrop: `rgba(233, 30, 99, 0.2)`,
            }).then((result) => {
                if (result.isConfirmed) {
                    // MENCARI TARGET: #about
                    const aboutSection = document.getElementById('about');
                    
                    if (aboutSection) {
                        // MENGHITUNG JARAK: Dikurangi tinggi header (sekitar 80px-100px)
                        const headerOffset = 90; 
                        const elementPosition = aboutSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        // PROSES GULIR
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }
                }
            });
        }
    });
}

// ... (Sisa kodingan Galeri & Suara Pop di bawahnya) ...

// ==========================================
// 3. LOGIKA GALERI & SUARA POP (🖼️ + 🔊)
// ==========================================
const popSound = new Audio('https://www.soundjay.com/buttons/sounds/button-20.mp3'); 
popSound.volume = 0.5;

// Buat Lightbox hanya jika ada galeri di halaman tersebut
const cards = document.querySelectorAll('.cute-card');

if (cards.length > 0) {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightboxOverlay';
    lightbox.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(74, 48, 109, 0.85); display: none;
        justify-content: center; align-items: center; z-index: 10000;
        backdrop-filter: blur(10px); cursor: zoom-out;
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = `
        max-width: 85%; max-height: 80vh; border: 12px solid white;
        border-radius: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        transform: scale(0.5); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    lightbox.appendChild(lightboxImg);

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.querySelector('img').src;
            lightboxImg.src = imgSrc;
            lightbox.style.display = 'flex';
            
            popSound.currentTime = 0;
            popSound.play().catch(err => console.log("User interaction needed for audio"));

            setTimeout(() => {
                lightboxImg.style.transform = 'scale(1)';
            }, 10);
        });
    });

    lightbox.addEventListener('click', () => {
        lightboxImg.style.transform = 'scale(0.5)';
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
    });
}

// ==========================================
// LOGIKA KIRIM SURAT (KONTAK)
// ==========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const inputs = contactForm.querySelectorAll('input[type="text"], textarea');
        const nama = inputs[0].value.trim();
        const pesan = inputs[1].value.trim();
        
        // Validate inputs
        if (!nama || !pesan) {
            Swal.fire({
                title: 'Oops! 😅',
                text: 'Nama dan pesan harus diisi!',
                icon: 'warning',
                confirmButtonColor: '#e91e63',
                background: '#fffaf0'
            });
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim... 📤';

        // Send to backend
        fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nama, pesan })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    title: 'Surat Terkirim! 🕊️',
                    text: 'Terima kasih pesannya, Andini akan segera membacanya!',
                    icon: 'success',
                    confirmButtonColor: '#ff85a2',
                    background: '#fffaf0'
                });
                contactForm.reset();
            } else {
                throw new Error(data.error || 'Gagal mengirim pesan');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Oops! 😢',
                text: 'Gagal mengirim pesan. Coba lagi nanti!',
                icon: 'error',
                confirmButtonColor: '#e91e63',
                background: '#fffaf0'
            });
        })
        .finally(() => {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    });
}

// ==========================================
// EFEK PARTIKEL BINTANG (SPARKLES)
// ==========================================
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.85) { 
        const particle = document.createElement('div');
        particle.classList.add('particle');
        document.body.appendChild(particle);
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        setTimeout(() => { particle.remove(); }, 1000);
    }
});