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
    inputValue: '',
    baseUrl: app.globalData.baseUrl,
    limit: 10,
    offset: 0,
    total: 0,
    nodata: false,
    pageIndex: 1,
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
  getList: function (name){
    let hotList = [], that = this;
    if(name && that.data.pageIndex-1 >= Math.ceil(that.data.total/10)){
      console.log(111)
      that.setData({
        nodata: true
      })
      return
    } else {
      console.log(222)
      that.setData({
        pageIndex: that.data.pageIndex + 1
      })
    }
    wx.getLocation({
      success: function(res) {
        wx.request({
          url: app.globalData.baseUrl + '/v1/course/searchname?name=' + that.data.inputValue,
          data: {
            lat: res.latitude,
            lon: res.longitude,
            limit: that.data.limit ,
            offset: that.data.offset
          },
          success: function (data) {
            hotList = data.data.data.course
              for (let i = 0; i < hotList.length; i++) {
                hotList[i].jvLi = that.distance(res.latitude, res.longitude, hotList[i].shopinfo.latitude, hotList[i].shopinfo.longitude)
                hotList[i].tagList = hotList[i].shopinfo.tags !== '' ? hotList[i].shopinfo.tags.split(',') : null
              }
              that.setData({
                hotList: name === 'add' ? that.data.hotList.concat(hotList) : hotList,
                total: data.data.data.total
              })
          }
        })
      },
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
   /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(Math.ceil(this.data.total/10))
    if(this.data.pageIndex -1 < Math.ceil(this.data.total/10)){
      this.setData({
        offset: (this.data.pageIndex -1) * 10
      })
      this.getList('add')
    } else {
      this.setData({
        nodata: true
      })
    }
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