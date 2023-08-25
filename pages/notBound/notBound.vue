<template>
  <view class="page-body">
    <image class="image" src="/static/image/notBound.svg" alt=""></image>
    <view>您还未跟店铺绑定，请根据好友分享进入....</view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
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
  position: relative;
  overflow-y: scroll;
  padding-bottom: 120rpx;
  justify-content: center;
  align-items: center;
  .image {
    width: 300rpx;
    height: 300rpx;
  }
}
</style>
