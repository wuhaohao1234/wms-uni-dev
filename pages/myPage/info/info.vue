<template>
  <view class="page-body">
    <uni-forms
      ref="form"
      :label-width="120"
      :modelValue="formData"
      :rules="rules"
    >
      <uni-forms-item label="头像" name="avatar">
        <image
          @click="chooseAvatar"
          class="avatar"
          :src="
            formData.avatar
              ? formData.avatar
              : '../../../static/icons/icon_no_avatar.png'
          "
          alt=""
          mode="aspectFill"
        ></image>
      </uni-forms-item>

      <uni-forms-item label="手机号" name="phoneNum">
        <input disabled v-model="formData.phoneNum" />
      </uni-forms-item>

      <uni-forms-item label="昵称" name="nickName">
        <input v-model="formData.nickName" />
      </uni-forms-item>

      <uni-forms-item label="性别" name="sex">
        <span @click="openPopup">{{
          formData.sex == 0 ? "女" : formData.sex
        }}</span>
      </uni-forms-item>
      <uni-forms-item label="微信号" name="weChatAccount">
        <input v-model="formData.weChatAccount" />
      </uni-forms-item>
    </uni-forms>
    <view class="bottom-view">
      <button class="bottom-btn" @click="handleSubmit">保存</button>
    </view>

    <wyb-popup ref="popup" type="bottom" radius="6">
      <view class="popup-body">
        <view class="popup-item" @click="setSex('男')">男</view>
        <view class="popup-item" @click="setSex('女')">女</view>
        <view class="popup-item" @click="onDateCancel">取消</view>
      </view>
    </wyb-popup>
  </view>
</template>

<script>
import { setUserInfo, getAliossModel } from "../../../api/api.js";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      formData: {
        nickName: "",
        phoneNum: "",
        avatar: null,
        sex: "",
        weChatAccount: "",
      },
      rules: {
        nickName: {
          rules: [
            {
              required: true,
              errorMessage: "昵称不能为空",
            },
          ],
        },
      },
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  onReady() {
    // 需要在onReady中设置规则
    this.$refs.form.setRules(this.rules);
  },
  onLoad() {
    console.log("this.userInfo", this.userInfo);
    this.formData = this.userInfo;
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    openPopup() {
      this.$refs.popup.show();
    },
    closePopup() {
      this.$refs.popup.hide();
    },
    setSex(value) {
      this.formData.sex = value;
      this.$refs.popup.hide();
    },

    chooseAvatar() {
      uni.chooseImage({
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          uni.showLoading();
          getAliossModel({ dir: "userIcon" }).then((res) => {
            console.log("res", res);
            var model = res.data;
            var chuo =
              Date.now() +
              tempFilePaths[0].substring(tempFilePaths[0].lastIndexOf("."));
            console.log("chuo", chuo);
            uni.uploadFile({
              url: model.host, //仅为示例，非真实的接口地址
              filePath: tempFilePaths[0],
              name: "file",
              formData: {
                chunk: "0",
                OSSAccessKeyId: model.accessid,
                policy: model.policy,
                Signature: model.signature,
                Expires: model.expire,
                key: model.dir + chuo,
                success_action_status: "200",
                "Access-Control-Allow-Origin": "*",
              },
              success: (uploadFileRes) => {
                if (uploadFileRes.errMsg == "uploadFile:ok") {
                  var url = model.host + "/" + model.dir + chuo;
                  this.formData.avatar = url;
                } else {
                  uni.showToast({ title: "上传图片失败", icon: "error" });
                }
              },
              complete: () => {
                uni.hideLoading();
              },
            });
          });
        },
      });
    },
    handleSubmit() {
      this.$refs.form.validate((err) => {
        if (!err) {
          var params = {
            nickName: this.formData.nickName,
            sex: this.formData.sex,
            avatar: this.formData.avatar,
            weChatAccount: this.formData.weChatAccount,
          };
          setUserInfo(params).then((res) => {
            if (res.code == 200) {
              uni.setStorage({
                key: "userInfo",
                data: this.formData,
              });
              this.setUserInfo(this.formData);
              uni.navigateBack();
            }
          });
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
  padding: 0 40rpx;
  .avatar {
    width: 120rpx;
    height: 120rpx;
    background: rgb(218, 218, 218);
    border-radius: 50%;
  }

  .popup-body {
    height: auto;
    width: 100%;
    background: #fff;
    padding: 0 0 40rpx 0;
    border-top-left-radius: 30rpx;
    border-top-right-radius: 30rpx;
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    .popup-item {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40rpx;
      border-bottom: 1rpx solid rgba(128, 128, 128, 0.4);
    }
  }
  .bottom-view {
    position: fixed;
    bottom: 80rpx;
    width: calc(100% - 80rpx);
    .bottom-btn {
      height: 72rpx;
      color: #fff;
      background-color: black;
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28rpx;
    }
    .disable-btn {
      background-color: grey;
    }
  }
}
/deep/ .uni-forms-item {
  border-bottom: 1rpx solid gray;
  padding-bottom: 20rpx;
}
/deep/ .uni-forms-item__content {
  justify-content: flex-end;
  text-align: end;
}
/deep/ .uni-forms-item__error {
  right: 0;
}
</style>
