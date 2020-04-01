// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '', //搜索的内容
    navList: [
      { name: "语言培训", url: "/images/home/nav/yuyan.png",show: true },
      { name: "体能运动", url: "/images/home/nav/tineng.png", show: true },
      { name: "益智成长", url: "/images/home/nav/yizhi.png", show: true },
      { name: "舞蹈形体", url: "/images/home/nav/wudao.png", show: true },
      { name: "乐器培训", url: "/images/home/nav/yueqi.png", show: true },
      { name: "亲子早教", url: "/images/home/nav/xueqian.png", show: true },
      { name: "美术培训", url: "/images/home/nav/meishu.png", show: true },
      { name: "棋类培训", url: "/images/home/nav/qilei.png", show: true },
      { name: "书法培训", url: "/images/home/nav/shufa.png", show: true },
      { name: "幼儿园/托班", url: "/images/home/nav/youeryuan.png", show: false },
      { name: "兴趣生活", url: "/images/home/nav/xingqu.png", show: false },
      { name: "留学", url: "/images/home/nav/liuxue.png", show: false },
      { name: "美容化妆", url: "/images/home/nav/meirong.png", show: false },
      { name: "学科教育", url: "/images/home/nav/xueqian.png", show: false },
      { name: "声乐培训", url: "/images/home/nav/shengyue.png", show: false },
      { name: "学历提升", url: "/images/home/nav/xueli.png", show: false },
      { name: "才艺", url: "/images/home/nav/caiyi.png", show: false },
      { name: "职业技能", url: "/images/home/nav/zhiye.png", show: false },
      { name: "升学指导", url: "/images/home/nav/shengxue.png", show: false },
    ],
    isOpenNav: false,
    isOpenNavText: "展开"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },
  getNavItem: function(e){  
    console.log(e.currentTarget.dataset.id);
  },
  toCourseClass: function(){
    wx.navigateTo({
      url: '../courseClass/courseClass',
    })
  },
  toCourseDetails: function(){
    wx.navigateTo({
      url: '../courseDetails/courseDetails',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //收起展开导航栏
  changeNav: function(){
    let arr = [];
    if (this.data.isOpenNav){
      for(let i=0; i<this.data.navList.length; i++){
        if(i>8){
          this.data.navList[i].show = false;
        }
      }
      arr = this.data.navList
    }else{
      for (let i = 0; i < this.data.navList.length; i++) {
        if (i > 8) {
          this.data.navList[i].show = true;
        }
      }
      arr = this.data.navList
    }
    this.setData({
      isOpenNav: !this.data.isOpenNav,
      navList: arr ,
      isOpenNavText: this.data.isOpenNav?"展开":"收起"
    })
  },
  //搜索框文本内容显示
  inputBind: function (event) {
    this.setData({
      inputValue: event.detail.value
    })
  },
  //搜索执行按钮
  query: function (event) {
    var that = this
    /**
     * 提问帖子搜索API
     * keyword string 搜索关键词 ; 这里是 this.data.inputValue
     * start int 分页起始值 ; 这里是 0
     */
    wx.request({
      url: 'https://localhost/proj_online_class/server/public/index.php/forum/forum/get_issue_search/' + this.data.inputValue + /0/,
      data: {
        inputValue: this.data.inputValue
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var searchData = res.data
        that.setData({
          searchData
        })

        /**
         * 把 从get_issue_searchAPI 
         * 获取 提问帖子搜索 的数据 设置缓存
         */
        wx.setStorage({
          key: 'searchLists',
          data: {
            searchLists: res.data
          }
        })
        /**
         * 设置 模糊搜索
         */
        if (!that.data.inputValue) {
          //没有搜索词 友情提示
          wx.showToast({
            title: '请重新输入',
            image: '../../picture/tear.png',
            duration: 2000,
          })
        } else if (searchData.search.length == 0) {
          //搜索词不存在 友情提示
          wx.showToast({
            title: '关键词不存在',
            image: '../../picture/tear.png',
            duration: 2000,
          })
        } else {
          //提取题目关键字 与搜索词进行匹配
          var searchIndex = searchData.search.length
          var d = 0;
          for (var i = 0; i <= searchIndex - 1; i++) {

            var searchTitle = searchData.search[d].title
            console.log(searchTitle)
            d = d + 1;

            for (var x = 0; x <= searchTitle.length; x++) {
              for (var y = 0; y <= searchTitle.length; y++) {
                var keyWord = searchTitle.substring(x, y);
                console.log(keyWord)
              }
            }

            /**
             * 根据关键词 跳转到 search搜索页面
             */
            wx.navigateTo({
              url: '../search/search',
            })
          }
        }
      }
    })
  }
})