<template>
  <view class="page-body">
    <view class="my-view" @click="handleJump('/pages/myPage/info/info')">
      <img class="avater" :src="userInfo.avatar ? userInfo.avatar : '../../static/icons/icon_no_avatar.png'" alt="" mode="aspectFill" />

      <view class="info">
        <view class="info-main">{{ userInfo.nickName ? userInfo.nickName : "昵称" }}</view>
        <view class="info-sub">{{ userInfo.phoneNum ? userInfo.phoneNum : "手机号码" }}</view>
      </view>
      <button class="logout" @click="logout" v-on:click.stop>退出</button>
    </view>
    <view class="action-view">
      <view class="action-item" @click="handleJump('/pages/myPage/address/address')">
        <img class="action-icon" src="../../static/icons/icon_location.svg" alt="" />
        <view class="action-title">
          <span>收货地址管理</span>
        </view>
        <uni-icons type="right" size="24"></uni-icons>
      </view>
      <view class="action-item" @click="handleJump('/pages/myPage/shop/shop')">
        <img class="action-icon" src="../../static/icons/icon_switch.svg" alt="" />
        <view class="action-title">
          <span>切换店铺</span>
          <span style="flex-shrink: 0"> {{ loginInfo.nickName }}</span>
        </view>
        <uni-icons type="right" size="24"></uni-icons>
      </view>
      <view
        class="action-item"
        @click="handleJump('/pages/myPage/serviceMoney/serviceMoney')"
      >
        <img
          class="action-icon"
          src="../../static/icons/icon_money.svg"
          alt=""
        />
        <view class="action-title">
          <span>服务金管理</span>
        </view>
        <uni-icons type="right" size="24"></uni-icons>
      </view>
      <view class="action-item" @click="handleJumpMini">
        <img class="action-icon" src="../../static/icons/icon_hg.svg" alt="" />
        <view class="action-title">
          <span>海关额度查询</span>
        </view>
        <uni-icons type="right" size="24"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["hasLogin", "userInfo", "loginInfo"]),
  },
  created() {
    // if (!this.hasLogin) {
    //   // uni.getUserPerfile()
    //   // this.backLogin()
    //   uni.reLaunch({ url: "/pages/login/login" });
    // }
  },
  methods: {
    ...mapMutations(["setLogout"]),
    logout() {
      this.setLogout();
      uni.setStorage({
        key: "userInfo",
        data: "",
      });
      uni.setStorage({
        key: "loginInfo",
        data: "",
      });
      uni.reLaunch({ url: "/pages/login/login" });
    },
    handleJump(target) {
      uni.navigateTo({ url: target });
    },
    handleJumpMini() {
      uni.navigateToMiniProgram({ appId: "wx557a91df6a14ba97" });
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
}
.my-view {
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 40rpx 40rpx;

  background-color: #ffffff;
}
.avater {
  height: 120rpx;
  width: 120rpx;
  border-radius: 50%;
  background: rgb(240, 240, 240);
}
.info {
  width: 360rpx;
  padding: 12rpx 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
.info-main {
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
}
.info-sub {
  font-size: 28rpx;
}
.logout {
  width: 120rpx;
  height: 48rpx;
  padding: 0;
  margin: 0;
  align-self: flex-end;
  font-size: 24rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24rpx;
  background: #36d2ba;
  color: #fff;
}

.action-view {
  padding: 20rpx 0rpx;
}
.action-item {
  padding: 20rpx 40rpx;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16rpx 0;
}
.action-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
}
.action-icon {
  width: 42rpx;
  height: 42rpx;
}
</style>
