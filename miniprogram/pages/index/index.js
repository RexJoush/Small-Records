//index.js
const app = getApp()
Page({

  data: {
    show: false,
    notice: "",
    title: "",
    value: "",
    login: "",
  },

  gotoEdition: function(){
    wx.navigateTo({
      url: '/pages/edition/edition',
    })
  },

  // 点击我的小记录
  gotoRecord: function(){
    this.checklogin('/pages/record/record');
    // wx.getSetting({
    //   withSubscriptions: true,
    //   success: res => {
    //     console.log(res.authSetting['scope.userInfo']);
    //     // console.log(typeof res.authSetting['scope.userInfo']);
    //     if(res.authSetting['scope.userInfo']) {
    //       wx.navigateTo({
    //         url: '/pages/record/record',
    //       });
    //     } else {
    //       setTimeout(this.loginFirst,100);
    //       wx.switchTab({
    //         url: '/pages/me/me',
    //       });
    //     }
    //   }
    // })

  },

  gotoAnniversary: function(){
    this.checklogin('/pages/anniversary/anniversary');
  },


  // 检查登录
  checklogin: function(url){

    let login = wx.getStorageSync('isLogin');
    console.log("login ", login);
    console.log("canIUse", wx.canIUse('getUserProfile'));

    if(wx.getStorageSync('isLogin')) {
      wx.navigateTo({
        url: url,
      });
    } else {
      setTimeout(this.loginFirst,100);
      wx.switchTab({
        url: '/pages/me/me',
      });
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

  onLoad: function() {
    let that = this;

    // 获取 openid
    wx.cloud.callFunction({
      name: "login",
      success: res => {
        // console.log(res.result);
        wx.setStorageSync('openid', res.result.openid);
      }
    });

    // 获取 notice
    wx.cloud.callFunction({
      name: 'http',
      data: {
        url: '/wxapp/index/getNotice',
      },
    
      success: (res) => {
        // console.log(JSON.parse(res.result).data[0].content);
        let notice = JSON.parse(res.result).data[0].content;
        this.setData({
          notice: notice,
        });
      }
    });
    
  },
  onShareAppMessage: function (res) {
    return {
      title: "小纪念",
      path: 'pages/index/index',
    }
  }
})