<template>
	<view class="page-body">
		<view class="title-view">账号登录/微信登录</view>

		<view class="form-view">
			<uni-forms ref="form" :modelValue="formData" :rules="rules">
				<uni-forms-item label="手机号" required name="phoneNum">
					<input v-model="formData.phoneNum" placeholder="请输入手机号" type="number" maxlength="11" />
				</uni-forms-item>
				<uni-forms-item label="密码" required name="password">
					<input v-model="formData.password" placeholder="请输入密码" type="password" />
				</uni-forms-item>
			</uni-forms>
		</view>
		<view class="btn-box">
			<view style="width: 100%"><button class="button" @click="bindSubmit">登录</button>

				<view class="sub-text">登录表示您已阅读并同意
					<view class="link-text" @click="jumpProxy">用户协议、隐私政策</view>
				</view>
			</view>

			<button class="button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
				微信一键授权登录
			</button>
		</view>
	</view>
</template>

<script>
	import {
		login,
		selUserInfo
	} from "../../api/api.js";
	import {
		mapState,
		mapMutations,
		mapActions,
		mapGetters
	} from "vuex";
	export default {
		props: ["shopCode","spuId","currentMain"],
		data() {
			return {
				title: "",
				formData: {
					phoneNum: "",
					password: "",
				},
				rules: {
					phoneNum: {
						rules: [{
								required: true,
								errorMessage: "手机号不能为空",
							},

							{
								validateFunction: function(rule, value, data, callback) {
									if (value.length != 11) {
										callback("手机号格式不正确");
									}
									return true;
								},
							},
						],
					},
					password: {
						rules: [{
							required: true,
							errorMessage: "密码不能为空",
						}, ],
					},
				},
				providerList: [],
			};
		},
		onReady() {
			this.$refs.form.setRules(this.rules);
		},

		onShow() {
			var _this = this;
			uni.showLoading();

			console.log("shopCode", this.shopCode);

			var loginInfo, userInfo;
			try {
				loginInfo = uni.getStorageSync("loginInfo");
				if (loginInfo) {
					_this.setLogin(loginInfo);
					_this.setToken(loginInfo.token);
				}
			} catch (e) {}
			try {
				userInfo = uni.getStorageSync("userInfo");
				if (userInfo) {
					_this.setUserInfo(userInfo);
				}
			} catch (e) {}
			uni.hideLoading();

			if (loginInfo && userInfo) {
				if(this.spuId&&this.currentMain&&this.shopCode){
					uni.reLaunch({
						url: "/pages/commodity/commodityDetail/commodityDetail?shopCode="+this.shopCode+"&spuId="+this.spuId+"&currentMain=" +this.currentMain
					});
				}else{
					uni.reLaunch({
						url: "/pages/home/home"
					});
				}
				
			}
		},

		methods: {
			...mapMutations(["setLogin", "setToken", "setUserInfo"]),
			...mapGetters(["getUserInfo"]),
			jumpProxy() { 
				uni.navigateTo({
					url: "/pages/login/proxy/proxy",
				});
			},
			getPhoneNumber(e) {
				var _this = this;
				var phoneCode = "";
				var openCode = "";
				if (
					e.detail.errMsg == "getPhoneNumber:fail user deny" ||
					e.detail.errMsg == "getPhoneNumber:fail user cancel bind"
				) {
					this.Toast({
						title: "授权失败",
						icon: "none"
					});
				} else {
					phoneCode = e.detail.code;
					uni.login({
						provider: "weixin",
						success: function(loginRes) {
							openCode = loginRes.code;
							console.log('openCode',openCode)
							 
							if (!openCode) {
								return;
							}
							var params = {};
							if (!!_this.shopCode) {
								params = {
									loginType: "3",
									wxLoginType: "2",
									phoneCode,
									openCode,
									shopCode: _this.shopCode,
								};
							} else {
								params = {
									phoneCode,
									openCode,
									loginType: "3",
									wxLoginType: "1",
								};
							}

							_this.handleLogin(params);
						},
					});
				}
			},
			bindSubmit() {
				var _this = this;
				this.$refs.form.validate((err) => {
					if (!err) {
						var params = {
							phoneNum: this.formData.phoneNum,
							password: this.formData.password,
							loginType: "1",
							wxLoginType: "2",
						}
						if (!!_this.shopCode) {
							params.shopCode = _this.shopCode
						}
						console.log('params----',params)
						this.handleLogin(params);
					}
				});
			},

			handleLogin({
				phoneNum,
				phoneCode,
				openCode,
				loginType,
				wxLoginType,
				password,
				shopCode,
			}) {
				var _this = this;
				var params = {
					phoneNum,
					loginType,
					wxLoginType,
					phoneCode,
					openCode,
					password,
					shopCode,
				};
				uni.showLoading({
					title: "加载中"
				});
				login(params).then((res) => {
					console.log("res", res);
					if (res.code == 200) {
						_this.setToken(res.data.token);
						uni.setStorage({
							key: "loginInfo",
							data: res.data,
						});
						_this.setLogin(res.data);

						res.data.phoneNum = phoneNum;
						uni.hideLoading();
						uni.showLoading({
							title: "加载中"
						});
						selUserInfo().then((result) => {
							if (result.code == 200) {
								uni.setStorage({
									key: "userInfo",
									data: result.data,
								});
								_this.setUserInfo(result.data);
							}
						});
						 
						if(this.spuId&&this.currentMain&&this.shopCode){
							uni.reLaunch({
								url: "/pages/commodity/commodityDetail/commodityDetail?shopCode="+this.shopCode+"&spuId="+this.spuId+"&currentMain=" +this.currentMain
							});
						}else{
							uni.reLaunch({
								url: "/pages/home/home"
							});
						}
					}
				});
			},

			Toast(data, duration = 1000) {
				uni.showToast(
					Object.assign({}, data, {
						duration,
					})
				);
			},
		},
	};
</script>

<style>
	.page-body {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		padding: 0 60rpx;
		box-sizing: border-box;
		background-color: #ffffff;
	}

	.title-view {
		width: 100%;
		height: 300rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 42rpx;
		font-weight: bold;
	}

	.form-view {
		height: auto;
		width: 100%;
		padding-bottom: 40rpx;
	}

	.btn-box {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: 300rpx;
		text-align: center;
	}

	.button {
		background-color: black;
		color: #ffffff;
		width: 100%;
		height: 80rpx;
		border-radius: 40rpx;
		margin-bottom: 8rpx;
		font-size: 32rpx;
	}

	.sub-text {
		display: flex;
		justify-content: center;
		font-size: 24rpx;
		color: gray;
		margin-top: 20rpx;
	}

	.link-text {
		font-size: 24rpx;
		color: #000;
	}
</style>
