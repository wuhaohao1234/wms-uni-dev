<template>
  <view>
    <web-view
      :webview-styles="webviewStyles"
      src="https://unipay.topyuncang.com/privacy"
    ></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      webviewStyles: {
        progress: {
          color: "#FF3333",
        },
      },
    };
  },
  methods: {},
};
</script>

<style>
</style>
