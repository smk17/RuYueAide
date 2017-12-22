//app.js
const AV = require('./libs/av-weapp-min.js');
const utils = require('./libs/utils-min.js');
App({
  onLaunch: function () {
    //初始化应用 YueJIanAide
    AV.init({
      appId: 'u2QEIQNyUNmQOpjWowkS5yn3-gzGzoHsz',
      appKey: 'z6xaaIIaHd9CaQqy3brq3WNs',
    });

    var sysInfo = wx.getSystemInfoSync();
    console.log(sysInfo);
    var rpxTopx = (sysInfo.windowWidth / 750);
    this.globalData.sysInfo = {
      windowWidth: sysInfo.windowWidth,
      windowHeight: sysInfo.windowHeight,
      rpxTopx: rpxTopx,
      platform: sysInfo.platform
    }
    this.initiateReset() 
  },

  onShow: function () {
    console.log('APP-onShow')
  },
  onHide: function () {
    console.log('APP-onHide')
  },
  /**
   * 重置全局信息initiate
   */
  initiateReset(){
    try {
      wx.removeStorageSync('initiate');
      this.globalData.initiate = utils.updateInitiate();
    } catch (e) {
      console.error(e);
    }
  },

  chooseLocation(cb = null, errcb = null){
    var that = this
    wx.chooseLocation({
      success: function (res) {
        typeof cb == "function" && cb(res)
      },
      fail: function (error) {
        console.log(error);
        typeof errcb == "function" && errcb()
      }
    })
  },

  getLocation(cb = null){
    var that = this
    var currentUser = AV.User.current();
    if (currentUser) {
      if (that.globalData.isNotLocation) {
        that.globalData.isNotLocation = false
        wx.getLocation({
          type: 'gcj02',
          success: function (res) {
            that.globalData.isNotLocation = true
            currentUser.set('location', res).save().then(user => {
              typeof cb == "function" && cb()
            }).catch(console.error);
          }, fail: function (error) {
            that.globalData.isNotLocation = true
            console.log(error);
          }
        })
      }
    }
    
  },

  locationSharing(cb = null){
    var that = this
    if (that.globalData.locationTimes == null) {
      that.globalData.isNotLocation = true
      that.globalData.locationTimes = setInterval(function () {
        that.getLocation(cb)
      }, 2000);
    };
  },

  stopLocationSharing(){
    if (this.globalData.locationTimes != null){
      clearInterval(this.globalData.locationTimes)
      this.globalData.locationTimes = null
      this.globalData.isNotLocation = false
    }
  },

  appInit(cb = null, ocb = null, errcb = null){
    var that = this
    this.getUserInfo(function (user) {
      typeof cb == "function" && cb()
    }, function () {
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            try {
              var value = wx.getStorageSync('is_one')
              console.log('value', value)
              wx.hideLoading()
              if (value) {
                console.log('true', value)
                typeof ocb == "function" && ocb()
              } else {
                console.log('null', value)
                let content = '您点击了拒绝授权，将无法正常使用 '
                content += that.globalData.appName + ' 的功能体验。请点击确定进入设置页面进行设置，或者删除小程序重新进入。'
                wx.setStorage({
                  key: "is_one",
                  data: true
                })
                wx.showModal({
                  title: '警告',
                  content: content,
                  success: function (res) {
                    if (res.confirm) {
                      typeof ocb == "function" && ocb()
                    }
                  }
                })
              }
            } catch (e) {
              typeof errcb == "function" && errcb()
            }
          }
        }
      })
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function (cb = null, errcb = null) {
    var that = this
    if (this.globalData.user) {
      typeof cb == "function" && cb(this.globalData.user)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (userInfo) {
              AV.User.loginWithWeapp().then(user => {
                user.set(userInfo)
                  .setUsername(userInfo.userInfo.nickName)
                  .save().then(user => {
                  // 成功，此时可在控制台中看到更新后的用户信息
                  that.globalData.user = user.toJSON();
                  typeof cb == "function" && cb(that.globalData.user)
                }).catch(console.error);
              }).catch(console.error);
            },
            fail: function (error) {
              console.log(error);
              typeof errcb == "function" && errcb()
            }
          })
        }
      })
    }
  },
  globalData: {
    user: null,
    locationTimes: null,
    isNotLocation: false,
    appName: '约见助手',
    initiate: {}
  }
})