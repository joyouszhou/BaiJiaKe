// pages/courseDetails/courseDetails.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseData:{},
    imgBaseUrl:app.globalData.baseUrl,
    baseUrl: app.globalData.baseUrl,
    imgUrl: [],
    imgIndex:'1',
    imgLength:'',
    isShouCang:false,
    hotList:[],
    shopData:'',
    sys: {declare: '', warmprompt: ''},
    statusBarHeight: 0
  },
  houtui(){
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight
    })
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
          let data = res.data.data
          data.tagList = data.tags !== '' ? data.tags.split(',') : null
          wx.getLocation({
            success: function(res) {
              data.jvLi = that.distance(res.latitude, res.longitude, data.latitude, data.longitude)
              console.log(data)
              that.setData({
                shopData: data
              })
            },
          })
        }
      })
      console.log(data)
      data.data.shopinfo.present = that.contentFo(data.data.shopinfo.present)
      data.data.describe = that.contentFo(data.data.describe)
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
      url: app.globalData.baseUrl + '/v1/course',
      success: function (res) {
        that.setData({
          hotList: res.data.data.course
        })
      }
    })
    wx.request({
      url: app.globalData.baseUrl + '/v1/sys',
      success: function(res){
        let data = res.data.data
        data.declare = that.contentFo(data.declare)
        data.warmprompt = that.contentFo(data.warmprompt)
        that.setData({
          sys: data
        })
      }
    })
  },
  contentFo: function (con){
    return con.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
  },
  //两点之间经纬度求距离方法
  distance: function (la1, lo1, la2, lo2) {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(1);
    return s;
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
    if(!wx.getStorageSync('token')) {
      wx.showModal({
        // title: '提示',
        confirmText: '登录',
        content: '您未登录',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    wx.makePhoneCall({
      phoneNumber: that.data.shopData.phone,
      success: function(res){
        console.log(res)
        wx.request({
          method: 'post',
          header: {
            'Authorization': 'bearer ' + wx.getStorageSync('token'),
          },
          url: app.globalData.baseUrl + '/v1/phone',
          data: {
            "shopname": that.data.shopData.name,
          },
          success: function (res) {
            
          },
          fail: function (res) {
            
          }
        })
      }
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
    let data = this.data.courseData
    data.phone = this.data.shopData.phone
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
    wx.getStorage({
      key: 'token',
      success: function (res) {
        console.log(res)
          wx.request({
            method: 'post',
            url: app.globalData.baseUrl + '/v1/sub',
            header: {
              'Authorization': 'bearer ' + res.data
            },
            data: {
              "courseID": data.id,
            },
            success: function (res) {
              wx.showToast({
                title: '收藏成功！',
              })
              that.setData({
                isShouCang:true
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
    // wx.showToast({
    //   title: '收藏成功',
    //   success : function (){
    //     that.setData({
    //       isShouCang:true
    //     })
    //   }
    // })
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