// pages/shouCang/shouCang.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的收藏'
    });
    this.getList()
  },
  onShow: function (){
    this.getList()
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
  getList: function (){
    let that = this
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.globalData.baseUrl + '/v1/sub',
          header: {
            'Authorization': 'bearer ' + res.data,
          },
          success: function (res) {
            let data = res.data.data
            if (data.length == 0) {
              wx.showModal({
                title: '提示',
                content: '您未收藏任何课程'
              })
            } else {
              wx.getLocation({
                success: function(res) {
                  for (let i = 0; i < data.length; i++) {
                    data[i].jvLi = that.distance(res.latitude, res.longitude, data[i].shopinfo.latitude, data[i].shopinfo.longitude)
                  }
                  that.setData({
                    courseList: data,
                    classList: that.data.classList,
                  })
                },
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: res.msg,
            })
          }
        })
      },
      fail: function (res) {
        
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
    wx.request({
      url: app.globalData.baseUrl + '/v1/audition/' + data.id,
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
  onClose(event) {
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        this.shanChu(event)
        break;
    }
  },
  shanChu: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    wx.showModal({
      title: '提示',
      content: '是否要删除此条收藏?',
      success : function (res){
        if (res.confirm) {
          wx.getStorage({
            key: 'token',
            success: function (data) {
              wx.request({
                method: 'delete',
                url: app.globalData.baseUrl + '/v1/sub/' + item.id,
                header: {
                  'Authorization': 'bearer ' + data.data,
                },
                success: function (res) {
                  if (res.data.msg == 'success!!'){
                    wx.showToast({
                      title: '删除成功',
                      success : function (){
                        wx.getStorage({
                          key: 'token',
                          success: function (res) {
                            wx.request({
                              url: app.globalData.baseUrl + '/v1/sub',
                              header: {
                                'Authorization': 'bearer ' + res.data,
                              },
                              success: function (res) {
                                let data = res.data.data
                                if (data.length == 0) {
                                  wx.showModal({
                                    title: '提示',
                                    content: '您未收藏任何课程'
                                  })
                                  that.setData({
                                    courseList: data
                                  })
                                } else {
                                  that.setData({
                                    courseList: data
                                  })
                                }
                              },
                              fail: function (res) {
                                wx.showToast({
                                  title: res.msg,
                                })
                              }
                            })
                          },
                          fail: function (res) {

                          }
                        })
                      }
                    })
                  }else{
                    wx.showToast({
                      title: '删除失败',
                    })
                  }
                },
              })
            },
          })
          
        } else if (res.cancel) {
          
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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