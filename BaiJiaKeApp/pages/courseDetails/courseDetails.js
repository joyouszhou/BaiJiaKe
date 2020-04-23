// pages/courseDetails/courseDetails.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      
      // let info = JSON.parse(data.data.Ages) ;
      // info = JSON.parse(data.data.ImageUrl);
      console.log(data)
      that.setData({
        courseData:data.data
      })
    })
    wx.setNavigationBarTitle({
      title: "课程详情"
    });
    wx.request({
      url: app.globalData.baseUrl + '/v1/shop/' + that.data.courseData.ShopID,
      // data: {
      //   // id:""
      //   // limit: 10,
      //   // offset: 0,
      //   // beginTime: 'xxx',
      //   // endTime: 'xxx'
      // },
      success: function (res) {
        console.log(res.data)
      }
    })
  },

  openMap: function () {
    let that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18,
          name:that.data.courseData.Name
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
  toSchoolDetails: function () {
    wx.navigateTo({
      url: '../schoolDetails/schoolDetails',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})