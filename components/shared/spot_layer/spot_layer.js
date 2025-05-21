const spotLayer = {
  init: () => {
    const cookieName = 'tradingradarnet-ava-layer'
    const cookieDuration = 10
    const cookieLayerWait = 20000

    const cookieLayerElement = document.querySelector('#spot_layer')
    const avaBannerCookieSet = cookieLayerElement.querySelector('#ava_banner_cookie_set')

    function getCookie (cname) {
      const name = cname + '='
      const ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    };
    function setCookie (cname, cvalue, exdays) {
      const d = new Date()
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
      const expires = 'expires=' + d.toUTCString()
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
    }
    function startCountDownVisibility () {
      let counter = 25
      const $counter = document.querySelector('#counter')
      setInterval(() => {
        counter--
        $counter.innerText = counter
        if(counter<=0) {
          cookieLayerElement.classList.remove('visible')
        }
      }, 1000)
    }

    if (getCookie(cookieName) === '') {
      setTimeout(() => {
        cookieLayerElement.classList.add('visible')
        startCountDownVisibility()
      }, cookieLayerWait)

    }

    avaBannerCookieSet.addEventListener('click', () => {
      setCookie(cookieName, 'true', cookieDuration)
      cookieLayerElement.classList.remove('visible')
    })
  }
}

export default spotLayer
