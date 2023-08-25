<template>
  <view class="page-body">
    <v-tabs
      color="#000"
      activeColor="#000"
      lineColor="#000"
      v-model="currentTab"
      :tabs="tabsSub"
      field="label"
      :scroll="false"
      @change="changeTabSub"
      :line-animation="false"
    >
    </v-tabs>
    <swiper
      v-if="swiperList.length"
      class="container-tabs__swiper"
      :current="currentTab"
      @animationfinish="animationFinished"
    >
      <swiper-item v-for="(outItem, outIndex) in swiperList" :key="outIndex">
        <mescroll-uni
          :ref="'mescrollRef' + outIndex"
          @init="(e) => mescrollInit(e, outIndex)"
          @down="downCallback(outIndex)"
          :down="{ auto: false }"
          @up="(e) => upCallback(e, outIndex)"
          :up="{ textNoMore: '', page: { size: size } }"
          :fixed="false"
          :safearea="true"
        >
          <view class="column-view">
            <view
              class="order-card"
              v-for="(item, index) in outItem.data"
              :key="index"
              @click="handJump(item)"
            >
              <view class="card-title">
                <span>{{ item.createTime }}</span>
                <span style="font-weight: bold">{{
                  getItemStatus(item.orderStatus)
                }}</span>
              </view>
              <view class="commodity-view">
                <image
                  class="commodity-img"
                  :src="item.detailsList[0].pictureList[0]"
                  alt=""
                  mode="aspectFit"
                />
                <view class="commodity-info">
                  <view>{{ item.detailsList[0].productName }}</view>
                  <!-- <view style="color: grey">货号{{ item.detailsList[0].stockCode }}</view> -->
                  <view class="commodity-tag">
                    <view v-if="item.detailsList[0].size" class="tag">{{
                      item.detailsList[0].size
                    }}{{
                      item.detailsList[0].specification!=null? '/'+item.detailsList[0].specification:''
                    }}</view>
                    <view v-if="item.detailsList[0].color" class="tag">{{
                      item.detailsList[0].color
                    }}</view>
                    <view v-if="item.detailsList[0].brandName" class="tag">{{
                      item.detailsList[0].brandName
                    }}</view>
                  </view>
                  <view class="quantity">×1</view>
                </view>
              </view>
              <view class="card-footer">
                <view></view>
                <view
                  ><span>订单总计：</span>
                  <span style="font-weight: bold; font-size: 32rpx"
                    >¥{{ item.orderSum }}</span
                  ></view
                >
              </view>

              <view class="card-pay" v-if="item.orderStatus == 1">
                <view class="pay-time" v-if="item.left_time">
                  剩余付款时间{{ item.left_time }}
                </view>
                <view class="pay-time" v-else> </view>
                <view class="btn-view">
                  <button
                    class="btn btn-cancel"
                    @click="handleCancel(item)"
                    v-on:click.stop
                  >
                    取消订单
                  </button>
                  <button
                    class="btn btn-pay"
                    @click="handJump(item)"
                    v-on:click.stop
                  >
                    去支付
                  </button>
                </view>
              </view>
            </view>
          </view>
        </mescroll-uni>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { getOrderList, cancelOrder } from "../../api/api.js";
export default {
  data() {
    return {
      size: 10,
      currentTab: 0,
      tabsSub: [
        { key: "TO_PAY", label: "待付款", status: 1 },
        { key: "TO_DELIVERY", label: "待发货", status: 2 },
        { key: "TO_RECEIVE", label: "待收货", status: 3 },
        { key: "RECEIVED", label: "已收货", status: 5 },
        { key: "DEAL_FAILURE", label: "交易失败", status: 6 },
      ],
      swiperList: [
        { page: 1, data: [] },
        { page: 1, data: [] },
        { page: 1, data: [] },
        { page: 1, data: [] },
        { page: 1, data: [] },
      ],
    };
  },
  onLoad(option) {
    const { index } = option;
    console.log(option);
    if (!!index) {
      this.currentTab = index;
    }
  },
  methods: {
    getLeftTime(item, index) {
      var timer = "timer_" + item.orderId;
      if (item.orderStatus != 1) {
        return;
      }
      this[timer] = setInterval(() => {
        var date_now = new Date();
        var date_old = new Date(item.createTime);
        var timeStamp = 60 * 15 * 1000;
        var left_time_stemp = timeStamp - (date_now - date_old);

        var left_time = new Date(left_time_stemp);
        var mm = left_time.getMinutes();
        var ss = left_time.getSeconds();
        mm = mm.toString().length == 1 ? "0" + mm : mm;
        ss = ss.toString().length == 1 ? "0" + ss : ss;
        item.left_time = mm + ":" + ss;
        if (left_time_stemp < 0  ) {
          this.swiperList[this.currentTab].data.splice(index, 1);
          clearInterval(this[timer]);
        }
      }, 1000);
    },
    handleCancel(item) {
      var params = {
        id: item.orderId,
        orderStatus: 6,
      };
      cancelOrder(params).then((res) => {
        if (res.code == 200) {
          this.search();
        }
      });
    },
    getItemStatus(status) {
      var item = this.tabsSub.filter((item) => item.status == status);
      if (item.length) {
        return item[0].label || "";
      }
      return "";
    },
    mescrollInit(mescroll, index) {
      var target = "mescroll" + index;
      this[target] = mescroll;
    },
    downCallback(index) {
      var target = "mescroll" + index;
      this[target].resetUpScroll();
    },
    changeTabSub(e) {
      this.currentTab = e;
    },
    animationFinished(e) {
      this.currentTab = e.detail.current;
      if (this.swiperList[e.detail.current].data.length == 0) {
        this.search();
      }
    },

    search() {
      var params = {
        pageNum: 1,
        pageSize: this.size,
      };

      this.getData(params, 1);
    },
    upCallback(page, index) {
      var params = {
        pageNum: page.num,
        pageSize: this.size,
      };
      if (this.currentTab != index) return;
      this.getData(params, page.num);
    },
    getData(params, pageNum) {
      params.orderStatus = this.tabsSub[this.currentTab].key;

      getOrderList(params).then((data) => {
        var target = "mescroll" + this.currentTab;
        console.log("data", data);
        if (data) {
          let curPageData = data.rows;
          let curPageLen = curPageData.length;
          var totalSize = data.total;
          curPageData.forEach((item, index) => {
            this.getLeftTime(item, index);
            item.swiperList = [];
            item.left_time = "";
            if (item.detailsList) {
              item.detailsList.forEach((dl) => {
                dl.pictureList = dl.picturePath.split(";");
              });
            }
          });
          //设置列表数据
          if (pageNum == 1) {
            //如果是第一页需手动置空列表
            this.swiperList[this.currentTab].data = [];
          }
          this.swiperList[this.currentTab].data =
            this.swiperList[this.currentTab].data.concat(curPageData); //追加新数据

          this[target].endBySize(curPageLen, totalSize);
          console.log("this.swiperLis", this.swiperList);
        } else {
          //  请求失败,隐藏加载状态
          this[target].endErr();
        }
      });
    },
    handJump(target) {
      uni.navigateTo({
        url: "/pages/order/orderDetail/orderDetail?orderId=" + target.orderId,
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
  .column-view {
    height: 100%;
    width: 100%;
    background: rgb(204, 204, 204);
    .order-card {
      margin: 2rpx 0;
      padding: 20rpx 40rpx;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      .card-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .commodity-view {
        height: 280rpx;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        box-sizing: border-box;
        .commodity-img {
          height: 240rpx;
          width: 240rpx;
          flex-shrink: 0;
          margin-right: 8rpx;
        }
        .commodity-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          height: 200rpx;
          width: inherit;
          position: relative;
          .commodity-tag {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .tag {
              background: black;
              padding: 2rpx 8rpx;
              margin-right: 16rpx;
              color: #fff;
              border-radius: 4rpx;
            }
          }
          .quantity {
            position: absolute;
            right: 40rpx;
            bottom: 0;
            font-weight: bold;
          }
        }
      }
      .card-footer {
        align-self: flex-end;
      }
      .card-pay {
        margin-top: 20rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .pay-time {
          color: red;
          font-size: 24rpx;
        }
        .btn-view {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60rpx;
            padding: 8rpx 24rpx;
            border-radius: 30rpx;
            font-size: 24rpx;
            margin-left: 20rpx;
            width: 180rpx;
          }
          .btn-cancel {
            color: black;
            background: #fff;
            border: 1rpx solid black;
          }
          .btn-pay {
            color: #fff;
            background: #36d2ba;
          }
        }
      }
    }
  }
}

.container-tabs__swiper {
  height: 100%;
}
</style>
