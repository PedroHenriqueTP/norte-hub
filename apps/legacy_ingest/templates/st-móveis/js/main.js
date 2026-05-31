document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initPortfolioFilter();
    initCarousel();
    initModal();
});

function initCarousel() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-item');
    if (!slides.length) return;

    window.moveSlide = function (n) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Auto play
    setInterval(() => {
        moveSlide(1);
    }, 5000);
}

function initModal() {
    const modal = document.getElementById('budget-modal');
    const triggers = document.querySelectorAll('a[href="#budget"]');
    const closeBtn = document.querySelector('.close-modal');

    if (!modal) return;

    triggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = "block";
            // Trigger reflow
            modal.offsetHeight;
            modal.classList.add('show');
        });
    });

    closeBtn.onclick = function () {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        }
    }
}


function initHeaderScroll() {
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            items.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}
