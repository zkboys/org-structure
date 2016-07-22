export default {
  data() {
    return {
      message: 'waiting for data...',
    };
  },
  route: {
    data (transition) {
      setTimeout(function () {
        transition.next({
          message: 'data fetched!'
        })
      }, 1000);
    }
  },
  ready() {
    console.log("ready");
  },
  destroyed() {
  },
};
