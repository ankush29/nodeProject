
var companies = angular.module('companies', ['companyService']);

companies.controller('companyCtrl', ['companySearch', '$scope', '$location', function(companySearch, $scope, $location) {

  $scope.comapnies = [];         
  $scope.searchTerm;

  $scope.search = function() {
    $scope.comapnies = [];
    $scope.searchValue();
  };


  $scope.loadMore = function() {
    companySearch($scope.searchTerm).then(function(results) {

      for (var i = 0; i < results.data.length; i++) {
        $scope.comapnies.push(results.data[i]);
      }
    });
  };
  $scope.searchValue = function() {
    clearTimeout($.data(this, 'timer'));
    $(this).data('timer', setTimeout($scope.loadMore, 500));
  }
  $scope.checkIfEnterKeyWasPressed = function($event){
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13 && $(event.target).val() != '' && $('.selected').children().first().attr('href') != undefined) {
      //$('.selected').children().first().click();
      window.location.href = $('.selected').children().first().attr('href');
    } 
    if (keyCode == 38) { // up
      var selected = $(".selected");
      if(selected.prev().length) {
        $scope.hovering = false;
        $("#suggest li").removeClass("selected");
        if (selected.prev().length == 0) {
            selected.siblings().last().addClass("selected");
        } else {
            selected.prev().addClass("selected");
        }
      } else {
        $scope.hovering = false;
        $("#suggest li").removeClass("selected");
        $("#suggest").find('li').last().addClass("selected");
      }
    }
    if (keyCode == 40) { // down
      var selected = $(".selected");
      if(selected.next().length) {
        $scope.hovering = false;
        $("#suggest li").removeClass("selected");
        if (selected.next().length == 0) {
            selected.siblings().first().addClass("selected");
        } else {
            selected.next().addClass("selected");
        }
      } else {
        $scope.hovering = false;
        $("#suggest li").removeClass("selected");
        $("#suggest").find('li').first().addClass("selected");
      }
    }
  };

}]);

companies.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(company) {
          var key = company[keyname];
          key = key.toUpperCase();
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(company);
          }
      });

      return output;
   };
});