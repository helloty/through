"use strict";

var ThroughItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.key = obj.key;
        this.name = obj.name;
        this.date = obj.date;
        this.phone = obj.phone;
        this.remark = obj.remark;
    } else {
        this.key = "";
        this.name = "";
        this.date = "";
        this.phone = "";
        this.remark = "";
    }
};


ThroughItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};
var Through = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new ThroughItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

Through.prototype = {
    init: function () {
    },
    save: function (key, name, phone, date, remark) {
        //var from = Blockchain.transaction.from;
        var throughItem = this.repo.get(key);
        if (throughItem) {
            throughItem.key = JSON.parse(throughItem).key;
            throughItem.name = JSON.parse(throughItem).name + '|-' + name;
            throughItem.phone = JSON.parse(throughItem).phone + '|-' + phone;
            throughItem.date = JSON.parse(throughItem).date + '|-' + date;
            throughItem.remark = JSON.parse(throughItem).remark + '|-' + remark;
            this.repo.put(key, throughItem);

        } else {
            throughItem = new ThroughItem();
            throughItem.key = key;
            throughItem.name = name;
            throughItem.phone = phone;
            throughItem.date = date;
            throughItem.remark = remark;
            this.repo.put(key, throughItem);
        }
    },
    get: function (key) {
        key = key.trim();
        if (key === "") {
            throw new Error("empty key")
        }
        return this.repo.get(key);
    }
};
module.exports = Through;