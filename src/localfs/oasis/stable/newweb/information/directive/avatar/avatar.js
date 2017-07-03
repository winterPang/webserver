"use strict";

define(["angularAMD", "require", 'jquery', 'utils'], function (app, require, jquery, Utils) {
    var depend = ['./libs/cropper', 'css!./css/avatar.css', 'css!./css/cropper.min.css'];
    var sLang = Utils.getLang();

    var tpl = sprintf('../information/directive/avatar/avatar.html', sLang);

    var upload = '/v3/ace/oasis/oasis-rest-map/restapp/uploadfile/imageUpload';

    function CropAvatar($element, opt) {
        this.opt = opt;
        this.$container = $element;
        this.$avatarView = this.$container.find('.avatar-view');
        this.$avatar = this.$avatarView.find('img');
        this.$avatarModal = this.$container.find('#avatar-modal');
        this.$avatarForm = this.$avatarModal.find('.avatar-form');
        // the path from the server end
        this.$avatarSrc = this.$avatarForm.find('.avatar-src');
        // the file input
        this.$avatarInput = this.$avatarForm.find('.avatar-input');
        // skill buttons
        this.$avatarBtns = this.$avatarForm.find('.avatar-btns');

        this.$avatarWrapper = this.$avatarModal.find('.avatar-wrapper');
        this.$avatarPreview = this.$avatarModal.find('.avatar-preview');

        this.init();
    }

    CropAvatar.prototype = {
        constructor: CropAvatar,
        // browser file support
        support: {
            fileList: !!$('<input type="file">').prop('files'),
            blobURLs: !!window.URL && URL.createObjectURL,
            formData: !!window.FormData
        },
        init: function init() {
            this.support.datauri = this.support.fileList && this.support.blobURLs;
            this.addListener();
        },
        // add listen
        addListener: function addListener() {
            this.$avatarInput.on('change', $.proxy(this.change, this));
            this.$avatarForm.on('submit', $.proxy(this.submit, this));
            this.$avatarBtns.on('click', $.proxy(this.rotate, this));
        },
        change: function change() {
            var files;
            var file;
            // support datauri
            if (this.support.datauri) {
                files = this.$avatarInput.prop('files');
                if (files.length > 0) {
                    file = files[0];
                    if (this.isImageFile(file)) {
                        if (this.url) {
                            URL.revokeObjectURL(this.url); // Revoke the old one
                        }
                        // create an Obj URL and
                        this.url = URL.createObjectURL(file);
                        this.startCropper();
                    }
                }
            } else {
                console.warn("the browser didn't support this skill");
            }
        },
        submit: function submit(event) {
            // prevent default
            event.preventDefault();
            // didn't select a img
            if (!this.$avatarInput.val()) {
                return false;
            }
            // ajaxUpload img
            if (this.support.formData) {
                this.ajaxUpload();
                return false;
            }
        },
        rotate: function rotate(e) {
            var data;
            // cropping
            if (this.active) {
                data = $(e.target).data();
                if (data.method) {
                    // rotate - reset
                    this.$img.cropper(data.method, data.option);
                }
            }
        },
        isImageFile: function isImageFile(file) {
            if (file.type) {
                return (/^image\/\w+$/.test(file.type)
                );
            } else {
                return (/\.(jpg|jpeg|png|gif)$/.test(file)
                );
            }
        },
        startCropper: function startCropper() {
            // if is cropping,replace the url
            if (this.active) {
                this.$img.cropper('replace', this.url);
            } else {
                //
                this.$img = $('<img src="' + this.url + '">');
                this.$avatarWrapper.empty().html(this.$img);
                this.$img.cropper({
                    aspectRatio: 1,
                    preview: this.$avatarPreview.selector
                });
                this.active = true;
            }
        },
        stopCropper: function stopCropper() {
            if (this.active) {
                this.$img.cropper('destroy');
                this.$img.remove();
                this.active = false;
            }
        },
        ajaxUpload: function ajaxUpload() {
            var _this = this;
            // get the action on the form
            var url = this.$avatarForm.attr('action');
            this.$img.cropper('getCroppedCanvas').toBlob(function (blob) {
                // create ObjURL
                _this.url = URL.createObjectURL(blob);
                var formData = new FormData(),
                    type = /jpg|jpeg|png|gif$/.exec(blob.type)[0];
                formData.append('cropped', blob, 'cropped.' + type);
                $.ajax(url, {
                    type: 'post',
                    data: formData,
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    success: function success(data) {
                        _this.submitDone(data);
                    },
                    error: function error(XMLHttpRequest, textStatus, errorThrown) {
                        _this.submitFail(textStatus || errorThrown);
                    }
                });
            });
        },
        submitDone: function submitDone(data) {
            if ($.isPlainObject(data) && data.code === 0) {
                this.support.datauri && this.cropDone();
                this.$avatarSrc.val(data.path);
                this.$avatarInput.val('');
                // callback
                this.opt.success && this.opt.success.call(this, data);
            } else {
                // error
                this.opt.error && this.opt.error(data);
            }
        },
        submitFail: function submitFail(msg) {
            this.opt.error && this.opt.error(data);
        },
        cropDone: function cropDone() {
            this.$avatarForm.get(0).reset();
            // let the avatar view show cropped img
            this.$avatar.attr('src', this.url);
            this.stopCropper();
        }
    };

    require(depend, function () {
        var avatorDirective = function avatorDirective($alert) {
            return {
                restrict: "EA",
                scope: {
                    avatar: '=',
                    upload: '='
                },
                templateUrl: tpl,
                controller: function controller($scope) {
                    $scope.modal = {
                        mId: 'avatar',
                        title: '头像上传',
                        autoClose: false,
                        showCancel: true,
                        modalSize: 'lg',
                        showHeader: true,
                        showFooter: false,
                        showClose: true
                    };
                    $scope.showModal = function () {
                        $scope.$broadcast('show#avatar', function () {
                            console.log('show avatar');
                        });
                    };
                    $scope.$on('hidden.bs.modal#avatar', function () {
                        console.log('hide avatar', arguments);
                    });
                },
                link: function link(scope, ele, attr) {

                    /*
                    *   opt must be an object
                    *   opt.
                    * */

                    var infos = {
                        updataSuc: '上传成功'
                    };

                    var opt = {
                        success: function success(data) {
                            scope.upload = data.path;
                            scope.$broadcast('hide#avatar');
                            $alert.msgDialogSuccess(infos.updataSuc);
                        },
                        error: function error(data) {}
                    };

                    new CropAvatar(ele, opt);
                }
            };
        };

        app.directive('userAvatar', ['$alertService', avatorDirective]);
    });
});
