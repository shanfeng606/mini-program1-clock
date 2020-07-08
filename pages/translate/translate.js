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
  onConfirm: function () {
    console.log(23)
    //翻译
    // if (!this.data.query) return  //空文本的时候不进行翻译
    console.log(this.data.query)
    translate(this.data.query, { from: 'auto', to: 'auto' }).then(res => {
      //调用 api.js 里面的 Promise
      console.log(res)
      this.setData({ 'result': res.trans_result })
    })
  }
})