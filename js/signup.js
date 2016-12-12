/**
 * Created by swing on 2016/10/25.
 */
'use strict'
var sourceLink;
var dialog = $('#iosDialog2');
var  errMasg = $('.weui-dialog__bd');
var userName = $('#username');
var userPhone = $('#userphone');
var confirm = $('#confirm');
var ok = function () {
    dialog.hide();
}
var voteSub;
var openId = sessionStorage.getItem('openId');
var sweepstakesId;
var configId;
var configTitle;
var modal = $('.con-notice');
var qrcodeModal = $('.modal2');
var close = $('.close-con-notice');
var closeQr = $('#close_modal');
var warn = $('#warn');

var configList = {
    'configId':null,
    'participantId':null,
    'configTitle':null,
    'configDesc':null
}

var canUpdate = sessionStorage.getItem('update');

//验证手机正则
var regExp = RegExp('^0?(13|14|15|17|18)[0-9]{9}$');

var showErr = function (str) {
    errMasg.html(str)
    dialog.show();
}

$(function () {
    //使用fastClick
    FastClick.attach(document.body);
    //隐藏微信浏览器分享等菜单
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        WeixinJSBridge.call('hideToolbar');
        WeixinJSBridge.call('hideOptionMenu');
    });
    //选图片文件
    var _picUp = Qiniu.uploader({
        runtimes: 'html5,html4',
        browse_button: 'choose',
        container: 'file-container',
        max_retries: 3,
        max_file_size : '20mb',
        // drop_element: 'container3',
        // flash_swf_url: 'js/plupload/Moxie.swf',
        dragdrop: false,
        chunk_size: '4mb',
        uptoken_url: 'http://101.200.134.232:8880/opera/opera/uploadtoken/',
        get_new_uptoken: true,
        unique_names: true,
        domain: "http://7xsw56.com2.z0.glb.qiniucdn.com/",
        auto_start: true,
        filters : {
            multi_selection: false,
            prevent_duplicates: true,
            // Specify what files to browse for
            mime_types: [
                {title : "img files", extensions : "jpg,png"}
            ]
        },
        init: {
            'FilesAdded': function(up, files) {
            },
            'BeforeUpload': function(up, file) {
                // $('#loadingToast').hide();
            },
            'UploadProgress': function(up, file) {
                $('#loadingToast').show();
                // $('.weui-progress').show();
                // $('.weui-progress__inner-bar').css('width',file.percent);
                $('weui-toast__content').append(file.percent + '%');
            },
            'UploadComplete': function() {
                $('#loadingToast').hide();
                $('choose').hide();
            },
            'FileUploaded': function(up, file, info) {
                $('.weui-progress').hide();
                var domain = up.getOption('domain');
                var res = JSON.parse(info);
                sourceLink = domain + res.key;
                var img = $('.file_wrap');
                img.css('background-image','url('+sourceLink+')');
                // img.attr('src',sourceLink)
            },
            'Error': function(up, err, errTip) {
                showErr(errTip);
            }
        }
    })

    $('weui-progress__opr').on('click',function () {
        _picUp.stop();
    })

    //关闭成功提示
    close.on('click',function () {
        modal.hide();
        window.location.href = 'vote.html';
    })
    
    //关闭二维码弹窗
    closeQr.on('click',function () {
        qrcodeModal.hide();
    })

    userPhone.on('keydown keyup',function () {
        if (!regExp.test(userPhone.val())){
            warn.show();
        }else {
            warn.hide();
        }
    })

    confirm.on('click',function () {

        //更新信息
        if (canUpdate && sourceLink!= null && userName.val()!= '' && regExp.test(userPhone.val())){

            var configDesc = userPhone.val();
            configList.configId = configId;
            configList.configTitle = configTitle;
            configList.participantId = openId;
            configList.configDesc = configDesc;

            $.ajax({
                url:'http://test.joyee.org:8080/evaluation/participaentinfo/updateparticipantinfo',
                type:'post',
                dataType:'json',
                contentType: 'application/json',
                timeout: 2000,
                data:JSON.stringify({
                    participantId: openId,
                    sweepstakesId: sweepstakesId,
                    memberName: userName.val(),
                    participantImg: sourceLink,
                    selectType: '0',
                    configList: [configList]
                }),
                success:function (res) {
                    var code = res.status;
                    var data = res.values;
                    if (code == '90020'){qrcodeModal.css('display','table')}
                    else if (code == '90000'){modal.show()}
                    else if (code == '90051'){showErr('活动未开始')}
                    else if (code == '90055'){showErr('上传信息时间未到，请留意活动规则')}
                    else if (code == '90056'){showErr('抱歉，上传信息时间已过')}
                    return true;
                },
                error:function () {
                    showErr('您的网络有问题，请重试');
                }
            })
        }

        if (sourceLink!= null && userName.val()!= '' && regExp.test(userPhone.val())){
            var configDesc = userPhone.val();
            configList.configId = configId;
            configList.configTitle = configTitle;
            configList.participantId = openId;
            configList.configDesc = configDesc;

            //添加人员
            $.ajax({
                url:'http://test.joyee.org:8080/evaluation/participaentinfo/uploadparticipantinfo',
                type:'post',
                dataType:'json',
                contentType: 'application/json',
                timeout: 2000,
                data:JSON.stringify({
                    participantId: openId,
                    sweepstakesId: sweepstakesId,
                    memberName: userName.val(),
                    participantImg: sourceLink,
                    selectType: '0',
                    configList: [configList]
                }),
                success:function (res) {
                    var code = res.status;
                    var data = res.values;
                    if (code == '90020'){qrcodeModal.css('display','table')}
                    else if (code == '90000'){modal.show()}
                    else if (code == '90051'){showErr('活动未开始')}
                    else if (code == '90055'){showErr('上传信息时间未到，请留意活动规则')}
                    else if (code == '90056'){showErr('抱歉，上传信息时间已过')}
                    return true;
                },
                error:function () {
                    showErr('您的网络有问题，请重试');
                }
            })
        }

        else {showErr('请正确填写所有信息')}
    })
})


$().ready(function () {

    //强制跳转
    if (openId == null || ''){window.location.href = 'vote.html'}else{
        voteSub=JSON.parse(sessionStorage.getItem('voteSub'));
        sweepstakesId=voteSub.sweepstakesId;
    }
    //获取配置
    $.ajax({
        url:'http://test.joyee.org:8080/evaluation/participantconfig/getparticipantconfig?sweepstakesId='
        + sweepstakesId + '&selectType=0',
        type:'get',
        dataType:'json',
        timeout: 2000,
        success:function (res) {
            var data = res.values;
            console.log(data)
            configId = data[0].configId;
            configTitle = data[0].configTitle;
        },
        error:function () {
            showErr('您的网络有问题，请重试');
        }
    })

})


