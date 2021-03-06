//Custom module with dependencies on ngRoute and AdalAngular providers
var o365CorsApp = angular.module("o365CorsApp", ['ngRoute', 'AdalAngular'])

o365CorsApp.config(['$routeProvider', '$httpProvider', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, adalProvider) {
    $routeProvider
           .when('/',
           {
               controller: 'ContactsController',
               templateUrl: '/app/templates/Contacts.html',
               requireADLogin: true
           })
           .when('/contacts/new',
           {
               controller: 'ContactsNewController',
               templateUrl: '/app/templates/ContactsNew.html',
               requireADLogin: true
               
           })
           .when('/contacts/edit',
           {
               controller: 'ContactsEditController',
               templateUrl: '/app/templates/ContactsEdit.html',
               requireADLogin: true

           })
           .when('/contacts/delete',
           {
               controller: 'ContactsDeleteController',
               templateUrl: '/app/templates/Contacts.html',
               requireADLogin: true

           })
           .otherwise({ redirectTo: '/' });

    var adalConfig = {
        tenant: '5b532de2-3c90-4e6b-bf85-db0ed9cf5b48',
        clientId: '1cdf3582-12e3-405d-8ea3-315bda8df207',
        endpoints: {
           "https://outlook.office365.com/api/v1.0": "https://outlook.office365.com/"
        }
    };
    adalProvider.init(adalConfig, $httpProvider);
}]);


o365CorsApp.factory("ShareData", function () {
    return { value: 0 }
});


o365CorsApp.controller("ContactsController", function ($scope, $location, ShareData, o365CorsFactory) {
    o365CorsFactory.getContacts().then(function (response) {
        $scope.contacts = response.data.value;
    });

    $scope.editUser = function (contactId) {
        ShareData.value = contactId;
        $location.path('/contacts/edit');
    };
    $scope.deleteUser = function (contactId) {
        ShareData.value = contactId;
        $location.path('/contacts/delete');
    };
});
o365CorsApp.controller("ContactsNewController", function ($scope, $location,o365CorsFactory) {
    $scope.add = function () {
        var givenName = $scope.givenName
        var surName = $scope.surName
        var email = $scope.email
        contact = {
            "GivenName": givenName, "Surname": surName, "EmailAddresses": [
                    {
                        "Address": email,
                        "Name": givenName
                    }
            ]
        }

        o365CorsFactory.insertContact(contact).then(function () {
            $location.path("/#");
        });
    }
});
o365CorsApp.controller("ContactsEditController", function ($scope,$location, ShareData, o365CorsFactory) {
    var id = ShareData.value;

    o365CorsFactory.getContact(id).then(function (response) {
        $scope.contact = response.data;
    });
   
    $scope.update = function () {

        var givenName = $scope.contact.GivenName
        var surName = $scope.contact.Surname
        var email = $scope.contact.EmailAddresses[0].Address
        var id = ShareData.value;

        contact = {
            "GivenName": givenName, "Surname": surName, "EmailAddresses": [
                    {
                        "Address": email,
                        "Name": givenName
                    }
            ]
        }
                
        o365CorsFactory.updateContact(contact, id).then(function () {
            $location.path("/#");
        });
    };
});
o365CorsApp.controller("ContactsDeleteController", function ($scope, $location, ShareData, o365CorsFactory) {
    var id = ShareData.value;
   
    o365CorsFactory.deleteContact(id).then(function () {
        $location.path("/#");
    });
});

o365CorsApp.factory('o365CorsFactory', ['$http' ,function ($http) {
    var factory = {};
   
    factory.getContacts = function () {
        return $http.get('https://outlook.office365.com/api/v1.0/me/contacts')
    }

    factory.getContact = function (id) {
        return $http.get('https://outlook.office365.com/api/v1.0/me/contacts/'+id)
    }

    factory.insertContact = function (contact) {
       var options = {
            url: 'https://outlook.office365.com/api/v1.0/me/contacts',
            method: 'POST',
            data: JSON.stringify(contact),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        };
        return $http(options);
    }

    factory.updateContact = function (contact,id) {
        var options = {
            url: 'https://outlook.office365.com/api/v1.0/me/contacts/'+id,
            method: 'PATCH',
            data: JSON.stringify(contact),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        };
        return $http(options);
    }

    factory.deleteContact = function (id) {
        var options = {
            url: 'https://outlook.office365.com/api/v1.0/me/contacts/'+id,
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        };
        return $http(options);
    }

    return factory;
}]);

