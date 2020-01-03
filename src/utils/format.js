/**
 * 格式化时间长度，转换格式为 05:20
 * @param time 秒
 * @returns {string}
 */
function formatTimeLength(time) {
  if (typeof (time) == 'number') {
    //分钟
    let minute = time / 60;
    let minutes = parseInt(minute);
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    //秒
    let second = time % 60;
    let seconds = parseInt(second);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  }
}

/**
 * 时间格式化
 * @param time
 * @param fmt
 * @returns 格式化之后的时间
 */
function formatDate(time, fmt) {
  var date = new Date(time);
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "H+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

/**
 * 将时间戳转换为几个月前，几周前，几天前，几分钟前的形式
 * @param time
 */
function formatDateDiff(time) {
  if(typeof time=='string'){
    time = time.replace(/-/g,'/')
  }
  var timeDate = new Date(time);
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var year = day*365;
  var diffValue = new Date()- timeDate;
  if (diffValue < 0) {
    return formatDate(time,'yyyy-MM-dd');
  }
  var yearC = diffValue / year;
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (yearC >= 1) {
    return parseInt(yearC) + "年前";
  } else if (monthC >= 1) {
    return parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    return parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    return parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    return parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    return parseInt(minC) + "分钟前";
  } else if (minC < 1) {
    return "刚刚";
  } else{
    return "--";
  };
}

/**
 * 数字转换为百分比
 * @param number
 * @returns {string}
 */
function formatPercent(number) {
  if (typeof (number) == 'number') {
    return (number * 100).toFixed(2) + '%';
  }
}

/**
 * 多行文本处理，将换行符转为<br/>
 * @param text
 */
function formatMultiLineText(text) {
  if(text){
    return text.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')
  }
  return '';
}


export default {
  formatTimeLength,
  formatDate,
  formatDateDiff,
  formatPercent,
  formatMultiLineText
}
