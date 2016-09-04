var app = angular.module('myApp', ['ngRoute']);

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
		.when('/Stock', {
			templateUrl: "templates/Items.html"
			, controller: "itemsCtrl"
		});
}]);

app.factory('databaseData',['$http', function ($http){
			var databaseData = {};
			//return a http get here
			// https://www.airpair.com/javascript/posts/services-in-angularjs-simplified-with-examples view this
			// under ## the service

			databaseData.getData = function(table){
				return $http.get('http://opax.swin.edu.au/~100677695/data/database_connection.php/' + table);
			};

			databaseData.postData = function(table, data){
				alert('attempting to post');
				return $http.post('http://opax.swin.edu.au/~100677695/data/database_connection.php/' + table, data);
			};

			databaseData.putData = function(table, data){
				alert('attempting to put');

				return $http.put('http://opax.swin.edu.au/~100677695/data/database_connection.php/' + table, data);
			};
	
			return databaseData;
}]);

app.controller('itemsCtrl', function ($scope, databaseData) {
	$scope.items = [];
	$scope.isEdit = false;
	$scope.arrayIndex = -1;

	function getItem() {
		databaseData.getData("Item")
			.then(function (response) {
				$scope.items = response.data;
			})
	}

	getItem();
	//at the start of the controller call the factory get request
	//so fresh data is here
	// https://www.airpair.com/javascript/posts/services-in-angularjs-simplified-with-examples view this
	// under ### the controller


	$scope.onSubmit = function () {
		item = {};
		var data = JSON.stringify({Name: $scope.itemName, Price: $scope.itemPrice, StockQty: $scope.itemQuantity});

		// this will post to database and also store a tempory name, price and quantity in table in till the controller is reloaded 
		// but when controller is reloaded the factory get request get will be called.
		databaseData.postData("Item", data)
		.success(function () {
			$scope.status = 'Inserted Items!';
			item.Name = $scope.itemName;
			item.Price = $scope.itemPrice;
			item.StockQty = $scope.itemQuantity;
			$scope.items.push(item);
			alert($scope.status);
		})
		.error(function (error) {
			$scope.status = 'Unable to insert items: ' + error.message;
			alert($scope.status);
		});
		alert($scope.status);
	}

	$scope.editItem = function (index) {
		$scope.isEdit = true;
		$scope.itemName = $scope.items[index].Name;
		$scope.itemPrice = $scope.items[index].Price;
		$scope.itemQuantity = $scope.items[index].StockQty;

		$scope.arrayIndex = index;
	}

	$scope.onUpdate = function () {
		var data = JSON.stringify({Name: $scope.itemName, Price: $scope.itemPrice, StockQty: $scope.itemQuantity});
		alert($scope.arrayIndex);
		
		databaseData.putData("Item", data)
		.success(function () {
			$scope.status = 'Updated items!';
			$scope.items[$scope.arrayIndex].Name = $scope.itemName;
			$scope.items[$scope.arrayIndex].Price = $scope.itemPrice;
			$scope.items[$scope.arrayIndex].StockQty = $scope.itemQuantity;
		})
		.error(function (error) {
			$scope.status = 'Unable to update items: ' + error.message;
		});
		alert($scope.status);
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

	function getSales() {
		databaseData.getData("Sales")
		.then(function (response) {
			$scope.sales = response.data;
		})
	}

	getSales();

	$scope.onSubmit = function () {
		sale = {};
		sale.ItemID = $scope.productID;
		sale.Price = $scope.productPrice;
		sale.Date = $scope.productDate.getTime();
		sale.Quantity = $scope.productSold;
		$scope.sales.push(sale);
		
		var data = JSON.stringify({ItemID: sale.ItemID, Date: sale.Date, Quantity: sale.Quantity});

		// this will post to database and also store a tempory name, price and quantity in table in till the controller is reloaded 
		// but when controller is reloaded the factory get request get will be called.
		databaseData.postData("Sales", data)
		.success(function () {
			$scope.status = 'Sale inserted successfully';
		})
		.error(function (error) {
			$scope.status = 'Unable to insert sale: ' + error.message;
			alert($scope.status);
		});
		alert($scope.status);
	}

	$scope.editSale = function (index) {
		$scope.editing = true;
		$scope.arrayIndex = index;
		var convertToDate = new Date($scope.sales[index].date);
		$scope.productName = $scope.sales[index].name;
		$scope.productDate = convertToDate;
		$scope.productPrice = $scope.sales[index].price;
		$scope.productSold = $scope.sales[index].sold;
	}
	
	$scope.onUpdate = function() {
		if ($scope.editing) {
			$scope.sales[$scope.arrayIndex].Name = $scope.productName;
			$scope.sales[$scope.arrayIndex].Price = $scope.productPrice;
			$scope.sales[$scope.arrayIndex].Date = $scope.productDate.getTime();
			$scope.sales[$scope.arrayIndex].Quantity = $scope.productSold;
		}
	}

	$scope.onReset = function () {
		$scope.editing = false;
		$scope.productName = "";
		$scope.productPrice = "";
		$scope.productDate = "";
		$scope.productSold = "";
	}
});