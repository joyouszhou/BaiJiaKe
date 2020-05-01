// pages/courseClass/courseClass.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityName:"全城",
    className: "全部课程",
    oldName: "年龄",
    isTab: false,
    isCityOpen: false,
    isClassOpen: false,
    isOldOpen: false,
    tabName:"",
    cityIsShow:false,
    classIsShow:false,
    oldIsShow:false,
    hotList:[],
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      inputValue: options.name
    })
    this.getList()
    wx.setNavigationBarTitle({
      title:"搜索课程"
    });
  },
   //搜索框文本内容显示
   inputBind: function (event) {
    this.setData({
      inputValue: event.detail.value
    })
  },
  getList: function (){
    let hotList = [], that = this;
    wx.request({
      url: app.globalData.baseUrl + '/v1/course/searchname?name=' + this.data.inputValue,
      success: function (res) {
        hotList = res.data.data.course
        wx.getLocation({
          success: function(res) {
            for (let i = 0; i < hotList.length; i++) {
              hotList[i].jvLi = that.distance(res.latitude, res.longitude, hotList[i].shopinfo.latitude, hotList[i].shopinfo.longitude)
              hotList[i].tagList = hotList[i].shopinfo.tags !== '' ? hotList[i].shopinfo.tags.split(',') : null
            }
            that.setData({
              hotList
            })
          },
        })
      }
    })
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
  onShow: function (){
  },
  toCourseDetails: function (e) {
    let data = e.currentTarget.dataset.item
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