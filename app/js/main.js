////////// Responsive
// Breackpoints
let breakpoints = {
  xl: 1200,
  lg: 992,
  md: 768,
  sm: 576,
  xsm: 375,
}

// Media quares
let MQ = {
  wWidth: 0,
  isXL: false,
  isLG: false,
  isMD: false,
  isSM: false,
  isXSM: false,
  updateState: function () {
    this.wWidth = $(window).width()

    for (let key in breakpoints) {
      this['is' + key.toUpperCase()] = this.wWidth <= breakpoints[key]
    }
  },
}

MQ.updateState()

$(window).on('resize', function () {
  MQ.updateState()
})

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
      console.log(currentIndex)

      if (currentIndex !== 0) {
        $('.agreement').hide(300)
        prevBtn.show(400)
      } else {
        prevBtn.hide(300)
        $('.agreement').show(600)
        console.log('else')
      }

      if (currentIndex === 2) {
        nextBtn.text(`${dataSubmitText} ${priceText} руб.`)
        console.log('ishledi')
      } else {
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
// User data carousel
function checker() {
  let steps = $('#form-steps')
  let prevBtn = steps.find('.js-prev-step')
  let nextBtn = steps.find('.js-next-step')
  steps.owlCarousel({
    loop: false,
    items: 1,
    margin: 20,
    nav: false,
    dots: false,
    autoHeight: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    onInitialized: function (event) {
      // go to next step
      nextBtn.click(function () {
        const currentStep = steps.find('.owl-item.active')
        const currStepIndex = $(this).closest('.owl-item').index()

        // check validate
        if (validateStep(currentStep)) {
          if (currStepIndex === 1) {
            getReport()
          } else if (currStepIndex === 2) {
            // If current step = 3, then submit payment form
            $('.form3').submit()
          } else {
            steps.trigger('next.owl.carousel')
          }
        } else {
          console.log('No validate')
        }
      })

      // go to prev step
      prevBtn.click(function () {
        steps.trigger('prev.owl.carousel')
      })

      docTypeControll(steps)
      resutlSmsControll()
    },
  })

  function validateStep(step) {
    let valid = {}
    let inputs = $(step).find('input, select')

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

  function docTypeControll() {
    const radio = $('input[name="doc_type"]')

    function checkForm() {
      const checkedRadio = $('input[name="doc_type"]:checked')
      let inputs = []

      for (let i = 0; i < inputs.length; i++) {
        $('input[name="' + inputs[i] + '"]').rules('remove')
      }

      if (checkedRadio.attr('id') === 'doc_type1') {
        inputs = ['passport_seria', 'pasport_date_of_issue']

        $('.form1__passport').show()
        $('.form1__inn').hide()

        $('input[name="passport_seria"]').rules('add', {
          required: true,
          minlength: 10,
          series: true,
        })
        $('input[name="pasport_date_of_issue"]').rules('add', { required: true })
      } else if (checkedRadio.attr('id') === 'doc_type2') {
        inputs = ['inn']

        $('.form1__inn').show()
        $('.form1__passport').hide()

        $('input[name="inn"]').rules('add', { required: true, minlength: 12, number: true })
      }
    }

    radio.on('change', function () {
      radio.parent().removeClass('radio-active')

      $(this).parent().addClass('radio-active')

      checkForm()
      setTimeout(() => {
        steps.trigger('refresh.owl.carousel')
      }, 100)
    })

    checkForm()
  }

  function resutlSmsControll() {
    const radio = $('input[name="result_sms"]')

    function checkForm() {
      const checkedRadio = $('input[name="result_sms"]:checked')

      if (checkedRadio.attr('id') === 'radio3') {
        $('.form2__item-phone').addClass('disabled')
        $('input[name="phone"]').rules('remove')
      } else if (checkedRadio.attr('id') === 'radio4') {
        $('.form2__item-phone').removeClass('disabled')
        $('input[name="phone"]').rules('add', { required: true, minlength: 10 })
      }
    }

    radio.on('change', function () {
      radio.parent().removeClass('radio-active')

      $(this).parent().addClass('radio-active')

      checkForm()
      setTimeout(() => {
        steps.trigger('refresh.owl.carousel')
      }, 100)
    })

    checkForm()
  }

  // Policy agree
  $('#agree').on('change', function () {
    if ($(this).prop('checked')) {
      $(this).closest('.step3').find('.step3__btn.js-next-step').prop('disabled', false)
    } else {
      $(this).closest('.step3').find('.step3__btn.js-next-step').prop('disabled', true)
    }
  })

  function getReport() {
    const forms = [$('.form1'), $('.form2')]
    let data = ''

    forms.forEach((form) => {
      data += form.serialize()
    })

    console.log(data)

    // $.get("url", data,
    // 	function (data, textStatus, jqXHR) {

    // 	},
    // 	"dataType"
    // );

    // if ajax result success
    // slide to next
    steps.trigger('next.owl.carousel')
  }
}
// banChecker()

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
datePickerSelector.datepicker({
  language: 'ru-RU',
  autoHide: true,
})
// .on('pick.datepicker', function (e) {
//   setTimeout(function () {
//     validator.element('input[name="birth_date"]')
//   }, 100)
// })

$('.input__icon-wrap').on('click', function (e) {
  e.stopPropagation()
  // datePickerSelector.datepicker('hide')
  $(this).siblings().focus()
})

// E-mail Ajax Send
// $('form').submit(function (e) {
//   e.preventDefault()

//   let form = $(this)
//   let formData = {}
//   formData.data = {}

//   // Serialize
//   form.find('input, textarea').each(function () {
//     let name = $(this).attr('name')
//     let title = $(this).attr('data-name')
//     let value = $(this).val()

//     formData.data[name] = {
//       title: title,
//       value: value,
//     }

//     if (name === 'subject') {
//       formData.subject = {
//         value: value,
//       }
//       delete formData.data.subject
//     }
//   })

//   $.ajax({
//     type: 'POST',
//     url: 'mail/mail.php',
//     dataType: 'json',
//     data: formData,
//   }).done(function (data) {
//     if (data.status === 'success') {
//       if (form.closest('.mfp-wrap').hasClass('mfp-ready')) {
//         form.find('.form-result').addClass('form-result--success')
//       } else {
//         mfpPopup('#success')
//       }

//       setTimeout(function () {
//         if (form.closest('.mfp-wrap').hasClass('mfp-ready')) {
//           form.find('.form-result').removeClass('form-result--success')
//         }
//         $.magnificPopup.close()
//         form.trigger('reset')
//       }, 3000)
//     } else {
//       alert('Ajax result: ' + data.status)
//     }
//   })
//   return false
// })

////////// Ready Functions
$(document).ready(function () {
  //
})

////////// Load functions
$(window).on('load', function () {
  //
})

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
