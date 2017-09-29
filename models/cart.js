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
    storedItem.price = Number((storedItem.item.price).toFixed(2));
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
    this.totalPrice = Number((this.totalPrice).toFixed(2));
  };

  this.remove = function ( id ){
    let storedItem = this.items[id];
    if(storedItem){
      storedItem.qty--;
      if(storedItem.qty != 0){
        storedItem.price = storedItem.item.price * storedItem.qty;
        storedItem.price = Number((storedItem.item.price).toFixed(2));
      }

      this.totalQty--;
      this.totalPrice -= storedItem.item.price;
      this.totalPrice = Number((this.totalPrice).toFixed(2));


      if(storedItem.qty == 0){
        delete this.items[id];
      }
    }
  }
};
