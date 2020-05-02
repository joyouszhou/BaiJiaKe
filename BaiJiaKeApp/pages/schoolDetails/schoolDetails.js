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
    hotList:[],
    currentTab: 0,
    isShow: true,
    courseList:[],
    courseList1: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel()
    
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      data.data.tagList = data.data.shopinfo.tags !== '' ? data.data.shopinfo.tags.split(',') : null
      that.setData({
        shopData:data.data,
        imgLength: data.data.imageurl.length
      })
      console.log(data.data)
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
    wx.request({
      url: app.globalData.baseUrl +'/v1/course?limit=3&offset=0&sortby={"created_at": "desc"}&course_status=1',
      success : function (res) {
        that.setData({
          courseList: res.data.data.course
        })
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

  },
  tabNav: function (e) {
    let that = this
    console.log(e.target.dataset.current, 111, this.data.currentTab)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      let showMode = e.target.dataset.current == 0;
      this.setData({
        currentTab: e.target.dataset.current,
        isShow: showMode
      })
      if(showMode) {
        wx.request({
          url: app.globalData.baseUrl +'/v1/course?limit=3&offset=0&sortby={"created_at": "desc"}&course_status=1',
          success : function (res) {
            that.setData({
              courseList: res.data.data.course
            })
          }
        })
      }else {
        wx.request({
          url: app.globalData.baseUrl +'/v1/course?limit=3&offset=0&sortby={"created_at": "desc"}&course_status=2',
          success : function (res) {
            that.setData({
              courseList1: res.data.data.course
            })
          }
        })
      }
    }
  },
  catchTouchMove() {
    return false
  },
  toCourseDetails: function (e) {
    let data = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../courseDetails/courseDetails',
      events: {
        acceptDataFromOpenedPage: function (data) {
        },
      },
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: data })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})