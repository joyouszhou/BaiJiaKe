// pages/login/login.js
const app = getApp();
Page({

  //页面的初始数据
  data: {
    send: false, //是否已经发送验证码
    second: 120, //验证码有效时间
    phoneNum: '', //用户输入的电话号码
    password: '', //用户输入的验证码
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  rpwd: function (){
    wx.navigateTo({
      url: '../rpwd/rpwd'
    })
  },
  onLoad: function () {
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      // wx.switchTab({
      //   url: '../home/home',
      // })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      // wx.switchTab({
      //   url: '../home/home',
      // })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      // wx.switchTab({
      //   url: '../home/home',
      // })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //当输入手机号码后，把数据存到data中
  inputPhoneNum: function (e) {
    let phoneNum = e.detail.value;
    this.setData({
      phoneNum: phoneNum,
    })
  },

  //前台校验手机号
  checkPhoneNum: function (phoneNum) {
    let str = /^(1[3|5|8]{1}\d{9})$/;
    if (str.test(phoneNum)) {
      return true;
    } else {
      //提示手机号码格式不正确
      wx.showToast({
        title: '手机号格式不正确',
        image: '/images/warn.png',
      })
      return false;
    }
  },

  //当输完验证码，把数据存到data中
  inputCode: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  //点击立即用伞按钮后，获取微信用户信息存到后台
  //（问题缺陷：用户更改个人信息后，后台拿到的还是旧数据，不过用户信息最重要的还是openid和用户填写的手机号，其他都不重要）
  onGotUserInfo: function (e) {
    let that = this;
    // TODO 对数据包进行签名校验
    //前台校验数据
    // if (this.data.phoneNum === '' || this.data.password === '') {
    if (this.data.phoneNum === '' || this.data.password === '') {
      wx.showToast({
        title: "手机号码和密码不能为空",
      })
    }
    //获取用户数据,(备注：我在用户一进入小程序就已经自动把openId获取到，然后放到缓存里)
    var userInfo = {
      nickName: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl,
      gender: e.detail.userInfo.gender,
      phoneNum: this.data.phoneNum,
      openId: wx.getStorageSync('openid')
    }
    //获取验证码
    var password = this.data.password;

    //用户信息存到后台
    wx.request({
      url: app.globalData.baseUrl+'/v1/auth/login',
      method: 'POST',
      data: {
        "phone": userInfo.phoneNum,
        "password": that.data.password
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log(res)
        if (res.data.msg == "success!!") {

          wx.setStorage({
            key: "login",
            data: true
          });
          wx.setStorage({
            key: "loginData",
            data: {
              "phone": userInfo.phoneNum,
              "password": that.data.password
            }
          });
          wx.setStorage({
            key: "token",
            data: res.data.data.token
          });
          wx.showToast({
            title: '登录成功',
            success:function(){
              setTimeout(function(){
                wx.switchTab({
                  url: '../mine/mine',
                })
              },600)
            }
          })
        } else if (res.data.data == "用户没有注册"){
          wx.showModal({
            title: '提示',
            content: res.data.data,
          })
        }
      },
      fail : function(res){
        console.log(res)
      }
    })
  },

  toRegister: function () {
    wx.navigateTo({
      url: '../register/register',
    })
  },
  toXieYi: function () {
    wx.navigateTo({
      url: '../xieYi/xieYi',
    })
  },

})