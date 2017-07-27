// pages/remind/remind.js
//获取应用实例
var app = getApp()
const utils = require('../../libs/utils-min.js');
var is_edit = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    is_edit: false,
    is_initiate: false,
    items: [
      { name: '5', value: '5分钟前', checked: false },
      { name: '15', value: '15分钟前', checked: false },
      { name: '30', value: '30分钟前', checked: false },
      { name: '60', value: '1小时前', checked: false },
      { name: '120', value: '2小时前', checked: false },
    ]
  },

  formSubmit(event){
    const formId = event.detail.formId
    const initiate = app.globalData.initiate
    wx.showLoading({
      title: '加载中',
    })
    utils.updateParticipate(formId, initiate, function (){
      wx.hideLoading();
      wx.navigateBack();
    });
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var remind = {}
    if (e.detail.value == '0'){
      remind = { name: '0', value: '不提醒', checked: true }
    }else{
      for (var i = 0; i < this.data.items.length; i++){
        if (this.data.items[i].name == e.detail.value){
          this.data.items[i].checked = true
          remind = this.data.items[i]
        }
      }
    }
    app.globalData.initiate.remind = remind
    app.globalData.initiate.remind_default = true
    if (app.globalData.initiate.is_initiate)
      wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let initiate = app.globalData.initiate;
    let remind = initiate.remind;
    let now = new Date();
    let diff = (initiate.date - now)/60000
    var items = this.data.items
    var new_items = []
    console.log(app.globalData.initiate.is_edit)
    if (remind.name == '0') {
      this.setData({
        checked: true,
      })
    } else {
      for (var i = 0; i < items.length; i++) {
        var item = items[i]
        if (item.name == remind.name) {
          item.checked = true
        }
        if (diff > parseInt(item.name)) {
          new_items.push(item)
        }
      }
      this.setData({
        is_edit: initiate.is_edit,
        is_initiate: initiate.is_initiate,
        items: new_items,
      })
    }
    
  }
})