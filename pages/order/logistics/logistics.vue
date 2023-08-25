<template>
  <view class="page-body">
    <view class="logisticeNum"
      >物流单号: {{ logisticeNum }}
      <span
        key=""
        @click="handleClip"
        style="
          margin-left: 20rpx;
          border: 1rpx solid #fff;
          border-radius: 6rpx;
          padding: 2rpx;
        "
        >复制</span
      ></view
    >
    <view class="image-box" v-if="Traces.length == 0">
      <image class="image" src="/static/image/notBound.svg"></image>
      <span>暂无物流信息</span> 
    </view>
    <view v-for="(trace, index) in Traces" :key="index" class="trace-item">
      <view class="label">{{ trace.AcceptTime }}</view>
      <view class="value">{{ trace.AcceptStation }}</view>
    </view>
  </view>
</template>

<script>
import { getLogistics } from "../../../api/api.js";
export default {
  data() {
    return {
      logisticeNum: "",
      Traces: [],
    };
  },
  onLoad(option) { 
    this.logisticeNum = option.logisticsNum;
    this.getLogisticsFunc(option.logisticsNum); 
  },
  methods: {
    getLogisticsFunc(logisticsNum) {
      uni.showLoading();
      getLogistics(logisticsNum).then((res) => {
        console.log("res.data", res.data);
        this.Traces = res.data.Traces;
        uni.hideLoading();
      });
    },
    handleClip() {
      uni.setClipboardData({
        data: this.logisticeNum,
        success: function () {
          console.log("success");
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background-color: #f8f8f8;
  position: relative;
  overflow-x: scroll;
  .logisticeNum {
    width: 100%;
    height: 120rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: black;
    color: #fff;
    flex-shrink: 0;
  }
  .trace-item {
    padding: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .label {
      width: 30%;
      height: 100%;
      border-right: 1rpx solid #000;
      text-align: center;
    }
    .value {
      width: 70%;
      height: inherit;
      padding: 0 20rpx;
    }
  }
  .image-box{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .image {
    width: 300rpx;
    height: 200rpx;
  }
}
</style>
