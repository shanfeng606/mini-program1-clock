## 2020/7/28 更新 添加翻译功能

### 大致思路  
画两个框，上一半为输入框，下一半为输出框，当输入框失去焦点时（需输入框有内容），则发送请求，将获取到的内容展示到输出框上  
通过`onInput`监听输入，将输入内容`e.detail.value`赋给`query`  
失焦后将`query`参数传给`translate`请求函数  
将请求拿到的结果赋给输出框  
`this.setData({ 'result': res.trans_result })`  

<!--more-->

补充：加一个清除按钮，作用将`query`和`result`归零，点击清除时会失焦，为避免发送请求，需判断当前输入框是否有内容，如果没有则返回。

html结构如下：
```html
<!-- 翻译原文 -->
<view class="input-area">
    <text class="iconfont icon-close" bindtap='onTapClose'>清除</text>
    <view class="textarea-wrap">
        <textarea placeholder='请输入要翻译的文本' placeholder-style='color: #8995a1' bindinput='onInput' bindconfirm='onConfirm' bindblur='onConfirm' value="{{query}}"></textarea>
    </view>
</view>
<!-- 翻译结果 -->
<view class="text-area">
    <view class="text-title">翻译结果:</view>
    <view class="text-result">
        <text selectable="true">{{result[0].dst}}</text>
    </view>
</view>
```


### 发送请求（核心）
```js
onConfirm: function () {
    console.log(23)
    //翻译
    if (!this.data.query) return  //空文本的时候不进行翻译,同时避免清除时报错
    console.log(this.data.query)
    translate(this.data.query, { from: 'auto', to: 'auto' }).then(res => {
      //调用 api.js 里面的 Promise
      console.log(res)
      this.setData({ 'result': res.trans_result })
    })
  }
```

### 请求函数：translate.js源码
```js
import md5 from './md5.min.js'

const appid = ''  //注册百度翻译api
const key = ''    //注册百度翻译api

function translate(q, { from = 'auto', to = 'auto' } = { from: 'auto', to: 'auto' }) {
  // { from = 'auto', to = 'auto' } = { from: 'auto', to: 'auto' } 表示默认传递参数传递的值
  //Promise 对象
  return new Promise((resolve,reject)=>{
    let salt =Date.now() //随机码 
    let sign = md5(`${appid}${q}${salt}${key}`)  //生成签名sign：拼接 MD5进行加密
    wx.request({
      url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
      data: {
        q,  //待翻译文本
        from,  //待翻译的原始语言
        to,   //待翻译成的目标语言
        appid,
        salt,  //随机数
        sign   //拼接 MD5进行加密
      },
      success(res) {
        if (res.data && res.data.trans_result) {
          resolve(res.data)
        } else {
          reject({ status: 'error', msg: '翻译失败' })
          wx.showToast({
            title: '翻译失败',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail() {
        reject({ status: 'error', msg: '翻译失败' })
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 3000
        })
      }
    })
  })
}
module.exports.translate = translate
```

### 后期的工作（FLAG）
* 添加多国语言翻译
* 添加翻译历史
* 函数优化，对于输入监听，可节流
