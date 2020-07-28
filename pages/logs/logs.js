//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    dayList: [],  //今日
    list: [],     //将今日或累计赋给这个数组，在wxml中调用数据生成列表
    actionIndex: 0,
    sum: [{
        title: '今日番茄次数',
        val: '0'
      },
      {
        title: '累计番茄次数',
        val: '0'
      },
      {
        title: '今日专注时长',
        val: '0分钟'
      },
      {
        title: '累计专注时长',
        val: '0分钟'
      }
    ],
    cateArr: [{
      icon: 'work',
      text: '工作'
    }, {
      icon: 'study',
      text: '学习'
    }, {
      icon: 'think',
      text: '思考'
    }, {
      icon: 'write',
      text: '写作'
    }, {
      icon: 'sport',
      text: '运动'
    }, {
      icon: 'read',
      text: '阅读'
    }]
  },
  onShow: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    var logs = wx.getStorageSync('logs')||[];
    // 为什么logs里面会有一串数字，哪里来的？
    // logs.pop();
    // console.log(logs)
    var day = 0; //今日番茄次数
    var total = logs.length; //累计番茄次数
    var dayTime = 0; //今日时长
    var totalTime = 0; //累计时长
    var dayList=[];

    if (logs.length > 0) {
      for (var i = 0; i < logs.length; i++) {
        //当之前保存的时间戳等于当前日期，计算当日的数据
        if ((logs[i].date!==undefined) && logs[i].date.substr(0, 10) == util.formatTime(new Date).substr(0, 10)) {
          // if(logs[i].date==util.formatTime(new Date)){
          // console.log(0)
          day = day + 1;
          dayTime = dayTime + parseInt(logs[i].time)
          dayList.push(logs[i])
          this.setData({
            dayList: dayList,
            list: dayList
          })
        }
        //统计所有的计时数据
        if (logs[i].date!==undefined){
          totalTime = totalTime + parseInt(logs[i].time)
        }  
      };
      this.setData({
        'sum[0].val': day,
        'sum[1].val': total,
        'sum[2].val': dayTime ,
        'sum[3].val': totalTime 
      })
    }
  },
  changeType: function (e) { 
    var index = e.currentTarget.dataset.index
    if (index == 0) { //今日
      this.setData({
        list: this.data.dayList
      })
    } else {         //历史
      var logs = wx.getStorageSync('logs') || [];
      this.setData({
        list: logs
      })
    };
    this.setData({
      actionIndex: index
    })
  }
})