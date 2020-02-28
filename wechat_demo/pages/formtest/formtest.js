
const app = getApp()
Page({
  /**
   * 组件的初始数据
   */
  data: {
    WxValidate: app.WxValidate,
    form:{//表单数据
      uname:'',
      mobile:'',
      age:'',
      birthday:''
    },
    Error:{},//表单验证错误对象
  },
  // 页面加载
  onLoad: function(options) {    
    //取参数
    //console.log("id", this.properties.id)
    this.initValidate()
    this.initForm(options.id)
  },

    // 初始化表单
  initForm: function(id) {
      let form = this.data.form
      
      if(id>0){
        // 请求数据。。。。。
        form = {
          uname: '测测',
          mobile: '18808443211',
          age: '18',
          birthday: '1995-02-14'
        }
       
      }else{
        form = {
          uname: '',
          mobile: '',
          age: '',
          birthday: ''
        }
      }

      this.setData({ form })
      wx.setStorageSync("formData", form)//缓存表单信息，子页表单需要获取
  },
    // 刷新页面数据
  refreshPageData: function() {
      let form = wx.getStorageSync("formData")
      this.setData({ form })
  },
    // 初始化表单验证
  initValidate: function(){
      // 验证字段的规则
      const rules = {
        uname: {
          required: true,
        },
        mobile: {
          required: true,
          tel: true,
        },
        age: {
          required: true,
          number:true
        },
        birthday: {
          required: true,
        }
      }
      // 验证字段的提示信息，若不传则调用默认的信息
      const messages = {
        uname: {
          required: '姓名不能为空',
        },
        mobile: {
          required: '手机号码不能为空',
          tel: '手机号格式错误',
        },
        age: {
          required: '年龄不能为空',
          number: '年龄只能是数字'
        },
        birthday: {
          required: '生日不能为空',
        }
      }

      // 创建实例对象
      const WxValidate = app.WxValidate.default
      this.WxValidate = new WxValidate(rules, messages)
  },
   
    // 输入框blur后验证
  onInputBlur: function(e) {
      let name=e.currentTarget.dataset.name
      let value = e.detail.value
      let Error=this.data.Error
      let flag=false
      let msg=""
      const params={}
      params[name] = value

      this.data.form[name] = value;//将form字段赋值，处理日期下拉框赋值时清空

      if (!this.WxValidate.checkForm(params)) {
        const errorList = this.WxValidate.errorList
        errorList.map(item=>{
          if(item.param==name){
            flag=true
            msg = item.msg
           
          }
        })
        
      }
      Error[name] = flag ? msg : ''
      console.log("blur Error", Error)
      this.setData({ Error })
      console.log("blur Error List", this.WxValidate.errorList)
  },
    // 选择日期
  onDateChange: function(e) {
      let form=this.data.form;
      form.birthday = e.detail.value;
      this.setData({ form })

  },
    // 提交表单
  onFormSubmit: function (e) {
      const params = e.detail.value;
      console.log("params",params);

      const valid=this.validateForm(params);
  },
    // 验证表单
  validateForm: function(params) {
      // 传入表单数据，调用验证方法
      if (!this.WxValidate.checkForm(params)) {
        const errorFirst = this.WxValidate.errorList[0]
        //console.log(this.WxValidate.errorList)

        ////////////提交时显示所有提示s/////////////
        const Error = {}
        this.WxValidate.errorList.forEach(item => {
          Error[item.param] = item.msg
        })
        //console.log(Error)
        this.setData({ Error })
        ////////////提交时显示所有提示e/////////////

        return false
      }
      return true
  }
})
