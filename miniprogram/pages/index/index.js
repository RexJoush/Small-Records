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

  
  bindGetUserInfo (e) {
    console.log(e.detail.userInfo)
  },

  getTitle: function(e){
    this.setData({
      title: e.detail
    })
  },

  getValue: function(e){
    this.setData({
      value: e.detail
    })
  },

  // 确认添加
  confirm: function(){
    console.log("confirm");

    let title = this.data.title;
    let value = this.data.value;

    if (title.trim() == ""){
      wx.showToast({
        icon: 'none',
        title: '记得填写标题！',
      });
    } else if (value.trim() == ""){
      wx.showToast({
        icon: 'none',
        title: '内容也要写！',
      });
    } else {
      wx.cloud.callFunction({
        name: 'http',
        data: {
          url: '/wxapp/record/addRecord',
          title: title,
          value: value,
          openid: wx.getStorageSync('openid'),
          nickName: wx.getStorageSync('userInfo').nickName,
        },
        success: (res) => {
          let result = JSON.parse(res.result).result;
          if(result == 1){
            wx.showToast({
              icon: 'success',
              title: '记录成功',
            });
            // 清空已填写的内容
            this.clear();
          } else {
            wx.showToast({
              icon: 'none',
              title: '记录失败，请检查网络',
            });
          }
        },
        fail: (res) => {
          wx.showToast({
            icon: 'none',
            title: '记录失败',
          });
        }
      });
    }
  },
  
  // 关闭添加页面并清空填写内容
  clear: function(){
    this.setData({
      title: "",
      value: "",
      show: false
    });
  },

  // 点击取消
  cancel: function(){
    // let openid = wx.getStorageSync('openid');
    // console.log(openid);
    this.clear();
  },


  


  // 点击添加按钮
  onClickShow() {
    // 检查登录信息
    // console.log(this.data.login);

    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        console.log(res.authSetting['scope.userInfo']);
        // console.log(typeof res.authSetting['scope.userInfo']);
        if(res.authSetting['scope.userInfo']) {
          // this.setData({ show: true });

          // 选择添加某个东西
          wx.showActionSheet({
            itemList: ['添加小记录','添加纪念日'],
            success:  res => {
              console.log(res.tapIndex);
              if (res.tapIndex == 0){
                this.setData({ show: true });
              } else {
                this.setData({});
              }
            },
            fail: res => {
              console.log(res.errMsg)
            },
          });

        } else {
          setTimeout(this.loginFirst,100);
          wx.switchTab({
            url: '/pages/me/me',
          });
        }
      }
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
          wx.switchTab({
            url: '/pages/me/me',
          });
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

  // 隐藏添加页面
  onClickHide() {
    this.setData({ show: false });
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
    // console.log(wx.getStorageSync('userInfo'));
    
  }

  
  // onClickShow: function () {
    
  // }
})