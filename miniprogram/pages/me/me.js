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

  getUserProfile(e) {
    let that = this;
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("getUserProfile", res);
        wx.setStorageSync('userInfo', res.userInfo);
        wx.setStorageSync('isLogin', true);
        this.setData({
          isLogin: true,
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        });
        wx.cloud.callFunction({
          name: 'http',
          data: {
            url: '/wxapp/index/addUser',
            data: res.userInfo,
          }
        })
      },
      fail: error => {
        console.log("fail error", error);
        wx.showToast({
          icon: 'none',
          title: '如需使用，请同意授权',
        })
      }
    })
  },

  // getUserInfo: function(e) {
  //   console.log("getInfo");
  //   let that = this;
  //   wx.getSetting({
  //     withSubscriptions: true,
  //     success: res => {
  //       if(res.authSetting['scope.userInfo']) {
  //         wx.setStorageSync('userInfo', e.detail.userInfo);
  //         this.setData({
  //           isLogin: true,
  //           avatarUrl: e.detail.userInfo.avatarUrl,
  //           nickName: e.detail.userInfo.nickName
  //         });
  //         wx.cloud.callFunction({
  //           name: 'http',
  //           data: {
  //             url: '/wxapp/index/addUser',
  //             data: e.detail.userInfo,
  //           }
  //         })
  //       } else {
  //         that.onLoad();
  //         wx.showToast({
  //           icon: 'none',
  //           title: '如需使用，请同意授权',
  //         })
  //       }
  //     }
  //   })
  //   wx.setStorageSync('userInfo', e.detail.userInfo);
  //   this.setData({
  //     isLogin: true,
  //     userInfo: e.detail.userInfo
  //   })
  // },

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
    console.log("check login");
    if(wx.getStorageSync('isLogin')) {
      wx.navigateTo({
        url: url,
      });
    } else {
      setTimeout(this.loginFirst,100);
    }
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
    let login = wx.getStorageSync('isLogin');
    let userInfo = wx.getStorageSync('userInfo');
    console.log("onLoad login", login);
    // 已保存用户信息
    if (login){
      this.setData({
        isLogin: true, 
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      });
      
    }
    // 未保存用户信息
    else {
      this.setData({
        isLogin: false,
      })
    }

    // wx.getSetting({
    //   success: res => {
        
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             nickName: res.userInfo.nickName
    //           })
    //         },
    //         fail: error => {
    //           console.log("getUserInfo error", error);
    //         }
    //       })
    //     } else {
    //       console.log("error")
    //     }
    //   },
    //   fail: error => {
    //     console.log(error);
    //   }
    // })
    // let that = this;
    // wx.getSetting({
    //   withSubscriptions: true,
    //   success: res => {
    //     if(res.authSetting['scope.userInfo']) {
    //       that.setData({
    //         isLogin: true
    //       })
    //     } else {
    //       that.setData({
    //         isLogin: false
    //       })
    //     }
    //   },
    // })
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