<template>
  <view class="page-body">
    <view class="search-box">
      <uni-search-bar
        v-model="searchKey"
        style="width: 100%"
        clearButton="auto"
        cancelButton="none"
        radius="25"
        placeholder="搜索姓名/电话"
        @confirm="search"
        @cancel="cancel"
      />
    </view>
    <view class="body">
      <mescroll-uni
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
          class="address-card"
          v-for="(item, index) in dataList"
          :key="index"
          @click="handleSelect(item)"
        >
          <view class="is-dafault" v-if="item.isdefault == 1">常用</view>
          <image
            class="icon"
            src="../../../static/icons/icon_location_red.png"
            alt=""
          />
          <view class="info-box">
            <view class="info-title">
              <view class="info-name">{{ item.userName }}</view>
              <view>{{ item.userPhone }}</view></view
            >
            <view> {{ item.province }} {{ item.city }} {{ item.area }}</view>
            <view> {{ item.userAddress }}</view>
          </view>

          <view class="button" v-if="type != 'select'" @click="handJump(item)"
            >编辑</view
          >
        </view>
      </mescroll-uni>
    </view>
    <view class="bottom-box">
      <button class="bottom-button" @click="handJump()">添加新地址</button>
    </view>
  </view>
</template>

<script>
import { getAddressList } from "../../../api/api.js";
export default {
  props: ["type"],
  data() {
    return {
      size: 10,
      dataList: [],
      searchKey: "",
    };
  },
  created() {
    console.log("type", this.type);
  },
  onShow() {
    this.mescroll.resetUpScroll();
  },
  methods: {
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

      this.getData(params, 1);
    },
    upCallback(page) {
      var params = {
        pageNum: page.num,
        pageSize: this.size,
      };

      this.getData(params, page.num);
    },
    getData(params, pageNum) {
      if (!!this.searchKey) {
        params.userName = this.searchKey;
        params.userphone = this.searchKey;
      }
      getAddressList(params).then((data) => {
        if (data) {
          let curPageData = data.rows;
          let curPageLen = curPageData.length;
          let totalSize = data.total;
          //设置列表数据
          if (pageNum == 1) this.dataList = []; //如果是第一页需手动置空列表
          this.dataList = this.dataList.concat(curPageData); //追加新数据
          this.mescroll.endBySize(curPageLen, totalSize);
        } else {
          //  请求失败,隐藏加载状态
          this.mescroll.endErr();
        }
      });
    },
    handJump(target) {
      var url = "";
      if (target) {
        url = "/pages/myPage/address/editAddress?id=" + target.id;
      } else {
        url = "/pages/myPage/address/editAddress";
      }
      // complete:()=>{this.search()}
      uni.navigateTo({
        url: url,
      });
    },
    handleSelect(item) {
      if (this.type) {
        let pages = getCurrentPages();
        let prePage = pages[pages.length - 2];
        prePage.$vm.address = item;
        uni.navigateBack();
      }
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
}
.search-box {
  width: 100%;
  height: 6%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
}
.search-input {
  width: 85%;
  height: 48rpx;
  padding: 0 24rpx;
  border: 1rpx solid grey;
  border-radius: 24rpx;
}
.bottom-box {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20rpx;
  background: #fff;
}
.bottom-button {
  width: 86%;
  height: $cust-button-base;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  //   font-size: 24rpx;
  font-size: $uni-font-size-base;
  background: #36d2ba;
  color: #fff;
}
.address-card {
  background: rgba(236, 236, 236, 0.5);
  padding: 40rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  .icon {
    height: 48rpx;
    width: 48rpx;
  }
  .is-dafault {
    position: absolute;
    left: 0;
    top: 0;
    width: 60rpx;
    height: 40rpx;
    background-color: rgba(189, 236, 255, 0.1);
    font-size: 20rpx;
    color: rgb(0, 139, 253);
    display: flex;
    justify-content: center;
    font-weight: normal;
    align-items: center;
  }
  .info-box {
    padding: 0 20rpx;
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .info-title {
    display: flex;
    margin-bottom: 4rpx;
    align-items: flex-end;
  }
  .info-name {
    font-weight: bold;
    margin-right: 20rpx;
    font-size: $uni-font-size-base;
  }
}

.button {
  font-size: 20rpx;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100rpx;
  height: 60rpx;
  color: grey;
  border-left: 1rpx solid rgba(128, 128, 128, 0.2);
}
.button:active {
  color: #000;
}

.body {
  height: 86%;
  overflow: hidden;
  padding-top: 6rpx;
}
</style>

