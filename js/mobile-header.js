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

        const transitionDelay = 400; 

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
                showScroll();
            }

            const openMenu = () => {
                $mobileMenu.style.display = 'block';
                $headerOverlay.style.display = 'block';

                setTimeout(function() {
                    $mobileMenu.classList.add('active');
                    $html.classList.add('overflow-hidden');
                    $headerOverlay.classList.add('active');
                    hideScroll();
                }, 50)
                
            }
    
            $headerBtn.addEventListener('click', openMenu);
            $headerCloseBtn.addEventListener('click', closeMenu);
            $headerOverlay.addEventListener('click', closeMenu);

            initCatalog();
            initContactsAccordion();
        }

        function initCatalog() {
            const $backButtons = document.querySelectorAll('.mobile-menu__catalog-back');
            const $openButtons = document.querySelectorAll('.mobile-menu__catalog-btn');
            const $catalogCloseButton = document.querySelector('.modal-catalog .modal__close');

            const openCatalog = (menu, button) => {
                
                menu.style.display = 'block';
                button.closest('.mobile-menu__catalog-menu').style.left = '-50px';

                setTimeout(function() {
                    menu.classList.add('open');
                    const $catalogs = document.querySelectorAll('.mobile-menu__catalog-menu.open');
                    $catalogs.length > 0 ? $mobileMenu.style.height = 'auto' : $mobileMenu.style.height = '';
                }, 50)

                setTimeout(function() {
                    button.closest('.mobile-menu__catalog-menu').style.left = '';
                }, transitionDelay / 2)

            }

            const closeCatalog = (menu, button) => {
                button.closest('.mobile-menu__catalog-menu').classList.remove('open');

                setTimeout(function() {
                    menu.style.display = '';
                }, transitionDelay)
                
            }

            const closeAllCatalogs = () => {
                const $catalogs = document.querySelectorAll('.mobile-menu__catalog-menu.open');

                if ($catalogs.length > 0) {
                    $catalogs.forEach(catalog => {
                        catalog.classList.remove('open');
                        catalog.style.display = '';
                    })
                    $mobileMenu.style.height = '';
                }
            
            }
    
            if ($openButtons.length > 0) {
                $openButtons.forEach(item => {
                    item.addEventListener('click', function(e) {
                        
                        if (item.nextElementSibling) {
                            e.preventDefault();
                            openCatalog(item.nextElementSibling, item);
                        }

                    })
                })

                $backButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const $catalogs = document.querySelectorAll('.mobile-menu__catalog-menu.open');

                        if ($catalogs.length > 1) {
                            $mobileMenu.style.height = 'auto';
                        }
                        else {
                            $mobileMenu.style.height = '';
                        }

                        closeCatalog(btn.closest('.mobile-menu__catalog-menu'), btn);
                    })
                })

                $headerOverlay.addEventListener('click', closeAllCatalogs);
                $catalogCloseButton.addEventListener('click', closeAllCatalogs);
            }

        }

        function initContactsAccordion() {
            const $contactsItems = document.querySelectorAll('.modal-contacts__item');

            $contactsItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    if (!e.target.closest('.modal-contacts__hidden')) {
                        item.classList.toggle('active');
                    }
                })
            })
        }
    }

    function initModals() {
        const $mobileMenu = document.querySelector('.mobile-menu');
        const $headerOverlay = document.querySelector('.header-overlay');
        const $mobileHeader = document.querySelector('.mobile-header'); 
        const $modals = document.querySelectorAll('.modal');
        const $modalsTriggers = document.querySelectorAll('[data-micromodal-trigger]');
        const $modalOverlays = document.querySelectorAll('.modal__overlay');

        $modalOverlays.forEach(overlay => {
            overlay.addEventListener('click', function(e) {
                if (!e.target.closest('.modal__inner') && !(e.target.closest('.modal-cart__item-delete'))) {
                    overlay.closest('.modal').classList.remove('is-open');
                    showScroll();
                    setTimeout(() => {
                        $mobileHeader.style.pointerEvents = '';
                        $mobileMenu.style.pointerEvents = '';
                        $headerOverlay.style.pointerEvents = '';
                    }, 500)
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
                    $mobileHeader.style.pointerEvents = 'none';
                    $mobileMenu.style.pointerEvents = 'none';
                    $headerOverlay.style.pointerEvents = 'none';
                },
                onClose: (modal) => {
                    showScroll();
                    setTimeout(() => {
                        $mobileHeader.style.pointerEvents = '';
                        $mobileMenu.style.pointerEvents = '';
                        $headerOverlay.style.pointerEvents = '';
                    }, 500)
                },
                disableFocus: true,
                openClass: 'is-open', 
                awaitOpenAnimation: true,
                awaitCloseAnimation: true,
            });
        }
    }

    function initHeroSlider() {
        const $heroSlider = document.querySelector('.hero-slider__inner');
        if ($heroSlider) {
            const reviewsSlider = new Swiper('.hero-slider__inner', {
                pagination: {
                    el: ".hero-slider__pagination",
                },
                loop: true,
                spaceBetween: 50
            });
        }
    }

    function initSendCartData() {
        const $plusBtn = document.querySelector('.modal-cart__plus');
        const $minusBtn = document.querySelector('.modal-cart__minus');

        const $buttons = [$plusBtn, $minusBtn];
        const $count = document.querySelector('.modal-cart__count');

        const url = document.querySelector('.modal-cart__counter').dataset.url;

        $buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                postData(url, { quantity: $count.textContent })
                    .then((data) => {
                        console.log(data); 
                    })
                    .catch(err => console.log(err));
            })
        })
    }

    function initGetDataContactsAndCart() {
        const $cartBtns = document.querySelectorAll('.mobile-header__cart-btn');
        const $cartRoot = document.querySelector('.modal-cart__wrapper');
        
        const $contactsBtns = document.querySelectorAll('.mobile-header__contacts-btn');
        const $contactsRoot = document.querySelector('.modal-contacts__items');


        $contactsBtns.forEach(button => {
            const url = button.dataset.url;

            button.addEventListener('click', function() {
                fetch(url) 
                    .then(response => response.text())
                    .then(html => $contactsRoot.innerHTML = html)
                    .catch(err => console.error(err));
            })
        })

        $cartBtns.forEach(button => {
            const url = button.dataset.url;
            
            button.addEventListener('click', function() {
                fetch(url) 
                    .then(response => response.text())
                    .then(html => $cartRoot.innerHTML = html)
                    .catch(err => console.error(err));
            })
        })

    }

    function initDeleteCartItem() {
        const $deleteButtons = document.querySelectorAll('.modal-cart__item-delete');

        $deleteButtons.forEach(btn => {
            const url = btn.dataset.url;

            btn.addEventListener('click', function() {
                const item = btn.closest('.modal-cart__item');
                item.parentNode.removeChild(item);
                fetch(url) 
                    .then(response => response.json())
                    .then(response => {
                        if (response.success === true) {
                            const item = btn.closest('.modal-cart__item');
                            item.parentNode.removeChild(item);
                        }
                    })
                    .catch(err => console.error(err));
            })
        })
    }
    


    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return await response.json(); // parses JSON response into native JavaScript objects
    }

    initMenu();
    initModals();
    initHeroSlider();
    initSendCartData();
    initGetDataContactsAndCart();
    initDeleteCartItem();
})