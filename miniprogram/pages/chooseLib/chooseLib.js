
Page({
  data: {
    info:[],
    active: 0,
    color:"",
    imgUrl:"",
    totalCount:0,
    show:false
  },

  onLoad: function () {
    this.getAllinfo()
  },

  toForm:function(){
    wx.navigateTo({
      url:'../index/index'
    })
  },

  getAllinfo:function(){
    const db = wx.cloud.database()
    const source=db.collection('source')
    source.get().then(res=>{
      this.setData({
        imgUrl:res.data[0].imgUrl
      })
    })
		const info = db.collection('info')
		// 获取数据总数
		info.count().then(res => {
      this.setData({
        totalCount: res.total
      })
		}).catch(err => {
			console.error(err)
		})
		try{ 
      info.limit(15)
          .orderBy('_id_', 'asc')
          .get()
          .then(res => {
            this.setData({
            info:res.data
            })
          }).catch(err => {
            console.error(err)
            wx.hideNavigationBarLoading();//hide loading 
            wx.stopPullDownRefresh();
          })
        }catch(err){
          console.error(err)
          wx.hideNavigationBarLoading();//hide loading 
          wx.stopPullDownRefresh();
        }
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

  onReachBottom:function () {
		const db = wx.cloud.database()
		const info = db.collection('info')
		let temp = [];
		let length = this.data.info.length
		if (length < this.data.totalCount) {
			try {
				info.skip(length)
						 .limit(10)
						 .orderBy('_id_', 'asc')
						 .get().then(res => {
								if (res.data.length > 0) {
									for (let i = 0; i < res.data.length; i++) {
									temp.push(res.data[i])
								}
              
              this.setData({
                info:this.data.info.concat(temp)
              })
						} else {
							wx.showToast({
								title:"没有更多啦"
							})
						}
					}).catch(err => {
						console.error(err)
					})
			} catch(err) {
				console.error(err)
			}
		} else {
			wx.showToast({
				title:"没有更多啦"
			})
    }
  },

  onShareAppMessage: function () {
    return {
      title: '单身男女前来登记',
      imageUrl: '/images/share.jpg'
    }
  },
})