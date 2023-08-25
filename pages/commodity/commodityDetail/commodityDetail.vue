<template>
	<view class="page-body">
		<view class="top-image-view">
			<swiper class="container-tabs__swiper" :current="swiperCurrent">
				<swiper-item v-for="(outItem, outIndex) in detail.swiperList" :key="outIndex">
					<image class="swiper-img" :src="outItem" alt="" mode="aspectFit" />
				</swiper-item>
			</swiper>
		</view>
		<view class="content">
			<view class="title-text">{{
        detail.commodityName ? detail.commodityName : ""
      }}</view>

			<uni-collapse v-model="collapse" v-if="detail">
				<uni-collapse-item title="商品详情">
					<view class="sub-title">
						<view class="sub-text">
							<view style="width: 100rpx; flex-shrink: ">品牌</view>
							{{ detail.brandName ? detail.brandName : "" }}
						</view>
						<view class="sub-text">
							<view style="width: 100rpx">品类</view>
							{{ detail.categoryName ? detail.categoryName : "" }}
						</view>
						<view class="sub-text">
							<view style="width: 100rpx">颜色</view>
							{{ detail.color ? detail.color : "" }}
						</view>
						<view class="sub-text">
							<view style="width: 100rpx">货号</view>
							{{ detail.stockCode ? detail.stockCode : "" }}
						</view>
						<view class="sub-text" v-if="showSize">
							<view style="width: 100rpx">尺码</view>
							{{ showSize }}
						</view>
					</view>
					<image style="width: 100%" mode="aspectFit" v-for="(outItem, outIndex) in detail.swiperList"
						:key="outIndex" :src="outItem" alt=""></image>

					<rich-text v-if="detail.detail" :nodes="detail.detail"></rich-text>
				</uni-collapse-item>
			</uni-collapse>
		</view>
		<view class="bottom-notice">
			<checkbox-group @change="readChange">
				<checkbox value="hasRead" :checked="hasRead" />
			</checkbox-group>
			<view @click="jumpNotice">选中代表您已阅读跨境消费者告知书</view>
		</view>
		<view class="bottom-box">
			<image v-if="canBuy" class="button button-wechat" @click="openPopupWechat" src="/static/image/wechat.svg"
				alt=""></image>

			<button class="button button-share" open-type="share">分享</button>

			<button v-if="canBuy" class="button button-buy" @click="handlePay">
				立即购买
			</button>
		</view>
		<wyb-popup ref="popup" type="bottom" radius="6" v-if="currentMain == 0">
			<view class="popup-body">
				<view class="commodity-view" v-if="purchaseDetails.length != 0">
					<image class="commdoty-img" :src="purchaseDetails[purchaseIndex].swiperList[0]" alt=""
						mode="aspectFit"></image>
					<view class="info-box">
						<view class="info-box-title">
							<span
								style="font-size: 32rpx; font-weight: bold; margin-right: 40rpx">¥{{ purchaseDetails[purchaseIndex].bazaarPrice }}</span>
							<span v-if="purchaseDetails[purchaseIndex].depotName"
								style="color: grey; margin-right: 30rpx">{{ purchaseDetails[purchaseIndex].depotName }}</span>
							<span style="color: grey">预计{{
                  getDate(purchaseDetails[purchaseIndex].expiration)
                }}送达</span>
						</view>
						<view>{{ purchaseDetails[purchaseIndex].commodityName }}</view>
					</view>
				</view>
				<view class="scroll-view">
					<view class="size-box" v-for="(item, index) in purchaseDetails" :key="index">
						<view @click="this.purchaseIndex = index" class="size-item"
							:class="{ 'size-item-checked': purchaseIndex == index }">
							<span v-if="item.size" style="font-size: 32rpx; font-weight: bold;padding:0 2px">{{ item.size }}{{ item.specification!=null?'/'+item.specification:'' }}</span>
							<span style="color: grey">¥{{ item.bazaarPrice }} </span>
						</view>
					</view>
				</view>

				<view class="quantity-view">
					<span>购买数量</span>
					<span style="font-weight: bold">×1</span>
				</view>
				<button class="sub-button" @click="handleJump">立即购买</button>
			</view>
		</wyb-popup>
		<wyb-popup ref="popup" type="bottom" radius="6" v-else>
			<view class="popup-body">
				<view class="commodity-view" v-if="purchaseDetails.length != 0">
					<image class="commdoty-img" :src="purchaseDetails[purchaseIndex].swiperList[0]" alt=""
						mode="aspectFit"></image>
					<view class="info-box">
						<view class="info-box-title">
							<span
								style="font-size: 32rpx; font-weight: bold; margin-right: 40rpx">¥{{ purchaseDetails[purchaseIndex].price }}</span>
							<span v-if="purchaseDetails[purchaseIndex].depotName"
								style="color: grey; margin-right: 30rpx">{{ purchaseDetails[purchaseIndex].depotName }}</span>
							<span style="color: grey">预计{{
                  getDate(purchaseDetails[purchaseIndex].expiration)
                }}送达</span>
						</view>
						<view>{{ detail.commodityName }}</view>
					</view>
				</view>
				<view class="scroll-view">
					<view class="size-box" v-for="(item, index) in purchaseDetails" :key="index">
						<view @click="this.purchaseIndex = index" class="size-item"
							:class="{ 'size-item-checked': purchaseIndex == index }">
							<span style="font-size: 32rpx; font-weight: bold">{{
                item.size
              }}</span>
						</view>
					</view>
				</view>

				<view class="quantity-view">
					<span>购买数量</span>
					<span style="font-weight: bold">×1</span>
				</view>

				<!-- 瑕疵件 -->
				<view v-if="currentMain == 1" class="quantity-view">
					<span>瑕疵等级</span>
					<span style="font-weight: bold">N级别</span>
				</view>
				<!-- 瑕疵件 -->
				<view v-if="currentMain == 1" class="defect-view">
					<span style="flex-shrink: 0">商品照片</span>
					<view style="text-align: right">
						<image v-for="(imageItem, imageIndex) in purchaseDetails" :key="imageIndex" class="defect-image"
							:src="imageItem.swiperList[imageIndex]" alt="" mode="aspectFit"
							@click="showBig(imageItem.swiperList[imageIndex])"></image>
					</view>
				</view>
				<button class="sub-button" @click="handleJump">立即购买</button>
			</view>
		</wyb-popup>

		<view class="big-image" v-if="showBigImage" @click="closeBig">
			<image v-on:click.stop class="image" :src="showBigUrl" alt="" mode="aspectFit"></image>
		</view>

		<wyb-popup ref="popupWechat" type="bottom" radius="6" height="100">
			<view class="popupwechat-body">
				<span style="flex-shrink: 0">请联系商家微信:</span>
				<view style="padding: 40rpx">
					<span style="font-weight: bold">{{ wechatCode!=null?wechatCode:"暂无" }}</span>
					<span v-if="!!wechatCode" @click="handleClip" style="
              margin-left: 20rpx;
              border: 1rpx solid black;
              border-radius: 6rpx;
              padding: 2rpx;
            ">复制</span>
				</view>
			</view>
		</wyb-popup>
	</view>
</template>

<script>
	import {
		getCommodityDetail,
		getPurchaseDetails,
		getSizeDetails,
		getDefectList,
		getShopList,
		changeShop,
	} from "../.././../api/api.js";
	import {
		mapState,
		mapMutations,
		mapActions,
		mapGetters
	} from "vuex";

	export default {
		props: ["spuId", "currentMain", "shopCode"],
		data() {
			return {
				detail: {},
				swiperCurrent: 0,
				collapse: ["0"],
				purchaseDetails: [],
				purchaseIndex: 0,
				canBuy: true,
				showBigUrl: "",
				showBigImage: false,
				wechatCode: "",
				showWechat: true,
				showSize: "",
				hasRead: false,
			};
		},
		computed: {
			...mapState(["loginInfo"]),
		},
		created() {},
		onLoad: function(options) {
			console.log("this.loginInfo.userCode", this.loginInfo.userCode);
			console.log("options", options);
			if (!this.loginInfo.userCode) {
				uni.navigateTo({
					url: "/pages/login/login?shopCode=" + options.shopCode + "&currentMain=" + options
						.currentMain + "&spuId=" + options.spuId,
				});
			} else {
				console.log("loginInfo", this.loginInfo);
				if (this.loginInfo.shopCode == this.loginInfo.userCode) {
					this.canBuy = false;
				}
				this.getShopListFunc(options.shopCode);
			}
		},
		onShareAppMessage() {
			const promise = new Promise((resolve) => {
				setTimeout(() => {
					resolve({
						title: this.detail.commodityName,
					});
				}, 100);
			});

			return {
				title: this.detail.commodityName,
				path: "/pages/commodity/commodityDetail?shopCode=" + this.loginInfo.shopCode + "&currentMain=" + this
					.currentMain + "&spuId=" + this.spuId,
				promise
			};
		},
		onShareTimeline() {
			return {
				title: this.detail.commodityName,
				query: "shopCode=" + this.loginInfo.shopCode + "&spuId=" + this.spuId + "&currentMain=" + this.currentMain,
				imageUrl: this.detail.swiperList[0]
			};
		},
		methods: {
			...mapMutations(["setLogin", "setToken", "setUserInfo"]),
			...mapMutations(["setLogout"]),

			readChange(e) {
				this.hasRead = e.detail.value.length != 0;
			},
			jumpNotice() {
				console.log("aaaaa");
				uni.navigateTo({
					url: "/pages/login/proxy/notice",
				});
			},
			handlePay() {
				if (!this.hasRead) {
					uni.showToast({
						icon: "none",
						duration: 1500,
						title: `请先阅读并勾选跨境消费者告知书`,
					});
					return;
				}
				if (this.currentMain == 0) {
					this.getPurchaseDetailsFunc();
				} else {
					this.getSizeDetailFunc();
				}
			},
			showBig(url) {
				this.showBigUrl = url;
				this.showBigImage = true;
			},
			handleClip() {
				uni.setClipboardData({
					data: this.wechatCode,
					success: function() {
						console.log("success");
					},
				});
			},
			closeBig() {
				console.log("11111");
				this.showBigImage = false;
				this.showBigUrl = "";
			},
			getDate(value) {
				var label = "3-5天";
				if (value == 1) label = "2周内";
				if (value == 2) label = "1个月内";
				return label;
			},
			getPurchaseDetailsFunc() {
				uni.showLoading();
				getPurchaseDetails({
					spuId: this.spuId
				}).then((res) => {
					uni.hideLoading();
					if (res.code == 200) {
						res.data.forEach((item) => {
							item.swiperList = item.picturePath.split(";");
						});
						this.purchaseDetails = res.data;
						console.log("this.purchaseDetails", this.purchaseDetails);
						this.openPopup();
					}
				});
			},
			getSizeDetailFunc() {
				uni.showLoading();
				getSizeDetails({
					spuId: this.spuId
				}).then((res) => {
					uni.hideLoading();
					if (res.code == 200) {
						this.sizeList = res.data;
						this.getDefectListFunc(this.sizeList[0].storeIdStr);
						this.openPopup();
					}
				});
			},

			getDefectListFunc(storeIdStr) {
				uni.showLoading();
				getDefectList({
					spuId: this.spuId,
					storeIdStr
				}).then((res) => {
					uni.hideLoading();
					if (res.code == 200) {
						res.rows.forEach((item) => {
							item.swiperList = item.picturePath.split(";");
						});
						this.purchaseDetails = res.rows;
						this.openPopup();
					}
				});
			},
			openPopup() {
				this.$refs.popup.show();
			},
			openPopupWechat() {
				this.$refs.popupWechat.show();
			},
			popupChange(e) {
				console.log("popupChange", e);
			},
			getDetail() {
				uni.showLoading();
				getCommodityDetail({
					spuId: this.spuId
				}).then((res) => {
					console.log("re", res);
					uni.hideLoading();
					if (res.code == 200) {
						this.detail = res.data;
						if (this.detail.detail) {
							this.detail.detail = this.detail.detail.replace(
								/\<img/g,
								"<img style='width:100%;'"
							);
							this.detail.skuList.forEach((item) => {
								this.showSize = this.showSize ?
									this.showSize + "," + item.size :
									item.size;
							});
							this.showSize;
						}

						this.detail.swiperList = res.data.picturePath.split(";");
					}
				});
			},
			handleJump() {
				var targetData = {
					commodityDetail: this.detail,
					purchaseDetail: this.purchaseDetails[this.purchaseIndex],
					currentMain: this.currentMain,
				};
				var newData = JSON.stringify(targetData);
				newData = newData.replace(/%/g, "%25");
				uni.navigateTo({
					url: "/pages/order/orderDetail/orderDetail?targetData=" +
						encodeURIComponent(newData),
				});
			},
			getShopListFunc(shopCode) {
				// { pageNum: 1, pageSize: 9999 }
				getShopList().then((res) => {
					if (res.code == 200) {
						this.shopList = res.rows;
						var shopIndex = -1;
						this.shopList.forEach((shop, index) => {
							if (shop.shopCode == shopCode) {
								shopIndex = index;
							}
						});
						if (shopIndex == -1) {
							this.logout();
							uni.navigateTo({
								url: "/pages/login/login?shopCode=" + shopCode,
							});
						} else {
							this.wechatCode = this.shopList[shopIndex].weChatAccount;

							if (this.loginInfo.shopCode != shopCode) {
								this.changeShopFunc(this.shopList[shopIndex].shopCode);
							} else {
								this.getDetail();
							}
						}
					}
				});
			},
			changeShopFunc(shopCode) {
				var _this = this;
				changeShop({
					shopCode: shopCode
				}).then((res) => {
					if (res.code == 200) {
						_this.setToken(res.data.token);
						uni.setStorage({
							key: "loginInfo",
							data: res.data,
						});
						_this.setLogin(res.data);

						uni.hideLoading();
						this.getDetail();
						if (shopCode == this.loginInfo.userCode) {
							this.canBuy = false;
						} else {
							this.canBuy = true;
						}
						// uni.reLaunch({ url: "/pages/home/home" });
					}
				});
			},
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
		background-color: #fff;
		position: relative;
		overflow-y: scroll;
		padding-bottom: 120rpx;
	}

	.top-image-view {
		height: 400rpx;
		width: 100%;
		background-color: #fff;

		.container-tabs__swiper {
			height: 100%;

			.swiper-img {
				width: 100%;
				height: 100%;
			}
		}
	}

	.content {
		padding: 20rpx 40rpx;

		.title-text {
			font-size: 32rpx;
			font-weight: bold;
		}

		.sub-title {
			display: flex;
			// flex-wrap: wrap;
			flex-direction: column;

			.sub-text {
				position: relative;
				width: 100%;
				margin-bottom: 20rpx;
				padding-bottom: 20rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size: 28rpx;
			}

			.sub-text::after {
				content: "";
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 1rpx;
				background: rgba(182, 182, 182, 0.2);
			}
		}

		// .sub-title::after {
		//   content: "";
		//   width: 100%;
		//   height: 1rpx;
		//   background: rgba(182, 182, 182, 0.2);
		// }
	}

	/deep/ .uni-collapse-item__title-box {
		padding: 0;
		font-weight: bold;
	}

	/deep/ progress,
	checkbox-group {
		width: auto;
	}

	.bottom-notice {
		position: fixed;
		bottom: 120rpx;
		background-color: #fff;
		height: 60rpx;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		align-items: center;
		padding-left: 20rpx;
		z-index: 1;
	}

	.bottom-box {
		position: fixed;
		bottom: 0;
		background-color: #fff;
		height: 120rpx;
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		align-items: center;
		padding-top: 20rpx;

		.button {
			width: 40%;
			height: 68rpx;
			border-radius: 34rpx;
			padding: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
		}

		.button-share {
			border: 1rpx solid black;
		}

		.button-buy {
			background: #36d2ba;
			color: #fff;
		}

		.button-wechat {
			margin-left: 12rpx;
			width: 58rpx;
			height: 58rpx;
			// background-image: url("/static/image/wechat.svg");
			// background-size: 100% 100%;
			// background-repeat: no-repeat;
		}
	}

	.popupwechat-body {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
		padding: 40rpx;
	}

	.popup-body {
		height: auto;
		width: 100%;
		background: #fff;
		padding: 20rpx 20rpx 40rpx 20rpx;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		position: fixed;
		bottom: 0;
		box-sizing: border-box;

		.commodity-view {
			display: flex;

			.commdoty-img {
				width: 200rpx;
				height: 200rpx;
				flex-shrink: 0;
			}

			.info-box {
				padding: 20rpx 20rpx 20rpx 4rpx;
				display: flex;
				flex-direction: column;
				align-items: flex-start;

				.info-box-title {
					display: flex;
					flex-direction: row;
					margin-bottom: 10rpx;
				}
			}
		}

		.scroll-view {
			box-sizing: border-box;
			overflow-x: scroll;
			height: 200rpx;
			width: 100%;
			display: flex;
			align-items: center;
			border-top: 1rpx solid gainsboro;
			border-bottom: 1rpx solid gainsboro;
		}

		.size-box {
			display: flex;

			margin: 0 20rpx;

			.size-item {
				flex-shrink: 0;
				width: 140rpx;
				height: 140rpx;
				margin-right: 4rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;
				border: 1rpx solid gainsboro;
			}

			.size-item-checked {
				border: 1rpx solid #36d2ba;
			}
		}

		.quantity-view {
			margin: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.defect-view {
			margin: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
		}

		.sub-button {
			margin: 40rpx 60rpx;
			background: #36d2ba;
			color: #fff;
			height: 68rpx;
			border-radius: 34rpx;
			padding: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
		}

		.defect-image {
			width: 120rpx;
			height: 120rpx;
		}
	}

	.big-image {
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 99999;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, 0.6);

		.image {
			width: 100%;
		}
	}
</style>
