
//自定义弹框
var errMasg = $('.weui-dialog__bd');
var dialog = $('#iosDialog2');
var showErr = function (str) {
    errMasg.html(str)
    dialog.show();
}
var ok = function () {
    dialog.hide();
}

//用户id
var openId = sessionStorage.getItem('openId') ? sessionStorage.getItem('openId') : getQueryString('openId');
sessionStorage.setItem('openId', openId);
var sweepstakesId = "";
var article = 'http://mp.weixin.qq.com/s?__biz=MzIyMjQwMTQ4Mg==&tempkey=zsYwH6GtoL5NAL%2BdrUINLcwJFeLVL1xoUsE6fmjHV3M6ff0mMRP1hcIHrPFviKym2TeC9u7TOh7HaV98Xj19RfBTNRtKlNkmYYGb9USbniT04V2J7vKpPFZq%2FTLWNWT48Wq9cbdNbhHmmMmtQT%2B%2F7A%3D%3D&chksm=682f44985f58cd8e155228d6f3fbf9136a05241c354b8da94463107174a5c5a50ae3fbc2c264&mpshare=1&scene=1&srcid=11074EP2BGA69dejnndhEpR0&from=singlemessage#wechat_redirect';
//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return '';
}
var flag=false;
//参加
function goJoin() {
    console.log(sweepstakesId);
    console.log(openId);
    if (openId == '') {
        $('.container').hide();
        $('#modal2').css('display', 'table');
    } else {
        $.ajax({
            type: 'GET',
            url: 'http://test.joyee.org:8080/evaluation/participaentinfo/getexamineifo?sweepstakesId=' + sweepstakesId + '&selectType=0&participantId=' + openId,
            dataType: 'json',
            timeout: 2000,
            success: function (data) {
                console.log(data);
                if (data.status == '90005') {
                    location.href = 'join.html';
                } else if (data.status == '90020') {
                    $('.container').hide();
                    $('#modal2').css('display', 'table');
                } else {
                    if (data.values[0].deleteState == '0') {
                        if (data.values[0].examinePass == 'yes') {
                            $('#loseText').text('你的参赛信息已经通过审核!');
                            $('.container').hide();
                            $('.lose-notice').css('display', 'table');
                            $('.lose-notice').click(function () {
                                $('.container').show();
                                $('.lose-notice').css('display', 'none');
                            })
                        } else {
                            $('#loseText').text('你的参赛信息不符合主题请重新上传!');
                            $('.container').hide();
                            $('.lose-notice').css('display', 'table');
                            $('.lose-notice').click(function () {
                                $('.container').show();
                                $('.lose-notice').css('display', 'none');
                                sessionStorage.setItem('update',true);
                                location.href = 'join.html';
                            })

                        }
                    } else {
                        $('#loseText').text('你的参赛信息已经上传请等待审核!');
                        $('.container').hide();
                        $('.lose-notice').css('display', 'table');
                        $('.lose-notice').click(function () {
                            $('.container').show();
                            $('.lose-notice').css('display', 'none');
                        })
                    }
                }
            },
            error: function () {showErr('检测到您的网络异常，请退出重新打开！')}
        })
    }
};

function removeMake() {
    $('.container').show();
    $('#modal2').css('display', 'none');
}

//投票
function doVote(participantId) {
    console.log(openId);
    if (openId == '') {
        $('.container').hide();
        $('#modal2').css('display', 'table');
    } else {
        $.ajax({
            type: 'post',
            url: 'http://test.joyee.org:8080/evaluation/voting/uploadvotinginfo',
            contentType: 'application/json',
            timeout: 2000,
            data: JSON.stringify({
                voterId: openId,
                participantId: participantId,
                selectType: 0,
                sweepstakesId: sweepstakesId
            }),
            beforeSend: function (xhr) {
                console.log(xhr);
            },
            success: function (data) {
                console.info(data);
                if (data.status == "90000") {

                    $('.container').hide();
                    $('.con-notice').css('display', 'table');
                    $('#goLuckDraw').click(function () {
                        $('.container').show();
                        $('.lose-notice').css('display', 'none');
                        location.href = "luckDraw.html";
                    })
                } else {
                    if (data.status == '90020') {
                        $('.container').hide();
                        $('#modal2').css('display', 'table');
                    }
                    if (data.status == '90057') {
                        //投过票了
                        $('#loseText').text('你今天已经投过票了!');
                        $('.container').hide();
                        $('.lose-notice').css('display', 'table');
                        $('.lose-notice').click(function () {
                            $('.container').show();
                            $('.lose-notice').css('display', 'none');
                        })
                    }
                    if (data.status == '90054') {
                        //                            showErr("投票时间已过!");
                        $('#loseText').text('投票时间已过!');
                        $('.container').hide();
                        $('.lose-notice').css('display', 'table');
                        $('.lose-notice').click(function () {
                            $('.container').show();
                            $('.lose-notice').css('display', 'none');
                        })
                    }
                    if (data.status == '90053') {
                        //                            showErr("投票时间未到!");
                        $('#loseText').text('投票时间未到!');
                        $('.container').hide();
                        $('.lose-notice').css('display', 'table');
                        $('.lose-notice').click(function () {
                            $('.container').show();
                            $('.lose-notice').css('display', 'none');
                        })
                    }
                    if (data.status == '90052') {
                        //                            showErr("活动已经结束!");
                        $('#loseText').text('活动已过结束!');
                        $('.container').hide();
                        $('.lose-notice').css('display', 'table');
                        $('.lose-notice').click(function () {
                            $('.container').show();
                            $('.lose-notice').css('display', 'none');
                        })
                    }
                    if (data.status == '90051') {
                        //                            showErr("活动尚未开始!");
                        $('#loseText').text('投票尚未开始!');
                        $('.container').hide();
                        $('.lose-notice').css('display', 'table');
                        $('.lose-notice').click(function () {
                            $('.container').show();
                            $('.lose-notice').css('display', 'none');
                        })
                    }
                    if (data.status == '90050') {
                        showErr("活动不存在!");
                    }
                }

            },
            error: function () {showErr('检测到您的网络异常，请退出重新打开！')}
        })
    }
}

$(function () {
    //使用fastClick
    FastClick.attach(document.body);
    var $searchBar = $('#searchBar'),
        $searchResult = $('#searchResult'),
        $searchText = $('#searchText'),
        $searchInput = $('#searchInput'),
        $searchClear = $('#searchClear'),
        $searchCancel = $('#searchCancel'),
        $myPrize=$('#myPrize'),
        $closeQrModal = $('#close_modal');

    function hideSearchResult() {
        $searchResult.hide();
        $searchInput.val('');
    }

    function cancelSearch() {
        hideSearchResult();
        $searchBar.removeClass('weui-search-bar_focusing');
        $searchText.show();
    }
    //我的奖品
    $myPrize.on('click',function(){
        location.href="prize.html";
    });

    $closeQrModal.on('click', function () {
        $('#modal2').hide();
        $('.container').show();
    })

    $searchText.on('click', function () {
        $searchBar.addClass('weui-search-bar_focusing');
        $searchInput.focus();
    });
    $searchInput
        .on('blur', function () {
            if (!this.value.length) {
                if(flag)
                {
                    document.body.scrollTop=document.body.scrollTop-1;
                    $('.headlist').empty();
                    $(".dropload-down").remove();
                    getVote();
                }
            }
        })
        .on('keydown',function(e){
            if(e.keyCode=='13')
            {
                flag=true;
                $(".dropload-down").empty();
                $(".dropload-down").append('<div class="dropload-noData">暂无数据</div>');
                //                cancelSearch();
                $searchInput.blur();
                var username = $('#searchInput').val();
                $.ajax({
                    type: 'GET',
                    url: 'http://test.joyee.org:8080/evaluation/participaentinfo/getparticipantinfowechat?sweepstakesId=' + sweepstakesId + '&selectType=0&memberName=' + username,
                    dataType: 'json',
                    timeout: 2000,
                    success: function (data) {
                        $('.headlist').empty();
                        var result = "";
                        for (var i = 0; i < data.values.length; i++) {
                            var imgurl = data.values[i].participantImg + "?imageView2/1/w/127/h/127";
                            console.log(imgurl);
                            result += '<li class="normal">' + '<div class="clearfix">' + '<div class="head-wrap">'
                                //                                                                            +'<div class="head" onClick="$(this).ImgZoomIn();" style="background-image:url(images/yin.jpg)">'
                                + '<div class="head">' + '<img  onclick=openPhotoSwipe("' + data.values[i].participantImg +
                                '") src="' + imgurl + '">' + '</div>' + '</div>' + '<div class="interactive">' +
                                '<p class="title">' + data.values[i].memberName + '</p>' + '<p class="count"><em>' + data.values[
                                    i].ticketNumber + '</em>票</p>' + '</div>' + '</div>' +
                                '<div class="decorative" onclick=doVote("' + data.values[i].participantId + '")>投票</div>' +
                                '</li>';
                        }
                        $('.headlist').append(result);
                    },
                    error: function () {showErr('检测到您的网络异常，请退出重新打开！')}
                })
            }

        });

    //取消搜索 查询全部
    $searchClear.on('click', function () {
        //
        hideSearchResult();
        if(flag)
        {
            document.body.scrollTop=document.body.scrollTop-1;
            $('.headlist').empty();
            $(".dropload-down").remove();
            getVote();
        }

    });

    //搜索
    $searchCancel.on('click', function () {
        flag=true;
        $(".dropload-down").empty();
        $(".dropload-down").append('<div class="dropload-noData">暂无数据</div>');
        //                cancelSearch();
        $searchInput.blur();
        var username = $('#searchInput').val();
        $.ajax({
            type: 'GET',
            url: 'http://test.joyee.org:8080/evaluation/participaentinfo/getparticipantinfowechat?sweepstakesId=' + sweepstakesId + '&selectType=0&memberName=' + username,
            dataType: 'json',
            timeout: 2000,
            success: function (data) {
                $('.headlist').empty();
                var result = "";
                for (var i = 0; i < data.values.length; i++) {
                    var imgurl = data.values[i].participantImg + "?imageView2/1/w/127/h/127";
                    result += '<li class="normal">' + '<div class="clearfix">' + '<div class="head-wrap">'
                        //                                                                            +'<div class="head" onClick="$(this).ImgZoomIn();" style="background-image:url(images/yin.jpg)">'
                        + '<div class="head">' + '<img  onclick=openPhotoSwipe("' + data.values[i].participantImg +
                        '") src="' + imgurl + '">' + '</div>' + '</div>' + '<div class="interactive">' +
                        '<p class="title">' + data.values[i].memberName + '</p>' + '<p class="count"><em>' + data.values[
                            i].ticketNumber + '</em>票</p>' + '</div>' + '</div>' +
                        '<div class="decorative" onclick=doVote("' + data.values[i].participantId + '")>投票</div>' +
                        '</li>';
                }
                $('.headlist').append(result);
            },
            error: function () {showErr('检测到您的网络异常，请退出重新打开！')}
        })

    });
});
//活动主题页面配置
function getsub() {
    $.ajax({
        type: 'GET',
        url: 'http://test.joyee.org:8080/evaluation/sweepstakes/getsweepstakesinfo?selectType=0',
        timeout: 2000,
        success: function (data) {
            if (data.status == '90000' && data.values.length > 0) {
                $('.vote-number-warp').append('<p>参加选手<em>' + data.values[0].memberCount +
                    '</em>人  累计投票<em>' + data.values[0].ticketCount + '</em>票</p>');
                sweepstakesId = data.values[0].sweepstakesId;
                sessionStorage.setItem('voteSub', JSON.stringify(data.values[0]));
                //添加主题轮播图片
                if (data.values[0].sweepstakesImgShowDTOList.length > 0) {
                    document.title = data.values[0].sweepstakesTitle;
                    var rule = data.values[0].sweepstakesNote.split('#');//活动规则
                    var ruleDesc = data.values[0].sweepstakesDesc.split('#');//活动介绍
                    var joinWayDes = data.values[0].arg1;//参与方式
                    var voteRule = '<em>活动介绍</em>';
                    var joinWay = '<em>参与方式</em>';
                    joinWay+='<p>'+joinWayDes+'</p>';
                    for (var i = 0; i < ruleDesc.length; i++) {
                        voteRule += '<p>' + ruleDesc[i] + '</p>';
                    }
                    voteRule += joinWay+'<em>活动开始时间</em>' + '<p>' + data.values[0].startTime + '</p>' + '<em>活动结束时间</em>' +
                        '<p>' + data.values[0].endTime + '</p>' + '<em>活动规则</em>'
                    for (var i = 0; i < rule.length; i++) {
                        voteRule += '<p>' + rule[i] + '</p>';
                    }
                    $('.rule-wrap').append(voteRule);

                    for (var i = 0; i < data.values[0].sweepstakesImgShowDTOList.length; i++) {
                        var newSweepImg = '<li><a href="http://mp.weixin.qq.com/s?__biz=MzIyMjQwMTQ4Mg==&tempkey=zsYwH6GtoL5NAL%2BdrUINLcwJFeLVL1xoUsE6fmjHV3M6ff0mMRP1hcIHrPFviKym2TeC9u7TOh7HaV98Xj19RfBTNRtKlNkmYYGb9USbniT04V2J7vKpPFZq%2FTLWNWT48Wq9cbdNbhHmmMmtQT%2B%2F7A%3D%3D&chksm=682f44985f58cd8e155228d6f3fbf9136a05241c354b8da94463107174a5c5a50ae3fbc2c264&mpshare=1&scene=1&srcid=11074EP2BGA69dejnndhEpR0&from=singlemessage#wechat_redirect"><img src="' + data.values[0].sweepstakesImgShowDTOList[i].sweepstakesImgAdd +
                            '"> </a> </li>';
                        $('#subImgSlide').append(newSweepImg);
                    }
                    $('#slide').swipeSlide();
                    getVote();
                }

            }
        },
        error: function () {showErr('检测到您的网络异常，请退出重新打开！')}
    })
}

//懒加载
function scanLoad(){//扫描需要加载的div
    $.each($(".img-before"),function(i,o){
        var windowHeight=window.innerHeight;
        var scrollTop=document.body.scrollTop;
        if( $(o).offset().top<(scrollTop+windowHeight)  && $(o).offset().top > scrollTop )//判断div是不是出在可见的位置
        {
            var img=$("<img/>").attr({src:$(o).attr("pic"),onclick:$(o).attr("_onclick")});//创建一个可见度为0的图片，地址为div上面的pic属性
            $(o).replaceWith(img);//把div替换成这个新创建的图片
            img.show();//让它慢慢的显示出来
        }
    });
}

//获取参加投票用户列表
function getVote() {
    flag=false;
    var counter = 0;
    // 每页展示
    var num = 4;
    $('.vote-list-wrap').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $('#searchCancel').on('click', function () {
                // 锁定
                me.lock();
                // 无数据
                me.noData();
            });
            $('#searchInput').on('keydown', function () {
                // 锁定
                me.lock();
                // 无数据
                me.noData();
            })
            $.ajax({
                type: 'GET',
                url: 'http://test.joyee.org:8080/evaluation/participaentinfo/getparticipantinfowechat?sweepstakesId=' + sweepstakesId + '&selectType=0&size=' + num + '&page=' + counter,
                dataType: 'json',
                timeout: 5000,
                success: function (data) {
                    if (data.values.length < num) {
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();
                    }
                    var result = '';
                    counter++;
                    for (var i = 0; i < data.values.length; i++) {
                        var imgurl = data.values[i].participantImg + "?imageView2/1/w/127/h/127";
                        result += '<li class="normal">' + '<div class="clearfix">' + '<div class="head-wrap">' +
                            '<div class="head">' + '<div class="img-before" _onclick=openPhotoSwipe("' + data.values[i].participantImg +
                            '") pic="'+imgurl+'">'+
                            '</div></div>' + '</div>' + '<div class="interactive">' +
                            '<p class="title">' + data.values[i].memberName + '</p>' + '<p class="count"><em>' + data.values[
                                i].ticketNumber + '</em>票</p>' + '</div>' + '</div>' + '<div class="decorative" id="' + i +
                            '" onclick=doVote("' + data.values[i].participantId + '")>投票</div>' + '</li>';

                    }

                    $('.headlist').append(result);
                    // 每次数据加载完，必须重置
                    me.resetload();

                },
                error: function (xhr, type) {
                    // showErr('网络异常');
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });
        }
    });
    scanLoad();//扫描需要加载的div
    $(document).scroll(scanLoad);//当滚动条滚动时,扫描需要加载的div
    $("body").scroll(scanLoad);//加这个为了某些浏览器的兼容
    $(window).scroll(scanLoad);//加这个也是为了某些浏览器的兼容
};

//图片预览

function openPhotoSwipe(Imgurl) {
    $.ajax({
        type: 'GET',
        url: Imgurl + '?imageInfo',
        timeout: 2000,
        success: function (data) {
            var items = [
                {
                    src: Imgurl,
                    w: data.width,
                    h: data.height,
                }
            ];
            var pswpElement = document.querySelectorAll('.pswp')[0];

            var options = {
                history: false,
                focus: false,
                showAnimationDuration: 0,
                hideAnimationDuration: 0

            };
            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        },
        error: function () {showErr('检测到您的网络异常，请退出重新打开！')}
    })
}


$(document).ready(function() {
    getsub();
    var url = window.location.href;
    //获取js-sdk
    $.ajax({
        type: "get",//请求方式
        url: "http://changqingshu.joyee.org/weixin/wx?signURL="+url+'&jsonpCallback=?',//发送请求地址
        dataType: "json",
        timeout: 2000,
        // jsonp: "jsonpCallback",//服务端用于接收callback调用的function名的参数
        //请求成功后的回调函数
        success: function (json) {
            appId = json.appId;
            timestamp = json.timestamp;
            nonceStr = json.nonceStr;
            signature = json.signature;

            wx.config({
                debug: false,
                appId: appId,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ]
            });
        },
        error:function () {
            showErr('检测到你的网络异常，请退出重新打开！');
        }
    });

    wx.ready(function () {
        //分享连接
        var shareLink = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxab3918f3e3f05baf&redirect_uri' +
            '=http://changqingshu.joyee.org/weixin/wx&response_type=code&scope=snsapi_base&state=vote#wechat_redirect'
        var title = '常青树'
        var desc = '暖冬相聚，福利大放送'
        var imgUrl = 'http://file.joyee.org/banner2.png'
        //朋友圈分享
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: shareLink, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        //分享给微信好友
        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: shareLink, // 分享链接
            imgUrl: imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        //分享到QQ
        wx.onMenuShareQQ({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: shareLink, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        //分享到QQ空间
        wx.onMenuShareQZone({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: shareLink, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        //分享到腾讯微博
        wx.onMenuShareWeibo({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: shareLink, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    })
});

