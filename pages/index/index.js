//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    time:'30',
    rate:'',
    clockShow:false,
    mTime:0,
    timer:null, //把计时器暴露出来，供其他函数调用
    timeStr:'05:00',
    cateArr:[
      {
        icon:'work',
        text:'工作'
      },{
        icon:'study',
        text:'学习'
      },{
        icon:'alert',
        text:'提醒'
      },{
        icon:'write',
        text:'写作'
      },{
        icon:'amuse',
        text:'娱乐'
      },{
        icon:'read',
        text:'阅读'
      }
    ],
    cateActive:'0',
    okShow:false,
    pauseShow:true,
    continueCancelShow:false
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
    //系统设备信息
    var res=wx.getSystemInfoSync();
    var rate=750 / res.windowWidth;
    this.setData({
      rate:rate
    })
    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  slideChange:function(e){
    this.setData({
     time:e.detail.value
    })
  },
  clickCate:function(e){
    this.setData({
      cateActive:e.currentTarget.dataset.index
    })
  },
  // 开始计时按钮 
  start:function(){
    this.setData({
      clockShow:true,
      timeStr:parseInt(this.data.time)>=10 ? this.data.time+':00':'0'+ this.data.time+':00'
    })
    this.drawBg();
    this.drawActive();
    
  },

  // 返回按钮 
  clock:function(){
    this.setData({
      clockShow:false,
      timeStr:'05:00'
    }) 
  },
  // 动圆函数 
  drawActive:function(){
    var _this=this;
    var currentTime=this.data.time*60*1000-_this.data.mTime
    var timer=setInterval(() => {
      currentTime=currentTime-100  //倒计时文字
      
      _this.setData({
        mTime:_this.data.mTime+100   //每100毫秒执行一次，每次时间加100毫秒，并绘图
      })
      var step=_this.data.mTime/(_this.data.time*60*1000)*2*Math.PI+1.5*Math.PI
      
      if(step<3.5*Math.PI){
        if(currentTime % 1000){
          var time_all=currentTime / 1000;  //获得倒计时文字总秒数
          var time_m=(parseInt(time_all / 60)>=10)?parseInt(time_all / 60):('0'+parseInt(time_all / 60))                 //获得倒计时文字分钟
          var time_s=(parseInt(time_all % 60)>10)?parseInt(time_all % 60):'0'+parseInt(time_all % 60);                 //获得剩余倒计时秒数
          _this.setData({
            timeStr:time_m+':'+time_s
          })
        }
        //开始绘制动圆，每100ms绘制一次
        var lineWidth=6/_this.data.rate; //px
        var ctx=wx.createCanvasContext('progress-active');
        ctx.setLineWidth(lineWidth);
        ctx.setStrokeStyle('#fff');
        ctx.setLineCap('round');
        ctx.beginPath();
        ctx.arc(400/_this.data.rate/2,400/_this.data.rate/2,400/_this.data.rate/2-2*lineWidth,1.5*Math.PI,step);
        ctx.stroke();
        ctx.draw();
      }else{
        // 将完成的数据记录到日志
        var logs=wx.getStorageSync('logs')||[];
        logs.unshift({
          date:util.formatTime(new Date),
          cate:_this.data.cateActive,
          time:_this.data.time
        });
        // console.log(logs); 
        wx.setStorageSync('logs', logs)//把数据加到缓存
        _this.setData({
          timeStr:"00:00",//这部分好像多余？
          okShow:true,
          pauseShow:false,
          continueCancelShow:false
        })
        clearInterval(timer);
      }
    }, 100); 
    //暴露计时器，供其他函数调用 
    this.setData({
      timer:timer
    })
  },
  // 静圆函数 
  drawBg:function(){
    var lineWidth=6/this.data.rate; //px
    var ctx=wx.createCanvasContext('progress-bg');
    ctx.setLineWidth(lineWidth);
    ctx.setStrokeStyle('#000');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(400/this.data.rate/2,400/this.data.rate/2,400/this.data.rate/2-2*lineWidth,0,2*Math.PI);
    ctx.stroke();
    ctx.draw();
  },
  // 暂停按钮 
  pause:function(){
    clearInterval(this.data.timer)
    this.setData({
      pauseShow:false,
      continueCancelShow:true,     
    })
  },
   continue:function(){
     this.drawActive()
     this.setData({
       pauseShow:true,
       continueCancelShow:false
     })
   },
  //  放弃按钮 ---与完成按钮功能相同
  cancel:function(){
    clearInterval(this.data.timer);
    this.setData({
      pauseShow:true,
      continueCancelShow:false,  
      clockShow:false,
      mTime:0   //白圈走的路清零
    })
  }
})
