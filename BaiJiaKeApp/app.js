//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    let that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              // wx.startRecord()
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  console.log(res)
                  let userInfo = res.userInfo
                  that.globalData.userInfo = res.userInfo
                  // 登录
                  wx.login({
                    success: res => {
                      // 发送 res.code 到后台换取 openId, sessionKey, unionId
                      // console.log(res)
                      wx.request({
                        method: "POST",
                        url: that.globalData.baseUrl + '/v1/user/auto',
                        data: {
                          name: userInfo.nickName,
                          jscode: res.code
                        }
                      })
                    }
                  })
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                },
                fail: res => {
                  console.log(res)
                }
              })
            }
          })
        }else{
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res)
              let userInfo = res.userInfo
              that.globalData.userInfo = res.userInfo
              // 登录
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  // console.log(res)
                  wx.request({
                    method: "POST",
                    url: that.globalData.baseUrl + '/v1/user/auto',
                    data: {
                      name: userInfo.nickName,
                      jscode: res.code
                    }
                  })
                }
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: res => {
              console.log(res)
            }
          })
        }
        
        // console.log(res)
        
        // if (res.authSetting['scope.userLocation']) {
        //   // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        //   // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //   wx.getUserInfo({
        //     success: res => {
        //       // 可以将 res 发送给后台解码出 unionId
        //       console.log(res)
        //       let userInfo = res.userInfo
        //       that.globalData.userInfo = res.userInfo
        //       // 登录
        //       wx.login({
        //         success: res => {
        //           // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //           // console.log(res)
        //           wx.request({
        //             method: "POST",
        //             url: that.globalData.baseUrl + '/v1/user/auto',
        //             data: {
        //               name: userInfo.nickName,
        //               jscode: res.code
        //             }
        //           })
        //         }
        //       })
        //       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //       // 所以此处加入 callback 以防止这种情况
        //       if (this.userInfoReadyCallback) {
        //         this.userInfoReadyCallback(res)
        //       }
        //     },
        //     fail: res=>{
        //       console.log(res)
        //     }
        //   })
        // }
      }
    })
  },
  globalData: {
    userInfo: null,
    // baseUrl:"https://goldlinks.net.cn",
    baseUrl:"https://baijiake.net",
    shouCangList:[],
    courseTypeList:[]
  }
})