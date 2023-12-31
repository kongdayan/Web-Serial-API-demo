<template>
  <div id="serial-port-tool"
    class="container mx-auto my-10 p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow dark:bg-gray-800">
    <div class="title mb-6">
      <h1 class="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
        SerialPort 工具
      </h1>
    </div>
    <div class="grid grid-cols-6 gap-4">
      <!-- A1 栏目 串口链接配置信息-->
      <div class="col-span-1 mt-4">
        <div class="connection-settings mb-4">
          <div class="mb-4 flex">
            <label for="port"
              class="flex-none block text-lg px-2 py-2 h-12 font-semibold text-gray-800 dark:text-gray-200 -medium">串口号:</label>
            <button id="port" @click="selectSerialPort"
              class="flex-auto block py-2 px-3 h-12 text-sm text-white font-bold border border-gray-300 bg-blue-500 dark:bg-lue-600 dark:hover:bg-blue-800 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              {{ portName }}
            </button>
          </div>
          <div class="mb-4 flex">
            <label for="baudRate"
              class="flex-none block text-lg px-2 py-2 h-12 font-semibold text-gray-800 dark:text-gray-200 -medium">波特率:</label>
            <select id="baudRate" v-model="baudRate"
              class="flex-auto text-center block py-2 px-3 h-12 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option v-for="optionBaudRate in baudRateOptionList" :key="optionBaudRate" :value="optionBaudRate">
                {{ optionBaudRate }}
              </option>
            </select>
          </div>
          <div class="mb-4 flex">
            <label for="dataBits"
              class="flex-none block text-lg px-2 py-2 h-12 font-semibold text-gray-800 dark:text-gray-200 -medium">数据位:</label>
            <select id="dataBits" v-model="dataBits"
              class="flex-auto text-center block py-2 px-3 h-12 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option v-for="optionDataBit in dataBitOptionList" :key="optionDataBit" :value="optionDataBit">
                {{ optionDataBit }}
              </option>
            </select>
          </div>
          <div class="mb-4 flex">
            <label for="stopBits"
              class="flex-none block text-lg px-2 py-2 h-12 font-semibold text-gray-800 dark:text-gray-200 -medium">停止位:</label>
            <select id="stopBits" v-model="stopBits"
              class="flex-auto text-center block py-2 px-3 h-12 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option v-for="optionStopBit in stopBitOptionList" :key="optionStopBit" :value="optionStopBit">
                {{ optionStopBit }}
              </option>
            </select>
          </div>
          <!-- 其他设置 -->
          <button id="connect" @click="connectSerialPort" :class="{
            'bg-red-600 hover:bg-red-700': serialStatus,
            'bg-indigo-600 hover:bg-indigo-700': !serialStatus,
          }"
            class="w-full border-transparent rounded-md shadow-sm flex-auto block py-2 px-3 h-12 text-sm text-white font-bold border border-gray-300 bg-blue-500 dark:bg-lue-600 dark:hover:bg-blue-800 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            {{ serialStatus ? "断开" : "连接" }}
          </button>
        </div>
      </div>
      <div class="col-span-5">
        <button @click="isCollapsed = !isCollapsed"
          class="py-2 px-4 mb-2 text-white bg-blue-500 rounded hover:bg-blue-600 overflow-hidden">
          {{ isCollapsed ? '展开' : '折叠' }}
        </button>
        <div v-if="!isCollapsed" class="grid grid-cols-5 gap-4 mb-4">
          <div v-for="(attribute, index) in attributes" :key="index"
            class="mt-4 p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-lg shadow flex flex-col">
            <label
              class="flex-none block text-lg px-2 py-2 h-12 font-semibold text-gray-800 dark:text-gray-200 -medium">{{
                attribute.name }}</label>
            <div v-if="!attribute.method.includes('set')"
              class="mb-2 h-8 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded py-2 px-3">
              {{ attribute.value }}
            </div>
            <input v-if="attribute.method.includes('set')" :type="attribute.setParams.inputType"
              class="mb-2 h-8 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded py-2 px-3"
              v-model="attribute.value" :min="attribute.setParams.minValue" :max="attribute.setParams.maxValue"
              :required="attribute.setParams.required" />
            <div class="flex flex-row justify-center space-x-2 mt-2">
              <button
                class="flex-auto block py-2 px-3 h-12 text-sm text-white font-bold border border-gray-300 bg-blue-500 dark:bg-lue-600 dark:hover:bg-blue-800 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                @click="sendCommand(attribute)">
                获取
              </button>
              <button v-if="attribute.method.includes('set')"
                class="flex-auto block py-2 px-3 h-12 text-sm text-white font-bold border border-gray-300 bg-blue-500 dark:bg-lue-600 dark:hover:bg-blue-800 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                @click="sendSetCommand(attribute)">
                写入
              </button>
            </div>
          </div>
          <div v-for="(action, index) in actions" :key="index"
            class="mt-4 p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-lg shadow flex flex-col">
            <label
              class="flex-none block text-lg px-2 py-2 h-12 font-semibold text-gray-800 dark:text-gray-200 -medium">{{
                action.name }}</label>
            <div class="flex flex-row justify-center space-x-2 mt-2">
              <button
                class="flex-auto block py-2 px-3 h-12 text-sm text-white font-bold border border-gray-300 bg-blue-500 dark:bg-lue-600 dark:hover:bg-blue-800 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                @click="sendCommand()">
                执行
              </button>
            </div>
          </div>
        </div>

      </div>
      <div class="col-span-6 data-receive mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
          接收到的数据
        </h2>
        <textarea id="receivedData" readonly
          class="mt-1 block w-full h-32 py-2 px-3 border border-gray-300 darl:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm">{{ receivedData }}</textarea>
      </div>
    </div>
  </div>
</template>

<script>
import attributes from "../assets/deviceAttributes.json";
import actions from "../assets/deviceActions.json";
export default {
  name: "SerialPort",
  data () {
    return {
      attributes: attributes.map((attr) => ({ ...attr, value: "" })),
      actions: actions.map((attr) => ({ ...attr, value: "" })),
      portName: "请选择串口",
      baudRate: 115200, //串口波特率初始值设为9600
      dataBits: 8, //串口数据位
      stopBits: 1,
      baudRateOptionList: [1200, 9600, 19200, 38400, 57600, 115200],
      dataBitOptionList: [7, 8],
      stopBitOptionList: [1, 2],
      port: "",
      reader: "",
      receivedData: "",
      serialStatus: false,
      reading: false,
      readableStreamClosed: "",
      isCollapsed: true,
    };
  },
  // Your component logic here
  methods: {
    addNewData (newData) {
      this.$store.dispatch("addData", newData);
    },
    clearData () {
      this.$store.dispatch("clearData");
    },
    async selectSerialPort () {
      try {
        this.port = await navigator.serial.requestPort();
        let portInfo = this.port.getInfo();
        this.portName =
          "PID=" + portInfo.usbProductId + "\tVID=" + portInfo.usbVendorId;
        // 处理选中的串口对象
      } catch (error) {
        // 处理错误
        console.error("Error requesting serial port:", error);
      }
    },
    async connectSerialPort () {
      if (!this.port) {
        console.log("没有选择端口");
        return;
      }
      // 如果端口已连接，则尝试断开端口
      if (this.serialStatus) {
        this.reading = false;
      } else {
        try {
          console.log("尝试连接端口");
          await this.port.open({
            baudRate: this.baudRate,
            databits: this.dataBits,
            stopBits: this.stopBits,
          });
          const textDecoder = new TextDecoderStream();
          this.readableStreamClosed = this.port.readable.pipeTo(
            textDecoder.writable
          );
          this.reader = textDecoder.readable.getReader();
          this.reading = true;
          this.serialStatus = true;
          this.readLoop();
        } catch (error) {
          this.reading = false;
          this.serialStatus = false;
          console.error("Error opening serial port:", error);
        }
      }
    },

    async readLoop () {
      let buffer = "";
      while (this.reading) {
        try {
          const { value, done } = await this.reader.read();
          if (done) {
            this.reader.releaseLock();
            break;
          }
          buffer += value;
          let lines = buffer.split("\n");
          buffer = lines.pop(); // Keep the incomplete line in the buffer
          lines.forEach((line) => {
            this.parsePayload(line);
          });
        } catch (error) {
          console.error("Error reading from serial port:", error);
        }
      }
      console.log("开始断开连接");
      await this.reader.cancel();
      await this.readableStreamClosed.catch(() => {
        /* Ignore the error */
      });
      // await this.reader.releaseLock();
      await this.port.close();
      this.serialStatus = false;
      this.reader = null;
    },

    async sendCommand (attribute) {
      if (!this.port) {
        console.log("没有选择端口");
        return;
      }
      if (!this.serialStatus) {
        console.log("没有连接端口");
        return;
      }
    },
    sendSetCommand (attribute) { },
    updateAttributeValue (attrName, newValue) {
      const attrIndex = this.attributes.findIndex(
        (attr) => attr.cmd === attrName
      );
      if (attrIndex !== -1) {
        this.attributes[attrIndex].value = newValue;
      }
    },
    updateActionValue (actionName, newValue) {
      const actionIndex = this.actions.findIndex(
        (act) => act.cmd === actionName
      );
      if (actionIndex !== -1) {
        this.actions[actionIndex].value = newValue;
      }
    },
    parsePayload (line) {
      console.log(line);
      if (line.startsWith("{")) {
        try {
          // 尝试将行解析为 JSON
          const json = JSON.parse(line);
          // 如果成功，将其添加到 receivedData
          console.log(json);
          this.receivedData += new Date().toLocaleTimeString() + " : " + line;
          this.addNewData(json);
          this.updateActionValue("cmd:humi.value", json.dht.humi);
          this.updateActionValue("cmd:temp.value", json.dht.temp);
        } catch (error) {
          // 如果不是有效的 JSON，忽略这一行
          console.error("Invalid JSON:", line);
        }
      } else if (line.startsWith("device/")) {
        const mac = line.substring(7);
        this.deviceMacAddress = mac;
        this.updateAttributeValue("attr.wifi.mac", mac); // 更新 WiFi-MAC地址
        this.updateAttributeValue("attr:sys.cpuid", mac);
      } else if (line.startsWith("Connecting to WiFi (")) {
        const regex = /ssid=(.+), pwd=(.+)\)/;
        const match = line.match(regex);
        if (match) {
          const ssid = match[1].trim();
          const pwd = match[2].trim();
          // 可以在这里处理提取到的 ssid 和 pwd
          console.log(`SSID: ${ssid}, Password: ${pwd}`);
          // 例如，将它们保存到 data 属性中
          this.updateAttributeValue("attr:wifi.config", ssid + "," + pwd);
        }
      } else if (line.startsWith("Connected to")) {
        const regex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
        const match = line.match(regex);
        if (match) {
          const ip = match[1].trim();
          this.updateAttributeValue("attr.wifi.ip", ip);
        }
      }
    },
  },
};
</script>

<style scoped>
/* Your component styles here */
</style>
