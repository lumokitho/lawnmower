/****************************************************************************************************************
 * controller
 ****************************************************************************************************************/
angular.module('lawn').controller('MainController', function ($scope, $http, $location, $interval){

      var vm = this, $handle = null, $checkEvery = 5;
      vm.simulation = false;
      vm.data = {};
      vm.config = {};

      // everything initialized ?
      $http.get('server.php?q=setup.get').then(function (response){
         vm.config = response.data;

         // create interal
         $handle = $interval(function (){
            $getData();
         }, $checkEvery * 1000);

         // for initial data
         $getData();
      }, function (){
         $location.path("/setup");
      });

      /**
       * helper function for updating data
       */
      function $getData(){
         if (vm.simulation) {
            var states = ['lädt auf', 'ist in Ladestation', 'mäht', 'folgt der Begrenzung', 'ist gefangen', 'außerhalb der Grenze'];
            vm.data.action = parseInt(Math.random() * states.length, 10);
            vm.data.action = states[vm.data.action];
            vm.data.battery = parseInt(Math.random() * 100, 10);
            vm.data.nickname = "Demonstrationsmodus";
            vm.data.icon = "idle";
            vm.data.distance = "0";
         } else {
            $http.get('server.php?q=data.get').then(function (response){
               vm.data = response.data;
            });
         }
      }

      /**
       * on destroy of controller -> cleanup
       */
      $scope.$on("destroy", function (){
         $interval.cancel($handle);
      });


      /**
       * toggle simulation mode
       */
      vm.toggleSimulation = function (){
         vm.simulation = !vm.simulation;
      };
      /**
       * depending on load the batter has different color
       */
      vm.batteryColor = function (){
         if (angular.isDefined(vm.data.battery)) {
            if (vm.data.battery < 50) {
               return "low";
            }
            if (vm.data.battery < 70) {
               return "medium";
            }
         }
         return "high";
      };
   }
);

