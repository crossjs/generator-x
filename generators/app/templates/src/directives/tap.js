/**
 * Simple directive for mocking tap event
 */
export default {
  name: 'tap',
  bind (el, { value, modifiers }) {
    const threshold = window.innerWidth / 10
    let start
    el.addEventListener('touchstart', e => {
      start = null
      if (e.touches && e.touches.length === 1) {
        start = e.touches[0]
      }
    })
    el.addEventListener('touchmove', e => {
      if (start) {
        if (Math.sqrt(Math.pow(e.touches[0].pageX - start.pageX, 2) + Math.pow(e.touches[0].pageY - start.pageY, 2)) > threshold) {
          start = null
        }
      }
    })
    el.addEventListener('touchend', e => {
      if (start) {
        // dispatch a tap event
        const tapEvent = document.createEvent('HTMLEvents')
        tapEvent.initEvent('tap', true, true)
        if (modifiers.delay) {
          // useful for hiding el after tap that has a link inside
          // see: c-navibar.vue
          setTimeout(() => {
            el.dispatchEvent(tapEvent)
          }, value || 300)
        } else {
          el.dispatchEvent(tapEvent)
        }
      }
      start = null
    })
  }
}
