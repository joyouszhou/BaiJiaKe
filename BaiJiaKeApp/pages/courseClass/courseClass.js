// pages/courseClass/courseClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityName:"全城",
    className: "体能运动",
    oldName: "年龄",
    isTab: false,
    isCityOpen: false,
    isClassOpen: false,
    isOldOpen: false,
    tabName:"",
    cityIsShow:false,
    classIsShow:false,
    oldIsShow:false,
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
      { name: "全部", isTab: true },
      { name: "语言培训", isTab: false },
      { name: "体能运动", isTab: false },
      { name: "益智成长", isTab: false },
      { name: "舞蹈形体", isTab: false },
      { name: "乐器培训", isTab: false },
      { name: "亲自早教", isTab: false },
      { name: "美术培训", isTab: false },
      { name: "棋类培训", isTab: false },
      { name: "书法培训", isTab: false },
      { name: "幼儿园/托班", isTab: false },
      { name: "兴趣生活", isTab: false },
      { name: "留学", isTab: false },
      { name: "美容化妆", isTab: false },
      { name: "学科教育", isTab: false },
      { name: "声乐培训", isTab: false },
      { name: "学历提升", isTab: false },
      { name: "才艺", isTab: false },
      { name: "职业技能", isTab: false },
      { name: "升学辅导", isTab: false },
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
    let that = this;
    wx.setNavigationBarTitle({
      title:"全部课程"
    });
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      if(data.courseName != ""){
        that.setData({
          className: data.courseName
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
    this.setData({
      isClassOpen: !this.data.isClassOpen
    }, function () {
      if (this.data.isClassOpen) {
        this.setData({
          isCityOpen: false,
          isOldOpen: false,
          isTab: true,
          marginT: "margin-top: 560rpx",
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
  },

  toCourseDetails: function () {
    wx.navigateTo({
      url: '../courseDetails/courseDetails',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

})