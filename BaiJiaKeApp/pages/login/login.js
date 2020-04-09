// pages/login/login.js
Page({

  //页面的初始数据
  data: {
    send: false, //是否已经发送验证码
    second: 120, //验证码有效时间
    phoneNum: '', //用户输入的电话号码
    code: '', //用户输入的验证码
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

  //调用发送验证码接口
  sendMsg: function () {
    var phoneNum = this.data.phoneNum;
    if (this.checkPhoneNum(phoneNum)) {
      wx.request({
        url: '写自己的后台请求发送验证码访问URL',
        method: 'POST',
        data: {
          telphone: phoneNum,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          if (获取验证码成功) {
            //开始倒计时
            this.setData({
              send: true,
            })
            this.timer();
          } else {
            //提示获取验证码失败
            wx.showToast({
              title: '获取验证码失败',
              image: '/images/warn.png',
            })
          }
        },
      })
    }
  },

  //一个计时器
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              send: false,
            })
            resolve(setTimer)
          }
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  //当输完验证码，把数据存到data中
  inputCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  //点击立即用伞按钮后，获取微信用户信息存到后台
  //（问题缺陷：用户更改个人信息后，后台拿到的还是旧数据，不过用户信息最重要的还是openid和用户填写的手机号，其他都不重要）
  onGotUserInfo: function (e) {

    // TODO 对数据包进行签名校验
    //前台校验数据
    if (this.data.phoneNum === '' || this.data.code === '') {
      wx.showToast({
        title: "请填写手机号码和验证码",
        image: '/images/warn.png',
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
    var code = this.data.code;



    //用户信息存到后台
    wx.request({
      url: '写自己的后台请求注册URL',
      method: 'POST',
      data: {
        telphone: userInfo.phoneNum,
        code: code,
        nickName: userInfo.nickName,
        gender: userInfo.gender,
        openId: userInfo.openId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (如果用户注册成功) {
          console.log("【用户注册成功】");
          wx.setStorage({
            key: "registered",
            data: true
          });
          wx.redirectTo({
            url: '../user/user?orderState=0'
          });
        } else {
          console.error("【用户注册失败】：" + res.data.resultMsg);
          wx.showToast({
            title: res.data.resultMsg,
            image: '/images/warn.png',
          })
        }
      }
    })
  },

  toXieYi: function () {
    wx.navigateTo({
      url: '../xieYi/xieYi',
    })
  },

})