### 2020/07/08 新增翻译功能
### 微信小程序-SYF工具箱   
>项目已上线-微信搜索`SYF工具箱`即可访问  
以后预计会添加新的功能   

### 小程序提供的`slider`组件
```javascript
<view class="slider">
  <slider min="1" max="60" show-value="true" activeColor="#e7624f"
  value="{{time}}" bindchange='slideChange'></slider>
</view>
```
小程序是单向数据绑定，当移动时要触发函数改变data中的time
```javascript
slideChange:function(e){
    this.setData({
     time:e.detail.value
    })
  }
```
### 任务选中文字高亮
当选中文字的`index`等于`cateActive`时，会给文字添加一个属性`cate-text-active`
通过自定义属性`data-index`拿到当前点击的`index`,通过`clickCate`函数将这个`index`值赋值给`cateActive`
```javascript
<view class="task-cate">
    <view wx:for="{{cateArr}}" class="cate-item" wx:key="cate" bindtap="clickCate" data-index="{{index}}">
      <view class="cate-item-icon"><image src='../../images/{{item.icon}}.png'/></view>
      <text class="cate-text {{index==cateActive ? 'cate-text-active':''}}">{{item.text}}</text>
    </view>
</view>
```

### Canvas实现时钟倒计时（核心内容）
因为小程序比较简单，时钟界面并不是跳转到另一个页面，而是隐藏原有的任务选择页面，显示时钟页面
两圆环，一动一静
```javascript
<view class="progress">
    <canvas canvas-id="progress-bg" class="progress-bg"></canvas>
    <canvas canvas-id="progress-active" class="progress-active"></canvas>
    <view class="progress-text">{{timeStr}}</view>
</view>
```
静圆函数绘制黑色底环
```javascript
drawBg:function(){
    var lineWidth=6/this.data.rate; //px
    var ctx=wx.createCanvasContext('progress-bg');
    ctx.setLineWidth(lineWidth);
    ctx.setStrokeStyle('#000');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(400/this.data.rate/2,400/this.data.rate/2,400/this.data.rate/2-2*lineWidth,0,2*Math.PI);//注意起始点0的位置再右侧，默认顺时钟旋转
    ctx.stroke();
    ctx.draw();
  }
```

动圆函数（核心）
```javascript
 drawActive:function(){
    var _this=this;
    var currentTime=this.data.time*60*1000-_this.data.mTime
    var timer=setInterval(() => {
      //因为涉及到暂停后继续,所以需要两个参数time是设定的时间，mTime是已经走的时间，剩余时间就是两者相减
      currentTime=currentTime-100  //倒计时文字    
      _this.setData({
        mTime:_this.data.mTime+100   //每100毫秒执行一次，每次时间加100毫秒，并绘图
      })
      //计算动圆绘制的角度
      var step=_this.data.mTime/(_this.data.time*60*1000)*2*Math.PI+1.5*Math.PI
      if(step<3.5*Math.PI){
        //只有整数时执行 倒计时函数
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
          timeStr:"00:00",
          okShow:true,
          pauseShow:false,
          continueCancelShow:false
        })
        clearInterval(timer);
      }
    }, 100);  
    //暴露定时器，供其他函数调用
    this.setData({
      timer:timer
    })
  }
```
### 统计页面
onShow函数，该页面显示时执行，否则启动后无论是否来回切换都只会执行一次
```javascript
onShow: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    var logs = wx.getStorageSync('logs')||[];
    var day = 0; //今日番茄次数
    var total = logs.length; //累计番茄次数
    var dayTime = 0; //今日时长
    var totalTime = 0; //累计时长
    var dayList=[];

    if (logs.length > 0) {
      for (var i = 0; i < logs.length; i++) {
        //当之前保存的时间戳等于当前日期，计算当日的数据
        if ((logs[i].date!==undefined) && logs[i].date.substr(0, 10) == util.formatTime(new Date).substr(0, 10)) {
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
  }
```
