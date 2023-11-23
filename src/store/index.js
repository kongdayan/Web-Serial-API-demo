// store.js
import { createStore } from "vuex";

const store = createStore({
  state: {
    // 定义您的状态
    lightData: [],
    tempData: [],
    humiData: [],
    weightData: [],
    timestamps: [],
  },
  mutations: {
    // 定义改变状态的 mutations
    ADD_DATA(state, payload) {
      state.lightData.push(payload.light);
      state.tempData.push(payload.dht.temp);
      state.humiData.push(payload.dht.humi);
      state.weightData.push(payload.weight.value);
      state.timestamps.push(new Date().toLocaleTimeString());
    },
    CLEAR_DATA(state) {
      state.lightData = [];
      state.tempData = [];
      state.humiData = [];
      state.weightData = [];
      state.timestamps = [];
    },
  },
  actions: {
    // 定义执行异步操作的 actions
    addData({ commit }, data) {
      commit("ADD_DATA", data);
    },
    clearData({ commit }) {
      commit("CLEAR_DATA");
    },
  },
  getters: {
    // 定义获取状态的 getters
  },
});

export default store;
