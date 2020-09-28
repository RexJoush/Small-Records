// pages/record/record.js

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: "", // 搜索值
    show: false, // 展示输入框
    title: "",  // 小记录标题
    value: "",  // 输入的小记录内容
    record: '', // 记录数据
    isData: false, // 是否有数据

  },

  // 获取输入的标题
  getTitle: function(e){
    this.setData({
      title: e.detail
    })
  },

  // 获取输入的内容
  getValue: function(e){
    this.setData({
      value: e.detail
    })
  },

  // 确认添加小记录
  confirm: function(){
    console.log("confirm");

    // 获取值
    let title = this.data.title;
    let value = this.data.value;

    // 判断是否为空
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
    } 
    // 不为空则发送请求，添加信息
    else {
      wx.cloud.callFunction({
        name: 'http',
        data: {
          url: '/wxapp/record/addRecord',
          title: title,
          value: value,
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
              title: '记录成功',
            });
            // 清空已填写的内容
            this.clear();
            this.onShow();
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

    let openid = wx.getStorageSync('openid');
    console.log(openid);
    this.clear();
  },

  // 点击添加按钮
  onClickShow() {
    this.setData({ show: true });
  },

  // 隐藏添加页面
  onClickHide() {
    this.setData({ show: false });
  },


  // 获取openid
  getOpenid: function(){
    console.log("bbb");
    wx.cloud.callFunction({
      name: "login",
      success: res => {
        console.log(res.result.openid);
      }
    })
  },

  // 删除记录
  del: function(e) {
    let record_id = e.currentTarget.id;
    // console.log(e.currentTarget.id);
    Dialog.confirm({
      // title: '删除',
      message: '删除此条小记录？',
    })
      .then(() => {
        // on confirm，确认删除
        wx.cloud.callFunction({
          name: "http",
          data: {
            url: "/wxapp/record/delRecord",
            record_id: record_id
          },
          success: (res)=>{
            let result = JSON.parse(res.result).result;
            if(result == 1){
              wx.showToast({
                icon: 'success',
                title: '删除成功',
              });
              
              // 重新加载页面
              this.onShow();

            } else {
              wx.showToast({
                icon: 'none',
                title: '删除失败，请检查网络',
              })
            }
          },
          fail: (res) => {
            wx.showToast({
              icon: 'none',
              title: '删除失败',
            })
          }

        })
      })
      .catch(() => {
        // on cancel，取消
        console.log("no");
      });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 输入搜索
  searchOnChange: function(e){
    // console.log(e.detail);
    this.setData({
      searchValue: e.detail,
    });
  },


  // 搜索
  onSearch: function (){
    console.log(this.data.searchValue);

    // wx.request({
    //   url: 'http://localhost:4001/wxapp/onSearch',
    //   method: "GET",
    //   dataType: "json",
    //   data: {
    //     searchValue: this.data.searchValue
    //   },
    //   success: res => {
    //     console.log(res);
    //   }
    // })


    wx.cloud.callFunction({
      name: 'http',
      data: {
        url: '/wxapp/record/onSearch',
        searchValue: this.data.searchValue,
        openid: wx.getStorageSync('openid')
      },

      success: res => {
        let data = JSON.parse(res.result);
        console.log(data.data.length);
        if(data.data.length == 0){
          wx.showToast({
            title: '未找到记录',
          })
        } else {
          this.setData({
            record: data.data
          })
        }
      }

    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取所有记录
    wx.cloud.callFunction({
      name: 'http',
      data:{
        url: '/wxapp/record/getRecord',
        openid: wx.getStorageSync('openid')
      },
      success: res => {
        let data = JSON.parse(res.result);
        // 获取到了有数据
        if(data.data.length != 0){
          this.setData({
            record: data.data,
            isData: false
          });
        } 
        // 暂未添加数据
        else {
          this.setData({
            record: data.data,
            isData: true
          });
        }
      },

      fail: res => {
        wx.showToast({
          icon: 'none',
          title: '获取数据失败，请检查网络',
        });
      }
    })
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