// pages/courseDetails/courseDetails.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseData:{},
    imgBaseUrl:"https://baijiake.net",
    imgUrl: [],
    imgIndex:'1',
    imgLength:'',
    isShouCang:false,
    hotList:[]
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
      let arr =[]
      for (let i = 0; i < data.data.imageurl.length;i++){
        arr.push(that.data.imgBaseUrl + data.data.imageurl[i]) 
      }
      for(let i=0;i<app.globalData.shouCangList.length;i++){
        if (data.data.id == app.globalData.shouCangList[i].id){
          that.setData({
            isShouCang:true
          })
        }
      }
      that.setData({
        courseData:data.data,
        imgUrl :arr,
        imgLength :arr.length
      })
    })
    wx.setNavigationBarTitle({
      title: "课程详情"
    });
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.request({
      url: app.globalData.baseUrl + '/v1/course?sortby={"weight": "desc"}',
      success: function (res) {
        that.setData({
          hotList: res.data.data.course
        })
      }
    })
  },

  imgChange: function (e) {
    this.setData({
      imgIndex: e.detail.current + 1
     })
  },

  fenXiang: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  openMap: function () {
    let that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = that.data.courseData.shopinfo.latitude
        const longitude = that.data.courseData.shopinfo.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18,
          name:that.data.courseData.name
        })
      }
    })
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
  toSchoolDetails: function () {
    let data = this.data.courseData.shopinfo
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
  shouCang: function(){
    let that = this;
    let data = this.data.courseData
    app.globalData.shouCangList.push(data)
    wx.showToast({
      title: '收藏成功',
      success : function (){
        that.setData({
          isShouCang:true
        })
      }
    })
  }
})