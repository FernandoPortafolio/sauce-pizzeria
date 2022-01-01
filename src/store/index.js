import { store } from "quasar/wrappers";
import { createStore } from "vuex";

// import example from './module-example'

export default store(function () {
  const Store = createStore({
    modules: {
      // example
    },
  });

  return Store;
});
