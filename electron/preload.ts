import { ipcRenderer, contextBridge } from 'electron'

// # 预加载脚本工作在渲染进程，所以要使用ipcRenderer
// # 执行顺序为主进程，预加载脚本，渲染进程

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  // 单向通信：主进程向渲染进程发消息 send <--> on
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  // 单向通信：渲染进程向主进程发消息 send <--> on
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  // 双向通信：渲染进程调用主进程提供的回调，并接受主进程回调返回的结果 invoke <--> handle
  // @return Promise<>
  // invoke永远返回promise
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

// ?渲染进程和渲染进程之间通信：利用主进程中转，可参考官方例子
