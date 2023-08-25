<template>
  <view class="page-body">
    <view class="form-view">
      <uni-forms ref="form" :label-width="120" :modelValue="formData" :rules="rules">
        <uni-forms-item label="姓名" required name="userName">
          <input v-model="formData.userName" placeholder="请输入姓名" />
        </uni-forms-item>
        <uni-forms-item label="手机号" required name="userPhone">
          <input v-model="formData.userPhone" placeholder="请输入手机号" type="number" maxlength="11" />
        </uni-forms-item>
        <uni-forms-item label="身份证号" required name="cardNum">
          <input v-model="formData.cardNum" placeholder="请输入身份证号" maxlength="18" />
        </uni-forms-item>

        <uni-forms-item label="地区" required name="province">
          <view class="region-view" placeholder="请选择地区" @click="showRegion"> <span v-if="!regionLabel" style="color: grey">请选择地址</span>{{ regionLabel }}</view>
        </uni-forms-item>
        <uni-forms-item label="详细地址" required name="userAddress">
          <uni-easyinput type="textarea" :autoHeight="true" v-model="formData.userAddress" placeholder="请输入详细地址" />
        </uni-forms-item>
        <uni-forms-item label="设为常用地址" required name="isdefault">
          <view style="display: flex; justify-content: flex-end; width: 100%"> <switch :checked="formData.isdefault == 1" @change="(e) => (this.formData.isdefault = e.detail.value ? 1 : 0)" /></view>
        </uni-forms-item>
      </uni-forms>
      <view class="bottom-box">
        <button class="bottom-button-delete" @click="handDelete">删除</button>
        <button class="bottom-button-submit" @click="handSubmit">保存</button>
      </view>
    </view>

    <wyb-popup ref="popupRegion" type="bottom" radius="6" height="100">
      <view class="popupRegion-body">
        <view class="regionTitle">
          <span>请选择地址</span>
          <view v-if="!!regionArea & !!regionCity & !!regionProvince" class="close-btn" @click="handleSelectRegion">确定</view>
        </view>
        <view class="title">
          <view class="title-item" @click="checkProvince()">{{ getRegionTitle(0) }}</view>
          <view class="title-item" @click="checkCity()">{{ getRegionTitle(1) }}</view>
          <view class="title-item">{{ getRegionTitle(2) }}</view>
        </view>

        <scroll-view scroll-y="true" class="content" v-if="regionIndex == 0">
          <view class="content-item" v-for="(province, index) in provinceList" :key="index" @click="checkProvince(province)">{{ province.provinceName }}</view>
        </scroll-view>
        <scroll-view scroll-y="true" class="content" v-if="regionIndex == 1">
          <view class="content-item" v-for="(city, index) in cityList" :key="index" @click="checkCity(city)">{{ city.cityName }}</view>
        </scroll-view>
        <scroll-view scroll-y="true" class="content" v-if="regionIndex == 2">
          <view class="content-item" v-for="(area, index) in areaList" :key="index" @click="checkArea(area)">{{ area.areaName }}</view>
        </scroll-view>
      </view>
    </wyb-popup>

    <uni-popup ref="alertDialog" type="dialog">
      <uni-popup-dialog type="warning" cancelText="取消" confirmText="确定" title="删除地址" content="您确定要删除此地址吗？" @confirm="dialogConfirm"></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import { addAddress, editAddress,deleteAddress, getAddressDetail, getProvince, getCity, getArea } from "../../../api/api.js";
export default {
  props: ["id"],
  data() {
    return {
      regionIndex: 0,
      regionLabel: "",
      regionArea: "",
      regionProvince: "",
      regionCity: "",
      provinceId: -1,
      cityId: -1,
      provinceList: [],
      cityList: [],
      areaList: [],
      formData: {
        userName: "",
        userPhone: "",
        province: "",
        city: "",
        area: "",
        cardNum: "",
        userAddress: "",
        isdefault: 0,
      },
      items: [],
      rules: {
        userName: {
          rules: [
            {
              required: true,
              errorMessage: "姓名不能为空",
            },
          ],
        },
        userPhone: {
          rules: [
            {
              required: true,
              errorMessage: "手机号不能为空",
            },
            {
              validateFunction: function (rule, value, data, callback) {
                console.log("value,", value);
                if (value.length != 11) {
                  callback("手机号格式不正确");
                }
                return true;
              },
            },
          ],
        },
        cardNum: {
          rules: [
            {
              required: true,
              errorMessage: "身份证号不能为空",
            },
            {
              validateFunction: function (rule, value, data, callback) {
                console.log("value,", value);
                if (value.length != 18) {
                  callback("身份证号格式不正确");
                }
                return true;
              },
            },
          ],
        },
        province: {
          rules: [
            {
              required: true,
              errorMessage: "地区不能为空",
            },
          ],
        },
        userAddress: {
          rules: [
            {
              required: true,
              errorMessage: "详细地址不能为空",
            },
          ],
        },
      },
    };
  },
  onReady() {
    // 需要在onReady中设置规则
    this.$refs.form.setRules(this.rules);
  },
  created() {
    if (this.id) {
      uni.setNavigationBarTitle({ title: "编辑地址" });
      this.getAddressDetailFunc();
    } else {
      uni.setNavigationBarTitle({ title: "添加地址" });
    }
  },
  methods: {
    handleSelectRegion() {
      this.formData.province = this.regionProvince;
      this.formData.city = this.regionCity;
      this.formData.area = this.regionArea;
      this.regionLabel = this.regionProvince + this.regionCity + this.regionArea;
      this.hideRegion();
    },
    getProvinceFunc() {
      uni.showLoading();
      getProvince().then((res) => {
        uni.hideLoading();
        if (res.code == 200) {
          this.provinceList = res.data;
        }
      });
    },
    getCityFunc() {
      uni.showLoading();
      getCity({ provinceId: this.provinceId }).then((res) => {
        uni.hideLoading();
        if (res.code == 200) {
          this.cityList = res.data;
        }
      });
    },
    getAreaFunc() {
      uni.showLoading();
      getArea({ cityId: this.cityId }).then((res) => {
        uni.hideLoading();
        if (res.code == 200) {
          this.areaList = res.data;
        }
      });
    },

    checkProvince(province) {
      if (province) {
        this.regionProvince = province.provinceName;
        this.provinceId = province.provinceId;
        this.regionIndex = 1;
        this.getCityFunc();
      } else {
        this.regionIndex = 0;
      }

      this.regionCity = "";
      this.cityId = -1;
      this.cityList = [];
      this.regionArea = "";
      this.areaList = [];
    },
    checkCity(city) {
      if (city) {
        this.regionCity = city.cityName;
        this.cityId = city.cityId;
        this.regionIndex = 2;
      } else {
        this.regionIndex = 1;
      }
      this.regionArea = "";
      this.areaList = [];
      this.getAreaFunc();
    },
    checkArea(area) {
      this.regionArea = area.areaName;
    },
    getRegionTitle(index) {
      var title = "请选择";
      if (index == 0) {
        if (this.regionProvince) {
          title = this.regionProvince;
        } else {
          title = title + "省";
        }
      }

      if (index == 1) {
        if (this.regionCity) {
          title = this.regionCity;
        } else if (this.regionIndex == 0) {
          title = "";
        } else {
          title = title + "市";
        }
      }
      if (index == 2) {
        if (this.regionArea) {
          title = this.regionArea;
        } else if (this.regionIndex == 2) {
          title = title + "区";
        } else {
          title = "";
        }
      }
      return title;
    },

    showRegion() {
      this.regionIndex = 0;
      this.regionProvince = "";
      this.regionCity = "";
      this.regionArea = "";
      this.provinceList = [];
      this.cityList = [];
      this.areaList = [];

      this.getProvinceFunc();
      this.$refs.popupRegion.show();
    },
    hideRegion() {
      this.$refs.popupRegion.hide();
    },
    getAddressDetailFunc() {
      getAddressDetail(this.id).then((res) => {
        if (res.code == 200) {
          this.formData = res.data;
          this.regionLabel = res.data.province + res.data.city + res.data.area;
        }
      });
    },

    handSubmit() {
      this.$refs.form.validate((err) => {
        if (!err) {
          if (this.id) {
            this.editAddressFunc(this.formData);
          } else {
            this.addAddressFunc(this.formData);
          }
        }
      });
    },
    handDelete() {
      this.$refs.alertDialog.open();
    },
    dialogConfirm() {
      deleteAddress(this.id).then((res) => {
        if (res.code == 200) {
          uni.navigateBack();
        }
      });
    },
    addAddressFunc(params) {
      addAddress(params).then((res) => {
        if (res.code == 200) {
          uni.navigateBack();
        }
      });
    },
    editAddressFunc(params) {
      editAddress(params).then((res) => {
        if (res.code == 200) {
          uni.navigateBack();
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
  padding: 0 60rpx;
  box-sizing: border-box;
  background-color: #ffffff;
}
.form-view {
  height: auto;
  width: 100%;
  padding-bottom: 40rpx;
}
// /deep/ .uni-forms-item.is-direction-left {
//   border-bottom: 1rpx solid rgba(128, 128, 128, 0.3);
// }
/deep/ .is-input-border {
  border: none;
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
.bottom-button-submit {
  width: 40%;
  height: $cust-button-base;
  background: #36d2ba;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  //   font-size: 24rpx;
  font-size: $uni-font-size-base;
}
.bottom-button-delete {
  width: 40%;
  height: $cust-button-base;
  background: #a12323;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  //   font-size: 24rpx;
  font-size: $uni-font-size-base;
}

.region-view {
  display: flex;
  align-items: center;
  position: relative;
  font-size: 14px;
  flex: 1;
  box-sizing: border-box;
  flex-direction: row;
}
.popupRegion-body {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  padding: 40rpx;
  .regionTitle {
    padding: 0 20rpx 20rpx 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 52rpx;
    span {
      font-weight: bold;
    }
    .close-btn {
      width: 80rpx;
      height: 100%;
      background-color: #36d2ba;
      border-radius: 6rpx;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1rpx solid gray;
    padding-bottom: 8rpx;
    .title-item {
      padding: 0 20rpx;
    }
  }
  .content {
    height: 500rpx;
    padding: 20rpx;
    .content-item {
      margin-bottom: 12rpx;
    }
  }
}
</style>
