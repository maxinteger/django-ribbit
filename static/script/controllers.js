/**
 * Created with PyCharm.
 * User: vadasz
 * Date: 2013.02.03.
 * Time: 1:06
 */

'use strict';


angular.module('SharedServices', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            $('#id-ribbit-load').show();
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
// register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                $('#id-ribbit-load').hide();
                return response;
            }, function (response) {
                $('#id-ribbit-load').hide();
                return $q.reject(response);
            });
        };
    })

angular.module('ribbit', ['SharedServices']);

/* Controllers */

function RibbitListCtrl($scope, $http) {
    $http.get('post/ribbits').success(function(data) {
        $scope.ribbits = data.ribbits;
    });
}
