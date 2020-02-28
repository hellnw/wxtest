//app.js
// AppID: wxda6886ea2aaddb03
// AppSecret: fec29e669ea032567b70878d0d696d0a
const WxValidate = require("./utils/wx-validate/WxValidate.js");//验证方法

App({
  globalData: {
    // Serverurl: "http://193.112.45.172:8080/wechat/",
    Serverurl: "http://192.168.244.1:8080/wechat/",
    Name: '',
    Sex: '',
    idCard: '',
    latitude: null,
    longitude: null,
    locationString: null,
    curaddr: null,
    mainslerid: '',
    devwidth: '',
    devheight: '',
  },
  wxapi: {
    api_upload: 'upload',//读取身份证号
    api_getStu: 'getStu', //获取数据
    api_getSaler: 'getSchNames', //获取学校数据
	  api_update: 'updateStu', //更新信息
    api_recharge: 'recharge', //发起支付
  },
  onLaunch: function() {
    var app = this;
    wx.getSystemInfo({
      success: function(res) {
        app.globalData.devwidth = res.windowWidth;
        app.globalData.devheight = res.windowHeight;

      }
    })
    const updateManager = wx.getUpdateManager(); // 获取更新管理器对象
    updateManager.onCheckForUpdate(function(res) {
      // console.log(res)    检测更新结果
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function() {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，点击确定重新启动',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                updateManager.applyUpdate();
              }
            }
          })
        })
        updateManager.onUpdateFailed(function() {
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但是下载失败，请检查网络设置',
            showCancel: false
          })
        })
      }
    });
  },

  onLoad: function(options) {
    
  },
  getToken: function() {
    var app = this;
    var url = app.globalData.Serverurl + app.wxapi.api_getData;
    wx.request({
      url: url,
      method: 'POST',
      success: function(res) {
        console.log(res.data);
          var resultdata = res.data.data;
          //app.globalData.idCard = resultdata.idCard;
          //console.log(resultdata.idCard)
          //wx.setStorageSync("Name", resultdata.idCard);
      },
      fail: function(res) {
        //console.log(res);
        wx.hideToast();
        wx.showToast({
          title: '调用接口失败',
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  WxValidate: WxValidate//表单验证方法
})