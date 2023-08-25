<template>
  <view class="page-body">
    <view class="top-view">请选择要进入的店铺</view>

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
      <view
        v-for="(item, index) in list"
        :key="index"
        class="action-item"
        @click="handleChangeShop(item)"
      >
        <img
          class="action-icon"
          src="../../../static/icons/icon_shop.svg"
          alt=""
        />
        <span class="float" v-if="item.currentStore">当前</span>
        <span class="action-title">{{ item.nickName }}</span>
        <uni-icons type="right" size="24"></uni-icons>
      </view>
    </mescroll-uni>
  </view>
</template>

<script>
import { getShopList, changeShop } from "../.././../api/api.js";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      size: 10,
      list: [],
    };
  },
  methods: {
    ...mapMutations(["setLogin", "setToken", "setUserInfo"]),
    ...mapGetters(["getUserInfo"]),

    handleChangeShop(target) {
      var _this = this;
      uni.showLoading({ title: "加载中" });
      changeShop({ shopCode: target.shopCode }).then((res) => {
        if (res.code == 200) {
          _this.setToken(res.data.token);
          uni.setStorage({
            key: "loginInfo",
            data: res.data,
          });
          _this.setLogin(res.data);

          uni.hideLoading();

          uni.reLaunch({ url: "/pages/home/home" });
        }
      });

      console.log("target", target);
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    downCallback() {
      this.mescroll.resetUpScroll();
    },

    search() {
      var params = {
        pageNum: 1,
        pageSize: this.size,
      };

      this.getShopListFunc(params, 1);
    },
    upCallback(page) {
      var params = {
        pageNum: page.num,
        pageSize: this.size,
      };

      this.getShopListFunc(params, page.num);
    },
    getShopListFunc(params, pageNum) {
      uni.showLoading();

      getShopList(params).then((res) => {
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
  background-color: #f8f8f8;
  position: relative;
  overflow-y: scroll;
  padding-bottom: 120rpx;
  .top-view {
    height: 100rpx;
    width: 100%;
    position: fixed;
    top: 0;
    background-color: #f8f8f8;
    padding: 0 20rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .scroll-view {
    margin-top: 100rpx;
    width: 100%;
    height: 100%;
    background-color: #f8f8f8;
    box-sizing: border-box;

    .action-view {
      padding: 20rpx 0rpx;
    }
    .action-item {
      padding: 30rpx 40rpx;
      background-color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 40rpx 20%;
      position: relative;
    }
    .action-title {
      width: 240rpx;
      text-align: left;
    }
    .action-icon {
      width: 42rpx;
      height: 42rpx;
    }
    .float {
      position: absolute;
      left: 0;
      top: 0;
      background: black;
      color: white;
      font-size: 20rpx;
      padding: 4rpx;
      border-radius: 8rpx;
    }
  }
}
</style>
