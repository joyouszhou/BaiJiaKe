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
    hotList:[],
    shopData:'',
    sys: {declare: '', warmprompt: ''},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
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
      wx.request({
        url: app.globalData.baseUrl + '/v1/shop/'+data.data.shopinfo.id,
        success: function (res) {
          that.setData({
            shopData: res.data.data
          })
        }
      })
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
    wx.request({
      url: app.globalData.baseUrl + '/v1/sys',
      header: { 
        'Authorization': 'bearer ' + wx.getStorageSync('token')
      },
      success: function(res){
        this.setData({
          sys: res.data
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

  phoneCall: function(){
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.shopData.phone //仅为示例，并非真实的电话号码
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
    console.log(111111)
    let that = this;
    let data = this.data.courseData
    wx.getStorage({
      key: 'token',
      success: function (res) {
        console.log(res)
          wx.request({
            method: 'post',
            url: app.globalData.baseUrl + '/v1/sub',
            header: {
              'Authorization': 'bearer ' + res.data,
            },
            data: {
              "courseID": data.id,
            },
            success: function (res) {
              wx.showToast({
                title: '收藏成功！',
              })

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
    wx.showToast({
      title: '收藏成功',
      success : function (){
        that.setData({
          isShouCang:true
        })
      }
    })
  },
  toShiTingFrom:function(){
    let data = this.data.courseData.id
    wx.navigateTo({
      url: '../shiTingFrom/shiTingFrom',
      events: {
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
      },
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: data })
      },
    })
  }
})