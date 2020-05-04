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
    courseList1: [],
    isShouCang: false,
    offset: 0,
    offset1: 0,
    baseUrl: app.globalData.baseUrl,
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
            "shopname": that.data.shopData.shopinfo.name,
          },
          success: function (res) {
            
          },
          fail: function (res) {
            
          }
        })
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight
    })
    let that = this;
    const eventChannel = this.getOpenerEventChannel()
    
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      data.data.tagList = data.data.shopinfo.tags !== '' ? data.data.shopinfo.tags.split(',') : null
      var str = data.data.shopinfo.institution;
      var re = /{(.*?)}/g;
      var array = [];
      var temp = [];
      while (temp = re.exec(str)) {
        array.push(temp[0].substring(1,temp[0].length - 1))
      }
      data.data.institutionList = array
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
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.request({
      url: app.globalData.baseUrl +'/v1/course?limit=3&offset=0&sortby={"created_at": "desc"}&course_status=1',
      success : function (res) {
        that.setData({
          courseList: res.data.data.course
        })
      }
    })
    wx.request({
      url: app.globalData.baseUrl +'/v1/course?limit=3&offset=0&sortby={"created_at": "desc"}&course_status=2',
      success : function (res) {
        that.setData({
          courseList1: res.data.data.course
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
  fenXiang: function () {
    wx.showShareMenu({
      withShareTicket: true
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
  // 点击更多体验课
  moreExperience() {
    let that = this
    this.data.offset = this.data.offset + 1
    wx.request({
      url: app.globalData.baseUrl +'/v1/course?limit=3&offset='+this.data.offset+'&sortby={"created_at": "desc"}&course_status=1',
      success : function (res) {
        let course = res.data.data.course,
        courseList = that.data.courseList;
        if(course.length == 0) {
          alert("没有更多体验课")
        }
        course.forEach(element => {
          courseList.push(element)
        });
        that.setData({
          courseList:courseList
        })
      }
    })
  },
  // 点击更多正式课
  moreOfficial() {
    let that = this
    this.data.offset1 = this.data.offset1 + 1
    wx.request({
      url: app.globalData.baseUrl +'/v1/course?limit=3&offset='+this.data.offset1+'&sortby={"created_at": "desc"}&course_status=2',
      success : function (res) {
        let course = res.data.data.course,
        courseList = that.data.courseList1;
        if(course.length == 0) {
          alert("没有更多体验课")
        }
        course.forEach(element => {
          courseList.push(element)
        });
        that.setData({
          courseList1:courseList
        })
      }
    })
  }
})