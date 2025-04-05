class App {
  init() {
    this.initMobileMenu();
    this.initSliderReview();
    this.showHide()
    this.modal()
  }

  constructor() { }

  initMobileMenu() {
    const navMain = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.main-nav__toggle');
    const navButtonText = document.querySelector('.main-nav__open-btn-text');

    const initJS = () => {
      navMain.classList.remove('main-nav--nojs');
    }

    const closeOpen = () => {
      navToggle.addEventListener('click', function () {
        if (navMain.classList.contains('main-nav--closed')) {
          navMain.classList.remove('main-nav--closed');
          navMain.classList.add('main-nav--opened');
          navButtonText.classList.add('visually-hidden');
        } else {
          navMain.classList.add('main-nav--closed');
          navMain.classList.remove('main-nav--opened');
        }
      });
    }

    const linksClick = () => {
      const mainNav = document.querySelector('.main-nav');
      const links = mainNav.querySelectorAll('a');

      const navLinckHandleClick = () => {
        navMain.classList.add('main-nav--closed');
        navMain.classList.remove('main-nav--opened');
      }

      links.forEach(link => {
        link.addEventListener('click', navLinckHandleClick)
      })
    }

    initJS();
    closeOpen();
    linksClick();
  }


  initSliderReview() {
    $(function () {
      const $slider = $('#slider-review');

      $slider.slick({
        arrows: true,
        slidesToShow: 4,
        variableWidth: true,
        centerMode: false,
        dots: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              variableWidth: true,
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              variableWidth: true,
            }
          },
        ]
      });

      $slider.on('wheel', function (event) {
        if (event.originalEvent.shiftKey || Math.abs(event.originalEvent.deltaX) > 0) {
          event.preventDefault();
          const $slickList = $(this).find('.slick-list');
          $slickList.scrollLeft($slickList.scrollLeft() + event.originalEvent.deltaY + event.originalEvent.deltaX);
        }
      });
    });
  }

  showHide() {
    document.querySelectorAll('.faq__container').forEach(container => {
      const button = container.querySelector('.faq__toggle-btn');
      const content = container.querySelector('.faq__dropdown-content');

      button.addEventListener('click', function () {
        content.classList.toggle('show');
        button.classList.toggle('show');
      });
    });
  }

  modal() {
    const buttons = document.querySelectorAll('[aria-label="openModal"]');
    const modal = document.querySelector('.modal');
    const closeBtn = modal.querySelector('.modal__close-btn');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        modal.classList.add('active');
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modal.classList.remove('active');
      }
    });
  }
}

const app = new App();
document.addEventListener('DOMContentLoaded', app.init());
