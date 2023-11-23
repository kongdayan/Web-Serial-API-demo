<template>
    <div ref="echartsContainer" style="width: 100%; height: 500px;"
        class="container  mx-auto my-10 p-6 border border-gray-200 rounded-lg shadow"></div>
</template>

<script>
import { mapState } from 'vuex';
import * as echarts from 'echarts';
export default {
    data () {
        return {
            chart: null
        };
    },
    computed: {
        ...mapState([
            'lightData',
            'tempData',
            'humiData',
            'weightData',
            'timestamps'
        ]),
        storeState () {
            return this.$store.state;
        },
        chartOption () {
            return {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['Light', 'Temperature', 'Humidity', 'Weight']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.timestamps
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: 'Light',
                        type: 'line',
                        data: this.lightData
                    },
                    {
                        name: 'Temperature',
                        type: 'line',
                        data: this.tempData
                    },
                    {
                        name: 'Humidity',
                        type: 'line',
                        data: this.humiData
                    },
                    {
                        name: 'Weight',
                        type: 'line',
                        data: this.weightData
                    }
                ]
            };
        }
    },
    mounted () {
        this.chart = echarts.init(this.$refs.echartsContainer);
        this.chart.setOption(this.chartOption);
    },
    watch: {
        // lightData: function () {
        //     this.updateChart();
        // },
        storeState: {
            handler: function () {
                this.updateChart();
            },
            deep: true,
            immediate: true // 立即触发一次更新
        }
        // 监听其他数据数组的变化...
    },
    methods: {
        updateChart () {
            if (this.chart) {
                this.chart.setOption(this.chartOption, true); // 使用现有图表实例更新配置
            }
        }
    },
    beforeDestroy () {
        if (this.chart) {
            this.chart.dispose(); // 在组件销毁前释放图表实例
        }
    }
}
</script>

<style scoped>
.chart {
    height: 400px;
}
</style>