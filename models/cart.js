module.exports = function Cart(oldCart) {
  this.items = oldCart.items;
  this.totalQty = oldCart.totalQty;
  this.totalPrice = oldCart.totalPrice;

  this.add = function( newItem, id ){
    let storedItem = this.items[id];
    if (!storedItem){ // if there is no such item add new one
      storedItem = {item: newItem, qty: 0, price: 0};
      this.items[id] = storedItem;
    }

    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.price;
  };

  this.generateArray = function(){
    let arr = [];
    for (let id in this.items){
      arr.push(this.items[id]);
    }
    return arr;
  };
};
