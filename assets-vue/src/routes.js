export default {
  '/': {
    component(resolve) { // 按需加载
      require(['./components/dashboard'], resolve);
    },
  },
  '/dashboard': {
    component(resolve) { // 按需加载
      require(['./components/dashboard'], resolve);
    },
  },
  '/bar': {
    component(resolve) { // 按需加载
      require(['./components/bar'], resolve);
    },
  },
  '/flot': {
    component(resolve) { // 按需加载
      require(['./components/flot'], resolve);
    },
  },
  '/foo': {
    component(resolve) { // 按需加载
      require(['./components/foo'], resolve);
    },
  },
  '/hello': {
    component(resolve) { // 按需加载
      require(['./components/hello/Hello'], resolve);
    },
  },
  '*': {
    component(resolve) { // 按需加载
      require(['./components/error404'], resolve);
    },
  },
};
