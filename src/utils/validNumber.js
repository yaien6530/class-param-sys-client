/**
 * @module validNumber
 * @author: xing
 * @description: xing是一位handsome boy
 * @since: 创建时间  2020-04-08 11:43:28
 */

import { Message } from "element-ui";

function isNumber(value) {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  if (typeof value === "string") {
    //正整数
    var reNumber = /^\d+$/;
    //负整数
    var reNeNumber = /^-\d+$/;
    //正实数
    var reRealNumber1 = /^[1-9]\d*[.]\d+$/; //非零开头
    var reRealNumber2 = /^0[.]\d+$/; //零开头
    //负实数
    var reNeRealNumber1 = /^-[1-9]\d*[.]\d+$/; //非零开头
    var reNeRealNumber2 = /^-0[.]\d+$/; //零开头

    if (
      reNumber.test(value) ||
      reNeNumber.test(value) ||
      reRealNumber1.test(value) ||
      reRealNumber2.test(value) ||
      reNeRealNumber1.test(value) ||
      reNeRealNumber2.test(value)
    ) {
      return true;
    } else {
      return false;
    }
  } else if (typeof value === "number") {
    return true;
  } else {
    return false;
  }
}

//  params是接收的需要校验的值;description是校验失败时需要提示的字段信息;min是最小值，默认为0;max是最大值,默认为9999999;
export function validNumber(params, description, min = 0, max = 9999999) {
  if (!params && params != 0) {
    Message.error(`请输入${description}`);
    console.log("没有输入");
    return false;
  }
  if (!isNumber(params)) {
    Message.error(`${description}请输入数字`);
    return false;
  }
  if (!Number.isInteger(Number(params))) {
    Message.error(`${description}请输入整数`);
    return false;
  }
  if (Number(params) < min) {
    Message.error(`${description}不能小于${min}`);
    return false;
  }
  if (Number(params) > max) {
    Message.error(`${description}不能大于${max}`);
    return false;
  }
  return true;
}
