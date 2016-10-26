<template>
  <transition name="fade">
    <div class="c-modal"
      v-show="show">
      <transition name="slide-up">
        <div class="c-modal-content" v-show="show">
          <div class="c-modal-body"><slot></slot></div>
          <c-row class="c-modal-actions" v-if="_actions">
            <c-col class="c-modal-action" v-for="(action, key) in _actions">
              <c-link class="c-modal-link" :class="action.class"
                v-tap @tap.native="$emit(key)">{{action.label}}</c-link>
            </c-col>
          </c-row>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import CRow from './c-row'
import CCol from './c-col'
import CLink from './c-link'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    actions: {
      type: Object,
      default () {
        return {
          cancel: {
            label: 'Cancel',
            class: 'primary'
          },
          submit: {
            label: 'Submit',
            class: 'primary'
          }
        }
      }
    }
  },

  computed: {
    _actions () {
      if (!this.actions || Object.keys(this.actions).length === 0) {
        return null
      }
      return this.actions
    }
  },

  components: {
    CRow,
    CCol,
    CLink
  }
}
</script>

<style src="styles/components/modal"></style>
