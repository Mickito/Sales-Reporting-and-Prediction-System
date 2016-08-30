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

app.run(function ($rootScope) {
	$rootScope.itemValue = [{
			name: "Apples"
			, date: 1472418726
			, sold: 5
			, price: 50.00
			, quantity: 500
		}
		
		, {
			name: "Banan"
			, date: 1472418726
			, sold: 50
			, price: 530.00
			, quantity: 600
	}];

});

app.controller('itemsCtrl', function ($scope, $rootScope) {
	$scope.items = $rootScope.itemValue;
	$scope.isEdit = false;
	$scope.arrayIndex = -1;

	$scope.onSubmit = function () {

//		var data = JSON.stringify({Name: $scope.itemName, Price: $scope.itemPrice, StockQty: $scope.itemQuantity});
//
//		$http.post('http://opax.swin.edu.au/~100677695/sreps/database_connection.php/item', data)
//			.then(function (response) {
//				if (response.data)
//				$scope.Feedback = "Data successfully inserted.";
//			}, function (response) {
//				$scope.Feedback = "Service does not exist";
//			}); 
        
        item = {};
		item.name = $scope.itemName;
		item.price = $scope.itemPrice;
		item.quantity = $scope.itemQuantity;
		$scope.items.push(item);
	}

	$scope.editItem = function (index) {
        alert($scope.isEdit)
		$scope.isEdit = true;
        alert($scope.isEdit);
		$scope.itemName = $scope.items[index].name;
		$scope.itemPrice = $scope.items[index].price;
		$scope.itemQuantity = $scope.items[index].quantity;

		$scope.arrayIndex = index;
	}

	$scope.onUpdate = function () {

		alert($scope.arrayIndex);
		//update the item through index
		$scope.items[$scope.arrayIndex].name = $scope.itemName;
		$scope.items[$scope.arrayIndex].price = $scope.itemPrice;
		$scope.items[$scope.arrayIndex].quantity = $scope.itemQuantity;
	}

	$scope.onReset = function () {
		$scope.isEdit = false;
		$scope.itemName = "";
		$scope.itemPrice = "";
		$scope.itemQuantity = "";
	}
});

app.controller('saleCtrl', function ($scope, $rootScope) {
	$scope.items = $rootScope.itemValue;

	$scope.onSubmit = function () {

	}

	$scope.editProduct = function (index) {
        
        var convertToDate;
        convertToDate = new Date($scope.items[index].date);
		$scope.productName = $scope.items[index].name;
		$scope.productDate = convertToDate;
		$scope.productPrice = $scope.items[index].price;
		$scope.productSold = $scope.items[index].sold;
	}

	$scope.onReset = function () {
		$scope.productName = "";
		$scope.productPrice = "";
		$scope.productDate = "";
		$scope.productSold = "";

	}
});