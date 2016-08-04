var app = angular.module('myApp', ['ngRoute']);
app.config(['$routeProvider', function ($routeProvider){
 		$routeProvider.
			when ('/units2template/:unitInto', 
				{
 				templateUrl:'templates/units2template.html',
 				controller:'unitsController'
 				});
}]);
				
app.controller('unitsController',
	function($scope, $routeParams) 
		{
		$scope.Unit = $routeParams.unitInto;
		}
);