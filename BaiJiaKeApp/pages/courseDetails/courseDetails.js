// pages/courseDetails/courseDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "课程详情"
    });
  },

  openMap: function () {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18,
          name:"阿蒂朵芭舞蹈工作室"
        })
      }
    })
  },
  toCourseDetails: function () {
    wx.navigateTo({
      url: '../courseDetails/courseDetails',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})