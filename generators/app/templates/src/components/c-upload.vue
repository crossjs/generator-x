<template>
  <div class="c-upload"
    v-tap
    @tap="onTap"
    @keydown="onKeyDown"
    @drop="onFileDrop"
    @dragover="onFileDrop">
    <c-icon class="c-upload-icon fs-64" v-if="!choosed">inbox</c-icon>
    <input
      type="file"
      ref="file"
      style="display: none"
      :accept="accept"
      :multiple="multiple"
      @change="onChange" />
      <slot></slot>
  </div>
</template>

<script>
import CIcon from 'components/c-icon'

let i = 0

function uid () {
  return `file-${Date.now()}-${++i}`
}

function getError (option, xhr) {
  const msg = `cannot post ${option.action} ${xhr.status}'`
  const err = new Error(msg)
  err.status = xhr.status
  err.method = 'post'
  err.url = option.action
  return err
}

function getBody (xhr) {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}

function upload (option) {
  if (typeof XMLHttpRequest === 'undefined') {
    return
  }

  const xhr = new XMLHttpRequest()
  if (xhr.upload) {
    xhr.upload.onprogress = e => {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100
      }
      option.onProgress(e)
    }
  }

  const formData = new FormData()
  formData.append(option.filename, option.file)
  if (option.data) {
    Object.keys(option.data).map(key => {
      formData.append(key, option.data[key])
    })
  }

  xhr.onerror = e => {
    option.onError(e)
  }

  xhr.onload = () => {
    if (xhr.status !== 200) {
      return option.onError(getError(option, xhr), getBody(xhr))
    }

    option.onSuccess(getBody(xhr))
  }

  xhr.open('post', option.action, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  xhr.send(formData)
}

export default {
  props: {
    accept: {
      default: '',
      type: String
    },
    multiple: {
      default: false,
      type: Boolean
    },
    action: {
      default: '',
      type: String
    },
    data: {
      default: () => ({})
    }
  },
  data () {
    return {
      choosed: false
    }
  },
  methods: {
    onChange (e) {
      const files = e.target.files
      this.uploadFiles(files)
    },
    onTap (e) {
      const fileInputEl = this.$refs.file
      if (!fileInputEl) {
        return
      }

      // TODO: trigger tap or touch but not click ?
      fileInputEl.click()
      fileInputEl.value = ''
    },
    onKeyDown (e) {
      if (e.key === 'Enter') {
        this.onTap()
      }
    },
    onFileDrop (e) {
      if (e.type === 'dragover') {
        return e.preventDefault()
      }
      const files = e.dataTransfer.files
      this.uploadFiles(files)
      e.preventDefault()
    },
    uploadFiles (files) {
      const len = files.length
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          const file = files.item(i)
          file.uid = uid()
          this.uploadFile(file)
          this.choosed = true
          this.$emit('change', { percent: 0 }, file)
        }
      }
    },
    uploadFile (file) {
      this.post(file)
    },
    post (file) {
      let data = this.data
      if (typeof data === 'function') {
        data = data()
      }
      if (!file.name && file.filename) {
        file.name = file.filename
      }
      const { name } = file
      if (!data.name) {
        data.name = name
      }
      if (this.action) {
        upload({
          action: this.action,
          filename: name,
          file,
          data,
          onProgress: e => {
            this.$emit('change', e, file)
          },
          onSuccess: ret => {
            this.$emit('change', ret, file)
          },
          onError: (err, ret = {}) => {
            if (typeof ret !== 'object') {
              ret = { message: ret }
            }
            if (err) {
              ret.error = err
            }
            this.$emit('change', ret, file)
          }
        })
      }
    }
  },
  components: {
    CIcon
  }
}
</script>

<style src="styles/components/upload"></style>
