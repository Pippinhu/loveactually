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
    childList:[
      {id: 1,
      name: '是'},
      {id: 2,
      name: '否'}
      ],
    current:'',
    current_sex:'',
    current_child:'',
    position:'left',
    color:'',
    icon:'',
    message:'',
    pic:'',
    show:''
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
		const share = db.collection('share')
		share.get().then(res => {
      this.setData({
        message:res.data[0].message,
        pic:res.data[0].pic
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
    if(label==this.data.list[0].label){
      this.setData({
        name:event.detail.value
      })
    }else if(label==this.data.list[1].label){
      this.setData({
        year:event.detail.value
      })
    }else if(label==this.data.list[2].label){
      this.setData({
        high:event.detail.value
      })
    }else if(label==this.data.list[3].label){
      this.setData({
        school:event.detail.value
      })
    }else if(label==this.data.list[4].label){
      this.setData({
        company:event.detail.value
      })
    }else if(label==this.data.list[5].label){
      this.setData({
        require:event.detail.value
      })
    }else if(label==this.data.list[6].label){
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
      child: this.data.current_child,
      company: this.data.company,
      require: this.data.require,
      current:this.data.current_sex,
      recommend:this.data.recommend,
      color:this.data.color,
      icon:this.data.icon,
      _id_:this.data.id
    }
    if(this.data.name!==undefined&&this.data.current!==undefined&&this.data.high!==undefined&&
      this.data.year!==undefined&&this.data.company!==undefined&&this.data.recommend!==undefined){
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
      current_sex: detail.value
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

  handleChildChange({ detail = {} }) {
    this.setData({
      current_child: detail.value
    });
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
  
  onShow: function () {
    const db = wx.cloud.database()
    const showPage=db.collection('show')
    showPage.get().then(res=>{
      this.setData({
        show:res.data[0].show
      })
    })
  },

  onShareAppMessage: function (res) {
    return {
      title: this.data.message,
      imageUrl:this.data.pic,
    }
  }
})
