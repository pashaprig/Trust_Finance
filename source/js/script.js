class App {
  init() {
    this.initMobileMenu();
    this.initSliderReview();
    this.showHide();
    this.modal();
    this.availableSlots();
    this.fetchCryptoPrices();
  }

  constructor() {}

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

  availableSlots() {
    function getRandomNumber() {
      return Math.floor(Math.random() * (96 - 13 + 1)) + 13;
    }

    const slots = getRandomNumber();
    const slotsStr = slots.toString();

    const firstDigit = slotsStr[0];
    const secondDigit = slotsStr[1];

    const firstDigitElements = document.querySelectorAll('[aria-label="firstDigit"]');
    const secondDigitElements = document.querySelectorAll('[aria-label="secondDigit"]');

    firstDigitElements.forEach(el => el.textContent = firstDigit);
    secondDigitElements.forEach(el => el.textContent = secondDigit);
  }

  async getCoinHistory(days = 7, currency = 'BTC') {

      const currencyMap = {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        BNB: 'binancecoin',
        USDT: 'tether'
      };

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${currencyMap[currency]}/market_chart?vs_currency=usd&days=${days}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(`Error fetching ${currency} history:`, error);
      return null;
    }
  }

  async fetchCryptoPrices() {
    const url =
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,tether&vs_currencies=usd&include_24hr_change=true';

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Ошибка при запросе: ' + response.status);

      const data = await response.json();

      const prices = {
        BTC: (Math.floor(data.bitcoin.usd * 100) / 100).toFixed(2),
        ETH: (Math.floor(data.ethereum.usd * 100) / 100).toFixed(2),
        BNB: (Math.floor(data.binancecoin.usd * 100) / 100).toFixed(2),
        USDT: (Math.floor(data.tether.usd * 100) / 100).toFixed(2),
      };

      const priceChanges = {
        BTC: (Math.floor(data.bitcoin.usd_24h_change * 100) / 100).toFixed(2),
        ETH: (Math.floor(data.ethereum.usd_24h_change * 100) / 100).toFixed(2),
        BNB: (Math.floor(data.binancecoin.usd_24h_change * 100) / 100).toFixed(2),
        USDT: (Math.floor(data.tether.usd_24h_change * 100) / 100).toFixed(2),
      };

      const currencies = ['BTC', 'ETH', 'BNB', 'USDT'];

      currencies.forEach(async (currency) => {
        const priceElement = document.querySelector(`[data-${currency.toLowerCase()}]`);
        if (priceElement) priceElement.textContent = `$${prices[currency]}`;

        const percentElement = document.querySelector(`[data-${currency.toLowerCase()}-percent]`);
        if (percentElement) percentElement.textContent = `${priceChanges[currency]}%`;

        const arrowElement = document.querySelector(`[data-${currency.toLowerCase()}-arrow]`);
        const percent = parseFloat(priceChanges[currency]);
        if (arrowElement && percent < 0) {
          arrowElement.classList.add('regress');
        }

        // Получаем историю для каждой валюты и строим графики
        const history = await this.getCoinHistory(2, currency);
        if (history) {
          // Пример предполагаемой структуры данных
          const pricesHistory = history.prices.map(item => item[1]); // Преобразуем данные в нужный формат для графика
          this.renderChart(`chart-${currency.toLowerCase()}`, pricesHistory);
        }
      });

      return prices;
    } catch (error) {
      console.error('Ошибка при получении курсов криптовалют:', error.message);
      return null;
    }
  }

  renderChart(elementId, data) {
    const element = document.querySelector(`#${elementId}`);

    if (!element) {
      console.error(`Элемент с ID ${elementId} не найден.`);
      return;
    }

    const options = {
      chart: {
        type: 'area',
        height: 53,
        width: 100,
        sparkline: {
          enabled: true
        }
      },
      series: [{
        name: 'Цена BTC',
        data: data
      }],
      fill: {
        opacity: 0.3
      },
      colors: ['#6bccbf'],
      tooltip: {
        enabled: false
      },
      xaxis: {
        labels: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      grid: {
        show: false
      }
    };

    const chart = new ApexCharts(element, options);
    chart.render();
  }
}

const app = new App();
document.addEventListener('DOMContentLoaded', app.init());
