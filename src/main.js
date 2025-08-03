import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    // initAOS(); // Удаляю или комментирую функцию initAOS и её вызов, чтобы не мешать работе оригинального AOS
    initRSVPForm();
    initSlider();
    initModals();
    initGiftIdeas();
    initCalendarDownload();
    // Логика для условных полей RSVP
    const partnerRadios = document.querySelectorAll('input[name="with_partner"]');
    const partnerInput = document.getElementById('partner_name');
    if (partnerRadios.length && partnerInput) {
        partnerRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'yes') {
                    partnerInput.style.display = 'block';
                } else {
                    partnerInput.style.display = 'none';
                    partnerInput.value = '';
                }
            });
        });
    }
    const kidsRadios = document.querySelectorAll('input[name="with_kids"]');
    const kidsInput = document.getElementById('kids_info');
    if (kidsRadios.length && kidsInput) {
        kidsRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'yes') {
                    kidsInput.style.display = 'block';
                } else {
                    kidsInput.style.display = 'none';
                    kidsInput.value = '';
                }
            });
        });
    }
    // Логика для чекбокса 'Не пью алкоголь'
    const alcoholNone = document.getElementById('non-alcoholic');
    const alcoholCheckboxes = document.querySelectorAll('input[name="drinking[]"]:not(#non-alcoholic)');
    if (alcoholNone && alcoholCheckboxes.length) {
        alcoholNone.addEventListener('change', function() {
            if (this.checked) {
                alcoholCheckboxes.forEach(cb => {
                    cb.checked = false;
                    cb.disabled = true;
                });
            } else {
                alcoholCheckboxes.forEach(cb => {
                    cb.disabled = false;
                });
            }
        });
        alcoholCheckboxes.forEach(cb => {
            cb.addEventListener('change', function(e) {
                if (alcoholNone.checked) {
                    // Не даём выбрать алкоголь, если выбран 'Не пью алкоголь'
                    e.preventDefault();
                    this.checked = false;
                    return false;
                }
                if (this.checked && alcoholNone.checked) {
                    alcoholNone.checked = false;
                    alcoholCheckboxes.forEach(box => box.disabled = false);
                }
            });
        });
    }
    // Обработка отправки новой формы rsvpForm
    const guestForm = document.getElementById('rsvpForm');
    const toast = document.getElementById('form-toast');
    if (guestForm) {
        guestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = guestForm.querySelector('button[type="submit"]');
            const originalBtn = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner"></span> Отправка...';
            submitBtn.disabled = true;
            setTimeout(() => {
                guestForm.reset();
                submitBtn.innerHTML = originalBtn;
                submitBtn.disabled = false;
                if (toast) {
                    toast.textContent = 'Спасибо! Ваш ответ успешно отправлен.';
                    toast.classList.add('toast--show');
                    setTimeout(() => {
                        toast.classList.remove('toast--show');
                    }, 4000);
                }
            }, 1800);
        });
    }
    // Музыка на главном экране
    const audio = document.getElementById('hero-audio');
    const musicBtn = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    let isPlaying = false;
    // Ставим иконку mute по умолчанию
    if (musicIcon) {
        musicIcon.classList.remove('fa-volume-up');
        musicIcon.classList.add('fa-volume-mute');
    }
    function playMusic() {
        if (audio) {
            audio.volume = 0.45;
            if (musicIcon) {
                musicIcon.classList.remove('fa-volume-mute');
                musicIcon.classList.add('fa-volume-up');
            }
            audio.play().then(() => {
                isPlaying = true;
            }).catch((e) => {
                isPlaying = false;
                if (musicIcon) {
                    musicIcon.classList.remove('fa-volume-up');
                    musicIcon.classList.add('fa-volume-mute');
                }
                console.log('Audio play error:', e);
            });
        }
    }
    function pauseMusic() {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            isPlaying = false;
            if (musicIcon) {
                musicIcon.classList.remove('fa-volume-up');
                musicIcon.classList.add('fa-volume-mute');
            }
        }
    }
    if (musicBtn) {
        musicBtn.addEventListener('click', function() {
            if (isPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }
        });
    }
    // Попытка автозапуска при первом взаимодействии пользователя
    function tryAutoPlayOnce() {
        if (audio && audio.paused) {
            playMusic();
        }
        if (isPlaying) {
            window.removeEventListener('click', tryAutoPlayOnce);
            window.removeEventListener('keydown', tryAutoPlayOnce);
            window.removeEventListener('touchstart', tryAutoPlayOnce);
            window.removeEventListener('pointerdown', tryAutoPlayOnce);
        }
    }
    window.addEventListener('click', tryAutoPlayOnce);
    window.addEventListener('keydown', tryAutoPlayOnce);
    window.addEventListener('touchstart', tryAutoPlayOnce);
    window.addEventListener('pointerdown', tryAutoPlayOnce);

    function syncMapHeights() {
        const mapInfo = document.querySelector('.map-info');
        const mapEmbed = document.querySelector('.map-embed');
        if (mapInfo && mapEmbed) {
            if (window.innerWidth > 900) {
                mapEmbed.style.height = mapInfo.offsetHeight + 'px';
            } else {
                mapEmbed.style.height = '';
            }
        }
    }
    syncMapHeights();
    window.addEventListener('resize', syncMapHeights);
});

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// AOS (Animate On Scroll) Implementation
// Удаляю или комментирую функцию initAOS и её вызов, чтобы не мешать работе оригинального AOS
// function initAOS() {
//     const observerOptions = {
//         threshold: 0.1,
//         rootMargin: '0px 0px -50px 0px'
//     };
    
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('aos-animate');
//             }
//         });
//     }, observerOptions);
    
//     const elements = document.querySelectorAll('[data-aos]');
//     elements.forEach(el => observer.observe(el));
// }

// RSVP Form Handling
function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    const successModal = document.getElementById('success-modal');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            // Validate required fields
            let firstInvalid = null;
            // Имя
            const nameInput = form.querySelector('#name');
            if (!data.name) {
                nameInput.style.borderColor = '#E57373';
                if (!firstInvalid) firstInvalid = nameInput;
            } else {
                nameInput.style.borderColor = '';
            }
            // Присутствие
            const attendingInputs = form.querySelectorAll('input[name="attending"]');
            const attendingChecked = Array.from(attendingInputs).some(i => i.checked);
            if (!attendingChecked) {
                attendingInputs.forEach(i => i.parentElement.style.color = '#E57373');
                if (!firstInvalid) firstInvalid = attendingInputs[0];
            } else {
                attendingInputs.forEach(i => i.parentElement.style.color = '');
            }
            // Второй день
            const secondDayInputs = form.querySelectorAll('input[name="second_day"]');
            const secondDayChecked = Array.from(secondDayInputs).some(i => i.checked);
            if (!secondDayChecked) {
                secondDayInputs.forEach(i => i.parentElement.style.color = '#E57373');
                if (!firstInvalid) firstInvalid = secondDayInputs[0];
            } else {
                secondDayInputs.forEach(i => i.parentElement.style.color = '');
            }
            if (!data.name || !attendingChecked || !secondDayChecked) {
                if (firstInvalid && firstInvalid.scrollIntoView) {
                    firstInvalid.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
                return;
            }
            // Simulate form submission
            const submitButton = form.querySelector('.submit-button');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="spinner"></span> Отправка...';
            submitButton.disabled = true;
            setTimeout(() => {
                if (successModal) {
                    successModal.style.display = 'block';
                }
                form.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

// Love Story Slider
let currentSlide = 0;
let slides = [];
let dots = [];
let sliderInterval = null;

function initSlider() {
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    showSlide(currentSlide);
    startSliderInterval();
    // Обработчики на стрелки всегда
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    if (prevBtn) prevBtn.addEventListener('click', function() { console.log('prev click'); changeSlide(-1, true); });
    if (nextBtn) nextBtn.addEventListener('click', function() { console.log('next click'); changeSlide(1, true); });
}

function startSliderInterval() {
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        changeSlide(1, false);
    }, 5000);
}

function resetSliderInterval() {
    startSliderInterval();
}

function showSlide(n) {
    if (n < 0) n = slides.length - 1;
    if (n >= slides.length) n = 0;
    currentSlide = n;
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    if (slides[n]) {
        slides[n].classList.add('active');
    }
    if (dots[n]) {
        dots[n].classList.add('active');
    }
    // updateSlideImageFit(); // удалено, чтобы не было ошибки
}

function changeSlide(direction, isManual) {
    showSlide(currentSlide + direction);
    if (isManual) resetSliderInterval();
}
window.changeSlide = changeSlide;

function currentSlideFunc(n) {
    showSlide(n - 1);
    resetSliderInterval();
}
// Обработка свайпов
const sliderContainer = document.querySelector('.slider-container'); // Или замени на правильный класс

if (sliderContainer) {
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    sliderContainer.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });

    function handleSwipeGesture() {
        const swipeThreshold = 50; // Минимальное расстояние для свайпа
        const distance = touchStartX - touchEndX;

        if (Math.abs(distance) > swipeThreshold) {
            if (distance > 0) {
                // Свайп влево — следующий слайд
                changeSlide(1, true);
            } else {
                // Свайп вправо — предыдущий слайд
                changeSlide(-1, true);
            }
        }
    }
}
window.currentSlide = currentSlideFunc;

// Modal Management
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    // Close modal when clicking on X
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });
}

// Gift Ideas
const giftIdeas = [
    "Подарочная карта в любимый ресторан",
    "Сертификат на фотосессию",
    "Подарочная карта в магазин посуды",
    "Сертификат на массаж для двоих",
    "Подарочная карта в книжный магазин",
    "Сертификат на мастер-класс по кулинарии",
    "Подарочная карта в магазин косметики",
    "Сертификат на спа-процедуры",
    "Подарочная карта в магазин одежды",
    "Сертификат на танцевальный мастер-класс"
];

function initGiftIdeas() {
    // QR Modal functionality
    window.showQR = function() {
        const qrModal = document.getElementById('qr-modal');
        if (qrModal) {
            qrModal.style.display = 'block';
        }
    };
    
    // Random gift idea
    window.showRandomGift = function() {
        const randomIdea = giftIdeas[Math.floor(Math.random() * giftIdeas.length)];
        
        // Create temporary modal for random gift
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="success-icon">
                    <i class="fas fa-gift"></i>
                </div>
                <h3>Идея для подарка</h3>
                <p>${randomIdea}</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    };
}

// Calendar Download
function initCalendarDownload() {
    window.downloadICS = function() {
        const event = {
            title: 'Свадьба Александры и Евгения',
            description: 'Приглашение на свадьбу Евгения и Александры',
            location: 'Ресторан "Времена года", ул. Парковая, 15, Москва',
            startTime: '2025-08-12T15:00:00',
            endTime: '2025-08-12T23:00:00'
        };
        
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//hacksw//handcal//NONSGML v1.0//EN',
            'BEGIN:VEVENT',
            `DTSTART:${event.startTime.replace(/[-:]/g, '')}`,
            `DTEND:${event.endTime.replace(/[-:]/g, '')}`
        ];
        
        const blob = new Blob(icsContent, { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invitation.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
}