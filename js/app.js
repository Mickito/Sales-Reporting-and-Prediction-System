var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/Sales', {
			templateUrl: "templates/Sales.html",
			controller:"temporyData"
		})
		.when('/Stock', {
			templateUrl: "templates/Items.html",
			controller: "itemsCtrl"
		});
}]);

app.controller('itemsCtrl', function($scope)
{
	$scope.items = [];
	
	$scope.onSubmit = function()
	{
		item = {};
		item.name = $scope.itemName;
		item.price = $scope.itemPrice;
		item.quantity = $scope.itemQuantity;
		$scope.items.push(item);
	}
	
	$scope.editItem = function(index)
	{

	}
});

app.controller('temporyData', function ($scope, $http)
{
	$http.get('data/tempData.json')
		.then(
			function (response) {
				$scope.temporyData = response.data;
			});
});