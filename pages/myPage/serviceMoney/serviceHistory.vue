<template>
  <view class="page-body">
    <view class="top-view">
      <view class="picker-view" @click="openPopup">
        {{ year }}年
        <span style="font-size: 48rpx; font-weight: bold; margin: 0 8rpx"
          >{{ month }}
        </span>
        月
      </view>
    </view>

    <mescroll-uni
      class="scroll-view"
      ref="mescrollRef"
      @init="mescrollInit"
      @down="downCallback"
      :down="{ auto: false }"
      @up="upCallback"
      :up="{ textNoMore: '', page: { size: size } }"
      :fixed="false"
      :safearea="true"
    >
      <view class="item" v-for="(item, index) in list" :key="index">
        <view class="info">
          <span style="max-width: 80%; word-break: break-all">{{
            item.productName + "  " + item.size
          }}</span>
          <span :style="{ color: item.moneyType == '0' ? 'green' : 'red' }"
            >{{ item.moneyType == "0" ? "+" : "-" }}¥{{ item.money }}</span
          >
        </view>
        <view class="info" style="color: grey">
          <span>{{ item.createTime }}</span>
          <span>{{ item.moneyType == "0" ? "充值" : "消费" }}</span>
        </view>
      </view>
    </mescroll-uni>


 <wyb-popup ref="popup" type="bottom" radius="6" >
      <view class="popup-body">
        <picker-view
          :indicator-style="indicatorStyle"
          v-model="value"
          @change="bindChange"
          class="picker"
        >
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in years"
              :key="index"
              >{{ item }}年</view
            >
          </picker-view-column>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in months"
              :key="index"
              >{{ item }}月</view
            >
          </picker-view-column>
        </picker-view>
        <view class="bottom-view">
          <button class="button" @click="onDateCancel">取消</button>
          <button class="button button-green" @click="onDateOk">确定</button>
        </view>
      </view>
    </wyb-popup>


    
  </view>
</template>

<script>
import { getServiceMonerysLogList } from "../.././../api/api.js";

export default {
  data() {
    const date = new Date();
    const years = [];
    const year = date.getFullYear();
    const months = [];
    const month = date.getMonth() + 1;
    for (let i = 1990; i <= date.getFullYear(); i++) {
      years.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }
    return {
      size: 10,
      list: [],
      year,
      month,
      years,
      months,
      value: [9999, 6, 1],
      indicatorStyle: `height: 50px;`,
      searchDateIndex: [],
    };
  },
  onLoad() {
    this.mescroll.resetUpScroll();
    // this.getServiceMonerysLogListFunc();
  },
  methods: {
    openPopup() {
      this.$refs.popup.show();
    },

    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    downCallback() {
      this.mescroll.resetUpScroll();
    },

    onDateCancel() {
      this.searchDateIndex = [];
      this.$refs.popup.hide();
    },
    onDateOk() {
      if (this.searchDateIndex.length == 0) return;
      this.year = this.years[this.searchDateIndex[0]];
      this.month = this.months[this.searchDateIndex[1]];
      this.searchDateIndex = [];
      this.$refs.popup.hide();

      this.search();
    },
    bindChange: function (e) {
      this.searchDateIndex = e.detail.value;
    },
    search() {
      var params = {
        pageNum: 1,
        pageSize: this.size,
      };

      this.getServiceMonerysLogListFunc(params, 1);
    },
    upCallback(page) {
      var params = {
        pageNum: page.num,
        pageSize: this.size,
      };

      this.getServiceMonerysLogListFunc(params, page.num);
    },
    getServiceMonerysLogListFunc(params, pageNum) {
      uni.showLoading();
      var MM =
        this.month.toString().length == 1 ? "0" + this.month : this.month;
      params.date = `${this.year}-${MM}`;
      getServiceMonerysLogList(params).then((res) => {
        uni.hideLoading();
        if (res.code == 200) {
          let curPageData = res.rows;
          let curPageLen = curPageData.length;
          let totalSize = res.total;
          //设置列表数据
          if (pageNum == 1) this.list = []; //如果是第一页需手动置空列表
          this.list = this.list.concat(curPageData); //追加新数据
          this.mescroll.endBySize(curPageLen, totalSize);
        } else {
          
          this.mescroll.endErr();
        }
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
  background-color: #ffffff;
  position: relative;
  .top-view {
    height: 100rpx;
    width: 100%;
    position: fixed;
    top: 0;
    background-color: #e9e9e9;
    padding: 0 20rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
	z-index: 99;
  }
  .picker-view {
    height: 100rpx;
    width: 100%;
    padding: 0 40rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .scroll-view {
    margin-top: 100rpx;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    box-sizing: border-box;
    .item {
      width: calc(100% - 40rpx);
      height: auto;
      padding: 30rpx;
      box-sizing: border-box;
      margin: 0 20rpx;
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      border-bottom: 1rpx solid grey;
    }
  }
  .popup-body {
    height: auto;
    width: 100%;
    background: #fff;
    padding: 20rpx 20rpx 40rpx 20rpx;
    border-top-left-radius: 30rpx;
    border-top-right-radius: 30rpx;
    position: fixed;
    bottom: 0;
    box-sizing: border-box;

    .picker {
      width: 750rpx;
      height: 600rpx;
      margin-top: 20rpx;
    }
    .picker-item {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  }
  .bottom-view {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    .button {
      width: 200rpx;
      height: 60rpx;
      color: black;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      font-size: 28rpx;
    }
    .button-green {
      color: #fff;
      background: #04be02;
    }
  }
}
</style>
