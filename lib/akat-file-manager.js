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
      $timeout(function () {

        $scope.pageOffset = attr.pageoffset;
        $scope.tabactive.mediaActive = true;
      });

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

        //element.disabled = true;
        $q.all(slice.call(element.files, 0).map(readFile)).then(function (values) {
          $scope.tabactive.mediaActive = true;
          values.forEach(function (fileblob, key) {
            uploadFile(fileblob, element.files[key]);
          });
        });

        function uploadFile(file, uploadoptions) {
          uploadoptions.path = attr.fpath;
          uploadoptions.file = uploadoptions;

          $scope.mediaActive = true;

          var newfile = {
            filename: uploadoptions.name,
            progress: 10,
            label: '',
            alt: '',
            description: '',
            low_resolution: {},
            thumbnail: {
              url: 'http://icons.iconarchive.com/icons/tristan-edwards/sevenesque/1024/Preview-icon.png',
              width: '150',
              height: '150'
            },
            standar_resolution: {},
            date: new Date()
          };

          $scope.files.unshift(newfile);

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
    "                                            <uib-progressbar class=\"progress\" ng-if=\"file.progress\" value=\"55\"></uib-progressbar>\n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-lg-3 col-md-3 col-sm-12 col-xs-12 bg-grey info\" resize offset=\"87\">\n" +
    "                                <div class=\"head row\">\n" +
    "                                   <h3>ΣΤΟΙΧΕΙΑ ΣΥΝΗΜΜΕΝΟΥ</h3>\n" +
    "                                </div>\n" +
    "                                <div class=\"row infos\">\n" +
    "                                    <div class=\"thumbnail\">\n" +
    "                                        <img ng-src=\"{{selected_photo.low_resolution.url}}\">\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"desc row\">\n" +
    "                                    <!--<p class=\"name\">{{selected_photo.alt}}</p>-->\n" +
    "                                    <p>2 Αυγ 2016 1 MB 740 × 644</p>\n" +
    "                                    <p class=\"delete\"><a href=\"#\">Διαγραφή οριστικά</a></p>\n" +
    "                                </div>\n" +
    "    \n" +
    "                               \n" +
    "                                <div class=\"forms row clr\">\n" +
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
