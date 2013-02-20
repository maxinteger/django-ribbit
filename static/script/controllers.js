/**
 * Created with PyCharm.
 * User: vadasz
 * Date: 2013.02.03.
 * Time: 1:06
 */

'use strict';


angular.module('SharedServices', [])
    .config(function ($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['X-CSRFToken'] = util.getCookie('csrftoken');
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        $httpProvider.defaults.transformRequest.push(function (data, headersGetter) {
            $('#id-ribbit-load').show();
            return data;
        });
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
    });

angular.module('ribbitServices', ['ngResource'])
    .factory('Ribbits', function($resource){
        return $resource('phones/:phoneId.json', {}, {
            query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
        });
    });


angular.module('ribbit', ['SharedServices', 'ribbitServices']);


/* Controllers */

function RibbitListCtrl($scope, $http, X) {
    console.log(arguments)
    var updateList = function(){
        $http.get('post/ribbits').success(function(data) {
            $scope.ribbits = data.ribbits;
        });
    }
console.log($scope)
    $scope.$root.$on('new_ribbit', function(event, args) {
        updateList();
    });

    updateList();
}

function RibbitSaveCtrl($scope, $http){
    $scope.saveRibbit = function() {
        if ($scope.ribbit){
            var saveDate = { ribbit: $scope.ribbit };
            $http.post('ribbit_save', $.param(saveDate)).success(function(data){
                $('#id-new-ribbit-field').removeClass('changed').val('');
                $scope.$emit('new_ribbit', saveDate);
            });
        }
    };
}

function userListCtrl($scope, $http){
    console.log(arguments)
    $http.post('user_list').success(function(data){
        $scope.users = data;
    });
}
