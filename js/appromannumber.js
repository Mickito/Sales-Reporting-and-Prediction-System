var app = angular.module("myApp", []);
app.filter ("romanNumFilter", function(){
	return function(numPara) {
		var romanReturn = "";
		switch (numPara) {
		1 : romanReturn="I"; break;		
		2 : romanReturn="II"; break;
		}
		
		return romanReturn;
		}
	;// semi colon for return statement
});