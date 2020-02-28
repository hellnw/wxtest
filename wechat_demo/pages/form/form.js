// pages/form/form.js
var app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		items: [{
				name: '0',
				value: '男',
				checked: 'true'
			},
			{
				name: '1',
				value: '女'
			},
		],
    EduLevelArr: ['初中', '高中'],
    BusinessScope: ['普通高校', '民办高校'],

		BusinessScopeidx: '',
    EduLevelIndex: '',
		StuName: '',
    IdCard: '',
    StuNumber: '',
		Linkman: '',
		LinkTel: '',
    ReceivePhone: '',
		Address: '',
		Commenttxt: '',
		IsMain: 0,
		SalerId: '',
		SalerName: '请选择',
    param:'',
    tempFilePaths:'../../common/images/pheader.png'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
    var that = this;
    var url = app.globalData.Serverurl + app.wxapi.api_getStu;
    wx.request({
      url: url,
      method: 'POST',
      data: { idCard: app.globalData.idCard},
      success: function (res) {
        var resultdata = res.data.data.stu;
        console.log(resultdata);
        
        var eduLevelData = res.data.data.eduLevel;
        if(eduLevelData) {
          var arr = [];
          for(var i=0; i<eduLevelData.length; i++) {
            arr.push(eduLevelData[i].name);
          }
          that.data.EduLevelArr.splice(0);
          that.setData({ EduLevelArr: arr });
        }
        var schTypeData = res.data.data.schType;
        if(schTypeData) {
          var arr = [];
          for (var i = 0; i < schTypeData.length; i++) {
            arr.push(schTypeData[i].name);
          }
          that.data.BusinessScope.splice(0);
          that.setData({ BusinessScope: arr});
        }
        if(resultdata) {
          //默认选中
          that.data.items[resultdata.sex].checked = "true"

          that.setData({
            items: that.data.items,
            IsMain: resultdata.sex,
            SalerId: resultdata.schId,
            BusinessScopeidx: resultdata.universityType,
            EduLevelIndex: resultdata.eduLevel,
            SalerName: resultdata.schName != null ? resultdata.schName : '请选择',
            Address: resultdata.address,
            StuName: resultdata.stuName,
            StuNumber: resultdata.stuNumber,
            IdCard: resultdata.idCard,
            LinkTel: resultdata.mobile,
            Linkman: resultdata.linkMan,
            ReceivePhone: resultdata.receivePhone,
            Commenttxt: resultdata.comment,
            tempFilePaths: resultdata.images ? resultdata.images : '../../common/images/pheader.png',
            param: resultdata.images,
          });
        }
      },
      fail: function (res) {
        //console.log(res);
        wx.hideToast();
        wx.showToast({
          title: '调用接口失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
    //OCR识别出的结果最高优先级赋值
    if (app.globalData.idCard) {
      var id_card_sex = app.globalData.Sex == '男' ? '0' : '1';
      that.data.items[id_card_sex].checked = "true";
      that.setData({
        items: that.data.items,
        StuName: app.globalData.Name,
        IdCard: app.globalData.idCard
      })
    }
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},
	// 学历层次
  bindEduLevel: function(e) {
		var that = this
		that.setData({
      EduLevelIndex: e.detail.value,
			//EduLevelTxt: that.data.EduLevelArr[e.detail.value]
		})
	},
	bindBusinessScope: function(e) {
		var that = this
		that.setData({
			BusinessScopeidx: e.detail.value,
		})

	},
	Comment: function(e) {
		var that = this
		that.setData({
			Commenttxt: e.detail.value
		})
	},
  Address: function(e) {
		var that = this
		that.setData({
      Address: e.detail.value
		})
	},
  ReceivePhone: function(e) {
		var that = this
		that.setData({
      ReceivePhone: e.detail.value
		})
	},
	StuName: function(e) {
		var that = this
		that.setData({
			StuName: e.detail.value
		})
	},
  IdCard: function (e) {
    var that = this
    that.setData({
      IdCard: e.detail.value
    })
  },
  StuNumber: function (e) {
    var that = this
    that.setData({
      StuNumber: e.detail.value
    })
  },
	Linkman: function(e) {
		var that = this
		that.setData({
			Linkman: e.detail.value
		})
	},
	LinkTel: function(e) {
		var that = this
		that.setData({
			LinkTel: e.detail.value
		})
	},
	//获取收货方
	getSaler: function() {
		app.getLoaction();
		var that = this;
		var url = app.globalData.Serverurl + app.wxapi.api_getSaler;
	},
	radioChange: function(e) {
		var that = this;
		var setmain = JSON.parse(e.detail.value);
		console.log(setmain.name);
		that.setData({
			IsMain: setmain.name
		})

	},
  //显示提示信息（自动消失）
  show_msg: function (show_str, show_icon = 'none') {
    wx.showToast({
      title: show_str,
      icon: show_icon,
      mask: true,
      duration: 1200
    })
  },
	//添加
	AdddTerminalStudent: function() {
    var that = this;
    if (!that.data.IdCard || !that.data.StuName || !that.data.Address) {
      that.show_msg('必填项不能为空');
      return;
    }
    that.doWxPay(that);
	},
  doWxPay: function(that) {
    wx.login({
      success(res) {
        if (res.code) {
          var paramsData = {
            "code": res.code
          }
          //小程序请求服务器接口 start
          wx.request({
            url: app.globalData.Serverurl + app.wxapi.api_recharge,
            method: "post",
            data: paramsData,
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              //小程序调用 支付API start
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                signType: res.data.data.signType,
                paySign: res.data.data.paySign,
                success: function (res) {
                  //that.show_msg('支付成功。信息上传中，请等待!');
                  console.log(res);
                  that.submitData(that);
                },
                fail: function (res) {
                  that.show_msg('支付失败!信息将无法保存，请完成支付!');
                  console.log(res);
                },
                complete: function (res) {
                  console.log('complete', res);
                }
              })
              //小程序调用 支付API end
            }
          })
          //小程序请求服务器接口 end
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  submitData: function(that) {
    var url = app.globalData.Serverurl + app.wxapi.api_update;
    var entity = {
      //schName: that.data.SalerName,
      schId: that.data.SalerId,
      stuName: that.data.StuName,
      idCard: that.data.IdCard,
      stuNumber: that.data.StuNumber,
      linkMan: that.data.Linkman,
      mobile: that.data.LinkTel,
      sex: that.data.IsMain,
      eduLevel: that.data.EduLevelIndex,
      universityType: that.data.BusinessScopeidx,
      receivePhone: that.data.ReceivePhone,
      address: that.data.Address,
      comment: that.data.Commenttxt,
      images: that.data.param
    }
    console.log("参数", entity);
    wx.showLoading();
    wx.request({
      url: url,
      method: 'POST',
      data: entity,
      success: function (res) {

        if (res.data.data.code == 200) {
          wx.hideLoading()
          wx.showModal({
            title: '系统提示', //标题(可为空或者省略)
            content: res.data.data.message,
            confirmText: '确定',
            confirmColor: '#333ccc',
            showCancel: false, //设置cancel是否展示
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.data.message,
            icon: 'none',
            duration: 2000
          })
        }

      },
      fail: function (res) {
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
	// 上传图片
	chooseImg: function(e) {
		var that = this;
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 'original', 
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function(res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				var tempFilePaths = res.tempFilePaths;
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            that.setData({ param: 'data:image/jpg;base64,' + res.data});
            console.log(that.data.param);
            console.log('64图：', that.data.param);
          }
        })

        console.log("图片：", res.tempFilePaths[0]);
				that.setData({
          tempFilePaths: res.tempFilePaths[0]
				});
			}
		});
	},

	gogetSaler: function() {
		wx.navigateTo({
			url: '../../pages/salerlist/salerlist',
		})
	},
})
