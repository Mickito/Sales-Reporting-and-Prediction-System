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
	$scope.isEdit = false;
    $scope.arrayIndex = -1;
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
        $scope.isEdit = true;
        $scope.itemName = $scope.items[index].name;
        $scope.itemPrice = $scope.items[index].price;
        $scope.itemQuantity = $scope.items[index].quantity;
        
        $scope.arrayIndex = index;
	}
    
    $scope.onUpdate = function()
    {

        alert($scope.arrayIndex);
        //update the item through index
        $scope.items[$scope.arrayIndex].name = $scope.itemName;
        $scope.items[$scope.arrayIndex].price = $scope.itemPrice;
        $scope.items[$scope.arrayIndex].quantity = $scope.itemQuantity;
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