// pages/authorize/authorize.js
Page({

  data: {
  
  },

  onLoad: function (options) {

  },

  //authorizeInfo
  authorizeInfo: function(){
    if (this.data.userInfo && this.data.locationInfo) {
      this.setData({ authorizeInfo: true })
      //reLaunch
      wx.showLoading({
        title: '加载中',
      })
      wx.reLaunch({
        url: '/pages/index/index'
      })
 
    } else {
      this.setData({ authorizeInfo: false })
    }
  },

  //toAuthorize
  toAuthorize:function(){
    //重新调起授权
    wx.openSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"] && res.authSetting["scope.userLocation"]) {
          this.setData({ authorizeInfo: true })
          //reLaunch
          wx.showLoading({
            title: '加载中',
          })
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }else{
          this.setData({ authorizeInfo: false })
        }
      },
      fail: (res) => {
        console.log("授权失败")
      }
    })
  },

  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // userInfo
    wx.getUserInfo({
      success:res=>{
        this.setData({userInfo : true})
      },
      fail:res=>{
        this.setData({ userInfo: false })
      }
    })
    // locationInfo
    wx.getLocation({
      success: res => {
        this.setData({ locationInfo: true })
      },
      fail: res => {
        this.setData({ locationInfo: false })
      }
    })

    //all authorize 
    let timer = setInterval(() => {
      this.authorizeInfo();
      if (this.data.userInfo && this.data.locationInfo){
        clearInterval(timer)                    
      }
    }, 100) 
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})