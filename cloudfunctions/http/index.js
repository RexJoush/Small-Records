// 云函数入口文件
const cloud = require('wx-server-sdk');
let got = require("got");
let host = "http://www.rexjoush.com:4001";

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  let url = host + "" + event.url;

  const response = await got(url, {
    method: 'GET',
    searchParams:{
      event: JSON.stringify(event),
    },
  });
  return response.body;
}