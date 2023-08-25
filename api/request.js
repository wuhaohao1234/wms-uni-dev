import store from '../store/index'
// let baseUrl = "http://47.100.251.76:70/prod-api/";
// let baseUrl = "http://192.168.0.109:9090/";
let baseUrl = "https://unipay.topyuncang.com/prod-api/"
// let baseUrl = "http://hbsnsh.natappfree.cc/"
let token = "";

function service(options = {}) {
	store.state.token && (token = store.state.token)
	options.url = `${baseUrl}${options.url}`
	options.header = {
		// 'content-type': 'application/x-www-form-urlencoded',
		'Authorization': `${token}`
	}
	 console.log('token', options)
	return new Promise((resolved, rejected) => {
		options.success = res => {
			if (Number(res.data.code) == 200) {
				resolved(res.data)
			} else if (Number(res.data.code) == 401) {
				uni.setStorage({
					key: "userInfo",
					data: "",
				});
				uni.setStorage({
					key: "loginInfo",
					data: "",
				});
				uni.reLaunch({
					url: "/pages/login/login"
				})
			} else if (Number(res.data.code) == 500 && res.data.msg == "您还未跟店铺绑定，请根据好友分享进入") {
				uni.showToast({
					icon: 'none',
					duration: 1500,
					title: `${res.data.msg}`
				})
				uni.navigateTo({
					url: "/pages/notBound/notBound"
				});
			} else if (Number(res.data.code) == 412) {
				uni.showToast({
					icon: 'none',
					duration: 1000,
					title: `${res.data.msg}`
				})
				setTimeout(() => {
					resolved(res.data)
				}, 1000)

			} else {
				uni.showToast({
					icon: 'none',
					duration: 1500,
					title: `${res.data.msg}`
				})
				// resolved(res.data)
			}
		}

		options.fail = err => {
			rejected(err)
		}

		uni.request(options);
	})
}

export default service;
