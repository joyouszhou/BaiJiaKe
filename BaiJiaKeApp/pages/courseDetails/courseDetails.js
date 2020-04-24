// pages/courseDetails/courseDetails.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseData:{},
    imgBaseUrl:"https://baijiake.net/v1/course/",
    imgUrl: [],
    imgIndex:'1',
    imgLength:'',
    isShouCang:false
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
      console.log(data.data)
      that.setData({
        courseData:data.data,
        imgUrl :arr,
        imgLength :arr.length
      })
    })
    wx.setNavigationBarTitle({
      title: "课程详情"
    });
    wx.request({
      url: app.globalData.baseUrl + '/v1/shop/' + that.data.courseData.shopid,
      // data: {
      //   id: that.data.courseData.shopid
      //   // id:""
      //   // limit: 10,
      //   // offset: 0,
      //   // beginTime: 'xxx',
      //   // endTime: 'xxx'
      // },
      success: function (res) {
        console.log(res.data)
        if (res.data.msg === 'Bad request!!') {
          wx.showToast({
            title: "商家信息请求失败！",
            icon: 'none'
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

  imgChange: function (e) {
    this.setData({
      imgIndex: e.detail.current + 1
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