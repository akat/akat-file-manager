'use strict';

angular.module('akat-file-manager', ['ngFileUpload']);

'use strict';

angular.module('akat-file-manager').directive('akatfilemanager', ['$q', '$timeout', function ($q, $timeout) {
  return {
    templateUrl: 'submodules/akat-file-manager/directives/akat-filemanager.html',
    restrict: 'E',
    scope: { files: "=" },
    link: function link($scope, element, attr) {
      $scope.tabactive = {};
      $scope.selectedtype = 'low_resolution';

      $timeout(function () {
        $scope.pageOffset = attr.pageoffset;
        $scope.tabactive.mediaActive = true;
      });

      var slice = Array.prototype.slice;
      $scope.selectPhoto = function (id) {
        $scope.selected_photo = $scope.files[id];
        $scope.preview = $scope.files[id][$scope.selectedtype].url;
      };

      $scope.uploadFileClick = function (target) {
        angular.element(target).trigger('click');
      };

      $scope.deleteSelected = function () {
        $scope.$emit('akat-filemanager-delete', $scope.selected_photo);
      };

      $scope.updateFileInfo = function () {
        $scope.$emit('akat-filemanager-update', $scope.selected_photo);
      };

      element.bind('change', function (e) {
        var element = e.target;
        if (!element.value) return;
        if (!e.originalEvent.srcElement.id) return;

        //element.disabled = true;
        $q.all(slice.call(element.files, 0).map(readFile)).then(function (values) {
          $scope.tabactive.mediaActive = true;
          values.forEach(function (fileblob, key) {
            uploadFile(fileblob, element.files[key]);
          });
        });

        function uploadFile(file, uploadoptions) {
          $scope.mediaActive = true;

          var newfile = {
            filename: uploadoptions.name,
            progress: 10,
            label: '',
            alt: '',
            description: '',
            low_resolution: {
              url: 'http://icons.iconarchive.com/icons/tristan-edwards/sevenesque/1024/Preview-icon.png',
              width: '150',
              height: '150'
            },
            thumbnail: {
              url: 'http://icons.iconarchive.com/icons/tristan-edwards/sevenesque/1024/Preview-icon.png',
              width: '150',
              height: '150'
            },
            standar_resolution: {
              url: 'http://icons.iconarchive.com/icons/tristan-edwards/sevenesque/1024/Preview-icon.png',
              width: '150',
              height: '150'
            },
            large_resolution: {
              url: 'http://icons.iconarchive.com/icons/tristan-edwards/sevenesque/1024/Preview-icon.png',
              width: '150',
              height: '150'
            },
            date: new Date()
          };

          $scope.files.unshift(newfile);

          var newfileData = {};
          newfileData.blob = file;
          newfileData.uploadOptions = {};
          newfileData.uploadOptions.path = attr.fpath;
          newfileData.uploadOptions.file = uploadoptions;
          $scope.$emit('akat-filemanager-upload', newfileData);
        }

        function readFile(file) {
          var deferred = $q.defer();

          var reader = new FileReader();
          reader.onload = function (e) {
            deferred.resolve(e.target.result);
          };
          reader.onerror = function (e) {
            deferred.reject(e);
          };
          reader.readAsDataURL(file);
          return deferred.promise;
        }
      });

      $scope.selectFile = function (selectedtype) {
        if ($scope.selected_photo) {
          $scope.selected_photo.selectedtype = selectedtype;
          $scope.$emit('akat-filemanager-select', $scope.selected_photo);
        }
      };
    }
  };
}]);

'use strict';

angular.module('akat-file-manager').directive('resize', ['$window', '$timeout', function ($window, $timeout) {
    return function (scope, element, attr) {
        var w = angular.element($window);
        $timeout(function () {
            var pageOffset = Number(scope.$parent.$parent.pageOffset);
            var attrOffset = Number(attr.offset);
            var offset = pageOffset + attrOffset;
            var changeHeight = function changeHeight() {
                element.css('height', w.height() - offset + 'px');
            };

            w.bind('resize', function () {
                changeHeight(); // when window size gets changed          	 
            });
            changeHeight(); // when page loads    
        });
    };
}]);

angular.module('akat-file-manager').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('submodules/akat-file-manager/directives/akat-filemanager.html',
    "<div class=\"row\">\n" +
    "\n" +
    "        <div class=\"media\">\n" +
    "            <uib-tabset justified=\"true\">\n" +
    "\n" +
    "                <uib-tab index=\"0\"  heading=\"Μεταμόρφωση αρχείων\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"upload t-center\">\n" +
    "                            <h2>Σύρετε αρχεία οπουδήποτε για μεταφόρτωση</h2>\n" +
    "                            <p>ή</p>\n" +
    "                            <div class=\"btn btn-upload\" ng-click=\"uploadFileClick('#file')\">Επιλογή αρχείου</div>\n" +
    "                             <input ng-hide=\"true\" id=\"file\" type=\"file\" accept=\"image/*\" multiple />\n" +
    "                            <p>Μέγιστο μέγεθος αρχείου: 16 MB.</p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </uib-tab>\n" +
    "\n" +
    "                <uib-tab index=\"1\" active=\"tabactive.mediaActive\" heading=\"Βιβλιοθήκη πολυμέσων\" >\n" +
    "                    <div class=\"gallery t-center\">\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"p0 col-lg-9 col-md-9 col-sm-12 col-xs-12 bg-white main \">\n" +
    "                                <div class=\"head row\">\n" +
    "                                    <div class=\"left\">\n" +
    "                                        <div class=\"btn-group\" uib-dropdown dropdown-append-to-body>\n" +
    "                                            <button id=\"btn-append-to-body\" type=\"button\" class=\"btn btn-date\" uib-dropdown-toggle>\n" +
    "                                                Όλες οι ημερομηνίες <span class=\"caret\"></span>\n" +
    "                                            </button>\n" +
    "                                            <ul class=\"dropdown-menu\" uib-dropdown-menu role=\"menu\" aria-labelledby=\"btn-append-to-body\">\n" +
    "                                                <li role=\"menuitem\"><a href=\"#\">Αυγουστος 2016</a></li>\n" +
    "                                                <li role=\"menuitem\"><a href=\"#\">Ιουλιος 2016</a></li>\n" +
    "                                                <li role=\"menuitem\"><a href=\"#\">Ιούνιος 2016</a></li>\n" +
    "                                            </ul>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"right\">\n" +
    "                                          <input type=\"text\" class=\"form-control\" placeholder=\"Search for image...\">\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"images\" resize offset=\"150\">\n" +
    "                                    <ul class=\"all\">\n" +
    "                                        <li class=\"thumbnail col-lg-2 col-md-2 col-sm-4 col-xs-6\" ng-repeat=\"file in files track by $index\" ng-click=\"selectPhoto($index)\">\n" +
    "                                            <img ng-src=\"{{file.low_resolution.url}}\">      \n" +
    "                                            <uib-progressbar class=\"progress\" ng-if=\"file.progress\" value=\"file.progress\"></uib-progressbar>\n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            \n" +
    "                            <div class=\"col-lg-3 col-md-3 col-sm-12 col-xs-12 bg-grey info\" resize offset=\"87\" ng-show=\"!selected_photo\">\n" +
    "                               <div class=\"head row\">\n" +
    "                                   <h3>ΣΤΟΙΧΕΙΑ ΣΥΝΗΜΜΕΝΟΥ</h3>\n" +
    "                                   <div class=\"desc row\">\n" +
    "                                   <p>Επιλέξτε μια φωτογραφία...</p>\n" +
    "                                   </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"col-lg-3 col-md-3 col-sm-12 col-xs-12 bg-grey info\" resize offset=\"87\" ng-show=\"selected_photo\">\n" +
    "                                <div class=\"head row\">\n" +
    "                                   <h3>ΣΤΟΙΧΕΙΑ ΣΥΝΗΜΜΕΝΟΥ</h3>\n" +
    "                                </div>\n" +
    "                                <div class=\"row infos\">\n" +
    "                                    <div class=\"thumbnail\">\n" +
    "                                        <img ng-src=\"{{preview}}\">\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"desc row\">\n" +
    "                                    <!--<p class=\"name\">{{selected_photo.alt}}</p>-->\n" +
    "                                    <!--<p>2 Αυγ 2016 1 MB 740 × 644</p>-->\n" +
    "                                    <p class=\"delete\"><a href=\"#\" ng-click=\"deleteSelected()\">Διαγραφή οριστικά!</a></p>\n" +
    "                                </div>\n" +
    "    \n" +
    "                               \n" +
    "                                <div class=\"forms row clr\">\n" +
    "                                    <p> Επιλογή τύπου <br>\n" +
    "                                    <select name=\"singleSelect\" ng-model=\"selectedtype\" >\n" +
    "                                        <option value=\"thumbnail\">Thumbnail</option>\n" +
    "                                        <option value=\"low_resolution\" ng-selected=\"true\">Low Resolution</option>\n" +
    "                                        <option value=\"standar_resolution\">Standar Resolution</option>\n" +
    "                                        <option value=\"large_resolution\">Large Resolution</option>\n" +
    "                                    </select>\n" +
    "                                    </p>\n" +
    "                                    <p> URL <input type=\"text\" class=\"form-control\" disabled ng-model=\"preview\" value=\"{{preview}}\"></p>\n" +
    "\n" +
    "                                    <p> Τίτλος <input type=\"text\" class=\"form-control\" ng-model=\"selected_photo.alt\" value=\"{{selected_photo.alt}}\"></p>\n" +
    "                                    <p> Λεζάντα <input type=\"text\" class=\"form-control\" ng-model=\"selected_photo.label\" value=\"{{selected_photo.label}}\"></p>\n" +
    "                                    <p> Περιγραφή <input type=\"text\" class=\"form-control\" ng-model=\"selected_photo.description\" value=\"{{selected_photo.description}}\"></p>\n" +
    "\n" +
    "                                </div>  \n" +
    "\n" +
    "                                <div class=\"select right\">\n" +
    "                                    <button class=\"btn btn-update\" ng-click=\"updateFileInfo()\">Update</button>\n" +
    "                                    <button class=\"btn btn-select\" ng-click=\"selectFile(selectedtype)\">Select</button>\n" +
    "                                \n" +
    "                                </div>\n" +
    "\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </uib-tab>\n" +
    "\n" +
    "            </uib-tabset>\n" +
    "        </div>\n" +
    "\n" +
    "</div>"
  );

}]);
