angular.module('projectlist', [])

.controller('ProjectlistCtrl', function($filter,ionicDatePicker,$scope,$state,$http,$rootScope,$ionicPopup,$ionicLoading,$timeout,$ionicModal,$cordovaSms,$cordovaDevice) {

        $scope.AuthToken=localStorage.getItem("auth_token")
        $scope.search=""; 

            $http.get(Baseurl+'projects?app_version='+versioncheck,{
                headers: { "Authorization": "Token token="+$scope.AuthToken}
              })
             .success(function(response) {             	
                $scope.ProjectDetails=response;
            })

              $scope.projectback=function(){
                 $state.go("admin_dashboard");
              }


             $scope.teams=function(id,name){              
             	$scope.ProjectID=id;
              $rootScope.Projectname=name;
             	$state.go("teams");         
                $http.get(Baseurl+'projects/project_employee?project_id='+$scope.ProjectID+'&app_version='+versioncheck,{
                headers: { "Authorization": "Token token="+$scope.AuthToken}
              })
	             .success(function(response) {             	
	                $rootScope.TeamMember=response;
                  console.log($rootScope.TeamMember)
	            })
           }


            $scope.cost=function(id,name,budget){
              $scope.ProjectID=id;
              $rootScope.Projectname=name;
              $rootScope.Projectbudget=budget;
              $state.go("cost");
                   
                $http.get(Baseurl+'time_sheets/cost_estimate?project_id='+$scope.ProjectID+'&app_version='+versioncheck,{
                headers: { "Authorization": "Token token="+$scope.AuthToken}
              })
               .success(function(response) { 
                  $rootScope.total_ctc=0;
                  $rootScope.total_hr=0;
                  $rootScope.total_amt=0;
                  $rootScope.costs=response;
                    for(var i in response){
                       $rootScope.total_ctc += response[i].ctc;

                       $rootScope.total_hr += response[i].hours;
                       $rootScope.total_amt += response[i].amount;
                    }  
                  
                  
                }) 
            }

           $rootScope.projectlist=function(){
                $http.get(Baseurl+'projects?app_version='+versioncheck,{
                headers: { "Authorization": "Token token="+$scope.AuthToken}
              })
               .success(function(response) {              
                  $scope.ProjectDetails=response;
              })
           }

		  	 

		    $scope.NewProject=function(){
		    	$state.go("createnewproject");
		    }


            $http.get(Baseurl+'clients?app_version='+versioncheck,{
                headers: { "Authorization": "Token token="+$scope.AuthToken}
              })
           .success(function(response) {
                $scope.ClientDetails=response;
                     $scope.clientnameside=$scope.ClientDetails ;  
                      $scope.clientname = function(objs)
                      {
                          if(objs!=null){
                           $scope.clientnametype=objs.id;
                          }else{
                           $scope.clientnametype=null; 
                          }
                      }
            })
            
           $scope.clientnameside="";
           $scope.name="";
           $scope.budget=="";
            
           $scope.createproject=function(name,budget){
             if($scope.clientnametype=="" || $scope.clientnametype==null || $scope.clientnametype==undefined){
                alert("Please Select the Client Name")
             }else if(name=="" || name==null || name==undefined){
               alert("Enter the Project Name")
             }else if(budget=="" || budget==null || budget==undefined){
              alert("Enter the Project budget Amount");
             }else{
                 var create={           
                  "client_id":$scope.clientnametype,
                  "name":name,
                  "budget":budget
                }           

               $http({
                 method: 'post',
                 url:Baseurl+"projects?app_version="+versioncheck,
                 data: create,
                 headers: { "Authorization": "Token token="+$scope.AuthToken}                  
               }).then(function(response) {
                 alert("success")
                 $state.go("projectlist");
               })
             }
           }

        

           $scope.costback=function(){
            $state.go("projectlist");
           }

           $scope.teamback=function(){
              $state.go("projectlist");
           }

                     $scope.WeekStatus='current';

           $scope.timesheet_project=function(id,name){
              $rootScope.ID=id;
              $rootScope.Projectname=name;
              $scope.WeekStatus='current';
              $state.go("project_timesheet");  
              $scope.Timesheetcal($scope.WeekStatus);          
           }




          $scope.Previous=function(Previous){
              $scope.WeekStatus=Previous;             
              $scope.Timesheetcal($scope.WeekStatus);
          }

          $scope.Next=function(Next){
              $scope.WeekStatus=Next;
              $scope.Timesheetcal($scope.WeekStatus);
          }

          $scope.Current=function(Current){
              $scope.WeekStatus=Current;
              $scope.Timesheetcal($scope.WeekStatus);
          }

        
        
        $scope.Timesheetcal=function(WeekStatu){  
            if(WeekStatu!=undefined){
              $scope.WeekStatus=WeekStatu;
            }else{         
              $scope.WeekStatus='current';
            }
            $scope.Day1=0;
            $scope.Day2=0;
            $scope.Day3=0;
            $scope.Day4=0;
            $scope.Day5=0;
            $scope.Day6=0;
            $scope.Day7=0;
            $scope.CheckApprove=false;
           $http.get(Baseurl+'time_sheets/project_working_hours?project_id='+$rootScope.ID+'&date='+$scope.WeekStatus+'&app_version='+versioncheck,{
                headers: { "Authorization": "Token token="+$scope.AuthToken}
              })
           .success(function(response) {
                $scope.Timesheets=response[0];
                if($scope.Timesheets!=undefined){                  
                  $scope.FromDate=$scope.Timesheets[0].from_date;
                  $scope.ToDate=$scope.Timesheets[0].to_date;
                }
                $scope.ProjectApprovalID=[];
                $scope.TimesheetsDetails=response[1];
                console.log($scope.TimesheetsDetails)
                $scope.showApprove = [];
                $scope.Day1=0;
                $scope.Day2=0;
                $scope.Day3=0;
                $scope.Day4=0;
                $scope.Day5=0;
                $scope.Day6=0;
                $scope.Day7=0;
                $scope.CheckApprove=false;
                if($scope.TimesheetsDetails!=undefined){
                    for (var i = 0; i < $scope.TimesheetsDetails.length; i++) {
                      $scope.ProjectApprovalID.push($scope.TimesheetsDetails[i].id);
                        if($scope.TimesheetsDetails[i].day1!=undefined && $scope.TimesheetsDetails[i].day1!="" && $scope.TimesheetsDetails[i].day1!=null){
                          $scope.Day1 +=$scope.TimesheetsDetails[i].day1;
                        }
                        if($scope.TimesheetsDetails[i].day2!=undefined && $scope.TimesheetsDetails[i].day2!="" && $scope.TimesheetsDetails[i].day2!=null){
                          $scope.Day2 +=$scope.TimesheetsDetails[i].day2;
                        }
                        if($scope.TimesheetsDetails[i].day3!=undefined && $scope.TimesheetsDetails[i].day3!="" && $scope.TimesheetsDetails[i].day3!=null){
                          $scope.Day3 +=$scope.TimesheetsDetails[i].day3;
                        }
                        if($scope.TimesheetsDetails[i].day4!=undefined && $scope.TimesheetsDetails[i].day4!="" && $scope.TimesheetsDetails[i].day4!=null){
                          $scope.Day4 +=$scope.TimesheetsDetails[i].day4;
                        }
                        if($scope.TimesheetsDetails[i].day5!=undefined && $scope.TimesheetsDetails[i].day5!="" && $scope.TimesheetsDetails[i].day5!=null){
                          $scope.Day5 +=$scope.TimesheetsDetails[i].day5;
                        }
                        if($scope.TimesheetsDetails[i].day6!=undefined && $scope.TimesheetsDetails[i].day6!="" && $scope.TimesheetsDetails[i].day6!=null){
                          $scope.Day6 +=$scope.TimesheetsDetails[i].day6;
                        }
                        if($scope.TimesheetsDetails[i].day7!=undefined && $scope.TimesheetsDetails[i].day7!="" && $scope.TimesheetsDetails[i].day7!=null){
                          $scope.Day7 +=$scope.TimesheetsDetails[i].day7;
                        }

                         if(($scope.TimesheetsDetails[i].approval_status1 == false && $scope.TimesheetsDetails[i].approval_status1 != undefined) || ($scope.TimesheetsDetails[i].approval_status2 == false && $scope.TimesheetsDetails[i].approval_status2 != undefined) || ($scope.TimesheetsDetails[i].approval_status3 == false && $scope.TimesheetsDetails[i].approval_status3 != undefined) || ($scope.TimesheetsDetails[i].approval_status4 == false && $scope.TimesheetsDetails[i].approval_status4 != undefined) || ($scope.TimesheetsDetails[i].approval_status5 == false && $scope.TimesheetsDetails[i].approval_status5 != undefined) || ($scope.TimesheetsDetails[i].approval_status6 == false && $scope.TimesheetsDetails[i].approval_status6 != undefined) || ($scope.TimesheetsDetails[i].approval_status7 == false && $scope.TimesheetsDetails[i].approval_status7 != undefined)){
                          $scope.showApprove.push("Not Approval");
                         }else{
                           
                           $scope.showApprove.push("Approval");
                         }
                    }
                    console.log($scope.showApprove)      
                    for(var k in $scope.showApprove){
                      if($scope.showApprove[k]!='Approval'){
                       $scope.CheckApprove=true;
                       console.log($scope.showApprove[k])
                      }
                    }
                }               
            })

         }

         $scope.ProjectApproval=function(){
                    if($scope.ProjectApprovalID.length == 0){
                        alert("No Data")
                    }else{
                         $http.get(Baseurl+'projects/approval_status?project_id='+$rootScope.ID+'&app_version='+versioncheck,{
                            headers: { "Authorization": "Token token="+$scope.AuthToken}
                          })
                         .success(function(response) {
                          alert("success")
                         }) 
                     }                  
          }

          $scope.call = function(number,id){ 
            console.log(number,id)
            window.plugins.CallNumber.callNumber(function(result){
              if (window.PhoneCallTrap) {
                PhoneCallTrap.onCall(function(state) {  
                });
              }
             //success logic goes here
            }, function(error){
             // alert(error)
             //error logic goes here
            }, number) 
          }


          $scope.popup=function(mobile_number,id,response){       
               $scope.teamMode={response:""};
               console.log(mobile_number,id,response)
                  var data=response;  
                 
                //CONFIGURATION    
                    var options = {
                      replaceLineBreaks: false, // true to replace \n by a new line, false by default
                      android: {
                          //intent: 'INTENT' // send SMS with the native android SMS messaging
                          intent: '' // send SMS without open any other app
                        }
                    };

                    $cordovaSms
                      .send(mobile_number,data, options) 
                      .then(function(success) {     
                          if(success==true)
                          {
                            var myPopup = $ionicPopup.show({
                            template: number,
                            title: "Message has been sent",
                            buttons: [
                            {
                              text: 'OK',
                              type: 'button-dark',
                              onTap: function(e) { return true; } 
                             }]
                            })
                          }
                      }, function(error) {                       
                         var myPopup = $ionicPopup.show({
                              template: number,
                              title: "Message can't sent",
                              buttons: [
                              {
                              text: 'OK',
                              type: 'button-dark',
                              onTap: function(e) { return true; } 
                              }]
                          }) 
                    });        
          }     
          

         /* $ionicModal.fromTemplateUrl("templates/my-modal.html", {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function (modal) {
            $scope.modal = modal;
            return modal;
          });*/
          
          $scope.teamMode={response:""};

          $scope.openModal = function(mobile_number,id,pname) {
            $scope.teamMode={response:""};
            $scope.mNumber=mobile_number;
            $scope.selectedId=id;
            $scope.nameOpen=pname;
            $scope.modal.show();
            
            };
            $scope.closeModal = function() {
                $scope.teamMode={response:""};
                $scope.modal.hide();
            };
           
            $scope.moreDetail=function(detail){
              $rootScope.empdetail=detail; 
              console.log($rootScope.empdetail)
              $state.go("emp_information");
            }


            $scope.CallPost=function(id){
                 var create={
                        "call_log": 
                        {
                            "from_employee_id":$rootScope.EmployeeID,
                            "to_employee_id": id,
                            "to_contact_id": 0,
                            "start_time": "00:00",
                            "end_time": "00:00"
                        }
                      }      
             
                    $http({
                      method: 'post',
                      url:Baseurl+"logs/call_create?app_version="+versioncheck,
                      data: create,
                      headers: {"Authorization": "Token token="+$scope.AuthToken}    
                    }).then(function(response) {                                
                   })
            
            }  

            $scope.SMSPost=function(selectedId,response){
                     var create={
                      "message_log": 
                        {
                          "from_employee_id":$rootScope.EmployeeID,
                          "to_employee_id": selectedId,
                          "to_contact_id": 0,
                          "message":response
                        }
                       }   
            
                        $http({
                          method: 'post',
                          url:Baseurl+"logs/message_create?app_version="+versioncheck,
                          data: create,
                          headers: {"Authorization": "Token token="+$scope.AuthToken}    
                        }).then(function(response) {
            
                       })
            
            }


 })


