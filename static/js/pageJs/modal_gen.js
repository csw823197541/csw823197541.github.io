/**
 * Created by csw on 2016/11/10 17:24.
 * Explain:
 */
function ModalGen() {

}

ModalGen.prototype.modalID;
ModalGen.prototype.saveButtonID;
ModalGen.prototype.validates;
ModalGen.prototype.editFields = new Array();

ModalGen.prototype.bind = function () {
    window.onload = this.init();
    this.createOrUpdate();
};

ModalGen.prototype.init = function () {

};

ModalGen.prototype.createOrUpdate = function () {
    var $modal = $('#' + this.modalID);
    var saveObj = $('#' + this.saveButtonID);
    var val = this.validates;
    var fields = this.editFields;
    saveObj.click(function() {
        var rules = val;
        new validate({
            rules: rules,
            focusInvalid: false,
            submitFun: function () {
                var params = '';
                for (var item in fields) {
                    params += '"' + fields[item] + '":"' + $('#' + fields[item]).val() + '",'
                }
                params = params.substring(0, params.length - 1);
                params = "{" + params + "}";
                //params = JSON.parse(params);
                var id = $('#id').val();//取得隐藏id控件的值，用来判断saveObj方法是创建记录，还是还是修改记录
                console.log("id:" + id);
                console.log("input json object:" + params);
                var apiRequest = new ApiRequest();
                if (id != "") {  //修改
                    var url = apiObjUrl + '/' + id;
                    apiRequest.type = "PUT";
                    apiRequest.url = url;
                    apiRequest.params = params;
                    apiRequest.send();
                } else {    //创建
                    var url = apiObjUrl;
                    apiRequest.type = "POST";
                    apiRequest.url = url;
                    apiRequest.params = params;
                    apiRequest.send();
                }
                $modal.modal('hide');
            }
        });
    });
};