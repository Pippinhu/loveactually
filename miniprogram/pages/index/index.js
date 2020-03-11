//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    active: 0,
    value: '',
    list:'',
    label:'姓名',
    info:[],
    name:'',
    year:'',
    yes:'',
    //当前数据库条数
    count:'',
    id:'',
    focus:'',
    sex:[
      {id: 1,
      name: '女孩'},
      {id: 2,
      name: '男孩'}
      ],
    current:'',
    position:'left',
    color:'',
    icon:''
    
  },

  onLoad: function() {
    const db = wx.cloud.database()
		const list = db.collection('list')
		list.get().then(res => {
      this.setData({
        list:res.data
      })
    })
		const info = db.collection('info')
    //数据总数
		info.count().then(res => {
			this.setData({
        count:res.total
      })
    })
  
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },

  changePage(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  bindKeyInput(event) {
    // event.detail 为当前输入的
    let label=event.currentTarget.id
    if(label=='姓名'){
      this.setData({
        name:event.detail.value
      })
    }else if(label=='出生年份'){
      this.setData({
        year:event.detail.value
      })
    }else if(label=='身高'){
      this.setData({
        high:event.detail.value
      })
    }else if(label=='学历'){
      this.setData({
        school:event.detail.value
      })
    }else if(label=='是否为独生子女'){
      this.setData({
        child:event.detail.value
      })
    }else if(label=='单位'){
      this.setData({
        company:event.detail.value
      })
    }else if(label=='对男女方要求'){
      this.setData({
        require:event.detail.value
      })
    }else if(label=='推荐人微信名'){
      this.setData({
        recommend:event.detail.value
      })
    }
  },

  confirm(){
    const db = wx.cloud.database()
    const info = db.collection('info')
    this.data.id= this.data.count+1
    let data = {
      name: this.data.name,
      high: this.data.high,
      year: this.data.year,
      child: this.data.child,
      company: this.data.company,
      require: this.data.require,
      current:this.data.current,
      recommend:this.data.recommend,
      color:this.data.color,
      icon:this.data.icon,
      _id_:this.data.id
    }
    if(this.data.name!==undefined&&this.data.current!==undefined&&this.data.high!==undefined&&this.data.year!==undefined&&this.data.company!==undefined&&this.data.recommend!==undefined){
      info.add({
        data:data
      }).then(res => {
        wx.showToast({
          title: '添加成功！',
        })
        setTimeout(function () {
          wx.navigateBack({
            url: '../chooseLib/chooseLib'
          })
        }, 1000)
      })
    }else{
      wx.showToast({
        title: '请填写完整后提交',
        icon: 'none',
      })
    }
  },

  handleSexChange({ detail = {} }) {
    this.setData({
      current: detail.value
    });
    if(detail.value==="女孩"){
      this.setData({
        color:'rgba(255,126,167,3)',
        icon:'/images/female.png'
      })
    }else { 
      this.setData({
        color:'rgba(125,182,255,1)',
        icon:'/images/male.png'
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  onShareAppMessage: function () {
    return {
      title: '单身男女来登记！',
      imageUrl: '/images/share.jpg'
    }
  },
})
