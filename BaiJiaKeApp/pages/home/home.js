// pages/home/home.js
const app = getApp();
// import { base64src } from '../../utils/base64src.js'
import { base64src } from '../../utils/base64src.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '', //搜索的内容
    navList: [
     
    ],
    isOpenNav: false,
    isOpenNavText: "展开",
    hotList:[],
    coursetypeList:[],
    activeIndex: 0,
    hotcourseList: [],
    baseUrl: app.globalData.baseUrl,
    current: 0,
    current2: 0,
    limit: 10,
    offset: 0,
    total: 0,
    nodata: false,
    pageIndex: 1,
  },
  swiperChange: function (e){
    this.setData({
      current: e.detail.current
    })
  },
  swiperChange2: function (e){
    this.setData({
      current2: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getSystemInfoSync().statusBarHeight)
    let loginData = wx.getStorageSync('loginData')
    if(loginData){
      wx.request({
        url: app.globalData.baseUrl+'/v1/auth/login',
        method: 'POST',
        data: {
          "phone": loginData.phone,
          "password": loginData.password
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          if (res.data.msg == "success!!") {
            wx.setStorage({
              key: "login",
              data: true
            });
            wx.setStorage({
              key: "loginData",
              data: loginData
            });
            wx.setStorage({
              key: "token",
              data: res.data.data.token
            });
          }
        },
        fail : function(res){
          console.log(res)
        }
      })
    }
  },
  onShow: function(){
    let that = this;
    this.setData({
      pageIndex: 1,
      offset: 0,
      hotList: []
    })
    wx.request({
      url: app.globalData.baseUrl + '/v1/coursetype',
      success: function (res){
        let data = res.data.data
        // for(let i=0;i<data.length;i++){
        //   data[i].Logo = data[i].Logo.slice(22)
        //   // data[i].Logo = that.getimg(data[i].Logo)
        // }
        for (let i = 0; i < data.length; i++) {
          if(i<8){
            data[i].show = true
          }else{
             data[i].show = false
          }
          base64src(data[i].Logo, res => {
            data[i].Logo = res
            // console.log(res) // 返回图片地址，直接赋值到image标签即可

          });
        }
        that.setData({
          coursetypeList: data
        })
        that.getHotList()
        app.globalData.courseTypeList = data
      }
    })
    wx.request({
      url: app.globalData.baseUrl + '/v1/hotcourse',
      header: {
        'Authorization': 'bearer  ' + wx.getStorageSync('token')
      },
      success: function (res){
        that.setData({
          hotcourseList: res.data.data.courses
        })
        console.log(res.data.data.courses)
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  getHotList: function (name){
    let that = this;
    if(name && that.data.pageIndex-1 >= Math.ceil(that.data.total/10)){
      that.setData({
        nodata: true
      })
      return
    } else {
      that.setData({
        pageIndex: that.data.pageIndex + 1
      })
    }
    wx.getLocation({
      success: function(loc) {
        wx.request({
          url: app.globalData.baseUrl +'/v1/course',
          data: {
            lat: loc.latitude,
            lon: loc.longitude,
            limit: that.data.limit ,
            offset: that.data.offset
          },
          success:function(res){
            let data = res.data.data.course
            for (let i = 0; i < data.length; i++) {
              data[i].jvLi = that.distance(loc.latitude, loc.longitude, data[i].shopinfo.latitude, data[i].shopinfo.longitude)
              data[i].tagList = data[i].shopinfo.tags !== '' ? data[i].shopinfo.tags.split(',') : null
            }
            that.setData({
              hotList: name === 'add' ? that.data.hotList.concat(data) : data,
              total: res.data.data.total
            })
            
          },
          fail:function(res){
            wx.showToast({
              title: res.msg,
            })
          }
        })
      },
    })
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.pageIndex -1 < Math.ceil(this.data.total/10)){
      this.setData({
        offset: (this.data.pageIndex -1) * 10
      })
      this.getHotList('add')
    } else {
      this.setData({
        nodata: true
      })
    }
    
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
  hotList: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeIndex: index
    })
    this.getHotList(e.currentTarget.dataset.name)
  },
  getNavItem: function(e){  
    wx.navigateTo({
      url: '../courseClass/courseClass',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { courseName: e.currentTarget.dataset.name })
      }
    })
  },
  toCourseClass: function(){
    wx.navigateTo({
      url: '../courseClass/courseClass',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { courseName: '' })
      }
    })
  },
  toCourseDetails: function(e){
    let data = e.currentTarget.dataset.item;
    wx.request({
      url: app.globalData.baseUrl + '/v1/course/' + data.id + '/count',
      method: 'put',
      header: { 
        'Authorization': 'bearer ' + wx.getStorageSync('token')
      },
      success: function (res) {}
    })
    wx.navigateTo({
      url: '../courseDetails/courseDetails?id=' + data.id,
      events:{
        acceptDataFromOpenedPage: function (data) {
        },
      },
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: data })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //收起展开导航栏
  changeNav: function(){
    let arr = this.data.coursetypeList;
    console.log(arr)
    if (arr.length>9){
      if (this.data.isOpenNav) {
        for (let i = 0; i < arr.length; i++) {
          if (i > 8) {
            arr[i].show = false;
          }
        }
      } else {
        for (let i = 0; i < arr.length; i++) {
          if (i > 8) {
            arr[i].show = true;
          }
        } 
      }
      this.setData({
        isOpenNav: !this.data.isOpenNav,
        coursetypeList: arr,
        isOpenNavText: this.data.isOpenNav ? "展开" : "收起"
      })
    }
    
  },
  //搜索框文本内容显示
  inputBind: function (event) {
    this.setData({
      inputValue: event.detail.value
    })
  },
  //搜索执行按钮
  query: function (event) {
    wx.navigateTo({
      url: '../serachList/serachList?name=' + this.data.inputValue
    })
  }
})