export default {
  props: {
    value: {
      default: ''
    },
    field: {
      type: String,
      default: ''
    },
    validate: {
      type: Object,
      default: null
    }
  },

  methods: {
    onChange (e) {
      this.$emit('change', e.target.value)
    }
  },

  created () {
    if (this.validate && typeof this.$validate === 'function') {
      this.$watch('value', () => {
        // from plugins/validator
        this.$validate()
      })
    }
  }
}
