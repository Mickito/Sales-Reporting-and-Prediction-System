var app = angular.module("myApp", []);
app.controller ("myCtrl", function ($scope)
	{
		$scope.messageArray = [];
		$scope.message = '';
	
	
	$scope.pushToArray = function ()
	{
		$scope.messageArray.push($scope.message);
	}
	
	$scope.delete = function (aObject)
	{
		$scope.messageArray.splice(aObject, 1)
	} 
	
	});