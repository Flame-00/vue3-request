import { createApp, h } from 'vue'
import Message from 'vitepress-theme-demoblock/dist/client/components/Message.vue'

// newInstance
Message.newInstance = (props = {}) => {
  const container = document.createElement('div')

  const app = createApp({
    render() {
      return h(Message, {
        ...props,
        ref: 'messageRef'
      })
    }
  })

  const instance = app.mount(container)
  const messageRef = instance.$refs.messageRef
  document.body.appendChild(container.firstElementChild)

  return {
    add(messageProps) {
      // @ts-ignore
      messageRef.add(messageProps)
    },
    remove(name) {
      // @ts-ignore
      messageRef.remove(name)
    }
  }
}

// message
let messageInstance

function getMessageInstance() {
  messageInstance = messageInstance || Message.newInstance()
  return messageInstance
}

function message(content, { duration = 3, type = '' }) {
  const instance = getMessageInstance()

  instance.add({ content, duration, type })
}

export default {
  info(content, options) {
    return message(content, { ...options, type: 'info' })
  },
  warning(content, options) {
    return message(content, { ...options, type: 'warning' })
  },
  success(content, options) {
    return message(content, { ...options, type: 'success' })
  },
  error(content, options) {
    return message(content, { ...options, type: 'error' })
  }
}
