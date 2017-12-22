// pages/location/location.js
var app = getApp()
const utils = require('../../libs/utils-min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 500,
    isList: false,
    scale: 16,
    latitude: 23.099994,
    longitude: 113.324520,
    circles: [],
    markers: [{
      latitude: 23.099994,
      longitude: 113.324520
    }],
    controls: [],
    userInfos: [],
    // userInfo: {
    //   userId: 0,
    //   nickName: 'SMK17',
    //   latitude: 23.099994,
    //   longitude: 113.324520,
    //   updatedAt: '2017年01月01日 00:00'
    // },
    avatarUrls: []
  },

  regionChange(e){
    console.log(e)
  },

  calloutTap(e){
    var id = e.markerId
    var user = this.data.userInfos[id]
    var confirmText = '去找他'
    var content = '位置：' + user.latitude + ',' + user.longitude + '\n'
    content += '最后更新：' + utils.formatDate(user.updatedAt, true) + ' ' + utils.formatTime(user.updatedAt)
    if (user.isCurrentUser){
      confirmText = '确定'
    }
    wx.showModal({
      title: user.nickName,
      confirmText: confirmText,
      content: content,
      success: function (res) {
        if (res.confirm) {
          if (!user.isCurrentUser){
            wx.openLocation({
              latitude: user.latitude,
              longitude: user.longitude,
              scale: 28
            })
          }
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    // this.setData({
    //   userInfo: user
    // })
  },

  controlTap(e){
    if (e.controlId == 2 || e.controlId == 3){
      var scale = this.data.scale
      if (e.controlId == 2){
        if (scale > 5){
          scale = scale - 1
        }
      }else{
        if (scale < 18) {
          scale = scale + 1
        }
      }
      console.log(scale)
      this.setData({
        scale: scale
      })
    }
  },

  selectLocation(e){
    console.log(e)
    let id = parseInt(e.currentTarget.id)
    let markers = this.data.circles
    wx.vibrateShort()
    this.setData({
      latitude: markers[id].latitude,
      longitude: markers[id].longitude,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.mapCtx = null
    let id = options.id
    var height = app.globalData.sysInfo.windowHeight - 200 * app.globalData.sysInfo.rpxTopx
    var left = app.globalData.sysInfo.windowWidth - 50
    this.setData({
      height: height,
      controls: [{
        id: 2,
        iconPath: '/images/shrink.png',//-
        position: {
          left: left,
          top: height - 80,
          width: 40,
          height: 40
        },
        clickable: true
        }, {
          id: 3,
          iconPath: '/images/enlarge.png',//+
          position: {
            left: left,
            top: height - 120,
            width: 40,
            height: 40
          },
          clickable: true
        }],
    })
    wx.getStorage({
      key: 'locationSharing',
      success: function (res) {
        console.log(res.data)
      },
      fail: function (res) {
        wx.setStorage({
          key: "locationSharing",
          data: true
        })
        wx.showModal({
          title: '第一次使用位置共享',
          // showCancel: '查看帮助',
          content: '位置共享可以看到其他参与者位置，这在户外活动中很实用。\n如需保持实时位置，请点右上角，选择【显示在聊天顶部】。',
          success: function (res) {
            if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
    })
    
    utils.getLocationList(id, function (markers, circles, points, avatarUrls, userInfos, currentIndex) {
      try{
        that.setData({
          latitude: markers[currentIndex].latitude,
          longitude: markers[currentIndex].longitude,
          markers: markers,
          circles: circles,
          avatarUrls: avatarUrls,
          userInfos: userInfos,
          isList: true,
        })
      }catch(e){
        console.log(e)
      }
      
    })
    app.locationSharing(function () {
      utils.getLocationList(id, function (markers, circles, points, avatarUrls, userInfos, currentIndex) {
        that.setData({
          circles: circles,
          avatarUrls: avatarUrls,
          userInfos: userInfos,
        })
        markers.forEach(function (value, index, array){
          that.mapCtx.translateMarker({
            markerId: value.id,
            autoRotate: true,
            duration: 1000,
            destination: {
              latitude: value.latitude,
              longitude: value.longitude,
            },
            animationEnd() {
              console.log('animation end')
            }
          })
        });
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
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
    app.stopLocationSharing()
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