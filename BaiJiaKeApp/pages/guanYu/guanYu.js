// pages/guanYu/guanYu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnList:["平台说明","用户协议","客户服务"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "关于我们"
    })
  },
  btnClick: function (e) {
    let id = e.currentTarget.dataset.id
    if (id == 0) {
      wx.navigateTo({
        url: '../gongZhongHao/gongZhongHao',
      })
    }
    if (id == 1) {
      wx.navigateTo({
        url: '../xieYi/xieYi',
      })
    }
    if (id == 2) {
      wx.navigateTo({
        url: '../keFu/keFu',
      })
    }
  },
})