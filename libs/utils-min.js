const AV = require('./av-weapp-min.js');
const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const types = ['见面', '饭局', '聚会', '约跑', '自定义'];

/**
 * 格式化数字为两位数字符串
 * i: 要格式化的int类型
 */
function formatInt(i) {
  return ("00" + i).substr(-2);
};

/**
 * 格式化 Date 对象中的月和日为字符串
 */
function formatMonthDay(date) {
  var fdate = formatInt(date.getMonth() + 1) + '月';
  fdate += formatInt(date.getDate()) + '日';
  return fdate;
}

/**
 * 获取每个月的天数
 */
function getDay(year, month) {
  var day = 31;
  switch (month) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12:
      day = 31;
      break;
    case 4: case 6: case 9: case 11:
      day = 30;
      break;
    case 2:
      day = 28;
      if (year % 4 == 0) {
        day = 29;
      };
      break;
  }
  return day;
};

/**
 * 获取时间选择器的数据
 */
function getDateTimes(time = null) {
  let now = new Date();
  var obj = {};
  var index = 0,
    today = 0,
    hour = now.getHours(),
    minute = now.getMinutes(),
    _weeks = [],
    days = [],
    hours = [],
    minutes = ['00', '15', '30', '45'];
  switch (true) {
    case minute > 0 && minute <= 15:
      minute = '15';
      index = 1;
      break;
    case minute > 15 && minute <= 30:
      minute = '30';
      index = 2;
      break;
    case minute > 30 && minute <= 45:
      minute = '45';
      index = 3;
      break;
    case minute > 45 && minute <= 60:
      minute = '00';
      index = 0;
      hour += 1;
      if (hour >= 24){
        hour = 0;
        now.setDate(now.getDate()+1);
      };
      break;
  }
  hour = formatInt(hour)
  var year = now.getFullYear(),
    month = now.getMonth() + 1,
    day = now.getDate(),
    week = formatMonthDay(now) + '(' + weeks[now.getDay()] + ')';
  if (time != null) {
    obj = {
      index: 0,
      today: 0,
      year: time.getFullYear(),
      month: time.getMonth() + 1,
      day: time.getDate(),
      week: formatMonthDay(time) + '(' + weeks[time.getDay()] + ')',
      hour: time.getHours(),
      minute: time.getMinutes(),
    }
    switch (obj.minute){
      case 0:
        obj.index = 0;
        break;
      case 15: 
        obj.index = 1;
        break;
      case 30: 
        obj.index = 2;
        break;
      case 45:
        obj.index = 3;
        break;
    }
    let _now = new Date(year + '/' + month + '/' + day);
    let _time = new Date(obj.year + '/' + obj.month + '/' + obj.day);
    var diff = _time - _now;
    obj.today = diff > 0 ? parseInt(diff / 86400000) : 0;
  } else {
    obj = {
      index: index,
      today: today,
      year: year,
      month: month,
      day: day,
      week: week,
      hour: hour,
      minute: minute,
    }
  }
  for (var _hour = 0; _hour < 24; _hour++) {
    hours.push(formatInt(_hour));
  }

  for (var _day = day; _day <= getDay(year, month); _day++) {
    let date = new Date(year + '/' + month + '/' + _day);
    _weeks.push(formatMonthDay(date) + ' ' + weeks[date.getDay()]);
    days.push({
      year: year,
      month: month,
      day: _day,
      week: weeks[date.getDay()],
      str: formatMonthDay(date)
    })
  }
  for (var _month = month + 1; _month <= 12; _month++) {
    for (var _day = 1; _day <= getDay(year, _month); _day++) {
      let date = new Date(year + '/' + _month + '/' + _day);
      _weeks.push(formatMonthDay(date) + ' ' + weeks[date.getDay()]);
      days.push({
        year: year,
        month: _month,
        day: _day,
        week: weeks[date.getDay()],
        str: formatMonthDay(date)
      })
    }
  }
  for (var _month = 1; _month < month; _month++) {
    for (var _day = 1; _day <= getDay((year + 1), _month); _day++) {
      let date = new Date((year + 1) + '/' + _month + '/' + _day);
      _weeks.push(formatMonthDay(date) + ' ' + weeks[date.getDay()]);
      days.push({
        year: (year + 1),
        month: _month,
        day: _day,
        week: weeks[date.getDay()],
        str: formatMonthDay(date)
      })
    }
  }
  return {
    index: obj.index,
    today: obj.today,
    year: obj.year,
    month: obj.month,
    day: obj.day,
    week: obj.week,
    hour: formatInt(obj.hour),
    minute: formatInt(obj.minute),
    weeks: _weeks,
    days: days,
    hours: hours,
    minutes: minutes
  };
};

/**
 * 判断两个对象是否相等
 */
// function equalsObject(x, y) {
//   var in1 = x instanceof Object;
//   var in2 = y instanceof Object;
//   if (!in1 || !in2) {
//     return x === y;
//   }
//   if (Object.keys(x).length !== Object.keys(y).length) {
//     return false;
//   }
//   for (var p in x) {
//     var a = x[p] instanceof Object;
//     var b = y[p] instanceof Object;
//     if (a && b) {
//       return equalsObject(x[p], y[p]);
//     }
//     else if (x[p] !== y[p]) {
//       return false;
//     }
//   }
//   return true;
// };

function isformId(formId) {
  var from_id = '';
  if (formId.match(/^-?[1-9]\d*$/) != null) {
    from_id = formId;
  };
  return from_id;
}

/**
 * 把 Date 对象的日期部分转换为字符串。
 */
function formatDate(d, is_zn = false, is_weeks = false) {
  let date = new Date(d);
  var fdate = '';
  if (is_zn) {
    fdate = date.getFullYear() + '年';
    fdate += formatInt(date.getMonth() + 1) + '月';
    fdate += formatInt(date.getDate()) + '日';
  } else {
    fdate = date.getFullYear() + '-';
    fdate += formatInt(date.getMonth() + 1) + '-';
    fdate += formatInt(date.getDate());
  };
  if (is_weeks) {
    fdate += '(' + weeks[date.getDay()] + ')';
  };
  return fdate;
};

/**
 * 把 Date 对象的时间部分转换为字符串。
 */
function formatTime(date) {
  var str = formatInt(date.getHours()) + ':';
  str += formatInt(date.getMinutes());
  return str;
};

/**
 * 根据 remind 设置对应的 Date 对象
 */
function setRemindDate(r, d) {
  let date = new Date(d);
  let remind = parseInt(r);
  if (remind <= 0) {
    return null;
  } else if (remind < 60) {
    date.setMinutes(date.getMinutes() - remind);
  } else {
    date.setHours(date.getHours() - parseInt(remind / 60));
  };
  return date;
};

/**
 * 获取modify值
 */
function diffDate(initiate) {
  var modify = '';
  let date = new Date(initiate.date);
  let now = new Date();
  var diff = parseInt((now - date) / 1000);
  modify = diff + '秒前';
  if (diff > 60) {
    diff = parseInt(diff / 60)
    modify = diff + '分钟前';
    if (diff > 60) {
      diff = parseInt(diff / 60)
      modify = diff + '小时前';
      if (diff > 24) {
        modify = '';
      };
    };
  };
  return modify;
};

/**
 * 重置或更新全局信息initiate
 */
function updateInitiate(obj = null) {
  try {
    var date = new Date();
    if (obj != null) {
      date = new Date(obj.date);
    };
    var initiate = new Object();
    initiate.yuejian_id = obj == null ? '' : obj.id;
    initiate.participate_id = obj == null ? '' : obj.participate_id;
    initiate.time_default = obj == null ? false : true;
    initiate.location_default = obj == null ? false : true;
    initiate.remind_default = obj == null ? false : true;
    initiate.remind = obj == null ? { name: '-1', value: '提醒' } : obj.remind;
    initiate.location = obj == null ? { name: '地点' } : obj.location;
    initiate.date = date;
    initiate.title = obj == null ? '' : obj.title;
    initiate.remark = obj == null ? '' : obj.remark;
    initiate.type = obj == null ? '见面' : obj.type;
    initiate.is_initiate = true;
    initiate.is_edit = false;
    return initiate;
  } catch (error) {
    console.error(error);
    return {};
  };

};

/**
 * 发起约见
 */
function createYueJian(initiate, formId, cb = null, errcb = null) {
  try {
    var currentUser = AV.User.current();
    if (currentUser) {
      var YueJian = AV.Object.extend('YueJian');
      var yuejian = new YueJian();
      yuejian.set('title', initiate.title);
      yuejian.set('location', initiate.location);
      yuejian.set('remark', initiate.remark);
      yuejian.set('date', initiate.date);
      yuejian.set('type', initiate.type);
      yuejian.save().then(function (obj) {
        try {
          console.log('New object created with objectId: ' + obj.id);
          var Participate = AV.Object.extend('Participate');
          var participate = new Participate()
          participate.set('yuejian', obj);
          participate.set('user', currentUser);
          participate.set('remind', initiate.remind);
          participate.set('date', setRemindDate(initiate.remind.name, initiate.date));
          participate.set('formId', isformId(formId));
          participate.set('name', '发起人');
          participate.save().then(function (pointer) {
            console.log('New object created with objectId: ' + pointer.id);
            typeof cb == "function" && cb(obj.id)
          }, function (error) {
            typeof errcb == "function" && errcb()
            console.error('Failed to create new object, with error message: ' + error.message);
          })
        } catch (error) {
          console.error(error);
          typeof errcb == "function" && errcb()
        };
      }, function (error) {
        console.error('Failed to create new object, with error message: ' + error.message);
        typeof errcb == "function" && errcb()
      });
    }
  } catch (error) {
    console.error(error);
    return;
  };
};

/**
 * 更新约见
 */
function updateYueJian(initiate, formId, cb = null, errcb = null) {
  try {
    var yuejian = AV.Object.createWithoutData('YueJian', initiate.yuejian_id);
    yuejian.fetch().then(function () {
      yuejian.set('title', initiate.title);
      yuejian.set('location', initiate.location);
      yuejian.set('remark', initiate.remark);
      yuejian.set('date', initiate.date);
      yuejian.set('type', initiate.type);
      yuejian.save().then(function (obj) {
        var currentUser = AV.User.current();
        if (currentUser) {
          var query = new AV.Query('Participate');
          var yuejian = AV.Object.createWithoutData('YueJian', obj.id);
          query.equalTo('yuejian', yuejian);
          query.find().then(function (results) {
            try {
              results.forEach(function (participate, index, array) {
                if (initiate.participate_id == participate.id) {
                  let date = setRemindDate(initiate.remind.name, initiate.date);
                  participate.set('remind', initiate.remind);
                  participate.set('isSend', false);
                  participate.set('date', date);
                  participate.set('formId', isformId(formId));
                } else {
                  let date = setRemindDate(participate.get('remind').name, initiate.date);
                  participate.set('date', date);
                }
                participate.save().then(function (pointer) {
                  typeof cb == "function" && cb()
                }, function (error) {
                  typeof errcb == "function" && errcb()
                  console.error('Failed to save participate, with error message: ' + error.message);
                })
              });
            } catch (error) {
              console.error(error);
              typeof errcb == "function" && errcb();
              return;
            };
          });
        };
      }, function (error) {
        console.error('Failed to save yuejian, with error message: ' + error.message);
        typeof errcb == "function" && errcb()
      });
    }, function (error) {
      console.error('Failed to get yuejian, with error message: ' + error.message);
      typeof errcb == "function" && errcb()
    });
  } catch (error) {
    console.error(error);
    typeof errcb == "function" && errcb()
    return;
  };
};

/**
 * 删除约见
 */
function destroyYueJian(yuejian_id, cb = null, errcb = null) {
  try {
    if (yuejian_id == '' || yuejian_id == null) {
      return;
    };
    var query = new AV.Query('Participate');
    var yuejian = AV.Object.createWithoutData('YueJian', yuejian_id);
    query.equalTo('yuejian', yuejian);
    query.find().then(function (results) {
      if (results.length == 0) {
        return;
      };
      AV.Object.destroyAll(results).then(function () {
        yuejian.destroy().then(function (success) {
          typeof cb == "function" && cb();
        }, function (error) {
          console.error('Failed to destroy yuejian, with error message: ' + error.message);
          typeof errcb == "function" && errcb();
        });
      }, function (error) {
        console.error('Failed to destroy participates, with error message: ' + error.message);
        typeof errcb == "function" && errcb();
      });
    });
  } catch (error) {
    console.error(error);
    typeof errcb == "function" && errcb();
    return;
  };
};

/**
 * 获取指定约见信息
 */
function getYueJian(id, cb = null, errcb = null) {
  try {
    var query = new AV.Query('YueJian');
    query.get(id).then(function (yuejian) {
      try {
        var obj = {
          id: yuejian.id,
          participate_id: '',
          remind: { name: '-1', value: '提醒' },
          location: yuejian.get('location'),
          date: yuejian.get('date'),
          title: yuejian.get('title'),
          type: yuejian.get('type'),
          remark: yuejian.get('remark')
        }
        var initiate = updateInitiate(obj)
        console.log(initiate)
        typeof cb == "function" && cb(initiate)
      } catch (error) {
        console.error(error);
        typeof errcb == "function" && errcb()
        return;
      };
    }, function (error) {
      typeof errcb == "function" && errcb()
      console.log(error)
    });
  } catch (error) {
    console.error(error);
    typeof errcb == "function" && errcb();
    return;
  };

};

/**
 * 获取当前用户的约见列表
 */
function getYueJianList(cb = null, errcb = null) {
  try {
    var currentUser = AV.User.current();
    if (currentUser) {
      var query = new AV.Query('Participate');
      query.equalTo('user', currentUser);
      query.descending('updatedAt');
      query.include('yuejian');
      query.find().then(function (results) {
        typeof cb == "function" && cb(results);
      }, function (error) {
        typeof errcb == "function" && errcb();
      });
    }
  } catch (error) {
    console.error(error);
    typeof errcb == "function" && errcb();
    return;
  };
};

/**
 * 获取当前用户的约见列表并处理列表数据
 */
function getYueJianListToIndex(cb = null, errcb = null) {
  getYueJianList(function (results) {
    try {
      if (results.length == 0) {
        typeof cb == "function" && cb([]);
        return
      }
      var start_list = []
      var end_list = []
      var start_dlist = []
      var end_dlist = []
      results.forEach(function (value, index, array) {
        const now = new Date()
        let date = value.get('yuejian').get('date')
        var datestr = formatInt(date.getMonth() + 1) + '月';
        datestr += formatInt(date.getDate()) + '日';
        var obj = {
          id: value.get('yuejian').id,
          participate_id: value.id,
          remind: value.get('remind'),
          location: value.get('yuejian').get('location'),
          date: formatDate(date) + ' ' + formatTime(date),
          datestr: datestr,
          title: value.get('yuejian').get('title'),
          type: value.get('yuejian').get('type'),
          remark: value.get('yuejian').get('remark')
        }
        var d_obj = {
          datestr: datestr,
          title: value.get('yuejian').get('title')
        }
        var diff = date - now
        if (diff > 0) {
          if (diff < (4 * 24 * 60 * 60000)) {
            diff = date.getDate() - now.getDate()
            if (diff < 3) {
              switch (diff) {
                case 0:
                  datestr = '今天'
                  break
                case 1:
                  datestr = '明天'
                  break
                case 2:
                  datestr = '后天'
                  break
              }
              datestr += ' ' + formatTime(date)
              obj.datestr = datestr
              d_obj.datestr = datestr
            }
          } else if (date.getFullYear() > now.getFullYear()) {
            datestr = date.getFullYear() + '年' + datestr
            obj.datestr = datestr
            d_obj.datestr = datestr
          }
          start_dlist.push(d_obj)
          start_list.push(obj)
        } else {
          end_dlist.push(d_obj)
          end_list.push(obj)
        }
      });
      typeof cb == "function" && cb([{
        name: '即将开始',
        list: start_list,
      }, {
        name: '已结束',
        list: end_list,
      }], [{
        name: '即将开始',
        list: start_dlist,
      }, {
        name: '已结束',
        list: end_dlist,
      }]);
    } catch (error) {
      console.error(error);
      typeof errcb == "function" && errcb();
      return;
    };
  }, errcb);
};

/**
 * 获取分享给他人信息体
 */
function getShareAppMessage(id, nickName, type) {
  var title = nickName + '邀请您'
  switch (type) {
    case '见面':
      title += '一起见面'
      break
    case '约跑':
      title += '一起跑步'
      break
    case '饭局':
      title += '加入饭局'
      break
    case '聚会':
      title += '参加聚会'
      break
    default:
      title += '参加' + type
      break
  }
  return {
    title: title,
    path: 'pages/detail/detail?id=' + id,
    success: function (res) {
      console.log('onShareAppMessage-success', res)
    },
    fail: function (res) {
      console.log('onShareAppMessage-fail', res)
    }
  }
};

/**
 * 提交留言
 */
function submitLiuYan(id, value, cb = null, errcb = null) {
  var query = new AV.Query('Participate');
  query.get(id).then(function (participate) {
    participate.set('comments', value);
    participate.save().then(function (pointer) {
      typeof cb == "function" && cb()
    }, function (error) {
      typeof errcb == "function" && errcb()
      console.error('Failed to update object, with error message: ' + error.message);
    })
  }, function (error) {
    typeof errcb == "function" && errcb()
    console.error('Failed to get object, with error message: ' + error.message);
  });
};

/**
 * 参与者取消本次约见
 */
function cancelYueJian(id, cb = null, errcb = null) {
  var participate = AV.Object.createWithoutData('Participate', id);
  participate.destroy().then(function (success) {
    typeof cb == "function" && cb(success)
  }, function (error) {
    typeof errcb == "function" && errcb()
    console.error('Failed to destroy Participate, with error message: ' + error.message);
  });
};

/**
 * 被邀请者确认参与本次约见
 */
function createParticipate(id, cb = null, errcb = null) {
  try {
    var currentUser = AV.User.current();
    if (currentUser) {
      var Participate = AV.Object.extend('Participate');
      var participate = new Participate()
      var yuejian = AV.Object.createWithoutData('YueJian', id);
      participate.set('yuejian', yuejian);
      participate.set('user', currentUser);
      participate.set('name', '参与者');
      participate.save().then(function (pointer) {
        typeof cb == "function" && cb(pointer)
      }, function (error) {
        typeof errcb == "function" && errcb()
        console.error('Failed to create new object, with error message: ' + error.message);
      })
    }
  } catch (error) {
    console.error(error);
    typeof errcb == "function" && errcb()
    return;
  };
};

/**
 * 获取参与者位置列表
 */
function getParticipateLists(id, cb = null, errcb = null){
  try {
    if (id == '' || id == null)
      return
    var currentUser = AV.User.current();
    if (currentUser) {
      var query = new AV.Query('Participate');
      var yuejian = AV.Object.createWithoutData('YueJian', id);
      query.equalTo('yuejian', yuejian);
      query.include('user');
      query.find().then(function (results) {
        typeof cb == "function" && cb(results, currentUser.id)
      });
    }
  } catch (error) {
    console.error(error);
    typeof errcb == "function" && errcb()
    return;
  };
};

/**
 * 加载或更新参与者位置列表
 */
function getLocationList(id, cb = null, errcb = null){
  getParticipateLists(id, function (results, userid){
    if (results.length == 0)
      return
    var markers = []
    var points = []
    var userInfos = []
    var circles = []
    var avatarUrls = []
    var currentIndex = 0
    var count = 0
    results.forEach(function (value, index, array){
      let user = value.get('user');
      let location = user.get('location');
      var isCurrentUser = false;
      if (typeof (location) == "object" && location != null){
        console.log(user.id, typeof (location), location)
        let userInfo = user.get('userInfo');
        if (user.id == userid){
          currentIndex = count;
          isCurrentUser = true;
        }
        markers.push(
          {
            id: count,
            latitude: location.latitude,
            longitude: location.longitude,
            callout: {
              content: userInfo.nickName,
              color: '#2982D2',
              fontSize: 18,
              borderRadius: 50,
              padding: 10,
              bgColor: 'white',
              display: 'ALWAYS'
            },
            iconPath: '/images/locate.png',
            width: 20,
            height: 20,
            anchor: {x: .5, y: .6 }
          }
        );
        circles.push(
          {
            latitude: location.latitude,
            longitude: location.longitude,
            fillColor: '#2982D23A',
            radius: location.horizontalAccuracy
          }
        );
        points.push({
          latitude: location.latitude,
          longitude: location.longitude
        });
        userInfos.push({
          userId: user.id,
          isCurrentUser: isCurrentUser,
          nickName: userInfo.nickName,
          latitude: location.latitude,
          longitude: location.longitude,
          updatedAt: user.get('updatedAt')
        });
        avatarUrls.push(userInfo.avatarUrl);
        count++;
      }
    });
    typeof cb == "function" && cb(markers, circles, points, avatarUrls, userInfos, currentIndex)
  },function(){
    typeof errcb == "function" && errcb()
  })
};

/**
 * 加载或更新参与者列表
 */
function getParticipateList(id, cb = null, errcb = null) {
  getParticipateLists(id, function (results, userid) {
    if (results.length == 0)
      return
    var participates = [];
    var is_initiate = false;
    var is_join = false;
    var id = '';
    var remind = { name: '-1', value: '提醒' };
    var comments = '';
    results.forEach(function (value, index, array) {
      var _is_join = false;
      let comm = value.get('comments') == null ? '' : value.get('comments')
      var name = value.get('name')
      if (value.get('user').id == userid) {
        _is_join = true;
        is_join = true;
        id = value.id;
        remind = value.get('remind');
        comments = comm;
        if (name == '发起人') {
          is_initiate = true;
        } else if (name == '参与者') {
          is_initiate = false;
          name = "已接受";
        };
      };
      let userInfo = value.get('user').get('userInfo');

      participates.push({
        is_join: _is_join,
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        participate: name,
        comments: comm
      });
    });
    typeof cb == "function" && cb({
      id: id,
      is_join: is_join,
      progress: false,
      remind: remind,
      comments: comments,
      is_initiate: is_initiate,
      participates: participates
    });
  }, function () {
    typeof errcb == "function" && errcb()
  })
};

/**
 * 修改提醒
 */
function updateParticipate(formId, initiate, cb = null, errcb = null) {
  try {
    var participate = AV.Object.createWithoutData('Participate', initiate.participate_id);
    participate.fetch().then(function () {
      try {
        let date = setRemindDate(initiate.remind.name, initiate.date);
        participate.set('remind', initiate.remind);
        participate.set('isSend', false);
        participate.set('date', date);
        participate.set('formId', isformId(formId));
        participate.save().then(function (pointer) {
          typeof cb == "function" && cb()
        }, function (error) {
          typeof errcb == "function" && errcb()
          console.error('Failed to save participate, with error message: ' + error.message);
        })
      } catch (error) {
        console.error(error);
        typeof errcb == "function" && errcb()
        return;
      };
    }, function (error) {
      console.error('Failed to get participate, with error message: ' + error.message);
      typeof errcb == "function" && errcb()
    });
  } catch (error) {
    console.error(error);
    typeof errcb == "function" && errcb()
    return;
  };
};

module.exports = {
  types: types,
  diffDate: diffDate,
  formatDate: formatDate,
  formatTime: formatTime,
  getDateTimes: getDateTimes,
  setRemindDate: setRemindDate,
  updateInitiate: updateInitiate,
  createYueJian: createYueJian,
  updateYueJian: updateYueJian,
  destroyYueJian: destroyYueJian,
  getYueJian: getYueJian,
  getYueJianList: getYueJianListToIndex,
  getShareAppMessage: getShareAppMessage,
  submitLiuYan: submitLiuYan,
  cancelYueJian: cancelYueJian,
  createParticipate: createParticipate,
  getParticipateList: getParticipateList,
  getLocationList: getLocationList,
  updateParticipate: updateParticipate
}