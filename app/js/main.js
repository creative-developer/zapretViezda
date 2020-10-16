////////// Responsive
// Breackpoints
let breakpoints = {
  xl: 1200,
  lg: 992,
  md: 768,
  sm: 576,
  xsm: 375,
}

////////// Common functions

// Popup opener
$('.js-popup').click(function (event) {
  event.preventDefault()
  let popupID = $(this).attr('href')

  mfpPopup(popupID)
})

// Mobile menu toggle
$('.js-menu').click(function () {
  $(this).toggleClass('is-active')
  $('.menu').toggleClass('opened')
})

// Validate all form in site
let validator

jQuery.validator.setDefaults({
  rules: {
    region: {
      required: true,
    },
    fullName: {
      required: true,
      fullName: true,
    },
    birthDate: {
      required: true,
      birthDate: true,
    },
    passportSeries: {
      required: true,
      passportSeries: true,
    },
    email: {
      required: true,
      email: true,
    },
    agreement: {
      required: true,
    },
    phone: {
      required: true,
      phone: true,
    },
    pay_method: {
      required: true,
    },
  },
  messages: {
    agreement: 'Обязательное поле',
    name: '',
    surname: '',
    phone: '',
    email: '',
  },
  errorPlacement: function (error, element) {},
  submitHandler: function (form) {
    // Write here your function Handler

    // form.submit();
    console.log('Submit')
  },
})

$('form').each(function () {
  validator = $(this).validate()
})

$.validator.addMethod('fullName', function (value, element) {
  return (
    this.optional(element) ||
    /^[А-Яа-я][а-я]{2,}(?:\s+[А-Яа-я][а-я]{2,})?(?:\s+[А-Яа-я][а-я]{2,})(?:\s+)*\r?$/.test(value)
  )
})

$.validator.addMethod('birthDate', function (value, element) {
  return this.optional(element) || /^[0-9\.]{10}?$/.test(value)
})

$.validator.addMethod('passportSeries', function (value, element) {
  return this.optional(element) || /^[0-9\s]{11,12}?$/.test(value)
})

$.validator.addMethod('phone', function (value, element) {
  return (
    this.optional(element) || /^.. [(][0-9]{3}[)] [0-9]{3}[-][0-9]{2}[-][0-9]{2}\s?$/.test(value)
  )
})

const customSelectInit = () => {
  const arrow =
    '<svg class="icon icon--arrow-down"><use xlink:href="img/svg-sprite.svg#arrow-down"></use></svg>'

  $('select').styler({
    selectSearch: true,
    selectSearchLimit: 6,
    selectPlaceholder: 'Выберите регион',
    selectSmartPositioning: false,
    onSelectOpened: function () {
      $(this).find('.jq-selectbox__search input').focus()
    },
    onFormStyled: function () {
      $('.jq-selectbox__select .jq-selectbox__trigger').html(arrow)
    },
  })
}

const checkboxValidate = (element) => {
  const isChecked = element.prop('checked')
  if (!isChecked) {
    element.addClass('error')
  } else {
    element.removeClass('error')
    element.addClass('valid')
  }
}

const checkPhone = () => {
  const phoneField = $('input[name="phone"]')
  const feedbackCheckbox = $('.checkbox--btn input[type="checkbox"]')
  const isChecked = feedbackCheckbox.prop('checked')
  if (isChecked) {
    phoneField.prop('disabled', false)
    phoneField.rules('add', { required: true, phone: true })
  } else {
    phoneField.prop('disabled', true)
    phoneField.rules('remove')
    phoneField.removeClass('error')
    phoneField.removeClass('valid')
  }
}

const banChecker = () => {
  const steps = $('.panel__steps')
  const prevBtn = $('.panel').find('.js-back')
  const nextBtn = $('.panel').find('.js-next')
  const dataSubmitText = nextBtn.attr('data-submit-text')
  const agreement = $('.agreement').find('input')
  const currentStepNumber = $('.panel__step-number')
  const currentStepText = $('.panel__step-text')
  const stepsTitle = $('.panel__steps-title-list li')
  const priceText = $('.steps-result__price span').text()
  const headerInfoTitle = $('.panel__info-title')

  steps.owlCarousel({
    loop: false,
    items: 1,
    margin: 0,
    nav: false,
    dots: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    onInitialized: function (e) {
      const currentCarousel = $(e.target)
      checkPhone()
      customSelectInit()
      $('.checkbox--btn input[type="checkbox"]').change(checkPhone)

      nextBtn.click(function () {
        const currentStep = currentCarousel.find('.owl-item.active')
        const currentStepIndex = currentStep.index()
        const isChecked = agreement.prop('checked')

        // custom checkbox validation
        checkboxValidate(agreement)
        agreement.change(function () {
          checkboxValidate(agreement)
        })

        if (validateStep(currentStep) && isChecked) {
          steps.trigger('next.owl.carousel')
          if (currentStepIndex === 2) {
            $('.panel__form').submit()
          }
        }
      })

      prevBtn.click(function () {
        steps.trigger('prev.owl.carousel')
      })
    },
    onTranslate: function (e) {
      const currentIndex = e.item.index
      const currentText = $(stepsTitle[currentIndex]).text()
      currentStepNumber.text(currentIndex + 1)
      currentStepText.text(currentText)

      if (currentIndex !== 0) {
        $('.agreement').hide(300)
        prevBtn.show(400)
      } else {
        prevBtn.hide(300)
        $('.agreement').show(600)
      }

      if (currentIndex === 2) {
        nextBtn.text(`${dataSubmitText} ${priceText} руб.`)
        headerInfoTitle.hide(300)
      } else {
        headerInfoTitle.show(300)
        nextBtn.text('Далее')
      }
    },
  })
}

banChecker()

function validateStep(step) {
  let valid = {}
  let inputs = $(step).find('input:not(:disabled), select')
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i]
    valid[i] = validator.element(input)
  }
  for (let key in valid) {
    if (!valid[key]) {
      return false
    }
  }
  return true
}

// Phone input mask
function inputMask() {
  $('input[name="phone"]').inputmask('+7 (999) 999-99-99')
  $('input[name="birthDate"]').inputmask('99.99.9999')
  $('input[name="passportSeries"]').inputmask('99 99 999999')
}
inputMask()

// Multilangual datepicker
$.fn.datepicker.languages['ru-RU'] = {
  format: 'dd.mm.YYYY',
  days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  months: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  weekStart: 1,
  startView: 0,
  yearFirst: false,
  yearSuffix: '',
}

// Datepicker
const datePickerSelector = $('[data-toggle="datepicker"]')
datePickerSelector
  .datepicker({
    language: 'ru-RU',
    autoHide: true,
  })
  .on('pick.datepicker', function (e) {
    setTimeout(function () {
      validator.element('input[name="birthDate"]')
    }, 100)
  })

$('.input__icon-wrap').on('click', function (e) {
  e.stopPropagation()
  $(this).siblings().focus()
})

$('.js-scroll').click(function (e) {
  e.preventDefault()
  const attr = $(this).attr('href').replace('#', '')
  const el = $(`[data-id=${attr}]`)
  const headerHeight = 20

  if (el.length) {
    const position = el.offset().top - headerHeight
    $('body, html').animate({ scrollTop: position }, 700)

    return false
  }
})

const smartScrolling = () => {
  const headerHeight = 20
  const scrollTop = $(window).scrollTop()
  const nav = $('.faq-nav')
  const containerTopPosition = $('.faq__row').offset().top - headerHeight
  const containerHeight = $('.faq__wrap').outerHeight()
  const navHeight = nav.outerHeight()
  const stopPosition = containerHeight - navHeight

  if (scrollTop > containerTopPosition) {
    nav.addClass('scrolled')
  } else {
    nav.removeClass('scrolled')
  }

  if (scrollTop > stopPosition + containerTopPosition) {
    nav.css('top', stopPosition)
    nav.css('position', 'absolute')
  } else {
    nav.css('position', 'fixed')
    nav.removeAttr('style')
  }
}

if ($('.faq').length) {
  smartScrolling()
  $(window).scroll(smartScrolling)
}

/////////// mfp popup - https://dimsemenov.com/plugins/magnific-popup/
let mfpPopup = function (popupID, source) {
  $.magnificPopup.open({
    items: {
      src: popupID,
    },
    type: 'inline',
    fixedContentPos: false,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    closeMarkup: '<button type="button" class="mfp-close">&times;</button>',
    mainClass: 'mfp-fade-zoom',
    // callbacks: {
    // 	open: function() {
    // 		$('.source').val(source);
    // 	}
    // }
  })
}
