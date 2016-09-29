var app = angular.module('myApp', ['ngRoute', 'bootstrap-modal']);

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
		.when('/Analysis', {
			templateUrl: "templates/Analysis.html"
			, controller: "analysisCtrl"
		})
		.when('/Report', {
			templateUrl: "templates/Report.html"
			, controller: "reportCtl"
		})
		.when('/Stock', {
			templateUrl: "templates/Items.html"
			, controller: "itemsCtrl"
		});
}]);

app.factory('databaseData', ['$http', function ($http) {
	var databaseData = {};

	databaseData.getData = function (table) {
		return $http.get('data/database_connection.php/' + table);
	};

	databaseData.postData = function (table, data) {
		return $http.post('data/database_connection.php/' + table, data);
	};

	databaseData.putData = function (table, data, column, id) {
		return $http.put('data/database_connection.php/' + table + "/" + column + "/" + id, data);
	};

	return databaseData;
}]);

app.controller('itemsCtrl', function ($scope, databaseData) {
	$scope.items = [];
	$scope.isEdit = false;
	$scope.arrayIndex = -1;

	function getItem() {
		databaseData.getData("item")
			.then(function (response) {
				$scope.items = response.data;
			})
	}

	getItem();

	$scope.onSubmit = function () {
		item = {};
		var data = JSON.stringify({
			Name: $scope.itemName
			, Price: $scope.itemPrice
			, StockQty: $scope.itemQuantity
		});

		databaseData.postData("item", data)
			.then(function () {
					item.Name = $scope.itemName;
					item.Price = $scope.itemPrice;
					item.StockQty = $scope.itemQuantity;
					$scope.items.push(item);
				}
				, function (response) {

				});
	}

	$scope.editItem = function (index) {
		$scope.isEdit = true;
		$scope.arrayIndex = index;
		$scope.itemName = $scope.items[index].Name;
		$scope.itemPrice = parseInt($scope.items[index].Price);
		$scope.itemQuantity = parseInt($scope.items[index].StockQty);
		$scope.itemID = parseInt($scope.items[index].ItemID);
	}

	$scope.onUpdate = function () {
		var data = JSON.stringify({
			Name: $scope.itemName
			, Price: $scope.itemPrice
			, StockQty: $scope.itemQuantity
		});

		databaseData.putData("item", data, "ItemID", $scope.itemID)
			.then(function () {
					$scope.status = 'Updated items!';
					$scope.items[$scope.arrayIndex].Name = $scope.itemName;
					$scope.items[$scope.arrayIndex].Price = $scope.itemPrice;
					$scope.items[$scope.arrayIndex].StockQty = $scope.itemQuantity;
				}
				, function (response) {

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
	$scope.sales = [];
	$scope.editing = false;
	$scope.arrayIndex = -1;

	function updatePrices() {
		for (var i = 0; i < $scope.sales.length; i++) {
			var id = $scope.sales[i].ItemID;
			for (var j = 0; j < $scope.items.length; j++) {
				if ($scope.items[j].ItemID == id) {
					$scope.sales[i].Price = $scope.sales[i].Quantity * $scope.items[j].Price;
					break;
				}
			}
		}
	}

	function updateNames() {
		for (var i = 0; i < $scope.sales.length; i++) {
			var id = $scope.sales[i].ItemID;
			for (var j = 0; j < $scope.items.length; j++) {
				if ($scope.items[j].ItemID == id) {
					$scope.sales[i].ItemName = $scope.items[j].Name;
					break;
				}
			}
		}
	}

	function getSales() {
		databaseData.getData("sales")
			.then(function (response) {
				$scope.sales = response.data;
			})
	}

	getSales();

	// Get items so we can reference them
	$scope.items = [];

	function getItem() {
		databaseData.getData("item")
			.then(function (response) {
				$scope.items = response.data;
				updateNames();
				updatePrices();
			})
	}
	getItem();

	$scope.onSubmit = function () {
		sale = {};
		sale.ItemID = $scope.productID;
		sale.Date = $scope.productDate.getTime();
		sale.Quantity = $scope.productSold;
		$scope.sales.push(sale);

		var data = JSON.stringify({
			ItemID: sale.ItemID
			, Date: sale.Date
			, Quantity: sale.Quantity
		});

		databaseData.postData("sales", data)
			.then(function () {

				}
				, function (response) {

				});

		updatePrices();
		updateNames();
	}

	$scope.editSale = function (index) {
		$scope.editing = true;
		$scope.arrayIndex = index;
		$scope.productID = parseInt($scope.sales[index].ItemID);
		$scope.productSold = parseInt($scope.sales[index].Quantity);
		var convertToDate = new Date(parseInt($scope.sales[index].Date));
		$scope.productDate = convertToDate;
	}

	$scope.onUpdate = function () {
		if ($scope.editing) {
			var data = JSON.stringify({
				ItemID: $scope.productID
				, Date: $scope.productDate.getTime()
				, Quantity: $scope.productSold
			});

			databaseData.putData("sales", data, "TransactionID", $scope.sales[$scope.arrayIndex].TransactionID)
				.then(function () {

					}
					, function (response) {

					});

			$scope.sales[$scope.arrayIndex].ItemID = $scope.productID;
			$scope.sales[$scope.arrayIndex].Date = $scope.productDate.getTime();
			$scope.sales[$scope.arrayIndex].Quantity = $scope.productSold;
			updatePrices();
			updateNames();
		}
	}

	$scope.onReset = function () {
		$scope.editing = false;
		$scope.productID = "";
		$scope.productDate = "";
		$scope.productSold = "";
	}
});

app.controller('analysisCtrl', function ($scope, databaseData) {
	sales = [];
	$scope.items = [];

	function getSales() {
		databaseData.getData("sales")
			.then(function (response) {
				sales = response.data;
				calculateAverageSales();
			})
	}

	function getItem() {
		databaseData.getData("item")
			.then(function (response) {
				$scope.items = response.data;
				$scope.selectedItemName = $scope.items[0].Name;
				$scope.onSelectedItemChange();
				getSales();
			})
	}

	$scope.onSelectedItemChange = function () {
		console.log($scope.selectedItemName);
		for (var i = 0; i < $scope.items.length; i++) {
			if ($scope.selectedItemName == $scope.items[i].Name) {
				$scope.selectedItem = $scope.items[i];
				break;
			}
		}
	}

	getItem();

	function calculateAverageSales() {
		for (var i = 0; i < $scope.items.length; i++) {
			var monthlySales = {};
			var id = $scope.items[i].ItemID;

			// Get each sale and separate into month/year
			for (var j = 0; j < sales.length; j++) {
				if (id == sales[j].ItemID) {
					// Get key
					var date = new Date(parseInt(sales[j].Date));
					var monthYear = date.getMonth() + "" + date.getFullYear();
					if (monthlySales[monthYear] == null) {
						monthlySales[monthYear] = [];
					}
					monthlySales[monthYear].push(sales[j].Quantity);
				}
			}

			// Total up the sales for each month
			var totalQuantities = [];
			for (key in monthlySales) {
				console.log("key: " + key);
				var totalQuantity = 0;
				for (var k = 0; k < monthlySales[key].length; k++) {
					totalQuantity += parseInt(monthlySales[key][k]);
				}
				totalQuantities.push(totalQuantity);
			}

			// Calculate the average from each total
			var avg = 0;
			for (var l = 0; l < totalQuantities.length; l++) {
				avg += parseInt(totalQuantities[l]);
			}
			avg /= totalQuantities.length;
			$scope.items[i].avgQuantity = avg;
			$scope.items[i].avgRevenue = avg * $scope.items[i].Price;
		}
	}
});

app.controller('reportCtl', function ($scope, databaseData) {
	$scope.items = [];
	$scope.sales = [];
	$scope.sales2 = [];
	$scope.startWeek = 0;
	$scope.endWeek = 0;
	$scope.onOff = true;
	
	// prototype allows you to .addDays to date
	Date.prototype.addDays = function(days)
	{
		var date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		return date;
	}

	// jquery code for toggle switch and date picker
	$("[name='pushtoggle']").bootstrapSwitch();

	$('.datepicker').datepicker();

	 $('#apple').datepicker().on('changeDate', function(e){ 
		$scope.$apply(function(){
			$scope.startWeek = new Date(e.date);
			var temp = new Date(e.date).addDays(7);
			$scope.endWeek = (temp.getDate() + '/' + (temp.getMonth() + 1) + '/' + temp.getYear());
		 })
	 });
	
	// Note Toggle ON = Month, Toggle OFF = Week
	$('input[name="pushtoggle"]').on('switchChange.bootstrapSwitch', function(event, state) {
		$scope.$apply(function(){
		$scope.onOff = state;
		})
	});
	
	$scope.getWeek = function () {
		$scope.startWeek = $scope.selectedWeek.days;
		$scope.endWeek = $scope.startWeek + 7;

	$scope.months = [
		{name: "January", value: 1}, {name: "February", value: 2}, {name: "March", value: 3}, 
		{name: "April", value: 4}, {name: "May", value: 5}, {name: "June", value: 6}, {name: "July", value: 7}, 
		{name: "August", value: 8}, {name: "September", value: 9}, {name: "October", value: 10}, {name: "November", value: 11},
		{name: "December", value: 12}];

	$scope.years = ["2016", "2015", "2014"];

	//Set the Month based on dropdown box
	$scope.getMonth = function () {
			$scope.month = $scope.selectedMonth.name;
		}
		//Set the year based on dropdown box
	$scope.getYear = function () {
		if ($scope.selectedYear == "2016")
			$scope.year = new Date().getFullYear();
		else if ($scope.selectedYear == "2015")
			$scope.year = new Date().getFullYear() - 1;
		else
			$scope.year = new Date().getFullYear() - 2;

		$scope.year = $scope.year.toString();
	}

	function getSales() {
		databaseData.getData("sales")
			.then(function (response) {
				$scope.sales = response.data;
			})
	}


	function getItem() {
		databaseData.getData("item")
			.then(function (response) {
				$scope.items = response.data;
				updateNames();
				updatePrices();
			})
	}

	function updatePrices() {
		for (var i = 0; i < $scope.sales.length; i++) {
			var id = $scope.sales[i].ItemID;
			for (var j = 0; j < $scope.items.length; j++) {
				if ($scope.items[j].ItemID == id) {
					$scope.sales[i].Price = $scope.sales[i].Quantity * $scope.items[j].Price;
					break;
				}
			}
		}
	}

	function updateNames() {
		for (var i = 0; i < $scope.sales.length; i++) {
			var id = $scope.sales[i].ItemID;
			for (var j = 0; j < $scope.items.length; j++) {
				if ($scope.items[j].ItemID == id) {
					$scope.sales[i].ItemName = $scope.items[j].Name;
					break;
				}
			}
		}
	}

	$scope.generateTable = function () {
		getSales();
 		getItem();
		
		$scope.sales2 = $scope.sales;
		
		var tempDate = new Date() 
 		var date = new Date($scope.year + "," + $scope.month);
 		var timeStamp ="";
 		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
 		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

 		for(var i = 0; i < $scope.sales2.length; i++) 
 			{
 				timeStamp = $scope.sales2[i].Date;
 				tempDate = new Date(timeStamp * 1);

				if ($scope.onOff == true)
				{
 					if(tempDate < firstDay || tempDate > lastDay) 
 					{
 						$scope.sales2.splice(i, 1);
 						i--;
 					}
				}
				else if ($scope.onOff == false)
				{
					if (tempDate < $scope.startWeek || tempDate > $scope.startWeek.addDays(7))
					{
						$scope.sales2.splice(i, 1);
						i--;
					}
				}
			}
 		}
	}
	});