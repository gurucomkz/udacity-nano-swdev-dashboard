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

    $scope.reportedIssuesMorris =
    {
        options:{
            xLabels: "month",
            xkey: 'month',
            stacked: true,
            ykeys: ['open', 'closed'],
            labels: ["Open", "Closed"]
        },
        data: []
    };

    $scope.payingCustomersMorris =
    {
        options:{
            xLabels: "month",
            xkey: 'month',
            ykeys: ['value'],
            labels: ['Customers']
        },
        data: []
    };

    function processIssuesData(){
        var monthData = {};

        $scope.reportedIssuesMorris.data = [];
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
                    dk = d.getFullYear() + '-' + (d.getMonth()+1);

                if(typeof monthData[dk] === 'undefined')
                    monthData[dk] = { open: 0, closed: 0};
                monthData[dk].closed++;
            }
        }

        for(var d in monthData){
            var c = monthData[d];
            $scope.reportedIssuesMorris.data.push({
                month: d,
                open: c.open,
                closed: c.closed
            })
        }
    }

    function processCustomersData(){
        var monthData = {};
        $scope.stats.activeCustomers = 0;
        $scope.payingCustomersMorris.data = [];

        for(var x in myService.allCustomers){
            var supportEnd = myService.allCustomers[x].supportEnd * 1000;

            if(!supportEnd){
                $scope.stats.activeCustomers++;
            }

            var d = new Date(myService.allCustomers[x].supportStart*1000),
                de = supportEnd ? new Date(supportEnd) : new Date();

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

            $scope.payingCustomersMorris.data.push({
                month: dObj.getFullYear() + '-' + (dObj.getMonth()+1),
                value: c
            })
        }
    }

    $rootScope.$on('issuesUpdated', processIssuesData);
    if(myService.allIssues)
        processIssuesData();

    $rootScope.$on('customersUpdated', processCustomersData);
    if(myService.allCustomers)
        processCustomersData();

}]);
