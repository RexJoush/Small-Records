// pages/record/record.js

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    // searchValue: "",
    title: '', // 纪念日输入标题
    anniversary: "", // 纪念日的数据
    currentDate: new Date().getTime(), // 今天
    minDate: new Date(1930, 1, 1).getTime(), // 最早可选日期
    maxDate: new Date(2050, 1, 1).getTime(), // 最晚可选日期
    show: false, // 添加纪念日框显示
    date: '', // 纪念日的日期

    dateSelectshow: false, // 日期选择框

    isData: false, // 是否有数据

    // formatter(type, value) {
    //   if (type === 'year') {
    //     return `${value}年`;
    //   }
    //   if (type === 'month') {
    //     return `${value}月`;
    //   }
    //   return value;
    // },

  },

  // 删除记录
  del: function(e) {
    let anniversary_id = e.currentTarget.id;
    Dialog.confirm({
      // title: '删除',
      message: '删除此条纪念日？',
    })
      .then(() => {
        // on confirm，确认删除
        wx.cloud.callFunction({
          name: "http",
          data: {
            url: "/wxapp/anniversary/delAnniversary",
            anniversary_id: anniversary_id
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


  // 获取输入的标题
  getTitle: function(e){
    this.setData({
      title: e.detail
    })
  },


  // 获取日期差值
  getDateDiff: function(date) {

    let date1 = new Date(this.data.currentDate).getTime();
    let date2 = new Date(date).getTime();
    let diff = date1 - date2;

    return Math.floor(diff / 1000 / 60 / 60 / 24);
  },

  // 确认添加纪念日
  confirm: function(){
    // console.log("confirm");

    // 获取值
    let title = this.data.title;
    let date = this.data.date;

    console.log(title);
    console.log(date);
    let diff = this.getDateDiff(date);
    console.log(diff);

    if(diff < - 3650){
      console.log("so long");
      Toast('太远的事就不要考虑啦，活在当下，着眼未来！');
    } else {
      // 判断是否为空
      if (title.trim() == ""){
        wx.showToast({
          icon: 'none',
          title: '记得填写标题！',
        });
      } 

      // 不为空则发送请求，添加信息
      else {
        wx.cloud.callFunction({
          name: 'http',
          data: {
            url: '/wxapp/anniversary/addAnniversary',
            title: title,
            date: date,
            openid: wx.getStorageSync('openid'),
            nickName: wx.getStorageSync('userInfo').nickName,
          },

          // 拿到回复信信
          success: (res) => {
            let result = JSON.parse(res.result).result;
            console.log(res);
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
    }
    
    
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // 获取所有记录
    wx.showLoading({
      title: '获取数据',
    })
    let openid = wx.getStorageSync('openid');
    console.log(openid);
    console.log("userInfo", wx.getStorageSync('userInfo'));

    wx.cloud.callFunction({
      name: 'http',
      data: {
        url: '/wxapp/anniversary/getAnniversary',
        openid: openid
      },
      success: res => {
        let data = JSON.parse(res.result);

        // console.log("length");
        // console.log(data.data.length);

        // 获取到了有数据
        if(data.data.length != 0){
          wx.hideLoading({
            success: (res) => {
            },
          })
          this.setData({
            anniversary: data.data,
            isData: false
          });
          
        } 
        // 暂未添加数据
        else {
          wx.hideLoading({
            success: (res) => { 
            },
          })
          this.setData({
            anniversary: data.data,
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

  // 点击输入弹框的取消
  cancel: function(){
    this.clear();
  },

  // 点击页面底端的添加按钮
  onClickShow() {
    this.setData({ show: true });
  },

  // 隐藏添加页面
  onClickHide() {
    this.setData({ show: false });
  },

  // 清空已写的记录
  clear: function(){
    this.setData({
      title: "",
      value: "",
      show: false
    });
  },



  /* 
    日期选择部分
  */
  // 弹出日期选择框
  showPopup() {
    this.setData({ dateSelectshow: true });
  },

  // 关闭日期选择框
  onClose() {
    this.setData({ dateSelectshow: false });
  },


  // 日期选择点击了确定键
  dateSelectConfirm: function (e){

    console.log("点击确定了");

    this.dateSelectInput(e);

    // console.log(this.data.currentDate);
    // console.log(date2)
    // this.setData({
    //   currentDate: date2
    // })
    this.onClose();
    // console.log(e);
  },

  // 日期选择点击了取消键
  dateSelectCancel: function (){
    this.onClose();
    console.log("点击取消了");  
  },


  // 更新当前选择的日期
  dateSelectInput: function(event) {
    const { detail, currentTarget } = event;
    let result = this.getResult(detail, currentTarget.dataset.type);
    console.log(result);
    this.setData({
      date: result
    });
  },
  // dateSelectInput(event) {
    
  //   const { detail, currentTarget } = event;
  //   const result = this.getResult(detail, currentTarget.dataset.type);
  //   console.log(result);
  //   this.setData({
  //     date: result
  //   })
  // },

  // 获得日期
  getResult(time, type) {
    const date = new Date(time);
    switch (type) {
      case 'datetime':
        return date.toLocaleString();
      case 'date':
        return date.toLocaleDateString();
      case 'year-month':
        return `${date.getFullYear()}/${date.getMonth() + 1}`;
      case 'time':
        return time;
      default:
        return '';
    }
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
  // searchOnChange: function(e){
  //   // console.log(e.detail);
  //   this.setData({
  //     searchValue: e.detail,
  //   });
  // },


  // 搜索
  // onSearch: function (){
  //   console.log(this.data.searchValue);

  //   wx.cloud.callFunction({
  //     name: 'http',
  //     data: {
  //       url: '/wxapp/onSearch',
  //       searchValue: this.data.searchValue,
  //       openid: wx.getStorageSync('openid')
  //     },

  //     success: res => {
  //       let data = JSON.parse(res.result);
  //       console.log(data.data.length);
  //       if(data.data.length == 0){
  //         wx.showToast({
  //           title: '未找到记录',
  //         })
  //       } else {
  //         this.setData({
  //           record: data.data
  //         })
  //       }
  //     }

  //   })
  // },

  

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