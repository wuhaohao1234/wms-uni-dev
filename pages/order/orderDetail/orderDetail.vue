<template>
  <view class="page-body">
    <!-- 收件地址 -->

    <!-- <view class="divider"></view> -->
    <!-- 商品详情 -->
    <view class="commodity-view" v-if="!orderId">
      <image class="commodity-img" :src="picturePath" alt="" mode="aspectFit" />
      <view class="commodity-info">
        <view>{{ commodityDetail.commodityName }}</view>
        <view style="color: grey">货号{{ commodityDetail.stockCode }}</view>
        <view class="commodity-tag">
          <view v-if="purchaseDetail.size" class="tag">{{
            purchaseDetail.size
          }}{{
            purchaseDetail.specification!=null?'/'+purchaseDetail.specification:''
          }}</view>
          <view v-if="commodityDetail.color" class="tag">{{
            commodityDetail.color
          }}</view>
          <view v-if="commodityDetail.brandName" class="tag">{{
            commodityDetail.brandName
          }}</view>
        </view>
        <view class="quantity">×1</view>
      </view>
    </view>
    <view
      class="commodity-view"
      v-else
      v-for="(orderItem, index) in orderDetail.wmsUserOrderDetailsList"
      :key="index"
    >
      <image
        class="commodity-img"
        :src="orderItem.pictureList[0]"
        alt=""
        mode="aspectFit"
      />
      <view class="commodity-info">
        <view>{{ orderItem.productName }}</view>
        <view v-if="orderItem.stockCode" style="color: grey"
          >货号{{ orderItem.stockCode }}</view
        >
        <view v-if="orderItem.stockCode" style="color: grey"
          >仓库{{ orderItem.stockCode }}</view
        >
        <view class="commodity-tag">
          <view v-if="orderItem.size" class="tag">{{ orderItem.size }}</view>
          <view v-if="orderItem.color" class="tag">{{ orderItem.color }}</view>
          <view v-if="orderItem.brandName" class="tag">{{
            orderItem.brandName
          }}</view>
        </view>
        <view class="quantity">×1</view>
      </view>
    </view>

    <view class="divider"></view>

    <!-- 配送方式 -->
    <view class="info-view">
      <span>配送方式</span>
      <span v-if="!orderId" style="font-weight: bold">{{
        taxFee.notCross == -1 ? "" : taxFee.notCross ? "国内快递" : "跨境顺丰"
      }}</span>
      <span v-else style="font-weight: bold">{{
        orderDetail.logisticsName
      }}</span>
    </view>
    <view class="divider" v-if="orderId"></view>
    <!-- 配送方式 -->
    <view class="info-view" v-if="orderId">
      <span>物流单号</span>
      <span style="font-weight: bold">{{ orderDetail.logisticsNum }}</span>
    </view>
    <view class="divider" v-if="orderId"></view>

    <!-- 仓库 -->
    <view class="info-view" v-if="orderId">
      <span>仓库</span>
      <span style="font-weight: bold">{{ orderDetail.depotName }}</span>
    </view>
    <view class="divider" v-if="orderId"></view>

    <!-- 商品金额 -->
    <view class="money-view" v-if="!orderId">
      <view class="money-item">
        <span>商品金额</span>
        <span>¥{{ taxFee.goodsTotalFee }}</span>
      </view>
      <view class="money-item">
        <span>运费</span>
		<span v-if="taxFee.goodsTotalFee&&taxFee.goodsTotalFee>=5000">已包含</span>
        <span v-else>¥{{ taxFee.freightFee }}</span>
      </view>
      <view class="money-item">
        <span>税费</span>
		<span v-if="taxFee.goodsTotalFee&&taxFee.goodsTotalFee>=5000">已包含</span>
        <span v-else>¥{{ taxFee.taxFee }}</span>
      </view>
      <view class="money-item">
        <span>服务金</span>
		<span v-if="taxFee.goodsTotalFee&&taxFee.goodsTotalFee>=5000">已包含</span>
        <span v-else>¥{{ taxFee.serviceFee }}</span>
      </view>
    </view>

    <view class="money-view" v-else>
      <view class="money-item">
        <span>商品金额</span>
        <span>¥{{ orderDetail.sellPrice }}</span>
      </view>
      <view v-if="orderDetail.postFee" class="money-item">
        <span>运费</span>
		<span v-if="orderDetail.postFee&&orderDetail.postFee>=5000">已包含</span>
        <span v-else>¥{{ orderDetail.postFee }}</span>
      </view>
      <view v-if="orderDetail.tariff" class="money-item">
        <span>税费</span>
		<span v-if="orderDetail.postFee&&orderDetail.postFee>=5000">已包含</span>
        <span v-else>¥{{ orderDetail.tariff }}</span>
      </view>
      <view v-if="orderDetail.servicePay" class="money-item">
        <span>服务金</span>
		<span v-if="orderDetail.postFee&&orderDetail.postFee>=5000">已包含</span>
        <span v-else>¥{{ orderDetail.servicePay }}</span>
      </view>
    </view>

    <view class="divider"></view>

    <view class="memo-view">
      <span style="margin-right: 20rpx">订单备注</span>
      <textarea
        v-if="!orderId"
        v-model="notes"
        auto-height
        style="width: 75%"
        placeholder="输入(选填)"
      />
      <textarea
        :disabled="orderDetail.orderStatus != 1"
        style="width: 75%"
        v-else
        v-model="orderDetail.notes"
        auto-height
      />
    </view>
    <view class="divider"></view>
    <view class="address-view" v-if="!orderId" style="background: #36d2ba">
      <view
        v-if="!address.userAddress"
        class="no-address"
        @click="handleJumpAddress"
      >
        <uni-icons
          type="plus"
          size="20"
          color="#fff"
          style="margin-right: 20rpx"
        ></uni-icons>
        <span style="color: #fff">请添加收件人信息</span>
      </view>
      <view v-else class="address-card" @click="handleJumpAddress">
        <image
          class="icon"
          src="../../../static/icons/icon_location_red.png"
          alt=""
        />
        <view class="info-box">
          <view class="info-title">
            <view class="info-name">{{ address.userName }}</view>
            <view>{{ address.userPhone }}</view>
          </view>
          <view>
            {{ address.province }} {{ address.city }} {{ address.area }}</view
          >
          <view>{{ address.userAddress }}</view>
        </view>
      </view>
    </view>

    <view class="address-view" v-else>
      <view class="address-card">
        <image
          class="icon"
          src="../../../static/icons/icon_location_red.png"
          alt=""
        />
        <view class="info-box">
          <view class="info-title">
            <view class="info-name">{{ orderDetail.userName }}</view>
            <view>{{ orderDetail.userPhone }}</view>
          </view>
          <view>
            {{ orderDetail.province }} {{ orderDetail.city }}
            {{ orderDetail.area }}</view
          >
          <view>{{ orderDetail.address }}</view>
        </view>
      </view>
    </view>
    <view class="divider"></view>
    <view class="bottom-view" v-if="!orderId">
      <view>
        <span style="color: grey">共1件，</span>
        <span>订单总计：</span>
        <span style="font-weight: bold; color: red">¥{{ taxFee.totalFee }}</span>
      </view>
      <button class="pay-button" v-if="address.id" @click="addOrderFunc">
        支付
      </button>
    </view>

    <view class="bottom-view" v-else>
      <view>
        <span style="color: grey">共{{ orderDetail.buyNums }}件，</span>
        <span>订单总计：</span>
        <span style="font-weight: bold; color: red"
          >¥{{ orderDetail.orderSum }}</span
        >
      </view>
      <button
        class="pay-button"
        v-if="orderDetail.orderStatus == 1 && orderDetail.payStatus == 0"
        @click="handlePay"
      >
        支付
      </button>

      <button
        class="pay-button"
        @click="handleLogistics"
        v-if="orderDetail.orderStatus == 3 || orderDetail.orderStatus == 5"
      >
        查看物流
      </button>
    </view>
  </view>
</template>

<script>
import uniIcons from "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import {
  getTaxFee,
  addMiniOrder,
  getOrderDetail,
  getPayInfo,
  getLogistics,
} from "../.././../api/api.js";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  components: {
    uniIcons,
  },
  props: ["targetData"],
  data() {
    return {
      sendType: "",
      address: {},
      commodityDetail: {
        commodityName: "",
        stockCode: "",
        color: "",
        brandName: "",
      },

      purchaseDetail: {
        size: "",
      },
      picturePath: "",

      taxFee: {
        goodsTotalFee: 0,
        freightFee: 0,
        taxFee: 0,
        serviceFee: 0,
        notCross: -1,
		totalFee:0,
      },
      orderDetail: {},
      notes: "",
      orderId: "",
    };
  },
  computed: {
    ...mapState(["userInfo", "loginInfo"]),
  },
  onLoad: function (options) {
    console.log("options", options);
    const { orderId, targetData } = options;
    if (targetData) {
      var targetInfo = JSON.parse(decodeURIComponent(targetData));
      this.commodityDetail = targetInfo.commodityDetail;
      this.purchaseDetail = targetInfo.purchaseDetail;
      this.currentMain = targetInfo.currentMain;
      this.picturePath = this.purchaseDetail.picturePath
        .toString()
        .split(";")[0];
    } else if (orderId) {
      this.orderId = orderId;
      this.editable = false;
      this.getOrderDetailFunc(orderId);
    }
  },
  onShow() {
    if (this.address && this.address.id) {
      this.getPriceFunc();
    }
  },
  methods: {
    getTotal() {
      var taxFee = this.taxFee;
      var price =
        taxFee.goodsTotalFee +
        taxFee.freightFee +
        taxFee.taxFee +
        taxFee.serviceFee;
      price = price.toFixed(2);
      console.log("price,", price);
      return price;
    },
    handleJumpAddress() {
      uni.navigateTo({
        url: "/pages/myPage/address/address?type=select",
      });
    },
    getPriceFunc() {
      var params = {
        addressId: this.address.id,
        depotId: this.purchaseDetail.depotId,
        resaleGoods: this.purchaseDetail.resaleGoods,
        skuOrderList: [
          {
            id: this.purchaseDetail.id,
            status: this.currentMain == 0 ? 0 : 1,
            count: 1,
          },
        ],
      };
      getTaxFee(params).then((res) => {
        if (res.code == 200) {
          // if (res.data.goodsTotalFee >= 5000 && !res.data.notCross) {
          //   uni.showToast({
          //     icon: "none",
          //     duration: 1500,
          //     title: `商品金额超过5000，无法完成跨境电商清关，请选择不跨境地址`,
          //   });
          //   this.address = {};
          //   this.taxFee = {
          //     goodsTotalFee: 0,
          //     freightFee: 0,
          //     taxFee: 0,
          //     serviceFee: 0,
          //     notCross: -1,
          //   };
          // } else {
          //   this.taxFee = res.data;
          // }
		  this.taxFee = res.data;
        } else if (res.code == 412) {
          uni.showToast({
            icon: "none",
            duration: 1500,
            title: `${res.msg}`,
          });
          this.address = {};
        }
      });
    },

    getOrderDetailFunc(orderId) {
      uni.showLoading();
      getOrderDetail(orderId).then((res) => {
        uni.hideLoading();
        if (res.code == 200) {
          res.data.wmsUserOrderDetailsList.forEach((item) => {
            item.pictureList = item.picturePath.split(";");
          });

          this.orderDetail = res.data;
        }
      });
    },
    handlePay() {
      var params = {
        payChannel: 1,
        openId: this.loginInfo.openId,
        price: this.orderDetail.wmsUserOrderDetailsList[0].subTotal,
        orderId: this.orderId,
      };

      getPayInfo(params).then((getPayRes) => {
        if (getPayRes.code == 200) {
          var payInfo = JSON.parse(getPayRes.data.payOrderId);
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
        }
      });
    },
    addOrderFunc() {
      var params = {
        addressId: this.address.id,
        depotId: this.purchaseDetail.depotId,
        openId: this.loginInfo.openId,
        notes: this.notes,
        resaleGoods: this.purchaseDetail.resaleGoods ? 1 : 0,
        picturePath: this.picturePath,
        size: this.purchaseDetail.size,
        skuOrderList: [
          {
            id: this.purchaseDetail.id,
            status: this.currentMain,
          },
        ],
      };
      uni.showLoading();
      addMiniOrder(params).then((res) => {
        uni.hideLoading();
        if (res.code == 200) {
          var payOrderId = res.data; 
          var params = {
            payChannel: 1,
            openId: this.loginInfo.openId,
            price: this.taxFee.totalFee,
            orderId: payOrderId,
          };
          uni.showLoading();
          getPayInfo(params).then((getPayRes) => {
            if (getPayRes.code == 200) {
              var payInfo = JSON.parse(getPayRes.data.payOrderId);
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
            }

            // uni.requestPayment({
            //   provider: "weixin",
            //   nonceStr: payInfo["nonceStr"],
            //   package: payInfo["package"],
            //   paySign: payInfo["paySign"],
            //   signType: payInfo["signType"],
            //   timeStamp: payInfo["timeStamp"],
            //   success: function (res) {
            //     if (res.errMsg == "requestPayment:ok") {
            //       uni.showToast({ title: "支付成功", icon: "none" });
            //       uni.reLaunch({ url: "/pages/order/order?index=2" });
            //     } else {
            //       uni.showToast({ title: "支付失败", icon: "error" });
            //     }
            //   },
            //   fail: function (err) {
            //     uni.showToast({ title: "支付失败", icon: "error" });
            //   },
            // });
          });
        } else if (res.code == 412) {
          uni.showToast({
            icon: "none",
            duration: 1500,
            title: `${res.msg}`,
          });
        }
      });
    },
    handleLogistics() {
      uni.navigateTo({
        url:
          "/pages/order/logistics/logistics?logisticsNum=" +
          this.orderDetail.logisticsNum,
      });
    },
  },
};
//
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

  .divider {
    height: 2rpx;
    width: 100%;
    background: rgb(216, 216, 216);
  }

  .address-view {
    min-height: 140rpx;
    height: auto;

    .no-address {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 140rpx;
      width: 100%;
    }
  }

  .commodity-view {
    // height: 280rpx;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 10rpx 8rpx;

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
      // height: 200rpx;
      width: inherit;
      position: relative;

      .commodity-tag {
        display: grid;
        gap: 4rpx;

        .tag {
          background: black;
          padding: 2rpx 8rpx;
          margin-right: 16rpx;
          color: #fff;
          border-radius: 4rpx;
		  width: fit-content;
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

  .info-view {
    padding: 20rpx;
    height: 100rpx;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }

  .money-view {
    padding: 20rpx;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;

    box-sizing: border-box;

    .money-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
    }
  }

  .memo-view {
    padding: 20rpx;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-shrink: 0;
  }

  .bottom-view {
    position: fixed;
    bottom: 0;
    height: 120rpx;
    width: 100%;
    padding: 20rpx 40rpx;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;

    .pay-button {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      margin: 0;
      height: 68rpx;
      width: 200rpx;
      background: #36d2ba;
      color: #fff;
      font-size: 24rpx;
      border-radius: 34rpx;
    }
  }
}

.address-card {
  background: #fff;
  padding: 40rpx;
  // margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .icon {
    height: 48rpx;
    width: 48rpx;
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
</style>
