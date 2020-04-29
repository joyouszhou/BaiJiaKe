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
    cityList: [
      { name: "全城", isTab: true },
      { name: "昌平区", isTab: false },
      { name: "朝阳区", isTab: false },
      { name: "丰台区", isTab: false },
      { name: "西城区", isTab: false },
      { name: "海淀区", isTab: false },
      { name: "东城区", isTab: false },
      { name: "通州区", isTab: false },
      { name: "石景山区", isTab: false },
      { name: "顺义区", isTab: false },
      { name: "大兴区", isTab: false },
      { name: "房山区", isTab: false }
    ],
    classList:[
      // { name: "全部", isTab: true },
      // { name: "语言培训", isTab: false },
      // { name: "体能运动", isTab: false },
      // { name: "益智成长", isTab: false },
      // { name: "舞蹈形体", isTab: false },
      // { name: "乐器培训", isTab: false },
      // { name: "亲自早教", isTab: false },
      // { name: "美术培训", isTab: false },
      // { name: "棋类培训", isTab: false },
      // { name: "书法培训", isTab: false },
      // { name: "幼儿园/托班", isTab: false },
      // { name: "兴趣生活", isTab: false },
      // { name: "留学", isTab: false },
      // { name: "美容化妆", isTab: false },
      // { name: "学科教育", isTab: false },
      // { name: "声乐培训", isTab: false },
      // { name: "学历提升", isTab: false },
      // { name: "才艺", isTab: false },
      // { name: "职业技能", isTab: false },
      // { name: "升学辅导", isTab: false },
    ],
    oldList:[
      { name: "不限", isTab: true },
      { name: "3-5", isTab: false },
      { name: "6-8", isTab: false },
      { name: "9-12", isTab: false },
      { name: "13-15", isTab: false },
      { name: "15-18", isTab: false },
      { name: "19-22", isTab: false },
      { name: "20以上", isTab: false }
    ],
    marginT:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.setNavigationBarTitle({
      title:"全部课程"
    });
    
  },
  onShow: function (){
    let that = this;
    let data = app.globalData.courseTypeList
    console.log(data)
    for(let i=0;i<data.length;i++){
      data[i].isTab = false
    }
    that.data.classList = data;
    
    let list = []
    wx.request({
      url: app.globalData.baseUrl + '/v1/course',
      success: function (res) {
        list = res.data.data.course
        that.setData({
          hotList: list,
          classList: that.data.classList,
        })
        // that.setData({
        //   className: data.courseName,
          
        // })
      }
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      if(data.courseName != ""){
        that.data.classList[0].isTab = false;
        for (let i = 0; i < that.data.classList.length;i++){
          if (data.courseName == that.data.classList[i].CourseType){
            that.data.classList[i].isTab = true;
          }
        }
        
        wx.request({
          url: app.globalData.baseUrl +'/v1/course?course_type='+data.courseName,
          success: function (res){
            list = res.data.data.course
            that.setData({
              hotList: list
            })
          }
        })
        that.setData({
          className: data.courseName,
          classList: that.data.classList,
        })
      }
    })
  },
  cityChange: function () {
    this.setData({
      isCityOpen: !this.data.isCityOpen
    },function(){
      if (this.data.isCityOpen){
        this.setData({
          isClassOpen: false,
          isOldOpen: false,
          isTab: true,
          marginT: "margin-top: 380rpx",
          tabName: "全城",
        })
      }else{
        this.setData({
          marginT: "",
          isTab: false,
        })
      }
    })
  },
  classChange: function () {
    let that = this;
    this.setData({
      isClassOpen: !this.data.isClassOpen
    }, function () {
      if (this.data.isClassOpen) {
        let marginT = ""
        console.log(that.data.classList)
        if(that.data.classList.length<4){
          marginT = "margin-top: 200rpx"
        }
        if (that.data.classList.length > 4) {
          marginT = "margin-top: 400rpx"
        }
        if (that.data.classList.length >8) {
          marginT = "margin-top: 600rpx"
        }
        if (that.data.classList.length > 12) {
          marginT = "margin-top: 800rpx"
        }
        if (that.data.classList.length > 16) { 
          marginT = "margin-top: 1000rpx"
        }
        this.setData({
          isCityOpen: false,
          isOldOpen: false,
          isTab: true,
          marginT: marginT,
          tabName: "体能运动",
        })
      } else {
        this.setData({
          marginT: "",
          isTab: false,
        })
      }
    })
  },
  oldChange: function () {
    this.setData({
      isOldOpen: !this.data.isOldOpen
    }, function () {
      if (this.data.isOldOpen) {
        this.setData({ 
          isCityOpen: false,
          isClassOpen: false,
          isTab: true,
          marginT: "margin-top: 290rpx",
          tabName: "年龄",
        })
      } else {
        this.setData({
          marginT: "",
          isTab: false,
        })
      }
    })
  },
  

  courseItemChange: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    if(this.data.tabName=="全城"){
      for (let i = 0; i < this.data.cityList.length; i++) {
        this.data.cityList[i].isTab = false;
        this.setData({
          cityList: this.data.cityList
        })
        if (id == i) {
          this.data.cityList[i].isTab = true;
          this.setData({
            cityList: this.data.cityList,
            cityName: e.currentTarget.dataset.name,
          })
        }
      }
    }
    if (this.data.tabName == "体能运动") {
      for (let i = 0; i < this.data.classList.length; i++) {
        this.data.classList[i].isTab = false;
        this.setData({
          classList: this.data.classList
        })
        if (id == i) {
          this.data.classList[i].isTab = true; 
          this.setData({
            classList: this.data.classList,
            className: e.currentTarget.dataset.name,
          })
        }
      }
    }
    if (this.data.tabName == "年龄") {
      for (let i = 0; i < this.data.oldList.length; i++) {
        this.data.oldList[i].isTab = false;
        this.setData({
          oldList: this.data.oldList
        })
        if (id == i) {
          this.data.oldList[i].isTab = true;
          this.setData({
            oldList: this.data.oldList,
            oldName: e.currentTarget.dataset.name,
          })
        }
      }
    }
    this.getDataList()
  },
  getDataList: function(){
    console.log(this.data.cityName, this.data.className, this.data.oldName)
    let str = '', that = this;
    if(this.data.cityName !== '全城'){
      str = str + `city=${this.data.cityName}&`
    }
    if(this.data.oldName !== '不限' && this.data.oldName !== '年龄'){
      str = str + `ages=${this.data.oldName}&`
    }
    str = str + `course_type=${this.data.className}`
    wx.request({
      url: app.globalData.baseUrl + '/v1/course?' + str,
      success: function (res) {
        that.setData({
          hotList: res.data.data.course
        })
      }
    })
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