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

	//at the start of the controller call the factory get request
	//so fresh data is here
	// https://www.airpair.com/javascript/posts/services-in-angularjs-simplified-with-examples view this
	// under ### the controller

	$scope.onSubmit = function () {
		item = {};
		var data = JSON.stringify({Name: $scope.itemName, Price: $scope.itemPrice, StockQty: $scope.itemQuantity});

		// this will post to database and also store a tempory name, price and quantity in table in till the controller is reloaded 
		// but when controller is reloaded the factory get request get will be called.
		databaseData.postData("Items", data)
			.success(function () {
				$scope.status = 'Inserted Items!';
				alert($scope.status);
				item.name = $scope.itemName;
				item.price = $scope.itemPrice;
				item.quantity = $scope.itemQuantity;
				$scope.items.push(item);
			})
			.error(function (error) {
				$scope.status = 'Unable to insert items: ' + error.message;
				alert($scope.status);
			});
	}

	$scope.editItem = function (index) {
		$scope.isEdit = true;
		$scope.itemName = $scope.items[index].name;
		$scope.itemPrice = $scope.items[index].price;
		$scope.itemQuantity = $scope.items[index].quantity;

		$scope.arrayIndex = index;
	}

	$scope.onUpdate = function () {
		var data = JSON.stringify({Name: $scope.itemName, Price: $scope.itemPrice, StockQty: $scope.itemQuantity});
		alert($scope.arrayIndex);
		
			databaseData.putData(data)
			.success(function () {
				$scope.status = 'updated Items!';
				alert($scope.status);
				$scope.items[$scope.arrayIndex].name = $scope.itemName;
				$scope.items[$scope.arrayIndex].price = $scope.itemPrice;
				$scope.items[$scope.arrayIndex].quantity = $scope.itemQuantity;
			})
			.error(function (error) {
				$scope.status = 'Unable to update items: ' + error.message;
				alert($scope.status);
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
	$scope.items = [];
	$scope.editing = false;
	$scope.arrayIndex = -1;

	$scope.onSubmit = function () {
		item = {};
		item.name = $scope.productName;
		item.price = $scope.productPrice;
		item.date = $scope.productDate;
		item.sold = $scope.productSold;
		$scope.items.push(item);
	}

	$scope.editSale = function (index) {
		$scope.editing = true;
		$scope.arrayIndex = index;
		var convertToDate = new Date($scope.items[index].date);
		$scope.productName = $scope.items[index].name;
		$scope.productDate = convertToDate;
		$scope.productPrice = $scope.items[index].price;
		$scope.productSold = $scope.items[index].sold;
	}
	
	$scope.onUpdate = function() {
		if ($scope.editing) {
			$scope.items[$scope.arrayIndex].name = $scope.productName;
			$scope.items[$scope.arrayIndex].price = $scope.productPrice;
			$scope.items[$scope.arrayIndex].date = $scope.productDate;
			$scope.items[$scope.arrayIndex].sold = $scope.productSold;
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