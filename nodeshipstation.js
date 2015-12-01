module.exports = function(apiKey, apiSecret, to, per){
	var limiter = require("simple-rate-limiter"),
		request = require("request"),
		apiUrl = 'https://ssapi.shipstation.com',
		baseRequest = limiter(request.defaults({
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			json:true,
			auth: {
				user: apiKey,
				pass: apiSecret
			}
		})).to(36).per(60),
		if (to) baseRequest.to(to);
		if (per)baseRequest.per(per);
		deepValue = function (obj, path) {
			for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
				obj = obj[path[i]];
			};
			return obj;
		},
		parsingRegex = /{\s*([\w\.]+)\s*}/g,
		apiRequest = function(parameterizedUrl, fn){
			return function(){
				//Handle optional params
				var id = null,
					options = null,
					callback = null,
					args = [].slice.call(arguments);
				args.forEach(function(arg){
					if(typeof arg == 'string' || typeof arg == 'number') id = arg;
					if(typeof arg == 'object') options = arg;
					if(typeof arg == 'function') callback = arg;
				})
				if(id != null){
					if(options != null) options.id = id;
					else options = {id: id};
				}

				//Populate URL
				var url = parameterizedUrl.replace(parsingRegex, function(match, path){
					return deepValue(options, path);
				});

				//Remove ID from options
				if(options != null) delete options.id;

				//Rest of the request
				fn(url, options, callback);
			}
		},
		getMethod = function(parameterizedUrl){
			return new apiRequest(parameterizedUrl, function(url, options, callback){
				api.get(url, options, callback);
			})
		},
		postMethod = function(parameterizedUrl){
			return new apiRequest(parameterizedUrl, function(url, data, callback){
				api.post(url, data, callback);
			})
		},
		putMethod = function(parameterizedUrl){
			return new apiRequest(parameterizedUrl, function(url, data, callback){
				api.put(url, data, callback);
			})
		},
		deleteMethod = function(parameterizedUrl){
			return new apiRequest(parameterizedUrl, function(url, options, callback){
				api.del(url, options, callback);
			})
		},
		merge = function(target, source) {
		    if ( typeof target !== 'object' ) target = {};
		    for (var property in source) {
		        if ( source.hasOwnProperty(property) ) {
		            var sourceProperty = source[ property ];
		            if ( typeof sourceProperty === 'object' ) {
		                target[ property ] = merge( target[ property ], sourceProperty );
		                continue;
		            }
		            target[ property ] = sourceProperty;
		        }
		    }

		    for (var a = 2, l = arguments.length; a < l; a++) merge(target, arguments[a]);

		    return target;
		};

	var api = {
		get: function(link, options, callback){
			baseRequest({
				method: "GET",
				url: apiUrl + link,
				qs: options
			}, callback);
		},
		post: function(link, data, callback){
			baseRequest({
				method: "POST",
				url: apiUrl + link,
				json: data
			}, callback);
		},
		put: function(link, data, callback){
			baseRequest({
				method: "PUT"
				url: apiUrl + link,
				json: data
			}, callback);
		},
		del: function(link, options, callback){
			baseRequest({
				method: "DELETE",
				url: apiUrl + link,
				qs: options
			}, callback);
		},
		addAccount: '/accounts/registeraccount', // http://www.shipstation.com/developer-api/#/reference/accounts/register-account/register-account
		getTags: '/accounts/listtags',
		getCarriers: '/carriers',
		getCarrier: '/carriers/getcarrier?carrierCode={id}',
		addFunds: '/carriers/addfunds', //{carrierCode, amount}
		getPackages: '/carriers/listpackages?carrierCode={id}',
		getServices: '/carriers/listservices?carrierCode={id}',
		carrier: function(id){
			var carrier = {
				addFunds: function(amount, callback){
					api.addFunds({carrierCode: id, amount: amount}, callback);
					return carrier;
				},
				packages: function(callback){
					api.getPackages({id:id},callback);
				},
				services: function(callback){
					api.getServices({id:id},callback);
				}
			}
			return carrier;
		},

		getCustomers: '/customers',
		getCustomer: '/customers/{id}',

		getOrders: '/orders', // options http://www.shipstation.com/developer-api/#/reference/orders/orders/post
		getOrdersByTag: '/orders/listbytag', // requires {orderStatus, tagId}
		getOrder: '/orders/{id}',
		addOrder: '/orders/createorder', // http://www.shipstation.com/developer-api/#/reference/orders/orderscreateorder/get-order
		updateOrder: function(id, changes, callback){ // A combination of get and create...
			api.getOrder(id, function(err, res, body){
				if(err) throw err;
				merge(body, changes);
				api.addOrder(body, callback);
			});
		},
		deleteOrder: '/orders/{id}',
		setOrderHold: '/orders/holduntil', //{orderId, holdUntilDate}
		setLabelForOrder: '/orders/createlabelfororder', // http://www.shipstation.com/developer-api/#/reference/orders/orderscreatelabelfororder/post
		setOrderShipped: '/orders/markasshipped', // {orderId*, carrierCode*, shipDate, trackingNumber, notifyCustomer, notifySalesChannel}
		addTagToOrder: '/orders/addtag', //{orderId, tagId}
		removeTagFromOrder: new postMethod('/orders/removetag'), //{orderId, tagId}
		order: function(id){
			var order = {
				get: function(callback){
					api.getOrder(id, callback);
					return order;
				},
				delete: function(callback){
					api.deleteOrder(id, callback);
					return order;
				},
				update: function(changes, callback){
					api.updateOrder(id, changes, callback);
					return order;
				},
				hold: function(date, callback){
					if(typeof date == 'object') date = date.ToISOString();
					api.setOrderHold({orderId: id, holdUntilDate: date}, callback);
					return order;
				},
				addTag: function(tagId, callback){
					api.addTagToOrder({orderId: id, tagId: tagId}, callback);
					return order;
				},
				removeTag: function(tagId, callback){
					api.removeTagFromOrder({orderId: id, tagId: tagId}, callback);
					return order;
				},
				shipped: function(data, callback){
					data.orderId = id;
					api.setOrderShipped(data, callback);
					return order;
				},
				label: function(data, callback){
					data.orderId = id;
					api.setLabelForOrder(data, callback);
					return order;
				}
			}

			return order;
		},

		getProducts: '/products',
		getProduct: '/products/{id}/',

		getShipments: '/shipments',
		addShippingLabel: '/shipments/createlabel', // http://www.shipstation.com/developer-api/#/reference/shipments/shipmentscreatelabel/post
		getShippingRates: new postMethod('/shipments/getrates'), // http://www.shipstation.com/developer-api/#/reference/shipments/shipmentsgetrates/post
		voidShippingLabel: function(id, callback){
			api.post('/shipments/voidlabel', {shipmentId: id}, callback);
		},

		getStores: '/stores',
		getStore: '/stores/{id}',
		updateStore: '/stores/{id}', // http://www.shipstation.com/developer-api/#/reference/stores/store/update-store
		getStoreRefreshStatus: '/stores/getrefreshstatus?storeId={id}',
		refreshStore: function(id, callback){
			if(typeof id == 'function'){
				callback = id;
				id = null;
			}
			api.get('/stores/refreshstore', id != null? {storeId: id} : {}, callback);
		},
		deactivateStore: function(id, callback){
			api.post('/stores/deactivate', {storeId: id}, callback);
		},
		reactivateStore: function(id, callback){
			api.post('/stores/reactivate', {storeId: id}, callback);
		},
		getMarketplaces: '/stores/marketplaces',
		store: function(id){
			var store = {
				update: function(data, callback){
					data.id = id;
					api.updateStore(data, callback);
					return store;
				},
				status: function(callback){
					api.getStoreRefreshStatus(id, callback);
					return store;
				},
				refresh: function(callback){
					api.refreshStore(id, callback);
					return store;
				},
				deactivate: function(callback){
					api.deactivateStore(id, callback);
					return store;
				},
				reactivate: function(callback){
					api.reactivateStore(id, callback);
					return store;
				},
			}
			return store;
		},

		getWarehouses: '/warehouses',
		getWarehouse: '/warehouses/{id}',
		updateWarehouse: '/warehouses/{id}', // http://www.shipstation.com/developer-api/#/reference/warehouses/warehouse/update-warehouse
		addWarehouse: '/warehouses/createwarehouse', // http://www.shipstation.com/developer-api/#/reference/warehouses/warehousescreatewarehouse
	};

	//Build default methods
	for(method in api){
		if(typeof api[method] == 'function') continue;

		var url = api[method];
		if(method.indexOf('get') == 0) api[method] = new getMethod(url);
		if(method.indexOf('add') == 0 || method.indexOf('set') == 0) api[method] = new postMethod(url);
		if(method.indexOf('update') == 0) api[method] = new putMethod(url);
		if(method.indexOf('delete') == 0) api[method] = new deleteMethod(url);
	}

	return api;
}
