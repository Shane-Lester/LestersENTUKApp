// dataService.js
angular.module('starter.dataService', [])

.factory('Data',['$localstorage','$http',function($localstorage, $http){
  var storedSettings ={};// private variable that tracks the stored settings
  var loadedClinicalData = {};
  var loadedDepartmentData = {};
  var addition  ='';
  var settingsObj = {
        root:"",
       clinical:"js/clinical.json",
       department:"js/department.json"
   };

  return{
    initialize:function(){
      console.log('initializing');
      this.getSettings();
      // console.log(storedSettings);
      this.loadClinicalData(storedSettings.clinical);
      // console.log(storedSettings.clinical);
      this.loadDepartmentData(storedSettings.department);
      // console.log(storedSettings.department);

    },
    getSettings:function(){
      // console.log('getting settings');

     storedSettings = $localstorage.getObject('settings');

    if(!(storedSettings.clinical || storedSettings.admin)){
        //  there are settings missing- so set to default
         storedSettings = settingsObj
         $localstorage.setObject("settings",storedSettings);
        //  console.log(storedSettings);
       }
         return storedSettings;
      },
      storeSettings: function(newSettings){
        this.getSettings();
        if(newSettings.clinical){
          storedSettings.clinical = newSettings.clinical;
        }
        if(newSettings.department){
          storedSettings.department = newSettings.department;
        }
        if(newSettings.root){
          storedSettings.root = newSettings.root;
        }
        if(newSettings.specialty){
          storedSettings.specialty = newSettings.specialty;
        }
        $localstorage.setObject("settings",storedSettings);
        this.makeURL();
      },

      getClinicalSettings:function(){
        return storedSettings.clinical;
      },

      getDepartmentSettings: function(){
        return storedSettings.department;
      },

      loadClinicalData: function(clinicalURL,isCached){
        if(isCached == false){
          addition = '?' + new Date;
        }
        return $http.get(clinicalURL + addition,{cache:isCached})
            .then(function(data){
              loadedClinicalData = data.data;
              // console.log(loadedClinicalData);
                return data.data;
                  },
            function(error){
                    console.log('load failed');
                    return false;
            });
      },

      loadDepartmentData: function(departmentURL,isCached){
        if(isCached == false){
          console.log('not caching');
          addition = '?' + new Date;
        }
        return $http.get(departmentURL + addition,{cache:isCached})
            .then(function(data){
              loadedDepartmentData = data.data;
              // console.log(loadedDepartmentData);
                return data.data;
                  },
            function(error){
                    console.log('load failed');
                    return false;
            });
      },

      getDepartmentData: function(){
        return loadedDepartmentData;
      },

      getClinicalData: function(){
        return loadedClinicalData;
      },

      makeURL: function(){
        //need to edit the function to pass the made URL's back
        var URLObject=$localstorage.getObject('settings');
        //if using local settings then don't add http://www.
        if(URLObject.clinical !== "js/clinical.json"){
          console.log('creating clinical URL');
          //only add www if it's not already added
          if(URLObject.clinical.indexOf('www')== -1){
                  URLObject.clinical= "http://www." + URLObject.clinical + "/docs/clinical.json";
                }
            }
        else{
          //backup in case of failed load of settings
          URLObject.clinical="js/clinical.json";
        }

        if(URLObject.department!=="js/department.json"){
          console.log('creating department URL');
          //only add www if it's not already added
              if(URLObject.department.indexOf('www')==-1){
                console.log('decorating department URL');
                  URLObject.department = "http://www." + URLObject.department + "/docs/department.json";
                }
            }
        else{
          //backup in case of failed load of settings
          URLObject.department="js/department.json"

        }
        $localstorage.setObject('settings',URLObject);
        return URLObject;
      }
    }
}])
