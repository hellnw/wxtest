var app = getApp();
Page({
  data: {
    tempFilePaths: '../../image/timg.jpg',

    name: '姓名',
    sex: '性别',
    sex_val: '',
    id: '身份证号码',
    id_val: ''
  },
  onLoad: function(e) {
    
  },

  //相册中选择图像向服务器发送数据 可选：拍照
  choose_photo: function() {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        _this.setData({
          //返回的是文件列表 如果是一张的话 要取第一张
          tempFilePaths: res.tempFilePaths[0]
        });
        _this.show_msg('正在上传', 'loading');
        _this.up_load_photo();
      }
    });
  },

  //显示提示信息（自动消失）
  show_msg: function(show_str, show_icon='none'){
    wx.showToast({
      title: show_str,
      icon: show_icon,
      mask: true,
      duration: 1200
    })
  },
  show_model: function(show_str, status_code){
    wx.showModal({
      title: show_str,
      content: '请重新拍摄',
    })
  },
  
  //向服务器传送图像数据
  up_load_photo: function() {
    var _this = this;
    wx.uploadFile({
      url: app.globalData.Serverurl + app.wxapi.api_upload,
      filePath: _this.data.tempFilePaths,
      name: 'file',
      method: 'POST',
      // 返回状态码
      // 0: 识别成功
      // 1: 文字定位失败
      // 2: 文字识别失败
      // 3: 图片读取失败
      // 4: 图像路径错误
      // 5: 程序异常
      // 6: 初始化失败
      success: function (res) {
        var data = res.data;
        var json = JSON.parse(data);
        
        if(json.data.code == 200) {
          app.globalData.idCard = json.data.idCard;
          app.globalData.Name = json.data.name;
          app.globalData.Sex = json.data.sex;
          console.log('idCard', app.globalData.idCard);
          console.log('Name', app.globalData.Name);
          console.log('Sex', app.globalData.Sex);
        } else {
          _this.show_msg('识别失败');
        }
      },
      fail: function (res) {
        _this.show_msg('识别失败,error');
      }
    });
  },
  goadd: function () {
    /*if (!app.globalData.idCard) {
      this.show_msg('未识别到身份证信息，请上传身份证背面照片');
      return;
    }
    wx.navigateTo({
      url: '../../pages/form/form',
    })*/
    wx.navigateTo({
      url: '../../pages/formtest/formtest?id=1',
    })
  },
})