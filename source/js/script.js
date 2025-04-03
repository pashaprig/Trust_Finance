class App {
  init() {
    this.initMobileMenu();
    this.initRange();
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

  initRange() {
    let amount = 1000
    let month = 2
    const language = document.documentElement.getAttribute('lang');
    console.log(language);

    const update = () => {
      return '$ ' + Math.round(amount * (month * 1.85))
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    function getMonthWord(number) {
      const language = document.documentElement.getAttribute('lang');
      const lastDigit = number % 10;
      const lastTwoDigits = number % 100;

      if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return language === 'ru' ? 'месяцев' : 'months';
      }

      switch (lastDigit) {
        case 1:
          return language === 'ru' ? 'месяц' : 'month';
        case 2:
        case 3:
        case 4:
          return language === 'ru' ? 'месяца' : 'months';
        default:
          return language === 'ru' ? 'месяцев' : 'months';
      }
    }
    function get1MonthWord(lang) {
      return lang === 'ru' ? ' месяц' : ' month';
    }
    $(function () {
      $(".js-range-slider").ionRangeSlider({
        skin: "round",
        hide_min_max: false,
        hide_from_to: true,
        min: 250,
        max: 10000,
        from: amount,
        postfix: " $",
        grid: false,
        onStart: function (data) {
          $("#profitValue").text(update());
          $("#calcResult").text('$ ' + data.from.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
        },
        onChange: function (data) {
          amount = data.from
          $("#calcResult").text('$ ' + data.from.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
          $("#profitValue").text(update());
        }
      });
    });
    $(function () {
      $(".js-range-slider2").ionRangeSlider({
        skin: "round",
        hide_min_max: false,
        hide_from_to: true,
        min: 1,
        max: 12,
        from: month,
        postfix: get1MonthWord(language),
        grid: false,
        onStart: function () {
          $("#calcResult2").text(2 + ' ' + get1MonthWord(2));
          $("#profitValue").text(update());
          setTimeout(function () {
            const slider = document.querySelector(".js-irs-1");
            if (slider) {
              const max = slider.querySelector(".irs-max");
              if (max) {
                max.textContent = language === 'ru' ? "12 месяцев" : "12 months";
              }
            }
          }, 100);
        },
        onChange: function (data) {
          const monthWord = getMonthWord(data.from);
          month = data.from
          $("#calcResult2").text(data.from.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ' + monthWord);
          $("#profitValue").text(update());
        },
      });
    });
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
