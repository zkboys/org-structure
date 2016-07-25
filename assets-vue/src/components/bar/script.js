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
  methods: {
    testEvent(){
      // alert('emit testEvent in bar component');
      // this.$emit('testEvent'); // 不冒泡，当前组件内部
      this.$dispatch('testEvent'); // 沿着父链冒泡
    },
  },
  ready() {
    console.log("ready");
    this.$on('testEvent', ()=> {
      alert('trigger testEvent in bar component');
    });
  },
  destroyed() {
  },
};
