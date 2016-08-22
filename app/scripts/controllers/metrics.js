'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:MetricsCtrl
 * @description
 * # MetricsCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
.controller('MetricsCtrl', [
    '$scope',
    '$rootScope',
    'myService',
function ($scope , $rootScope, myService) {
    $scope.stats = {
        openIssues: 0,
        activeCustomers: 0
    };

    $scope.reportedIssues = {
        "series": [
            "Open",
            "Closed"
        ],
        "data": []
    };
    $scope.payingCustomers =
    {
        "series": [
            "Customers"
        ],
        "data": []
    };

    function processIssuesData(){
        var monthData = {};

        $scope.reportedIssues.data = [];
        $scope.stats.openIssues = 0;
        for(var x in myService.allIssues){
            var issueEnd = myService.allIssues[x].closedTimestamp * 1000;

            if(myService.allIssues[x].status == 'open'){
                $scope.stats.openIssues++;
            }

            var d = new Date(myService.allIssues[x].submissionTimestamp * 1000),
                dk = d.getFullYear() + '/' + (d.getMonth()+1);

            if(typeof monthData[dk] === 'undefined')
                monthData[dk] = { open: 0, closed: 0};
            monthData[dk].open++;

            if(issueEnd){
                var d = new Date(issueEnd),
                    dk = d.getFullYear() + '/' + (d.getMonth()+1);

                if(typeof monthData[dk] === 'undefined')
                    monthData[dk] = { open: 0, closed: 0};
                monthData[dk].closed++;
            }
        }

        for(var d in monthData){
            var c = monthData[d];
            $scope.reportedIssues.data.push({
                x: d,
                y: [c.open, c.closed]
            })
        }
    }

    function processCustomersData(){
        var monthData = {};
        $scope.stats.activeCustomers = 0;
        $scope.payingCustomers.data = [];

        for(var x in myService.allCustomers){
            var supportEnd = myService.allCustomers[x].supportEnd * 1000;

            if(!supportEnd){
                $scope.stats.activeCustomers++;
            }

            var d = new Date(myService.allCustomers[x].supportStart*1000),
                de = supportEnd ? new Date(supportEnd) : new Date();

            if(d > de) {
                debugger;
                return;
            }
            d.setDate(1);
            do{
                var dk = d/1;

                if(typeof monthData[dk] === 'undefined')
                    monthData[dk] = 0;

                monthData[dk]++;
                d.setMonth(d.getMonth() + 1)
            }while(d < de);
        }
        var _monthData = [];
        for(var d in monthData){
            var c = monthData[d];
            _monthData.push([ parseInt(d), c ]);
        }
        _monthData.sort(function(a,b){
            return a[0] - b[0];
        })
        for(var _dd in _monthData){
            var d = _monthData[_dd][0],
                c = _monthData[_dd][1],
                dObj = new Date(d);
            $scope.payingCustomers.data.push({
                x: dObj.getFullYear() + '/' + (dObj.getMonth()+1),
                y: [c]
            })
        }
    }

    $rootScope.$on('issuesUpdated', processIssuesData);
    if(myService.allIssues)
        processIssuesData();

    $rootScope.$on('customersUpdated', processCustomersData);
    if(myService.allCustomers)
        processCustomersData();

    $scope.chartConfigCustomers = $scope.chartConfigIssues = {
        xAxisMaxTicks: 7,
        //waitForHeightAndWidth:true,
        title: false,
        tooltips: true,
        labels: false,
        mouseover: function() {},
        mouseout: function() {},
        click: function() {},
        legend: {
            display: true,
            //could be 'left, right'
            position: 'left'
        },
        innerRadius: 0, // applicable on pieCharts, can be a percentage like '50%'
        lineLegend: 'lineEnd' // can be also 'traditional'
    };



}]);
