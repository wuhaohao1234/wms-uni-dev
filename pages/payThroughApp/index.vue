<template>
  <view>
    <view style="margin-top: 20%"></view>
    <button
      style="width: 60vw"
      id="goBackApp"
      open-type="launchApp"
      app-parameter="wechat"
      binderror="launchAppError"
      type="primary"
      v-if="payFinished"
    >
      {{ buttonText }}
    </button>

    <view
      style="
        position: absolute;
        bottom: 0px;
        width: 100%;
        text-align: center;
        padding-bottom: 10%;
      "
    >
      <text style="text-align: center; color: gray">支付版本: 0.0.38</text>
    </view>
  </view>
</template>

<script>
import { weBtoa, weAtob } from "./weapp-jwt.js";
export default {
  data() {
    return { payOrderId: {}, payFinished: false, buttonText: "返回 App" };
  },
  onLoad(options) {
    var that = this;
    // const query = wx.createSelectorQuery();
    // var gobackButton = query.select("#goBackApp");
    // console.log(gobackButton);
    var { miniapp } = options;
    var payInfo;
    // try {
    if (!!miniapp) {
      payInfo = JSON.parse(decodeURIComponent(options.miniapp)).payInfo;
    } else {
      var params = that.handleOptions(options);
      payInfo = JSON.parse(weAtob(params["payOrderId"]));
    }
    // } catch (e) {
    //   uni.showToast({
    //     title: "调用错误",
    //     icon: "error",
    //     duration: 500,
    //   });

    //   that.payFinished = true;
    //   that.payFinished = "返回 App 并联系后台";
    // }

    wx.requestPayment({
      nonceStr: payInfo["nonceStr"],
      package: payInfo["package"],
      paySign: payInfo["paySign"],
      signType: payInfo["signType"],
      timeStamp: payInfo["timeStamp"],
      success(res) {
        // should allow users to go back to the app.
        if (res.errMsg == "requestPayment:ok") {
          uni.showToast({ title: "支付成功", icon: "none" });
          if (!!miniapp) {
            uni.reLaunch({ url: "/pages/order/order?index=1" });
          } else {
            that.payFinished = true;
            that.payFinished = "成功, 返回App";
          }
        } else {
          uni.showToast({ title: "支付失败", icon: "error" });
          if (!!miniapp) {
            uni.reLaunch({ url: "/pages/order/order?index=0" });
          } else {
            that.payFinished = true;
            that.payFinished = "返回 App 并联系后台";
          }
        }
      },
      fail(res) {
        uni.showToast({ title: "支付失败", icon: "error" });
        if (!!miniapp) {
          uni.reLaunch({ url: "/pages/order/order?index=0" });
        } else {
          that.payFinished = true;
          that.payFinished = "返回 App 并联系后台";
        }
      },
    });
  },
  methods: {
    handleOptions(options, key) {
      let params = JSON.parse(JSON.stringify(options));
      if (params.q || params.scene) {
        params = {
          ...params,
          ...getQueryParams(decodeURIComponent(params.q || params.scene)),
        };
      }
      if (key) {
        return params[key];
      } else {
        return params;
      }
    },
  },
};
</script>

<style>
</style>
