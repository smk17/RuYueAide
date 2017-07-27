// pages/detail/detail.js
//获取应用实例
var app = getApp()
const utils = require('../../libs/utils-min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '主题',
    remark: '',
    type: '见面',
    spacing: 20,
    is_join: true,
    ly_input: false,
    is_initiate: true,
    date: '2017年01月01日(周一)',
    time: '00:00',
    address: '广州市海珠区新港中路397号',
    markers: [{
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
    comments: '',
    progress: true,
    participates: []
  },

  editYueJian(){
    const that = this
    const is_initiate = this.data.is_initiate
    if (is_initiate){
      const type = app.globalData.initiate.type
      wx.showActionSheet({
        itemList: ['编辑' + type, '删除' + type],
        success: function (res) {
          console.log(res.tapIndex)
          switch (res.tapIndex){
            case 0: 
              console.log(app.globalData.initiate)
              wx.redirectTo({
                url: 'edit/edit',
              })
              break
            case 1:
              wx.showModal({
                title: '删除',
                confirmColor: 'red',
                content: '确认要删除该' + type + '?',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    utils.destroyYueJian(app.globalData.initiate.yuejian_id, function (){
                      wx.reLaunch({
                        url: '/pages/index/index'
                      })
                    });
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              break
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
        
      })
      utils.cancelYueJian(app.globalData.initiate.participate_id, function (success){
        wx.hideLoading()
        that.setData({
          is_join: false
        })
        that.query()
      });
    }
  },

  /**
   * 留言
   */
  onComments(event){
    let comments = event.currentTarget.dataset.comments
    let is_join = event.currentTarget.dataset.join
    if ( is_join && comments == '' ){
      this.setData({
        ly_input: true
      })
    }
  },

  /**
   * 取消留言
   */
  onInputBlur(){
    this.setData({
      ly_input: false
    })
  },
  
  /**
   * 提交留言
   */
  onInputConfirm(event){
    const that = this
    const value = event.detail.value
    utils.submitLiuYan(app.globalData.initiate.participate_id, value, function (){
      that.setData({
        progress: true,
        ly_input: false
      })
      that.query()
    })
  },

  /**
   * 修改约见提醒或确认约见
   */
  onYueJian(){
    const that = this
    const is_join = this.data.is_join
    if (is_join){
      wx.navigateTo({
        url: '/pages/remind/remind',
      })
    }else{
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      utils.createParticipate(app.globalData.initiate.yuejian_id,function (pointer){
        wx.hideLoading()
        app.globalData.initiate.participate_id = pointer.id
        that.setData({
          is_join: true
        })
        that.onYueJian()
        that.query()
      })
    }
  },

  mapTap(){
    wx.openLocation({
      latitude: this.data.markers[0].latitude,
      longitude: this.data.markers[0].longitude,
      scale: 24
    })
  },


  openSetting() {
    const that = this
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.reLaunch({
            url: '/pages/detail/detail?id=' + that.id,
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
  onLoad: function (options) {
    const that = this;
    if (options.id) {
      this.id = options.id
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      app.appInit(function () {
        utils.getYueJian(options.id, function (initiate) {
          app.globalData.initiate = initiate
          that.init()
        }, function(){
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '查询不到该约见，可能该约见已被发起人删除，点击确认返回首页，取消则退出',
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }else{
                wx.navigateBack()
              }
            }
          })
        });
      }, function () {
        that.openSetting()
      })
    }else{
      that.init()
    }
  },

  /**
   * 初始化页面数据
   * initiate，为全局变量initiate
   */
  init(){
    let initiate = app.globalData.initiate
    wx.setNavigationBarTitle({
      title: initiate.type + '详情'
    })
    this.setData({
      title: initiate.title,
      remark: initiate.remark,
      type: initiate.type,
      date: utils.formatDate(initiate.date, true, true),
      time: utils.formatTime(initiate.date),
      address: initiate.location.address,
      markers: [initiate.location],
      spacing: 20 * app.globalData.sysInfo.rpxTopx,
    })
    app.globalData.initiate.is_edit = true;
    this.query()
  },

  query(){
    const that = this
    utils.getParticipateList(app.globalData.initiate.yuejian_id ,function (results) {
      that.setData(results)
      app.globalData.initiate.is_initiate = results.is_initiate
      app.globalData.initiate.participate_id = results.id
      app.globalData.initiate.remind = results.remind
      wx.hideLoading()
    })
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
    console.log(getCurrentPages())
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('onShareAppMessage',res.target);
      let nickName = app.globalData.user.userInfo.nickName;
      let initiate = app.globalData.initiate;
      return utils.getShareAppMessage(initiate.yuejian_id, nickName, initiate.type);
    }
  }
})