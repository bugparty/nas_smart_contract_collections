'use strict';

var SampleContract = function () {
    // SampleContract的`size`属性为存储属性，对`size`的读写会存储到链上，
    // 此处的`descriptor`设置为null，将使用默认的JSON.stringify()和JSON.parse()
    LocalContractStorage.defineMapProperty(this, "size", null);

    // SampleContract的`value`属性为存储属性，对`value`的读写会存储到链上，
    // 此处的`descriptor`自定义实现，存储时直接转为字符串，读取时获得Bignumber对象
    LocalContractStorage.defineProperty(this, "value", {
        stringify: function (obj) {
            return obj.toString();
        },
        parse: function (str) {
            return new BigNumber(str);
        }
    });
    // SampleContract的多个属性批量设置为存储属性，对应的descriptor默认使用JSON序列化
    LocalContractStorage.defineProperties(this, {
        name: null,
        count: null
    });
};

/*
然后，我们可以如下在合约里直接读写这些属性。
*/
SampleContract.prototype = {
    // 合约部署时调用，部署后无法二次调用
    init: function (name, count, size, value) {
        // 在部署合约时将数据存储到链上
        this.name = name;
        this.count = count;
        this.size = size;
        this.value = value;
    },
    testStorage: function (balance) {
        // 使用value时会从存储中读取链上数据，并根据descriptor设置自动转换为Bignumber
        var amount = this.value.plus(new BigNumber(2));
        if (amount.lessThan(new BigNumber(balance))) {
            return 0
        }
    }
};

module.exports = SampleContract;