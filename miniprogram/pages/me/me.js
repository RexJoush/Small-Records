// pages/me/me.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatarUrl: '',
    nickName: '',
    isLogin: false,
  },


  getUserInfo: function(e) {
    let that = this;
    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        if(res.authSetting['scope.userInfo']) {
          wx.setStorageSync('userInfo', e.detail.userInfo);
          
          this.setData({
            isLogin: true,
            avatarUrl: e.detail.userInfo.avatarUrl,
            nickName: e.detail.userInfo.nickName
          });
          wx.cloud.callFunction({
            name: 'http',
            data: {
              url: '/wxapp/index/addUser',
              data: e.detail.userInfo,
            }
          })

        } else {
          that.onLoad();
          wx.showToast({
            icon: 'none',
            title: '如需使用，请同意授权',
          })
        }
      }
    })
    wx.setStorageSync('userInfo', e.detail.userInfo);
    this.setData({
      isLogin: true,
      userInfo: e.detail.userInfo
    })
  },

  gotoAboutme: function(){
    wx.navigateTo({
      url: '/pages/aboutme/aboutme',
    })
  },
  
  gotoFeedback: function () {
    this.checklogin('/pages/feedback/feedback');
  },

  // 检查登录
  checklogin: function(url){
    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        console.log(res.authSetting['scope.userInfo']);
        if(res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: url,
          });
        } else {
          setTimeout(this.loginFirst,100);
        }
      }
    })

  },


  // 请先登录
  loginFirst: function(){
    wx.showToast({
      duration: 1500,
      icon: 'none',
      title: '请先登录'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName
              })
            }
          })
        }
      }
    })
    let that = this;
    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        if(res.authSetting['scope.userInfo']) {
          that.setData({
            isLogin: true
          })
        } else {
          that.setData({
            isLogin: false
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
      return {
        title: "小纪念",
        path: 'pages/index/index',
      }
  }
})