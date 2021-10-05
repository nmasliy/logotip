document.addEventListener('DOMContentLoaded', function() {
    const $html = document.querySelector('html');
    let scrollTop = window.pageYOffset;
    
    function hideScroll() {
        document.body.classList.add('block-scroll');
        // Блокировка скролла для Safari
        if (window.innerWidth <= 1024) {
            $html.style.scrollBehavior = 'auto';
            scrollTop = window.pageYOffset; // запоминаем текущую прокрутку сверху
            document.body.style.position = 'fixed';
            document.body.style.top = -scrollTop + 'px';
            $html.style.scrollBehavior = '';
        }
    }

    function showScroll() {
        document.body.classList.remove('block-scroll');

        // Блокировка скролла для Safari
        if (window.innerWidth <= 1024) {
            $html.style.scrollBehavior = 'auto';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            window.scroll(0, scrollTop);
            $html.style.scrollBehavior = '';
        }
    }

    function initMenu() {
        const $mobileMenu = document.querySelector('.mobile-menu');
        const $headerBtn = document.querySelector('.mobile-header__menu-btn');
        const $headerCloseBtn = document.querySelector('.mobile-header__close-btn');
        const $headerOverlay = document.querySelector('.header-overlay');
        const $navigationItems = document.querySelectorAll('.mobile-catalog ul>li>a');

        const transitionDelay = 300; 

        if ($mobileMenu) {
            const toggleMenu = () => {
                $mobileMenu.classList.toggle('active');
                $html.classList.toggle('overflow-hidden');
            }

            const closeMenu = () => {
                setTimeout(function() {
                    $mobileMenu.style.display = '';
                    $headerOverlay.style.display = '';
                }, transitionDelay)

                $mobileMenu.classList.remove('active');
                $html.classList.remove('overflow-hidden');
                $headerOverlay.classList.remove('active');
            }

            const openMenu = () => {
                $mobileMenu.style.display = 'block';
                $headerOverlay.style.display = 'block';

                setTimeout(function() {
                    $mobileMenu.classList.add('active');
                    $html.classList.add('overflow-hidden');
                    $headerOverlay.classList.add('active');
                }, 50)
                
            }
    
            $headerBtn.addEventListener('click', openMenu);
            $headerCloseBtn.addEventListener('click', closeMenu);
            $headerOverlay.addEventListener('click', closeMenu);
            // $navigationItems.forEach(item => item.addEventListener('click', closeMenu));
        }

    }

    function initModals() {
        const $mobileMenu = document.querySelector('.mobile-menu');
        const $modals = document.querySelectorAll('.modal');
        const $modalsTriggers = document.querySelectorAll('[data-micromodal-trigger]');
        const $modalOverlays = document.querySelectorAll('.modal__overlay');

        $modalOverlays.forEach(overlay => {
            overlay.addEventListener('click', function(e) {
                const modalId = overlay.closest('.modal').id;
                
                if (e.target.classList.contains('modal__container') || e.target.classList.contains('modal__overlay')) {
                    MicroModal.close(modalId);
                }
            })
        })
        
        $modalsTriggers.forEach(item => {
            item.addEventListener('click', (e) => e.preventDefault());
        })

        if ($modals.length > 0) {
            MicroModal.init({
                onShow: (modal) => {
                    hideScroll();
                    $header.style.pointerEvents = 'none';
                },
                onClose: (modal) => {
                    showScroll();
                    setTimeout(() => $header.style.pointerEvents = '', 500)
                },
                disableFocus: true,
                openClass: 'is-open', 
            });
        }
    }

    initMenu();
    initModals();
})