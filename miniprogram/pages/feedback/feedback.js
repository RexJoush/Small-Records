// pages/feedback/feedback.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: "",
    message: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 更新email
  onChangeEmail: function (e) {
    console.log(e.detail);
    this.setData({
      email: e.detail
    })
  },

  // 更新 feedback
  onChangeFeedback: function (e) {
    this.setData({
      message: e.detail
    })
  },

  // 提交 feedback
  addFeedback: function (){
    let email = this.data.email;
    let message = this.data.message;

    if (email.trim() == ""){
      wx.showToast({
        icon: 'none',
        title: '请填写邮箱',
      });
    } else if (message.trim() == ""){
      wx.showToast({
        icon: 'none',
        title: '请填写留言',
      });
    } 
    // 不为空则发送请求，添加信息
    else {
      Dialog.confirm({
        // title: '删除',
        message: '添加反馈？',
      }).then(()=>{
        wx.cloud.callFunction({
          name: 'http',
          data: {
            url: '/wxapp/me/addFeedback',
            email: email,
            message: message,
            openid: wx.getStorageSync('openid'),
            nickName: wx.getStorageSync('userInfo').nickName,
          },
  
          // 拿到回复信信
          success: (res) => {
            let result = JSON.parse(res.result).result;
            
            // 成功记录
            if(result == 1){
              wx.showToast({
                icon: 'success',
                title: '感谢您的反馈！',
              });
              // 清空已填写的内容
              this.clear();
            } else {
              wx.showToast({
                icon: 'none',
                title: '反馈失败，请检查网络',
              });
            }
          },
          fail: (res) => {
            wx.showToast({
              icon: 'none',
              title: '反馈失败',
            });
          }
        });
      }).catch(() => {
        // on cancel，取消
        console.log("no");
      });
      
    }

  },

  clear: function(){
    this.setData({
      email: "",
      message: ""
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

  }
})