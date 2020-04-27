// pages/schoolDetails/schoolDetails.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopData:{},
    imgIndex: '1',
    imgLength: '',
    hotList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel()
    
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        shopData:data.data,
        imgLength: data.data.imageurl.length
      })
    })
    wx.request({
      url: app.globalData.baseUrl +'/v1/shop?sortby={"weight": "desc"}',
      success : function (res) {
        that.setData({
          hotList: res.data.data.shops
        })
        // console.log(res.data.data.shops)
      }
    })
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
          name: "阿蒂朵芭舞蹈工作室"
        })
      }
    })
  },
  imgChange: function (e) {
    this.setData({
      imgIndex: e.detail.current + 1
    })
  },
  toSchoolDetails: function (e) {
    let data = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../schoolDetails/schoolDetails',
      events: {
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
      },
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: data })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
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