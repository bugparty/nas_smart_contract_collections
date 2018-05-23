'use strict';

var Item = function(text) {
    if (text) {
        var o = JSON.parse(text);
        this.id = o.id;
        this.hash = o.hash;
        this.createTime = o.createTime;
        this.createAddr = o.createAddr;
        this.nickname = o.nickname;
        this.type = o.type;
        this.content = o.content;
    } else {
        this.id = '';
        this.hash = '';
        this.createTime = 0;
        this.createAddr = '';
        this.nickname = '';
        this.type = '';
        this.content = '';
    }
};
Item.prototype = {
    toString: function() {
        return JSON.stringify(this);
    },
};


var NasFloater = function() {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function(text) {
            return new Item(text);
        },
        stringify: function(o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "counter", {
        stringify: function(obj) {
            return obj.toString();
        },
        parse: function(str) {
            return new BigNumber(str);
        }
    });
};

NasFloater.prototype = {
    init: function() {
        this.counter = new BigNumber(1);
    },

    addItem: function(nickname, type, content) {
        var item = new Item();
        item.id = this.counter.toString();
        item.hash = Blockchain.transaction.hash;
        item.createTime = Blockchain.transaction.timestamp * 1000;
        item.createAddr = Blockchain.transaction.from;
        item.nickname = nickname;
        item.type = type;
        item.content = content;
        this.repo.put(item.hash, item);
        this.counter = this.counter.plus(1);
        return item;
    },

    getItem: function(hash) {
        var item = this.repo.get(hash);
        if (!item) {
            throw new Error("not exist.");
        }
        return item;
    }
};
module.exports = NasFloater;

	
