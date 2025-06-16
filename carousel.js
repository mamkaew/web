function createCarousel(images, selector, options = {}) {
    const defaultOptions = {
        interval: 3000,
        controls: true,
        indicators: true
    };
    
    const config = { ...defaultOptions, ...options };
    
    const container = document.querySelector(selector);
    if (!container) {
        console.error(`Элемент с селектором "${selector}" не найден`);
        return;
    }
    
    container.innerHTML = `
        <div class="carousel-container">
            <div class="carousel-slides"></div>
            ${config.controls ? `
                <div class="carousel-controls">
                    <button class="carousel-btn prev">&lt;</button>
                    <button class="carousel-btn next">&gt;</button>
                </div>
            ` : ''}
            ${config.indicators ? `
                <div class="carousel-indicators"></div>
            ` : ''}
        </div>
    `;
    
    const slidesContainer = container.querySelector('.carousel-slides');
    const indicatorsContainer = container.querySelector('.carousel-indicators');
    
    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `<img src="${image}" alt="Slide ${index + 1}">`;
        slidesContainer.appendChild(slide);
        
        if (config.indicators) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            indicator.dataset.index = index;
            indicatorsContainer.appendChild(indicator);
        }
    });
    
    let currentIndex = 0;
    let intervalId = null;
    
    function goToSlide(index) {
        currentIndex = (index + images.length) % images.length;
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        if (config.indicators) {
            const indicators = container.querySelectorAll('.carousel-indicator');
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentIndex);
            });
        }
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    function startAutoSlide() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(nextSlide, config.interval);
    }
    
    function stopAutoSlide() {
        if (intervalId) clearInterval(intervalId);
    }
    
    if (config.controls) {
        const prevBtn = container.querySelector('.carousel-btn.prev');
        const nextBtn = container.querySelector('.carousel-btn.next');
        
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
        
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }
    
    if (config.indicators) {
        const indicators = container.querySelectorAll('.carousel-indicator');
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                stopAutoSlide();
                goToSlide(parseInt(indicator.dataset.index));
                startAutoSlide();
            });
        });
    }
    
    goToSlide(0);
    startAutoSlide();
    
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);
}