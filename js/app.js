var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/Sales', {
			templateUrl: "templates/Sales.html"
		})
}]);