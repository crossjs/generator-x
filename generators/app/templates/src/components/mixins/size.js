export default {
  props: {
    size: {
      type: String,
      default: '',
      validator (value) {
        return /^(x?(large|small))?$/.test(value)
      }
    }
  }
}
