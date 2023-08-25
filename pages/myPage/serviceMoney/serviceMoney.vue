<template>
  <view class="page-body">
    <view class="top-view">
      <view class="left-content">
        <view style="font-size: 32rpx">当前余额</view>
        <view style="font-size: 52rpx; font-weight: bold; margin-top: 20rpx">
          ¥{{ !!serviceMoney? serviceMoney:0 }}
        </view>
      </view>
      <view class="right-content" @click="handleJump"> 查看消费记录</view>
    </view>
    <view style="color: rgb(110, 110, 110)"> 请选择要购买的服务金金额 </view>
    <view class="row-content">
      <view
        v-for="(item, index) in list"
        :key="index"
        @click="check_index = index"
        class="check-item"
        :class="{ 'check-item-checked': check_index == index }"
      >
        <span style="font-size: 48rpx; font-weight: bold">¥ {{ item }}</span>
      </view>
    </view>
    <view class="bottom-view">
      <button
        class="bottom-btn"
        :class="{ 'disable-btn': check_index == -1 }"
        @click="handleBuy"
      >
        购买
      </button>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { getServiceMoney, getBuyServiceInfo } from "../.././../api/api.js";
export default {
  data() {
    return {
      serviceMoney: 0,
      list: [99, 299, 499],
      check_index: -1,
    };
  },
  onLoad() {
    this.getServiceMoneyFunc();
  },
  computed: {
    ...mapState(["loginInfo"]),
  },
  methods: {
    handleBuy() {
      if (this.check_index == -1) {
        return;
      }
      var money = this.list[this.check_index];
      var status = this.check_index + 1;
      var params = {
        monery: money,
        status: status,
        openId: this.loginInfo.openId,
      };
      uni.showLoading();

      getBuyServiceInfo(params).then((getPayRes) => {
        if (getPayRes.code == 200) {
          var payInfo = JSON.parse(getPayRes.msg);
          uni.hideLoading();
          var miniapp = {
            payInfo: payInfo,
          };
          var newData = JSON.stringify(miniapp);
          newData = newData.replace(/%/g, "%25");
          uni.navigateTo({
            url:
              "/pages/payThroughApp/index?miniapp=" +
              encodeURIComponent(newData),
          });
        } else if (getPayRes.code == 412) {
          uni.showToast({
            icon: "none",
            duration: 1500,
            title: `${res.msg}`,
          });
        }
      });

      // getBuyServiceInfo(params).then((getPayRes) => {
      //   if (getPayRes.code == 200) {
      //     var payInfo = JSON.parse(getPayRes.msg);
      //     uni.hideLoading();
      //     uni.requestPayment({
      //       provider: "weixin",
      //       nonceStr: payInfo["nonceStr"],
      //       package: payInfo["package"],
      //       paySign: payInfo["paySign"],
      //       signType: payInfo["signType"],
      //       timeStamp: payInfo["timeStamp"],
      //       success: function (res) {
      //         if (res.errMsg == "requestPayment:ok") {
      //           uni.showToast({ title: "支付成功", icon: "none" });
      //         } else {
      //           uni.showToast({ title: "支付失败", icon: "error" });
      //         }
      //       },
      //       fail: function (err) {
      //         uni.showToast({ title: "支付失败", icon: "error" });
      //       },
      //     });
      //   }
      // });
    },
    handleJump() {
      uni.navigateTo({ url: "/pages/myPage/serviceMoney/serviceHistory" });
    },
    getServiceMoneyFunc() {
      getServiceMoney().then((res) => {
        if (res.code == 200) {
          this.serviceMoney = res.data.serviceMoney;
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
  background-color: #fff;
  padding: 20rpx 40rpx;
  .top-view {
    padding: 40rpx;
    border-radius: 8rpx;
    border: 1rpx solid black;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 40rpx;
    .left-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  .row-content {
    margin-top: 40rpx;
    width: 100%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .check-item {
    flex-shrink: 0;
    width: 200rpx;
    height: 100rpx;
    margin-bottom: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border: 1rpx solid gainsboro;
  }
  .check-item-checked {
    border: 1rpx solid #36d2ba;
  }
  .bottom-view {
    position: fixed;
    bottom: 80rpx;
    width: calc(100% - 80rpx);
    .bottom-btn {
      height: 72rpx;

      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28rpx;

      background: #36d2ba;
      color: #fff;
    }
    .disable-btn {
      background-color: grey;
    }
  }
}
</style>
