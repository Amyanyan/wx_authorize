# wx_authorize
微信小程序重新调起授权（个人信息+地理位置）
# 使用方法
- 我的这个demo是个人信息加地理位置的双重授权
- pages下的authorize文件夹是可以拿来直接用的  复制粘贴到你的pages下就可以了
# 讲解
 总的思路就是现在要么授权通过，进入首页，要么拒绝授权，停留在有授权入口的页面。需要设置一个标志值：`authorizeInfo`，根据此值得真假来决定是渲染首页还是渲染显示重新授权的页面。
  
  在页面显示的时候，获取用户信息与地理位置（当然，这是我所需要的），如果你只需要获取一个信息的话，就不用这么麻烦啦~~  重点看重新调起授权就OK了~~

```
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
```
`authorizeInfo`的设置就要依靠刚刚获取的这两个值了,设置定时器不断执行`authorizeInfo`，直到`userInfo`和`locationInfo`两个值都为`true`就把定时器清除（设置定时器是因为刚开始获取`userInfo`和`locationInfo`可能会失败），当两者都为真时表示所有授权均已通过，跳转至首页。否则，将会一直停留在授权页。

```
//all authorize 
    let timer = setInterval(() => {
      this.authorizeInfo();
      if (this.data.userInfo && this.data.locationInfo){
        clearInterval(timer)                    
      }
    }, 100) 
```

```
  //authorizeInfo
  authorizeInfo: function(){
    if (this.data.userInfo && this.data.locationInfo) {
      this.setData({ authorizeInfo: true })
      //reLaunch
      wx.reLaunch({
        url: '/pages/index/index'
      })
 
    } else {
      this.setData({ authorizeInfo: false })
    }
  }
```

而重新授权这个操作需要调用`wx.openSetting`这个接口，通过返回值判断，用户再次调用授权操作后是否全部授权，是的话跳转至首页，否则停留在授权页。

```
//toAuthorize
  toAuthorize:function(){
    //重新调起授权
    wx.openSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"] && res.authSetting["scope.userLocation"]) {
          this.setData({ authorizeInfo: true })
          //reLaunch
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
```