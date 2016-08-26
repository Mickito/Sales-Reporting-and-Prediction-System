var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/Sales', {
			templateUrl: "templates/Sales.html"
		})
        .when('/Items', {
			templateUrl: "templates/Items.html",
            controller: "itemsCtrl"
        
		})
}]);

app.controller('itemsCtrl',
    function($scope)
    {  
        $scope.editItem = function(index)
        {
            
        }
    }
);