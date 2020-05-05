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
    statusBarHeight: 0,
    tiyan: [],
    zhengshi: [],
    tiyanShow: false,
    zhengshhiShow: false,
    sear: false,
  },
  houtui(){
    if(this.data.sear) {
      wx.switchTab({
        url: '/pages/home/home',
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
    
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
  contentFo: function (con){
    return con.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
  },
  onShareAppMessage: function(res) {
    console.log(this.data.shopData)
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
    }
    else {
      console.log("来自右上角转发菜单")
    }
    return {
      title: '百家课',
      path: '/pages/schoolDetails/schoolDetails?id=' + this.data.shopData.id,//这里的path是当前页面的path，必须是以 / 开头的完整路径，后面拼接的参数 是分享页面需要的参数  不然分享出去的页面可能会没有内容
      imageUrl: app.globalData.baseUrl + this.data.shopData.imageurl[0],
      desc: this.data.shopData.addr
    }
  },
  onLoad: function (options) {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight
    })
    let that = this;
    const eventChannel = this.getOpenerEventChannel()
    if(eventChannel.on) {
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
        // that.setData({
        //   shopData:data.data,
        //   imgLength: data.data.imageurl.length
        // })
        that.getDetails(data.data.shopinfo.id)
      })
    }
    if(options.id) {
      that.getDetails(options.id)
      this.setData({
        sear: true
      })
    }
   
    wx.showShareMenu({
      withShareTicket: true
    })
    // wx.request({
    //   url: app.globalData.baseUrl +'/v1/course?limit=3&offset=0&sortby={"created_at": "desc"}&course_status=1',
    //   success : function (res) {
    //     that.setData({
    //       courseList: res.data.data.course
    //     })
    //   }
    // })
    // wx.request({
    //   url: app.globalData.baseUrl +'/v1/course?limit=3&offset=0&sortby={"created_at": "desc"}&course_status=2',
    //   success : function (res) {
    //     that.setData({
    //       courseList1: res.data.data.course
    //     })
    //   }
    // })
  },
  getDetails: function (id){
    let that = this
    wx.request({
      url: app.globalData.baseUrl +'/v1/shop/' + id,
      success : function (res) {
        let courses = res.data.data.courses, tiyan = [], zhengshi = [];
        courses.map(x=>{
          if(x.course_status === 1) {
            tiyan.push(x)
          } else if(x.course_status === 2) {
            zhengshi.push(x)
          }
        })
        res.data.data.describe = that.contentFo(res.data.data.describe)
        res.data.data.institution = that.contentFo(res.data.data.institution)
        that.setData({
          tiyan,
          zhengshi,
          shopData: res.data.data
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
      url: '../courseDetails/courseDetails?id=' + data.id,
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
              "courseID": that.data.tiyan[0].id,
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
    this.setData({
      tiyanShow: true
    })
    return
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
    this.setData({
      zhengshhiShow: true
    })
    return
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