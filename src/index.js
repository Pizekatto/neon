import './styles/main.sass'
import smoothscroll from 'smoothscroll-polyfill'

smoothscroll.polyfill()

const xsResolution = 576
const mediaUpSM = "(min-width: 576px)"
let isSticky = false
const navbar = document.getElementById('navbar')
const logo = {
  element: document.getElementById('image-logo'),
  src: {
    black: './assets/images/logo-black.svg',
    white: './assets/images/logo-white.svg',
    noTextBlack: './assets/images/logo-no-text-black.svg',
    noTextWhite: './assets/images/logo-no-text-white.svg'
  }
}
const sections = [
  'home', 'features', 'about', 'facts', 'blog', 'contacts'
]
const sectionsElements = sections.map((section) => {
  return document.getElementById(section)
})
const sectionElementsWithID = {}
sectionsElements.forEach(elem => {
  Object.assign(sectionElementsWithID, { [elem.id]: elem })
})
const navbarLinks = navbar.querySelectorAll(`a[href^="#"]`)
const navbarLinksWithHash = new Map()
navbarLinks.forEach(link => {
  navbarLinksWithHash.set(link, new URL(link.href).hash.slice(1))
})

const changeLogo = (state) => {
  if (window.innerWidth < xsResolution) {
    logo.element.src = state ? logo.src.noTextBlack : logo.src.white
  } else {
    logo.element.src = state ? logo.src.black : logo.src.white
  }
}

const stickyObserver = () => {
  const observable = document.getElementById('observable')

  const options = {
    rootMargin: '-70px 0px 0px 0px',
  }

  const switchSticky = (state) => {
    isSticky = state
    navbar.classList.toggle('sticky', state)
    // false - удаляет , true - добавляет
    changeLogo(state)
  }

  const callback = (entries) => {
    entries.forEach(entry => {
      switchSticky(!entry.isIntersecting)
    })
  }

  const observer = new IntersectionObserver(callback, options)
  observer.observe(observable)
}

const sectionObserver = () => {

  const addActiveMenu = (sectionID) => {
    for (let item of navbarLinksWithHash) {
      if (item[1] === sectionID) {
        item[0].classList.add('active')
      } else if (item[0].classList.contains('active')) {
        item[0].classList.remove('active')
      }
    }
  }

  const options = {
    rootMargin: '-59% 0% -40% 0%'
  }

  const callback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        addActiveMenu(entry.target.id)
      }
    })
  }

  const observer = new IntersectionObserver(callback, options)
  sectionsElements.forEach(element => {
    observer.observe(element)
  })
}

const countersObserver = () => {
  const options = {
    rootMargin: '-100px 0% -5% 0%'
  }
  const callback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounters()
        observer.disconnect()
      }
    })
  }

  const observer = new IntersectionObserver(callback, options)
  const counters = document.getElementById('counters')
  observer.observe(counters)
}

const animationObserver = () => {
  const elements = document.querySelectorAll('.fx')
  const options = {rootMargin: '0% 0% -5% 0%'}

  const callback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target
        const delay = entry.target.getAttribute('data-delay')
        const duration = entry.target.getAttribute('data-duration')
        const fx = entry.target.getAttribute('data-fx')
        element.style.visibility = 'visible'
        if (delay) {element.style.animationDelay = delay}
        if (duration) {element.style.animationDuration = duration}
        if (fx) {element.classList.add(fx)}

        observer.unobserve(entry.target)
      }
    })
  }

  const observer = new IntersectionObserver(callback, options)
  elements.forEach(elem => observer.observe(elem))
}

const navbarSmoothScroll = () => {
  navbar.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault()
      const hash = navbarLinksWithHash.get(event.target)
      const destination = sectionElementsWithID[hash]
      destination.scrollIntoView( {behavior: 'smooth'} )
    }
  })
}

async function* counter(from, to, step, time) {
  const range = to - from
  const steps = range / step
  const delay = time / steps
  for (let value = from; value <= to; value += step) {
    await new Promise(r => setTimeout(r, delay))
    yield value
  }
}

async function startCount(options) {
  const { element, from, to, step, time, precision } = options
  for await (let value of counter(from, to, step, time)) {
    if (precision) {value = value.toFixed(precision)}
    element.textContent = value
  }
}

function startCounters() {
  startCount({
    element: document.getElementById('counter-downloads'),
    from: 0, to: 125, step: 1, time: 3000
  })
  startCount({
    element: document.getElementById('counter-users'),
    from: 0, to: 87, step: 1, time: 3000
  })
  startCount({
    element: document.getElementById('counter-rating'),
    from: 0, to: 4.8, step: 0.1, time: 3000, precision: 1
  })
}

stickyObserver()
sectionObserver()
countersObserver()
navbarSmoothScroll()
animationObserver()
const mediaQueryListSM = window.matchMedia(mediaUpSM)
mediaQueryListSM.addEventListener("change", () => {
  changeLogo(isSticky)
})