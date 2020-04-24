// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    btnList:[
      { name: '我的试听', url: '/images/mine/shiting.png' },
      { name: '我的收藏', url: '/images/mine/shoucang.png' },
      { name: '我的评价', url: '/images/mine/shiting.png' },
      { name: '关于我们', url: '/images/mine/guanyu.png' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title:"我的"
    })
    // wx.setNavigationBarColor({
    //   backgroundColor: '#6aabfd',
    // })
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
        })
      }
    })
  },
  btnClick: function (e) {
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    if(id == 1){
      wx.navigateTo({
        url: '../shouCang/shouCang',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    if(id==0 || id==1 || id==2){
      wx.getStorage({
        key: 'login',
        success: function(res) {
          console.log(res)
          if(res.data){
            wx.showToast({
              title: '已登录',
            })
          }else{
            wx.showModal({
              // title: '提示',
              confirmText: '登录',
              content: '您未登录',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateTo({
                    url: '../login/login',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
      })
      
      
    }else{
      wx.navigateTo({
        url: '../guanYu/guanYu',
      })
    }
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

  }
})