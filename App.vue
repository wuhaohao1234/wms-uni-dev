<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
    // var _this = this;
    // uni.getStorage({
    //   key: "userInfo",
    //   success: function (res) {
    //     console.log("res1112221", res.data);
    //     if (!!res.data) {
    //       _this.setLogin(res.data);
    //       _this.setToken(res.data.token);
    //       //   _this.setOpenid(res.data.openId);
    //     } else {
    //       uni.reLaunch({ url: "/pages/login/login" });
    //     }
    //   },
    // });
  },
  onHide: function () {
    console.log("App Hide");
  },
  methods: {
    ...mapMutations(["setLogin", "setToken", "setOpenid"]),
    ...mapGetters(["getUserInfo"]),
  },
};
</script>

<style>
/*每个页面公共css */
@import "./common/uni.css";
@import "@/static/customicons.css";

/* H5 兼容 pc 所需 */
/* #ifdef H5 */
@media screen and (min-width: 768px) {
  body {
    overflow-y: scroll;
  }
}

/* 顶栏通栏样式 */
/* .uni-top-window {
		    left: 0;
		    right: 0;
		} */

uni-page-body {
  background-color: #f5f5f5 !important;
  min-height: 100% !important;
  height: auto !important;
}

.uni-top-window uni-tabbar .uni-tabbar {
  background-color: #fff !important;
}

.uni-app--showleftwindow .hideOnPc {
  display: none !important;
}

/* #endif */

/* 以下样式用于 hello uni-app 演示所需 */
page {
  background-color: #efeff4;
  height: 100%;
  font-size: 28rpx;
  /* line-height: 1.8; */
}

.fix-pc-padding {
  padding: 0 50px;
}

.uni-header-logo {
  padding: 30rpx;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10rpx;
}

.uni-header-image {
  width: 100px;
  height: 100px;
}

.uni-hello-text {
  color: #7a7e83;
}

.uni-hello-addfile {
  text-align: center;
  line-height: 300rpx;
  background: #fff;
  padding: 50rpx;
  margin-top: 10px;
  font-size: 38rpx;
  color: #808080;
}
</style>
