/**
 * Created by csw on 2016/11/10 21:23.
 * Explain:
 */

//用于统一的ajax请求（适用于客户端已经取得授权）
function ApiRequest() {
    this.type = "GET";
    this.params = "";
    this.url = "";
    this.dtd = $.Deferred();
}

ApiRequest.prototype.type;
ApiRequest.prototype.params;
ApiRequest.prototype.url;
ApiRequest.prototype.dtd;

ApiRequest.prototype.send = function () {

    var dtd = this.dtd;

    var aType = this.type;
    var aParams = this.params;
    var aUrl = this.url;
    $.ajax({
        type: aType,
        url: aUrl,
        data: aParams,
        dataType: "json",
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", $.cookie('author_code'));
        },
        success: function (data, state, result) {
            dtd.resolve(data, state, result);
        }
    });

    return dtd.promise();
};