// pages/shiTing/shiTing.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的试听',
    })
    let that =this
    wx.getStorage({
      key: 'token',
      success: function(res) {
        wx.request({
          url: app.globalData.baseUrl + '/v1/audition',
          header: {
            'Authorization': 'bearer ' + res.data,
          },
          success: function (res) {
            console.log(res)
            that.setData({
              courseList:res.data.data
            })
          },
          fail: function () {
            wx.showToast({
              title: '您没有可查看的试听课程',
            })
          }
        })
      },
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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