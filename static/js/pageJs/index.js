﻿(function ($) {
    $.learuntab = {
        requestFullScreen: function () {
            var de = document.documentElement;
            if (de.requestFullscreen) {
                de.requestFullscreen();
            } else if (de.mozRequestFullScreen) {
                de.mozRequestFullScreen();
            } else if (de.webkitRequestFullScreen) {
                de.webkitRequestFullScreen();
            }
        },
        exitFullscreen: function () {
            var de = document;
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
        },
        refreshTab: function () {
            var currentId = $('.page-tabs-content').find('.active').attr('data-id');
            var target = $('.LRADMS_iframe[data-id="' + currentId + '"]');
            var url = target.attr('src');
            //$.loading(true);
            target.attr('src', url).load(function () {
                //$.loading(false);
            });
        },
        activeTab: function () {
            var currentId = $(this).data('id');
            if (!$(this).hasClass('active')) {
                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == currentId) {
                        $(this).show().siblings('.LRADMS_iframe').hide();
                        return false;
                    }
                });
                $(this).addClass('active').siblings('.menuTab').removeClass('active');
                $.learuntab.scrollToTab(this);
            }
        },
        closeOtherTabs: function () {
            $('.page-tabs-content').children("[data-id]").find('.fa-remove').parents('a').not(".active").each(function () {
                $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
                $(this).remove();
            });
            $('.page-tabs-content').css("margin-left", "0");
        },
        closeTab: function () {
            var closeTabId = $(this).parents('.menuTab').data('id');
            var currentWidth = $(this).parents('.menuTab').width();
            if ($(this).parents('.menuTab').hasClass('active')) {
                if ($(this).parents('.menuTab').next('.menuTab').size()) {
                    var activeId = $(this).parents('.menuTab').next('.menuTab:eq(0)').data('id');
                    $(this).parents('.menuTab').next('.menuTab:eq(0)').addClass('active');

                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.LRADMS_iframe').hide();
                            return false;
                        }
                    });
                    var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
                    if (marginLeftVal < 0) {
                        $('.page-tabs-content').animate({
                            marginLeft: (marginLeftVal + currentWidth) + 'px'
                        }, "fast");
                    }
                    $(this).parents('.menuTab').remove();
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }
                if ($(this).parents('.menuTab').prev('.menuTab').size()) {
                    var activeId = $(this).parents('.menuTab').prev('.menuTab:last').data('id');
                    $(this).parents('.menuTab').prev('.menuTab:last').addClass('active');
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.LRADMS_iframe').hide();
                            return false;
                        }
                    });
                    $(this).parents('.menuTab').remove();
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }
            }
            else {
                $(this).parents('.menuTab').remove();
                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
                $.learuntab.scrollToTab($('.menuTab.active'));
            }
            return false;
        },
        addTab: function () {
            $(".navbar-custom-menu>ul>li.open").removeClass("open");
            var dataId = $(this).attr('data-id');
            if (dataId != "") {
                //top.$.cookie('nfine_currentmoduleid', dataId, { path: "/" });
            }
            var dataUrl = $(this).attr('href');
            var menuName = $.trim($(this).text());
            var flag = true;
            if (dataUrl == undefined || $.trim(dataUrl).length == 0) {
                return false;
            }
            $('.menuTab').each(function () {
                if ($(this).data('id') == dataUrl) {
                    if (!$(this).hasClass('active')) {
                        $(this).addClass('active').siblings('.menuTab').removeClass('active');
                        $.learuntab.scrollToTab(this);
                        $('.mainContent .LRADMS_iframe').each(function () {
                            if ($(this).data('id') == dataUrl) {
                                $(this).show().siblings('.LRADMS_iframe').hide();
                                return false;
                            }
                        });
                    }
                    flag = false;
                    return false;
                }
            });
            if (flag) {
                var str = '<a href="javascript:;" class="active menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-remove"></i></a>';
                $('.menuTab').removeClass('active');
                var str1 = '<iframe class="LRADMS_iframe" id="iframe' + dataId + '" name="iframe' + dataId + '"  width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
                $('.mainContent').find('iframe.LRADMS_iframe').hide();
                $('.mainContent').append(str1);
                //$.loading(true);
                $('.mainContent iframe:visible').load(function () {
                    //$.loading(false);
                });
                $('.menuTabs .page-tabs-content').append(str);
                $.learuntab.scrollToTab($('.menuTab.active'));
            }
            return false;
        },
        scrollTabRight: function () {
            var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            var tabOuterWidth = $.learuntab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                var tabElement = $(".menuTab:first");
                var offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                scrollVal = $.learuntab.calSumWidth($(tabElement).prevAll());
                if (scrollVal > 0) {
                    $('.page-tabs-content').animate({
                        marginLeft: 0 - scrollVal + 'px'
                    }, "fast");
                }
            }
        },
        scrollTabLeft: function () {
            var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            var tabOuterWidth = $.learuntab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                var tabElement = $(".menuTab:first");
                var offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                if ($.learuntab.calSumWidth($(tabElement).prevAll()) > visibleWidth) {
                    while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                        offsetVal += $(tabElement).outerWidth(true);
                        tabElement = $(tabElement).prev();
                    }
                    scrollVal = $.learuntab.calSumWidth($(tabElement).prevAll());
                }
            }
            $('.page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        },
        scrollToTab: function (element) {
            var marginLeftVal = $.learuntab.calSumWidth($(element).prevAll()), marginRightVal = $.learuntab.calSumWidth($(element).nextAll());
            var tabOuterWidth = $.learuntab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").outerWidth() < visibleWidth) {
                scrollVal = 0;
            } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
                if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                    scrollVal = marginLeftVal;
                    var tabElement = element;
                    while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                        scrollVal -= $(tabElement).prev().outerWidth();
                        tabElement = $(tabElement).prev();
                    }
                }
            } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
                scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
            }
            $('.page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        },
        calSumWidth: function (element) {
            var width = 0;
            $(element).each(function () {
                width += $(this).outerWidth(true);
            });
            return width;
        },
        init: function () {
            $('.menuItem').on('click', $.learuntab.addTab);
            $('.menuTabs').on('click', '.menuTab i', $.learuntab.closeTab);
            $('.menuTabs').on('click', '.menuTab', $.learuntab.activeTab);
            $('.tabLeft').on('click', $.learuntab.scrollTabLeft);
            $('.tabRight').on('click', $.learuntab.scrollTabRight);
            $('.tabReload').on('click', $.learuntab.refreshTab);
            $('.tabCloseCurrent').on('click', function () {
                $('.page-tabs-content').find('.active i').trigger("click");
            });
            $('.tabCloseAll').on('click', function () {
                $('.page-tabs-content').children("[data-id]").find('.fa-remove').each(function () {
                    $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
                    $(this).parents('a').remove();
                });
                $('.page-tabs-content').children("[data-id]:first").each(function () {
                    $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').show();
                    $(this).addClass("active");
                });
                $('.page-tabs-content').css("margin-left", "0");
            });
            $('.tabCloseOther').on('click', $.learuntab.closeOtherTabs);
            $('.fullscreen').on('click', function () {
                if (!$(this).attr('fullscreen')) {
                    $(this).attr('fullscreen', 'true');
                    $.learuntab.requestFullScreen();
                } else {
                    $(this).removeAttr('fullscreen')
                    $.learuntab.exitFullscreen();
                }
            });
        }
    };
    $.learunindex = {
        load: function () {
            $("body").removeClass("hold-transition")
            $("#content-wrapper").find('.mainContent').height($(window).height() - 100);
            $(window).resize(function (e) {
                $("#content-wrapper").find('.mainContent').height($(window).height() - 100);
            });
            $(".sidebar-toggle").click(function () {
                if (!$("body").hasClass("sidebar-collapse")) {
                    $("body").addClass("sidebar-collapse");
                } else {
                    $("body").removeClass("sidebar-collapse");
                }
            })
            $(window).load(function () {
                window.setTimeout(function () {
                    $('#ajax-loader').fadeOut();
                }, 300);
            });
        },
        jsonWhere: function (data, action) {
            if (action == null) return;
            var reval = new Array();
            $(data).each(function (i, v) {
                if (action(v)) {
                    reval.push(v);
                }
            })
            return reval;
        },
        loadMenu: function () {
            var data = [{
                "F_ModuleId": "1",
                "F_ParentId": "0",
                "F_EnCode": "SysManage",
                "F_FullName": "系统管理",
                "F_Icon": "fa fa-desktop",
                "F_UrlAddress": null,
                "F_Target": "expand",
                "F_IsMenu": 0,
                "F_AllowExpand": 1,
                "F_IsPublic": 0,
                "F_AllowEdit": null,
                "F_AllowDelete": null,
                "F_SortCode": 1,
                "F_DeleteMark": 0,
                "F_EnabledMark": 1,
                "F_Description": null,
                "F_CreateDate": null,
                "F_CreateUserId": null,
                "F_CreateUserName": null,
                "F_ModifyDate": "2015-11-17 11:22:46",
                "F_ModifyUserId": "System",
                "F_ModifyUserName": "超级管理员"
            }, {
                "F_ModuleId": "7ae94059-9aa5-48eb-8330-4e2a6565b193",
                "F_ParentId": "1",
                "F_EnCode": "AreaManage",
                "F_FullName": "行政区域",
                "F_Icon": "fa fa-leaf",
                "F_UrlAddress": "/SystemManage/Area/Index",
                "F_Target": "iframe",
                "F_IsMenu": 1,
                "F_AllowExpand": 1,
                "F_IsPublic": 0,
                "F_AllowEdit": null,
                "F_AllowDelete": null,
                "F_SortCode": 1,
                "F_DeleteMark": 0,
                "F_EnabledMark": 1,
                "F_Description": "行政区域管理",
                "F_CreateDate": "2015-11-12 14:38:20",
                "F_CreateUserId": "System",
                "F_CreateUserName": "超级管理员",
                "F_ModifyDate": "2016-04-29 14:05:33",
                "F_ModifyUserId": "System",
                "F_ModifyUserName": "超级管理员"
            }, {
                "F_ModuleId": "2",
                "F_ParentId": "0",
                "F_EnCode": "BaseManage",
                "F_FullName": "单位组织",
                "F_Icon": "fa fa-coffee",
                "F_UrlAddress": null,
                "F_Target": "expand",
                "F_IsMenu": 0,
                "F_AllowExpand": 1,
                "F_IsPublic": 0,
                "F_AllowEdit": null,
                "F_AllowDelete": null,
                "F_SortCode": 2,
                "F_DeleteMark": 0,
                "F_EnabledMark": 1,
                "F_Description": null,
                "F_CreateDate": null,
                "F_CreateUserId": null,
                "F_CreateUserName": null,
                "F_ModifyDate": "2016-03-11 11:02:06",
                "F_ModifyUserId": "0f36148c-719f-41e0-8c8c-16ffbc40d0e0",
                "F_ModifyUserName": "佘赐雄"
            }, {
                "F_ModuleId": "4efd37bf-e3ef-4ced-8248-58eba046d78b",
                "F_ParentId": "1",
                "F_EnCode": "DataItemManage",
                "F_FullName": "通用字典",
                "F_Icon": "fa fa-book",
                "F_UrlAddress": "/SystemManage/DataItemDetail/Index",
                "F_Target": "iframe",
                "F_IsMenu": 1,
                "F_AllowExpand": 1,
                "F_IsPublic": 0,
                "F_AllowEdit": null,
                "F_AllowDelete": null,
                "F_SortCode": 2,
                "F_DeleteMark": 0,
                "F_EnabledMark": 1,
                "F_Description": "通用数据字典",
                "F_CreateDate": "2015-11-12 14:37:04",
                "F_CreateUserId": "System",
                "F_CreateUserName": "超级管理员",
                "F_ModifyDate": "2016-04-29 14:06:26",
                "F_ModifyUserId": "System",
                "F_ModifyUserName": "超级管理员"
            }, {
                "F_ModuleId": "5",
                "F_ParentId": "0",
                "F_EnCode": "FlowManage",
                "F_FullName": "工作流程",
                "F_Icon": "fa fa-share-alt",
                "F_UrlAddress": null,
                "F_Target": "expand",
                "F_IsMenu": 0,
                "F_AllowExpand": 1,
                "F_IsPublic": 0,
                "F_AllowEdit": null,
                "F_AllowDelete": null,
                "F_SortCode": 3,
                "F_DeleteMark": 0,
                "F_EnabledMark": 1,
                "F_Description": null,
                "F_CreateDate": null,
                "F_CreateUserId": null,
                "F_CreateUserName": null,
                "F_ModifyDate": "2016-04-11 10:21:44",
                "F_ModifyUserId": "System",
                "F_ModifyUserName": "超级管理员"
            }, {
                "F_ModuleId": "7adc5a16-54a4-408e-a101-2ddab8117d67",
                "F_ParentId": "1",
                "F_EnCode": "CodeRule",
                "F_FullName": "单据编码",
                "F_Icon": "fa fa-barcode",
                "F_UrlAddress": "/SystemManage/CodeRule/Index",
                "F_Target": "iframe",
                "F_IsMenu": 1,
                "F_AllowExpand": 1,
                "F_IsPublic": 0,
                "F_AllowEdit": null,
                "F_AllowDelete": null,
                "F_SortCode": 3,
                "F_DeleteMark": 0,
                "F_EnabledMark": 1,
                "F_Description": "自动产生号码",
                "F_CreateDate": "2015-11-12 14:47:51",
                "F_CreateUserId": "System",
                "F_CreateUserName": "超级管理员",
                "F_ModifyDate": "2016-05-03 15:56:56",
                "F_ModifyUserId": "System",
                "F_ModifyUserName": "超级管理员"
            }, {
                "F_ModuleId": "7cec0a0f-7204-4240-b009-312fa0c11cbf",
                "F_ParentId": "1",
                "F_EnCode": "DatabaseManage",
                "F_FullName": "数据管理",
                "F_Icon": "fa fa-database",
                "F_UrlAddress": null,
                "F_Target": "expand",
                "F_IsMenu": 0,
                "F_AllowExpand": 1,
                "F_IsPublic": 0,
                "F_AllowEdit": null,
                "F_AllowDelete": null,
                "F_SortCode": 4,
                "F_DeleteMark": 0,
                "F_EnabledMark": 1,
                "F_Description": null,
                "F_CreateDate": "2015-11-12 15:03:09",
                "F_CreateUserId": "System",
                "F_CreateUserName": "超级管理员",
                "F_ModifyDate": "2016-03-11 12:10:01",
                "F_ModifyUserId": "0f36148c-719f-41e0-8c8c-16ffbc40d0e0",
                "F_ModifyUserName": "佘赐雄"
            }, {
                "F_ModuleId": "b9f9df92-8ac5-46e2-90ac-68c5c2e034c3",
                "F_ParentId": "1",
                "F_EnCode": "WeChatManage",
                "F_FullName": "微信管理",
                "F_Icon": "fa fa-weixin",
                "F_UrlAddress": null,
                "F_Target": "expand",
                "F_IsMenu": 0,
                "F_AllowExpand": 0,
                "F_IsPublic": 0,
                "F_AllowEdit": null,
                "F_AllowDelete": null,
                "F_SortCode": 5,
                "F_DeleteMark": 0,
                "F_EnabledMark": 1,
                "F_Description": null,
                "F_CreateDate": "2015-12-22 16:42:12",
                "F_CreateUserId": "System",
                "F_CreateUserName": "超级管理员",
                "F_ModifyDate": "2015-12-22 18:20:30",
                "F_ModifyUserId": "System",
                "F_ModifyUserName": "超级管理员"
            }, {
                "F_ModuleId": "f21fa3a0-c523-4d02-99ca-fd8dd3ae3d59",
                "F_ParentId": "1",
                "F_EnCode": "SystemLog",
                "F_FullName": "系统日志",
                "F_Icon": "fa fa-warning",
                "F_UrlAddress": "/SystemManage/Log/Index",
                "F_Target": "iframe",
                "F_IsMenu": 1,
                "F_AllowExpand": 1,
                "F_IsPublic": 0,
                "F_AllowEdit": null,
                "F_AllowDelete": null,
                "F_SortCode": 6,
                "F_DeleteMark": 0,
                "F_EnabledMark": 1,
                "F_Description": "登录日志、操作日志。异常日志",
                "F_CreateDate": "2015-11-12 15:04:58",
                "F_CreateUserId": "System",
                "F_CreateUserName": "超级管理员",
                "F_ModifyDate": "2016-04-29 14:12:14",
                "F_ModifyUserId": "System",
                "F_ModifyUserName": "超级管理员"
            }, {
                "F_ModuleId": "21",
                "F_ParentId": "1",
                "F_EnCode": "SystemModule",
                "F_FullName": "系统功能",
                "F_Icon": "fa fa-navicon",
                "F_UrlAddress": "/AuthorizeManage/Module/Index",
                "F_Target": "iframe",
                "F_IsMenu": 1,
                "F_AllowExpand": 0,
                "F_IsPublic": 0,
                "F_AllowEdit": null,
                "F_AllowDelete": null,
                "F_SortCode": 7,
                "F_DeleteMark": 0,
                "F_EnabledMark": 1,
                "F_Description": "系统导航功能",
                "F_CreateDate": null,
                "F_CreateUserId": null,
                "F_CreateUserName": null,
                "F_ModifyDate": "2016-04-29 14:13:00",
                "F_ModifyUserId": "System",
                "F_ModifyUserName": "超级管理员"
            }, {
                "F_ModuleId": "b0261df5-7be0-4c8e-829c-15836e200af0",
                "F_ParentId": "1",
                "F_EnCode": "SystemForm",
                "F_FullName": "系统表单",
                "F_Icon": "fa fa-paw",
                "F_UrlAddress": "/AuthorizeManage/ModuleForm/Index",
                "F_Target": "iframe",
                "F_IsMenu": 1,
                "F_AllowExpand": 1,
                "F_IsPublic": 0,
                "F_AllowEdit": null,
                "F_AllowDelete": null,
                "F_SortCode": 8,
                "F_DeleteMark": 0,
                "F_EnabledMark": 1,
                "F_Description": "系统功能自定义表单",
                "F_CreateDate": "2016-04-11 11:19:06",
                "F_CreateUserId": "System",
                "F_CreateUserName": "超级管理员",
                "F_ModifyDate": "2016-04-29 14:14:02",
                "F_ModifyUserId": "System",
                "F_ModifyUserName": "超级管理员"
            }, {
                "F_ModuleId": "cfa631fe-e7f8-42b5-911f-7172f178a811",
                "F_ParentId": "1",
                "F_EnCode": "CodeCreate",
                "F_FullName": "快速开发",
                "F_Icon": "fa fa-code",
                "F_UrlAddress": "/GeneratorManage/Template/Index",
                "F_Target": "iframe",
                "F_IsMenu": 1,
                "F_AllowExpand": 0,
                "F_IsPublic": 0,
                "F_AllowEdit": null,
                "F_AllowDelete": null,
                "F_SortCode": 8,
                "F_DeleteMark": 0,
                "F_EnabledMark": 1,
                "F_Description": "自动生成代码、自动生成功能",
                "F_CreateDate": "2015-11-12 15:21:38",
                "F_CreateUserId": "System",
                "F_CreateUserName": "超级管理员",
                "F_ModifyDate": "2016-04-12 10:52:30",
                "F_ModifyUserId": "System",
                "F_ModifyUserName": "超级管理员"
            }, {
                "F_ModuleId": "a653a69e-5dcc-4ece-b457-fc0875271a88",
                "F_ParentId": "1",
                "F_EnCode": "AppCreate",
                "F_FullName": "移动开发",
                "F_Icon": "fa fa-file-code-o",
                "F_UrlAddress": "/AppManage/AppProjects/Index",
                "F_Target": "iframe",
                "F_IsMenu": 1,
                "F_AllowExpand": 0,
                "F_IsPublic": 0,
                "F_AllowEdit": null,
                "F_AllowDelete": null,
                "F_SortCode": 9,
                "F_DeleteMark": 0,
                "F_EnabledMark": 1,
                "F_Description": "手机移动端开发",
                "F_CreateDate": "2016-06-14 15:57:59",
                "F_CreateUserId": "24a055d6-5924-44c5-be52-3715cdd68011",
                "F_CreateUserName": "陈彬彬",
                "F_ModifyDate": "2016-06-15 16:27:42",
                "F_ModifyUserId": "System",
                "F_ModifyUserName": "超级管理员"
            }];
            var _html = "";
            $.each(data, function (i) {
                var row = data[i];
                if (row.F_ParentId == "0") {
                    if (i == 0) {
                        _html += '<li class="treeview active">';
                    } else {
                        _html += '<li class="treeview">';
                    }
                    _html += '<a href="#">'
                    _html += '<i class="' + row.F_Icon + '"></i><span>' + row.F_FullName + '</span><i class="fa fa-angle-left pull-right"></i>'
                    _html += '</a>'
                    var childNodes = $.learunindex.jsonWhere(data, function (v) {
                        return v.F_ParentId == row.F_ModuleId
                    });
                    if (childNodes.length > 0) {
                        _html += '<ul class="treeview-menu">';
                        $.each(childNodes, function (i) {
                            var subrow = childNodes[i];
                            var subchildNodes = $.learunindex.jsonWhere(data, function (v) {
                                return v.F_ParentId == subrow.F_ModuleId
                            });
                            _html += '<li>';
                            if (subchildNodes.length > 0) {
                                _html += '<a href="#"><i class="' + subrow.F_Icon + '"></i>' + subrow.F_FullName + '';
                                _html += '<i class="fa fa-angle-left pull-right"></i></a>';
                                _html += '<ul class="treeview-menu">';
                                $.each(subchildNodes, function (i) {
                                    var subchildNodesrow = subchildNodes[i];
                                    _html += '<li><a class="menuItem" data-id="' + subrow.F_ModuleId + '" href="' + subrow.F_UrlAddress + '"><i class="' + subchildNodesrow.F_Icon + '"></i>' + subchildNodesrow.F_FullName + '</a></li>';
                                });
                                _html += '</ul>';

                            } else {
                                _html += '<a class="menuItem" data-id="' + subrow.F_ModuleId + '" href="' + subrow.F_UrlAddress + '"><i class="' + subrow.F_Icon + '"></i>' + subrow.F_FullName + '</a>';
                            }
                            _html += '</li>';
                        });
                        _html += '</ul>';
                    }
                    _html += '</li>'
                }
            });
            $("#sidebar-menu").append(_html);
            $("#sidebar-menu li a").click(function () {
                var d = $(this), e = d.next();
                if (e.is(".treeview-menu") && e.is(":visible")) {
                    e.slideUp(500, function () {
                        e.removeClass("menu-open")
                    }),
                        e.parent("li").removeClass("active")
                } else if (e.is(".treeview-menu") && !e.is(":visible")) {
                    var f = d.parents("ul").first(),
                        g = f.find("ul:visible").slideUp(500);
                    g.removeClass("menu-open");
                    var h = d.parent("li");
                    e.slideDown(500, function () {
                        e.addClass("menu-open"),
                            f.find("li.active").removeClass("active"),
                            h.addClass("active");

                        var _height1 = $(window).height() - $("#sidebar-menu >li.active").position().top - 41;
                        var _height2 = $("#sidebar-menu li > ul.menu-open").height() + 10
                        if (_height2 > _height1) {
                            $("#sidebar-menu >li > ul.menu-open").css({
                                overflow: "auto",
                                height: _height1
                            })
                        }
                    })
                }
                e.is(".treeview-menu");
            });
        }
    };
    $(function () {
        $.learunindex.load();
        $.learunindex.loadMenu();
        $.learuntab.init();
    });
})(jQuery);