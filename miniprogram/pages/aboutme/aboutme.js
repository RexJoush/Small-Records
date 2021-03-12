// pages/aboutme/aboutme.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aboutme: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that = this;
    wx.cloud.callFunction({
      name: 'http',
      data: {
        url: '/wxapp/me/getAboutMe'
      },
      success: res=> {
        // console.log(res);
        let data = JSON.parse(res.result);
        that.setData({
          aboutme: data.data[0].about_me
        })
      }
    })

    // wx.request({
    //   url: 'http://localhost:4001/wxapp/getAboutMe',
    //   method: 'GET',
    //   dataType: 'json',
    //   success: res => {
    //     let date = JSON.parse(res.data);
    //     that.setData({
    //       aboutme: date.data[0].aboutme
    //     })
        
    //   }
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

  }
})