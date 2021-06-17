function defineReactive (obj, key, val) {
  observe(val)
  // 内部形成闭包
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get () {
      // 依赖收集
      Dep.target && dep.addDep(Dep.target)
      return val
    },
    set (newVal) {
      if (newVal !== val) {
        observe(newVal)
        val = newVal
      }
      dep.notify()
    }
  })
}
function observe (obj) {
  if (typeof obj !== 'object' || obj === null) {
    return
  }
  new Observer(obj)
}

// 根据传入的value类型做响应式处理
class Observer {
  constructor (obj) {
    this.obj = obj

    if (Array.isArray(obj)) {

    } else {
      this.walk(obj)
    }
  }
  // 对象响应式
  walk (obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}

// 代理
function proxy (vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get () {
        return vm.$data[key]
      },
      set (v) {
        vm.$data[key] = v
      }
    })
  })
}
// 1.处理插值表达式
// 2.处理指令和事件
// 3.以上两者初始化和更新
class Compile {
  constructor (el, vm) {
    this.$el = document.querySelector(el)
    this.$vm = vm
    if (this.$el) {
      this.compile(this.$el)
    }
  }
  compile (el) {
    const childNodes = el.childNodes
    childNodes.forEach(node => {
      if (node.nodeType === 1) { // 元素
        const attrs = node.attributes
        Array.from(attrs).forEach(attr => {
          const attrName = attr.name
          const exp = attr.value
          if (attrName.startsWith('x-')) {
            const dir = attrName.substring(2)
            this[dir] && this[dir](node, exp)
          }
        })

        console.log('元素', node.nodeName)
      } else if (this.isInter(node)) { // 文本
        this.compileText(node)
        console.log('插值', node.textContent)
      }
      // 递归
      if (node.childNodes) {
        this.compile(node)
      }
    })
  }
  // 是否是插值表达式
  isInter (node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  update (node, exp, dir) {
    // 初始化
    const fn = this[dir + 'Updater']
    fn && fn(node, this.$vm[exp])
    // 更新
    new Watcher(this.$vm, exp, function (val) {
      fn && fn(node, val)
    })
  }

  // 编译本文
  compileText (node) {
    this.update(node, RegExp.$1, 'text')
    // node.textContent = this.$vm[RegExp.$1]
  }
  text (node, exp) {
    this.update(node, exp, 'text')
    // node.textContent = this.$vm[exp]
  }
  textUpdater (node, value) {
    node.textContent = value
  }
  html (node, exp) {
    this.update(node, exp, 'html')
    // node.innerHTML = this.$vm[exp]
  }
  htmlUpdater (node, value) {
    node.innerHTML = value
  }
}

// 监听器 负责依赖更新
class Watcher {
  constructor (vm, key, updateFn) {
    this.vm = vm
    this.key = key
    this.updateFn = updateFn

    // 触发依赖收集
    Dep.target = this
    this.vm[key]
    Dep.target = null
  }
  update () {
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

// 依赖管理
class Dep {
  constructor () {
    this.deps = []
  }
  addDep (dep) {
    this.deps.push(dep)
  }
  notify () {
    this.deps.forEach(dep => dep.update())
  }
}

// 1.对data选项做响应式处理
// 2.模板编译
class Vue {
  constructor (options) {
    this.$options = options
    this.$data = options.data
    // 数据响应式
    observe(this.$data)
    proxy(this)
    // 编译
    new Compile(this.$options.el, this)
  }
}
