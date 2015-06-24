node-shipstation
==============

A small node module that helps integrate your application with shipstation.
There are still several API endpoints with shipstation that are not implemented.
Feel free to fork and make pull requests, or add issues as you please.

## Install

```npm install node-shipstation```

## Usage

After having installed it, simply require it, set it up with your own apiKey and apiSecret, and start calling methods!

```javascript
var shipstationAPI = require('node-shipstation');
var shipstation = new shipstationAPI(
  'apiKey',
  'apiSecret');

shipstation.callMethods();
```

### Functions and responses
| Functions | Returns to callback | Explanation |
| ---------------- | ---------------- | ---------------- |
| **get** (link, options, callback) | callback(err, res, body) | Base function for using get on shipstation API. Can be used if non-implemented API call needed. |
| **put** (link, data, callback) | callback(err, res, body)| Base function for using put on shipstation API. Can be used if non-implemented API call needed. |
| **post** (link, data, callback) | callback(err, res, body) | Base function for using post on shipstation API. Can be used if non-implemented API call needed. |
| **del** (link, options, callback) | callback(err, res, body) | Base function for using delete on shipstation API. Can be used if non-implemented API call needed. |
| **addAccount** (account, callback) | callback(err, res, body) | Registers a new account and generates an apiKey and apiSecret. [`account`](http://www.shipstation.com/developer-api/#/reference/accounts/register-account/register-account) |
| **getTags** (callback) | callback(err, res, body) | Gets all tags in the account.  |
| **getCarriers** ([options], callback) | callback(err, res, body) | Gets all carriers.  |
| **getCarrier** (carrier_code, callback) | callback(err, res, body) | Gets a carrier by `carrier_code`.  |
| **addFunds** ({carrierCode, amount}, callback) | callback(err, res, body) | Adds the specified amount of funds to the carrier by `carrier_code`.  |
| **getPackages** (carrierCode, callback) | callback(err, res, body) | Gets all packages for the carrier by `carrier_code`.  |
| **getServices** (carrierCode, callback) | callback(err, res, body) | Gets all services for the carrier by `carrier_code`.  |
| **getCustomers** ([options], callback) | callback(err, res, body) | Gets all customers.  |
| **getCustomer** (id, callback) | callback(err, res, body) | Gets a customer by id.  |
| **getOrders** ([options], callback) | callback(err, res, body) | Gets all orders. [options](http://www.shipstation.com/developer-api/#/reference/orders/orders/post)  |
| **getOrdersByTag** ({orderStatus, tagId}, callback) | callback(err, res, body) | Gets all orders with the specified `orderStatus` and `tagId`.  |
| **getOrder** (id, callback) | callback(err, res, body) | Gets an order by id.  |
| **addOrder** (order, callback) | callback(err, res, body) | Adds an order. [`order`](http://www.shipstation.com/developer-api/#/reference/orders/orderscreateorder/get-order) |
| **updateOrder** (id, changes, callback) | callback(err, res, body) | Updates an order with the changes passed to the method. |
| **deleteOrder** (id, callback) | callback(err, res, body) | Deletes an order by id.  |
| **setOrderHold** ({orderId, holdUntilDate}, callback) | callback(err, res, body) | Sets a hold on the specified order until the specified date `string`.  |
| **setLabelForOrder** (label, callback) | callback(err, res, body) | Sets the label for the specified order. [`label`](http://www.shipstation.com/developer-api/#/reference/orders/orderscreatelabelfororder/post)  |
| **setOrderShipped** (details, callback) | callback(err, res, body) | Sets the specified order as shipped. [`details`](http://www.shipstation.com/developer-api/#/reference/orders/ordersmarkasshipped/list-carriers) |
| **addTagToOrder** ({orderId, tagId}, callback) | callback(err, res, body) | Adds the specified tag to the specified order.  |
| **removeTagFromOrder** ({orderId, tagId}, callback) | callback(err, res, body) | Removes the specified tag from the specified order.  |
| **getProducts** ([options], callback) | callback(err, res, body) | Gets all products.  |
| **getProduct** (id, callback) | callback(err, res, body) | Gets a product by id.  |
| **getShipments** ([options], callback) | callback(err, res, body) | Gets all shipments.  |
| **addShippingLabel** (label, callback) | callback(err, res, body) | Creates a shipping label/shipment. [`label`](http://www.shipstation.com/developer-api/#/reference/shipments/shipmentscreatelabel/list-carriers) |
| **getShippingRates** (request, callback) | callback(err, res, body) | Gets shipping rates for the specified request. [`request`](http://www.shipstation.com/developer-api/#/reference/shipments/shipmentsgetrates/post) |
| **voidShippingLabel** (id, callback) | callback(err, res, body) | Voids the specified shipping label/shipment. |
| **getStores** ([options], callback) | callback(err, res, body) | Gets all stores.  |
| **getStore** (id, callback) | callback(err, res, body) | Gets a store by id.  |
| **updateStore** (id, store, callback) | callback(err, res, body) | Updates the specified store. [`store`](http://www.shipstation.com/developer-api/#/reference/stores/store_) |
| **getStoreRefreshStatus** (id, callback) | callback(err, res, body) | Gets the specified store's refresh status |
| **refreshStore** (id, callback) | callback(err, res, body) | Refreshes the specified store |
| **deactivateStore** (id, callback) | callback(err, res, body) | Deactivates the specified store |
| **reactivateStore** (id, callback) | callback(err, res, body) | Reactivates the specified store |
| **getMarketplaces** (callback) | callback(err, res, body) | Lists the marketplaces that can be integrated with ShipStation. |
| **getWarehouses** ([options], callback) | callback(err, res, body) | Get all warehouses. |
| **getWarehouse** (id, callback) | callback(err, res, body) | Gets a warehouse by id. |
| **updateWarehouse** (id, warehouse, callback) | callback(err, res, body) | Updates the specified warehouse. [`warehouse`](http://www.shipstation.com/developer-api/#/reference/warehouses/warehousescreatewarehouse/update-warehouse)|
| **addWarehouse** (warehouse, callback) | callback(err, res, body) | Adds a new warehouse. [`warehouse`](http://www.shipstation.com/developer-api/#/reference/warehouses/warehousescreatewarehouse/update-warehouse)|

## Helpers

node-shipstation has a few helpers that make it easier to make several different requests for the same target using chaining. Check the example below to see one in action. *Operations will **not** be run in the order they are chained in*

| Helper        | Methods                              |
|---------------|--------------------------------------|
| **carrier(id)** | `addFunds(amount, callback)` `packages(callback)` `services(callback)` |
| **order(id)** | `delete(callback)` `hold(date, callback)` `addTag(tagId, callback)` `removeTag(tagId, callback)` `shipped(data, callback)` `label(data, callback)` |
| **store(id)** | `update(data, callback)` `status(callback)` `refresh(callback)` `deactivate(callback)` `reactivate(callback)` |

## Examples

### Getting An Order
```javascript
shipstation.getOrder(12345, function(err, res, body){
  if(err) throw err;
  console.log('Got order');
  console.log(body);
});
```
### Marking an Order Shipped
```javascript
var orderShipped = {
  orderId: 12345,
  carrierCode: 'express_1',
  shipDate: '02/10/2015',
  trackingNumber: 'ZLU2342323',
  notifyCustomer: false,
  notifySalesChannel: false
}

shipstation.setOrderShipped(orderShipped, function(err, res, body){
  //Handle the callback.
});
```

### Tag manipulation with Order Helper
```javascript
var handler = function(err, res, body){
	console.log(body);
};

shipstation.order(12345)
	.addTag(9432, handler)
	.addTag(9554, handler)
	.removeTag(1233, handler);
```