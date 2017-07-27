//index.js
var app = getApp()
const utils = require('../../libs/utils-min.js');
Page({
  data: {
    height: 513,
    progress: true,
    list: [],
    opacity: 0,
    message: ""
  },

  onInitiateYueJian(){
    if (app.globalData.initiate.yuejian_id != ''){
      app.initiateReset()
    }
    wx.navigateTo({
      url: '/pages/initiate/initiate',
    })
  },

  /**
    * 显示Toast
    * message， 显示你要提示的内容
    **/
  drawToast(message) {
    var that = this
    this.setData({
      opacity: 0.7,
      message: message,
    })
    setTimeout(function () {
      that.setData({
        opacity: 0,
      })
    }, 1000)
  },

  onViewTap(e){
    try {
      let item = e.currentTarget.dataset.item;
      let index = e.currentTarget.dataset.index;
      let obj = this.list[item].list[index];
      app.globalData.initiate = utils.updateInitiate(obj);
      wx.navigateTo({
        url: '/pages/detail/detail',
      })
    } catch (e) {
      console.error(e)
    }
  },

  showInit(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const that = this
    utils.getYueJianList(function (list, dlist) {
      try {
        that.setData({
          progress: false,
          list: dlist
        })
        wx.hideLoading()
        that.list = list;
      } catch (e) {
        console.error(e)
      }
    }, function () { wx.hideLoading() });
  },

  openSetting() {
    const that = this
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } else {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          setTimeout(function () {
            that.openSetting()
            wx.hideLoading()
          }, 1000)

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    const height = app.globalData.sysInfo.windowHeight - (180 * app.globalData.sysInfo.rpxTopx);
    this.setData({
      height: height,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('index-onShow')
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const that = this
    this.setData({
      progress: true,
    })
    app.appInit(function (){
      that.showInit()
    }, function (){
      that.openSetting()
    })
  }
})
