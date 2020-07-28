//获取应用实例
import { translate } from '../../utils/api.js'

Page({
  data: {
    query: '',   //输入文字
    result: []   //译文结果
  },
  onInput:function(e){
    this.setData({'query':e.detail.value})
  },
  //清除翻译内容与结果
  onTapClose:function(){
    this.setData({query:'',result:[]})
    wx.showToast({
      title: '内容已清空',
      icon: 'success',
      duration: 1200
    })
  },
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
  },
  
})