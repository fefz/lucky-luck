/**
 * Created by Administrator on 2016/11/9.
 */
var openId = sessionStorage.getItem('openId');
var sweepstakesId=JSON.parse(sessionStorage.getItem('voteSub')).sweepstakesId;
$(function(){
   $.ajax({
       type:"GET",
       dataType: 'json',
       timeout: 2000,
       url:"http://test.joyee.org:8080/evaluation/lottery/getlottery?selectType=0&sweepstakesId="+sweepstakesId+"&voterId="+openId,
       success:function(data){
           if(data.values.length){
               for(var i=0;i<data.values.length;i++)
               {
                   var result=  '<li>'
               +'<div class="item">'
                   +'<div class="prize-name ">'+data.values[i].prizeName+'</div>'
                   +'<div class="prize-date ">'+data.values[i].uploadTime+'</div>'
               +'</div>'
               +'</li>'
                   $("#prize-list").append(result);
               }
           }

       },
       error:function(res){

       }
   })

})