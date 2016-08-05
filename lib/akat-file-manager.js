'use strict';

angular.module('akat-filemanager', []);

'use strict';

angular.module('akat-filemanager').directive('akatfilemanager', ['$q', 'Upload', function ($q, Upload) {
  return {
    templateUrl: 'submodules/akat-file-manager/directives/akat-filemanager.html',
    restrict: 'E',
    scope: { files: "=" },
    link: function link($scope, element, attr) {
      var slice = Array.prototype.slice;

      $scope.selectPhoto = function (id) {
        $scope.selected_photo = $scope.files[id];
      };

      $scope.uploadFileClick = function (target) {
        angular.element(target).trigger('click');
      };

      element.bind('change', function (e) {
        var element = e.target;
        if (!element.value) return;
        $scope.showPhoto = true;
        $scope.progressupload = true;
        $scope.progressPercentage = 0;
        $scope.currentImageActive = false;

        //element.disabled = true;
        $q.all(slice.call(element.files, 0).map(readFile)).then(function (values) {
          //$scope.newfiles = values;

          values.forEach(function (fileblob, key) {
            //TODO:: Do upload for each file and return object
            uploadFile(fileblob, element.files[key]);
          });

          // $scope.photoData = values[0];

          // var uploadoptions = {
          //   file: element.files[0]
          // };

          // if (!angular.isUndefined(attr.fpath)) {
          //   uploadoptions.path = attr.fpath;
          // }

          //console.log(uploadoptions);
          // Upload.upload({
          //   url: '/api/upload/',
          //   data: uploadoptions,
          //   ignoreLoadingBar: true
          // }).then(function (resp) {
          //   var srvPath = resp.data.fakepath;
          //   ngModel.$setViewValue(srvPath);
          //   $scope.progressupload=false;
          //   Notification.success({message: 'File uploaded '+srvPath, delay: 3000});
          // }, function (resp) {
          //   Notification.error({message: 'Error : '+resp.status, delay: 6000});
          // }, function (evt) {
          //   $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          // });
        });

        function uploadFile(file, uploadoptions) {
          uploadoptions.path = attr.fpath;

          var newfileData = {};
          newfileData.blob = file;
          newfileData.uploadOptions = uploadoptions;
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

      $scope.selectFile = function () {
        if ($scope.selected_photo) {
          if (angular.isDefined($scope.selected_photo.thumbnail.url)) {
            $scope.$emit('akat-filemanager-select', $scope.selected_photo);
          }
        }
      };

      function saveFile(data) {
        $scope.selected_photo.savepath = $scope.uploaddir;
        $scope.$emit('akat-filemanager-save', $scope.selected_photo);
      }

      function deleteFile(data) {
        $scope.$emit('akat-filemanager-delete', $scope.selected_photo);
      }
    }
  };
}]);

angular.module('akat-file-manager').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('submodules/akat-file-manager/directives/akat-filemanager.html',
    "<div class=\"row\">\n" +
    "\n" +
    "        <div class=\"media\">\n" +
    "            <uib-tabset active=\"activeJustified\" justified=\"true\">\n" +
    "\n" +
    "                <uib-tab index=\"0\" heading=\"Μεταμόρφωση αρχείων\">\n" +
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
    "                \n" +
    "                <uib-tab index=\"1\" heading=\"Βιβλιοθήκη πολυμέσων\" >\n" +
    "                    <div class=\"gallery t-center\">\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"p0 col-lg-9 col-md-9 bg-white main \">\n" +
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
    "                                <div class=\"images\">\n" +
    "                                    <ul class=\"all\">\n" +
    "                                        <li class=\"thumbnail col-lg-2 col-md-2 col-sm-6\" ng-repeat=\"nfile in newfiles track by $index\">\n" +
    "                                            <img ng-src=\"{{nfile}}\">                                            \n" +
    "                                        </li>\n" +
    "                                        <li class=\"thumbnail col-lg-2 col-md-2 col-sm-6\" ng-repeat=\"file in files track by $index\" ng-click=\"selectPhoto($index)\">\n" +
    "                                            <img ng-src=\"{{file.thumbnail.url}}\">                                            \n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-lg-3 col-md-3 bg-grey info\">\n" +
    "                                <div class=\"head\">\n" +
    "                                   <h3>ΣΤΟΙΧΕΙΑ ΣΥΝΗΜΜΕΝΟΥ</h3>\n" +
    "                                </div>\n" +
    "                                <div class=\"thumbnail\">\n" +
    "                                    <img ng-src=\"{{selected_photo.thumbnail.url}}\">\n" +
    "                                </div>\n" +
    "                                <div class=\"desc\">\n" +
    "                                    <!--<p class=\"name\">{{selected_photo.alt}}</p>-->\n" +
    "                                    <p>2 Αυγ 2016 1 MB 740 × 644</p>\n" +
    "                                    <p class=\"delete\"><a href=\"#\">Διαγραφή οριστικά</a></p>\n" +
    "                                </div>\n" +
    "                                <div class=\"forms\">\n" +
    "\n" +
    "                                    <p> URL <input type=\"text\" class=\"form-control\" disabled ng-model=\"selected_photo.thumbnail.url\" value=\"{{selected_photo.thumbnail.url}}\"></p>\n" +
    "                                    <p> Τίτλος <input type=\"text\" class=\"form-control\" ng-model=\"selected_photo.alt\" value=\"{{selected_photo.alt}}\"></p>\n" +
    "                                    <p> Λεζάντα <input type=\"text\" class=\"form-control\" ng-model=\"selected_photo.label\" value=\"{{selected_photo.label}}\"></p>\n" +
    "                                    <p> Περιγραφή <input type=\"text\" class=\"form-control\" ng-model=\"selected_photo.description\" value=\"{{selected_photo.description}}\"></p>\n" +
    "\n" +
    "                                </div>  \n" +
    "\n" +
    "                                <div class=\"select right\">\n" +
    "\n" +
    "                                    <div class=\"btn btn-select\" ng-click=\"selectFile()\">Επιλογή</div>\n" +
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
