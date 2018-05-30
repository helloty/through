//检查扩展是否已安装
//如果安装了扩展，var“webExtensionWallet”将被注入到web页面中
$(function () {
    setTimeout(function () {
        if (typeof (webExtensionWallet) === "undefined") {
            //alert ("扩展钱包未安装，请先安装.")
            $("#noExtension").show();
        }
    }, 500);
});

var dappAddress = "n1uKM7KKhy7eQuGmZJMaTYTJ1FJmV6iArmZ";
var nebulas = require("nebulas"),
    Account = nebulas.Account,
    neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));

var NebPay = require("nebpay");
var nebPay = new NebPay();

var intervalQuery;
var serialNumber;

function contract_search(callArgs, cb) {
    var from = Account.NewAccount().getAddressString();

    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "get";
    var contract = {
        "function": callFunction,
        "args": JSON.stringify(callArgs)
    }
    neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        cb(resp)
    }).catch(function (err) {
        console.log("error:" + err.message)
    })
}


function contract_save(callArgs, cb) {
    var to = dappAddress;
    var value = "0";
    var callFunction = "save"
    serialNumber = nebPay.call(to, value, callFunction, JSON.stringify(callArgs), {
        listener: cbPush
    });

    intervalQuery = setInterval(function () {
        funcIntervalQuery(cb);
    }, 7000);
}

function cbPush(resp) {
    var respString = JSON.stringify(resp);
    if (respString.search("rejected by user") !== -1) {
        clearInterval(intervalQuery)
        alert(respString)
    } else if (respString.search("txhash") !== -1) {
        layer.load(1, {
            shade: [0.6, '#000']
        });
    }
}

// 定时查询交易状态
function funcIntervalQuery(cb) {
    nebPay.queryPayInfo(serialNumber)
        .then(function (resp) {
            console.log("tx result: " + resp)
            var respObject = JSON.parse(resp)
            if (respObject.code === 0 && respObject.data.status === 1) {
                clearInterval(intervalQuery);
                cb();
                layer.closeAll()
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}