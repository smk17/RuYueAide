// pages/initiate/initiate.js
//获取应用实例
var app = getApp()
const utils = require('../../../libs/utils-min.js');
var days = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '见面',
    type_name: '见面',
    type_input: true,
    is_picker: false,
    type_input_name: '',
    windowWidth: 355,
    opacity: 0,
    message: ""
  },

  /**
   * 自定义约见类型时，输入框输入事件
   */
  onTypeInput(e){
    var value = e.detail.value
    if (value == '' || value == null){
      value = '约见'
    }
    this.setData({
      type_input_name: e.detail.value,
      type_name: value,
    })
    wx.setNavigationBarTitle({
      title: '编辑' + value
    })
    app.globalData.initiate.type = value
  },

  /**
   * 约见类型更改事件
   */
  bindTypeChange: function (e){
    let value = this.data.types[e.detail.value]
    if (value == '自定义'){
      this.setData({
        type_input: false,
        type_name: value,
        type: value,
        type_input_name: ''
      })
      wx.setNavigationBarTitle({
        title: '编辑' + '约见'
      })
    }else{
      this.setData({
        type_input: true,
        type_name: value,
        type: value
      })
      wx.setNavigationBarTitle({
        title: '编辑' + value
      })
    }
    app.globalData.initiate.type = value
  },

  /**
   * 更新约见
   */
  formSubmit(event){
    var type = this.data.type
    var initiate = app.globalData.initiate;
    let now = new Date();
    let remind_dete = utils.setRemindDate(initiate.remind.name, initiate.date);
    if (type == '自定义') {
      type = this.data.type_name
      if (type == '约见' || type == '自定义') {
        let name = this.data.type_input_name
        console.log(name)
        if (name == '约见' || name == '自定义') {
          this.drawToast('自定义的约见类型不能名为' + name)
        } else {
          this.drawToast('请填写你自定义的约见类型')
        }
        return
      }
    } else if (initiate.title == '') {
      this.drawToast('请填写' + type + '主题')
      return
    } else if (now > initiate.date) {
      this.drawToast('请设置时间(晚于当前时间)')
      return
    } else if (initiate.location.name == '地点') {
      this.drawToast('请选择' + type + '地点')
      return
    } else if (initiate.remind.value == '提醒') {
      this.drawToast('请设置提醒')
      return
    } else if (remind_dete != null && now > remind_dete) {
      this.drawToast('请重新设置提醒(晚于当前时间)')
      return
    } else {
      wx.showLoading({
        title: '加载中',
      })
      const that = this;
      const formId = event.detail.formId;
      utils.updateYueJian(initiate,
        formId, function () {
          wx.hideLoading();
          wx.redirectTo({
            url: '/pages/detail/detail',
          })
        }, function () {
          wx.hideLoading();
        }
      );
    }
  },

  cancel(){
    wx.redirectTo({
      url: '/pages/detail/detail',
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

  /**
   * 标题输入事件
   */
  onInput(e){
    app.globalData.initiate.title = e.detail.value
  },

  /**
   * 备注输入事件
   */
  onTextareaInput(e) {
    app.globalData.initiate.remark = e.detail.value
  },

  /**
   * 选择地点
   */
  chooseLocation() {
    const that = this;
    app.chooseLocation(function (res) {
      that.setData({
        location_default: true,
        location: res,
        is_picker: false
      })
      app.globalData.initiate.location = res
      app.globalData.initiate.location_default = true
    }, function () {
      wx.openSetting();
    })
  },

  /**
   * 设置时间
   */
  bindDateChange: function (e) {
    const val = e.detail.value;
    let year = days[val[0]].year;
    let hour = this.data.hours[val[1]];
    let minute = this.data.minutes[val[2]];
    var str = year + '/' + days[val[0]].month + '/' + days[val[0]].day;
    str += ' ' + hour + ':' + minute;
    app.globalData.initiate.date = new Date(str);
    console.log(new Date(str))
    this.setData({
      year: year,
      week: days[val[0]].str + '(' + days[val[0]].week + ')',
      hour: hour,
      minute: minute,
      time_default: true,
    })
  },

  /**
   * 显示或隐藏时间选择框
   */
  bindSetDateTap() {
    this.setData({
      is_picker: !this.data.is_picker
    })
  },

  /**
   * 隐藏时间选择框
   */
  onFocus() {
    this.setData({
      is_picker: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    try {
      var initiate = app.globalData.initiate;
      var picker = utils.getDateTimes(initiate.date);
      days = picker.days;
      this.setData({
        year: picker.year,
        week: picker.week,
        hour: picker.hour,
        minute: picker.minute,
        weeks: picker.weeks,
        hours: picker.hours,
        minutes: picker.minutes,
        types: utils.types,
        type: initiate.type,
        value: [picker.today, picker.hour, picker.index],
        title: initiate.title,
        remark: initiate.remark,
        time_default: initiate.time_default,
        location_default: initiate.location_default,
        remind_default: initiate.remind_default,
        location: initiate.location,
        windowWidth: app.globalData.sysInfo.windowWidth - 40 * app.globalData.sysInfo.rpxTopx
      })
    } catch (error) {
      console.error(error);
      return;
    };
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var initiate = app.globalData.initiate;
    this.setData({
      remind: initiate.remind,
      remind_default: initiate.remind_default,
      is_picker: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log(getCurrentPages())
    // if (app.globalData.sysInfo.platform != "devtools"){
    //   wx.redirectTo({
    //     url: '/pages/detail/detail',
    //   })
    // }
  }
})