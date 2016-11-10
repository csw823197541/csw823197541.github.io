/**
 * Created by csw on 2016/11/10 21:23.
 * Explain:
 */

//用于统一的ajax请求（适用于客户端已经取得授权）
function ApiRequest() {
    this.type = "";
    this.params = "";
    this.url = "";
}

ApiRequest.prototype.type;
ApiRequest.prototype.params;
ApiRequest.prototype.url;

//ApiRequest.prototype.get = function () {
//    var defer = $.Deferred();
//
//    var aType = this.type;
//    var aParams = this.params;
//    var aUrl = this.url;
//    $.ajax({
//        type: aType,
//        url: aUrl,
//        data: aParams,
//        beforeSend: function (xhr) {
//            xhr.setRequestHeader("Authorization", $.cookie('author_code'));
//        },
//        success: function (result) {
//            defer.resolve(result);
//        }
//    });
//
//    return defer.promise();
//};

ApiRequest.prototype.send = function () {
    $.ajax({
        type: this.type,
        url: this.url,
        data: this.params,
        //返回数据的格式
        dataType: "json",
        //提交json对象格式
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", $.cookie('author_code'));
        },
        success: function (data, state, result) {
            console.log("state:" + state);
            console.log("success result:" + JSON.stringify(data));
            if (state == 'success') {
                alertTip("success");
                refreshData(apiObjUrl);
            } else {
                alertTip("error");
            }
        },
        error: function (result, state) {
            console.log("state: " + state + ", status: " + result.status + ", statusText: " + result.statusText);
            alertTip("error");
        }
    });
};