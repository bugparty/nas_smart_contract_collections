'use strict'
/*
  / ____|  __ \ \   / /  __ \__   __/ __ \ / ____| |  | |  __ \|  __ \|  ____| \ | |/ ____\ \   / /
 | |    | |__) \ \_/ /| |__) | | | | |  | | |    | |  | | |__) | |__) | |__  |  \| | |     \ \_/ / 
 | |    |  _  / \   / |  ___/  | | | |  | | |    | |  | |  _  /|  _  /|  __| | . ` | |      \   /  
 | |____| | \ \  | |  | |      | | | |__| | |____| |__| | | \ \| | \ \| |____| |\  | |____   | |   
  \_____|_|__\_\ |_|__|_|    _ |_|__\____/_\_____|\____/|_|__\_\_|  \_\______|_| \_|\_____|  |_|   
 |_   _|/ ____| |  ____| |  | |/ ____| |/ /_   _| \ | |/ ____|     /\                              
   | | | (___   | |__  | |  | | |    | ' /  | | |  \| | |  __     /  \                             
   | |  \___ \  |  __| | |  | | |    |  <   | | | . ` | | |_ |   / /\ \                            
  _| |_ ____) | | |    | |__| | |____| . \ _| |_| |\  | |__| |  / ____ \                           
 |_____|_____/  |_|_____\____/_\_____|_|\_\_____|_| \_|\_____| /_/    \_\                          
     /\ \        / / ____|/ __ \|  \/  |  ____|                                                    
    /  \ \  /\  / / (___ | |  | | \  / | |__                                                       
   / /\ \ \/  \/ / \___ \| |  | | |\/| |  __|                                                      
  / ____ \  /\  /  ____) | |__| | |  | | |____                                                     
 /_/    \_\/  \/  |_____/ \____/|_|  |_|______|                                                    
                                                  
 REGISTER WITH MY LINK License
 Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the "Software"),
   to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
     and/or sell copies of the Software, and to permit persons to whom the 
     Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
 in all copies or substantial portions of the Software.

You should only use my inivtation link to register nebulas.io dapp 
account and submit dapp in this account.

The link is https://incentive.nebulas.io/signup.html?invite=9rX6a

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
  OR OTHER DEALINGS IN THE SOFTWARE.

@author 梭哈人生 fancycode@gmail.com
 一个简单的漂流瓶智能合约
合约初始化时需要传入所有者地址，以便操作withdraw函数进行转出
（期待有好人真的给合约打钱）
addBottle函数可以部分传参 content, [nickname, city]

合约testnet地址n1nrB7eVyjDBNMJHYrq2YVARThu9xuNXp4s

*/
var Bottle = function (text) {
  if (text) {
    var o = JSON.parse(text)
    this.id = o.messageId
    this.sender = o.sender
    this.nickname = o.nickname
    this.city = o.city
    this.content = o.content
  } else {
    this.id = 0
    this.sender = ''
    this.content = ''
    this.nickname = ''
    this.city = ''
  }
}

Bottle.prototype = {
  toString: function () {
    return JSON.stringify(this)
  }
}

var BottleContract = function () {
  LocalContractStorage.defineMapProperty(this, 'bottles', {
    parse: function (text) {
      return new Bottle(text)
    },
    stringify: function (o) {
      return o.toString()
    }
  })
 

  LocalContractStorage.defineProperties(this, {
    bottleCount: null,
    owner: null
  })
}

BottleContract.prototype = {
  /*
  合约初始化函数，在部署合约的时候填的参数就是被这里处理，只在合约
  创建时执行
  @param owner 合约所有者，用于后期执行withdraw鉴权
  */
  init: function (owner) {
    this.bottleCount = 0
    this.owner = owner
  },
/*
提款到指定账户
*/
  withdraw: function (amount) {
    if (Blockchain.transaction.from == this.owner) {
      var num = new BigNumber(amount)
      var result = Blockchain.transfer(Blockchain.transaction.from, num)
      return {'error': null, 'result': result}
    } else {
      return {'error': 'not owner', 'result': null}
    }
  },
  /*
  获取漂流瓶数量
  */
  getBottleCount: function () {
    return this.bottleCount
  },
  /*
  获取第n个漂流瓶
  */
  getBottle: function (index) {
    return this.messages.get(index)
  },
/*
批量获取漂流瓶
*/
  getBottles: function (offset, limit) {
    var bottlesArr = []

    if (offset > this.bottleCount) {
      return {
        'error': 'offset too big',
        'bottles': null
      }
    } else {
      if (limit + offset > this.bottleCount) {
        limit = this.bottleCount - offset
      }
      for (var i = offset; i < limit + offset; i++) {
        bottlesArr.push(this.bottles.get(i))
      }
      return { 'error': null,
        'bottles': bottlesArr }
    }
  },
/*添加漂流瓶*/
  addBottle: function (content,nickname,city) {
    var bottleId = this.bottleCount
    var bottleObj = new Bottle()
    bottleObj.id = bottleId
    bottleObj.sender = Blockchain.transaction.from
    bottleObj.content = content
    bottleObj.nickname = nickname
    bottleObj.city = city

    this.bottles.put(bottleId, bottleObj)
    this.bottleCount += 1
    return {'error': null,
      'bottle': bottleObj}
  },
/*调试*/
  
  debug: function () {
    var msgs = []
 
    for (var i = 1; i <= this.messageCount; i++) {
      msgs.push(this.messages.get(i))
      maps.push(this.commentMap.get(i))
    }
   
    return {'d': JSON.stringify(this),
      'msgs': JSON.stringify(msgs),
      'owner': this.owner
    }
  }

}

module.exports = BottleContract
