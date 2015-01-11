/*

var endDate = new Date();
var page = 1;
endDate.setDate(endDate.getDate()-page);
endDate.setHours(0,0,0,0);

*/
var  dayinms = 24 * 60 * 60 * 1000;
var cdate = Date.now(); 
var startDate = (Math.floor(cdate/dayinms)-1)*dayinms;
console.log('cdate    :' + cdate );
console.log('startDate:' + startDate);