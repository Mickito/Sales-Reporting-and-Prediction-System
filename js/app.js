var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/Sales', {
			templateUrl: "templates/Sales.html",
			controller:"temporyData"
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

app.controller('temporyData', function ($scope, $http) {
		$http.get('data/tempData.json')
			.then(
				function (response) {
					$scope.temporyData = response.data;
				});
	});
