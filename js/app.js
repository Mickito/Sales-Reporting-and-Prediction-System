var app = angular.module('myApp', ['ngRoute', 'bootstrap-modal']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: "templates/Sales.html"
			, controller: "saleCtrl"
		})
		.when('/Sales', {
			templateUrl: "templates/Sales.html"
			, controller: "saleCtrl"
		})
		.when('/Report', {
			templateUrl: "templates/Report.html"
		})
		.when('/Stock', {
			templateUrl: "templates/Items.html"
			, controller: "itemsCtrl"
		});
}]);

app.factory('databaseData',['$http', function ($http){
			var databaseData = {};

			databaseData.getData = function(table){
				return $http.get('data/database_connection.php/' + table);
			};

			databaseData.postData = function(table, data){
				return $http.post('data/database_connection.php/' + table, data);
			};

			databaseData.putData = function(table, data, column, id){
				return $http.put('data/database_connection.php/' + table + "/" + column + "/" + id, data);
			};
	
			return databaseData;
}]);

app.controller('itemsCtrl', function ($scope, databaseData) {
	$scope.items = [];
	$scope.isEdit = false;
	$scope.arrayIndex = -1;

	function getItem() {
		databaseData.getData("item")
			.then(function (response) {
				$scope.items = response.data;
			})
	}

	getItem();

	$scope.onSubmit = function () {
		item = {};
		var data = JSON.stringify({Name: $scope.itemName, Price: $scope.itemPrice, StockQty: $scope.itemQuantity});

		databaseData.postData("item", data)
		.then(function () {
			item.Name = $scope.itemName;
			item.Price = $scope.itemPrice;
			item.StockQty = $scope.itemQuantity;
			$scope.items.push(item);
		},
		function (response) {
			
		});
	}

	$scope.editItem = function (index) {
		$scope.isEdit = true;
		$scope.arrayIndex = index;
		$scope.itemName = $scope.items[index].Name;
		$scope.itemPrice = parseInt($scope.items[index].Price);
		$scope.itemQuantity = parseInt($scope.items[index].StockQty);
		$scope.itemID = parseInt($scope.items[index].ItemID);
	}

	$scope.onUpdate = function () {
		var data = JSON.stringify({Name: $scope.itemName, Price: $scope.itemPrice, StockQty: $scope.itemQuantity});
		
		databaseData.putData("item", data, "ItemID", $scope.itemID)
		.then(function () {
			$scope.status = 'Updated items!';
			$scope.items[$scope.arrayIndex].Name = $scope.itemName;
			$scope.items[$scope.arrayIndex].Price = $scope.itemPrice;
			$scope.items[$scope.arrayIndex].StockQty = $scope.itemQuantity;
		},
		function (response) {
			
		});
	}

	$scope.onReset = function () {
		$scope.isEdit = false;
		$scope.itemName = "";
		$scope.itemPrice = "";
		$scope.itemQuantity = "";
	}
});

app.controller('saleCtrl', function ($scope, databaseData) {
	$scope.sales = [];
	$scope.editing = false;
	$scope.arrayIndex = -1;
	
	function updatePrices() {
		for (var i = 0; i < $scope.sales.length; i++) {
			var id = $scope.sales[i].ItemID;
			for (var j = 0; j < $scope.items.length; j++) {
				 if ($scope.items[j].ItemID == id) {
					 $scope.sales[i].Price = $scope.sales[i].Quantity * $scope.items[j].Price;
					 break;
				 }
			}
		}
	}

	function updateNames() {
		for (var i = 0; i < $scope.sales.length; i++) {
			var id = $scope.sales[i].ItemID;
			for (var j = 0; j < $scope.items.length; j++) {
				 if ($scope.items[j].ItemID == id) {
					 $scope.sales[i].ItemName = $scope.items[j].Name;
					 break;
				 }
			}
		}
	}

	function getSales() {
		databaseData.getData("sales")
		.then(function (response) {
			$scope.sales = response.data;
		})
	}

	getSales();
	
	// Get items so we can reference them
	$scope.items = [];
	function getItem() {
		databaseData.getData("item")
			.then(function (response) {
				$scope.items = response.data;
				updateNames();
				updatePrices();
			})
	}
	getItem();
		
	$scope.onSubmit = function () {
		sale = {};
		sale.ItemID = $scope.productID;
		sale.Date = $scope.productDate.getTime();
		sale.Quantity = $scope.productSold;
		$scope.sales.push(sale);
		
		var data = JSON.stringify({ItemID: sale.ItemID, Date: sale.Date, Quantity: sale.Quantity});

		databaseData.postData("sales", data)
		.then(function () {
			
		},
		function (response) {
			
		});

		updatePrices();
		updateNames();
	}

	$scope.editSale = function (index) {
		$scope.editing = true;
		$scope.arrayIndex = index;
		$scope.productID = parseInt($scope.sales[index].ItemID);
		$scope.productSold = parseInt($scope.sales[index].Quantity);
		var convertToDate = new Date($scope.sales[index].Date);
		$scope.productDate = convertToDate;
	}
	
	$scope.onUpdate = function() {
		if ($scope.editing) {
			var data = JSON.stringify({ItemID: $scope.productID, Date: $scope.productDate.getTime(), Quantity: $scope.productSold});

			databaseData.putData("sales", data, "TransactionID", $scope.sales[$scope.arrayIndex].TransactionID)
			.then(function () {
				
			},
			function (response) {
				
			});
			
			$scope.sales[$scope.arrayIndex].ItemID = $scope.productID;
			$scope.sales[$scope.arrayIndex].Date = $scope.productDate.getTime();
			$scope.sales[$scope.arrayIndex].Quantity = $scope.productSold;
			updatePrices();
			updateNames();
		}
	}

	$scope.onReset = function () {
		$scope.editing = false;
		$scope.productID = "";
		$scope.productDate = "";
		$scope.productSold = "";
	}
});