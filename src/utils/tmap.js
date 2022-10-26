/*
 * @Description:
 * @Version: 2.0
 * @Author: Xing
 * @Date: 2020-02-17 11:25:29
 * @LastEditors: Xing
 * @LastEditTime: 2020-06-28 18:36:27
 */

export function TMap() {
  return new Promise(function(resolve, reject) {
    window.init = function() {
      resolve(qq);
    };
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://map.qq.com/api/js?v=2.exp&callback=init&key=JSEBZ-SXZYP-XP5DB-LQ35F-34SJH-RMFXC";
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
