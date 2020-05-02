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
      // { name: "语言培训", url: "/images/home/nav/yuyan.png",show: true },
      // { name: "体能运动", url: "/images/home/nav/tineng.png", show: true },
      // { name: "益智成长", url: "/images/home/nav/yizhi.png", show: true },
      // { name: "舞蹈形体", url: "/images/home/nav/wudao.png", show: true },
      // { name: "乐器培训", url: "/images/home/nav/yueqi.png", show: true },
      // { name: "亲子早教", url: "/images/home/nav/xueqian.png", show: true },
      // { name: "美术培训", url: "/images/home/nav/meishu.png", show: true },
      // { name: "棋类培训", url: "/images/home/nav/qilei.png", show: true },
      // { name: "书法培训", url: "/images/home/nav/shufa.png", show: true },
      // { name: "幼儿园/托班", url: "/images/home/nav/youeryuan.png", show: false },
      // { name: "兴趣生活", url: "/images/home/nav/xingqu.png", show: false },
      // { name: "留学", url: "/images/home/nav/liuxue.png", show: false },
      // { name: "美容化妆", url: "/images/home/nav/meirong.png", show: false },
      // { name: "学科教育", url: "/images/home/nav/xueqian.png", show: false },
      // { name: "声乐培训", url: "/images/home/nav/shengyue.png", show: false },
      // { name: "学历提升", url: "/images/home/nav/xueli.png", show: false },
      // { name: "才艺", url: "/images/home/nav/caiyi.png", show: false },
      // { name: "职业技能", url: "/images/home/nav/zhiye.png", show: false },
      // { name: "升学指导", url: "/images/home/nav/shengxue.png", show: false },
    ],
    isOpenNav: false,
    isOpenNavText: "展开",
    hotList:[],
    coursetypeList:[],
    limit: 10,
    offset: 0,
    activeIndex: 0,
    hotcourseList: [],
    baseUrl: app.globalData.baseUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        that.getHotList(data[0].CourseType)
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
    let data = {
      limit: that.data.limit ,
      offset: that.data.offset
    }
    wx.request({
      url: app.globalData.baseUrl +'/v1/course',
      data,
      success:function(res){
        let data = res.data.data.course
        wx.getLocation({
          success: function(res) {
            for (let i = 0; i < data.length; i++) {
              data[i].jvLi = that.distance(res.latitude, res.longitude, data[i].shopinfo.latitude, data[i].shopinfo.longitude)
              data[i].tagList = data[i].shopinfo.tags !== '' ? data[i].shopinfo.tags.split(',') : null
              console.log(data[i].tagList)
            }
            that.setData({
              hotList: data
            })
            console.log(data)
          },
        })
        
      },
      fail:function(res){
        wx.showToast({
          title: res.msg,
        })
      }
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
      url: '../courseDetails/courseDetails',
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