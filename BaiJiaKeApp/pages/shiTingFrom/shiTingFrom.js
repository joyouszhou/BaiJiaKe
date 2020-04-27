// pages/shiTingFrom/shiTingFrom.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2020-05-01',
    time: '12:01:00',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      wx.getStorage({
        key: 'token',
        success: function (res) {
          wx.request({
            method: 'put',
            url: app.globalData.baseUrl + '/v1/audition',
            header: {
              'Authorization': 'bearer ' + res.data,
            },
            data: {
              "courseID": data.data,
            },
            success: function (res) {
            },
            fail: function (res) {
            }
          })
        },
      })
      that.setData({
        id: data.data,
      })
    })
  },
  
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value +":00"
    })
  },
  yuYue: function (){
    let that = this
    let data = that.data.id
    wx.getStorage({
      key: 'token',
      success: function (res) {
        console.log(res)
        wx.request({
          method: 'post',
          url: app.globalData.baseUrl + '/v1/audition',
          header: {
            'Authorization': 'bearer ' + res.data,
          },
          data: {
            "courseID": data,
            "orderTime": that.data.date + " " + that.data.time
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.msg == "success!!"){
              wx.showToast({
                title: '预约成功！',
                success: function () {
                  setTimeout(() => {
                    wx.navigateBack()
                  }, 1500)
                }
              })
            }else{
              wx.showModal({
                title: '提示',
                content: res.data.msg,
              })
            }
            
            
          },
          fail: function (res) {
            wx.showToast({
              title: res.msg,
            })
          }
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '您还未登录，是否跳转至登录',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../login/login',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          },
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})