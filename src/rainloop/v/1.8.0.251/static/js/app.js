/* RainLoop Webmail (c) RainLoop Team | Licensed under CC BY-NC-SA 3.0 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "rainloop/v/0.0.0/static/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!********************!*\
  !*** ./dev/app.js ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! bootstrap */ 69)(__webpack_require__(/*! App/User */ 6));

/***/ },
/* 1 */
/*!*****************************!*\
  !*** ./dev/Common/Utils.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			oEncryptObject = null,

			Utils = {},

			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			ko = __webpack_require__(/*! ko */ 3),
			Autolinker = __webpack_require__(/*! Autolinker */ 71),
			JSEncrypt = __webpack_require__(/*! JSEncrypt */ 72),

			Mime = __webpack_require__(/*! Common/Mime */ 48),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Globals = __webpack_require__(/*! Common/Globals */ 8)
		;

		Utils.trim = $.trim;
		Utils.inArray = $.inArray;
		Utils.isArray = _.isArray;
		Utils.isFunc = _.isFunction;
		Utils.isUnd = _.isUndefined;
		Utils.isNull = _.isNull;
		Utils.emptyFunction = function () {};

		/**
		 * @param {*} oValue
		 * @return {boolean}
		 */
		Utils.isNormal = function (oValue)
		{
			return !Utils.isUnd(oValue) && !Utils.isNull(oValue);
		};

		Utils.windowResize = _.debounce(function (iTimeout) {
			if (Utils.isUnd(iTimeout))
			{
				Globals.$win.resize();
			}
			else
			{
				window.setTimeout(function () {
					Globals.$win.resize();
				}, iTimeout);
			}
		}, 50);

		Utils.windowResizeCallback = function () {
			Utils.windowResize();
		};

		/**
		 * @param {(string|number)} mValue
		 * @param {boolean=} bIncludeZero
		 * @return {boolean}
		 */
		Utils.isPosNumeric = function (mValue, bIncludeZero)
		{
			return Utils.isNormal(mValue) ?
				((Utils.isUnd(bIncludeZero) ? true : !!bIncludeZero) ?
					(/^[0-9]*$/).test(mValue.toString()) :
					(/^[1-9]+[0-9]*$/).test(mValue.toString())) :
				false;
		};

		/**
		 * @param {*} iValue
		 * @param {number=} iDefault = 0
		 * @return {number}
		 */
		Utils.pInt = function (iValue, iDefault)
		{
			var iResult = Utils.isNormal(iValue) && '' !== iValue ? window.parseInt(iValue, 10) : (iDefault || 0);
			return window.isNaN(iResult) ? (iDefault || 0) : iResult;
		};

		/**
		 * @param {*} mValue
		 * @return {string}
		 */
		Utils.pString = function (mValue)
		{
			return Utils.isNormal(mValue) ? '' + mValue : '';
		};

		/**
		 * @param {string} sComponent
		 * @return {string}
		 */
		Utils.encodeURIComponent = function (sComponent)
		{
			return window.encodeURIComponent(sComponent);
		};

		/**
		 * @param {*} aValue
		 * @return {boolean}
		 */
		Utils.isNonEmptyArray = function (aValue)
		{
			return Utils.isArray(aValue) && 0 < aValue.length;
		};

		/**
		 * @param {string} sQueryString
		 * @return {Object}
		 */
		Utils.simpleQueryParser = function (sQueryString)
		{
			var
				oParams = {},
				aQueries = [],
				aTemp = [],
				iIndex = 0,
				iLen = 0
			;

			aQueries = sQueryString.split('&');
			for (iIndex = 0, iLen = aQueries.length; iIndex < iLen; iIndex++)
			{
				aTemp = aQueries[iIndex].split('=');
				oParams[window.decodeURIComponent(aTemp[0])] = window.decodeURIComponent(aTemp[1]);
			}

			return oParams;
		};

		/**
		 * @param {string} sMailToUrl
		 * @param {Function} PopupComposeVoreModel
		 * @returns {boolean}
		 */
		Utils.mailToHelper = function (sMailToUrl, PopupComposeVoreModel)
		{
			if (sMailToUrl && 'mailto:' === sMailToUrl.toString().substr(0, 7).toLowerCase())
			{
				sMailToUrl = sMailToUrl.toString().substr(7);

				var
					oParams = {},
					oToEmailModel = null,
					oCcEmailModel = null,
					oBccEmailModel = null,
					sEmail = sMailToUrl.replace(/\?.+$/, ''),
					sQueryString = sMailToUrl.replace(/^[^\?]*\?/, ''),
					EmailModel = __webpack_require__(/*! Model/Email */ 25)
				;

				oToEmailModel = new EmailModel();
				oToEmailModel.parse(window.decodeURIComponent(sEmail));

				oParams = Utils.simpleQueryParser(sQueryString);

				if (!Utils.isUnd(oParams.cc))
				{
					oCcEmailModel = new EmailModel();
					oCcEmailModel.parse(window.decodeURIComponent(oParams.cc));
				}

				if (!Utils.isUnd(oParams.bcc))
				{
					oBccEmailModel = new EmailModel();
					oBccEmailModel.parse(window.decodeURIComponent(oParams.bcc));
				}

				__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(PopupComposeVoreModel, [Enums.ComposeType.Empty, null,
					oToEmailModel && oToEmailModel.email ? [oToEmailModel] : null,
					oCcEmailModel && oCcEmailModel.email ? [oCcEmailModel] : null,
					oBccEmailModel && oBccEmailModel.email ? [oBccEmailModel] : null,
					Utils.isUnd(oParams.subject) ? null : Utils.pString(oParams.subject),
					Utils.isUnd(oParams.body) ? null : Utils.plainToHtml(Utils.pString(oParams.body))
				]);

				return true;
			}

			return false;
		};

		/**
		 * @param {string} sPublicKey
		 * @return {JSEncrypt}
		 */
		Utils.rsaObject = function (sPublicKey)
		{
			if (JSEncrypt && sPublicKey && (null === oEncryptObject || (oEncryptObject && oEncryptObject.__sPublicKey !== sPublicKey)) &&
				window.crypto && window.crypto.getRandomValues)
			{
				oEncryptObject = new JSEncrypt();
				oEncryptObject.setPublicKey(sPublicKey);
				oEncryptObject.__sPublicKey = sPublicKey;
			}
			else
			{
				oEncryptObject = false;
			}

			return oEncryptObject;
		};

		/**
		 * @param {string} sValue
		 * @param {string} sPublicKey
		 * @return {string}
		 */
		Utils.rsaEncode = function (sValue, sPublicKey)
		{
			if (window.crypto && window.crypto.getRandomValues && sPublicKey)
			{
				var
					sResultValue = false,
					oEncrypt = Utils.rsaObject(sPublicKey)
				;

				if (oEncrypt)
				{
					sResultValue = oEncrypt.encrypt(Utils.fakeMd5() + ':' + sValue + ':' + Utils.fakeMd5());
					if (false !== sResultValue && Utils.isNormal(sResultValue))
					{
						return 'rsa:xxx:' + sResultValue;
					}
				}
			}

			return sValue;
		};

		Utils.rsaEncode.supported = !!(window.crypto && window.crypto.getRandomValues && false && JSEncrypt);

		/**
		 * @param {string} sText
		 * @return {string}
		 */
		Utils.encodeHtml = function (sText)
		{
			return Utils.isNormal(sText) ? sText.toString()
				.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;').replace(/'/g, '&#039;') : '';
		};

		/**
		 * @param {string} sText
		 * @param {number=} iLen
		 * @return {string}
		 */
		Utils.splitPlainText = function (sText, iLen)
		{
			var
				sPrefix = '',
				sSubText = '',
				sResult = sText,
				iSpacePos = 0,
				iNewLinePos = 0
			;

			iLen = Utils.isUnd(iLen) ? 100 : iLen;

			while (sResult.length > iLen)
			{
				sSubText = sResult.substring(0, iLen);
				iSpacePos = sSubText.lastIndexOf(' ');
				iNewLinePos = sSubText.lastIndexOf('\n');

				if (-1 !== iNewLinePos)
				{
					iSpacePos = iNewLinePos;
				}

				if (-1 === iSpacePos)
				{
					iSpacePos = iLen;
				}

				sPrefix += sSubText.substring(0, iSpacePos) + '\n';
				sResult = sResult.substring(iSpacePos + 1);
			}

			return sPrefix + sResult;
		};

		Utils.timeOutAction = (function () {

			var
				oTimeOuts = {}
			;

			return function (sAction, fFunction, iTimeOut)
			{
				if (Utils.isUnd(oTimeOuts[sAction]))
				{
					oTimeOuts[sAction] = 0;
				}

				window.clearTimeout(oTimeOuts[sAction]);
				oTimeOuts[sAction] = window.setTimeout(fFunction, iTimeOut);
			};
		}());

		Utils.timeOutActionSecond = (function () {

			var
				oTimeOuts = {}
			;

			return function (sAction, fFunction, iTimeOut)
			{
				if (!oTimeOuts[sAction])
				{
					oTimeOuts[sAction] = window.setTimeout(function () {
						fFunction();
						oTimeOuts[sAction] = 0;
					}, iTimeOut);
				}
			};
		}());

		Utils.audio = (function () {

			var
				oAudio = false
			;

			return function (sMp3File, sOggFile) {

				if (false === oAudio)
				{
					if (Globals.bIsiOSDevice)
					{
						oAudio = null;
					}
					else
					{
						var
							bCanPlayMp3	= false,
							bCanPlayOgg	= false,
							oAudioLocal = window.Audio ? new window.Audio() : null
						;

						if (oAudioLocal && oAudioLocal.canPlayType && oAudioLocal.play)
						{
							bCanPlayMp3 = '' !== oAudioLocal.canPlayType('audio/mpeg; codecs="mp3"');
							if (!bCanPlayMp3)
							{
								bCanPlayOgg = '' !== oAudioLocal.canPlayType('audio/ogg; codecs="vorbis"');
							}

							if (bCanPlayMp3 || bCanPlayOgg)
							{
								oAudio = oAudioLocal;
								oAudio.preload = 'none';
								oAudio.loop = false;
								oAudio.autoplay = false;
								oAudio.muted = false;
								oAudio.src = bCanPlayMp3 ? sMp3File : sOggFile;
							}
							else
							{
								oAudio = null;
							}
						}
						else
						{
							oAudio = null;
						}
					}
				}

				return oAudio;
			};
		}());

		/**
		 * @param {(Object|null|undefined)} oObject
		 * @param {string} sProp
		 * @return {boolean}
		 */
		Utils.hos = function (oObject, sProp)
		{
			return oObject && window.Object && window.Object.hasOwnProperty ? window.Object.hasOwnProperty.call(oObject, sProp) : false;
		};

		/**
		 * @return {boolean}
		 */
		Utils.inFocus = function ()
		{
			if (window.document.activeElement)
			{
				if (Utils.isUnd(window.document.activeElement.__inFocusCache))
				{
					window.document.activeElement.__inFocusCache = $(window.document.activeElement).is('input,textarea,iframe,.cke_editable');
				}

				return !!window.document.activeElement.__inFocusCache;
			}

			return false;
		};

		Utils.removeInFocus = function ()
		{
			if (window.document && window.document.activeElement && window.document.activeElement.blur)
			{
				var oA = $(window.document.activeElement);
				if (oA.is('input,textarea'))
				{
					window.document.activeElement.blur();
				}
			}
		};

		Utils.removeSelection = function ()
		{
			if (window && window.getSelection)
			{
				var oSel = window.getSelection();
				if (oSel && oSel.removeAllRanges)
				{
					oSel.removeAllRanges();
				}
			}
			else if (window.document && window.document.selection && window.document.selection.empty)
			{
				window.document.selection.empty();
			}
		};

		/**
		 * @param {string} sPrefix
		 * @param {string} sSubject
		 * @return {string}
		 */
		Utils.replySubjectAdd = function (sPrefix, sSubject)
		{
			sPrefix = Utils.trim(sPrefix.toUpperCase());
			sSubject = Utils.trim(sSubject.replace(/[\s]+/g, ' '));

			var
				bDrop = false,
				aSubject = [],
				bRe = 'RE' === sPrefix,
				bFwd = 'FWD' === sPrefix,
				bPrefixIsRe = !bFwd
			;

			if ('' !== sSubject)
			{
				_.each(sSubject.split(':'), function (sPart) {
					var sTrimmedPart = Utils.trim(sPart);
					if (!bDrop && (/^(RE|FWD)$/i.test(sTrimmedPart) || /^(RE|FWD)[\[\(][\d]+[\]\)]$/i.test(sTrimmedPart)))
					{
						if (!bRe)
						{
							bRe = !!(/^RE/i.test(sTrimmedPart));
						}

						if (!bFwd)
						{
							bFwd = !!(/^FWD/i.test(sTrimmedPart));
						}
					}
					else
					{
						aSubject.push(sPart);
						bDrop = true;
					}
				});
			}

			if (bPrefixIsRe)
			{
				bRe = false;
			}
			else
			{
				bFwd = false;
			}

			return Utils.trim(
				(bPrefixIsRe ? 'Re: ' : 'Fwd: ') +
				(bRe ? 'Re: ' : '') +
				(bFwd ? 'Fwd: ' : '') +
				Utils.trim(aSubject.join(':'))
			);
		};

		/**
		 * @param {number} iNum
		 * @param {number} iDec
		 * @return {number}
		 */
		Utils.roundNumber = function (iNum, iDec)
		{
			return window.Math.round(iNum * window.Math.pow(10, iDec)) / window.Math.pow(10, iDec);
		};

		/**
		 * @param {(number|string)} iSizeInBytes
		 * @return {string}
		 */
		Utils.friendlySize = function (iSizeInBytes)
		{
			iSizeInBytes = Utils.pInt(iSizeInBytes);

			if (iSizeInBytes >= 1073741824)
			{
				return Utils.roundNumber(iSizeInBytes / 1073741824, 1) + 'GB';
			}
			else if (iSizeInBytes >= 1048576)
			{
				return Utils.roundNumber(iSizeInBytes / 1048576, 1) + 'MB';
			}
			else if (iSizeInBytes >= 1024)
			{
				return Utils.roundNumber(iSizeInBytes / 1024, 0) + 'KB';
			}

			return iSizeInBytes + 'B';
		};

		/**
		 * @param {string} sDesc
		 */
		Utils.log = function (sDesc)
		{
			if (window.console && window.console.log)
			{
				window.console.log(sDesc);
			}
		};

		/**
		 * @param {?} oObject
		 * @param {string} sMethodName
		 * @param {Array=} aParameters
		 * @param {number=} nDelay
		 */
		Utils.delegateRun = function (oObject, sMethodName, aParameters, nDelay)
		{
			if (oObject && oObject[sMethodName])
			{
				nDelay = Utils.pInt(nDelay);
				if (0 >= nDelay)
				{
					oObject[sMethodName].apply(oObject, Utils.isArray(aParameters) ? aParameters : []);
				}
				else
				{
					_.delay(function () {
						oObject[sMethodName].apply(oObject, Utils.isArray(aParameters) ? aParameters : []);
					}, nDelay);
				}
			}
		};

		/**
		 * @param {?} oEvent
		 */
		Utils.killCtrlAandS = function (oEvent)
		{
			oEvent = oEvent || window.event;
			if (oEvent && oEvent.ctrlKey && !oEvent.shiftKey && !oEvent.altKey)
			{
				var
					oSender = oEvent.target || oEvent.srcElement,
					iKey = oEvent.keyCode || oEvent.which
				;

				if (iKey === Enums.EventKeyCode.S)
				{
					oEvent.preventDefault();
					return;
				}

				if (oSender && oSender.tagName && oSender.tagName.match(/INPUT|TEXTAREA/i))
				{
					return;
				}

				if (iKey === Enums.EventKeyCode.A)
				{
					if (window.getSelection)
					{
						window.getSelection().removeAllRanges();
					}
					else if (window.document.selection && window.document.selection.clear)
					{
						window.document.selection.clear();
					}

					oEvent.preventDefault();
				}
			}
		};

		/**
		 * @param {(Object|null|undefined)} oContext
		 * @param {Function} fExecute
		 * @param {(Function|boolean|null)=} fCanExecute
		 * @return {Function}
		 */
		Utils.createCommand = function (oContext, fExecute, fCanExecute)
		{
			var
				fNonEmpty = function () {
					if (fResult && fResult.canExecute && fResult.canExecute())
					{
						fExecute.apply(oContext, Array.prototype.slice.call(arguments));
					}
					return false;
				},
				fResult = fExecute ? fNonEmpty : Utils.emptyFunction
			;

			fResult.enabled = ko.observable(true);

			fCanExecute = Utils.isUnd(fCanExecute) ? true : fCanExecute;
			if (Utils.isFunc(fCanExecute))
			{
				fResult.canExecute = ko.computed(function () {
					return fResult.enabled() && fCanExecute.call(oContext);
				});
			}
			else
			{
				fResult.canExecute = ko.computed(function () {
					return fResult.enabled() && !!fCanExecute;
				});
			}

			return fResult;
		};

		/**
		 * @param {{moment:Function}} oObject
		 */
		Utils.createMomentDate = function (oObject)
		{
			if (Utils.isUnd(oObject.moment))
			{
				oObject.moment = ko.observable(moment());
			}

			return ko.computed(function () {
				Globals.momentTrigger();
				var oMoment = this.moment();
				return 1970 === oMoment.year() ? '' : oMoment.fromNow();
			}, oObject);
		};

		/**
		 * @param {{moment:Function, momentDate:Function}} oObject
		 */
		Utils.createMomentShortDate = function (oObject)
		{
			return ko.computed(function () {

				var
					sResult = '',
					oMomentNow = moment(),
					oMoment = this.moment(),
					sMomentDate = this.momentDate()
				;

				if (1970 === oMoment.year())
				{
					sResult = '';
				}
				else if (4 >= oMomentNow.diff(oMoment, 'hours'))
				{
					sResult = sMomentDate;
				}
				else if (oMomentNow.format('L') === oMoment.format('L'))
				{
					sResult = __webpack_require__(/*! Common/Translator */ 7).i18n('MESSAGE_LIST/TODAY_AT', {
						'TIME': oMoment.format('LT')
					});
				}
				else if (oMomentNow.clone().subtract('days', 1).format('L') === oMoment.format('L'))
				{
					sResult = __webpack_require__(/*! Common/Translator */ 7).i18n('MESSAGE_LIST/YESTERDAY_AT', {
						'TIME': oMoment.format('LT')
					});
				}
				else if (oMomentNow.year() === oMoment.year())
				{
					sResult = oMoment.format('D MMM.');
				}
				else
				{
					sResult = oMoment.format('LL');
				}

				return sResult;

			}, oObject);
		};

		/**
		 * @param {string} sTheme
		 * @return {string}
		 */
		Utils.convertThemeName = function (sTheme)
		{
			if ('@custom' === sTheme.substr(-7))
			{
				sTheme = Utils.trim(sTheme.substring(0, sTheme.length - 7));
			}

			return Utils.trim(sTheme.replace(/[^a-zA-Z0-9]+/g, ' ').replace(/([A-Z])/g, ' $1').replace(/[\s]+/g, ' '));
		};

		/**
		 * @param {string} sName
		 * @return {string}
		 */
		Utils.quoteName = function (sName)
		{
			return sName.replace(/["]/g, '\\"');
		};

		/**
		 * @return {number}
		 */
		Utils.microtime = function ()
		{
			return (new Date()).getTime();
		};

		/**
		 * @return {number}
		 */
		Utils.timestamp = function ()
		{
			return window.Math.round(Utils.microtime() / 1000);
		};

		/**
		 *
		 * @param {string} sLanguage
		 * @param {boolean=} bEng = false
		 * @return {string}
		 */
		Utils.convertLangName = function (sLanguage, bEng)
		{
			return __webpack_require__(/*! Common/Translator */ 7).i18n('LANGS_NAMES' + (true === bEng ? '_EN' : '') + '/LANG_' +
				sLanguage.toUpperCase().replace(/[^a-zA-Z0-9]+/g, '_'), null, sLanguage);
		};

		/**
		 * @param {number=} iLen
		 * @return {string}
		 */
		Utils.fakeMd5 = function(iLen)
		{
			var
				sResult = '',
				sLine = '0123456789abcdefghijklmnopqrstuvwxyz'
			;

			iLen = Utils.isUnd(iLen) ? 32 : Utils.pInt(iLen);

			while (sResult.length < iLen)
			{
				sResult += sLine.substr(window.Math.round(window.Math.random() * sLine.length), 1);
			}

			return sResult;
		};

		Utils.draggablePlace = function ()
		{
			return $('<div class="draggablePlace">' +
				'<span class="text"></span>&nbsp;' +
				'<i class="icon-copy icon-white visible-on-ctrl"></i><i class="icon-mail icon-white hidden-on-ctrl"></i></div>').appendTo('#rl-hidden');
		};

		Utils.defautOptionsAfterRender = function (oDomOption, oItem)
		{
			if (oItem && !Utils.isUnd(oItem.disabled) && oDomOption)
			{
				$(oDomOption)
					.toggleClass('disabled', oItem.disabled)
					.prop('disabled', oItem.disabled)
				;
			}
		};

		/**
		 * @param {Object} oViewModel
		 * @param {string} sTemplateID
		 * @param {string} sTitle
		 * @param {Function=} fCallback
		 */
		Utils.windowPopupKnockout = function (oViewModel, sTemplateID, sTitle, fCallback)
		{
			var
				oScript = null,
				oWin = window.open(''),
				sFunc = '__OpenerApplyBindingsUid' + Utils.fakeMd5() + '__',
				oTemplate = $('#' + sTemplateID)
			;

			window[sFunc] = function () {

				if (oWin && oWin.document.body && oTemplate && oTemplate[0])
				{
					var oBody = $(oWin.document.body);

					$('#rl-content', oBody).html(oTemplate.html());
					$('html', oWin.document).addClass('external ' + $('html').attr('class'));

					__webpack_require__(/*! Common/Translator */ 7).i18nToNode(oBody);

					if (oViewModel && $('#rl-content', oBody)[0])
					{
						ko.applyBindings(oViewModel, $('#rl-content', oBody)[0]);
					}

					window[sFunc] = null;

					fCallback(oWin);
				}
			};

			oWin.document.open();
			oWin.document.write('<html><head>' +
	'<meta charset="utf-8" />' +
	'<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />' +
	'<meta name="viewport" content="user-scalable=no" />' +
	'<meta name="apple-mobile-web-app-capable" content="yes" />' +
	'<meta name="robots" content="noindex, nofollow, noodp" />' +
	'<title>' + Utils.encodeHtml(sTitle) + '</title>' +
	'</head><body><div id="rl-content"></div></body></html>');
			oWin.document.close();

			oScript = oWin.document.createElement('script');
			oScript.type = 'text/javascript';
			oScript.innerHTML = 'if(window&&window.opener&&window.opener[\'' + sFunc + '\']){window.opener[\'' + sFunc + '\']();window.opener[\'' + sFunc + '\']=null}';
			oWin.document.getElementsByTagName('head')[0].appendChild(oScript);
		};

		/**
		 * @param {Function} fCallback
		 * @param {?} koTrigger
		 * @param {?} oContext = null
		 * @param {number=} iTimer = 1000
		 * @return {Function}
		 */
		Utils.settingsSaveHelperFunction = function (fCallback, koTrigger, oContext, iTimer)
		{
			oContext = oContext || null;
			iTimer = Utils.isUnd(iTimer) ? 1000 : Utils.pInt(iTimer);

			return function (sType, mData, bCached, sRequestAction, oRequestParameters) {
				koTrigger.call(oContext, mData && mData['Result'] ? Enums.SaveSettingsStep.TrueResult : Enums.SaveSettingsStep.FalseResult);
				if (fCallback)
				{
					fCallback.call(oContext, sType, mData, bCached, sRequestAction, oRequestParameters);
				}
				_.delay(function () {
					koTrigger.call(oContext, Enums.SaveSettingsStep.Idle);
				}, iTimer);
			};
		};

		Utils.settingsSaveHelperSimpleFunction = function (koTrigger, oContext)
		{
			return Utils.settingsSaveHelperFunction(null, koTrigger, oContext, 1000);
		};

		Utils.settingsSaveHelperSubscribeFunction = function (oRemote, sSettingName, sType, fTriggerFunction)
		{
			return function (mValue) {

				if (oRemote)
				{
					switch (sType)
					{
						default:
							mValue = Utils.pString(mValue);
							break;
						case 'bool':
						case 'boolean':
							mValue = mValue ? '1' : '0';
							break;
						case 'int':
						case 'integer':
						case 'number':
							mValue = Utils.pInt(mValue);
							break;
						case 'trim':
							mValue = Utils.trim(mValue);
							break;
					}

					var oData = {};
					oData[sSettingName] = mValue;

					if (oRemote.saveAdminConfig)
					{
						oRemote.saveAdminConfig(fTriggerFunction || null, oData);
					}
					else if (oRemote.saveSettings)
					{
						oRemote.saveSettings(fTriggerFunction || null, oData);
					}
				}
			};
		};

		/**
		 * @param {string} sHtml
		 * @return {string}
		 */
		Utils.htmlToPlain = function (sHtml)
		{
			var
				iPos = 0,
				iP1 = 0,
				iP2 = 0,
				iP3 = 0,
				iLimit = 0,

				sText = '',

				splitPlainText = function (sText)
				{
					var
						iLen = 100,
						sPrefix = '',
						sSubText = '',
						sResult = sText,
						iSpacePos = 0,
						iNewLinePos = 0
					;

					while (sResult.length > iLen)
					{
						sSubText = sResult.substring(0, iLen);
						iSpacePos = sSubText.lastIndexOf(' ');
						iNewLinePos = sSubText.lastIndexOf('\n');

						if (-1 !== iNewLinePos)
						{
							iSpacePos = iNewLinePos;
						}

						if (-1 === iSpacePos)
						{
							iSpacePos = iLen;
						}

						sPrefix += sSubText.substring(0, iSpacePos) + '\n';
						sResult = sResult.substring(iSpacePos + 1);
					}

					return sPrefix + sResult;
				},

				convertBlockquote = function (sText) {
					sText = splitPlainText($.trim(sText));
					sText = '> ' + sText.replace(/\n/gm, '\n> ');
					return sText.replace(/(^|\n)([> ]+)/gm, function () {
						return (arguments && 2 < arguments.length) ? arguments[1] + $.trim(arguments[2].replace(/[\s]/g, '')) + ' ' : '';
					});
				},

				convertDivs = function () {
					if (arguments && 1 < arguments.length)
					{
						var sText = $.trim(arguments[1]);
						if (0 < sText.length)
						{
							sText = sText.replace(/<div[^>]*>([\s\S\r\n]*)<\/div>/gmi, convertDivs);
							sText = '\n' + $.trim(sText) + '\n';
						}

						return sText;
					}

					return '';
				},

				convertPre = function () {
					return (arguments && 1 < arguments.length) ? arguments[1].toString().replace(/[\n]/gm, '<br />') : '';
				},

				fixAttibuteValue = function () {
					return (arguments && 1 < arguments.length) ?
						'' + arguments[1] + arguments[2].replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
				},

				convertLinks = function () {
					return (arguments && 1 < arguments.length) ? $.trim(arguments[1]) : '';
				}
			;

			sText = sHtml
				.replace(/<pre[^>]*>([\s\S\r\n]*)<\/pre>/gmi, convertPre)
				.replace(/[\s]+/gm, ' ')
				.replace(/((?:href|data)\s?=\s?)("[^"]+?"|'[^']+?')/gmi, fixAttibuteValue)
				.replace(/<br[^>]*>/gmi, '\n')
				.replace(/<\/h[\d]>/gi, '\n')
				.replace(/<\/p>/gi, '\n\n')
				.replace(/<\/li>/gi, '\n')
				.replace(/<\/td>/gi, '\n')
				.replace(/<\/tr>/gi, '\n')
				.replace(/<hr[^>]*>/gmi, '\n_______________________________\n\n')
				.replace(/<div[^>]*>([\s\S\r\n]*)<\/div>/gmi, convertDivs)
				.replace(/<blockquote[^>]*>/gmi, '\n__bq__start__\n')
				.replace(/<\/blockquote>/gmi, '\n__bq__end__\n')
				.replace(/<a [^>]*>([\s\S\r\n]*?)<\/a>/gmi, convertLinks)
				.replace(/<\/div>/gi, '\n')
				.replace(/&nbsp;/gi, ' ')
				.replace(/&quot;/gi, '"')
				.replace(/<[^>]*>/gm, '')
			;

			sText = Globals.$div.html(sText).text();

			sText = sText
				.replace(/\n[ \t]+/gm, '\n')
				.replace(/[\n]{3,}/gm, '\n\n')
				.replace(/&gt;/gi, '>')
				.replace(/&lt;/gi, '<')
				.replace(/&amp;/gi, '&')
			;

			iPos = 0;
			iLimit = 100;

			while (0 < iLimit)
			{
				iLimit--;
				iP1 = sText.indexOf('__bq__start__', iPos);
				if (-1 < iP1)
				{
					iP2 = sText.indexOf('__bq__start__', iP1 + 5);
					iP3 = sText.indexOf('__bq__end__', iP1 + 5);

					if ((-1 === iP2 || iP3 < iP2) && iP1 < iP3)
					{
						sText = sText.substring(0, iP1) +
							convertBlockquote(sText.substring(iP1 + 13, iP3)) +
							sText.substring(iP3 + 11);

						iPos = 0;
					}
					else if (-1 < iP2 && iP2 < iP3)
					{
						iPos = iP2 - 1;
					}
					else
					{
						iPos = 0;
					}
				}
				else
				{
					break;
				}
			}

			sText = sText
				.replace(/__bq__start__/gm, '')
				.replace(/__bq__end__/gm, '')
			;

			return sText;
		};

		/**
		 * @param {string} sPlain
		 * @param {boolean} bFindEmailAndLinks = false
		 * @return {string}
		 */
		Utils.plainToHtml = function (sPlain, bFindEmailAndLinks)
		{
			sPlain = sPlain.toString().replace(/\r/g, '');

			bFindEmailAndLinks = Utils.isUnd(bFindEmailAndLinks) ? false : !!bFindEmailAndLinks;

			var
				bIn = false,
				bDo = true,
				bStart = true,
				aNextText = [],
				sLine = '',
				iIndex = 0,
				aText = sPlain.split("\n")
			;

			do
			{
				bDo = false;
				aNextText = [];
				for (iIndex = 0; iIndex < aText.length; iIndex++)
				{
					sLine = aText[iIndex];
					bStart = '>' === sLine.substr(0, 1);
					if (bStart && !bIn)
					{
						bDo = true;
						bIn = true;
						aNextText.push('~~~blockquote~~~');
						aNextText.push(sLine.substr(1));
					}
					else if (!bStart && bIn)
					{
						if ('' !== sLine)
						{
							bIn = false;
							aNextText.push('~~~/blockquote~~~');
							aNextText.push(sLine);
						}
						else
						{
							aNextText.push(sLine);
						}
					}
					else if (bStart && bIn)
					{
						aNextText.push(sLine.substr(1));
					}
					else
					{
						aNextText.push(sLine);
					}
				}

				if (bIn)
				{
					bIn = false;
					aNextText.push('~~~/blockquote~~~');
				}

				aText = aNextText;
			}
			while (bDo);

			sPlain = aText.join("\n");

			sPlain = sPlain
	//			.replace(/~~~\/blockquote~~~\n~~~blockquote~~~/g, '\n')
				.replace(/&/g, '&amp;')
				.replace(/>/g, '&gt;').replace(/</g, '&lt;')
				.replace(/~~~blockquote~~~[\s]*/g, '<blockquote>')
				.replace(/[\s]*~~~\/blockquote~~~/g, '</blockquote>')
				.replace(/\n/g, '<br />')
			;

			return bFindEmailAndLinks ? Utils.findEmailAndLinks(sPlain) : sPlain;
		};

		window.rainloop_Utils_htmlToPlain = Utils.htmlToPlain;
		window.rainloop_Utils_plainToHtml = Utils.plainToHtml;

		/**
		 * @param {string} sHtml
		 * @return {string}
		 */
		Utils.findEmailAndLinks = function (sHtml)
		{
			sHtml = Autolinker.link(sHtml, {
				'newWindow': true,
				'stripPrefix': false,
				'urls': true,
				'email': true,
				'twitter': false,
				'replaceFn': function (autolinker, match) {
					return !(autolinker && match && 'url' === match.getType() && match.matchedText && 0 !== match.matchedText.indexOf('http'));
				}
			});

			return sHtml;
		};

		/**
		 * @param {string} sUrl
		 * @param {number} iValue
		 * @param {Function} fCallback
		 */
		Utils.resizeAndCrop = function (sUrl, iValue, fCallback)
		{
			var oTempImg = new window.Image();
			oTempImg.onload = function() {

				var
					aDiff = [0, 0],
					oCanvas = window.document.createElement('canvas'),
					oCtx = oCanvas.getContext('2d')
				;

				oCanvas.width = iValue;
				oCanvas.height = iValue;

				if (this.width > this.height)
				{
					aDiff = [this.width - this.height, 0];
				}
				else
				{
					aDiff = [0, this.height - this.width];
				}

				oCtx.fillStyle = '#fff';
				oCtx.fillRect(0, 0, iValue, iValue);
				oCtx.drawImage(this, aDiff[0] / 2, aDiff[1] / 2, this.width - aDiff[0], this.height - aDiff[1], 0, 0, iValue, iValue);

				fCallback(oCanvas.toDataURL('image/jpeg'));
			};

			oTempImg.src = sUrl;
		};

		/**
		 * @param {Array} aSystem
		 * @param {Array} aList
		 * @param {Array=} aDisabled
		 * @param {Array=} aHeaderLines
		 * @param {?number=} iUnDeep
		 * @param {Function=} fDisableCallback
		 * @param {Function=} fVisibleCallback
		 * @param {Function=} fRenameCallback
		 * @param {boolean=} bSystem
		 * @param {boolean=} bBuildUnvisible
		 * @return {Array}
		 */
		Utils.folderListOptionsBuilder = function (aSystem, aList, aDisabled, aHeaderLines,
			iUnDeep, fDisableCallback, fVisibleCallback, fRenameCallback, bSystem, bBuildUnvisible)
		{
			var
				/**
				 * @type {?FolderModel}
				 */
				oItem = null,
				bSep = false,
				iIndex = 0,
				iLen = 0,
				sDeepPrefix = '\u00A0\u00A0\u00A0',
				aResult = []
			;

			bBuildUnvisible = Utils.isUnd(bBuildUnvisible) ? false : !!bBuildUnvisible;
			bSystem = !Utils.isNormal(bSystem) ? 0 < aSystem.length : bSystem;
			iUnDeep = !Utils.isNormal(iUnDeep) ? 0 : iUnDeep;
			fDisableCallback = Utils.isNormal(fDisableCallback) ? fDisableCallback : null;
			fVisibleCallback = Utils.isNormal(fVisibleCallback) ? fVisibleCallback : null;
			fRenameCallback = Utils.isNormal(fRenameCallback) ? fRenameCallback : null;

			if (!Utils.isArray(aDisabled))
			{
				aDisabled = [];
			}

			if (!Utils.isArray(aHeaderLines))
			{
				aHeaderLines = [];
			}

			for (iIndex = 0, iLen = aHeaderLines.length; iIndex < iLen; iIndex++)
			{
				aResult.push({
					'id': aHeaderLines[iIndex][0],
					'name': aHeaderLines[iIndex][1],
					'system': false,
					'seporator': false,
					'disabled': false
				});
			}

			bSep = true;
			for (iIndex = 0, iLen = aSystem.length; iIndex < iLen; iIndex++)
			{
				oItem = aSystem[iIndex];
				if (fVisibleCallback ? fVisibleCallback.call(null, oItem) : true)
				{
					if (bSep && 0 < aResult.length)
					{
						aResult.push({
							'id': '---',
							'name': '---',
							'system': false,
							'seporator': true,
							'disabled': true
						});
					}

					bSep = false;
					aResult.push({
						'id': oItem.fullNameRaw,
						'name': fRenameCallback ? fRenameCallback.call(null, oItem) : oItem.name(),
						'system': true,
						'seporator': false,
						'disabled': !oItem.selectable || -1 < Utils.inArray(oItem.fullNameRaw, aDisabled) ||
							(fDisableCallback ? fDisableCallback.call(null, oItem) : false)
					});
				}
			}

			bSep = true;
			for (iIndex = 0, iLen = aList.length; iIndex < iLen; iIndex++)
			{
				oItem = aList[iIndex];
	//			if (oItem.subScribed() || !oItem.existen || bBuildUnvisible)
				if ((oItem.subScribed() || !oItem.existen || bBuildUnvisible) && (oItem.selectable || oItem.hasSubScribedSubfolders()))
				{
					if (fVisibleCallback ? fVisibleCallback.call(null, oItem) : true)
					{
						if (Enums.FolderType.User === oItem.type() || !bSystem || oItem.hasSubScribedSubfolders())
						{
							if (bSep && 0 < aResult.length)
							{
								aResult.push({
									'id': '---',
									'name': '---',
									'system': false,
									'seporator': true,
									'disabled': true
								});
							}

							bSep = false;
							aResult.push({
								'id': oItem.fullNameRaw,
								'name': (new window.Array(oItem.deep + 1 - iUnDeep)).join(sDeepPrefix) +
									(fRenameCallback ? fRenameCallback.call(null, oItem) : oItem.name()),
								'system': false,
								'seporator': false,
								'disabled': !oItem.selectable || -1 < Utils.inArray(oItem.fullNameRaw, aDisabled) ||
									(fDisableCallback ? fDisableCallback.call(null, oItem) : false)
							});
						}
					}
				}

				if (oItem.subScribed() && 0 < oItem.subFolders().length)
				{
					aResult = aResult.concat(Utils.folderListOptionsBuilder([], oItem.subFolders(), aDisabled, [],
						iUnDeep, fDisableCallback, fVisibleCallback, fRenameCallback, bSystem, bBuildUnvisible));
				}
			}

			return aResult;
		};

		Utils.computedPagenatorHelper = function (koCurrentPage, koPageCount)
		{
			return function() {

				var
					iPrev = 0,
					iNext = 0,
					iLimit = 2,
					aResult = [],
					iCurrentPage = koCurrentPage(),
					iPageCount = koPageCount(),

					/**
					 * @param {number} iIndex
					 * @param {boolean=} bPush = true
					 * @param {string=} sCustomName = ''
					 */
					fAdd = function (iIndex, bPush, sCustomName) {

						var oData = {
							'current': iIndex === iCurrentPage,
							'name': Utils.isUnd(sCustomName) ? iIndex.toString() : sCustomName.toString(),
							'custom': Utils.isUnd(sCustomName) ? false : true,
							'title': Utils.isUnd(sCustomName) ? '' : iIndex.toString(),
							'value': iIndex.toString()
						};

						if (Utils.isUnd(bPush) ? true : !!bPush)
						{
							aResult.push(oData);
						}
						else
						{
							aResult.unshift(oData);
						}
					}
				;

				if (1 < iPageCount || (0 < iPageCount && iPageCount < iCurrentPage))
		//		if (0 < iPageCount && 0 < iCurrentPage)
				{
					if (iPageCount < iCurrentPage)
					{
						fAdd(iPageCount);
						iPrev = iPageCount;
						iNext = iPageCount;
					}
					else
					{
						if (3 >= iCurrentPage || iPageCount - 2 <= iCurrentPage)
						{
							iLimit += 2;
						}

						fAdd(iCurrentPage);
						iPrev = iCurrentPage;
						iNext = iCurrentPage;
					}

					while (0 < iLimit) {

						iPrev -= 1;
						iNext += 1;

						if (0 < iPrev)
						{
							fAdd(iPrev, false);
							iLimit--;
						}

						if (iPageCount >= iNext)
						{
							fAdd(iNext, true);
							iLimit--;
						}
						else if (0 >= iPrev)
						{
							break;
						}
					}

					if (3 === iPrev)
					{
						fAdd(2, false);
					}
					else if (3 < iPrev)
					{
						fAdd(window.Math.round((iPrev - 1) / 2), false, '...');
					}

					if (iPageCount - 2 === iNext)
					{
						fAdd(iPageCount - 1, true);
					}
					else if (iPageCount - 2 > iNext)
					{
						fAdd(window.Math.round((iPageCount + iNext) / 2), true, '...');
					}

					// first and last
					if (1 < iPrev)
					{
						fAdd(1, false);
					}

					if (iPageCount > iNext)
					{
						fAdd(iPageCount, true);
					}
				}

				return aResult;
			};
		};

		Utils.selectElement = function (element)
		{
			var sel, range;
			if (window.getSelection)
			{
				sel = window.getSelection();
				sel.removeAllRanges();
				range = window.document.createRange();
				range.selectNodeContents(element);
				sel.addRange(range);
			}
			else if (window.document.selection)
			{
				range = window.document.body.createTextRange();
				range.moveToElementText(element);
				range.select();
			}
		};

		Utils.detectDropdownVisibility = _.debounce(function () {
			Globals.dropdownVisibility(!!_.find(Globals.aBootstrapDropdowns, function (oItem) {
				return oItem.hasClass('open');
			}));
		}, 50);

		/**
		 * @param {boolean=} bDelay = false
		 */
		Utils.triggerAutocompleteInputChange = function (bDelay) {

			var fFunc = function () {
				$('.checkAutocomplete').trigger('change');
			};

			if (Utils.isUnd(bDelay) ? false : !!bDelay)
			{
				_.delay(fFunc, 100);
			}
			else
			{
				fFunc();
			}
		};

		/**
		 * @param {Object} oParams
		 */
		Utils.setHeadViewport = function (oParams)
		{
			var aContent = [];
			_.each(oParams, function (sKey, sValue) {
				aContent.push('' + sKey + '=' + sValue);
			});

			$('#rl-head-viewport').attr('content', aContent.join(', '));
		};

		/**
		 * @param {string} sFileName
		 * @return {string}
		 */
		Utils.getFileExtension = function (sFileName)
		{
			sFileName = Utils.trim(sFileName).toLowerCase();

			var sResult = sFileName.split('.').pop();
			return (sResult === sFileName) ? '' : sResult;
		};

		/**
		 * @param {string} sFileName
		 * @return {string}
		 */
		Utils.mimeContentType = function (sFileName)
		{
			var
				sExt = '',
				sResult = 'application/octet-stream'
			;

			sFileName = Utils.trim(sFileName).toLowerCase();

			if ('winmail.dat' === sFileName)
			{
				return 'application/ms-tnef';
			}

			sExt = Utils.getFileExtension(sFileName);
			if (sExt && 0 < sExt.length && !Utils.isUnd(Mime[sExt]))
			{
				sResult = Mime[sExt];
			}

			return sResult;
		};

		/**
		 * @param {mixed} mPropOrValue
		 * @param {mixed} mValue
		 */
		Utils.disposeOne = function (mPropOrValue, mValue)
		{
			var mDisposable = mValue || mPropOrValue;
	        if (mDisposable && typeof mDisposable.dispose === 'function')
			{
	            mDisposable.dispose();
	        }
		};

		/**
		 * @param {Object} oObject
		 */
		Utils.disposeObject = function (oObject)
		{
			if (oObject)
			{
				if (Utils.isArray(oObject.disposables))
				{
					_.each(oObject.disposables, Utils.disposeOne);
				}

				ko.utils.objectForEach(oObject, Utils.disposeOne);
			}
		};

		/**
		 * @param {Object|Array} mObjectOrObjects
		 */
		Utils.delegateRunOnDestroy = function (mObjectOrObjects)
		{
			if (mObjectOrObjects)
			{
				if (Utils.isArray(mObjectOrObjects))
				{
					_.each(mObjectOrObjects, function (oItem) {
						Utils.delegateRunOnDestroy(oItem);
					});
				}
				else if (mObjectOrObjects && mObjectOrObjects.onDestroy)
				{
					mObjectOrObjects.onDestroy();
				}
			}
		};

		Utils.__themeTimer = 0;
		Utils.__themeAjax = null;

		Utils.changeTheme = function (sValue, sHash, themeTrigger, Links)
		{
			var
				oThemeLink = $('#rlThemeLink'),
				oThemeStyle = $('#rlThemeStyle'),
				sUrl = oThemeLink.attr('href')
			;

			if (!sUrl)
			{
				sUrl = oThemeStyle.attr('data-href');
			}

			if (sUrl)
			{
				sUrl = sUrl.toString().replace(/\/-\/[^\/]+\/\-\//, '/-/' + sValue + '/-/');
				sUrl = sUrl.toString().replace(/\/Css\/[^\/]+\/User\//, '/Css/0/User/');
				sUrl = sUrl.toString().replace(/\/Hash\/[^\/]+\//, '/Hash/-/');

				if ('Json/' !== sUrl.substring(sUrl.length - 5, sUrl.length))
				{
					sUrl += 'Json/';
				}

				window.clearTimeout(Utils.__themeTimer);
				themeTrigger(Enums.SaveSettingsStep.Animate);

				if (Utils.__themeAjax && Utils.__themeAjax.abort)
				{
					Utils.__themeAjax.abort();
				}

				Utils.__themeAjax = $.ajax({
					'url': sUrl,
					'dataType': 'json'
				}).done(function(aData) {

					if (aData && Utils.isArray(aData) && 2 === aData.length)
					{
						if (oThemeLink && oThemeLink[0] && (!oThemeStyle || !oThemeStyle[0]))
						{
							oThemeStyle = $('<style id="rlThemeStyle"></style>');
							oThemeLink.after(oThemeStyle);
							oThemeLink.remove();
						}

						if (oThemeStyle && oThemeStyle[0])
						{
							oThemeStyle.attr('data-href', sUrl).attr('data-theme', aData[0]);
							if (oThemeStyle[0].styleSheet && !Utils.isUnd(oThemeStyle[0].styleSheet.cssText))
							{
								oThemeStyle[0].styleSheet.cssText = aData[1];
							}
							else
							{
								oThemeStyle.text(aData[1]);
							}
						}

						if (Links)
						{
							var $oBg = $('#rl-bg');
							if (!sHash)
							{
								if ($oBg.data('backstretch'))
								{
									$oBg.backstretch('destroy').attr('style', '');
								}
							}
							else
							{
								$oBg.backstretch(Links.publicLink(sHash), {
									'fade': Globals.bAnimationSupported ? 1000 : 0,
									'centeredX': true,
									'centeredY': true
								});
							}
						}

						themeTrigger(Enums.SaveSettingsStep.TrueResult);
					}

				}).always(function() {

					Utils.__themeTimer = window.setTimeout(function () {
						themeTrigger(Enums.SaveSettingsStep.Idle);
					}, 1000);

					Utils.__themeAjax = null;
				});
			}
		};

		module.exports = Utils;

	}());

/***/ },
/* 2 */
/*!***************************!*\
  !*** external "window._" ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window._;

/***/ },
/* 3 */
/*!****************************!*\
  !*** ./dev/External/ko.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function (ko) {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),

			fDisposalTooltipHelper = function (oElement, $oEl, oSubscription) {
				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {

					if (oSubscription && oSubscription.dispose)
					{
						oSubscription.dispose();
					}

					if ($oEl)
					{
						$oEl.off('click.koTooltip');

						if ($oEl.tooltip)
						{
							$oEl.tooltip('destroy');
						}
					}

					$oEl = null;
				});
			}
		;

		ko.bindingHandlers.tooltip = {
			'init': function (oElement, fValueAccessor) {

				var
					$oEl = null,
					bi18n = true,
					sClass  = '',
					sPlacement  = '',
					oSubscription = null,
					Globals = __webpack_require__(/*! Common/Globals */ 8),
					Translator = __webpack_require__(/*! Common/Translator */ 7)
				;

				if (!Globals.bMobileDevice)
				{
					$oEl = $(oElement);
					sClass = $oEl.data('tooltip-class') || '';
					bi18n = 'on' === ($oEl.data('tooltip-i18n') || 'on');
					sPlacement = $oEl.data('tooltip-placement') || 'top';

					$oEl.tooltip({
						'delay': {
							'show': 500,
							'hide': 100
						},
						'html': true,
						'container': 'body',
						'placement': sPlacement,
						'trigger': 'hover',
						'title': function () {
							var sValue = bi18n ? ko.unwrap(fValueAccessor()) : fValueAccessor()();
							return '' === sValue || $oEl.is('.disabled') || Globals.dropdownVisibility() ? '' :
								'<span class="tooltip-class ' + sClass + '">' + (bi18n ? Translator.i18n(sValue) : sValue) + '</span>';
						}
					}).on('click.koTooltip', function () {
						$oEl.tooltip('hide');
					});

					oSubscription = Globals.tooltipTrigger.subscribe(function () {
						$oEl.tooltip('hide');
					});

					fDisposalTooltipHelper(oElement, $oEl, oSubscription);
				}
			}
		};

		ko.bindingHandlers.tooltipForTest = {
			'init': function (oElement) {

				var
					$oEl = $(oElement),
					oSubscription = null,
					Globals = __webpack_require__(/*! Common/Globals */ 8)
				;

				$oEl.tooltip({
					'container': 'body',
					'trigger': 'hover manual',
					'title': function () {
						return $oEl.data('tooltip3-data') || '';
					}
				});

				$(window.document).on('click', function () {
					$oEl.tooltip('hide');
				});

				oSubscription = Globals.tooltipTrigger.subscribe(function () {
					$oEl.tooltip('hide');
				});

				fDisposalTooltipHelper(oElement, $oEl, oSubscription);
			},
			'update': function (oElement, fValueAccessor) {
				var sValue = ko.unwrap(fValueAccessor());
				if ('' === sValue)
				{
					$(oElement).data('tooltip3-data', '').tooltip('hide');
				}
				else
				{
					$(oElement).data('tooltip3-data', sValue);

					_.delay(function () {
						if ($(oElement).is(':visible'))
						{
							$(oElement).tooltip('show');
						}
					}, 100);
				}
			}
		};

		ko.bindingHandlers.registrateBootstrapDropdown = {
			'init': function (oElement) {
				var Globals = __webpack_require__(/*! Common/Globals */ 8);
				if (Globals && Globals.aBootstrapDropdowns)
				{
					Globals.aBootstrapDropdowns.push($(oElement));
	//				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
	//					// TODO
	//				});
				}
			}
		};

		ko.bindingHandlers.openDropdownTrigger = {
			'update': function (oElement, fValueAccessor) {
				if (ko.unwrap(fValueAccessor()))
				{
					var
						$oEl = $(oElement),
						Utils = __webpack_require__(/*! Common/Utils */ 1)
					;

					if (!$oEl.hasClass('open'))
					{
						$oEl.find('.dropdown-toggle').dropdown('toggle');
						Utils.detectDropdownVisibility();
					}

					fValueAccessor()(false);
				}
			}
		};

		ko.bindingHandlers.dropdownCloser = {
			'init': function (oElement) {
				$(oElement).closest('.dropdown').on('click', '.e-item', function () {
					$(oElement).dropdown('toggle');
				});
			}
		};

		ko.bindingHandlers.popover = {
			'init': function (oElement, fValueAccessor) {
				$(oElement).popover(ko.unwrap(fValueAccessor()));

				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
					$(oElement).popover('destroy');
				});
			}
		};

		ko.bindingHandlers.csstext = {
			'init': function (oElement, fValueAccessor) {
				var Utils = __webpack_require__(/*! Common/Utils */ 1);
				if (oElement && oElement.styleSheet && !Utils.isUnd(oElement.styleSheet.cssText))
				{
					oElement.styleSheet.cssText = ko.unwrap(fValueAccessor());
				}
				else
				{
					$(oElement).text(ko.unwrap(fValueAccessor()));
				}
			},
			'update': function (oElement, fValueAccessor) {
				var Utils = __webpack_require__(/*! Common/Utils */ 1);
				if (oElement && oElement.styleSheet && !Utils.isUnd(oElement.styleSheet.cssText))
				{
					oElement.styleSheet.cssText = ko.unwrap(fValueAccessor());
				}
				else
				{
					$(oElement).text(ko.unwrap(fValueAccessor()));
				}
			}
		};

		ko.bindingHandlers.resizecrop = {
			'init': function (oElement) {
				$(oElement).addClass('resizecrop').resizecrop({
					'width': '100',
					'height': '100',
					'wrapperCSS': {
						'border-radius': '10px'
					}
				});
			},
			'update': function (oElement, fValueAccessor) {
				fValueAccessor()();
				$(oElement).resizecrop({
					'width': '100',
					'height': '100'
				});
			}
		};

		ko.bindingHandlers.onEnter = {
			'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
				$(oElement).on('keypress.koOnEnter', function (oEvent) {
					if (oEvent && 13 === window.parseInt(oEvent.keyCode, 10))
					{
						$(oElement).trigger('change');
						fValueAccessor().call(oViewModel);
					}
				});

				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
					$(oElement).off('keypress.koOnEnter');
				});
			}
		};

		ko.bindingHandlers.onEsc = {
			'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
				$(oElement).on('keypress.koOnEsc', function (oEvent) {
					if (oEvent && 27 === window.parseInt(oEvent.keyCode, 10))
					{
						$(oElement).trigger('change');
						fValueAccessor().call(oViewModel);
					}
				});

				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
					$(oElement).off('keypress.koOnEsc');
				});
			}
		};

		ko.bindingHandlers.clickOnTrue = {
			'update': function (oElement, fValueAccessor) {
				if (ko.unwrap(fValueAccessor()))
				{
					$(oElement).click();
				}
			}
		};

		ko.bindingHandlers.modal = {
			'init': function (oElement, fValueAccessor) {

				var
					Globals = __webpack_require__(/*! Common/Globals */ 8),
					Utils = __webpack_require__(/*! Common/Utils */ 1)
				;

				$(oElement).toggleClass('fade', !Globals.bMobileDevice).modal({
					'keyboard': false,
					'show': ko.unwrap(fValueAccessor())
				})
				.on('shown.koModal', Utils.windowResizeCallback)
				.find('.close').on('click.koModal', function () {
					fValueAccessor()(false);
				});

				ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
					$(oElement)
						.off('shown.koModal')
						.find('.close')
						.off('click.koModal')
					;
				});
			},
			'update': function (oElement, fValueAccessor) {
				$(oElement).modal(ko.unwrap(fValueAccessor()) ? 'show' : 'hide');
			}
		};

		ko.bindingHandlers.i18nInit = {
			'init': function (oElement) {
				__webpack_require__(/*! Common/Translator */ 7).i18nToNode(oElement);
			}
		};

		ko.bindingHandlers.i18nUpdate = {
			'update': function (oElement, fValueAccessor) {
				ko.unwrap(fValueAccessor());
				__webpack_require__(/*! Common/Translator */ 7).i18nToNode(oElement);
			}
		};

		ko.bindingHandlers.link = {
			'update': function (oElement, fValueAccessor) {
				$(oElement).attr('href', ko.unwrap(fValueAccessor()));
			}
		};

		ko.bindingHandlers.title = {
			'update': function (oElement, fValueAccessor) {
				$(oElement).attr('title', ko.unwrap(fValueAccessor()));
			}
		};

		ko.bindingHandlers.textF = {
			'init': function (oElement, fValueAccessor) {
				$(oElement).text(ko.unwrap(fValueAccessor()));
			}
		};

		ko.bindingHandlers.initDom = {
			'init': function (oElement, fValueAccessor) {
				fValueAccessor()(oElement);
			}
		};

		ko.bindingHandlers.initFixedTrigger = {
			'init': function (oElement, fValueAccessor) {
				var
					aValues = ko.unwrap(fValueAccessor()),
					$oContainer = null,
					$oElement = $(oElement),
					oOffset = null,

					iTop = aValues[1] || 0
				;

				$oContainer = $(aValues[0] || null);
				$oContainer = $oContainer[0] ? $oContainer : null;

				if ($oContainer)
				{
					$(window).resize(function () {
						oOffset = $oContainer.offset();
						if (oOffset && oOffset.top)
						{
							$oElement.css('top', oOffset.top + iTop);
						}
					});
				}
			}
		};

		ko.bindingHandlers.initResizeTrigger = {
			'init': function (oElement, fValueAccessor) {
				var aValues = ko.unwrap(fValueAccessor());
				$(oElement).css({
					'height': aValues[1],
					'min-height': aValues[1]
				});
			},
			'update': function (oElement, fValueAccessor) {

				var
					Utils = __webpack_require__(/*! Common/Utils */ 1),
					Globals = __webpack_require__(/*! Common/Globals */ 8),
					aValues = ko.unwrap(fValueAccessor()),
					iValue = Utils.pInt(aValues[1]),
					iSize = 0,
					iOffset = $(oElement).offset().top
				;

				if (0 < iOffset)
				{
					iOffset += Utils.pInt(aValues[2]);
					iSize = Globals.$win.height() - iOffset;

					if (iValue < iSize)
					{
						iValue = iSize;
					}

					$(oElement).css({
						'height': iValue,
						'min-height': iValue
					});
				}
			}
		};

		ko.bindingHandlers.appendDom = {
			'update': function (oElement, fValueAccessor) {
				$(oElement).hide().empty().append(ko.unwrap(fValueAccessor())).show();
			}
		};

		ko.bindingHandlers.draggable = {
			'init': function (oElement, fValueAccessor, fAllBindingsAccessor) {

				var
					Globals = __webpack_require__(/*! Common/Globals */ 8),
					Utils = __webpack_require__(/*! Common/Utils */ 1)
				;

				if (!Globals.bMobileDevice)
				{
					var
						iTriggerZone = 100,
						iScrollSpeed = 3,
						fAllValueFunc = fAllBindingsAccessor(),
						sDroppableSelector = fAllValueFunc && fAllValueFunc['droppableSelector'] ? fAllValueFunc['droppableSelector'] : '',
						oConf = {
							'distance': 20,
							'handle': '.dragHandle',
							'cursorAt': {'top': 22, 'left': 3},
							'refreshPositions': true,
							'scroll': true
						}
					;

					if (sDroppableSelector)
					{
						oConf['drag'] = function (oEvent) {

							$(sDroppableSelector).each(function () {
								var
									moveUp = null,
									moveDown = null,
									$this = $(this),
									oOffset = $this.offset(),
									bottomPos = oOffset.top + $this.height()
								;

								window.clearInterval($this.data('timerScroll'));
								$this.data('timerScroll', false);

								if (oEvent.pageX >= oOffset.left && oEvent.pageX <= oOffset.left + $this.width())
								{
									if (oEvent.pageY >= bottomPos - iTriggerZone && oEvent.pageY <= bottomPos)
									{
										moveUp = function() {
											$this.scrollTop($this.scrollTop() + iScrollSpeed);
											Utils.windowResize();
										};

										$this.data('timerScroll', window.setInterval(moveUp, 10));
										moveUp();
									}

									if (oEvent.pageY >= oOffset.top && oEvent.pageY <= oOffset.top + iTriggerZone)
									{
										moveDown = function() {
											$this.scrollTop($this.scrollTop() - iScrollSpeed);
											Utils.windowResize();
										};

										$this.data('timerScroll', window.setInterval(moveDown, 10));
										moveDown();
									}
								}
							});
						};

						oConf['stop'] =	function() {
							$(sDroppableSelector).each(function () {
								window.clearInterval($(this).data('timerScroll'));
								$(this).data('timerScroll', false);
							});
						};
					}

					oConf['helper'] = function (oEvent) {
						return fValueAccessor()(oEvent && oEvent.target ? ko.dataFor(oEvent.target) : null);
					};

					$(oElement).draggable(oConf).on('mousedown.koDraggable', function () {
						Utils.removeInFocus();
					});

					ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
						$(oElement)
							.off('mousedown.koDraggable')
							.draggable('destroy')
						;
					});
				}
			}
		};

		ko.bindingHandlers.droppable = {
			'init': function (oElement, fValueAccessor, fAllBindingsAccessor) {
				var Globals = __webpack_require__(/*! Common/Globals */ 8);
				if (!Globals.bMobileDevice)
				{
					var
						fValueFunc = fValueAccessor(),
						fAllValueFunc = fAllBindingsAccessor(),
						fOverCallback = fAllValueFunc && fAllValueFunc['droppableOver'] ? fAllValueFunc['droppableOver'] : null,
						fOutCallback = fAllValueFunc && fAllValueFunc['droppableOut'] ? fAllValueFunc['droppableOut'] : null,
						oConf = {
							'tolerance': 'pointer',
							'hoverClass': 'droppableHover'
						}
					;

					if (fValueFunc)
					{
						oConf['drop'] = function (oEvent, oUi) {
							fValueFunc(oEvent, oUi);
						};

						if (fOverCallback)
						{
							oConf['over'] = function (oEvent, oUi) {
								fOverCallback(oEvent, oUi);
							};
						}

						if (fOutCallback)
						{
							oConf['out'] = function (oEvent, oUi) {
								fOutCallback(oEvent, oUi);
							};
						}

						$(oElement).droppable(oConf);

						ko.utils.domNodeDisposal.addDisposeCallback(oElement, function () {
							$(oElement).droppable('destroy');
						});
					}
				}
			}
		};

		ko.bindingHandlers.nano = {
			'init': function (oElement) {
				var Globals = __webpack_require__(/*! Common/Globals */ 8);
				if (!Globals.bDisableNanoScroll)
				{
					$(oElement)
						.addClass('nano')
						.nanoScroller({
							'iOSNativeScrolling': false,
							'preventPageScrolling': true
						})
					;
				}
			}
		};

		ko.bindingHandlers.saveTrigger = {
			'init': function (oElement) {

				var $oEl = $(oElement);

				$oEl.data('save-trigger-type', $oEl.is('input[type=text],input[type=email],input[type=password],select,textarea') ? 'input' : 'custom');

				if ('custom' === $oEl.data('save-trigger-type'))
				{
					$oEl.append(
						'&nbsp;&nbsp;<i class="icon-spinner animated"></i><i class="icon-remove error"></i><i class="icon-ok success"></i>'
					).addClass('settings-saved-trigger');
				}
				else
				{
					$oEl.addClass('settings-saved-trigger-input');
				}
			},
			'update': function (oElement, fValueAccessor) {
				var
					mValue = ko.unwrap(fValueAccessor()),
					$oEl = $(oElement)
				;

				if ('custom' === $oEl.data('save-trigger-type'))
				{
					switch (mValue.toString())
					{
						case '1':
							$oEl
								.find('.animated,.error').hide().removeClass('visible')
								.end()
								.find('.success').show().addClass('visible')
							;
							break;
						case '0':
							$oEl
								.find('.animated,.success').hide().removeClass('visible')
								.end()
								.find('.error').show().addClass('visible')
							;
							break;
						case '-2':
							$oEl
								.find('.error,.success').hide().removeClass('visible')
								.end()
								.find('.animated').show().addClass('visible')
							;
							break;
						default:
							$oEl
								.find('.animated').hide()
								.end()
								.find('.error,.success').removeClass('visible')
							;
							break;
					}
				}
				else
				{
					switch (mValue.toString())
					{
						case '1':
							$oEl.addClass('success').removeClass('error');
							break;
						case '0':
							$oEl.addClass('error').removeClass('success');
							break;
						case '-2':
		//					$oEl;
							break;
						default:
							$oEl.removeClass('error success');
							break;
					}
				}
			}
		};

		ko.bindingHandlers.emailsTags = {
			'init': function(oElement, fValueAccessor, fAllBindingsAccessor) {

				var
					Utils = __webpack_require__(/*! Common/Utils */ 1),
					EmailModel = __webpack_require__(/*! Model/Email */ 25),

					$oEl = $(oElement),
					fValue = fValueAccessor(),
					fAllBindings = fAllBindingsAccessor(),
					fAutoCompleteSource = fAllBindings['autoCompleteSource'] || null,
					fFocusCallback = function (bValue) {
						if (fValue && fValue.focusTrigger)
						{
							fValue.focusTrigger(bValue);
						}
					}
				;

				$oEl.inputosaurus({
					'parseOnBlur': true,
					'allowDragAndDrop': true,
					'focusCallback': fFocusCallback,
					'inputDelimiters': [',', ';'],
					'autoCompleteSource': fAutoCompleteSource,
					'parseHook': function (aInput) {
						return _.map(aInput, function (sInputValue) {

							var
								sValue = Utils.trim(sInputValue),
								oEmail = null
							;

							if ('' !== sValue)
							{
								oEmail = new EmailModel();
								oEmail.mailsoParse(sValue);
								return [oEmail.toLine(false), oEmail];
							}

							return [sValue, null];

						});
					},
					'change': _.bind(function (oEvent) {
						$oEl.data('EmailsTagsValue', oEvent.target.value);
						fValue(oEvent.target.value);
					}, this)
				});
			},
			'update': function (oElement, fValueAccessor, fAllBindingsAccessor) {

				var
					$oEl = $(oElement),
					fAllValueFunc = fAllBindingsAccessor(),
					fEmailsTagsFilter = fAllValueFunc['emailsTagsFilter'] || null,
					sValue = ko.unwrap(fValueAccessor())
				;

				if ($oEl.data('EmailsTagsValue') !== sValue)
				{
					$oEl.val(sValue);
					$oEl.data('EmailsTagsValue', sValue);
					$oEl.inputosaurus('refresh');
				}

				if (fEmailsTagsFilter && ko.unwrap(fEmailsTagsFilter))
				{
					$oEl.inputosaurus('focus');
				}
			}
		};

		ko.bindingHandlers.command = {
			'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
				var
					jqElement = $(oElement),
					oCommand = fValueAccessor()
				;

				if (!oCommand || !oCommand.enabled || !oCommand.canExecute)
				{
					throw new Error('You are not using command function');
				}

				jqElement.addClass('command');
				ko.bindingHandlers[jqElement.is('form') ? 'submit' : 'click'].init.apply(oViewModel, arguments);
			},

			'update': function (oElement, fValueAccessor) {

				var
					bResult = true,
					jqElement = $(oElement),
					oCommand = fValueAccessor()
				;

				bResult = oCommand.enabled();
				jqElement.toggleClass('command-not-enabled', !bResult);

				if (bResult)
				{
					bResult = oCommand.canExecute();
					jqElement.toggleClass('command-can-not-be-execute', !bResult);
				}

				jqElement.toggleClass('command-disabled disable disabled', !bResult).toggleClass('no-disabled', !!bResult);

				if (jqElement.is('input') || jqElement.is('button'))
				{
					jqElement.prop('disabled', !bResult);
				}
			}
		};

		// extenders

		ko.extenders.trimmer = function (oTarget)
		{
			var
				Utils = __webpack_require__(/*! Common/Utils */ 1),
				oResult = ko.computed({
					'read': oTarget,
					'write': function (sNewValue) {
						oTarget(Utils.trim(sNewValue.toString()));
					},
					'owner': this
				})
			;

			oResult(oTarget());
			return oResult;
		};

		ko.extenders.posInterer = function (oTarget, iDefault)
		{
			var
				Utils = __webpack_require__(/*! Common/Utils */ 1),
				oResult = ko.computed({
					'read': oTarget,
					'write': function (sNewValue) {
						var iNew = Utils.pInt(sNewValue.toString(), iDefault);
						if (0 >= iNew)
						{
							iNew = iDefault;
						}

						if (iNew === oTarget() && '' + iNew !== '' + sNewValue)
						{
							oTarget(iNew + 1);
						}

						oTarget(iNew);
					}
				})
			;

			oResult(oTarget());
			return oResult;
		};

		ko.extenders.limitedList = function (oTarget, mList)
		{
			var
				Utils = __webpack_require__(/*! Common/Utils */ 1),
				oResult = ko.computed({
					'read': oTarget,
					'write': function (sNewValue) {

						var
							sCurrentValue = ko.unwrap(oTarget),
							aList = ko.unwrap(mList)
						;

						if (Utils.isNonEmptyArray(aList))
						{
							if (-1 < Utils.inArray(sNewValue, aList))
							{
								oTarget(sNewValue);
							}
							else if (-1 < Utils.inArray(sCurrentValue, aList))
							{
								oTarget(sCurrentValue + ' ');
								oTarget(sCurrentValue);
							}
							else
							{
								oTarget(aList[0] + ' ');
								oTarget(aList[0]);
							}
						}
						else
						{
							oTarget('');
						}
					}
				}).extend({'notify': 'always'})
			;

			oResult(oTarget());

			if (!oResult.valueHasMutated)
			{
				oResult.valueHasMutated = function () {
					oTarget.valueHasMutated();
				};
			}

			return oResult;
		};

		ko.extenders.reversible = function (oTarget)
		{
			var mValue = oTarget();

			oTarget.commit = function ()
			{
				mValue = oTarget();
			};

			oTarget.reverse = function ()
			{
				oTarget(mValue);
			};

			oTarget.commitedValue = function ()
			{
				return mValue;
			};

			return oTarget;
		};

		ko.extenders.toggleSubscribe = function (oTarget, oOptions)
		{
			oTarget.subscribe(oOptions[1], oOptions[0], 'beforeChange');
			oTarget.subscribe(oOptions[2], oOptions[0]);

			return oTarget;
		};

		ko.extenders.toggleSubscribeProperty = function (oTarget, oOptions)
		{
			var sProp = oOptions[1];

			if (sProp)
			{
				oTarget.subscribe(function (oPrev) {
					if (oPrev && oPrev[sProp])
					{
						oPrev[sProp](false);
					}
				}, oOptions[0], 'beforeChange');

				oTarget.subscribe(function (oNext) {
					if (oNext && oNext[sProp])
					{
						oNext[sProp](true);
					}
				}, oOptions[0]);
			}

			return oTarget;
		};

		ko.extenders.falseTimeout = function (oTarget, iOption)
		{
			var Utils = __webpack_require__(/*! Common/Utils */ 1);

			oTarget.iTimeout = 0;
			oTarget.subscribe(function (bValue) {
				if (bValue)
				{
					window.clearTimeout(oTarget.iTimeout);
					oTarget.iTimeout = window.setTimeout(function () {
						oTarget(false);
						oTarget.iTimeout = 0;
					}, Utils.pInt(iOption));
				}
			});

			return oTarget;
		};

		// functions

		ko.observable.fn.validateNone = function ()
		{
			this.hasError = ko.observable(false);
			return this;
		};

		ko.observable.fn.validateEmail = function ()
		{
			var Utils = __webpack_require__(/*! Common/Utils */ 1);

			this.hasError = ko.observable(false);

			this.subscribe(function (sValue) {
				sValue = Utils.trim(sValue);
				this.hasError('' !== sValue && !(/^[^@\s]+@[^@\s]+$/.test(sValue)));
			}, this);

			this.valueHasMutated();
			return this;
		};

		ko.observable.fn.validateSimpleEmail = function ()
		{
			var Utils = __webpack_require__(/*! Common/Utils */ 1);

			this.hasError = ko.observable(false);

			this.subscribe(function (sValue) {
				sValue = Utils.trim(sValue);
				this.hasError('' !== sValue && !(/^.+@.+$/.test(sValue)));
			}, this);

			this.valueHasMutated();
			return this;
		};

		ko.observable.fn.validateFunc = function (fFunc)
		{
			var Utils = __webpack_require__(/*! Common/Utils */ 1);

			this.hasFuncError = ko.observable(false);

			if (Utils.isFunc(fFunc))
			{
				this.subscribe(function (sValue) {
					this.hasFuncError(!fFunc(sValue));
				}, this);

				this.valueHasMutated();
			}

			return this;
		};

		module.exports = ko;

	}(ko));


/***/ },
/* 4 */
/*!*****************************!*\
  !*** ./dev/Common/Enums.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var Enums = {};

		/**
		 * @enum {string}
		 */
		Enums.StorageResultType = {
			'Success': 'success',
			'Abort': 'abort',
			'Error': 'error',
			'Unload': 'unload'
		};

		/**
		 * @enum {number}
		 */
		Enums.State = {
			'Empty': 10,
			'Login': 20,
			'Auth': 30
		};

		/**
		 * @enum {number}
		 */
		Enums.StateType = {
			'Webmail': 0,
			'Admin': 1
		};

		/**
		 * @enum {string}
		 */
		Enums.Capa = {
			'TwoFactor': 'TWO_FACTOR',
			'OpenPGP': 'OPEN_PGP',
			'Prefetch': 'PREFETCH',
			'Gravatar': 'GRAVATAR',
			'Themes': 'THEMES',
			'UserBackground': 'USER_BACKGROUND',
			'Sieve': 'SIEVE',
			'AttachmentThumbnails': 'ATTACHMENT_THUMBNAILS',
			'AdditionalAccounts': 'ADDITIONAL_ACCOUNTS',
			'AdditionalIdentities': 'ADDITIONAL_IDENTITIES'
		};

		/**
		 * @enum {string}
		 */
		Enums.KeyState = {
			'All': 'all',
			'None': 'none',
			'ContactList': 'contact-list',
			'MessageList': 'message-list',
			'FolderList': 'folder-list',
			'MessageView': 'message-view',
			'Compose': 'compose',
			'Settings': 'settings',
			'Menu': 'menu',
			'PopupComposeOpenPGP': 'compose-open-pgp',
			'PopupKeyboardShortcutsHelp': 'popup-keyboard-shortcuts-help',
			'PopupAsk': 'popup-ask'
		};

		/**
		 * @enum {number}
		 */
		Enums.FolderType = {
			'Inbox': 10,
			'SentItems': 11,
			'Draft': 12,
			'Trash': 13,
			'Spam': 14,
			'Archive': 15,
			'NotSpam': 80,
			'User': 99
		};

		/**
		 * @enum {string}
		 */
		Enums.LoginSignMeTypeAsString = {
			'DefaultOff': 'defaultoff',
			'DefaultOn': 'defaulton',
			'Unused': 'unused'
		};

		/**
		 * @enum {number}
		 */
		Enums.LoginSignMeType = {
			'DefaultOff': 0,
			'DefaultOn': 1,
			'Unused': 2
		};

		/**
		 * @enum {string}
		 */
		Enums.ComposeType = {
			'Empty': 'empty',
			'Reply': 'reply',
			'ReplyAll': 'replyall',
			'Forward': 'forward',
			'ForwardAsAttachment': 'forward-as-attachment',
			'Draft': 'draft',
			'EditAsNew': 'editasnew'
		};

		/**
		 * @enum {number}
		 */
		Enums.UploadErrorCode = {
			'Normal': 0,
			'FileIsTooBig': 1,
			'FilePartiallyUploaded': 2,
			'FileNoUploaded': 3,
			'MissingTempFolder': 4,
			'FileOnSaveingError': 5,
			'FileType': 98,
			'Unknown': 99
		};

		/**
		 * @enum {number}
		 */
		Enums.SetSystemFoldersNotification = {
			'None': 0,
			'Sent': 1,
			'Draft': 2,
			'Spam': 3,
			'Trash': 4,
			'Archive': 5
		};

		/**
		 * @enum {number}
		 */
		Enums.ClientSideKeyName = {
			'FoldersLashHash': 0,
			'MessagesInboxLastHash': 1,
			'MailBoxListSize': 2,
			'ExpandedFolders': 3,
			'FolderListSize': 4,
			'MessageListSize': 5,
			'LastReplyAction': 6
		};

		/**
		 * @enum {number}
		 */
		Enums.EventKeyCode = {
			'Backspace': 8,
			'Tab': 9,
			'Enter': 13,
			'Esc': 27,
			'PageUp': 33,
			'PageDown': 34,
			'Left': 37,
			'Right': 39,
			'Up': 38,
			'Down': 40,
			'End': 35,
			'Home': 36,
			'Space': 32,
			'Insert': 45,
			'Delete': 46,
			'A': 65,
			'S': 83
		};

		/**
		 * @enum {number}
		 */
		Enums.MessageSetAction = {
			'SetSeen': 0,
			'UnsetSeen': 1,
			'SetFlag': 2,
			'UnsetFlag': 3
		};

		/**
		 * @enum {number}
		 */
		Enums.MessageSelectAction = {
			'All': 0,
			'None': 1,
			'Invert': 2,
			'Unseen': 3,
			'Seen': 4,
			'Flagged': 5,
			'Unflagged': 6
		};

		/**
		 * @enum {number}
		 */
		Enums.DesktopNotification = {
			'Allowed': 0,
			'NotAllowed': 1,
			'Denied': 2,
			'NotSupported': 9
		};

		/**
		 * @enum {number}
		 */
		Enums.MessagePriority = {
			'Low': 5,
			'Normal': 3,
			'High': 1
		};

		/**
		 * @enum {string}
		 */
		Enums.EditorDefaultType = {
			'Html': 'Html',
			'Plain': 'Plain',
			'HtmlForced': 'HtmlForced',
			'PlainForced': 'PlainForced'
		};
		
		/**
		 * @enum {number}
		 */
		Enums.ServerSecure = {
			'None': 0,
			'SSL': 1,
			'TLS': 2
		};

		/**
		 * @enum {number}
		 */
		Enums.SearchDateType = {
			'All': -1,
			'Days3': 3,
			'Days7': 7,
			'Month': 30
		};

		/**
		 * @enum {number}
		 */
		Enums.SaveSettingsStep = {
			'Animate': -2,
			'Idle': -1,
			'TrueResult': 1,
			'FalseResult': 0
		};

		/**
		 * @enum {number}
		 */
		Enums.Layout = {
			'NoPreview': 0,
			'SidePreview': 1,
			'BottomPreview': 2
		};

		/**
		 * @enum {string}
		 */
		Enums.FilterConditionField = {
			'From': 'From',
			'Recipient': 'Recipient',
			'Subject': 'Subject'
		};

		/**
		 * @enum {string}
		 */
		Enums.FilterConditionType = {
			'Contains': 'Contains',
			'NotContains': 'NotContains',
			'EqualTo': 'EqualTo',
			'NotEqualTo': 'NotEqualTo'
		};

		/**
		 * @enum {string}
		 */
		Enums.FiltersAction = {
			'None': 'None',
			'MoveTo': 'MoveTo',
			'Discard': 'Discard',
			'Vacation': 'Vacation',
			'Reject': 'Reject',
			'Forward': 'Forward'
		};

		/**
		 * @enum {string}
		 */
		Enums.FilterRulesType = {
			'All': 'All',
			'Any': 'Any'
		};

		/**
		 * @enum {number}
		 */
		Enums.SignedVerifyStatus = {
			'UnknownPublicKeys': -4,
			'UnknownPrivateKey': -3,
			'Unverified': -2,
			'Error': -1,
			'None': 0,
			'Success': 1
		};

		/**
		 * @enum {number}
		 */
		Enums.ContactPropertyType = {

			'Unknown': 0,

			'FullName': 10,

			'FirstName': 15,
			'LastName': 16,
			'MiddleName': 16,
			'Nick': 18,

			'NamePrefix': 20,
			'NameSuffix': 21,

			'Email': 30,
			'Phone': 31,
			'Web': 32,

			'Birthday': 40,

			'Facebook': 90,
			'Skype': 91,
			'GitHub': 92,

			'Note': 110,

			'Custom': 250
		};

		/**
		 * @enum {number}
		 */
		Enums.Notification = {
			'InvalidToken': 101,
			'AuthError': 102,
			'AccessError': 103,
			'ConnectionError': 104,
			'CaptchaError': 105,
			'SocialFacebookLoginAccessDisable': 106,
			'SocialTwitterLoginAccessDisable': 107,
			'SocialGoogleLoginAccessDisable': 108,
			'DomainNotAllowed': 109,
			'AccountNotAllowed': 110,

			'AccountTwoFactorAuthRequired': 120,
			'AccountTwoFactorAuthError': 121,

			'CouldNotSaveNewPassword': 130,
			'CurrentPasswordIncorrect': 131,
			'NewPasswordShort': 132,
			'NewPasswordWeak': 133,
			'NewPasswordForbidden': 134,

			'ContactsSyncError': 140,

			'CantGetMessageList': 201,
			'CantGetMessage': 202,
			'CantDeleteMessage': 203,
			'CantMoveMessage': 204,
			'CantCopyMessage': 205,

			'CantSaveMessage': 301,
			'CantSendMessage': 302,
			'InvalidRecipients': 303,

			'CantSaveFilters': 351,
			'CantGetFilters': 352,
			'FiltersAreNotCorrect': 355,

			'CantCreateFolder': 400,
			'CantRenameFolder': 401,
			'CantDeleteFolder': 402,
			'CantSubscribeFolder': 403,
			'CantUnsubscribeFolder': 404,
			'CantDeleteNonEmptyFolder': 405,

			'CantSaveSettings': 501,
			'CantSavePluginSettings': 502,

			'DomainAlreadyExists': 601,

			'CantInstallPackage': 701,
			'CantDeletePackage': 702,
			'InvalidPluginPackage': 703,
			'UnsupportedPluginPackage': 704,

			'LicensingServerIsUnavailable': 710,
			'LicensingExpired': 711,
			'LicensingBanned': 712,

			'DemoSendMessageError': 750,
			'DemoAccountError': 751,

			'AccountAlreadyExists': 801,
			'AccountDoesNotExist': 802,

			'MailServerError': 901,
			'ClientViewError': 902,
			'InvalidInputArgument': 903,
			'UnknownNotification': 999,
			'UnknownError': 999
		};

		module.exports = Enums;

	}());

/***/ },
/* 5 */
/*!****************************!*\
  !*** ./dev/Knoin/Knoin.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			ko = __webpack_require__(/*! ko */ 3),
			hasher = __webpack_require__(/*! hasher */ 76),
			crossroads = __webpack_require__(/*! crossroads */ 41),

			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Plugins = __webpack_require__(/*! Common/Plugins */ 23),
			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 */
		function Knoin()
		{
			this.oScreens = {};
			this.sDefaultScreenName = '';
			this.oCurrentScreen = null;
		}

		Knoin.prototype.oScreens = {};
		Knoin.prototype.sDefaultScreenName = '';
		Knoin.prototype.oCurrentScreen = null;

		Knoin.prototype.hideLoading = function ()
		{
			$('#rl-loading').hide();
		};

		/**
		 * @param {Object} thisObject
		 */
		Knoin.prototype.constructorEnd = function (thisObject)
		{
			if (Utils.isFunc(thisObject['__constructor_end']))
			{
				thisObject['__constructor_end'].call(thisObject);
			}
		};

		/**
		 * @param {string|Array} mName
		 * @param {Function} ViewModelClass
		 */
		Knoin.prototype.extendAsViewModel = function (mName, ViewModelClass)
		{
			if (ViewModelClass)
			{
				if (Utils.isArray(mName))
				{
					ViewModelClass.__names = mName;
				}
				else
				{
					ViewModelClass.__names = [mName];
				}

				ViewModelClass.__name = ViewModelClass.__names[0];
			}
		};

		/**
		 * @param {Function} SettingsViewModelClass
		 * @param {string} sLabelName
		 * @param {string} sTemplate
		 * @param {string} sRoute
		 * @param {boolean=} bDefault
		 */
		Knoin.prototype.addSettingsViewModel = function (SettingsViewModelClass, sTemplate, sLabelName, sRoute, bDefault)
		{
			SettingsViewModelClass.__rlSettingsData = {
				'Label':  sLabelName,
				'Template':  sTemplate,
				'Route':  sRoute,
				'IsDefault':  !!bDefault
			};

			Globals.aViewModels['settings'].push(SettingsViewModelClass);
		};

		/**
		 * @param {Function} SettingsViewModelClass
		 */
		Knoin.prototype.removeSettingsViewModel = function (SettingsViewModelClass)
		{
			Globals.aViewModels['settings-removed'].push(SettingsViewModelClass);
		};

		/**
		 * @param {Function} SettingsViewModelClass
		 */
		Knoin.prototype.disableSettingsViewModel = function (SettingsViewModelClass)
		{
			Globals.aViewModels['settings-disabled'].push(SettingsViewModelClass);
		};

		Knoin.prototype.routeOff = function ()
		{
			hasher.changed.active = false;
		};

		Knoin.prototype.routeOn = function ()
		{
			hasher.changed.active = true;
		};

		/**
		 * @param {string} sScreenName
		 * @return {?Object}
		 */
		Knoin.prototype.screen = function (sScreenName)
		{
			return ('' !== sScreenName && !Utils.isUnd(this.oScreens[sScreenName])) ? this.oScreens[sScreenName] : null;
		};

		/**
		 * @param {Function} ViewModelClass
		 * @param {Object=} oScreen
		 */
		Knoin.prototype.buildViewModel = function (ViewModelClass, oScreen)
		{
			if (ViewModelClass && !ViewModelClass.__builded)
			{
				var
					kn = this,
					oViewModel = new ViewModelClass(oScreen),
					sPosition = oViewModel.viewModelPosition(),
					oViewModelPlace = $('#rl-content #rl-' + sPosition.toLowerCase()),
					oViewModelDom = null
				;

				ViewModelClass.__builded = true;
				ViewModelClass.__vm = oViewModel;

				oViewModel.onShowTrigger = ko.observable(false);
				oViewModel.onHideTrigger = ko.observable(false);

				oViewModel.viewModelName = ViewModelClass.__name;
				oViewModel.viewModelNames = ViewModelClass.__names;

				if (oViewModelPlace && 1 === oViewModelPlace.length)
				{
					oViewModelDom = $('<div></div>').addClass('rl-view-model').addClass('RL-' + oViewModel.viewModelTemplate()).hide();
					oViewModelDom.appendTo(oViewModelPlace);

					oViewModel.viewModelDom = oViewModelDom;
					ViewModelClass.__dom = oViewModelDom;

					if ('Popups' === sPosition)
					{
						oViewModel.cancelCommand = oViewModel.closeCommand = Utils.createCommand(oViewModel, function () {
							kn.hideScreenPopup(ViewModelClass);
						});

						oViewModel.modalVisibility.subscribe(function (bValue) {

							var self = this;
							if (bValue)
							{
								this.viewModelDom.show();
								this.storeAndSetKeyScope();

								Globals.popupVisibilityNames.push(this.viewModelName);
								oViewModel.viewModelDom.css('z-index', 3000 + Globals.popupVisibilityNames().length + 10);

								Utils.delegateRun(this, 'onFocus', [], 500);
							}
							else
							{
								Utils.delegateRun(this, 'onHide');
								if (this.onHideTrigger)
								{
									this.onHideTrigger(!this.onHideTrigger());
								}

								this.restoreKeyScope();

								_.each(this.viewModelNames, function (sName) {
									Plugins.runHook('view-model-on-hide', [sName, self]);
								});

								Globals.popupVisibilityNames.remove(this.viewModelName);
								oViewModel.viewModelDom.css('z-index', 2000);

								Globals.tooltipTrigger(!Globals.tooltipTrigger());

								_.delay(function () {
									self.viewModelDom.hide();
								}, 300);
							}

						}, oViewModel);
					}

					_.each(ViewModelClass.__names, function (sName) {
						Plugins.runHook('view-model-pre-build', [sName, oViewModel, oViewModelDom]);
					});

					ko.applyBindingAccessorsToNode(oViewModelDom[0], {
						'i18nInit': true,
						'template': function () { return {'name': oViewModel.viewModelTemplate()};}
					}, oViewModel);

					Utils.delegateRun(oViewModel, 'onBuild', [oViewModelDom]);
					if (oViewModel && 'Popups' === sPosition)
					{
						oViewModel.registerPopupKeyDown();
					}

					_.each(ViewModelClass.__names, function (sName) {
						Plugins.runHook('view-model-post-build', [sName, oViewModel, oViewModelDom]);
					});
				}
				else
				{
					Utils.log('Cannot find view model position: ' + sPosition);
				}
			}

			return ViewModelClass ? ViewModelClass.__vm : null;
		};

		/**
		 * @param {Function} ViewModelClassToHide
		 */
		Knoin.prototype.hideScreenPopup = function (ViewModelClassToHide)
		{
			if (ViewModelClassToHide && ViewModelClassToHide.__vm && ViewModelClassToHide.__dom)
			{
				ViewModelClassToHide.__vm.modalVisibility(false);
			}
		};

		/**
		 * @param {Function} ViewModelClassToShow
		 * @param {Array=} aParameters
		 */
		Knoin.prototype.showScreenPopup = function (ViewModelClassToShow, aParameters)
		{
			if (ViewModelClassToShow)
			{
				this.buildViewModel(ViewModelClassToShow);

				if (ViewModelClassToShow.__vm && ViewModelClassToShow.__dom)
				{
					ViewModelClassToShow.__vm.modalVisibility(true);
					Utils.delegateRun(ViewModelClassToShow.__vm, 'onShow', aParameters || []);
					if (ViewModelClassToShow.__vm.onShowTrigger)
					{
						ViewModelClassToShow.__vm.onShowTrigger(!ViewModelClassToShow.__vm.onShowTrigger());
					}

					_.each(ViewModelClassToShow.__names, function (sName) {
						Plugins.runHook('view-model-on-show', [sName, ViewModelClassToShow.__vm, aParameters || []]);
					});
				}
			}
		};

		/**
		 * @param {Function} ViewModelClassToShow
		 * @return {boolean}
		 */
		Knoin.prototype.isPopupVisible = function (ViewModelClassToShow)
		{
			return ViewModelClassToShow && ViewModelClassToShow.__vm ? ViewModelClassToShow.__vm.modalVisibility() : false;
		};

		/**
		 * @param {string} sScreenName
		 * @param {string} sSubPart
		 */
		Knoin.prototype.screenOnRoute = function (sScreenName, sSubPart)
		{
			var
				self = this,
				oScreen = null,
				oCross = null
			;

			if ('' === Utils.pString(sScreenName))
			{
				sScreenName = this.sDefaultScreenName;
			}

			if ('' !== sScreenName)
			{
				oScreen = this.screen(sScreenName);
				if (!oScreen)
				{
					oScreen = this.screen(this.sDefaultScreenName);
					if (oScreen)
					{
						sSubPart = sScreenName + '/' + sSubPart;
						sScreenName = this.sDefaultScreenName;
					}
				}

				if (oScreen && oScreen.__started)
				{
					if (!oScreen.__builded)
					{
						oScreen.__builded = true;

						if (Utils.isNonEmptyArray(oScreen.viewModels()))
						{
							_.each(oScreen.viewModels(), function (ViewModelClass) {
								this.buildViewModel(ViewModelClass, oScreen);
							}, this);
						}

						Utils.delegateRun(oScreen, 'onBuild');
					}

					_.defer(function () {

						// hide screen
						if (self.oCurrentScreen)
						{
							Utils.delegateRun(self.oCurrentScreen, 'onHide');

							if (self.oCurrentScreen.onHideTrigger)
							{
								self.oCurrentScreen.onHideTrigger(!self.oCurrentScreen.onHideTrigger());
							}

							if (Utils.isNonEmptyArray(self.oCurrentScreen.viewModels()))
							{
								_.each(self.oCurrentScreen.viewModels(), function (ViewModelClass) {

									if (ViewModelClass.__vm && ViewModelClass.__dom &&
										'Popups' !== ViewModelClass.__vm.viewModelPosition())
									{
										ViewModelClass.__dom.hide();
										ViewModelClass.__vm.viewModelVisibility(false);
										Utils.delegateRun(ViewModelClass.__vm, 'onHide');

										if (ViewModelClass.__vm.onHideTrigger)
										{
											ViewModelClass.__vm.onHideTrigger(!ViewModelClass.__vm.onHideTrigger());
										}
									}

								});
							}
						}
						// --

						self.oCurrentScreen = oScreen;

						// show screen
						if (self.oCurrentScreen)
						{
							Utils.delegateRun(self.oCurrentScreen, 'onShow');
							if (self.oCurrentScreen.onShowTrigger)
							{
								self.oCurrentScreen.onShowTrigger(!self.oCurrentScreen.onShowTrigger());
							}

							Plugins.runHook('screen-on-show', [self.oCurrentScreen.screenName(), self.oCurrentScreen]);

							if (Utils.isNonEmptyArray(self.oCurrentScreen.viewModels()))
							{
								_.each(self.oCurrentScreen.viewModels(), function (ViewModelClass) {

									if (ViewModelClass.__vm && ViewModelClass.__dom &&
										'Popups' !== ViewModelClass.__vm.viewModelPosition())
									{
										ViewModelClass.__dom.show();
										ViewModelClass.__vm.viewModelVisibility(true);

										Utils.delegateRun(ViewModelClass.__vm, 'onShow');
										if (ViewModelClass.__vm.onShowTrigger)
										{
											ViewModelClass.__vm.onShowTrigger(!ViewModelClass.__vm.onShowTrigger());
										}

										Utils.delegateRun(ViewModelClass.__vm, 'onFocus', [], 200);

										_.each(ViewModelClass.__names, function (sName) {
											Plugins.runHook('view-model-on-show', [sName, ViewModelClass.__vm]);
										});
									}

								}, self);
							}
						}
						// --

						oCross = oScreen.__cross ? oScreen.__cross() : null;
						if (oCross)
						{
							oCross.parse(sSubPart);
						}
					});
				}
			}
		};

		/**
		 * @param {Array} aScreensClasses
		 */
		Knoin.prototype.startScreens = function (aScreensClasses)
		{
			$('#rl-content').css({
				'visibility': 'hidden'
			});

			_.each(aScreensClasses, function (CScreen) {

					var
						oScreen = new CScreen(),
						sScreenName = oScreen ? oScreen.screenName() : ''
					;

					if (oScreen && '' !== sScreenName)
					{
						if ('' === this.sDefaultScreenName)
						{
							this.sDefaultScreenName = sScreenName;
						}

						this.oScreens[sScreenName] = oScreen;
					}

				}, this);


			_.each(this.oScreens, function (oScreen) {
				if (oScreen && !oScreen.__started && oScreen.__start)
				{
					oScreen.__started = true;
					oScreen.__start();

					Plugins.runHook('screen-pre-start', [oScreen.screenName(), oScreen]);
					Utils.delegateRun(oScreen, 'onStart');
					Plugins.runHook('screen-post-start', [oScreen.screenName(), oScreen]);
				}
			}, this);

			var oCross = crossroads.create();
			oCross.addRoute(/^([a-zA-Z0-9\-]*)\/?(.*)$/, _.bind(this.screenOnRoute, this));

			hasher.initialized.add(oCross.parse, oCross);
			hasher.changed.add(oCross.parse, oCross);
			hasher.init();

			$('#rl-content').css({
				'visibility': 'visible'
			});

			_.delay(function () {
				Globals.$html.removeClass('rl-started-trigger').addClass('rl-started');
			}, 50);

			_.delay(function () {
				Globals.$html.addClass('rl-started-delay');
			}, 200);
		};

		/**
		 * @param {string} sHash
		 * @param {boolean=} bSilence = false
		 * @param {boolean=} bReplace = false
		 */
		Knoin.prototype.setHash = function (sHash, bSilence, bReplace)
		{
			sHash = '#' === sHash.substr(0, 1) ? sHash.substr(1) : sHash;
			sHash = '/' === sHash.substr(0, 1) ? sHash.substr(1) : sHash;

			bReplace = Utils.isUnd(bReplace) ? false : !!bReplace;

			if (Utils.isUnd(bSilence) ? false : !!bSilence)
			{
				hasher.changed.active = false;
				hasher[bReplace ? 'replaceHash' : 'setHash'](sHash);
				hasher.changed.active = true;
			}
			else
			{
				hasher.changed.active = true;
				hasher[bReplace ? 'replaceHash' : 'setHash'](sHash);
				hasher.setHash(sHash);
			}
		};

		module.exports = new Knoin();

	}());

/***/ },
/* 6 */
/*!*************************!*\
  !*** ./dev/App/User.js ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			moment = __webpack_require__(/*! moment */ 36),
			SimplePace = __webpack_require__(/*! SimplePace */ 75),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Plugins = __webpack_require__(/*! Common/Plugins */ 23),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 12),
			Events = __webpack_require__(/*! Common/Events */ 28),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),

			SocialStore = __webpack_require__(/*! Stores/Social */ 35),
			AppStore = __webpack_require__(/*! Stores/User/App */ 30),
			SettingsStore = __webpack_require__(/*! Stores/User/Settings */ 26),
			AccountStore = __webpack_require__(/*! Stores/User/Account */ 22),
			IdentityStore = __webpack_require__(/*! Stores/User/Identity */ 43),
			FolderStore = __webpack_require__(/*! Stores/User/Folder */ 32),
			PgpStore = __webpack_require__(/*! Stores/User/Pgp */ 20),

			Local = __webpack_require__(/*! Storage/Client */ 60),
			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Data = __webpack_require__(/*! Storage/User/Data */ 15),
			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),
			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),

			EmailModel = __webpack_require__(/*! Model/Email */ 25),
			FolderModel = __webpack_require__(/*! Model/Folder */ 100),
			MessageModel = __webpack_require__(/*! Model/Message */ 81),
			AccountModel = __webpack_require__(/*! Model/Account */ 95),
			IdentityModel = __webpack_require__(/*! Model/Identity */ 101),
			OpenPgpKeyModel = __webpack_require__(/*! Model/OpenPgpKey */ 102),

			AbstractApp = __webpack_require__(/*! App/Abstract */ 46)
		;

		/**
		 * @constructor
		 * @extends AbstractApp
		 */
		function AppUser()
		{
			AbstractApp.call(this, Remote);

			this.oMoveCache = {};

			this.quotaDebounce = _.debounce(this.quota, 1000 * 30);
			this.moveOrDeleteResponseHelper = _.bind(this.moveOrDeleteResponseHelper, this);

			this.messagesMoveTrigger = _.debounce(this.messagesMoveTrigger, 500);

			window.setInterval(function () {
				Events.pub('interval.30s');
			}, 30000);

			window.setInterval(function () {
				Events.pub('interval.1m');
			}, 60000);

			window.setInterval(function () {
				Events.pub('interval.2m');
			}, 60000 * 2);

			window.setInterval(function () {
				Events.pub('interval.3m');
			}, 60000 * 3);

			window.setInterval(function () {
				Events.pub('interval.5m');
			}, 60000 * 5);

			window.setInterval(function () {
				Events.pub('interval.10m');
			}, 60000 * 10);

			window.setInterval(function () {
				Events.pub('interval.15m');
			}, 60000 * 15);

			window.setInterval(function () {
				Events.pub('interval.20m');
			}, 60000 * 15);

			window.setTimeout(function () {
				window.setInterval(function () {
					Events.pub('interval.5m-after5m');
				}, 60000 * 5);
			}, 60000 * 5);

			window.setTimeout(function () {
				window.setInterval(function () {
					Events.pub('interval.10m-after5m');
				}, 60000 * 10);
			}, 60000 * 5);

			$.wakeUp(function () {

				Remote.jsVersion(function (sResult, oData) {
					if (Enums.StorageResultType.Success === sResult && oData && !oData.Result)
					{
						if (window.parent && !!Settings.settingsGet('InIframe'))
						{
							window.parent.location.reload();
						}
						else
						{
							window.location.reload();
						}
					}
				}, Settings.settingsGet('Version'));

			}, {}, 60 * 60 * 1000);

			if (Settings.settingsGet('UserBackgroundHash'))
			{
				_.delay(function () {
					$('#rl-bg').attr('style', 'background-image: none !important;')
							.backstretch(Links.publicLink(Settings.settingsGet('UserBackgroundHash')), {
						'fade': Globals.bAnimationSupported ? 1000 : 0
					}).removeAttr('style');
				}, 2000);
			}

			this.socialUsers = _.bind(this.socialUsers, this);
		}

		_.extend(AppUser.prototype, AbstractApp.prototype);

		AppUser.prototype.remote = function ()
		{
			return Remote;
		};

		AppUser.prototype.reloadFlagsCurrentMessageListAndMessageFromCache = function ()
		{
			_.each(Data.messageList(), function (oMessage) {
				Cache.initMessageFlagsFromCache(oMessage);
			});

			Cache.initMessageFlagsFromCache(Data.message());
		};

		/**
		 * @param {boolean=} bDropPagePosition = false
		 * @param {boolean=} bDropCurrenFolderCache = false
		 */
		AppUser.prototype.reloadMessageList = function (bDropPagePosition, bDropCurrenFolderCache)
		{
			var
				self = this,
				iOffset = (Data.messageListPage() - 1) * SettingsStore.messagesPerPage()
			;

			if (Utils.isUnd(bDropCurrenFolderCache) ? false : !!bDropCurrenFolderCache)
			{
				Cache.setFolderHash(Data.currentFolderFullNameRaw(), '');
			}

			if (Utils.isUnd(bDropPagePosition) ? false : !!bDropPagePosition)
			{
				Data.messageListPage(1);
				iOffset = 0;
			}

			Data.messageListLoading(true);
			Remote.messageList(function (sResult, oData, bCached) {

				if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
				{
					Data.messageListError('');
					Data.messageListLoading(false);
					self.setMessageList(oData, bCached);
				}
				else if (Enums.StorageResultType.Unload === sResult)
				{
					Data.messageListError('');
					Data.messageListLoading(false);
				}
				else if (Enums.StorageResultType.Abort !== sResult)
				{
					Data.messageList([]);
					Data.messageListLoading(false);
					Data.messageListError(oData && oData.ErrorCode ?
						Translator.getNotification(oData.ErrorCode) : Translator.i18n('NOTIFICATIONS/CANT_GET_MESSAGE_LIST')
					);
				}

			}, Data.currentFolderFullNameRaw(), iOffset, SettingsStore.messagesPerPage(), Data.messageListSearch());
		};

		AppUser.prototype.recacheInboxMessageList = function ()
		{
			Remote.messageList(Utils.emptyFunction, Cache.getFolderInboxName(), 0, SettingsStore.messagesPerPage(), '', true);
		};

		AppUser.prototype.reloadMessageListHelper = function (bEmptyList)
		{
			this.reloadMessageList(bEmptyList);
		};

		/**
		 * @param {Function} fResultFunc
		 * @returns {boolean}
		 */
		AppUser.prototype.contactsSync = function (fResultFunc)
		{
			var oContacts = Data.contacts;
			if (oContacts.importing() || oContacts.syncing() || !Data.enableContactsSync() || !Data.allowContactsSync())
			{
				return false;
			}

			oContacts.syncing(true);

			Remote.contactsSync(function (sResult, oData) {

				oContacts.syncing(false);

				if (fResultFunc)
				{
					fResultFunc(sResult, oData);
				}
			});

			return true;
		};

		AppUser.prototype.messagesMoveTrigger = function ()
		{
			var
				self = this,
				sSpamFolder = FolderStore.spamFolder()
			;

			_.each(this.oMoveCache, function (oItem) {

				var
					bSpam = sSpamFolder === oItem['To'],
					bHam = !bSpam && sSpamFolder === oItem['From'] && Cache.getFolderInboxName() === oItem['To']
				;

				Remote.messagesMove(self.moveOrDeleteResponseHelper, oItem['From'], oItem['To'], oItem['Uid'],
					bSpam ? 'SPAM' : (bHam ? 'HAM' : ''));
			});

			this.oMoveCache = {};
		};

		AppUser.prototype.messagesMoveHelper = function (sFromFolderFullNameRaw, sToFolderFullNameRaw, aUidForMove)
		{
			var sH = '$$' + sFromFolderFullNameRaw + '$$' + sToFolderFullNameRaw + '$$';
			if (!this.oMoveCache[sH])
			{
				this.oMoveCache[sH] = {
					'From': sFromFolderFullNameRaw,
					'To': sToFolderFullNameRaw,
					'Uid': []
				};
			}

			this.oMoveCache[sH]['Uid'] = _.union(this.oMoveCache[sH]['Uid'], aUidForMove);
			this.messagesMoveTrigger();
		};

		AppUser.prototype.messagesCopyHelper = function (sFromFolderFullNameRaw, sToFolderFullNameRaw, aUidForCopy)
		{
			Remote.messagesCopy(
				this.moveOrDeleteResponseHelper,
				sFromFolderFullNameRaw,
				sToFolderFullNameRaw,
				aUidForCopy
			);
		};

		AppUser.prototype.messagesDeleteHelper = function (sFromFolderFullNameRaw, aUidForRemove)
		{
			Remote.messagesDelete(
				this.moveOrDeleteResponseHelper,
				sFromFolderFullNameRaw,
				aUidForRemove
			);
		};

		AppUser.prototype.moveOrDeleteResponseHelper = function (sResult, oData)
		{
			if (Enums.StorageResultType.Success === sResult && Data.currentFolder())
			{
				if (oData && Utils.isArray(oData.Result) && 2 === oData.Result.length)
				{
					Cache.setFolderHash(oData.Result[0], oData.Result[1]);
				}
				else
				{
					Cache.setFolderHash(Data.currentFolderFullNameRaw(), '');

					if (oData && -1 < Utils.inArray(oData.ErrorCode,
						[Enums.Notification.CantMoveMessage, Enums.Notification.CantCopyMessage]))
					{
						window.alert(Translator.getNotification(oData.ErrorCode));
					}
				}

				this.reloadMessageListHelper(0 === Data.messageList().length);
				this.quotaDebounce();
			}
		};

		/**
		 * @param {string} sFromFolderFullNameRaw
		 * @param {Array} aUidForRemove
		 */
		AppUser.prototype.deleteMessagesFromFolderWithoutCheck = function (sFromFolderFullNameRaw, aUidForRemove)
		{
			this.messagesDeleteHelper(sFromFolderFullNameRaw, aUidForRemove);
			Data.removeMessagesFromList(sFromFolderFullNameRaw, aUidForRemove);
		};

		/**
		 * @param {number} iDeleteType
		 * @param {string} sFromFolderFullNameRaw
		 * @param {Array} aUidForRemove
		 * @param {boolean=} bUseFolder = true
		 */
		AppUser.prototype.deleteMessagesFromFolder = function (iDeleteType, sFromFolderFullNameRaw, aUidForRemove, bUseFolder)
		{
			var
				self = this,
				oMoveFolder = null,
				nSetSystemFoldersNotification = null
			;

			switch (iDeleteType)
			{
				case Enums.FolderType.Spam:
					oMoveFolder = Cache.getFolderFromCacheList(FolderStore.spamFolder());
					nSetSystemFoldersNotification = Enums.SetSystemFoldersNotification.Spam;
					break;
				case Enums.FolderType.NotSpam:
					oMoveFolder = Cache.getFolderFromCacheList(Cache.getFolderInboxName());
					break;
				case Enums.FolderType.Trash:
					oMoveFolder = Cache.getFolderFromCacheList(FolderStore.trashFolder());
					nSetSystemFoldersNotification = Enums.SetSystemFoldersNotification.Trash;
					break;
				case Enums.FolderType.Archive:
					oMoveFolder = Cache.getFolderFromCacheList(FolderStore.archiveFolder());
					nSetSystemFoldersNotification = Enums.SetSystemFoldersNotification.Archive;
					break;
			}

			bUseFolder = Utils.isUnd(bUseFolder) ? true : !!bUseFolder;
			if (bUseFolder)
			{
				if ((Enums.FolderType.Spam === iDeleteType && Consts.Values.UnuseOptionValue === FolderStore.spamFolder()) ||
					(Enums.FolderType.Trash === iDeleteType && Consts.Values.UnuseOptionValue === FolderStore.trashFolder()) ||
					(Enums.FolderType.Archive === iDeleteType && Consts.Values.UnuseOptionValue === FolderStore.archiveFolder()))
				{
					bUseFolder = false;
				}
			}

			if (!oMoveFolder && bUseFolder)
			{
				kn.showScreenPopup(__webpack_require__(/*! View/Popup/FolderSystem */ 44), [nSetSystemFoldersNotification]);
			}
			else if (!bUseFolder || (Enums.FolderType.Trash === iDeleteType &&
				(sFromFolderFullNameRaw === FolderStore.spamFolder() || sFromFolderFullNameRaw === FolderStore.trashFolder())))
			{
				kn.showScreenPopup(__webpack_require__(/*! View/Popup/Ask */ 40), [Translator.i18n('POPUPS_ASK/DESC_WANT_DELETE_MESSAGES'), function () {

					self.messagesDeleteHelper(sFromFolderFullNameRaw, aUidForRemove);
					Data.removeMessagesFromList(sFromFolderFullNameRaw, aUidForRemove);

				}]);
			}
			else if (oMoveFolder)
			{
				this.messagesMoveHelper(sFromFolderFullNameRaw, oMoveFolder.fullNameRaw, aUidForRemove);
				Data.removeMessagesFromList(sFromFolderFullNameRaw, aUidForRemove, oMoveFolder.fullNameRaw);
			}
		};

		/**
		 * @param {string} sFromFolderFullNameRaw
		 * @param {Array} aUidForMove
		 * @param {string} sToFolderFullNameRaw
		 * @param {boolean=} bCopy = false
		 */
		AppUser.prototype.moveMessagesToFolder = function (sFromFolderFullNameRaw, aUidForMove, sToFolderFullNameRaw, bCopy)
		{
			if (sFromFolderFullNameRaw !== sToFolderFullNameRaw && Utils.isArray(aUidForMove) && 0 < aUidForMove.length)
			{
				var
					oFromFolder = Cache.getFolderFromCacheList(sFromFolderFullNameRaw),
					oToFolder = Cache.getFolderFromCacheList(sToFolderFullNameRaw)
				;

				if (oFromFolder && oToFolder)
				{
					if (Utils.isUnd(bCopy) ? false : !!bCopy)
					{
						this.messagesCopyHelper(oFromFolder.fullNameRaw, oToFolder.fullNameRaw, aUidForMove);
					}
					else
					{
						this.messagesMoveHelper(oFromFolder.fullNameRaw, oToFolder.fullNameRaw, aUidForMove);
					}

					Data.removeMessagesFromList(oFromFolder.fullNameRaw, aUidForMove, oToFolder.fullNameRaw, bCopy);
					return true;
				}
			}

			return false;
		};

		/**
		 * @param {Function=} fCallback
		 */
		AppUser.prototype.folders = function (fCallback)
		{
			Data.foldersLoading(true);

			Remote.folders(_.bind(function (sResult, oData) {

				var bResult = false;
				Data.foldersLoading(false);

				if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
				{
					bResult = true;
					this.setFolders(oData);
				}

				if (fCallback)
				{
					fCallback(bResult);
				}

			}, this));
		};

		AppUser.prototype.reloadOpenPgpKeys = function ()
		{
			if (PgpStore.capaOpenPGP())
			{
				var
					aKeys = [],
					oEmail = new EmailModel(),
					oOpenpgpKeyring = PgpStore.openpgpKeyring,
					oOpenpgpKeys = oOpenpgpKeyring ? oOpenpgpKeyring.getAllKeys() : []
				;

				_.each(oOpenpgpKeys, function (oItem, iIndex) {
					if (oItem && oItem.primaryKey)
					{
						var

							oPrimaryUser = oItem.getPrimaryUser(),
							sUser = (oPrimaryUser && oPrimaryUser.user) ? oPrimaryUser.user.userId.userid
								: (oItem.users && oItem.users[0] ? oItem.users[0].userId.userid : '')
						;

						oEmail.clear();
						oEmail.mailsoParse(sUser);

						if (oEmail.validate())
						{
							aKeys.push(new OpenPgpKeyModel(
								iIndex,
								oItem.primaryKey.getFingerprint(),
								oItem.primaryKey.getKeyId().toHex().toLowerCase(),
								sUser,
								oEmail.email,
								oItem.isPrivate(),
								oItem.armor())
							);
						}
					}
				});

				Utils.delegateRunOnDestroy(PgpStore.openpgpkeys());
				PgpStore.openpgpkeys(aKeys);
			}
		};

		AppUser.prototype.accountsCounts = function ()
		{
			return false;
	//		AccountStore.accounts.loading(true);
	//
	//		Remote.accountsCounts(function (sResult, oData) {
	//
	//			AccountStore.accounts.loading(false);
	//
	//			if (Enums.StorageResultType.Success === sResult && oData.Result && oData.Result['Counts'])
	//			{
	//				var
	//					sEmail = AccountStore.email(),
	//					aAcounts = AccountStore.accounts()
	//				;
	//
	//				_.each(oData.Result['Counts'], function (oItem) {
	//
	//					var oAccount = _.find(aAcounts, function (oAccount) {
	//						return oAccount && oItem[0] === oAccount.email && sEmail !== oAccount.email;
	//					});
	//
	//					if (oAccount)
	//					{
	//						oAccount.count(Utils.pInt(oItem[1]));
	//					}
	//				});
	//			}
	//		});
		};

		AppUser.prototype.accountsAndIdentities = function (bBoot)
		{
			var self = this;

			AccountStore.accounts.loading(true);
			IdentityStore.identities.loading(true);

			Remote.accountsAndIdentities(function (sResult, oData) {

				AccountStore.accounts.loading(false);
				IdentityStore.identities.loading(false);

				if (Enums.StorageResultType.Success === sResult && oData.Result)
				{
					var
						aCounts = {},
						sParentEmail = Settings.settingsGet('ParentEmail'),
						sAccountEmail = AccountStore.email()
					;

					sParentEmail = '' === sParentEmail ? sAccountEmail : sParentEmail;

					if (Utils.isArray(oData.Result['Accounts']))
					{
						_.each(AccountStore.accounts(), function (oAccount) {
							aCounts[oAccount.email] = oAccount.count();
						});

						Utils.delegateRunOnDestroy(AccountStore.accounts());

						AccountStore.accounts(_.map(oData.Result['Accounts'], function (sValue) {
							return new AccountModel(sValue, sValue !== sParentEmail, aCounts[sValue] || 0);
						}));
					}

					if (Utils.isUnd(bBoot) ? false : !!bBoot)
					{
						_.delay(function () {
							self.accountsCounts();
						}, 1000 * 5);

						Events.sub('interval.10m-after5m', function () {
							self.accountsCounts();
						});
					}

					if (Utils.isArray(oData.Result['Identities']))
					{
						Utils.delegateRunOnDestroy(IdentityStore.identities());

						IdentityStore.identities(_.map(oData.Result['Identities'], function (oIdentityData) {

							var
								sId = Utils.pString(oIdentityData['Id']),
								sEmail = Utils.pString(oIdentityData['Email']),
								oIdentity = new IdentityModel(sId, sEmail, sId !== sAccountEmail)
							;

							oIdentity.name(Utils.pString(oIdentityData['Name']));
							oIdentity.replyTo(Utils.pString(oIdentityData['ReplyTo']));
							oIdentity.bcc(Utils.pString(oIdentityData['Bcc']));

							return oIdentity;
						}));
					}
				}
			});
		};

		AppUser.prototype.quota = function ()
		{
			Remote.quota(function (sResult, oData) {
				if (Enums.StorageResultType.Success === sResult &&	oData && oData.Result &&
					Utils.isArray(oData.Result) && 1 < oData.Result.length &&
					Utils.isPosNumeric(oData.Result[0], true) && Utils.isPosNumeric(oData.Result[1], true))
				{
					__webpack_require__(/*! Stores/User/Quota */ 84).populateData(
						Utils.pInt(oData.Result[1]), Utils.pInt(oData.Result[0]));
				}
			});
		};

		/**
		 * @param {string} sFolder
		 * @param {Array=} aList = []
		 */
		AppUser.prototype.folderInformation = function (sFolder, aList)
		{
			if ('' !== Utils.trim(sFolder))
			{
				var self = this;
				Remote.folderInformation(function (sResult, oData) {
					if (Enums.StorageResultType.Success === sResult)
					{
						if (oData && oData.Result && oData.Result.Hash && oData.Result.Folder)
						{
							var
								iUtc = moment().unix(),
								sHash = Cache.getFolderHash(oData.Result.Folder),
								oFolder = Cache.getFolderFromCacheList(oData.Result.Folder),
								bCheck = false,
								sUid = '',
								aList = [],
								bUnreadCountChange = false,
								oFlags = null
							;

							if (oFolder)
							{
								oFolder.interval = iUtc;

								if (oData.Result.Hash)
								{
									Cache.setFolderHash(oData.Result.Folder, oData.Result.Hash);
								}

								if (Utils.isNormal(oData.Result.MessageCount))
								{
									oFolder.messageCountAll(oData.Result.MessageCount);
								}

								if (Utils.isNormal(oData.Result.MessageUnseenCount))
								{
									if (Utils.pInt(oFolder.messageCountUnread()) !== Utils.pInt(oData.Result.MessageUnseenCount))
									{
										bUnreadCountChange = true;
									}

									oFolder.messageCountUnread(oData.Result.MessageUnseenCount);
								}

								if (bUnreadCountChange)
								{
									Cache.clearMessageFlagsFromCacheByFolder(oFolder.fullNameRaw);
								}

								if (oData.Result.Flags)
								{
									for (sUid in oData.Result.Flags)
									{
										if (oData.Result.Flags.hasOwnProperty(sUid))
										{
											bCheck = true;
											oFlags = oData.Result.Flags[sUid];
											Cache.storeMessageFlagsToCacheByFolderAndUid(oFolder.fullNameRaw, sUid.toString(), [
												!oFlags['IsSeen'], !!oFlags['IsFlagged'], !!oFlags['IsAnswered'], !!oFlags['IsForwarded'], !!oFlags['IsReadReceipt']
											]);
										}
									}

									if (bCheck)
									{
										self.reloadFlagsCurrentMessageListAndMessageFromCache();
									}
								}

								Data.initUidNextAndNewMessages(oFolder.fullNameRaw, oData.Result.UidNext, oData.Result.NewMessages);

								if (oData.Result.Hash !== sHash || '' === sHash)
								{
									if (oFolder.fullNameRaw === Data.currentFolderFullNameRaw())
									{
										self.reloadMessageList();
									}
									else if (Cache.getFolderInboxName() === oFolder.fullNameRaw)
									{
										self.recacheInboxMessageList();
									}
								}
								else if (bUnreadCountChange)
								{
									if (oFolder.fullNameRaw === Data.currentFolderFullNameRaw())
									{
										aList = Data.messageList();
										if (Utils.isNonEmptyArray(aList))
										{
											self.folderInformation(oFolder.fullNameRaw, aList);
										}
									}
								}
							}
						}
					}
				}, sFolder, aList);
			}
		};

		/**
		 * @param {boolean=} bBoot = false
		 */
		AppUser.prototype.folderInformationMultiply = function (bBoot)
		{
			bBoot = Utils.isUnd(bBoot) ? false : !!bBoot;

			var
				self = this,
				iUtc = moment().unix(),
				aFolders = Data.getNextFolderNames(bBoot)
			;

			if (Utils.isNonEmptyArray(aFolders))
			{
				Remote.folderInformationMultiply(function (sResult, oData) {
					if (Enums.StorageResultType.Success === sResult)
					{
						if (oData && oData.Result && oData.Result.List && Utils.isNonEmptyArray(oData.Result.List))
						{
							_.each(oData.Result.List, function (oItem) {

								var
									aList = [],
									sHash = Cache.getFolderHash(oItem.Folder),
									oFolder = Cache.getFolderFromCacheList(oItem.Folder),
									bUnreadCountChange = false
								;

								if (oFolder)
								{
									oFolder.interval = iUtc;

									if (oItem.Hash)
									{
										Cache.setFolderHash(oItem.Folder, oItem.Hash);
									}

									if (Utils.isNormal(oItem.MessageCount))
									{
										oFolder.messageCountAll(oItem.MessageCount);
									}

									if (Utils.isNormal(oItem.MessageUnseenCount))
									{
										if (Utils.pInt(oFolder.messageCountUnread()) !== Utils.pInt(oItem.MessageUnseenCount))
										{
											bUnreadCountChange = true;
										}

										oFolder.messageCountUnread(oItem.MessageUnseenCount);
									}

									if (bUnreadCountChange)
									{
										Cache.clearMessageFlagsFromCacheByFolder(oFolder.fullNameRaw);
									}

									if (oItem.Hash !== sHash || '' === sHash)
									{
										if (oFolder.fullNameRaw === Data.currentFolderFullNameRaw())
										{
											self.reloadMessageList();
										}
									}
									else if (bUnreadCountChange)
									{
										if (oFolder.fullNameRaw === Data.currentFolderFullNameRaw())
										{
											aList = Data.messageList();
											if (Utils.isNonEmptyArray(aList))
											{
												self.folderInformation(oFolder.fullNameRaw, aList);
											}
										}
									}
								}
							});

							if (bBoot)
							{	_.delay(function () {
									self.folderInformationMultiply(true);
								}, 2000);
							}
						}
					}
				}, aFolders);
			}
		};

		AppUser.prototype.setMessageSeen = function (oMessage)
		{
			if (oMessage.unseen())
			{
				oMessage.unseen(false);

				var oFolder = Cache.getFolderFromCacheList(oMessage.folderFullNameRaw);
				if (oFolder)
				{
					oFolder.messageCountUnread(0 <= oFolder.messageCountUnread() - 1 ?
						oFolder.messageCountUnread() - 1 : 0);
				}

				Cache.storeMessageFlagsToCache(oMessage);
				this.reloadFlagsCurrentMessageListAndMessageFromCache();
			}

			Remote.messageSetSeen(Utils.emptyFunction, oMessage.folderFullNameRaw, [oMessage.uid], true);
		};

		AppUser.prototype.googleConnect = function ()
		{
			window.open(Links.socialGoogle(), 'Google', 'left=200,top=100,width=650,height=600,menubar=no,status=no,resizable=yes,scrollbars=yes');
		};

		AppUser.prototype.twitterConnect = function ()
		{
			window.open(Links.socialTwitter(), 'Twitter', 'left=200,top=100,width=650,height=350,menubar=no,status=no,resizable=yes,scrollbars=yes');
		};

		AppUser.prototype.facebookConnect = function ()
		{
			window.open(Links.socialFacebook(), 'Facebook', 'left=200,top=100,width=650,height=335,menubar=no,status=no,resizable=yes,scrollbars=yes');
		};

		/**
		 * @param {boolean=} bFireAllActions
		 */
		AppUser.prototype.socialUsers = function (bFireAllActions)
		{
			if (true === bFireAllActions)
			{
				SocialStore.google.loading(true);
				SocialStore.facebook.loading(true);
				SocialStore.twitter.loading(true);
			}

			Remote.socialUsers(function (sResult, oData) {

				if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
				{
					SocialStore.google.userName(oData.Result['Google'] || '');
					SocialStore.facebook.userName(oData.Result['Facebook'] || '');
					SocialStore.twitter.userName(oData.Result['Twitter'] || '');
				}
				else
				{
					SocialStore.google.userName('');
					SocialStore.facebook.userName('');
					SocialStore.twitter.userName('');
				}

				SocialStore.google.loading(false);
				SocialStore.facebook.loading(false);
				SocialStore.twitter.loading(false);
			});
		};

		AppUser.prototype.googleDisconnect = function ()
		{
			SocialStore.google.loading(true);
			Remote.googleDisconnect(this.socialUsers);
		};

		AppUser.prototype.facebookDisconnect = function ()
		{
			SocialStore.facebook.loading(true);
			Remote.facebookDisconnect(this.socialUsers);
		};

		AppUser.prototype.twitterDisconnect = function ()
		{
			SocialStore.twitter.loading(true);
			Remote.twitterDisconnect(this.socialUsers);
		};

		/**
		 * @param {string} sQuery
		 * @param {Function} fCallback
		 */
		AppUser.prototype.getAutocomplete = function (sQuery, fCallback)
		{
			var
				aData = []
			;

			Remote.suggestions(function (sResult, oData) {
				if (Enums.StorageResultType.Success === sResult && oData && Utils.isArray(oData.Result))
				{
					aData = _.map(oData.Result, function (aItem) {
						return aItem && aItem[0] ? new EmailModel(aItem[0], aItem[1]) : null;
					});

					fCallback(_.compact(aData));
				}
				else if (Enums.StorageResultType.Abort !== sResult)
				{
					fCallback([]);
				}

			}, sQuery);
		};

		AppUser.prototype.setMessageList = function (oData, bCached)
		{
			if (oData && oData.Result && 'Collection/MessageCollection' === oData.Result['@Object'] &&
				oData.Result['@Collection'] && Utils.isArray(oData.Result['@Collection']))
			{
				var
					mLastCollapsedThreadUids = null,
					iIndex = 0,
					iLen = 0,
					iCount = 0,
					iOffset = 0,
					aList = [],
					iUtc = moment().unix(),
					aStaticList = Data.staticMessageList,
					oJsonMessage = null,
					oMessage = null,
					oFolder = null,
					iNewCount = 0,
					bUnreadCountChange = false
				;

				iCount = Utils.pInt(oData.Result.MessageResultCount);
				iOffset = Utils.pInt(oData.Result.Offset);

				if (Utils.isNonEmptyArray(oData.Result.LastCollapsedThreadUids))
				{
					mLastCollapsedThreadUids = oData.Result.LastCollapsedThreadUids;
				}

				oFolder = Cache.getFolderFromCacheList(
					Utils.isNormal(oData.Result.Folder) ? oData.Result.Folder : '');

				if (oFolder && !bCached)
				{
					oFolder.interval = iUtc;

					Cache.setFolderHash(oData.Result.Folder, oData.Result.FolderHash);

					if (Utils.isNormal(oData.Result.MessageCount))
					{
						oFolder.messageCountAll(oData.Result.MessageCount);
					}

					if (Utils.isNormal(oData.Result.MessageUnseenCount))
					{
						if (Utils.pInt(oFolder.messageCountUnread()) !== Utils.pInt(oData.Result.MessageUnseenCount))
						{
							bUnreadCountChange = true;
						}

						oFolder.messageCountUnread(oData.Result.MessageUnseenCount);
					}

					Data.initUidNextAndNewMessages(oFolder.fullNameRaw, oData.Result.UidNext, oData.Result.NewMessages);
				}

				if (bUnreadCountChange && oFolder)
				{
					Cache.clearMessageFlagsFromCacheByFolder(oFolder.fullNameRaw);
				}

				for (iIndex = 0, iLen = oData.Result['@Collection'].length; iIndex < iLen; iIndex++)
				{
					oJsonMessage = oData.Result['@Collection'][iIndex];
					if (oJsonMessage && 'Object/Message' === oJsonMessage['@Object'])
					{
						oMessage = aStaticList[iIndex];
						if (!oMessage || !oMessage.initByJson(oJsonMessage))
						{
							oMessage = MessageModel.newInstanceFromJson(oJsonMessage);
						}

						if (oMessage)
						{
							if (Cache.hasNewMessageAndRemoveFromCache(oMessage.folderFullNameRaw, oMessage.uid) && 5 >= iNewCount)
							{
								iNewCount++;
								oMessage.newForAnimation(true);
							}

							oMessage.deleted(false);

							if (bCached)
							{
								Cache.initMessageFlagsFromCache(oMessage);
							}
							else
							{
								Cache.storeMessageFlagsToCache(oMessage);
							}

							oMessage.lastInCollapsedThread(mLastCollapsedThreadUids && -1 < Utils.inArray(Utils.pInt(oMessage.uid), mLastCollapsedThreadUids) ? true : false);

							aList.push(oMessage);
						}
					}
				}

				Data.messageListCount(iCount);
				Data.messageListSearch(Utils.isNormal(oData.Result.Search) ? oData.Result.Search : '');
				Data.messageListPage(window.Math.ceil((iOffset / SettingsStore.messagesPerPage()) + 1));
				Data.messageListEndFolder(Utils.isNormal(oData.Result.Folder) ? oData.Result.Folder : '');
				Data.messageListEndSearch(Utils.isNormal(oData.Result.Search) ? oData.Result.Search : '');
				Data.messageListEndPage(Data.messageListPage());

				Data.messageList(aList);
				Data.messageListIsNotCompleted(false);

				if (aStaticList.length < aList.length)
				{
					Data.staticMessageList = aList;
				}

				Cache.clearNewMessageCache();

				if (oFolder && (bCached || bUnreadCountChange || SettingsStore.useThreads()))
				{
					this.folderInformation(oFolder.fullNameRaw, aList);
				}
			}
			else
			{
				Data.messageListCount(0);
				Data.messageList([]);
				Data.messageListError(Translator.getNotification(
					oData && oData.ErrorCode ? oData.ErrorCode : Enums.Notification.CantGetMessageList
				));
			}
		};

		/**
		 * @param {string} sNamespace
		 * @param {Array} aFolders
		 * @return {Array}
		 */
		AppUser.prototype.folderResponseParseRec = function (sNamespace, aFolders)
		{
			var
				self = this,
				iIndex = 0,
				iLen = 0,
				oFolder = null,
				oCacheFolder = null,
				sFolderFullNameRaw = '',
				aSubFolders = [],
				aList = []
			;

			for (iIndex = 0, iLen = aFolders.length; iIndex < iLen; iIndex++)
			{
				oFolder = aFolders[iIndex];
				if (oFolder)
				{
					sFolderFullNameRaw = oFolder.FullNameRaw;

					oCacheFolder = Cache.getFolderFromCacheList(sFolderFullNameRaw);
					if (!oCacheFolder)
					{
						oCacheFolder = FolderModel.newInstanceFromJson(oFolder);
						if (oCacheFolder)
						{
							Cache.setFolderToCacheList(sFolderFullNameRaw, oCacheFolder);
							Cache.setFolderFullNameRaw(oCacheFolder.fullNameHash, sFolderFullNameRaw, oCacheFolder);
						}
					}

					if (oCacheFolder)
					{
						oCacheFolder.collapsed(!self.isFolderExpanded(oCacheFolder.fullNameHash));

						if (oFolder.Extended)
						{
							if (oFolder.Extended.Hash)
							{
								Cache.setFolderHash(oCacheFolder.fullNameRaw, oFolder.Extended.Hash);
							}

							if (Utils.isNormal(oFolder.Extended.MessageCount))
							{
								oCacheFolder.messageCountAll(oFolder.Extended.MessageCount);
							}

							if (Utils.isNormal(oFolder.Extended.MessageUnseenCount))
							{
								oCacheFolder.messageCountUnread(oFolder.Extended.MessageUnseenCount);
							}
						}

						aSubFolders = oFolder['SubFolders'];
						if (aSubFolders && 'Collection/FolderCollection' === aSubFolders['@Object'] &&
							aSubFolders['@Collection'] && Utils.isArray(aSubFolders['@Collection']))
						{
							oCacheFolder.subFolders(
								this.folderResponseParseRec(sNamespace, aSubFolders['@Collection']));
						}

						aList.push(oCacheFolder);
					}
				}
			}

			return aList;
		};

		/**
		 * @param {*} oData
		 */
		AppUser.prototype.setFolders = function (oData)
		{
			var
				aList = [],
				bUpdate = false,
				fNormalizeFolder = function (sFolderFullNameRaw) {
					return ('' === sFolderFullNameRaw || Consts.Values.UnuseOptionValue === sFolderFullNameRaw ||
						null !== Cache.getFolderFromCacheList(sFolderFullNameRaw)) ? sFolderFullNameRaw : '';
				}
			;

			if (oData && oData.Result && 'Collection/FolderCollection' === oData.Result['@Object'] &&
				oData.Result['@Collection'] && Utils.isArray(oData.Result['@Collection']))
			{
				if (!Utils.isUnd(oData.Result.Namespace))
				{
					Data.namespace = oData.Result.Namespace;
				}

				AppStore.threadsAllowed(!!Settings.settingsGet('UseImapThread') &&
					oData.Result.IsThreadsSupported && true);

				aList = this.folderResponseParseRec(Data.namespace, oData.Result['@Collection']);
				Data.folderList(aList);

				if (oData.Result['SystemFolders'] && '' === '' +
					Settings.settingsGet('SentFolder') +
					Settings.settingsGet('DraftFolder') +
					Settings.settingsGet('SpamFolder') +
					Settings.settingsGet('TrashFolder') +
					Settings.settingsGet('ArchiveFolder') +
					Settings.settingsGet('NullFolder'))
				{
					// TODO Magic Numbers
					Settings.settingsSet('SentFolder', oData.Result['SystemFolders'][2] || null);
					Settings.settingsSet('DraftFolder', oData.Result['SystemFolders'][3] || null);
					Settings.settingsSet('SpamFolder', oData.Result['SystemFolders'][4] || null);
					Settings.settingsSet('TrashFolder', oData.Result['SystemFolders'][5] || null);
					Settings.settingsSet('ArchiveFolder', oData.Result['SystemFolders'][12] || null);

					bUpdate = true;
				}

				FolderStore.sentFolder(fNormalizeFolder(Settings.settingsGet('SentFolder')));
				FolderStore.draftFolder(fNormalizeFolder(Settings.settingsGet('DraftFolder')));
				FolderStore.spamFolder(fNormalizeFolder(Settings.settingsGet('SpamFolder')));
				FolderStore.trashFolder(fNormalizeFolder(Settings.settingsGet('TrashFolder')));
				FolderStore.archiveFolder(fNormalizeFolder(Settings.settingsGet('ArchiveFolder')));

				if (bUpdate)
				{
					Remote.saveSystemFolders(Utils.emptyFunction, {
						'SentFolder': FolderStore.sentFolder(),
						'DraftFolder': FolderStore.draftFolder(),
						'SpamFolder': FolderStore.spamFolder(),
						'TrashFolder': FolderStore.trashFolder(),
						'ArchiveFolder': FolderStore.archiveFolder(),
						'NullFolder': 'NullFolder'
					});
				}

				Local.set(Enums.ClientSideKeyName.FoldersLashHash, oData.Result.FoldersHash);
			}
		};

		/**
		 * @param {string} sFullNameHash
		 * @return {boolean}
		 */
		AppUser.prototype.isFolderExpanded = function (sFullNameHash)
		{
			var aExpandedList = Local.get(Enums.ClientSideKeyName.ExpandedFolders);
			return Utils.isArray(aExpandedList) && -1 !== _.indexOf(aExpandedList, sFullNameHash);
		};

		/**
		 * @param {string} sFullNameHash
		 * @param {boolean} bExpanded
		 */
		AppUser.prototype.setExpandedFolder = function (sFullNameHash, bExpanded)
		{
			var aExpandedList = Local.get(Enums.ClientSideKeyName.ExpandedFolders);
			if (!Utils.isArray(aExpandedList))
			{
				aExpandedList = [];
			}

			if (bExpanded)
			{
				aExpandedList.push(sFullNameHash);
				aExpandedList = _.uniq(aExpandedList);
			}
			else
			{
				aExpandedList = _.without(aExpandedList, sFullNameHash);
			}

			Local.set(Enums.ClientSideKeyName.ExpandedFolders, aExpandedList);
		};

		AppUser.prototype.initHorizontalLayoutResizer = function (sClientSideKeyName)
		{
			var
				iMinHeight = 200,
				iMaxHeight = 500,
				oTop = null,
				oBottom = null,

				fResizeFunction = function (oEvent, oObject) {
					if (oObject && oObject.size && oObject.size.height)
					{
						Local.set(sClientSideKeyName, oObject.size.height);

						fSetHeight(oObject.size.height);

						Utils.windowResize();
					}
				},

				oOptions = {
					'helper': 'ui-resizable-helper-h',
					'minHeight': iMinHeight,
					'maxHeight': iMaxHeight,
					'handles': 's',
					'stop': fResizeFunction
				},

				fSetHeight = function (iHeight) {
					if (iHeight)
					{
						if (oTop)
						{
							oTop.attr('style', 'height:' + iHeight + 'px');
						}

						if (oBottom)
						{
							oBottom.attr('style', 'top:' + (55 /* top toolbar */ + iHeight) + 'px');
						}
					}
				},

				fDisable = function (bDisable) {
					if (bDisable)
					{
						if (oTop && oTop.hasClass('ui-resizable'))
						{
							oTop
								.resizable('destroy')
								.removeAttr('style')
							;
						}

						if (oBottom)
						{
							oBottom.removeAttr('style');
						}
					}
					else if (Globals.$html.hasClass('rl-bottom-preview-pane'))
					{
						oTop = $('.b-message-list-wrapper');
						oBottom = $('.b-message-view-wrapper');

						if (!oTop.hasClass('ui-resizable'))
						{
							oTop.resizable(oOptions);
						}

						var iHeight = Utils.pInt(Local.get(sClientSideKeyName)) || 300;
						fSetHeight(iHeight > iMinHeight ? iHeight : iMinHeight);
					}
				}
			;

			fDisable(false);

			Events.sub('layout', function (sLayout) {
				fDisable(Enums.Layout.BottomPreview !== sLayout);
			});
		};

		AppUser.prototype.initVerticalLayoutResizer = function (sClientSideKeyName)
		{
			var
				iDisabledWidth = 60,
				iMinWidth = 155,
				oLeft = $('#rl-left'),
				oRight = $('#rl-right'),

				mLeftWidth = Local.get(sClientSideKeyName) || null,

				fSetWidth = function (iWidth) {
					if (iWidth)
					{
						oLeft.css({
							'width': '' + iWidth + 'px'
						});

						oRight.css({
							'left': '' + iWidth + 'px'
						});
					}
				},

				fDisable = function (bDisable) {
					if (bDisable)
					{
						oLeft.resizable('disable');
						fSetWidth(iDisabledWidth);
					}
					else
					{
						oLeft.resizable('enable');
						var iWidth = Utils.pInt(Local.get(sClientSideKeyName)) || iMinWidth;
						fSetWidth(iWidth > iMinWidth ? iWidth : iMinWidth);
					}
				},

				fResizeFunction = function (oEvent, oObject) {
					if (oObject && oObject.size && oObject.size.width)
					{
						Local.set(sClientSideKeyName, oObject.size.width);

						oRight.css({
							'left': '' + oObject.size.width + 'px'
						});
					}
				}
			;

			if (null !== mLeftWidth)
			{
				fSetWidth(mLeftWidth > iMinWidth ? mLeftWidth : iMinWidth);
			}

			oLeft.resizable({
				'helper': 'ui-resizable-helper-w',
				'minWidth': iMinWidth,
				'maxWidth': 350,
				'handles': 'e',
				'stop': fResizeFunction
			});

			Events.sub('left-panel.off', function () {
				fDisable(true);
			});

			Events.sub('left-panel.on', function () {
				fDisable(false);
			});
		};

		AppUser.prototype.bootstartLoginScreen = function ()
		{
			Globals.$html.removeClass('rl-user-auth').addClass('rl-user-no-auth');

			var sCustomLoginLink = Utils.pString(Settings.settingsGet('CustomLoginLink'));
			if (!sCustomLoginLink)
			{
				kn.hideLoading();

				kn.startScreens([
					__webpack_require__(/*! Screen/User/Login */ 106)
				]);

				Plugins.runHook('rl-start-login-screens');
				Events.pub('rl.bootstart-login-screens');
			}
			else
			{
				kn.routeOff();
				kn.setHash(Links.root(), true);
				kn.routeOff();

				_.defer(function () {
					window.location.href = sCustomLoginLink;
				});
			}
		};

		AppUser.prototype.bootstart = function ()
		{
			AbstractApp.prototype.bootstart.call(this);

			__webpack_require__(/*! Stores/User/App */ 30).populate();
			__webpack_require__(/*! Stores/User/Settings */ 26).populate();
			__webpack_require__(/*! Stores/User/Notification */ 66).populate();
			__webpack_require__(/*! Stores/User/Identity */ 43).populate();
			__webpack_require__(/*! Stores/User/Account */ 22).populate();

			var
				self = this,
				$LAB = __webpack_require__(/*! $LAB */ 152),
				sJsHash = Settings.settingsGet('JsHash'),
				iContactsSyncInterval = Utils.pInt(Settings.settingsGet('ContactsSyncInterval')),
				bGoogle = Settings.settingsGet('AllowGoogleSocial'),
				bFacebook = Settings.settingsGet('AllowFacebookSocial'),
				bTwitter = Settings.settingsGet('AllowTwitterSocial')
			;

			if (SimplePace)
			{
				SimplePace.set(70);
				SimplePace.sleep();
			}

			Globals.leftPanelDisabled.subscribe(function (bValue) {
				Events.pub('left-panel.' + (bValue ? 'off' : 'on'));
			});

			if (!!Settings.settingsGet('Auth'))
			{
				Globals.$html.addClass('rl-user-auth');

				this.setTitle(Translator.i18n('TITLES/LOADING'));

	//require.ensure([], function() { // require code splitting

				self.folders(_.bind(function (bValue) {

					kn.hideLoading();

					if (bValue)
					{
						if ($LAB && window.crypto && window.crypto.getRandomValues && Settings.capa(Enums.Capa.OpenPGP))
						{
							var fOpenpgpCallback = function (openpgp) {
								PgpStore.openpgp = openpgp;
								PgpStore.openpgpKeyring = new openpgp.Keyring();
								PgpStore.capaOpenPGP(true);

								Events.pub('openpgp.init');

								self.reloadOpenPgpKeys();
							};

							if (window.openpgp)
							{
								fOpenpgpCallback(window.openpgp);
							}
							else
							{
								$LAB.script(Links.openPgpJs()).wait(function () {
									if (window.openpgp)
									{
										fOpenpgpCallback(window.openpgp);
									}
								});
							}
						}
						else
						{
							PgpStore.capaOpenPGP(false);
						}

						kn.startScreens([
							__webpack_require__(/*! Screen/User/MailBox */ 107),
							__webpack_require__(/*! Screen/User/Settings */ 108),
							__webpack_require__(/*! Screen/User/About */ 105)
						]);

						if (bGoogle || bFacebook || bTwitter)
						{
							self.socialUsers(true);
						}

						Events.sub('interval.2m', function () {
							self.folderInformation(Cache.getFolderInboxName());
						});

						Events.sub('interval.3m', function () {
							var sF = Data.currentFolderFullNameRaw();
							if (Cache.getFolderInboxName() !== sF)
							{
								self.folderInformation(sF);
							}
						});

						Events.sub('interval.5m-after5m', function () {
							self.folderInformationMultiply();
						});

						Events.sub('interval.15m', function () {
							self.quota();
						});

						Events.sub('interval.20m', function () {
							self.folders();
						});

						iContactsSyncInterval = 5 <= iContactsSyncInterval ? iContactsSyncInterval : 20;
						iContactsSyncInterval = 320 >= iContactsSyncInterval ? iContactsSyncInterval : 320;

						_.delay(function () {
							self.contactsSync();
						}, 10000);

						_.delay(function () {
							self.folderInformationMultiply(true);
						}, 2000);

						window.setInterval(function () {
							self.contactsSync();
						}, iContactsSyncInterval * 60000 + 5000);

						if (Settings.capa(Enums.Capa.AdditionalAccounts) || Settings.capa(Enums.Capa.AdditionalIdentities))
						{
							self.accountsAndIdentities(true);
						}

						_.delay(function () {
							var sF = Data.currentFolderFullNameRaw();
							if (Cache.getFolderInboxName() !== sF)
							{
								self.folderInformation(sF);
							}
						}, 1000);

						_.delay(function () {
							self.quota();
						}, 5000);

						_.delay(function () {
							Remote.appDelayStart(Utils.emptyFunction);
						}, 35000);

						Plugins.runHook('rl-start-user-screens');
						Events.pub('rl.bootstart-user-screens');

						if (!!Settings.settingsGet('AccountSignMe') && window.navigator.registerProtocolHandler)
						{
							_.delay(function () {
								try {
									window.navigator.registerProtocolHandler('mailto',
										window.location.protocol + '//' + window.location.host + window.location.pathname + '?mailto&to=%s',
										'' + (Settings.settingsGet('Title') || 'RainLoop'));
								} catch(e) {}

								if (Settings.settingsGet('MailToEmail'))
								{
									Utils.mailToHelper(Settings.settingsGet('MailToEmail'), __webpack_require__(/*! View/Popup/Compose */ 27));
								}
							}, 500);
						}

						if (!Globals.bMobileDevice)
						{
							_.defer(function () {
								self.initVerticalLayoutResizer(Enums.ClientSideKeyName.FolderListSize);
							});
						}
					}
					else
					{
						this.bootstartLoginScreen();
					}

					if (SimplePace)
					{
						SimplePace.set(100);
					}

				}, self));

	//}); // require code splitting

			}
			else
			{
				this.bootstartLoginScreen();

				if (SimplePace)
				{
					SimplePace.set(100);
				}
			}

			if (bGoogle)
			{
				window['rl_' + sJsHash + '_google_service'] = function () {
					SocialStore.google.loading(true);
					self.socialUsers();
				};
			}

			if (bFacebook)
			{
				window['rl_' + sJsHash + '_facebook_service'] = function () {
					SocialStore.facebook.loading(true);
					self.socialUsers();
				};
			}

			if (bTwitter)
			{
				window['rl_' + sJsHash + '_twitter_service'] = function () {
					SocialStore.twitter.loading(true);
					self.socialUsers();
				};
			}

			Events.sub('interval.1m', function () {
				Globals.momentTrigger(!Globals.momentTrigger());
			});

			Plugins.runHook('rl-start-screens');
			Events.pub('rl.bootstart-end');
		};

		module.exports = new AppUser();

	}());

/***/ },
/* 7 */
/*!**********************************!*\
  !*** ./dev/Common/Translator.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			$ = __webpack_require__(/*! $ */ 13),
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Globals = __webpack_require__(/*! Common/Globals */ 8)
		;

		/**
		 * @constructor
		 */
		function Translator()
		{
			this.data = window['rainloopI18N'] || {};
			this.notificationI18N = {};

			this.trigger = ko.observable(false);

			this.i18n = _.bind(this.i18n, this);
		}

		Translator.prototype.data = {};
		Translator.prototype.notificationI18N = {};

		/**
		 * @param {string} sKey
		 * @param {Object=} oValueList
		 * @param {string=} sDefaulValue
		 * @return {string}
		 */
		Translator.prototype.i18n = function (sKey, oValueList, sDefaulValue)
		{
			var
				sValueName = '',
				sResult = _.isUndefined(this.data[sKey]) ? (_.isUndefined(sDefaulValue) ? sKey : sDefaulValue) : this.data[sKey]
			;

			if (!_.isUndefined(oValueList) && !_.isNull(oValueList))
			{
				for (sValueName in oValueList)
				{
					if (_.has(oValueList, sValueName))
					{
						sResult = sResult.replace('%' + sValueName + '%', oValueList[sValueName]);
					}
				}
			}

			return sResult;
		};

		/**
		 * @param {Object} oElement
		 * @param {boolean=} bAnimate = false
		 */
		Translator.prototype.i18nToNode = function (oElement, bAnimate)
		{
			var self = this;
			_.defer(function () {
				$('.i18n', oElement).each(function () {
					var
						jqThis = $(this),
						sKey = ''
					;

					sKey = jqThis.data('i18n-text');
					if (sKey)
					{
						jqThis.text(self.i18n(sKey));
					}
					else
					{
						sKey = jqThis.data('i18n-html');
						if (sKey)
						{
							jqThis.html(self.i18n(sKey));
						}

						sKey = jqThis.data('i18n-placeholder');
						if (sKey)
						{
							jqThis.attr('placeholder', self.i18n(sKey));
						}

						sKey = jqThis.data('i18n-title');
						if (sKey)
						{
							jqThis.attr('title', self.i18n(sKey));
						}
					}
				});

				if (bAnimate && Globals.bAnimationSupported)
				{
					$('.i18n-animation.i18n', oElement).letterfx({
						'fx': 'fall fade', 'backwards': false, 'timing': 50, 'fx_duration': '50ms', 'letter_end': 'restore', 'element_end': 'restore'
					});
				}
			});
		};

		Translator.prototype.reloadData = function ()
		{
			if (window['rainloopI18N'])
			{
				this.data = window['rainloopI18N'] || {};

				this.i18nToNode($(window.document), true);
				this.trigger(!this.trigger());
			}

			window['rainloopI18N'] = null;
		};

		Translator.prototype.initNotificationLanguage = function ()
		{
			var oN = this.notificationI18N || {};

			oN[Enums.Notification.InvalidToken] = this.i18n('NOTIFICATIONS/INVALID_TOKEN');
			oN[Enums.Notification.AuthError] = this.i18n('NOTIFICATIONS/AUTH_ERROR');
			oN[Enums.Notification.AccessError] = this.i18n('NOTIFICATIONS/ACCESS_ERROR');
			oN[Enums.Notification.ConnectionError] = this.i18n('NOTIFICATIONS/CONNECTION_ERROR');
			oN[Enums.Notification.CaptchaError] = this.i18n('NOTIFICATIONS/CAPTCHA_ERROR');
			oN[Enums.Notification.SocialFacebookLoginAccessDisable] = this.i18n('NOTIFICATIONS/SOCIAL_FACEBOOK_LOGIN_ACCESS_DISABLE');
			oN[Enums.Notification.SocialTwitterLoginAccessDisable] = this.i18n('NOTIFICATIONS/SOCIAL_TWITTER_LOGIN_ACCESS_DISABLE');
			oN[Enums.Notification.SocialGoogleLoginAccessDisable] = this.i18n('NOTIFICATIONS/SOCIAL_GOOGLE_LOGIN_ACCESS_DISABLE');
			oN[Enums.Notification.DomainNotAllowed] = this.i18n('NOTIFICATIONS/DOMAIN_NOT_ALLOWED');
			oN[Enums.Notification.AccountNotAllowed] = this.i18n('NOTIFICATIONS/ACCOUNT_NOT_ALLOWED');

			oN[Enums.Notification.AccountTwoFactorAuthRequired] = this.i18n('NOTIFICATIONS/ACCOUNT_TWO_FACTOR_AUTH_REQUIRED');
			oN[Enums.Notification.AccountTwoFactorAuthError] = this.i18n('NOTIFICATIONS/ACCOUNT_TWO_FACTOR_AUTH_ERROR');

			oN[Enums.Notification.CouldNotSaveNewPassword] = this.i18n('NOTIFICATIONS/COULD_NOT_SAVE_NEW_PASSWORD');
			oN[Enums.Notification.CurrentPasswordIncorrect] = this.i18n('NOTIFICATIONS/CURRENT_PASSWORD_INCORRECT');
			oN[Enums.Notification.NewPasswordShort] = this.i18n('NOTIFICATIONS/NEW_PASSWORD_SHORT');
			oN[Enums.Notification.NewPasswordWeak] = this.i18n('NOTIFICATIONS/NEW_PASSWORD_WEAK');
			oN[Enums.Notification.NewPasswordForbidden] = this.i18n('NOTIFICATIONS/NEW_PASSWORD_FORBIDDENT');

			oN[Enums.Notification.ContactsSyncError] = this.i18n('NOTIFICATIONS/CONTACTS_SYNC_ERROR');

			oN[Enums.Notification.CantGetMessageList] = this.i18n('NOTIFICATIONS/CANT_GET_MESSAGE_LIST');
			oN[Enums.Notification.CantGetMessage] = this.i18n('NOTIFICATIONS/CANT_GET_MESSAGE');
			oN[Enums.Notification.CantDeleteMessage] = this.i18n('NOTIFICATIONS/CANT_DELETE_MESSAGE');
			oN[Enums.Notification.CantMoveMessage] = this.i18n('NOTIFICATIONS/CANT_MOVE_MESSAGE');
			oN[Enums.Notification.CantCopyMessage] = this.i18n('NOTIFICATIONS/CANT_MOVE_MESSAGE');

			oN[Enums.Notification.CantSaveMessage] = this.i18n('NOTIFICATIONS/CANT_SAVE_MESSAGE');
			oN[Enums.Notification.CantSendMessage] = this.i18n('NOTIFICATIONS/CANT_SEND_MESSAGE');
			oN[Enums.Notification.InvalidRecipients] = this.i18n('NOTIFICATIONS/INVALID_RECIPIENTS');

			oN[Enums.Notification.CantSaveFilters] = this.i18n('NOTIFICATIONS/CANT_SAVE_FILTERS');
			oN[Enums.Notification.CantGetFilters] = this.i18n('NOTIFICATIONS/CANT_GET_FILTERS');
			oN[Enums.Notification.FiltersAreNotCorrect] = this.i18n('NOTIFICATIONS/FILTERS_ARE_NOT_CORRECT');

			oN[Enums.Notification.CantCreateFolder] = this.i18n('NOTIFICATIONS/CANT_CREATE_FOLDER');
			oN[Enums.Notification.CantRenameFolder] = this.i18n('NOTIFICATIONS/CANT_RENAME_FOLDER');
			oN[Enums.Notification.CantDeleteFolder] = this.i18n('NOTIFICATIONS/CANT_DELETE_FOLDER');
			oN[Enums.Notification.CantDeleteNonEmptyFolder] = this.i18n('NOTIFICATIONS/CANT_DELETE_NON_EMPTY_FOLDER');
			oN[Enums.Notification.CantSubscribeFolder] = this.i18n('NOTIFICATIONS/CANT_SUBSCRIBE_FOLDER');
			oN[Enums.Notification.CantUnsubscribeFolder] = this.i18n('NOTIFICATIONS/CANT_UNSUBSCRIBE_FOLDER');

			oN[Enums.Notification.CantSaveSettings] = this.i18n('NOTIFICATIONS/CANT_SAVE_SETTINGS');
			oN[Enums.Notification.CantSavePluginSettings] = this.i18n('NOTIFICATIONS/CANT_SAVE_PLUGIN_SETTINGS');

			oN[Enums.Notification.DomainAlreadyExists] = this.i18n('NOTIFICATIONS/DOMAIN_ALREADY_EXISTS');

			oN[Enums.Notification.CantInstallPackage] = this.i18n('NOTIFICATIONS/CANT_INSTALL_PACKAGE');
			oN[Enums.Notification.CantDeletePackage] = this.i18n('NOTIFICATIONS/CANT_DELETE_PACKAGE');
			oN[Enums.Notification.InvalidPluginPackage] = this.i18n('NOTIFICATIONS/INVALID_PLUGIN_PACKAGE');
			oN[Enums.Notification.UnsupportedPluginPackage] = this.i18n('NOTIFICATIONS/UNSUPPORTED_PLUGIN_PACKAGE');

			oN[Enums.Notification.LicensingServerIsUnavailable] = this.i18n('NOTIFICATIONS/LICENSING_SERVER_IS_UNAVAILABLE');
			oN[Enums.Notification.LicensingExpired] = this.i18n('NOTIFICATIONS/LICENSING_EXPIRED');
			oN[Enums.Notification.LicensingBanned] = this.i18n('NOTIFICATIONS/LICENSING_BANNED');

			oN[Enums.Notification.DemoSendMessageError] = this.i18n('NOTIFICATIONS/DEMO_SEND_MESSAGE_ERROR');
			oN[Enums.Notification.DemoAccountError] = this.i18n('NOTIFICATIONS/DEMO_ACCOUNT_ERROR');

			oN[Enums.Notification.AccountAlreadyExists] = this.i18n('NOTIFICATIONS/ACCOUNT_ALREADY_EXISTS');
			oN[Enums.Notification.AccountDoesNotExist] = this.i18n('NOTIFICATIONS/ACCOUNT_DOES_NOT_EXIST');

			oN[Enums.Notification.MailServerError] = this.i18n('NOTIFICATIONS/MAIL_SERVER_ERROR');
			oN[Enums.Notification.InvalidInputArgument] = this.i18n('NOTIFICATIONS/INVALID_INPUT_ARGUMENT');
			oN[Enums.Notification.UnknownNotification] = this.i18n('NOTIFICATIONS/UNKNOWN_ERROR');
			oN[Enums.Notification.UnknownError] = this.i18n('NOTIFICATIONS/UNKNOWN_ERROR');
		};

		/**
		 * @param {Function} fCallback
		 * @param {Object} oScope
		 * @param {Function=} fLangCallback
		 */
		Translator.prototype.initOnStartOrLangChange = function (fCallback, oScope, fLangCallback)
		{
			if (fCallback)
			{
				fCallback.call(oScope);
			}

			if (fLangCallback)
			{
				this.trigger.subscribe(function () {
					if (fCallback)
					{
						fCallback.call(oScope);
					}

					fLangCallback.call(oScope);
				});
			}
			else if (fCallback)
			{
				this.trigger.subscribe(fCallback, oScope);
			}
		};

		/**
		 * @param {number} iCode
		 * @param {*=} mMessage = ''
		 * @return {string}
		 */
		Translator.prototype.getNotification = function (iCode, mMessage)
		{
			iCode = window.parseInt(iCode, 10) || 0;
			if (Enums.Notification.ClientViewError === iCode && mMessage)
			{
				return mMessage;
			}

			return _.isUndefined(this.notificationI18N[iCode]) ? '' : this.notificationI18N[iCode];
		};

		/**
		 * @param {*} mCode
		 * @return {string}
		 */
		Translator.prototype.getUploadErrorDescByCode = function (mCode)
		{
			var sResult = '';
			switch (window.parseInt(mCode, 10) || 0) {
			case Enums.UploadErrorCode.FileIsTooBig:
				sResult = this.i18n('UPLOAD/ERROR_FILE_IS_TOO_BIG');
				break;
			case Enums.UploadErrorCode.FilePartiallyUploaded:
				sResult = this.i18n('UPLOAD/ERROR_FILE_PARTIALLY_UPLOADED');
				break;
			case Enums.UploadErrorCode.FileNoUploaded:
				sResult = this.i18n('UPLOAD/ERROR_NO_FILE_UPLOADED');
				break;
			case Enums.UploadErrorCode.MissingTempFolder:
				sResult = this.i18n('UPLOAD/ERROR_MISSING_TEMP_FOLDER');
				break;
			case Enums.UploadErrorCode.FileOnSaveingError:
				sResult = this.i18n('UPLOAD/ERROR_ON_SAVING_FILE');
				break;
			case Enums.UploadErrorCode.FileType:
				sResult = this.i18n('UPLOAD/ERROR_FILE_TYPE');
				break;
			default:
				sResult = this.i18n('UPLOAD/ERROR_UNKNOWN');
				break;
			}

			return sResult;
		};

		/**
		 * @param {string} sLanguage
		 * @param {Function=} fDone
		 * @param {Function=} fFail
		 */
		Translator.prototype.reload = function (sLanguage, fDone, fFail)
		{
			var
				self = this,
				$html = $('html'),
				fEmptyFunction = function () {},
				iStart = (new Date()).getTime()
			;

			$html.addClass('rl-changing-language');

			$.ajax({
					'url': __webpack_require__(/*! Common/Links */ 12).langLink(sLanguage),
					'dataType': 'script',
					'cache': true
				})
				.fail(fFail || fEmptyFunction)
				.done(function () {
					_.delay(function () {
						self.reloadData();
						(fDone || fEmptyFunction)();
						$html.removeClass('rl-changing-language');
					}, 500 < (new Date()).getTime() - iStart ? 1 : 500);
				})
			;
		};

		module.exports = new Translator();

	}());


/***/ },
/* 8 */
/*!*******************************!*\
  !*** ./dev/Common/Globals.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			Globals = {},

			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			ko = __webpack_require__(/*! ko */ 3),
			key = __webpack_require__(/*! key */ 21),

			Enums = __webpack_require__(/*! Common/Enums */ 4)
		;

		Globals.$win = $(window);
		Globals.$doc = $(window.document);
		Globals.$html = $('html');
		Globals.$div = $('<div></div>');

		/**
		 * @type {?}
		 */
		Globals.now = (new window.Date()).getTime();

		/**
		 * @type {?}
		 */
		Globals.momentTrigger = ko.observable(true);

		/**
		 * @type {?}
		 */
		Globals.dropdownVisibility = ko.observable(false).extend({'rateLimit': 0});

		/**
		 * @type {?}
		 */
		Globals.tooltipTrigger = ko.observable(false).extend({'rateLimit': 0});

		/**
		 * @type {boolean}
		 */
		Globals.useKeyboardShortcuts = ko.observable(true);

		/**
		 * @type {number}
		 */
		Globals.iAjaxErrorCount = 0;

		/**
		 * @type {number}
		 */
		Globals.iTokenErrorCount = 0;

		/**
		 * @type {number}
		 */
		Globals.iMessageBodyCacheCount = 0;

		/**
		 * @type {boolean}
		 */
		Globals.bUnload = false;

		/**
		 * @type {string}
		 */
		Globals.sUserAgent = (window.navigator.userAgent || '').toLowerCase();

		/**
		 * @type {boolean}
		 */
		Globals.bIsiOSDevice = -1 < Globals.sUserAgent.indexOf('iphone') || -1 < Globals.sUserAgent.indexOf('ipod') || -1 < Globals.sUserAgent.indexOf('ipad');

		/**
		 * @type {boolean}
		 */
		Globals.bIsAndroidDevice = -1 < Globals.sUserAgent.indexOf('android');

		/**
		 * @type {boolean}
		 */
		Globals.bMobileDevice = Globals.bIsiOSDevice || Globals.bIsAndroidDevice;

		/**
		 * @type {boolean}
		 */
		Globals.bDisableNanoScroll = Globals.bMobileDevice;

		/**
		 * @type {boolean}
		 */
		Globals.bAllowPdfPreview = !Globals.bMobileDevice;

		/**
		 * @type {boolean}
		 */
		Globals.bAnimationSupported = !Globals.bMobileDevice && Globals.$html.hasClass('csstransitions') &&
			 Globals.$html.hasClass('cssanimations');

		/**
		 * @type {boolean}
		 */
		Globals.bXMLHttpRequestSupported = !!window.XMLHttpRequest;

		/**
		 * @type {*}
		 */
		Globals.__APP__ = null;

		/**
		 * @type {Object}
		 */
		Globals.oHtmlEditorDefaultConfig = {
			'title': false,
			'stylesSet': false,
			'customConfig': '',
			'contentsCss': '',
			'toolbarGroups': [
				{name: 'spec'},
				{name: 'styles'},
				{name: 'basicstyles', groups: ['basicstyles', 'cleanup', 'bidi']},
				{name: 'colors'},
				{name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align']},
				{name: 'links'},
				{name: 'insert'},
				{name: 'document', groups: ['mode', 'document', 'doctools']},
				{name: 'others'}
			],

			'removePlugins': 'liststyle,table,quicktable,tableresize,tabletools,contextmenu', //blockquote
			'removeButtons': 'Format,Undo,Redo,Cut,Copy,Paste,Anchor,Strike,Subscript,Superscript,Image,SelectAll,Source',
			'removeDialogTabs': 'link:advanced;link:target;image:advanced;images:advanced',

			'extraPlugins': 'plain', // signature
			'allowedContent': true,

			'font_defaultLabel': 'Arial',
			'fontSize_defaultLabel': '13',
			'fontSize_sizes': '10/10px;12/12px;13/13px;14/14px;16/16px;18/18px;20/20px;24/24px;28/28px;36/36px;48/48px'
		};

		/**
		 * @type {Object}
		 */
		Globals.oHtmlEditorLangsMap = {
			'bg': 'bg',
			'de': 'de',
			'es': 'es',
			'fr': 'fr',
			'hu': 'hu',
			'is': 'is',
			'it': 'it',
			'ja': 'ja',
			'ja-jp': 'ja',
			'ko': 'ko',
			'ko-kr': 'ko',
			'lt': 'lt',
			'lv': 'lv',
			'nl': 'nl',
			'no': 'no',
			'pl': 'pl',
			'pt': 'pt',
			'pt-pt': 'pt',
			'pt-br': 'pt-br',
			'ro': 'ro',
			'ru': 'ru',
			'sk': 'sk',
			'sv': 'sv',
			'tr': 'tr',
			'ua': 'ru',
			'zh': 'zh',
			'zh-tw': 'zh',
			'zh-cn': 'zh-cn'
		};

		if (Globals.bAllowPdfPreview && window.navigator && window.navigator.mimeTypes)
		{
			Globals.bAllowPdfPreview = !!_.find(window.navigator.mimeTypes, function (oType) {
				return oType && 'application/pdf' === oType.type;
			});
		}

		Globals.aBootstrapDropdowns = [];

		Globals.aViewModels = {
			'settings': [],
			'settings-removed': [],
			'settings-disabled': []
		};

		Globals.leftPanelDisabled = ko.observable(false);

		// popups
		Globals.popupVisibilityNames = ko.observableArray([]);

		Globals.popupVisibility = ko.computed(function () {
			return 0 < Globals.popupVisibilityNames().length;
		}, this);

		// keys
		Globals.keyScopeReal = ko.observable(Enums.KeyState.All);
		Globals.keyScopeFake = ko.observable(Enums.KeyState.All);

		Globals.keyScope = ko.computed({
			'owner': this,
			'read': function () {
				return Globals.keyScopeFake();
			},
			'write': function (sValue) {

				if (Enums.KeyState.Menu !== sValue)
				{
					if (Enums.KeyState.Compose === sValue)
					{
						// disableKeyFilter
						key.filter = function () {
							return Globals.useKeyboardShortcuts();
						};
					}
					else
					{
						// restoreKeyFilter
						key.filter = function (event) {

							if (Globals.useKeyboardShortcuts())
							{
								var
									oElement = event.target || event.srcElement,
									sTagName = oElement ? oElement.tagName : ''
								;

								sTagName = sTagName.toUpperCase();
								return !(sTagName === 'INPUT' || sTagName === 'SELECT' || sTagName === 'TEXTAREA' ||
									(oElement && sTagName === 'DIV' && 'editorHtmlArea' === oElement.className && oElement.contentEditable)
								);
							}

							return false;
						};
					}

					Globals.keyScopeFake(sValue);
					if (Globals.dropdownVisibility())
					{
						sValue = Enums.KeyState.Menu;
					}
				}

				Globals.keyScopeReal(sValue);
			}
		});

		Globals.keyScopeReal.subscribe(function (sValue) {
	//		window.console.log(sValue);
			key.setScope(sValue);
		});

		Globals.dropdownVisibility.subscribe(function (bValue) {
			if (bValue)
			{
				Globals.tooltipTrigger(!Globals.tooltipTrigger());
				Globals.keyScope(Enums.KeyState.Menu);
			}
			else if (Enums.KeyState.Menu === key.getScope())
			{
				Globals.keyScope(Globals.keyScopeFake());
			}
		});

		module.exports = Globals;

	}());

/***/ },
/* 9 */
/*!*********************************!*\
  !*** ./dev/Storage/Settings.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),

			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 */
		function SettingsStorage()
		{
			this.oSettings = window['rainloopAppData'] || {};
			this.oSettings = Utils.isNormal(this.oSettings) ? this.oSettings : {};
		}

		SettingsStorage.prototype.oSettings = null;

		/**
		 * @param {string} sName
		 * @return {?}
		 */
		SettingsStorage.prototype.settingsGet = function (sName)
		{
			return Utils.isUnd(this.oSettings[sName]) ? null : this.oSettings[sName];
		};

		/**
		 * @param {string} sName
		 * @param {?} mValue
		 */
		SettingsStorage.prototype.settingsSet = function (sName, mValue)
		{
			this.oSettings[sName] = mValue;
		};

		/**
		 * @param {string} sName
		 * @return {boolean}
		 */
		SettingsStorage.prototype.capa = function (sName)
		{
			var mCapa = this.settingsGet('Capa');
			return Utils.isArray(mCapa) && Utils.isNormal(sName) && -1 < Utils.inArray(sName, mCapa);
		};


		module.exports = new SettingsStorage();

	}());

/***/ },
/* 10 */
/*!*************************!*\
  !*** external "window" ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window;

/***/ },
/* 11 */
/*!***********************************!*\
  !*** ./dev/Knoin/AbstractView.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Globals = __webpack_require__(/*! Common/Globals */ 8)
		;

		/**
		 * @constructor
		 * @param {string=} sPosition = ''
		 * @param {string=} sTemplate = ''
		 */
		function AbstractView(sPosition, sTemplate)
		{
			this.bDisabeCloseOnEsc = false;
			this.sPosition = Utils.pString(sPosition);
			this.sTemplate = Utils.pString(sTemplate);

			this.sDefaultKeyScope = Enums.KeyState.None;
			this.sCurrentKeyScope = this.sDefaultKeyScope;

			this.viewModelVisibility = ko.observable(false);
			this.modalVisibility = ko.observable(false).extend({'rateLimit': 0});

			this.viewModelName = '';
			this.viewModelNames = [];
			this.viewModelDom = null;
		}

		/**
		 * @type {boolean}
		 */
		AbstractView.prototype.bDisabeCloseOnEsc = false;

		/**
		 * @type {string}
		 */
		AbstractView.prototype.sPosition = '';

		/**
		 * @type {string}
		 */
		AbstractView.prototype.sTemplate = '';

		/**
		 * @type {string}
		 */
		AbstractView.prototype.sDefaultKeyScope = Enums.KeyState.None;

		/**
		 * @type {string}
		 */
		AbstractView.prototype.sCurrentKeyScope = Enums.KeyState.None;

		/**
		 * @type {string}
		 */
		AbstractView.prototype.viewModelName = '';

		/**
		 * @type {Array}
		 */
		AbstractView.prototype.viewModelNames = [];

		/**
		 * @type {?}
		 */
		AbstractView.prototype.viewModelDom = null;

		/**
		 * @return {string}
		 */
		AbstractView.prototype.viewModelTemplate = function ()
		{
			return this.sTemplate;
		};

		/**
		 * @return {string}
		 */
		AbstractView.prototype.viewModelPosition = function ()
		{
			return this.sPosition;
		};

		AbstractView.prototype.cancelCommand = function () {};
		AbstractView.prototype.closeCommand = function () {};

		AbstractView.prototype.storeAndSetKeyScope = function ()
		{
			this.sCurrentKeyScope = Globals.keyScope();
			Globals.keyScope(this.sDefaultKeyScope);
		};

		AbstractView.prototype.restoreKeyScope = function ()
		{
			Globals.keyScope(this.sCurrentKeyScope);
		};

		AbstractView.prototype.registerPopupKeyDown = function ()
		{
			var self = this;

			Globals.$win.on('keydown', function (oEvent) {
				if (oEvent && self.modalVisibility && self.modalVisibility())
				{
					if (!this.bDisabeCloseOnEsc && Enums.EventKeyCode.Esc === oEvent.keyCode)
					{
						Utils.delegateRun(self, 'cancelCommand');
						return false;
					}
					else if (Enums.EventKeyCode.Backspace === oEvent.keyCode && !Utils.inFocus())
					{
						return false;
					}
				}

				return true;
			});
		};

		module.exports = AbstractView;

	}());

/***/ },
/* 12 */
/*!*****************************!*\
  !*** ./dev/Common/Links.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 */
		function Links()
		{
			var Settings = __webpack_require__(/*! Storage/Settings */ 9);

			this.sBase = '#/';
			this.sServer = './?';
			this.sSubQuery = '&s=/';
			this.sSubSubQuery = '&ss=/';
			this.sVersion = Settings.settingsGet('Version');
			this.sSpecSuffix = Settings.settingsGet('AuthAccountHash') || '0';
			this.sStaticPrefix = Settings.settingsGet('StaticPrefix') || 'rainloop/v/' + this.sVersion + '/static/';
		}

		/**
		 * @return {string}
		 */
		Links.prototype.root = function ()
		{
			return this.sBase;
		};

		/**
		 * @return {string}
		 */
		Links.prototype.rootAdmin = function ()
		{
			return this.sServer + '/Admin/';
		};

		/**
		 * @param {string} sDownload
		 * @return {string}
		 */
		Links.prototype.attachmentDownload = function (sDownload)
		{
			return this.sServer + '/Raw/' + this.sSubQuery + this.sSpecSuffix + '/Download/' + this.sSubSubQuery + sDownload;
		};

		/**
		 * @param {string} sDownload
		 * @return {string}
		 */
		Links.prototype.attachmentPreview = function (sDownload)
		{
			return this.sServer + '/Raw/' + this.sSubQuery + this.sSpecSuffix + '/View/' + this.sSubSubQuery + sDownload;
		};

		/**
		 * @param {string} sDownload
		 * @return {string}
		 */
		Links.prototype.attachmentThumbnailPreview = function (sDownload)
		{
			return this.sServer + '/Raw/' + this.sSubQuery + this.sSpecSuffix + '/ViewThumbnail/' + this.sSubSubQuery + sDownload;
		};

		/**
		 * @param {string} sDownload
		 * @return {string}
		 */
		Links.prototype.attachmentPreviewAsPlain = function (sDownload)
		{
			return this.sServer + '/Raw/' + this.sSubQuery + this.sSpecSuffix + '/ViewAsPlain/' + this.sSubSubQuery + sDownload;
		};

		/**
		 * @param {string} sDownload
		 * @return {string}
		 */
		Links.prototype.attachmentFramed = function (sDownload)
		{
			return this.sServer + '/Raw/' + this.sSubQuery + this.sSpecSuffix + '/FramedView/' + this.sSubSubQuery + sDownload;
		};

		/**
		 * @return {string}
		 */
		Links.prototype.upload = function ()
		{
			return this.sServer + '/Upload/' + this.sSubQuery + this.sSpecSuffix + '/';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.uploadContacts = function ()
		{
			return this.sServer + '/UploadContacts/' + this.sSubQuery + this.sSpecSuffix + '/';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.uploadBackground = function ()
		{
			return this.sServer + '/UploadBackground/' + this.sSubQuery + this.sSpecSuffix + '/';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.append = function ()
		{
			return this.sServer + '/Append/' + this.sSubQuery + this.sSpecSuffix + '/';
		};

		/**
		 * @param {string} sEmail
		 * @return {string}
		 */
		Links.prototype.change = function (sEmail)
		{
			return this.sServer + '/Change/' + this.sSubQuery + this.sSpecSuffix + '/' + Utils.encodeURIComponent(sEmail) + '/';
		};

		/**
		 * @param {string=} sAdd
		 * @return {string}
		 */
		Links.prototype.ajax = function (sAdd)
		{
			return this.sServer + '/Ajax/' + this.sSubQuery + this.sSpecSuffix + '/' + sAdd;
		};

		/**
		 * @param {string} sRequestHash
		 * @return {string}
		 */
		Links.prototype.messageViewLink = function (sRequestHash)
		{
			return this.sServer + '/Raw/' + this.sSubQuery + this.sSpecSuffix + '/ViewAsPlain/' + this.sSubSubQuery + sRequestHash;
		};

		/**
		 * @param {string} sRequestHash
		 * @return {string}
		 */
		Links.prototype.messageDownloadLink = function (sRequestHash)
		{
			return this.sServer + '/Raw/' + this.sSubQuery + this.sSpecSuffix + '/Download/' + this.sSubSubQuery + sRequestHash;
		};

		/**
		 * @param {string} sEmail
		 * @return {string}
		 */
		Links.prototype.avatarLink = function (sEmail)
		{
			return this.sServer + '/Raw/0/Avatar/' + Utils.encodeURIComponent(sEmail) + '/';
		};

		/**
		 * @param {string} sHash
		 * @return {string}
		 */
		Links.prototype.publicLink = function (sHash)
		{
			return this.sServer + '/Raw/0/Public/' + sHash + '/';
		};

		/**
		 * @param {string} sInboxFolderName = 'INBOX'
		 * @return {string}
		 */
		Links.prototype.inbox = function (sInboxFolderName)
		{
			sInboxFolderName = Utils.isUnd(sInboxFolderName) ? 'INBOX' : sInboxFolderName;
			return this.sBase + 'mailbox/' + sInboxFolderName;
		};

		/**
		 * @return {string}
		 */
		Links.prototype.messagePreview = function ()
		{
			return this.sBase + 'mailbox/message-preview';
		};

		/**
		 * @param {string=} sScreenName
		 * @return {string}
		 */
		Links.prototype.settings = function (sScreenName)
		{
			var sResult = this.sBase + 'settings';
			if (!Utils.isUnd(sScreenName) && '' !== sScreenName)
			{
				sResult += '/' + sScreenName;
			}

			return sResult;
		};

		/**
		 * @return {string}
		 */
		Links.prototype.about = function ()
		{
			return this.sBase + 'about';
		};

		/**
		 * @param {string} sScreenName
		 * @return {string}
		 */
		Links.prototype.admin = function (sScreenName)
		{
			var sResult = this.sBase;
			switch (sScreenName) {
			case 'AdminDomains':
				sResult += 'domains';
				break;
			case 'AdminSecurity':
				sResult += 'security';
				break;
			case 'AdminLicensing':
				sResult += 'licensing';
				break;
			}

			return sResult;
		};

		/**
		 * @param {string} sFolder
		 * @param {number=} iPage = 1
		 * @param {string=} sSearch = ''
		 * @return {string}
		 */
		Links.prototype.mailBox = function (sFolder, iPage, sSearch)
		{
			iPage = Utils.isNormal(iPage) ? Utils.pInt(iPage) : 1;
			sSearch = Utils.pString(sSearch);

			var sResult = this.sBase + 'mailbox/';
			if ('' !== sFolder)
			{
				sResult += encodeURI(sFolder);
			}
			if (1 < iPage)
			{
				sResult = sResult.replace(/[\/]+$/, '');
				sResult += '/p' + iPage;
			}
			if ('' !== sSearch)
			{
				sResult = sResult.replace(/[\/]+$/, '');
				sResult += '/' + encodeURI(sSearch);
			}

			return sResult;
		};

		/**
		 * @return {string}
		 */
		Links.prototype.phpInfo = function ()
		{
			return this.sServer + 'Info';
		};

		/**
		 * @param {string} sLang
		 * @return {string}
		 */
		Links.prototype.langLink = function (sLang)
		{
			return this.sServer + '/Lang/0/' + encodeURI(sLang) + '/' + this.sVersion + '/';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.exportContactsVcf = function ()
		{
			return this.sServer + '/Raw/' + this.sSubQuery + this.sSpecSuffix + '/ContactsVcf/';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.exportContactsCsv = function ()
		{
			return this.sServer + '/Raw/' + this.sSubQuery + this.sSpecSuffix + '/ContactsCsv/';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.emptyContactPic = function ()
		{
			return this.sStaticPrefix + 'css/images/empty-contact.png';
		};

		/**
		 * @param {string} sFileName
		 * @return {string}
		 */
		Links.prototype.sound = function (sFileName)
		{
			return  this.sStaticPrefix + 'sounds/' + sFileName;
		};

		/**
		 * @param {string} sTheme
		 * @return {string}
		 */
		Links.prototype.themePreviewLink = function (sTheme)
		{
			var sPrefix = 'rainloop/v/' + this.sVersion + '/';
			if ('@custom' === sTheme.substr(-7))
			{
				sTheme = Utils.trim(sTheme.substring(0, sTheme.length - 7));
				sPrefix  = '';
			}

			return sPrefix + 'themes/' + window.encodeURI(sTheme) + '/images/preview.png';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.notificationMailIcon = function ()
		{
			return  this.sStaticPrefix + 'css/images/icom-message-notification.png';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.openPgpJs = function ()
		{
			return  this.sStaticPrefix + 'js/min/openpgp.js';
		};

		/**
		 * @return {string}
		 */
		Links.prototype.socialGoogle = function ()
		{
			return this.sServer + 'SocialGoogle' + ('' !== this.sSpecSuffix ? '/' + this.sSubQuery + this.sSpecSuffix + '/' : '');
		};

		/**
		 * @return {string}
		 */
		Links.prototype.socialTwitter = function ()
		{
			return this.sServer + 'SocialTwitter' + ('' !== this.sSpecSuffix ? '/' + this.sSubQuery + this.sSpecSuffix + '/' : '');
		};

		/**
		 * @return {string}
		 */
		Links.prototype.socialFacebook = function ()
		{
			return this.sServer + 'SocialFacebook' + ('' !== this.sSpecSuffix ? '/' + this.sSubQuery + this.sSpecSuffix + '/' : '');
		};

		module.exports = new Links();

	}());

/***/ },
/* 13 */
/*!********************************!*\
  !*** external "window.jQuery" ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.jQuery;

/***/ },
/* 14 */
/*!************************************!*\
  !*** ./dev/Storage/User/Remote.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Base64 = __webpack_require__(/*! Common/Base64 */ 92),

			AppStore = __webpack_require__(/*! Stores/User/App */ 30),
			SettingsStore = __webpack_require__(/*! Stores/User/Settings */ 26),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),
			Data = __webpack_require__(/*! Storage/User/Data */ 15),

			AbstractRemoteStorage = __webpack_require__(/*! Storage/AbstractRemote */ 59)
		;

		/**
		 * @constructor
		 * @extends AbstractRemoteStorage
		 */
		function RemoteUserStorage()
		{
			AbstractRemoteStorage.call(this);

			this.oRequests = {};
		}

		_.extend(RemoteUserStorage.prototype, AbstractRemoteStorage.prototype);

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.folders = function (fCallback)
		{
			this.defaultRequest(fCallback, 'Folders', {
				'SentFolder': Settings.settingsGet('SentFolder'),
				'DraftFolder': Settings.settingsGet('DraftFolder'),
				'SpamFolder': Settings.settingsGet('SpamFolder'),
				'TrashFolder': Settings.settingsGet('TrashFolder'),
				'ArchiveFolder': Settings.settingsGet('ArchiveFolder')
			}, null, '', ['Folders']);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sEmail
		 * @param {string} sLogin
		 * @param {string} sPassword
		 * @param {boolean} bSignMe
		 * @param {string=} sLanguage
		 * @param {string=} sAdditionalCode
		 * @param {boolean=} bAdditionalCodeSignMe
		 */
		RemoteUserStorage.prototype.login = function (fCallback, sEmail, sLogin, sPassword, bSignMe, sLanguage, sAdditionalCode, bAdditionalCodeSignMe)
		{
			this.defaultRequest(fCallback, 'Login', {
				'Email': sEmail,
				'Login': sLogin,
				'Password': sPassword,
				'Language': sLanguage || '',
				'AdditionalCode': sAdditionalCode || '',
				'AdditionalCodeSignMe': bAdditionalCodeSignMe ? '1' : '0',
				'SignMe': bSignMe ? '1' : '0'
			});
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.getTwoFactor = function (fCallback)
		{
			this.defaultRequest(fCallback, 'GetTwoFactorInfo');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.createTwoFactor = function (fCallback)
		{
			this.defaultRequest(fCallback, 'CreateTwoFactorSecret');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.clearTwoFactor = function (fCallback)
		{
			this.defaultRequest(fCallback, 'ClearTwoFactorInfo');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.showTwoFactorSecret = function (fCallback)
		{
			this.defaultRequest(fCallback, 'ShowTwoFactorSecret');
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sCode
		 */
		RemoteUserStorage.prototype.testTwoFactor = function (fCallback, sCode)
		{
			this.defaultRequest(fCallback, 'TestTwoFactorInfo', {
				'Code': sCode
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {boolean} bEnable
		 */
		RemoteUserStorage.prototype.enableTwoFactor = function (fCallback, bEnable)
		{
			this.defaultRequest(fCallback, 'EnableTwoFactor', {
				'Enable': bEnable ? '1' : '0'
			});
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.clearTwoFactorInfo = function (fCallback)
		{
			this.defaultRequest(fCallback, 'ClearTwoFactorInfo');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.contactsSync = function (fCallback)
		{
			this.defaultRequest(fCallback, 'ContactsSync', null, Consts.Defaults.ContactsSyncAjaxTimeout);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {boolean} bEnable
		 * @param {string} sUrl
		 * @param {string} sUser
		 * @param {string} sPassword
		 */
		RemoteUserStorage.prototype.saveContactsSyncData = function (fCallback, bEnable, sUrl, sUser, sPassword)
		{
			this.defaultRequest(fCallback, 'SaveContactsSyncData', {
				'Enable': bEnable ? '1' : '0',
				'Url': sUrl,
				'User': sUser,
				'Password': sPassword
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sEmail
		 * @param {string} sPassword
		 * @param {boolean=} bNew
		 */
		RemoteUserStorage.prototype.accountSetup = function (fCallback, sEmail, sPassword, bNew)
		{
			bNew = Utils.isUnd(bNew) ? true : !!bNew;

			this.defaultRequest(fCallback, 'AccountSetup', {
				'Email': sEmail,
				'Password': sPassword,
				'New': bNew ? '1' : '0'
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sEmailToDelete
		 */
		RemoteUserStorage.prototype.accountDelete = function (fCallback, sEmailToDelete)
		{
			this.defaultRequest(fCallback, 'AccountDelete', {
				'EmailToDelete': sEmailToDelete
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {Array} aAccounts
		 */
		RemoteUserStorage.prototype.accountSortOrder = function (fCallback, aAccounts)
		{
			this.defaultRequest(fCallback, 'AccountSortOrder', {
				'Accounts': aAccounts
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sId
		 * @param {string} sEmail
		 * @param {string} sName
		 * @param {string} sReplyTo
		 * @param {string} sBcc
		 */
		RemoteUserStorage.prototype.identityUpdate = function (fCallback, sId, sEmail, sName, sReplyTo, sBcc)
		{
			this.defaultRequest(fCallback, 'IdentityUpdate', {
				'Id': sId,
				'Email': sEmail,
				'Name': sName,
				'ReplyTo': sReplyTo,
				'Bcc': sBcc
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sIdToDelete
		 */
		RemoteUserStorage.prototype.identityDelete = function (fCallback, sIdToDelete)
		{
			this.defaultRequest(fCallback, 'IdentityDelete', {
				'IdToDelete': sIdToDelete
			});
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.accountsAndIdentities = function (fCallback)
		{
			this.defaultRequest(fCallback, 'AccountsAndIdentities');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.accountsCounts = function (fCallback)
		{
			this.defaultRequest(fCallback, 'AccountsCounts');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.filtersSave = function (fCallback,
			aFilters, sRaw, bRawIsActive)
		{
			this.defaultRequest(fCallback, 'FiltersSave', {
				'Raw': sRaw,
				'RawIsActive': bRawIsActive ? '1' : '0',
				'Filters': _.map(aFilters, function (oItem) {
					return oItem.toJson();
				})
			});
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.filtersGet = function (fCallback)
		{
			this.defaultRequest(fCallback, 'Filters', {});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sFolderFullNameRaw
		 * @param {number=} iOffset = 0
		 * @param {number=} iLimit = 20
		 * @param {string=} sSearch = ''
		 * @param {boolean=} bSilent = false
		 */
		RemoteUserStorage.prototype.messageList = function (fCallback, sFolderFullNameRaw, iOffset, iLimit, sSearch, bSilent)
		{
			sFolderFullNameRaw = Utils.pString(sFolderFullNameRaw);

			var
				sFolderHash = Cache.getFolderHash(sFolderFullNameRaw)
			;

			bSilent = Utils.isUnd(bSilent) ? false : !!bSilent;
			iOffset = Utils.isUnd(iOffset) ? 0 : Utils.pInt(iOffset);
			iLimit = Utils.isUnd(iOffset) ? 20 : Utils.pInt(iLimit);
			sSearch = Utils.pString(sSearch);

			if ('' !== sFolderHash && ('' === sSearch || -1 === sSearch.indexOf('is:')))
			{
				return this.defaultRequest(fCallback, 'MessageList', {},
					'' === sSearch ? Consts.Defaults.DefaultAjaxTimeout : Consts.Defaults.SearchAjaxTimeout,
					'MessageList/' + Base64.urlsafe_encode([
						sFolderFullNameRaw,
						iOffset,
						iLimit,
						sSearch,
						AppStore.projectHash(),
						sFolderHash,
						Cache.getFolderInboxName() === sFolderFullNameRaw ? Cache.getFolderUidNext(sFolderFullNameRaw) : '',
						AppStore.threadsAllowed() && SettingsStore.useThreads() ? '1' : '0',
						AppStore.threadsAllowed() && sFolderFullNameRaw === Data.messageListThreadFolder() ? Data.messageListThreadUids().join(',') : ''
					].join(String.fromCharCode(0))), bSilent ? [] : ['MessageList']);
			}
			else
			{
				return this.defaultRequest(fCallback, 'MessageList', {
					'Folder': sFolderFullNameRaw,
					'Offset': iOffset,
					'Limit': iLimit,
					'Search': sSearch,
					'UidNext': Cache.getFolderInboxName() === sFolderFullNameRaw ? Cache.getFolderUidNext(sFolderFullNameRaw) : '',
					'UseThreads': AppStore.threadsAllowed() && SettingsStore.useThreads() ? '1' : '0',
					'ExpandedThreadUid': AppStore.threadsAllowed() && sFolderFullNameRaw === Data.messageListThreadFolder() ? Data.messageListThreadUids().join(',') : ''
				}, '' === sSearch ? Consts.Defaults.DefaultAjaxTimeout : Consts.Defaults.SearchAjaxTimeout, '', bSilent ? [] : ['MessageList']);
			}
		};

		/**
		 * @param {?Function} fCallback
		 * @param {Array} aDownloads
		 */
		RemoteUserStorage.prototype.messageUploadAttachments = function (fCallback, aDownloads)
		{
			this.defaultRequest(fCallback, 'MessageUploadAttachments', {
				'Attachments': aDownloads
			}, 999000);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sFolderFullNameRaw
		 * @param {number} iUid
		 * @return {boolean}
		 */
		RemoteUserStorage.prototype.message = function (fCallback, sFolderFullNameRaw, iUid)
		{
			sFolderFullNameRaw = Utils.pString(sFolderFullNameRaw);
			iUid = Utils.pInt(iUid);

			if (Cache.getFolderFromCacheList(sFolderFullNameRaw) && 0 < iUid)
			{
				this.defaultRequest(fCallback, 'Message', {}, null,
					'Message/' + Base64.urlsafe_encode([
						sFolderFullNameRaw,
						iUid,
						AppStore.projectHash(),
						AppStore.threadsAllowed() && SettingsStore.useThreads() ? '1' : '0'
					].join(String.fromCharCode(0))), ['Message']);

				return true;
			}

			return false;
		};

		/**
		 * @param {?Function} fCallback
		 * @param {Array} aExternals
		 */
		RemoteUserStorage.prototype.composeUploadExternals = function (fCallback, aExternals)
		{
			this.defaultRequest(fCallback, 'ComposeUploadExternals', {
				'Externals': aExternals
			}, 999000);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sUrl
		 * @param {string} sAccessToken
		 */
		RemoteUserStorage.prototype.composeUploadDrive = function (fCallback, sUrl, sAccessToken)
		{
			this.defaultRequest(fCallback, 'ComposeUploadDrive', {
				'AccessToken': sAccessToken,
				'Url': sUrl
			}, 999000);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sFolder
		 * @param {Array=} aList = []
		 */
		RemoteUserStorage.prototype.folderInformation = function (fCallback, sFolder, aList)
		{
			var
				bRequest = true,
				aUids = []
			;

			if (Utils.isArray(aList) && 0 < aList.length)
			{
				bRequest = false;
				_.each(aList, function (oMessageListItem) {
					if (!Cache.getMessageFlagsFromCache(oMessageListItem.folderFullNameRaw, oMessageListItem.uid))
					{
						aUids.push(oMessageListItem.uid);
					}

					if (0 < oMessageListItem.threads().length)
					{
						_.each(oMessageListItem.threads(), function (sUid) {
							if (!Cache.getMessageFlagsFromCache(oMessageListItem.folderFullNameRaw, sUid))
							{
								aUids.push(sUid);
							}
						});
					}
				});

				if (0 < aUids.length)
				{
					bRequest = true;
				}
			}

			if (bRequest)
			{
				this.defaultRequest(fCallback, 'FolderInformation', {
					'Folder': sFolder,
					'FlagsUids': Utils.isArray(aUids) ? aUids.join(',') : '',
					'UidNext': Cache.getFolderInboxName() === sFolder ? Cache.getFolderUidNext(sFolder) : ''
				});
			}
			else if (SettingsStore.useThreads())
			{
				__webpack_require__(/*! App/User */ 6).reloadFlagsCurrentMessageListAndMessageFromCache();
			}
		};

		/**
		 * @param {?Function} fCallback
		 * @param {Array} aFolders
		 */
		RemoteUserStorage.prototype.folderInformationMultiply = function (fCallback, aFolders)
		{
			this.defaultRequest(fCallback, 'FolderInformationMultiply', {
				'Folders': aFolders
			});
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.logout = function (fCallback)
		{
			this.defaultRequest(fCallback, 'Logout');
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sFolderFullNameRaw
		 * @param {Array} aUids
		 * @param {boolean} bSetFlagged
		 */
		RemoteUserStorage.prototype.messageSetFlagged = function (fCallback, sFolderFullNameRaw, aUids, bSetFlagged)
		{
			this.defaultRequest(fCallback, 'MessageSetFlagged', {
				'Folder': sFolderFullNameRaw,
				'Uids': aUids.join(','),
				'SetAction': bSetFlagged ? '1' : '0'
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sFolderFullNameRaw
		 * @param {Array} aUids
		 * @param {boolean} bSetSeen
		 */
		RemoteUserStorage.prototype.messageSetSeen = function (fCallback, sFolderFullNameRaw, aUids, bSetSeen)
		{
			this.defaultRequest(fCallback, 'MessageSetSeen', {
				'Folder': sFolderFullNameRaw,
				'Uids': aUids.join(','),
				'SetAction': bSetSeen ? '1' : '0'
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sFolderFullNameRaw
		 * @param {boolean} bSetSeen
		 */
		RemoteUserStorage.prototype.messageSetSeenToAll = function (fCallback, sFolderFullNameRaw, bSetSeen)
		{
			this.defaultRequest(fCallback, 'MessageSetSeenToAll', {
				'Folder': sFolderFullNameRaw,
				'SetAction': bSetSeen ? '1' : '0'
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sMessageFolder
		 * @param {string} sMessageUid
		 * @param {string} sDraftFolder
		 * @param {string} sFrom
		 * @param {string} sTo
		 * @param {string} sCc
		 * @param {string} sBcc
		 * @param {string} sSubject
		 * @param {boolean} bTextIsHtml
		 * @param {string} sText
		 * @param {Array} aAttachments
		 * @param {(Array|null)} aDraftInfo
		 * @param {string} sInReplyTo
		 * @param {string} sReferences
		 * @param {boolean} bMarkAsImportant
		 */
		RemoteUserStorage.prototype.saveMessage = function (fCallback, sMessageFolder, sMessageUid, sDraftFolder,
			sFrom, sTo, sCc, sBcc, sSubject, bTextIsHtml, sText, aAttachments, aDraftInfo, sInReplyTo, sReferences, bMarkAsImportant)
		{
			this.defaultRequest(fCallback, 'SaveMessage', {
				'MessageFolder': sMessageFolder,
				'MessageUid': sMessageUid,
				'DraftFolder': sDraftFolder,
				'From': sFrom,
				'To': sTo,
				'Cc': sCc,
				'Bcc': sBcc,
				'Subject': sSubject,
				'TextIsHtml': bTextIsHtml ? '1' : '0',
				'Text': sText,
				'DraftInfo': aDraftInfo,
				'InReplyTo': sInReplyTo,
				'References': sReferences,
				'MarkAsImportant': bMarkAsImportant ? '1' : '0',
				'Attachments': aAttachments
			}, Consts.Defaults.SaveMessageAjaxTimeout);
		};


		/**
		 * @param {?Function} fCallback
		 * @param {string} sMessageFolder
		 * @param {string} sMessageUid
		 * @param {string} sReadReceipt
		 * @param {string} sSubject
		 * @param {string} sText
		 */
		RemoteUserStorage.prototype.sendReadReceiptMessage = function (fCallback, sMessageFolder, sMessageUid, sReadReceipt, sSubject, sText)
		{
			this.defaultRequest(fCallback, 'SendReadReceiptMessage', {
				'MessageFolder': sMessageFolder,
				'MessageUid': sMessageUid,
				'ReadReceipt': sReadReceipt,
				'Subject': sSubject,
				'Text': sText
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sMessageFolder
		 * @param {string} sMessageUid
		 * @param {string} sSentFolder
		 * @param {string} sFrom
		 * @param {string} sTo
		 * @param {string} sCc
		 * @param {string} sBcc
		 * @param {string} sSubject
		 * @param {boolean} bTextIsHtml
		 * @param {string} sText
		 * @param {Array} aAttachments
		 * @param {(Array|null)} aDraftInfo
		 * @param {string} sInReplyTo
		 * @param {string} sReferences
		 * @param {boolean} bRequestReadReceipt
		 * @param {boolean} bMarkAsImportant
		 */
		RemoteUserStorage.prototype.sendMessage = function (fCallback, sMessageFolder, sMessageUid, sSentFolder,
			sFrom, sTo, sCc, sBcc, sSubject, bTextIsHtml, sText, aAttachments, aDraftInfo, sInReplyTo, sReferences,
			bRequestReadReceipt, bMarkAsImportant)
		{
			this.defaultRequest(fCallback, 'SendMessage', {
				'MessageFolder': sMessageFolder,
				'MessageUid': sMessageUid,
				'SentFolder': sSentFolder,
				'From': sFrom,
				'To': sTo,
				'Cc': sCc,
				'Bcc': sBcc,
				'Subject': sSubject,
				'TextIsHtml': bTextIsHtml ? '1' : '0',
				'Text': sText,
				'DraftInfo': aDraftInfo,
				'InReplyTo': sInReplyTo,
				'References': sReferences,
				'ReadReceiptRequest': bRequestReadReceipt ? '1' : '0',
				'MarkAsImportant': bMarkAsImportant ? '1' : '0',
				'Attachments': aAttachments
			}, Consts.Defaults.SendMessageAjaxTimeout);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {Object} oData
		 */
		RemoteUserStorage.prototype.saveSystemFolders = function (fCallback, oData)
		{
			this.defaultRequest(fCallback, 'SystemFoldersUpdate', oData);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {Object} oData
		 */
		RemoteUserStorage.prototype.saveSettings = function (fCallback, oData)
		{
			this.defaultRequest(fCallback, 'SettingsUpdate', oData);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sPrevPassword
		 * @param {string} sNewPassword
		 */
		RemoteUserStorage.prototype.changePassword = function (fCallback, sPrevPassword, sNewPassword)
		{
			this.defaultRequest(fCallback, 'ChangePassword', {
				'PrevPassword': sPrevPassword,
				'NewPassword': sNewPassword
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sNewFolderName
		 * @param {string} sParentName
		 */
		RemoteUserStorage.prototype.folderCreate = function (fCallback, sNewFolderName, sParentName)
		{
			this.defaultRequest(fCallback, 'FolderCreate', {
				'Folder': sNewFolderName,
				'Parent': sParentName
			}, null, '', ['Folders']);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sFolderFullNameRaw
		 */
		RemoteUserStorage.prototype.folderDelete = function (fCallback, sFolderFullNameRaw)
		{
			this.defaultRequest(fCallback, 'FolderDelete', {
				'Folder': sFolderFullNameRaw
			}, null, '', ['Folders']);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sPrevFolderFullNameRaw
		 * @param {string} sNewFolderName
		 */
		RemoteUserStorage.prototype.folderRename = function (fCallback, sPrevFolderFullNameRaw, sNewFolderName)
		{
			this.defaultRequest(fCallback, 'FolderRename', {
				'Folder': sPrevFolderFullNameRaw,
				'NewFolderName': sNewFolderName
			}, null, '', ['Folders']);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sFolderFullNameRaw
		 */
		RemoteUserStorage.prototype.folderClear = function (fCallback, sFolderFullNameRaw)
		{
			this.defaultRequest(fCallback, 'FolderClear', {
				'Folder': sFolderFullNameRaw
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sFolderFullNameRaw
		 * @param {boolean} bSubscribe
		 */
		RemoteUserStorage.prototype.folderSetSubscribe = function (fCallback, sFolderFullNameRaw, bSubscribe)
		{
			this.defaultRequest(fCallback, 'FolderSubscribe', {
				'Folder': sFolderFullNameRaw,
				'Subscribe': bSubscribe ? '1' : '0'
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sFolder
		 * @param {string} sToFolder
		 * @param {Array} aUids
		 * @param {string=} sLearning
		 */
		RemoteUserStorage.prototype.messagesMove = function (fCallback, sFolder, sToFolder, aUids, sLearning)
		{
			this.defaultRequest(fCallback, 'MessageMove', {
				'FromFolder': sFolder,
				'ToFolder': sToFolder,
				'Uids': aUids.join(','),
				'Learning': sLearning || ''
			}, null, '', ['MessageList']);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sFolder
		 * @param {string} sToFolder
		 * @param {Array} aUids
		 */
		RemoteUserStorage.prototype.messagesCopy = function (fCallback, sFolder, sToFolder, aUids)
		{
			this.defaultRequest(fCallback, 'MessageCopy', {
				'FromFolder': sFolder,
				'ToFolder': sToFolder,
				'Uids': aUids.join(',')
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sFolder
		 * @param {Array} aUids
		 */
		RemoteUserStorage.prototype.messagesDelete = function (fCallback, sFolder, aUids)
		{
			this.defaultRequest(fCallback, 'MessageDelete', {
				'Folder': sFolder,
				'Uids': aUids.join(',')
			}, null, '', ['MessageList']);
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.appDelayStart = function (fCallback)
		{
			this.defaultRequest(fCallback, 'AppDelayStart');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.quota = function (fCallback)
		{
			this.defaultRequest(fCallback, 'Quota');
		};

		/**
		 * @param {?Function} fCallback
		 * @param {number} iOffset
		 * @param {number} iLimit
		 * @param {string} sSearch
		 */
		RemoteUserStorage.prototype.contacts = function (fCallback, iOffset, iLimit, sSearch)
		{
			this.defaultRequest(fCallback, 'Contacts', {
				'Offset': iOffset,
				'Limit': iLimit,
				'Search': sSearch
			}, null, '', ['Contacts']);
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sRequestUid
		 * @param {string} sUid
		 * @param {Array} aProperties
		 */
		RemoteUserStorage.prototype.contactSave = function (fCallback, sRequestUid, sUid, aProperties)
		{
			this.defaultRequest(fCallback, 'ContactSave', {
				'RequestUid': sRequestUid,
				'Uid': Utils.trim(sUid),
				'Properties': aProperties
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {Array} aUids
		 */
		RemoteUserStorage.prototype.contactsDelete = function (fCallback, aUids)
		{
			this.defaultRequest(fCallback, 'ContactsDelete', {
				'Uids': aUids.join(',')
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sQuery
		 * @param {number} iPage
		 */
		RemoteUserStorage.prototype.suggestions = function (fCallback, sQuery, iPage)
		{
			this.defaultRequest(fCallback, 'Suggestions', {
				'Query': sQuery,
				'Page': iPage
			}, null, '', ['Suggestions']);
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.clearUserBackground = function (fCallback)
		{
			this.defaultRequest(fCallback, 'ClearUserBackground');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.facebookUser = function (fCallback)
		{
			this.defaultRequest(fCallback, 'SocialFacebookUserInformation');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.facebookDisconnect = function (fCallback)
		{
			this.defaultRequest(fCallback, 'SocialFacebookDisconnect');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.twitterUser = function (fCallback)
		{
			this.defaultRequest(fCallback, 'SocialTwitterUserInformation');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.twitterDisconnect = function (fCallback)
		{
			this.defaultRequest(fCallback, 'SocialTwitterDisconnect');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.googleUser = function (fCallback)
		{
			this.defaultRequest(fCallback, 'SocialGoogleUserInformation');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.googleDisconnect = function (fCallback)
		{
			this.defaultRequest(fCallback, 'SocialGoogleDisconnect');
		};

		/**
		 * @param {?Function} fCallback
		 */
		RemoteUserStorage.prototype.socialUsers = function (fCallback)
		{
			this.defaultRequest(fCallback, 'SocialUsers');
		};

		module.exports = new RemoteUserStorage();

	}());

/***/ },
/* 15 */
/*!**********************************!*\
  !*** ./dev/Storage/User/Data.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			ko = __webpack_require__(/*! ko */ 3),
			moment = __webpack_require__(/*! moment */ 36),

			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 12),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			SettingsStore = __webpack_require__(/*! Stores/User/Settings */ 26),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),

			MessageModel = __webpack_require__(/*! Model/Message */ 81)
		;

		/**
		 * @constructor
		 */
		function DataUserStorage()
		{
			// contacts
			this.contacts = ko.observableArray([]);
			this.contacts.loading = ko.observable(false).extend({'throttle': 200});
			this.contacts.importing = ko.observable(false).extend({'throttle': 200});
			this.contacts.syncing = ko.observable(false).extend({'throttle': 200});
			this.contacts.exportingVcf = ko.observable(false).extend({'throttle': 200});
			this.contacts.exportingCsv = ko.observable(false).extend({'throttle': 200});

			this.allowContactsSync = ko.observable(false);
			this.enableContactsSync = ko.observable(false);
			this.contactsSyncUrl = ko.observable('');
			this.contactsSyncUser = ko.observable('');
			this.contactsSyncPass = ko.observable('');

			this.allowContactsSync = ko.observable(!!Settings.settingsGet('ContactsSyncIsAllowed'));
			this.enableContactsSync = ko.observable(!!Settings.settingsGet('EnableContactsSync'));
			this.contactsSyncUrl = ko.observable(Settings.settingsGet('ContactsSyncUrl'));
			this.contactsSyncUser = ko.observable(Settings.settingsGet('ContactsSyncUser'));
			this.contactsSyncPass = ko.observable(Settings.settingsGet('ContactsSyncPassword'));

			// folders
			this.namespace = '';
			this.folderList = ko.observableArray([]);
			this.folderList.focused = ko.observable(false);
			this.folderList.optimized = ko.observable(false);
			this.folderList.error = ko.observable('');

			this.foldersLoading = ko.observable(false);
			this.foldersCreating = ko.observable(false);
			this.foldersDeleting = ko.observable(false);
			this.foldersRenaming = ko.observable(false);

			this.foldersChanging = ko.computed(function () {
				var
					bLoading = this.foldersLoading(),
					bCreating = this.foldersCreating(),
					bDeleting = this.foldersDeleting(),
					bRenaming = this.foldersRenaming()
				;
				return bLoading || bCreating || bDeleting || bRenaming;
			}, this);

			this.foldersInboxUnreadCount = ko.observable(0);

			this.currentFolder = ko.observable(null).extend({'toggleSubscribe': [null,
				function (oPrev) {
					if (oPrev)
					{
						oPrev.selected(false);
					}
				}, function (oNext) {
					if (oNext)
					{
						oNext.selected(true);
					}
				}
			]});

			this.currentFolderFullNameRaw = ko.computed(function () {
				return this.currentFolder() ? this.currentFolder().fullNameRaw : '';
			}, this);

			this.currentFolderFullName = ko.computed(function () {
				return this.currentFolder() ? this.currentFolder().fullName : '';
			}, this);

			this.currentFolderFullNameHash = ko.computed(function () {
				return this.currentFolder() ? this.currentFolder().fullNameHash : '';
			}, this);

			this.currentFolderName = ko.computed(function () {
				return this.currentFolder() ? this.currentFolder().name() : '';
			}, this);

			this.folderListSystemNames = ko.computed(function () {

				var
					FolderStore = __webpack_require__(/*! Stores/User/Folder */ 32),

					aList = [Cache.getFolderInboxName()],
					aFolders = this.folderList(),
					sSentFolder = FolderStore.sentFolder(),
					sDraftFolder = FolderStore.draftFolder(),
					sSpamFolder = FolderStore.spamFolder(),
					sTrashFolder = FolderStore.trashFolder(),
					sArchiveFolder = FolderStore.archiveFolder()
				;

				if (Utils.isArray(aFolders) && 0 < aFolders.length)
				{
					if ('' !== sSentFolder && Consts.Values.UnuseOptionValue !== sSentFolder)
					{
						aList.push(sSentFolder);
					}
					if ('' !== sDraftFolder && Consts.Values.UnuseOptionValue !== sDraftFolder)
					{
						aList.push(sDraftFolder);
					}
					if ('' !== sSpamFolder && Consts.Values.UnuseOptionValue !== sSpamFolder)
					{
						aList.push(sSpamFolder);
					}
					if ('' !== sTrashFolder && Consts.Values.UnuseOptionValue !== sTrashFolder)
					{
						aList.push(sTrashFolder);
					}
					if ('' !== sArchiveFolder && Consts.Values.UnuseOptionValue !== sArchiveFolder)
					{
						aList.push(sArchiveFolder);
					}
				}

				return aList;

			}, this);

			this.folderListSystem = ko.computed(function () {
				return _.compact(_.map(this.folderListSystemNames(), function (sName) {
					return Cache.getFolderFromCacheList(sName);
				}));
			}, this);

			this.folderMenuForMove = ko.computed(function () {
				return Utils.folderListOptionsBuilder(this.folderListSystem(), this.folderList(), [
					this.currentFolderFullNameRaw()
				], null, null, null, null, function (oItem) {
					return oItem ? oItem.localName() : '';
				});
			}, this);

			this.folderMenuForFilters = ko.computed(function () {
				return Utils.folderListOptionsBuilder(this.folderListSystem(), this.folderList(),
					['INBOX'], [['', '']], null, null, null, function (oItem) {
						return oItem ? oItem.localName() : '';
					}
				);
			}, this);

			// message list
			this.staticMessageList = [];

			this.messageList = ko.observableArray([]).extend({'rateLimit': 0});

			this.messageListCount = ko.observable(0);
			this.messageListSearch = ko.observable('');
			this.messageListPage = ko.observable(1);

			this.messageListThreadFolder = ko.observable('');
			this.messageListThreadUids = ko.observableArray([]);

			this.messageListThreadFolder.subscribe(function () {
				this.messageListThreadUids([]);
			}, this);

			this.messageListEndFolder = ko.observable('');
			this.messageListEndSearch = ko.observable('');
			this.messageListEndPage = ko.observable(1);

			this.messageListEndHash = ko.computed(function () {
				return this.messageListEndFolder() + '|' + this.messageListEndSearch() + '|' + this.messageListEndPage();
			}, this);

			this.messageListPageCount = ko.computed(function () {
				var iPage = window.Math.ceil(this.messageListCount() /
					SettingsStore.messagesPerPage());
				return 0 >= iPage ? 1 : iPage;
			}, this);

			this.mainMessageListSearch = ko.computed({
				'read': this.messageListSearch,
				'write': function (sValue) {
					kn.setHash(Links.mailBox(
						this.currentFolderFullNameHash(), 1, Utils.trim(sValue.toString())
					));
				},
				'owner': this
			});

			this.messageListError = ko.observable('');

			this.messageListLoading = ko.observable(false);
			this.messageListIsNotCompleted = ko.observable(false);
			this.messageListCompleteLoadingThrottle = ko.observable(false).extend({'throttle': 200});

			this.messageListCompleteLoading = ko.computed(function () {
				var
					bOne = this.messageListLoading(),
					bTwo = this.messageListIsNotCompleted()
				;
				return bOne || bTwo;
			}, this);

			this.messageListCompleteLoading.subscribe(function (bValue) {
				this.messageListCompleteLoadingThrottle(bValue);
			}, this);

			this.messageList.subscribe(_.debounce(function (aList) {
				_.each(aList, function (oItem) {
					if (oItem.newForAnimation())
					{
						oItem.newForAnimation(false);
					}
				});
			}, 500));

			// message preview
			this.staticMessageList = new MessageModel();
			this.message = ko.observable(null);
			this.messageLoading = ko.observable(false);
			this.messageLoadingThrottle = ko.observable(false).extend({'throttle': 50});

			this.message.focused = ko.observable(false);

			this.message.subscribe(function (oMessage) {
				if (!oMessage)
				{
					this.message.focused(false);
					this.messageFullScreenMode(false);
					this.hideMessageBodies();

					if (Enums.Layout.NoPreview === SettingsStore.layout() &&
						-1 < window.location.hash.indexOf('message-preview'))
					{
						__webpack_require__(/*! App/User */ 6).historyBack();
					}
				}
				else if (Enums.Layout.NoPreview === SettingsStore.layout())
				{
					this.message.focused(true);
				}
			}, this);

			this.message.focused.subscribe(function (bValue) {
				if (bValue)
				{
					this.folderList.focused(false);
					Globals.keyScope(Enums.KeyState.MessageView);
				}
				else if (Enums.KeyState.MessageView === Globals.keyScope())
				{
					if (Enums.Layout.NoPreview === SettingsStore.layout() && this.message())
					{
						Globals.keyScope(Enums.KeyState.MessageView);
					}
					else
					{
						Globals.keyScope(Enums.KeyState.MessageList);
					}
				}
			}, this);

			this.folderList.focused.subscribe(function (bValue) {
				if (bValue)
				{
					Globals.keyScope(Enums.KeyState.FolderList);
				}
				else if (Enums.KeyState.FolderList === Globals.keyScope())
				{
					Globals.keyScope(Enums.KeyState.MessageList);
				}
			});

			this.messageLoading.subscribe(function (bValue) {
				this.messageLoadingThrottle(bValue);
			}, this);

			this.messageFullScreenMode = ko.observable(false);

			this.messageError = ko.observable('');

			this.messagesBodiesDom = ko.observable(null);

			this.messagesBodiesDom.subscribe(function (oDom) {
				if (oDom && !(oDom instanceof $))
				{
					this.messagesBodiesDom($(oDom));
				}
			}, this);

			this.messageActiveDom = ko.observable(null);

			this.isMessageSelected = ko.computed(function () {
				return null !== this.message();
			}, this);

			this.currentMessage = ko.observable(null);

			this.messageListChecked = ko.computed(function () {
				return _.filter(this.messageList(), function (oItem) {
					return oItem.checked();
				});
			}, this).extend({'rateLimit': 0});

			this.hasCheckedMessages = ko.computed(function () {
				return 0 < this.messageListChecked().length;
			}, this).extend({'rateLimit': 0});

			this.messageListCheckedOrSelected = ko.computed(function () {

				var
					aChecked = this.messageListChecked(),
					oSelectedMessage = this.currentMessage()
				;

				return _.union(aChecked, oSelectedMessage ? [oSelectedMessage] : []);

			}, this);

			this.messageListCheckedOrSelectedUidsWithSubMails = ko.computed(function () {
				var aList = [];
				_.each(this.messageListCheckedOrSelected(), function (oMessage) {
					if (oMessage)
					{
						aList.push(oMessage.uid);
						if (0 < oMessage.threadsLen() && 0 === oMessage.parentUid() && oMessage.lastInCollapsedThread())
						{
							aList = _.union(aList, oMessage.threads());
						}
					}
				});
				return aList;
			}, this);

			// other
			this.composeInEdit = ko.observable(false);

			this.purgeMessageBodyCacheThrottle = _.throttle(this.purgeMessageBodyCache, 1000 * 30);
		}

		DataUserStorage.prototype.purgeMessageBodyCache = function()
		{
			var
				iCount = 0,
				oMessagesBodiesDom = null,
				iEnd = Globals.iMessageBodyCacheCount - Consts.Values.MessageBodyCacheLimit
			;

			if (0 < iEnd)
			{
				oMessagesBodiesDom = this.messagesBodiesDom();
				if (oMessagesBodiesDom)
				{
					oMessagesBodiesDom.find('.rl-cache-class').each(function () {
						var oItem = $(this);
						if (iEnd > oItem.data('rl-cache-count'))
						{
							oItem.addClass('rl-cache-purge');
							iCount++;
						}
					});

					if (0 < iCount)
					{
						_.delay(function () {
							oMessagesBodiesDom.find('.rl-cache-purge').remove();
						}, 300);
					}
				}
			}
		};

		DataUserStorage.prototype.initUidNextAndNewMessages = function (sFolder, sUidNext, aNewMessages)
		{
			if (Cache.getFolderInboxName() === sFolder && Utils.isNormal(sUidNext) && sUidNext !== '')
			{
				if (Utils.isArray(aNewMessages) && 0 < aNewMessages.length)
				{
					var
						iIndex = 0,
						iLen = aNewMessages.length,
						NotificationStore = __webpack_require__(/*! Stores/User/Notification */ 66)
					;

					_.each(aNewMessages, function (oItem) {
						Cache.addNewMessageCache(sFolder, oItem.Uid);
					});

					NotificationStore.playSoundNotification();

					if (3 < iLen)
					{
						NotificationStore.displayDesktopNotification(
							Links.notificationMailIcon(),
							__webpack_require__(/*! Stores/User/Account */ 22).email(),
							Translator.i18n('MESSAGE_LIST/NEW_MESSAGE_NOTIFICATION', {
								'COUNT': iLen
							})
						);
					}
					else
					{
						for (; iIndex < iLen; iIndex++)
						{
							NotificationStore.displayDesktopNotification(
								Links.notificationMailIcon(),
								MessageModel.emailsToLine(MessageModel.initEmailsFromJson(aNewMessages[iIndex].From), false),
								aNewMessages[iIndex].Subject
							);
						}
					}
				}

				Cache.setFolderUidNext(sFolder, sUidNext);
			}
		};

		DataUserStorage.prototype.hideMessageBodies = function ()
		{
			var oMessagesBodiesDom = this.messagesBodiesDom();
			if (oMessagesBodiesDom)
			{
				oMessagesBodiesDom.find('.b-text-part').hide();
			}
		};

		/**
		 * @param {boolean=} bBoot = false
		 * @returns {Array}
		 */
		DataUserStorage.prototype.getNextFolderNames = function (bBoot)
		{
			bBoot = Utils.isUnd(bBoot) ? false : !!bBoot;

			var
				aResult = [],
				iLimit = 5,
				iUtc = moment().unix(),
				iTimeout = iUtc - 60 * 5,
				aTimeouts = [],
				sInboxFolderName = Cache.getFolderInboxName(),
				fSearchFunction = function (aList) {
					_.each(aList, function (oFolder) {
						if (oFolder && sInboxFolderName !== oFolder.fullNameRaw &&
							oFolder.selectable && oFolder.existen &&
							iTimeout > oFolder.interval &&
							(!bBoot || oFolder.subScribed()))
						{
							aTimeouts.push([oFolder.interval, oFolder.fullNameRaw]);
						}

						if (oFolder && 0 < oFolder.subFolders().length)
						{
							fSearchFunction(oFolder.subFolders());
						}
					});
				}
			;

			fSearchFunction(this.folderList());

			aTimeouts.sort(function(a, b) {
				if (a[0] < b[0]) {
					return -1;
				} else if (a[0] > b[0]) {
					return 1;
				}

				return 0;
			});

			_.find(aTimeouts, function (aItem) {
				var oFolder = Cache.getFolderFromCacheList(aItem[1]);
				if (oFolder)
				{
					oFolder.interval = iUtc;
					aResult.push(aItem[1]);
				}

				return iLimit <= aResult.length;
			});

			return _.uniq(aResult);
		};

		/**
		 * @param {string} sFromFolderFullNameRaw
		 * @param {Array} aUidForRemove
		 * @param {string=} sToFolderFullNameRaw = ''
		 * @param {bCopy=} bCopy = false
		 */
		DataUserStorage.prototype.removeMessagesFromList = function (
			sFromFolderFullNameRaw, aUidForRemove, sToFolderFullNameRaw, bCopy)
		{
			sToFolderFullNameRaw = Utils.isNormal(sToFolderFullNameRaw) ? sToFolderFullNameRaw : '';
			bCopy = Utils.isUnd(bCopy) ? false : !!bCopy;

			aUidForRemove = _.map(aUidForRemove, function (mValue) {
				return Utils.pInt(mValue);
			});

			var
				self = this,
				iUnseenCount = 0,
				aMessageList = this.messageList(),
				oFromFolder = Cache.getFolderFromCacheList(sFromFolderFullNameRaw),
				oToFolder = '' === sToFolderFullNameRaw ? null : Cache.getFolderFromCacheList(sToFolderFullNameRaw || ''),
				sCurrentFolderFullNameRaw = this.currentFolderFullNameRaw(),
				oCurrentMessage = this.message(),
				aMessages = sCurrentFolderFullNameRaw === sFromFolderFullNameRaw ? _.filter(aMessageList, function (oMessage) {
					return oMessage && -1 < Utils.inArray(Utils.pInt(oMessage.uid), aUidForRemove);
				}) : []
			;

			_.each(aMessages, function (oMessage) {
				if (oMessage && oMessage.unseen())
				{
					iUnseenCount++;
				}
			});

			if (oFromFolder && !bCopy)
			{
				oFromFolder.messageCountAll(0 <= oFromFolder.messageCountAll() - aUidForRemove.length ?
					oFromFolder.messageCountAll() - aUidForRemove.length : 0);

				if (0 < iUnseenCount)
				{
					oFromFolder.messageCountUnread(0 <= oFromFolder.messageCountUnread() - iUnseenCount ?
						oFromFolder.messageCountUnread() - iUnseenCount : 0);
				}
			}

			if (oToFolder)
			{
				oToFolder.messageCountAll(oToFolder.messageCountAll() + aUidForRemove.length);
				if (0 < iUnseenCount)
				{
					oToFolder.messageCountUnread(oToFolder.messageCountUnread() + iUnseenCount);
				}

				oToFolder.actionBlink(true);
			}

			if (0 < aMessages.length)
			{
				if (bCopy)
				{
					_.each(aMessages, function (oMessage) {
						oMessage.checked(false);
					});
				}
				else
				{
					this.messageListIsNotCompleted(true);

					_.each(aMessages, function (oMessage) {
						if (oCurrentMessage && oCurrentMessage.hash === oMessage.hash)
						{
							oCurrentMessage = null;
							self.message(null);
						}

						oMessage.deleted(true);
					});

					_.delay(function () {
						_.each(aMessages, function (oMessage) {
							self.messageList.remove(oMessage);
						});
					}, 400);
				}
			}

			if ('' !== sFromFolderFullNameRaw)
			{
				Cache.setFolderHash(sFromFolderFullNameRaw, '');
			}

			if ('' !== sToFolderFullNameRaw)
			{
				Cache.setFolderHash(sToFolderFullNameRaw, '');
			}
		};

		/**
		 * @param {Object} oMessageTextBody
		 */
		DataUserStorage.prototype.initBlockquoteSwitcher = function (oMessageTextBody)
		{
			if (oMessageTextBody)
			{
				var $oList = $('blockquote:not(.rl-bq-switcher)', oMessageTextBody).filter(function () {
					return 0 === $(this).parent().closest('blockquote', oMessageTextBody).length;
				});

				if ($oList && 0 < $oList.length)
				{
					_.delay(function () {
						$oList.each(function () {
							var $self = $(this), iH = $self.height();
							if (0 === iH || 150 < iH)
							{
								$self.addClass('rl-bq-switcher hidden-bq');
								$('<span class="rlBlockquoteSwitcher"><i class="icon-ellipsis" /></span>')
									.insertBefore($self)
									.click(function () {
										$self.toggleClass('hidden-bq');
										Utils.windowResize();
									})
									.after('<br />')
									.before('<br />')
								;
							}
						});
					}, 100);
				}
			}
		};

		DataUserStorage.prototype.setMessage = function (oData, bCached)
		{
			var
				bIsHtml = false,
				bHasExternals = false,
				bHasInternals = false,
				oBody = null,
				oTextBody = null,
				sId = '',
				sResultHtml = '',
				bPgpSigned = false,
				bPgpEncrypted = false,
				oMessagesBodiesDom = this.messagesBodiesDom(),
				oMessage = this.message()
			;

			if (oData && oMessage && oData.Result && 'Object/Message' === oData.Result['@Object'] &&
				oMessage.folderFullNameRaw === oData.Result.Folder && oMessage.uid === oData.Result.Uid)
			{
				this.messageError('');

				oMessage.initUpdateByMessageJson(oData.Result);
				Cache.addRequestedMessage(oMessage.folderFullNameRaw, oMessage.uid);

				if (!bCached)
				{
					oMessage.initFlagsByJson(oData.Result);
				}

				oMessagesBodiesDom = oMessagesBodiesDom && oMessagesBodiesDom[0] ? oMessagesBodiesDom : null;
				if (oMessagesBodiesDom)
				{
					sId = 'rl-mgs-' + oMessage.hash.replace(/[^a-zA-Z0-9]/g, '');
					oTextBody = oMessagesBodiesDom.find('#' + sId);
					if (!oTextBody || !oTextBody[0])
					{
						bHasExternals = !!oData.Result.HasExternals;
						bHasInternals = !!oData.Result.HasInternals;

						oBody = $('<div id="' + sId + '" />').hide().addClass('rl-cache-class');
						oBody.data('rl-cache-count', ++Globals.iMessageBodyCacheCount);

						if (Utils.isNormal(oData.Result.Html) && '' !== oData.Result.Html)
						{
							bIsHtml = true;
							sResultHtml = oData.Result.Html.toString();
						}
						else if (Utils.isNormal(oData.Result.Plain) && '' !== oData.Result.Plain)
						{
							bIsHtml = false;
							sResultHtml = Utils.plainToHtml(oData.Result.Plain.toString(), false);

							if ((oMessage.isPgpSigned() || oMessage.isPgpEncrypted()) && __webpack_require__(/*! Stores/User/Pgp */ 20).capaOpenPGP())
							{
								oMessage.plainRaw = Utils.pString(oData.Result.Plain);

								bPgpEncrypted = /---BEGIN PGP MESSAGE---/.test(oMessage.plainRaw);
								if (!bPgpEncrypted)
								{
									bPgpSigned = /-----BEGIN PGP SIGNED MESSAGE-----/.test(oMessage.plainRaw) &&
										/-----BEGIN PGP SIGNATURE-----/.test(oMessage.plainRaw);
								}

								Globals.$div.empty();
								if (bPgpSigned && oMessage.isPgpSigned())
								{
									sResultHtml =
										Globals.$div.append(
											$('<pre class="b-plain-openpgp signed"></pre>').text(oMessage.plainRaw)
										).html()
									;
								}
								else if (bPgpEncrypted && oMessage.isPgpEncrypted())
								{
									sResultHtml =
										Globals.$div.append(
											$('<pre class="b-plain-openpgp encrypted"></pre>').text(oMessage.plainRaw)
										).html()
									;
								}

								Globals.$div.empty();

								oMessage.isPgpSigned(bPgpSigned);
								oMessage.isPgpEncrypted(bPgpEncrypted);
							}
						}
						else
						{
							bIsHtml = false;
						}

						oBody
							.html(Utils.findEmailAndLinks(sResultHtml))
							.addClass('b-text-part ' + (bIsHtml ? 'html' : 'plain'))
						;

						oMessage.isHtml(!!bIsHtml);
						oMessage.hasImages(!!bHasExternals);
						oMessage.pgpSignedVerifyStatus(Enums.SignedVerifyStatus.None);
						oMessage.pgpSignedVerifyUser('');

						oMessage.body = oBody;
						if (oMessage.body)
						{
							oMessagesBodiesDom.append(oMessage.body);
						}

						oMessage.storeDataToDom();

						if (bHasInternals)
						{
							oMessage.showInternalImages(true);
						}

						if (oMessage.hasImages() && SettingsStore.showImages())
						{
							oMessage.showExternalImages(true);
						}

						this.purgeMessageBodyCacheThrottle();
					}
					else
					{
						oMessage.body = oTextBody;
						if (oMessage.body)
						{
							oMessage.body.data('rl-cache-count', ++Globals.iMessageBodyCacheCount);
							oMessage.fetchDataToDom();
						}
					}

					this.messageActiveDom(oMessage.body);

					this.hideMessageBodies();
					oMessage.body.show();

					if (oBody)
					{
						this.initBlockquoteSwitcher(oBody);
					}
				}

				Cache.initMessageFlagsFromCache(oMessage);
				if (oMessage.unseen())
				{
					__webpack_require__(/*! App/User */ 6).setMessageSeen(oMessage);
				}

				Utils.windowResize();
			}
		};

		/**
		 * @param {Array} aList
		 * @returns {string}
		 */
		DataUserStorage.prototype.calculateMessageListHash = function (aList)
		{
			return _.map(aList, function (oMessage) {
				return '' + oMessage.hash + '_' + oMessage.threadsLen() + '_' + oMessage.flagHash();
			}).join('|');
		};

		DataUserStorage.prototype.findPublicKeyByHex = function (sHash)
		{
			return _.find(__webpack_require__(/*! Stores/User/Pgp */ 20).openpgpkeysPublic(), function (oItem) {
				return oItem && sHash === oItem.id;
			});
		};

		DataUserStorage.prototype.findPublicKeysByEmail = function (sEmail)
		{
			var self = this;
			return _.compact(_.map(__webpack_require__(/*! Stores/User/Pgp */ 20).openpgpkeysPublic(), function (oItem) {

				var oKey = null;
				if (oItem && sEmail === oItem.email)
				{
					try
					{
						oKey = self.openpgp.key.readArmored(oItem.armor);
						if (oKey && !oKey.err && oKey.keys && oKey.keys[0])
						{
							return oKey.keys[0];
						}
					}
					catch (e) {}
				}

				return null;

			}));
		};

		/**
		 * @param {string} sEmail
		 * @param {string=} sPassword
		 * @returns {?}
		 */
		DataUserStorage.prototype.findPrivateKeyByEmail = function (sEmail, sPassword)
		{
			var
				self = this,
				oPrivateKey = null,
				oKey = _.find(__webpack_require__(/*! Stores/User/Pgp */ 20).openpgpkeysPrivate(), function (oItem) {
					return oItem && sEmail === oItem.email;
				})
			;

			if (oKey)
			{
				try
				{
					oPrivateKey = self.openpgp.key.readArmored(oKey.armor);
					if (oPrivateKey && !oPrivateKey.err && oPrivateKey.keys && oPrivateKey.keys[0])
					{
						oPrivateKey = oPrivateKey.keys[0];
						oPrivateKey.decrypt(Utils.pString(sPassword));
					}
					else
					{
						oPrivateKey = null;
					}
				}
				catch (e)
				{
					oPrivateKey = null;
				}
			}

			return oPrivateKey;
		};

		/**
		 * @param {string=} sPassword
		 * @returns {?}
		 */
		DataUserStorage.prototype.findSelfPrivateKey = function (sPassword)
		{
			return this.findPrivateKeyByEmail(__webpack_require__(/*! Stores/User/Account */ 22).email(), sPassword);
		};

		module.exports = new DataUserStorage();

	}());


/***/ },
/* 16 */
/*!******************************!*\
  !*** ./dev/Common/Consts.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {
	(function () {

		'use strict';

		var Consts = {};

		Consts.Values = {};
		Consts.DataImages = {};
		Consts.Defaults = {};

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.MessagesPerPage = 20;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.ContactsPerPage = 50;

		/**
		 * @const
		 * @type {Array}
		 */
		Consts.Defaults.MessagesPerPageArray = [10, 20, 30, 50, 100/*, 150, 200, 300*/];

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.DefaultAjaxTimeout = 30000;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.SearchAjaxTimeout = 300000;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.SendMessageAjaxTimeout = 300000;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.SaveMessageAjaxTimeout = 200000;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Defaults.ContactsSyncAjaxTimeout = 200000;

		/**
		 * @const
		 * @type {string}
		 */
		Consts.Values.UnuseOptionValue = '__UNUSE__';

		/**
		 * @const
		 * @type {string}
		 */
		Consts.Values.ClientSideStorageIndexName = 'rlcsc';

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.ImapDefaulPort = 143;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.ImapDefaulSecurePort = 993;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.SieveDefaulPort = 4190;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.SmtpDefaulPort = 25;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.SmtpDefaulSecurePort = 465;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.MessageBodyCacheLimit = 15;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.AjaxErrorLimit = 7;

		/**
		 * @const
		 * @type {number}
		 */
		Consts.Values.TokenErrorLimit = 10;

		/**
		 * @const
		 * @type {string}
		 */
		Consts.Values.RainLoopTrialKey = 'RAINLOOP-TRIAL-KEY';

		/**
		 * @const
		 * @type {string}
		 */
	//	Consts.DataImages.UserDotPic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2P8DwQACgAD/il4QJ8AAAAASUVORK5CYII=';
		Consts.DataImages.UserDotPic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAYAAABXuSs3AAAHHklEQVRoQ7VZW08bVxCeXRuwIbTGXIwNtBBaqjwgVUiR8lDlbza9qe1DpVZ9aNQ/0KpPeaJK07SpcuEeCEmUAObm21bfrL9lONjexSYrWfbunj37zXdmvpkz9oIgCKTD0Wg0xPd94TDP83Q0zvWa50vzklSrdanVanqf4/D84GBGr+F+Op3S8fqoJxLOdnZgTvsO/nYhenHA+UC7CWF1uXwkb9++ldPTUwVerVbVqFQqpR8YPjQ0JCMjI5LNDijoRgP3PQVu5+5Eor2XGLg7IV4GkIdHJ/LmzRs5ODiIwNbrdR0O0GCcq4Xz4eFhmZyclP7+tDQaIik/BG5XKQn4SwG3zJTLZXn9+rUclI8UHD5YVoDDN8bSzXhONwL48fFxGR4eilzFZT1uFRIB5yT8BqCdnR3Z3d0VP9Un6XRawYJpggVrZBv38ME4XKtUKnLt2jUplUoy1PR/l3U7T6sVSAQcgMAkj8PDQ9ne3pajoyMRL7zeKsYZWHgWYDGmv78/mmdwcFA+mJlSgziHDWrERrsjEXDXegTi1tZW+DLxI2bxIrqFNYTXyDyCFweMAHCwb8e4RnTNuOsqe3t7sra21pTD0Kct666E8XlcZyzw9/RUUXK5nK5oUinUQI6TQ3cynO/v78vq6qrKXCNwlTiJJpyNGc3nZHp6uqV2dwrQWOCtZBDAV1ZWwsQk7f0wiQn5kffbAu/0/KWBYzIC1+XukfGx0RGZmppKlC2tIV0Bh4aDcZW7HhkfH8urLLZL7T2pihvlkMNnz56FiadHxicL41IsFpN41bkxsYxbRdFo9jwB8KdPn14J8KnSpBQKhQs63nPmbCVRcBUAR2Lq1VVmpksyMTFxAXjcEsQybiegESionjx5osCZOeNe1O4+EhCAX7bQSgQcxRHTMgAgcz5+/Dis/hL4uHU3/B4YGNASGHIKxuEql0k+l05AeIAF1vPnz5VxFFmdDlaJrMtZITJeSsXCOTlMunKxjLtMYOKNjQ158eJFuAuKkUOb5sEwgff19SkJUBVkThZUbnXZrtCKBQ6gbnWIkjZpyne3ejAWoGnA7Icz6irvBLgbOMicCM6TkxPx/LAkbXfgWcsazuE2kFRsKD5Z+CiqDumKncpZvieWcS6dDVD8xiYCNflpJdwcdwJOf9airLmVQ7DPzMxIYWLsXGXoVqLt5k0M3K3JUVPDZdbWNzsCp48TPFdvdnZWUz32nDha7bJ63kgAJPzSdRks9/Kf9xMJAQ1gq2NpaUmy2Yz4zar4nQC3xb99AQwCcGzLAAwuhG8YiWvcOKts+r4GOe5nMhm5efOm9lUA3E3vSZJRrKvE0fnPv//Jy5cvo5cTHIPQbSjhOoqq69evS19f6lxDKK4+sVhigZPtKJqbrQeqxd5+WR4+fKgqgT0k2XX3nhiPgETWXFhYkFzuPZ2yVq1GTSOXpE47/VjgNnD4m4GG7/LhsTx69EiwD4Vr2MwIIxgbAH18fKx1yfz8vEogNvGtWnCuhLZa9UTAreVWFsHy/b/+Vrbdl7E5REMQD2jDoUbByty+/ZnU64GkU2HzyJLhktU1cLv8nARgkYS2d3ajAgwG8qU2oLmDZ92CMaOjo7K4uCiZgbDWaRWgnZhPxLhrMUCvr69riwKZk1LHF7XqrWAO9hJxH6ozNzcnCx/PqztZg9mf6SQMscCtm2C5ke4BGMlHWTUp36036AJajDVrFMzBrhhWslQsSrFYiOqVpMriNYIgqFRq2j3FAb/zffT6zuxFXxsNzs3NTXn16lW4gYiW96w1FyedF+83xG/2FNGCRpU4NjamMsn+OZ9xE5RXqdaDdPpib6RWCzuwKF9RxqI2AVNQBwQYJoK0wdBejnqtEikP3pfP51XjUTESl12FqJEKxsEorARYDD44ONTeID7YpsEnrRvQfWAI2e8WfDaTUSIwJ0iBCmFOtOUAHvVMPp/TPwvYFVYFIuP8l+DBgwdaa2Miqwa0GgYwfeMltovbDfh6c1vIgMYcliSsKv4IWFr6VDHxvldvBAH+1sA+cnl5WYOPmmr9ir+1l9I0Cgz0yjhXjfJJ0JROnmezWbl165ayr/5fqwcBNr7IfhjMqKcvESSM4eRcCasQ3bDNObmKPLdGUGpZsN24cUNLBm9zazu4d++e6qpNBFaTuUS26U5dpuR1CxyA7J9ddrMRqlz4pwLLYawymPd++/2PADt2ugcGwq9gCCdhQ96C6xWwa6j1ceuq+I0EhW0i8MAIVJfeL3d/DVD8EKi12P6/2S2jV/EccVB54O/ejz/9HGCpoBBMta5rXMXLu53D1XAwjhXwvvv+h4BAXVe4bOu3O3ChxF08LiZFG3fel199G9CH3fLyqv24NcB44MRhpdK788U3CpyKwsCw590xmfSpzsBt0Fqc3ud3vtZigxWcVZCklVpSiN0w3q5E/h9TGMIUuA3+EQAAAABJRU5ErkJggg==';

		/**
		 * @const
		 * @type {string}
		 */
		Consts.DataImages.TranspPic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=';

		module.exports = Consts;

	}(module));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! (webpack)/buildin/module.js */ 70)(module)))

/***/ },
/* 17 */,
/* 18 */,
/* 19 */
/*!***********************************!*\
  !*** ./dev/Storage/User/Cache.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 12),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function CacheUserStorage()
		{
			this.oFoldersCache = {};
			this.oFoldersNamesCache = {};
			this.oFolderHashCache = {};
			this.oFolderUidNextCache = {};
			this.oMessageListHashCache = {};
			this.oMessageFlagsCache = {};
			this.oNewMessage = {};
			this.oRequestedMessage = {};

			this.bCapaGravatar = Settings.capa(Enums.Capa.Gravatar);
		}

		/**
		 * @type {boolean}
		 */
		CacheUserStorage.prototype.bCapaGravatar = false;

		/**
		 * @type {Object}
		 */
		CacheUserStorage.prototype.oFoldersCache = {};

		/**
		 * @type {Object}
		 */
		CacheUserStorage.prototype.oFoldersNamesCache = {};

		/**
		 * @type {Object}
		 */
		CacheUserStorage.prototype.oFolderHashCache = {};

		/**
		 * @type {Object}
		 */
		CacheUserStorage.prototype.oFolderUidNextCache = {};

		/**
		 * @type {Object}
		 */
		CacheUserStorage.prototype.oMessageListHashCache = {};

		/**
		 * @type {Object}
		 */
		CacheUserStorage.prototype.oMessageFlagsCache = {};

		/**
		 * @type {Object}
		 */
		CacheUserStorage.prototype.oBodies = {};

		/**
		 * @type {Object}
		 */
		CacheUserStorage.prototype.oNewMessage = {};

		/**
		 * @type {Object}
		 */
		CacheUserStorage.prototype.oRequestedMessage = {};

		CacheUserStorage.prototype.clear = function ()
		{
			this.oFoldersCache = {};
			this.oFoldersNamesCache = {};
			this.oFolderHashCache = {};
			this.oFolderUidNextCache = {};
			this.oMessageListHashCache = {};
			this.oMessageFlagsCache = {};
			this.oBodies = {};
		};


		/**
		 * @param {string} sEmail
		 * @param {Function} fCallback
		 * @return {string}
		 */
		CacheUserStorage.prototype.getUserPic = function (sEmail, fCallback)
		{
			sEmail = Utils.trim(sEmail);
			fCallback(this.bCapaGravatar && '' !== sEmail ? Links.avatarLink(sEmail) : '', sEmail);
		};

		/**
		 * @param {string} sFolderFullNameRaw
		 * @param {string} sUid
		 * @return {string}
		 */
		CacheUserStorage.prototype.getMessageKey = function (sFolderFullNameRaw, sUid)
		{
			return sFolderFullNameRaw + '#' + sUid;
		};

		/**
		 * @param {string} sFolder
		 * @param {string} sUid
		 */
		CacheUserStorage.prototype.addRequestedMessage = function (sFolder, sUid)
		{
			this.oRequestedMessage[this.getMessageKey(sFolder, sUid)] = true;
		};

		/**
		 * @param {string} sFolder
		 * @param {string} sUid
		 * @return {boolean}
		 */
		CacheUserStorage.prototype.hasRequestedMessage = function (sFolder, sUid)
		{
			return true === this.oRequestedMessage[this.getMessageKey(sFolder, sUid)];
		};

		/**
		 * @param {string} sFolderFullNameRaw
		 * @param {string} sUid
		 */
		CacheUserStorage.prototype.addNewMessageCache = function (sFolderFullNameRaw, sUid)
		{
			this.oNewMessage[this.getMessageKey(sFolderFullNameRaw, sUid)] = true;
		};

		/**
		 * @param {string} sFolderFullNameRaw
		 * @param {string} sUid
		 */
		CacheUserStorage.prototype.hasNewMessageAndRemoveFromCache = function (sFolderFullNameRaw, sUid)
		{
			if (this.oNewMessage[this.getMessageKey(sFolderFullNameRaw, sUid)])
			{
				this.oNewMessage[this.getMessageKey(sFolderFullNameRaw, sUid)] = null;
				return true;
			}

			return false;
		};

		CacheUserStorage.prototype.clearNewMessageCache = function ()
		{
			this.oNewMessage = {};
		};

		/**
		 * @type {string}
		 */
		CacheUserStorage.prototype.sInboxFolderName = '';

		/**
		 * @return {string}
		 */
		CacheUserStorage.prototype.getFolderInboxName = function ()
		{
			return '' === this.sInboxFolderName ? 'INBOX' : this.sInboxFolderName;
		};

		/**
		 * @param {string} sFolderHash
		 * @return {string}
		 */
		CacheUserStorage.prototype.getFolderFullNameRaw = function (sFolderHash)
		{
			return '' !== sFolderHash && this.oFoldersNamesCache[sFolderHash] ? this.oFoldersNamesCache[sFolderHash] : '';
		};

		/**
		 * @param {string} sFolderHash
		 * @param {string} sFolderFullNameRaw
		 */
		CacheUserStorage.prototype.setFolderFullNameRaw = function (sFolderHash, sFolderFullNameRaw)
		{
			this.oFoldersNamesCache[sFolderHash] = sFolderFullNameRaw;
			if ('INBOX' === sFolderFullNameRaw || '' === this.sInboxFolderName)
			{
				this.sInboxFolderName = sFolderFullNameRaw;
			}
		};

		/**
		 * @param {string} sFolderFullNameRaw
		 * @return {string}
		 */
		CacheUserStorage.prototype.getFolderHash = function (sFolderFullNameRaw)
		{
			return '' !== sFolderFullNameRaw && this.oFolderHashCache[sFolderFullNameRaw] ? this.oFolderHashCache[sFolderFullNameRaw] : '';
		};

		/**
		 * @param {string} sFolderFullNameRaw
		 * @param {string} sFolderHash
		 */
		CacheUserStorage.prototype.setFolderHash = function (sFolderFullNameRaw, sFolderHash)
		{
			this.oFolderHashCache[sFolderFullNameRaw] = sFolderHash;
		};

		/**
		 * @param {string} sFolderFullNameRaw
		 * @return {string}
		 */
		CacheUserStorage.prototype.getFolderUidNext = function (sFolderFullNameRaw)
		{
			return '' !== sFolderFullNameRaw && this.oFolderUidNextCache[sFolderFullNameRaw] ? this.oFolderUidNextCache[sFolderFullNameRaw] : '';
		};

		/**
		 * @param {string} sFolderFullNameRaw
		 * @param {string} sUidNext
		 */
		CacheUserStorage.prototype.setFolderUidNext = function (sFolderFullNameRaw, sUidNext)
		{
			this.oFolderUidNextCache[sFolderFullNameRaw] = sUidNext;
		};

		/**
		 * @param {string} sFolderFullNameRaw
		 * @return {?FolderModel}
		 */
		CacheUserStorage.prototype.getFolderFromCacheList = function (sFolderFullNameRaw)
		{
			return '' !== sFolderFullNameRaw && this.oFoldersCache[sFolderFullNameRaw] ? this.oFoldersCache[sFolderFullNameRaw] : null;
		};

		/**
		 * @param {string} sFolderFullNameRaw
		 * @param {?FolderModel} oFolder
		 */
		CacheUserStorage.prototype.setFolderToCacheList = function (sFolderFullNameRaw, oFolder)
		{
			this.oFoldersCache[sFolderFullNameRaw] = oFolder;
		};

		/**
		 * @param {string} sFolderFullNameRaw
		 */
		CacheUserStorage.prototype.removeFolderFromCacheList = function (sFolderFullNameRaw)
		{
			this.setFolderToCacheList(sFolderFullNameRaw, null);
		};

		/**
		 * @param {string} sFolderFullName
		 * @param {string} sUid
		 * @return {?Array}
		 */
		CacheUserStorage.prototype.getMessageFlagsFromCache = function (sFolderFullName, sUid)
		{
			return this.oMessageFlagsCache[sFolderFullName] && this.oMessageFlagsCache[sFolderFullName][sUid] ?
				this.oMessageFlagsCache[sFolderFullName][sUid] : null;
		};

		/**
		 * @param {string} sFolderFullName
		 * @param {string} sUid
		 * @param {Array} aFlagsCache
		 */
		CacheUserStorage.prototype.setMessageFlagsToCache = function (sFolderFullName, sUid, aFlagsCache)
		{
			if (!this.oMessageFlagsCache[sFolderFullName])
			{
				this.oMessageFlagsCache[sFolderFullName] = {};
			}

			this.oMessageFlagsCache[sFolderFullName][sUid] = aFlagsCache;
		};

		/**
		 * @param {string} sFolderFullName
		 */
		CacheUserStorage.prototype.clearMessageFlagsFromCacheByFolder = function (sFolderFullName)
		{
			this.oMessageFlagsCache[sFolderFullName] = {};
		};

		/**
		 * @param {(MessageModel|null)} oMessage
		 */
		CacheUserStorage.prototype.initMessageFlagsFromCache = function (oMessage)
		{
			if (oMessage)
			{
				var
					self = this,
					aFlags = this.getMessageFlagsFromCache(oMessage.folderFullNameRaw, oMessage.uid),
					mUnseenSubUid = null,
					mFlaggedSubUid = null
				;

				if (aFlags && 0 < aFlags.length)
				{
					oMessage.unseen(!!aFlags[0]);
					oMessage.flagged(!!aFlags[1]);
					oMessage.answered(!!aFlags[2]);
					oMessage.forwarded(!!aFlags[3]);
					oMessage.isReadReceipt(!!aFlags[4]);
				}

				if (0 < oMessage.threads().length)
				{
					mUnseenSubUid = _.find(oMessage.threads(), function (iSubUid) {
						var aFlags = self.getMessageFlagsFromCache(oMessage.folderFullNameRaw, iSubUid);
						return aFlags && 0 < aFlags.length && !!aFlags[0];
					});

					mFlaggedSubUid = _.find(oMessage.threads(), function (iSubUid) {
						var aFlags = self.getMessageFlagsFromCache(oMessage.folderFullNameRaw, iSubUid);
						return aFlags && 0 < aFlags.length && !!aFlags[1];
					});

					oMessage.hasUnseenSubMessage(mUnseenSubUid && 0 < Utils.pInt(mUnseenSubUid));
					oMessage.hasFlaggedSubMessage(mFlaggedSubUid && 0 < Utils.pInt(mFlaggedSubUid));
				}
			}
		};

		/**
		 * @param {(MessageModel|null)} oMessage
		 */
		CacheUserStorage.prototype.storeMessageFlagsToCache = function (oMessage)
		{
			if (oMessage)
			{
				this.setMessageFlagsToCache(
					oMessage.folderFullNameRaw,
					oMessage.uid,
					[oMessage.unseen(), oMessage.flagged(), oMessage.answered(), oMessage.forwarded(), oMessage.isReadReceipt()]
				);
			}
		};
		/**
		 * @param {string} sFolder
		 * @param {string} sUid
		 * @param {Array} aFlags
		 */
		CacheUserStorage.prototype.storeMessageFlagsToCacheByFolderAndUid = function (sFolder, sUid, aFlags)
		{
			if (Utils.isArray(aFlags) && 0 < aFlags.length)
			{
				this.setMessageFlagsToCache(sFolder, sUid, aFlags);
			}
		};

		module.exports = new CacheUserStorage();

	}());

/***/ },
/* 20 */
/*!********************************!*\
  !*** ./dev/Stores/User/Pgp.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3)
		;

		/**
		 * @constructor
		 */
		function PgpUserStore()
		{
			this.capaOpenPGP = ko.observable(false);
			
			this.openpgp = null;

			this.openpgpkeys = ko.observableArray([]);
			this.openpgpKeyring = null;

			this.openpgpkeysPublic = this.openpgpkeys.filter(function (oItem) {
				return !!(oItem && !oItem.isPrivate);
			});

			this.openpgpkeysPrivate = this.openpgpkeys.filter(function (oItem) {
				return !!(oItem && oItem.isPrivate);
			});
		}

	//	PgpUserStore.prototype.sign = function (sText, oPrivateKey)
	//	{
	//		try
	//		{
	//			return this.openpgp.signClearMessage([oPrivateKey], sText);
	//		}
	//		catch (oExc) {}
	//
	//		return sText;
	//	};
	//
	//	PgpUserStore.prototype.encrypt = function (sText, aPublicKeys)
	//	{
	//		try
	//		{
	//			return this.openpgp.encryptMessage(aPublicKeys, sText);
	//		}
	//		catch (oExc) {}
	//
	//		return sText;
	//	};
	//
	//	PgpUserStore.prototype.signAndEncrypt = function (sText, aPublicKeys, oPrivateKey)
	//	{
	//		try
	//		{
	//			return this.openpgp.signAndEncryptMessage(aPublicKeys, oPrivateKey, sText);
	//		}
	//		catch (oExc) {}
	//
	//		return sText;
	//	};
	//
	//	/**/
	//
	//	PgpUserStore.prototype.verify = function (sText, aPublicKeys)
	//	{
	//		var
	//			mPgpMessage = null
	//		;
	//
	//		try
	//		{
	//			mPgpMessage = this.openpgp.cleartext.readArmored(sText);
	//			if (mPgpMessage && mPgpMessage.getText)
	//			{
	//				mPgpMessage.verify(aPublicKeys);
	//			}
	//		}
	//		catch (oExc) {}
	//
	//		return false;
	//	};
	//
	//	PgpUserStore.prototype.decryptAndVerify = function (sEnctyptedText, aPublicKeys, oPivateKey)
	//	{
	//		var
	//			mPgpMessageDecrypted = null,
	//			mPgpMessage = null
	//		;
	//
	//		try
	//		{
	//			mPgpMessage = this.openpgp.message.readArmored(sEnctyptedText);
	//			if (mPgpMessage && oPivateKey && mPgpMessage.decrypt)
	//			{
	//				mPgpMessageDecrypted = mPgpMessage.decrypt(oPivateKey);
	//				if (mPgpMessageDecrypted)
	//				{
	//					mPgpMessageDecrypted.verify(aPublicKeys);
	//				}
	//			}
	//		}
	//		catch (oExc) {}
	//
	//		return false;
	//	};

		/**
		 * @return {boolean}
		 */
		PgpUserStore.prototype.isSupported = function ()
		{
			return !!this.openpgp;
		};

		module.exports = new PgpUserStore();

	}());



/***/ },
/* 21 */
/*!*****************************!*\
  !*** external "window.key" ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.key;

/***/ },
/* 22 */
/*!************************************!*\
  !*** ./dev/Stores/User/Account.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),

			Remote = __webpack_require__(/*! Storage/User/Remote */ 14)
		;

		/**
		 * @constructor
		 */
		function AccountUserStore()
		{
			this.email = ko.observable('');
	//		this.incLogin = ko.observable('');
	//		this.outLogin = ko.observable('');

			this.displayName = ko.observable('');
			this.replyTo = ko.observable('');
			this.signature = ko.observable('');

			this.accounts = ko.observableArray([]);
			this.accounts.loading = ko.observable(false).extend({'throttle': 100});

			this.accountsEmailNames = ko.observableArray([]).extend({'throttle': 1000});
			this.accountsEmailNames.skipFirst = true;

			this.accounts.subscribe(function (aList) {
				this.accountsEmailNames(_.compact(_.map(aList, function (oItem) {
					return oItem ? oItem.email : null;
				})));
			}, this);

			this.accountsEmailNames.subscribe(function (aList) {
				if (this.accountsEmailNames.skipFirst)
				{
					this.accountsEmailNames.skipFirst = false;
				}
				else if (aList && 1 < aList.length)
				{
					Remote.accountSortOrder(null, aList);
				}
			}, this);

			this.accountsUnreadCount = ko.computed(function () {

				var iResult = 0;

	//			_.each(this.accounts(), function (oItem) {
	//				if (oItem)
	//				{
	//					iResult += oItem.count();
	//				}
	//			});

				return iResult;

			}, this);
		}

		AccountUserStore.prototype.populate = function ()
		{
			this.email(Settings.settingsGet('Email'));
	//		this.incLogin(Settings.settingsGet('IncLogin'));
	//		this.outLogin(Settings.settingsGet('OutLogin'));

			this.displayName(Settings.settingsGet('DisplayName'));
			this.replyTo(Settings.settingsGet('ReplyTo'));
			this.signature(Settings.settingsGet('Signature'));
		};

		module.exports = new AccountUserStore();

	}());


/***/ },
/* 23 */
/*!*******************************!*\
  !*** ./dev/Common/Plugins.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 */
		function Plugins()
		{
			this.oSettings = __webpack_require__(/*! Storage/Settings */ 9);
			this.oViewModelsHooks = {};
			this.oSimpleHooks = {};
		}

		/**
		 * @type {Object}
		 */
		Plugins.prototype.oSettings = {};

		/**
		 * @type {Object}
		 */
		Plugins.prototype.oViewModelsHooks = {};

		/**
		 * @type {Object}
		 */
		Plugins.prototype.oSimpleHooks = {};

		/**
		 * @param {string} sName
		 * @param {Function} fCallback
		 */
		Plugins.prototype.addHook = function (sName, fCallback)
		{
			if (Utils.isFunc(fCallback))
			{
				if (!Utils.isArray(this.oSimpleHooks[sName]))
				{
					this.oSimpleHooks[sName] = [];
				}

				this.oSimpleHooks[sName].push(fCallback);
			}
		};

		/**
		 * @param {string} sName
		 * @param {Array=} aArguments
		 */
		Plugins.prototype.runHook = function (sName, aArguments)
		{
			if (Utils.isArray(this.oSimpleHooks[sName]))
			{
				aArguments = aArguments || [];

				_.each(this.oSimpleHooks[sName], function (fCallback) {
					fCallback.apply(null, aArguments);
				});
			}
		};

		/**
		 * @param {string} sName
		 * @return {?}
		 */
		Plugins.prototype.mainSettingsGet = function (sName)
		{
			return this.oSettings.settingsGet(sName);
		};

		/**
		 * @param {Function} fCallback
		 * @param {string} sAction
		 * @param {Object=} oParameters
		 * @param {?number=} iTimeout
		 * @param {string=} sGetAdd = ''
		 * @param {Array=} aAbortActions = []
		 */
		Plugins.prototype.remoteRequest = function (fCallback, sAction, oParameters, iTimeout, sGetAdd, aAbortActions)
		{
			if (Globals.__APP__)
			{
				Globals.__APP__.remote().defaultRequest(fCallback, sAction, oParameters, iTimeout, sGetAdd, aAbortActions);
			}
		};

		/**
		 * @param {string} sPluginSection
		 * @param {string} sName
		 * @return {?}
		 */
		Plugins.prototype.settingsGet = function (sPluginSection, sName)
		{
			var oPlugin = this.oSettings.settingsGet('Plugins');
			oPlugin = oPlugin && !Utils.isUnd(oPlugin[sPluginSection]) ? oPlugin[sPluginSection] : null;
			return oPlugin ? (Utils.isUnd(oPlugin[sName]) ? null : oPlugin[sName]) : null;
		};

		module.exports = new Plugins();

	}());

/***/ },
/* 24 */
/*!************************************!*\
  !*** ./dev/Knoin/AbstractModel.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 *
		 * @param {string} sModelName
		 */
		function AbstractModel(sModelName)
		{
			this.sModelName = sModelName || '';
			this.disposables = [];
		}

		/**
		 * @param {Array|Object} mInputValue
		 */
		AbstractModel.prototype.regDisposables = function (mInputValue)
		{
			if (Utils.isArray(mInputValue))
			{
				_.each(mInputValue, function (mValue) {
					this.disposables.push(mValue);
				}, this);
			}
			else if (mInputValue)
			{
				this.disposables.push(mInputValue);
			}

		};

		AbstractModel.prototype.onDestroy = function ()
		{
			Utils.disposeObject(this);
	//		window.console.log('onDestroy: ' + this.sModelName);
		};

		module.exports = AbstractModel;

	}());



/***/ },
/* 25 */
/*!****************************!*\
  !*** ./dev/Model/Email.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @param {string=} sEmail
		 * @param {string=} sName
		 * @param {string=} sDkimStatus
		 * @param {string=} sDkimValue
		 *
		 * @constructor
		 */
		function EmailModel(sEmail, sName, sDkimStatus, sDkimValue)
		{
			this.email = sEmail || '';
			this.name = sName || '';
			this.dkimStatus = sDkimStatus || 'none';
			this.dkimValue = sDkimValue || '';

			this.clearDuplicateName();
		}

		/**
		 * @static
		 * @param {AjaxJsonEmail} oJsonEmail
		 * @return {?EmailModel}
		 */
		EmailModel.newInstanceFromJson = function (oJsonEmail)
		{
			var oEmailModel = new EmailModel();
			return oEmailModel.initByJson(oJsonEmail) ? oEmailModel : null;
		};

		/**
		 * @type {string}
		 */
		EmailModel.prototype.name = '';

		/**
		 * @type {string}
		 */
		EmailModel.prototype.email = '';

		/**
		 * @type {string}
		 */
		EmailModel.prototype.dkimStatus = 'none';

		/**
		 * @type {string}
		 */
		EmailModel.prototype.dkimValue = '';

		EmailModel.prototype.clear = function ()
		{
			this.email = '';
			this.name = '';

			this.dkimStatus = 'none';
			this.dkimValue = '';
		};

		/**
		 * @returns {boolean}
		 */
		EmailModel.prototype.validate = function ()
		{
			return '' !== this.name || '' !== this.email;
		};

		/**
		 * @param {boolean} bWithoutName = false
		 * @return {string}
		 */
		EmailModel.prototype.hash = function (bWithoutName)
		{
			return '#' + (bWithoutName ? '' : this.name) + '#' + this.email + '#';
		};

		EmailModel.prototype.clearDuplicateName = function ()
		{
			if (this.name === this.email)
			{
				this.name = '';
			}
		};

		/**
		 * @param {string} sQuery
		 * @return {boolean}
		 */
		EmailModel.prototype.search = function (sQuery)
		{
			return -1 < (this.name + ' ' + this.email).toLowerCase().indexOf(sQuery.toLowerCase());
		};

		/**
		 * @param {string} sString
		 */
		EmailModel.prototype.parse = function (sString)
		{
			this.clear();

			sString = Utils.trim(sString);

			var
				mRegex = /(?:"([^"]+)")? ?[<]?(.*?@[^>,]+)>?,? ?/g,
				mMatch = mRegex.exec(sString)
			;

			if (mMatch)
			{
				this.name = mMatch[1] || '';
				this.email = mMatch[2] || '';

				this.clearDuplicateName();
			}
			else if ((/^[^@]+@[^@]+$/).test(sString))
			{
				this.name = '';
				this.email = sString;
			}
		};

		/**
		 * @param {AjaxJsonEmail} oJsonEmail
		 * @return {boolean}
		 */
		EmailModel.prototype.initByJson = function (oJsonEmail)
		{
			var bResult = false;
			if (oJsonEmail && 'Object/Email' === oJsonEmail['@Object'])
			{
				this.name = Utils.trim(oJsonEmail.Name);
				this.email = Utils.trim(oJsonEmail.Email);
				this.dkimStatus = Utils.trim(oJsonEmail.DkimStatus || '');
				this.dkimValue = Utils.trim(oJsonEmail.DkimValue || '');

				bResult = '' !== this.email;
				this.clearDuplicateName();
			}

			return bResult;
		};

		/**
		 * @param {boolean} bFriendlyView
		 * @param {boolean=} bWrapWithLink = false
		 * @param {boolean=} bEncodeHtml = false
		 * @return {string}
		 */
		EmailModel.prototype.toLine = function (bFriendlyView, bWrapWithLink, bEncodeHtml)
		{
			var sResult = '';
			if ('' !== this.email)
			{
				bWrapWithLink = Utils.isUnd(bWrapWithLink) ? false : !!bWrapWithLink;
				bEncodeHtml = Utils.isUnd(bEncodeHtml) ? false : !!bEncodeHtml;

				if (bFriendlyView && '' !== this.name)
				{
					sResult = bWrapWithLink ? '<a href="mailto:' + Utils.encodeHtml('"' + this.name + '" <' + this.email + '>') +
						'" target="_blank" tabindex="-1">' + Utils.encodeHtml(this.name) + '</a>' :
							(bEncodeHtml ? Utils.encodeHtml(this.name) : this.name);
				}
				else
				{
					sResult = this.email;
					if ('' !== this.name)
					{
						if (bWrapWithLink)
						{
							sResult = Utils.encodeHtml('"' + this.name + '" <') +
								'<a href="mailto:' + Utils.encodeHtml('"' + this.name + '" <' + this.email + '>') + '" target="_blank" tabindex="-1">' + Utils.encodeHtml(sResult) + '</a>' + Utils.encodeHtml('>');
						}
						else
						{
							sResult = '"' + this.name + '" <' + sResult + '>';
							if (bEncodeHtml)
							{
								sResult = Utils.encodeHtml(sResult);
							}
						}
					}
					else if (bWrapWithLink)
					{
						sResult = '<a href="mailto:' + Utils.encodeHtml(this.email) + '" target="_blank" tabindex="-1">' + Utils.encodeHtml(this.email) + '</a>';
					}
				}
			}

			return sResult;
		};

		/**
		 * @param {string} $sEmailAddress
		 * @return {boolean}
		 */
		EmailModel.prototype.mailsoParse = function ($sEmailAddress)
		{
			$sEmailAddress = Utils.trim($sEmailAddress);
			if ('' === $sEmailAddress)
			{
				return false;
			}

			var
				substr = function (str, start, len) {
					str += '';
					var	end = str.length;

					if (start < 0) {
						start += end;
					}

					end = typeof len === 'undefined' ? end : (len < 0 ? len + end : len + start);

					return start >= str.length || start < 0 || start > end ? false : str.slice(start, end);
				},

				substr_replace = function (str, replace, start, length) {
					if (start < 0) {
						start = start + str.length;
					}
					length = length !== undefined ? length : str.length;
					if (length < 0) {
						length = length + str.length - start;
					}
					return str.slice(0, start) + replace.substr(0, length) + replace.slice(length) + str.slice(start + length);
				},

				$sName = '',
				$sEmail = '',
				$sComment = '',

				$bInName = false,
				$bInAddress = false,
				$bInComment = false,

				$aRegs = null,

				$iStartIndex = 0,
				$iEndIndex = 0,
				$iCurrentIndex = 0
			;

			while ($iCurrentIndex < $sEmailAddress.length)
			{
				switch ($sEmailAddress.substr($iCurrentIndex, 1))
				{
					case '"':
						if ((!$bInName) && (!$bInAddress) && (!$bInComment))
						{
							$bInName = true;
							$iStartIndex = $iCurrentIndex;
						}
						else if ((!$bInAddress) && (!$bInComment))
						{
							$iEndIndex = $iCurrentIndex;
							$sName = substr($sEmailAddress, $iStartIndex + 1, $iEndIndex - $iStartIndex - 1);
							$sEmailAddress = substr_replace($sEmailAddress, '', $iStartIndex, $iEndIndex - $iStartIndex + 1);
							$iEndIndex = 0;
							$iCurrentIndex = 0;
							$iStartIndex = 0;
							$bInName = false;
						}
						break;
					case '<':
						if ((!$bInName) && (!$bInAddress) && (!$bInComment))
						{
							if ($iCurrentIndex > 0 && $sName.length === 0)
							{
								$sName = substr($sEmailAddress, 0, $iCurrentIndex);
							}

							$bInAddress = true;
							$iStartIndex = $iCurrentIndex;
						}
						break;
					case '>':
						if ($bInAddress)
						{
							$iEndIndex = $iCurrentIndex;
							$sEmail = substr($sEmailAddress, $iStartIndex + 1, $iEndIndex - $iStartIndex - 1);
							$sEmailAddress = substr_replace($sEmailAddress, '', $iStartIndex, $iEndIndex - $iStartIndex + 1);
							$iEndIndex = 0;
							$iCurrentIndex = 0;
							$iStartIndex = 0;
							$bInAddress = false;
						}
						break;
					case '(':
						if ((!$bInName) && (!$bInAddress) && (!$bInComment))
						{
							$bInComment = true;
							$iStartIndex = $iCurrentIndex;
						}
						break;
					case ')':
						if ($bInComment)
						{
							$iEndIndex = $iCurrentIndex;
							$sComment = substr($sEmailAddress, $iStartIndex + 1, $iEndIndex - $iStartIndex - 1);
							$sEmailAddress = substr_replace($sEmailAddress, '', $iStartIndex, $iEndIndex - $iStartIndex + 1);
							$iEndIndex = 0;
							$iCurrentIndex = 0;
							$iStartIndex = 0;
							$bInComment = false;
						}
						break;
					case '\\':
						$iCurrentIndex++;
						break;
				}

				$iCurrentIndex++;
			}

			if ($sEmail.length === 0)
			{
				$aRegs = $sEmailAddress.match(/[^@\s]+@\S+/i);
				if ($aRegs && $aRegs[0])
				{
					$sEmail = $aRegs[0];
				}
				else
				{
					$sName = $sEmailAddress;
				}
			}

			if ($sEmail.length > 0 && $sName.length === 0 && $sComment.length === 0)
			{
				$sName = $sEmailAddress.replace($sEmail, '');
			}

			$sEmail = Utils.trim($sEmail).replace(/^[<]+/, '').replace(/[>]+$/, '');
			$sName = Utils.trim($sName).replace(/^["']+/, '').replace(/["']+$/, '');
			$sComment = Utils.trim($sComment).replace(/^[(]+/, '').replace(/[)]+$/, '');

			// Remove backslash
			$sName = $sName.replace(/\\\\(.)/g, '$1');
			$sComment = $sComment.replace(/\\\\(.)/g, '$1');

			this.name = $sName;
			this.email = $sEmail;

			this.clearDuplicateName();
			return true;
		};

		module.exports = EmailModel;

	}());

/***/ },
/* 26 */
/*!*************************************!*\
  !*** ./dev/Stores/User/Settings.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Events = __webpack_require__(/*! Common/Events */ 28),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function SettingsUserStore()
		{
			this.layout = ko.observable(Enums.Layout.SidePreview)
				.extend({'limitedList': [
					Enums.Layout.SidePreview, Enums.Layout.BottomPreview, Enums.Layout.NoPreview
				]});

			this.editorDefaultType = ko.observable(Enums.EditorDefaultType.Html)
				.extend({'limitedList': [
					Enums.EditorDefaultType.Html, Enums.EditorDefaultType.Plain,
					Enums.EditorDefaultType.HtmlForced, Enums.EditorDefaultType.PlainForced
				]});

			this.messagesPerPage = ko.observable(Consts.Defaults.MessagesPerPage)
				.extend({'limitedList': Consts.Defaults.MessagesPerPageArray});

			this.showImages = ko.observable(false);
			this.useCheckboxesInList = ko.observable(true);
			this.useThreads = ko.observable(false);
			this.replySameFolder = ko.observable(false);

			this.computedProperies();
			this.subscribes();
		}

		SettingsUserStore.prototype.computedProperies = function ()
		{
			this.usePreviewPane = ko.computed(function () {
				return Enums.Layout.NoPreview !== this.layout();
			}, this);
		};

		SettingsUserStore.prototype.subscribes = function ()
		{
			this.layout.subscribe(function (nValue) {

				Globals.$html.toggleClass('rl-no-preview-pane', Enums.Layout.NoPreview === nValue);
				Globals.$html.toggleClass('rl-side-preview-pane', Enums.Layout.SidePreview === nValue);
				Globals.$html.toggleClass('rl-bottom-preview-pane', Enums.Layout.BottomPreview === nValue);

				Events.pub('layout', [nValue]);
			});
		};

		SettingsUserStore.prototype.populate = function ()
		{
			this.layout(Utils.pInt(Settings.settingsGet('Layout')));
			this.editorDefaultType(Settings.settingsGet('EditorDefaultType'));

			this.messagesPerPage(Settings.settingsGet('MPP'));

			this.showImages(!!Settings.settingsGet('ShowImages'));
			this.useCheckboxesInList(!!Settings.settingsGet('UseCheckboxesInList'));
			this.useThreads(!!Settings.settingsGet('UseThreads'));
			this.replySameFolder(!!Settings.settingsGet('ReplySameFolder'));
		};

		module.exports = new SettingsUserStore();

	}());


/***/ },
/* 27 */
/*!***********************************!*\
  !*** ./dev/View/Popup/Compose.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			ko = __webpack_require__(/*! ko */ 3),
			moment = __webpack_require__(/*! moment */ 36),
			JSON = __webpack_require__(/*! JSON */ 73),
			Jua = __webpack_require__(/*! Jua */ 74),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Events = __webpack_require__(/*! Common/Events */ 28),
			Links = __webpack_require__(/*! Common/Links */ 12),
			HtmlEditor = __webpack_require__(/*! Common/HtmlEditor */ 47),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			AppStore = __webpack_require__(/*! Stores/User/App */ 30),
			SettingsStore = __webpack_require__(/*! Stores/User/Settings */ 26),
			IdentityStore = __webpack_require__(/*! Stores/User/Identity */ 43),
			AccountStore = __webpack_require__(/*! Stores/User/Account */ 22),
			FolderStore = __webpack_require__(/*! Stores/User/Folder */ 32),
			PgpStore = __webpack_require__(/*! Stores/User/Pgp */ 20),
			SocialStore = __webpack_require__(/*! Stores/Social */ 35),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Data = __webpack_require__(/*! Storage/User/Data */ 15),
			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),
			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),

			ComposeAttachmentModel = __webpack_require__(/*! Model/ComposeAttachment */ 96),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function ComposePopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsCompose');

			var self = this;

			this.oEditor = null;
			this.aDraftInfo = null;
			this.sInReplyTo = '';
			this.bFromDraft = false;
			this.sReferences = '';

			this.triggerForResize = _.bind(this.triggerForResize, this);

			this.bCapaAdditionalIdentities = Settings.capa(Enums.Capa.AdditionalIdentities);

			this.allowContacts = !!AppStore.contactsIsAllowed();

			this.bSkipNextHide = false;
			this.composeInEdit = Data.composeInEdit;
			this.editorDefaultType = SettingsStore.editorDefaultType;

			this.capaOpenPGP = PgpStore.capaOpenPGP;

			this.resizer = ko.observable(false).extend({'throttle': 50});

			this.identitiesDropdownTrigger = ko.observable(false);

			this.to = ko.observable('');
			this.to.focusTrigger = ko.observable(false);
			this.cc = ko.observable('');
			this.bcc = ko.observable('');

			this.replyTo = ko.observable('');
			this.subject = ko.observable('');
			this.isHtml = ko.observable(false);

			this.requestReadReceipt = ko.observable(false);
			this.markAsImportant = ko.observable(false);

			this.sendError = ko.observable(false);
			this.sendSuccessButSaveError = ko.observable(false);
			this.savedError = ko.observable(false);

			this.savedTime = ko.observable(0);
			this.savedOrSendingText = ko.observable('');

			this.emptyToError = ko.observable(false);
			this.attachmentsInProcessError = ko.observable(false);
			this.attachmentsInErrorError = ko.observable(false);

			this.showCc = ko.observable(false);
			this.showBcc = ko.observable(false);

			this.cc.subscribe(function (aValue) {
				if (false === self.showCc() && 0 < aValue.length)
				{
					self.showCc(true);
				}
			}, this);

			this.bcc.subscribe(function (aValue) {
				if (false === self.showBcc() && 0 < aValue.length)
				{
					self.showBcc(true);
				}
			}, this);

			this.draftFolder = ko.observable('');
			this.draftUid = ko.observable('');
			this.sending = ko.observable(false);
			this.saving = ko.observable(false);
			this.attachments = ko.observableArray([]);

			this.attachmentsInProcess = this.attachments.filter(function (oItem) {
				return oItem && !oItem.complete();
			});

			this.attachmentsInReady = this.attachments.filter(function (oItem) {
				return oItem && oItem.complete();
			});

			this.attachmentsInError = this.attachments.filter(function (oItem) {
				return oItem && '' !== oItem.error();
			});

			this.attachmentsCount = ko.computed(function () {
				return this.attachments().length;
			}, this);

			this.attachmentsInErrorCount = ko.computed(function () {
				return this.attachmentsInError().length;
			}, this);

			this.attachmentsInProcessCount = ko.computed(function () {
				return this.attachmentsInProcess().length;
			}, this);

			this.isDraftFolderMessage = ko.computed(function () {
				return '' !== this.draftFolder() && '' !== this.draftUid();
			}, this);

			this.attachmentsPlace = ko.observable(false);

			this.attachments.subscribe(Utils.windowResizeCallback);
			this.attachmentsPlace.subscribe(Utils.windowResizeCallback);

			this.attachmentsInErrorCount.subscribe(function (iN) {
				if (0 === iN)
				{
					this.attachmentsInErrorError(false);
				}
			}, this);

			this.composeUploaderButton = ko.observable(null);
			this.composeUploaderDropPlace = ko.observable(null);
			this.dragAndDropEnabled = ko.observable(false);
			this.dragAndDropOver = ko.observable(false).extend({'throttle': 1});
			this.dragAndDropVisible = ko.observable(false).extend({'throttle': 1});
			this.attacheMultipleAllowed = ko.observable(false);
			this.addAttachmentEnabled = ko.observable(false);

			this.composeEditorArea = ko.observable(null);

			this.identities = IdentityStore.identities;
			this.defaultIdentityID = IdentityStore.defaultIdentityID;
			this.currentIdentityID = ko.observable('');

			this.currentIdentityString = ko.observable('');
			this.currentIdentityResultEmail = ko.observable('');

			this.identitiesOptions = ko.computed(function () {

				var aList = [{
					'optValue': AccountStore.email(),
					'optText': this.formattedFrom(false)
				}];

				_.each(IdentityStore.identities(), function (oItem) {
					aList.push({
						'optValue': oItem.id,
						'optText': oItem.formattedNameForCompose()
					});
				});

				return aList;

			}, this);

			ko.computed(function () {

				var
					sResult = '',
					sResultEmail = '',
					oItem = null,
					aList = IdentityStore.identities(),
					sID = this.currentIdentityID()
				;

				if (this.bCapaAdditionalIdentities && sID && sID !== AccountStore.email())
				{
					oItem = _.find(aList, function (oItem) {
						return oItem && sID === oItem['id'];
					});

					sResult = oItem ? oItem.formattedNameForCompose() : '';
					sResultEmail = oItem ? oItem.formattedNameForEmail() : '';

					if ('' === sResult && aList[0])
					{
						this.currentIdentityID(aList[0]['id']);
						return '';
					}
				}

				if ('' === sResult)
				{
					sResult = this.formattedFrom(false);
					sResultEmail = this.formattedFrom(true);
				}

				this.currentIdentityString(sResult);
				this.currentIdentityResultEmail(sResultEmail);

				return sResult;

			}, this);

			this.to.subscribe(function (sValue) {
				if (this.emptyToError() && 0 < sValue.length)
				{
					this.emptyToError(false);
				}
			}, this);

			this.attachmentsInProcess.subscribe(function (aValue) {
				if (this.attachmentsInProcessError() && Utils.isArray(aValue) && 0 === aValue.length)
				{
					this.attachmentsInProcessError(false);
				}
			}, this);

			this.editorResizeThrottle = _.throttle(_.bind(this.editorResize, this), 100);

			this.resizer.subscribe(function () {
				this.editorResizeThrottle();
			}, this);

			this.canBeSendedOrSaved = ko.computed(function () {
				return !this.sending() && !this.saving();
			}, this);

			this.deleteCommand = Utils.createCommand(this, function () {

				__webpack_require__(/*! App/User */ 6).deleteMessagesFromFolderWithoutCheck(this.draftFolder(), [this.draftUid()]);
				kn.hideScreenPopup(ComposePopupView);

			}, function () {
				return this.isDraftFolderMessage();
			});

			this.sendMessageResponse = _.bind(this.sendMessageResponse, this);
			this.saveMessageResponse = _.bind(this.saveMessageResponse, this);

			this.sendCommand = Utils.createCommand(this, function () {

				var
					sTo = Utils.trim(this.to()),
					sSentFolder = FolderStore.sentFolder(),
					aFlagsCache = []
				;

				if (0 < this.attachmentsInProcess().length)
				{
					this.attachmentsInProcessError(true);
					this.attachmentsPlace(true);
				}
				else if (0 < this.attachmentsInError().length)
				{
					this.attachmentsInErrorError(true);
					this.attachmentsPlace(true);
				}
				else if (0 === sTo.length)
				{
					this.emptyToError(true);
				}
				else
				{
					if (SettingsStore.replySameFolder())
					{
						if (Utils.isArray(this.aDraftInfo) && 3 === this.aDraftInfo.length && Utils.isNormal(this.aDraftInfo[2]) && 0 < this.aDraftInfo[2].length)
						{
							sSentFolder = this.aDraftInfo[2];
						}
					}

					if ('' === sSentFolder)
					{
						kn.showScreenPopup(__webpack_require__(/*! View/Popup/FolderSystem */ 44), [Enums.SetSystemFoldersNotification.Sent]);
					}
					else
					{
						this.sendError(false);
						this.sending(true);

						if (Utils.isArray(this.aDraftInfo) && 3 === this.aDraftInfo.length)
						{
							aFlagsCache = Cache.getMessageFlagsFromCache(this.aDraftInfo[2], this.aDraftInfo[1]);
							if (aFlagsCache)
							{
								if ('forward' === this.aDraftInfo[0])
								{
									aFlagsCache[3] = true;
								}
								else
								{
									aFlagsCache[2] = true;
								}

								Cache.setMessageFlagsToCache(this.aDraftInfo[2], this.aDraftInfo[1], aFlagsCache);
								__webpack_require__(/*! App/User */ 6).reloadFlagsCurrentMessageListAndMessageFromCache();
								Cache.setFolderHash(this.aDraftInfo[2], '');
							}
						}

						sSentFolder = Consts.Values.UnuseOptionValue === sSentFolder ? '' : sSentFolder;

						Cache.setFolderHash(this.draftFolder(), '');
						Cache.setFolderHash(sSentFolder, '');

						Remote.sendMessage(
							this.sendMessageResponse,
							this.draftFolder(),
							this.draftUid(),
							sSentFolder,
							this.currentIdentityResultEmail(),
							sTo,
							this.cc(),
							this.bcc(),
							this.subject(),
							this.oEditor ? this.oEditor.isHtml() : false,
							this.oEditor ? this.oEditor.getData(true) : '',
							this.prepearAttachmentsForSendOrSave(),
							this.aDraftInfo,
							this.sInReplyTo,
							this.sReferences,
							this.requestReadReceipt(),
							this.markAsImportant()
						);
					}
				}
			}, this.canBeSendedOrSaved);

			this.saveCommand = Utils.createCommand(this, function () {

				if (FolderStore.draftFolderNotEnabled())
				{
					kn.showScreenPopup(__webpack_require__(/*! View/Popup/FolderSystem */ 44), [Enums.SetSystemFoldersNotification.Draft]);
				}
				else
				{
					this.savedError(false);
					this.saving(true);

					this.autosaveStart();

					Cache.setFolderHash(FolderStore.draftFolder(), '');

					Remote.saveMessage(
						this.saveMessageResponse,
						this.draftFolder(),
						this.draftUid(),
						FolderStore.draftFolder(),
						this.currentIdentityResultEmail(),
						this.to(),
						this.cc(),
						this.bcc(),
						this.subject(),
						this.oEditor ? this.oEditor.isHtml() : false,
						this.oEditor ? this.oEditor.getData(true) : '',
						this.prepearAttachmentsForSendOrSave(),
						this.aDraftInfo,
						this.sInReplyTo,
						this.sReferences,
						this.markAsImportant()
					);
				}

			}, this.canBeSendedOrSaved);

			this.skipCommand = Utils.createCommand(this, function () {

				this.bSkipNextHide = true;

				if (this.modalVisibility() && !this.saving() && !this.sending() &&
					!FolderStore.draftFolderNotEnabled())
				{
					this.saveCommand();
				}

				this.tryToClosePopup();

			}, this.canBeSendedOrSaved);

			this.contactsCommand = Utils.createCommand(this, function () {

				if (this.allowContacts)
				{
					this.skipCommand();

					_.delay(function () {
						kn.showScreenPopup(__webpack_require__(/*! View/Popup/Contacts */ 68), [true]);
					}, 200);
				}

			}, function () {
				return this.allowContacts;
			});

			Events.sub('interval.2m', function () {

				if (this.modalVisibility() && !FolderStore.draftFolderNotEnabled() && !this.isEmptyForm(false) &&
					!this.saving() && !this.sending() && !this.savedError())
				{
					this.saveCommand();
				}
			}, this);

			this.showCc.subscribe(this.triggerForResize);
			this.showBcc.subscribe(this.triggerForResize);

			this.dropboxEnabled = SocialStore.dropbox.enabled;
			this.dropboxApiKey = SocialStore.dropbox.apiKey;

			this.dropboxCommand = Utils.createCommand(this, function () {

				if (window.Dropbox)
				{
					window.Dropbox.choose({
						//'iframe': true,
						'success': function(aFiles) {

							if (aFiles && aFiles[0] && aFiles[0]['link'])
							{
								self.addDropboxAttachment(aFiles[0]);
							}
						},
						'linkType': "direct",
						'multiselect': false
					});
				}

				return true;

			}, function () {
				return this.dropboxEnabled();
			});

			this.driveEnabled = ko.observable(Globals.bXMLHttpRequestSupported &&
				!!Settings.settingsGet('AllowGoogleSocial') && !!Settings.settingsGet('AllowGoogleSocialDrive') &&
				!!Settings.settingsGet('GoogleClientID') && !!Settings.settingsGet('GoogleApiKey'));

			this.driveVisible = ko.observable(false);

			this.driveCommand = Utils.createCommand(this, function () {

				this.driveOpenPopup();
				return true;

			}, function () {
				return this.driveEnabled();
			});

			this.driveCallback = _.bind(this.driveCallback, this);

			this.bDisabeCloseOnEsc = true;
			this.sDefaultKeyScope = Enums.KeyState.Compose;

			this.tryToClosePopup = _.debounce(_.bind(this.tryToClosePopup, this), 200);

			this.emailsSource = _.bind(this.emailsSource, this);
			this.autosaveFunction = _.bind(this.autosaveFunction, this);

			this.iTimer = 0;

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/Compose', 'PopupsComposeViewModel'], ComposePopupView);
		_.extend(ComposePopupView.prototype, AbstractView.prototype);

		ComposePopupView.prototype.autosaveFunction = function ()
		{
			if (this.modalVisibility() && !FolderStore.draftFolderNotEnabled() && !this.isEmptyForm(false) &&
				!this.saving() && !this.sending() && !this.savedError())
			{
				this.saveCommand();
			}

			this.autosaveStart();
		};

		ComposePopupView.prototype.autosaveStart = function ()
		{
			window.clearTimeout(this.iTimer);
			this.iTimer = window.setTimeout(this.autosaveFunction, 1000 * 60 * 1);
		};

		ComposePopupView.prototype.autosaveStop = function ()
		{
			window.clearTimeout(this.iTimer);
		};

		ComposePopupView.prototype.emailsSource = function (oData, fResponse)
		{
			__webpack_require__(/*! App/User */ 6).getAutocomplete(oData.term, function (aData) {
				fResponse(_.map(aData, function (oEmailItem) {
					return oEmailItem.toLine(false);
				}));
			});
		};

		ComposePopupView.prototype.openOpenPgpPopup = function ()
		{
			if (PgpStore.capaOpenPGP() && this.oEditor && !this.oEditor.isHtml())
			{
				var self = this;
				kn.showScreenPopup(__webpack_require__(/*! View/Popup/ComposeOpenPgp */ 137), [
					function (sResult) {
						self.editor(function (oEditor) {
							oEditor.setPlain(sResult);
						});
					},
					this.oEditor.getData(),
					this.currentIdentityResultEmail(),
					this.to(),
					this.cc(),
					this.bcc()
				]);
			}
		};

		ComposePopupView.prototype.reloadDraftFolder = function ()
		{
			var
				sDraftFolder = FolderStore.draftFolder()
			;

			if ('' !== sDraftFolder)
			{
				Cache.setFolderHash(sDraftFolder, '');
				if (Data.currentFolderFullNameRaw() === sDraftFolder)
				{
					__webpack_require__(/*! App/User */ 6).reloadMessageList(true);
				}
				else
				{
					__webpack_require__(/*! App/User */ 6).folderInformation(sDraftFolder);
				}
			}
		};

		ComposePopupView.prototype.findIdentityIdByMessage = function (sComposeType, oMessage)
		{
			var
				oIDs = {},
				sResult = '',
				sEmail = '',

				fFindHelper = function (oItem) {
					if (oItem && oItem.email && oIDs[oItem.email])
					{
						sEmail = oItem.email;
						sResult = oIDs[oItem.email];
						return true;
					}

					return false;
				}
			;

			if (this.bCapaAdditionalIdentities)
			{
				_.each(IdentityStore.identities(), function (oItem) {
					oIDs[oItem.email()] = oItem['id'];
				});
			}

			oIDs[AccountStore.email()] = AccountStore.email();

			if (oMessage)
			{
				switch (sComposeType)
				{
					case Enums.ComposeType.Empty:
						break;
					case Enums.ComposeType.Reply:
					case Enums.ComposeType.ReplyAll:
					case Enums.ComposeType.Forward:
					case Enums.ComposeType.ForwardAsAttachment:
						_.find(_.union(oMessage.to, oMessage.cc, oMessage.bcc, oMessage.deliveredTo), fFindHelper);
						break;
					case Enums.ComposeType.Draft:
						_.find(_.union(oMessage.from, oMessage.replyTo), fFindHelper);
						break;
				}
			}

			if ('' === sResult)
			{
				sResult = IdentityStore.defaultIdentityID();
			}

			if ('' === sResult)
			{
				sResult = AccountStore.email();
				sEmail = sResult;
			}

			return [sResult, sEmail];
		};

		ComposePopupView.prototype.selectIdentity = function (oIdentity)
		{
			if (oIdentity)
			{
				this.currentIdentityID(oIdentity.optValue);
			}
		};

		/**
		 *
		 * @param {boolean=} bHeaderResult = false
		 * @returns {string}
		 */
		ComposePopupView.prototype.formattedFrom = function (bHeaderResult)
		{
			var
				sDisplayName = AccountStore.displayName(),
				sEmail = AccountStore.email()
			;

			return '' === sDisplayName ? sEmail :
				((Utils.isUnd(bHeaderResult) ? false : !!bHeaderResult) ?
					'"' + Utils.quoteName(sDisplayName) + '" <' + sEmail + '>' :
					sDisplayName + ' (' + sEmail + ')')
			;
		};

		ComposePopupView.prototype.sendMessageResponse = function (sResult, oData)
		{
			var
				bResult = false,
				sMessage = ''
			;

			this.sending(false);

			if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
			{
				bResult = true;
				if (this.modalVisibility())
				{
					Utils.delegateRun(this, 'closeCommand');
				}
			}

			if (this.modalVisibility() && !bResult)
			{
				if (oData && Enums.Notification.CantSaveMessage === oData.ErrorCode)
				{
					this.sendSuccessButSaveError(true);
					window.alert(Utils.trim(Translator.i18n('COMPOSE/SAVED_ERROR_ON_SEND')));
				}
				else
				{
					sMessage = Translator.getNotification(oData && oData.ErrorCode ? oData.ErrorCode : Enums.Notification.CantSendMessage,
						oData && oData.ErrorMessage ? oData.ErrorMessage : '');

					this.sendError(true);
					window.alert(sMessage || Translator.getNotification(Enums.Notification.CantSendMessage));
				}
			}

			this.reloadDraftFolder();
		};

		ComposePopupView.prototype.saveMessageResponse = function (sResult, oData)
		{
			var
				bResult = false,
				oMessage = null
			;

			this.saving(false);

			if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
			{
				if (oData.Result.NewFolder && oData.Result.NewUid)
				{
					bResult = true;

					if (this.bFromDraft)
					{
						oMessage = Data.message();
						if (oMessage && this.draftFolder() === oMessage.folderFullNameRaw && this.draftUid() === oMessage.uid)
						{
							Data.message(null);
						}
					}

					this.draftFolder(oData.Result.NewFolder);
					this.draftUid(oData.Result.NewUid);

					this.savedTime(window.Math.round((new window.Date()).getTime() / 1000));

					this.savedOrSendingText(
						0 < this.savedTime() ? Translator.i18n('COMPOSE/SAVED_TIME', {
							'TIME': moment.unix(this.savedTime() - 1).format('LT')
						}) : ''
					);

					if (this.bFromDraft)
					{
						Cache.setFolderHash(this.draftFolder(), '');
					}
				}
			}

			if (!bResult)
			{
				this.savedError(true);
				this.savedOrSendingText(Translator.getNotification(Enums.Notification.CantSaveMessage));
			}

			this.reloadDraftFolder();
		};

		ComposePopupView.prototype.onHide = function ()
		{
			this.autosaveStop();

			if (!this.bSkipNextHide)
			{
				this.composeInEdit(false);
				this.reset();
			}

			this.bSkipNextHide = false;

			kn.routeOn();
		};

		/**
		 * @param {string} sInputText
		 * @param {string} sSignature
		 * @param {string=} sFrom
		 * @param {string=} sComposeType
		 * @return {string}
		 */
		ComposePopupView.prototype.convertSignature = function (sInputText, sSignature, sFrom, sComposeType)
		{
			var bHtml = false, bData = false;
			if ('' !== sSignature)
			{
				if (':HTML:' === sSignature.substr(0, 6))
				{
					bHtml = true;
					sSignature = sSignature.substr(6);
				}

				sSignature = sSignature.replace(/[\r]/g, '');

				sFrom = Utils.pString(sFrom);
				if ('' !== sFrom)
				{
					sSignature = sSignature.replace(/{{FROM-FULL}}/g, sFrom);

					if (-1 === sFrom.indexOf(' ') && 0 < sFrom.indexOf('@'))
					{
						sFrom = sFrom.replace(/@(.+)$/, '');
					}

					sSignature = sSignature.replace(/{{FROM}}/g, sFrom);
				}

				sSignature = sSignature.replace(/[\s]{1,2}{{FROM}}/g, '{{FROM}}');
				sSignature = sSignature.replace(/[\s]{1,2}{{FROM-FULL}}/g, '{{FROM-FULL}}');

				sSignature = sSignature.replace(/{{FROM}}/g, '');
				sSignature = sSignature.replace(/{{FROM-FULL}}/g, '');

				if (-1 < sSignature.indexOf('{{DATE}}'))
				{
					sSignature = sSignature.replace(/{{DATE}}/g, moment().format('llll'));
				}

				// Enums.ComposeType.Empty === sComposeType
				if (-1 < sSignature.indexOf('{{BODY}}'))
				{
					if (sInputText)
					{
						bData = true;

						sSignature = bHtml ? sSignature : Utils.plainToHtml(sSignature, true);
						sSignature = sSignature.replace('{{BODY}}', sInputText);
					}
					else
					{
						sSignature = sSignature.replace(/[\n]?{{BODY}}[\n]?/g, '{{BODY}}');
						sSignature = sSignature.replace(/{{BODY}}/g, '');

						sSignature = bHtml ? sSignature : Utils.plainToHtml(sSignature, true);
					}
				}
				else
				{
					sSignature = bHtml ? sSignature : Utils.plainToHtml(sSignature, true);
				}
			}

			if (!bData)
			{
				if (sSignature)
				{
					switch (sComposeType)
					{
						case Enums.ComposeType.Empty:
							sInputText = sInputText + '<br />' + sSignature;
							break;
						default:
							sInputText = sSignature + '<br />' + sInputText;
							break;
					}
				}
			}
			else
			{
				sInputText = sSignature;
			}

			return sInputText;
		};

		ComposePopupView.prototype.editor = function (fOnInit)
		{
			if (fOnInit)
			{
				var self = this;
				if (!this.oEditor && this.composeEditorArea())
				{
					_.delay(function () {
						self.oEditor = new HtmlEditor(self.composeEditorArea(), null, function () {
							fOnInit(self.oEditor);
						}, function (bHtml) {
							self.isHtml(!!bHtml);
						});
					}, 300);
				}
				else if (this.oEditor)
				{
					fOnInit(this.oEditor);
				}
			}
		};

		/**
		 * @param {string=} sType = Enums.ComposeType.Empty
		 * @param {?MessageModel|Array=} oMessageOrArray = null
		 * @param {Array=} aToEmails = null
		 * @param {Array=} aCcEmails = null
		 * @param {Array=} aBccEmails = null
		 * @param {string=} sCustomSubject = null
		 * @param {string=} sCustomPlainText = null
		 */
		ComposePopupView.prototype.onShow = function (sType, oMessageOrArray,
			aToEmails, aCcEmails, aBccEmails, sCustomSubject, sCustomPlainText)
		{
			kn.routeOff();

			this.autosaveStart();

			if (this.composeInEdit())
			{
				sType = sType || Enums.ComposeType.Empty;

				var self = this;

				if (Enums.ComposeType.Empty !== sType)
				{
					kn.showScreenPopup(__webpack_require__(/*! View/Popup/Ask */ 40), [Translator.i18n('COMPOSE/DISCARD_UNSAVED_DATA'), function () {
						self.initOnShow(sType, oMessageOrArray, aToEmails, aCcEmails, aBccEmails, sCustomSubject, sCustomPlainText);
					}, null, null, null, false]);
				}
				else
				{
					this.addEmailsTo(this.to, aToEmails);
					this.addEmailsTo(this.cc, aCcEmails);
					this.addEmailsTo(this.bcc, aBccEmails);

					if (Utils.isNormal(sCustomSubject) && '' !== sCustomSubject &&
						'' === this.subject())
					{
						this.subject(sCustomSubject);
					}
				}
			}
			else
			{
				this.initOnShow(sType, oMessageOrArray, aToEmails, aCcEmails, aBccEmails, sCustomSubject, sCustomPlainText);
			}
		};

		/**
		 * @param {Function} fKoValue
		 * @param {Array} aEmails
		 */
		ComposePopupView.prototype.addEmailsTo = function (fKoValue, aEmails)
		{
			var
				sValue = Utils.trim(fKoValue()),
				aValue = []
			;

			if (Utils.isNonEmptyArray(aEmails))
			{
				aValue = _.uniq(_.compact(_.map(aEmails, function (oItem) {
					return oItem ? oItem.toLine(false) : null;
				})));

				fKoValue(sValue + ('' === sValue ? '' : ', ') + Utils.trim(aValue.join(', ')));
			}
		};

		/**
		 * @param {string=} sType = Enums.ComposeType.Empty
		 * @param {?MessageModel|Array=} oMessageOrArray = null
		 * @param {Array=} aToEmails = null
		 * @param {Array=} aCcEmails = null
		 * @param {Array=} aBccEmails = null
		 * @param {string=} sCustomSubject = null
		 * @param {string=} sCustomPlainText = null
		 */
		ComposePopupView.prototype.initOnShow = function (sType, oMessageOrArray,
			aToEmails, aCcEmails, aBccEmails, sCustomSubject, sCustomPlainText)
		{
			this.composeInEdit(true);

			var
				self = this,
				sFrom = '',
				sTo = '',
				sCc = '',
				sDate = '',
				sSubject = '',
				oText = null,
				sText = '',
				sReplyTitle = '',
				aResplyAllParts = [],
				oExcludeEmail = {},
				oIdResult = null,
				mEmail = AccountStore.email(),
				sSignature = AccountStore.signature(),
				aDownloads = [],
				aDraftInfo = null,
				oMessage = null,
				sComposeType = sType || Enums.ComposeType.Empty,
				fEmailArrayToStringLineHelper = function (aList, bFriendly) {

					var
						iIndex = 0,
						iLen = aList.length,
						aResult = []
					;

					for (; iIndex < iLen; iIndex++)
					{
						aResult.push(aList[iIndex].toLine(!!bFriendly));
					}

					return aResult.join(', ');
				}
			;

			oMessageOrArray = oMessageOrArray || null;
			if (oMessageOrArray && Utils.isNormal(oMessageOrArray))
			{
				oMessage = Utils.isArray(oMessageOrArray) && 1 === oMessageOrArray.length ? oMessageOrArray[0] :
					(!Utils.isArray(oMessageOrArray) ? oMessageOrArray : null);
			}

			if (null !== mEmail)
			{
				oExcludeEmail[mEmail] = true;
			}

			oIdResult = this.findIdentityIdByMessage(sComposeType, oMessage);
			if (oIdResult && oIdResult[0])
			{
				oExcludeEmail[oIdResult[1]] = true;
				this.currentIdentityID(oIdResult[0]);
			}

			this.reset();

			if (Utils.isNonEmptyArray(aToEmails))
			{
				this.to(fEmailArrayToStringLineHelper(aToEmails));
			}

			if (Utils.isNonEmptyArray(aCcEmails))
			{
				this.cc(fEmailArrayToStringLineHelper(aCcEmails));
			}

			if (Utils.isNonEmptyArray(aBccEmails))
			{
				this.bcc(fEmailArrayToStringLineHelper(aBccEmails));
			}

			if ('' !== sComposeType && oMessage)
			{
				sDate = oMessage.fullFormatDateValue();
				sSubject = oMessage.subject();
				aDraftInfo = oMessage.aDraftInfo;

				oText = $(oMessage.body).clone();
				if (oText)
				{
					oText.find('blockquote.rl-bq-switcher').each(function () {
						$(this).removeClass('rl-bq-switcher hidden-bq');
					});
					oText.find('.rlBlockquoteSwitcher').each(function () {
						$(this).remove();
					});
				}

				oText.find('[data-html-editor-font-wrapper]').removeAttr('data-html-editor-font-wrapper');
				sText = oText.html();

				switch (sComposeType)
				{
					case Enums.ComposeType.Empty:
						break;

					case Enums.ComposeType.Reply:
						this.to(fEmailArrayToStringLineHelper(oMessage.replyEmails(oExcludeEmail)));
						this.subject(Utils.replySubjectAdd('Re', sSubject));
						this.prepearMessageAttachments(oMessage, sComposeType);
						this.aDraftInfo = ['reply', oMessage.uid, oMessage.folderFullNameRaw];
						this.sInReplyTo = oMessage.sMessageId;
						this.sReferences = Utils.trim(this.sInReplyTo + ' ' + oMessage.sReferences);
						break;

					case Enums.ComposeType.ReplyAll:
						aResplyAllParts = oMessage.replyAllEmails(oExcludeEmail);
						this.to(fEmailArrayToStringLineHelper(aResplyAllParts[0]));
						this.cc(fEmailArrayToStringLineHelper(aResplyAllParts[1]));
						this.subject(Utils.replySubjectAdd('Re', sSubject));
						this.prepearMessageAttachments(oMessage, sComposeType);
						this.aDraftInfo = ['reply', oMessage.uid, oMessage.folderFullNameRaw];
						this.sInReplyTo = oMessage.sMessageId;
						this.sReferences = Utils.trim(this.sInReplyTo + ' ' + oMessage.references());
						break;

					case Enums.ComposeType.Forward:
						this.subject(Utils.replySubjectAdd('Fwd', sSubject));
						this.prepearMessageAttachments(oMessage, sComposeType);
						this.aDraftInfo = ['forward', oMessage.uid, oMessage.folderFullNameRaw];
						this.sInReplyTo = oMessage.sMessageId;
						this.sReferences = Utils.trim(this.sInReplyTo + ' ' + oMessage.sReferences);
						break;

					case Enums.ComposeType.ForwardAsAttachment:
						this.subject(Utils.replySubjectAdd('Fwd', sSubject));
						this.prepearMessageAttachments(oMessage, sComposeType);
						this.aDraftInfo = ['forward', oMessage.uid, oMessage.folderFullNameRaw];
						this.sInReplyTo = oMessage.sMessageId;
						this.sReferences = Utils.trim(this.sInReplyTo + ' ' + oMessage.sReferences);
						break;

					case Enums.ComposeType.Draft:
						this.to(fEmailArrayToStringLineHelper(oMessage.to));
						this.cc(fEmailArrayToStringLineHelper(oMessage.cc));
						this.bcc(fEmailArrayToStringLineHelper(oMessage.bcc));

						this.bFromDraft = true;

						this.draftFolder(oMessage.folderFullNameRaw);
						this.draftUid(oMessage.uid);

						this.subject(sSubject);
						this.prepearMessageAttachments(oMessage, sComposeType);

						this.aDraftInfo = Utils.isNonEmptyArray(aDraftInfo) && 3 === aDraftInfo.length ? aDraftInfo : null;
						this.sInReplyTo = oMessage.sInReplyTo;
						this.sReferences = oMessage.sReferences;
						break;

					case Enums.ComposeType.EditAsNew:
						this.to(fEmailArrayToStringLineHelper(oMessage.to));
						this.cc(fEmailArrayToStringLineHelper(oMessage.cc));
						this.bcc(fEmailArrayToStringLineHelper(oMessage.bcc));

						this.subject(sSubject);
						this.prepearMessageAttachments(oMessage, sComposeType);

						this.aDraftInfo = Utils.isNonEmptyArray(aDraftInfo) && 3 === aDraftInfo.length ? aDraftInfo : null;
						this.sInReplyTo = oMessage.sInReplyTo;
						this.sReferences = oMessage.sReferences;
						break;
				}

				switch (sComposeType)
				{
					case Enums.ComposeType.Reply:
					case Enums.ComposeType.ReplyAll:
						sFrom = oMessage.fromToLine(false, true);
						sReplyTitle = Translator.i18n('COMPOSE/REPLY_MESSAGE_TITLE', {
							'DATETIME': sDate,
							'EMAIL': sFrom
						});

						sText = '<br /><br />' + sReplyTitle + ':' +
							'<blockquote><p>' + sText + '</p></blockquote>';

						break;

					case Enums.ComposeType.Forward:
						sFrom = oMessage.fromToLine(false, true);
						sTo = oMessage.toToLine(false, true);
						sCc = oMessage.ccToLine(false, true);
						sText = '<br /><br /><br />' + Translator.i18n('COMPOSE/FORWARD_MESSAGE_TOP_TITLE') +
								'<br />' + Translator.i18n('COMPOSE/FORWARD_MESSAGE_TOP_FROM') + ': ' + sFrom +
								'<br />' + Translator.i18n('COMPOSE/FORWARD_MESSAGE_TOP_TO') + ': ' + sTo +
								(0 < sCc.length ? '<br />' + Translator.i18n('COMPOSE/FORWARD_MESSAGE_TOP_CC') + ': ' + sCc : '') +
								'<br />' + Translator.i18n('COMPOSE/FORWARD_MESSAGE_TOP_SENT') + ': ' + Utils.encodeHtml(sDate) +
								'<br />' + Translator.i18n('COMPOSE/FORWARD_MESSAGE_TOP_SUBJECT') + ': ' + Utils.encodeHtml(sSubject) +
								'<br /><br />' + sText;
						break;
					case Enums.ComposeType.ForwardAsAttachment:
						sText = '';
						break;
				}

				if ('' !== sSignature &&
					Enums.ComposeType.EditAsNew !== sComposeType && Enums.ComposeType.Draft !== sComposeType)
				{
					sText = this.convertSignature(sText, sSignature, fEmailArrayToStringLineHelper(oMessage.from, true), sComposeType);
				}

				this.editor(function (oEditor) {
					oEditor.setHtml(sText, false);
					if (Enums.EditorDefaultType.PlainForced === self.editorDefaultType() ||
						(!oMessage.isHtml() && Enums.EditorDefaultType.HtmlForced !== self.editorDefaultType()))
					{
						oEditor.modeToggle(false);
					}
				});
			}
			else if (Enums.ComposeType.Empty === sComposeType)
			{
				this.subject(Utils.isNormal(sCustomSubject) ? '' + sCustomSubject : '');

				sText = Utils.isNormal(sCustomPlainText) ? '' + sCustomPlainText : '';
				if ('' !== sSignature)
				{
					sText = this.convertSignature(Utils.plainToHtml(sText, true), sSignature, '', sComposeType);
				}

				this.editor(function (oEditor) {
					oEditor.setHtml(sText, false);
					if (Enums.EditorDefaultType.Html !== self.editorDefaultType() &&
						Enums.EditorDefaultType.HtmlForced !== self.editorDefaultType())
					{
						oEditor.modeToggle(false);
					}
				});
			}
			else if (Utils.isNonEmptyArray(oMessageOrArray))
			{
				_.each(oMessageOrArray, function (oMessage) {
					self.addMessageAsAttachment(oMessage);
				});
			}

			aDownloads = this.getAttachmentsDownloadsForUpload();
			if (Utils.isNonEmptyArray(aDownloads))
			{
				Remote.messageUploadAttachments(function (sResult, oData) {

					if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
					{
						var
							oAttachment = null,
							sTempName = ''
						;

						if (!self.viewModelVisibility())
						{
							for (sTempName in oData.Result)
							{
								if (oData.Result.hasOwnProperty(sTempName))
								{
									oAttachment = self.getAttachmentById(oData.Result[sTempName]);
									if (oAttachment)
									{
										oAttachment.tempName(sTempName);
										oAttachment.waiting(false).uploading(false).complete(true);
									}
								}
							}
						}
					}
					else
					{
						self.setMessageAttachmentFailedDownloadText();
					}

				}, aDownloads);
			}

			this.triggerForResize();
		};

		ComposePopupView.prototype.onFocus = function ()
		{
			if ('' === this.to())
			{
				this.to.focusTrigger(!this.to.focusTrigger());
			}
			else if (this.oEditor)
			{
				this.oEditor.focus();
			}

			this.triggerForResize();
		};

		ComposePopupView.prototype.editorResize = function ()
		{
			if (this.oEditor)
			{
				this.oEditor.resize();
			}
		};

		ComposePopupView.prototype.tryToClosePopup = function ()
		{
			var
				self = this,
				PopupsAskViewModel = __webpack_require__(/*! View/Popup/Ask */ 40)
			;

			if (!kn.isPopupVisible(PopupsAskViewModel) && this.modalVisibility())
			{
				if (this.bSkipNextHide || (this.isEmptyForm() && !this.draftUid()))
				{
					Utils.delegateRun(self, 'closeCommand');
				}
				else
				{
					kn.showScreenPopup(PopupsAskViewModel, [Translator.i18n('POPUPS_ASK/DESC_WANT_CLOSE_THIS_WINDOW'), function () {
						if (self.modalVisibility())
						{
							Utils.delegateRun(self, 'closeCommand');
						}
					}]);
				}
			}
		};

		ComposePopupView.prototype.onBuild = function ()
		{
			this.initUploader();

			var
				self = this,
				oScript = null
			;

			key('ctrl+q, command+q', Enums.KeyState.Compose, function () {
				self.identitiesDropdownTrigger(true);
				return false;
			});

			key('ctrl+s, command+s', Enums.KeyState.Compose, function () {
				self.saveCommand();
				return false;
			});

			if (!!Settings.settingsGet('AllowСtrlEnterOnCompose'))
			{
				key('ctrl+enter, command+enter', Enums.KeyState.Compose, function () {
					self.sendCommand();
					return false;
				});
			}

			key('esc', Enums.KeyState.Compose, function () {
				if (self.modalVisibility())
				{
					self.tryToClosePopup();
				}
				return false;
			});

			Globals.$win.on('resize', self.triggerForResize);

			if (this.dropboxEnabled())
			{
				oScript = window.document.createElement('script');
				oScript.type = 'text/javascript';
				oScript.src = 'https://www.dropbox.com/static/api/1/dropins.js';
				$(oScript).attr('id', 'dropboxjs').attr('data-app-key', self.dropboxApiKey());

				window.document.body.appendChild(oScript);
			}

			if (this.driveEnabled())
			{
				$.getScript('https://apis.google.com/js/api.js', function () {
					if (window.gapi)
					{
						self.driveVisible(true);
					}
				});
			}
		};

		ComposePopupView.prototype.driveCallback = function (sAccessToken, oData)
		{
			if (oData && window.XMLHttpRequest && window.google &&
				oData[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED &&
				oData[window.google.picker.Response.DOCUMENTS] && oData[window.google.picker.Response.DOCUMENTS][0] &&
				oData[window.google.picker.Response.DOCUMENTS][0]['id'])
			{
				var
					self = this,
					oRequest = new window.XMLHttpRequest()
				;

				oRequest.open('GET', 'https://www.googleapis.com/drive/v2/files/' + oData[window.google.picker.Response.DOCUMENTS][0]['id']);
				oRequest.setRequestHeader('Authorization', 'Bearer ' + sAccessToken);
				oRequest.addEventListener('load', function() {
					if (oRequest && oRequest.responseText)
					{
						var oItem = JSON.parse(oRequest.responseText), fExport = function (oItem, sMimeType, sExt) {
							if (oItem && oItem['exportLinks'])
							{
								if (oItem['exportLinks'][sMimeType])
								{
									oItem['downloadUrl'] = oItem['exportLinks'][sMimeType];
									oItem['title'] = oItem['title'] + '.' + sExt;
									oItem['mimeType'] = sMimeType;
								}
								else if (oItem['exportLinks']['application/pdf'])
								{
									oItem['downloadUrl'] = oItem['exportLinks']['application/pdf'];
									oItem['title'] = oItem['title'] + '.pdf';
									oItem['mimeType'] = 'application/pdf';
								}
							}
						};

						if (oItem && !oItem['downloadUrl'] && oItem['mimeType'] && oItem['exportLinks'])
						{
							switch (oItem['mimeType'].toString().toLowerCase())
							{
								case 'application/vnd.google-apps.document':
									fExport(oItem, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx');
									break;
								case 'application/vnd.google-apps.spreadsheet':
									fExport(oItem, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx');
									break;
								case 'application/vnd.google-apps.drawing':
									fExport(oItem, 'image/png', 'png');
									break;
								case 'application/vnd.google-apps.presentation':
									fExport(oItem, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'pptx');
									break;
								default:
									fExport(oItem, 'application/pdf', 'pdf');
									break;
							}
						}

						if (oItem && oItem['downloadUrl'])
						{
							self.addDriveAttachment(oItem, sAccessToken);
						}
					}
				});

				oRequest.send();
			}
		};

		ComposePopupView.prototype.driveCreatePiker = function (oOauthToken)
		{
			if (window.gapi && oOauthToken && oOauthToken.access_token)
			{
				var self = this;

				window.gapi.load('picker', {'callback': function () {

					if (window.google && window.google.picker)
					{
						var drivePicker = new window.google.picker.PickerBuilder()
							// .addView(window.google.picker.ViewId.FOLDERS)
							.addView(window.google.picker.ViewId.DOCS)
							.setAppId(Settings.settingsGet('GoogleClientID'))
							.setOAuthToken(oOauthToken.access_token)
							.setCallback(_.bind(self.driveCallback, self, oOauthToken.access_token))
							.enableFeature(window.google.picker.Feature.NAV_HIDDEN)
							// .setOrigin(window.location.protocol + '//' + window.location.host)
							.build()
						;

						drivePicker.setVisible(true);
					}
				}});
			}
		};

		ComposePopupView.prototype.driveOpenPopup = function ()
		{
			if (window.gapi)
			{
				var self = this;

				window.gapi.load('auth', {'callback': function () {

					var
						oAuthToken = window.gapi.auth.getToken(),
						fResult = function (oAuthResult) {
							if (oAuthResult && !oAuthResult.error)
							{
								var oAuthToken = window.gapi.auth.getToken();
								if (oAuthToken)
								{
									self.driveCreatePiker(oAuthToken);
								}

								return true;
							}

							return false;
						}
					;

					if (!oAuthToken)
					{
						window.gapi.auth.authorize({
							'client_id': Settings.settingsGet('GoogleClientID'),
							'scope': 'https://www.googleapis.com/auth/drive.readonly',
							'immediate': true
						}, function (oAuthResult) {

							if (!fResult(oAuthResult))
							{
								window.gapi.auth.authorize({
									'client_id': Settings.settingsGet('GoogleClientID'),
									'scope': 'https://www.googleapis.com/auth/drive.readonly',
									'immediate': false
								}, fResult);
							}
						});
					}
					else
					{
						self.driveCreatePiker(oAuthToken);
					}
				}});
			}
		};

		/**
		 * @param {string} sId
		 * @return {?Object}
		 */
		ComposePopupView.prototype.getAttachmentById = function (sId)
		{
			var
				aAttachments = this.attachments(),
				iIndex = 0,
				iLen = aAttachments.length
			;

			for (; iIndex < iLen; iIndex++)
			{
				if (aAttachments[iIndex] && sId === aAttachments[iIndex].id)
				{
					return aAttachments[iIndex];
				}
			}

			return null;
		};

		ComposePopupView.prototype.cancelAttachmentHelper = function (sId, oJua) {

			var self = this;
			return function () {

				var oItem = _.find(self.attachments(), function (oItem) {
					return oItem && oItem.id === sId;
				});

				if (oItem)
				{
					self.attachments.remove(oItem);
					Utils.delegateRunOnDestroy(oItem);

					if (oJua)
					{
						oJua.cancel(sId);
					}
				}
			};

		};

		ComposePopupView.prototype.initUploader = function ()
		{
			if (this.composeUploaderButton())
			{
				var
					oUploadCache = {},
					iAttachmentSizeLimit = Utils.pInt(Settings.settingsGet('AttachmentLimit')),
					oJua = new Jua({
						'action': Links.upload(),
						'name': 'uploader',
						'queueSize': 2,
						'multipleSizeLimit': 50,
						'disableFolderDragAndDrop': false,
						'clickElement': this.composeUploaderButton(),
						'dragAndDropElement': this.composeUploaderDropPlace()
					})
				;

				if (oJua)
				{
					oJua
		//				.on('onLimitReached', function (iLimit) {
		//					alert(iLimit);
		//				})
						.on('onDragEnter', _.bind(function () {
							this.dragAndDropOver(true);
						}, this))
						.on('onDragLeave', _.bind(function () {
							this.dragAndDropOver(false);
						}, this))
						.on('onBodyDragEnter', _.bind(function () {
							this.dragAndDropVisible(true);
						}, this))
						.on('onBodyDragLeave', _.bind(function () {
							this.dragAndDropVisible(false);
						}, this))
						.on('onProgress', _.bind(function (sId, iLoaded, iTotal) {
							var oItem = null;
							if (Utils.isUnd(oUploadCache[sId]))
							{
								oItem = this.getAttachmentById(sId);
								if (oItem)
								{
									oUploadCache[sId] = oItem;
								}
							}
							else
							{
								oItem = oUploadCache[sId];
							}

							if (oItem)
							{
								oItem.progress(window.Math.floor(iLoaded / iTotal * 100));
							}

						}, this))
						.on('onSelect', _.bind(function (sId, oData) {

							this.dragAndDropOver(false);

							var
								that = this,
								sFileName = Utils.isUnd(oData.FileName) ? '' : oData.FileName.toString(),
								mSize = Utils.isNormal(oData.Size) ? Utils.pInt(oData.Size) : null,
								oAttachment = new ComposeAttachmentModel(sId, sFileName, mSize)
							;

							oAttachment.cancel = that.cancelAttachmentHelper(sId, oJua);

							this.attachments.push(oAttachment);

							this.attachmentsPlace(true);

							if (0 < mSize && 0 < iAttachmentSizeLimit && iAttachmentSizeLimit < mSize)
							{
								oAttachment
									.waiting(false).uploading(true).complete(true)
									.error(Translator.i18n('UPLOAD/ERROR_FILE_IS_TOO_BIG'));

								return false;
							}

							return true;

						}, this))
						.on('onStart', _.bind(function (sId) {

							var
								oItem = null
							;

							if (Utils.isUnd(oUploadCache[sId]))
							{
								oItem = this.getAttachmentById(sId);
								if (oItem)
								{
									oUploadCache[sId] = oItem;
								}
							}
							else
							{
								oItem = oUploadCache[sId];
							}

							if (oItem)
							{
								oItem.waiting(false).uploading(true).complete(false);
							}

						}, this))
						.on('onComplete', _.bind(function (sId, bResult, oData) {

							var
								sError = '',
								mErrorCode = null,
								oAttachmentJson = null,
								oAttachment = this.getAttachmentById(sId)
							;

							oAttachmentJson = bResult && oData && oData.Result && oData.Result.Attachment ? oData.Result.Attachment : null;
							mErrorCode = oData && oData.Result && oData.Result.ErrorCode ? oData.Result.ErrorCode : null;

							if (null !== mErrorCode)
							{
								sError = Translator.getUploadErrorDescByCode(mErrorCode);
							}
							else if (!oAttachmentJson)
							{
								sError = Translator.i18n('UPLOAD/ERROR_UNKNOWN');
							}

							if (oAttachment)
							{
								if ('' !== sError && 0 < sError.length)
								{
									oAttachment
										.waiting(false)
										.uploading(false)
										.complete(true)
										.error(sError)
									;
								}
								else if (oAttachmentJson)
								{
									oAttachment
										.waiting(false)
										.uploading(false)
										.complete(true)
									;

									oAttachment.initByUploadJson(oAttachmentJson);
								}

								if (Utils.isUnd(oUploadCache[sId]))
								{
									delete (oUploadCache[sId]);
								}
							}

						}, this))
					;

					this
						.addAttachmentEnabled(true)
						.dragAndDropEnabled(oJua.isDragAndDropSupported())
					;
				}
				else
				{
					this
						.addAttachmentEnabled(false)
						.dragAndDropEnabled(false)
					;
				}
			}
		};

		/**
		 * @return {Object}
		 */
		ComposePopupView.prototype.prepearAttachmentsForSendOrSave = function ()
		{
			var oResult = {};
			_.each(this.attachmentsInReady(), function (oItem) {
				if (oItem && '' !== oItem.tempName() && oItem.enabled())
				{
					oResult[oItem.tempName()] = [
						oItem.fileName(),
						oItem.isInline ? '1' : '0',
						oItem.CID,
						oItem.contentLocation
					];
				}
			});

			return oResult;
		};

		/**
		 * @param {MessageModel} oMessage
		 */
		ComposePopupView.prototype.addMessageAsAttachment = function (oMessage)
		{
			if (oMessage)
			{
				var
					oAttachment = null,
					sTemp = oMessage.subject()
				;

				sTemp = '.eml' === sTemp.substr(-4).toLowerCase() ? sTemp : sTemp + '.eml';
				oAttachment = new ComposeAttachmentModel(
					oMessage.requestHash, sTemp, oMessage.size()
				);

				oAttachment.fromMessage = true;
				oAttachment.cancel = this.cancelAttachmentHelper(oMessage.requestHash);
				oAttachment.waiting(false).uploading(true).complete(true);

				this.attachments.push(oAttachment);
			}
		};

		/**
		 * @param {Object} oDropboxFile
		 * @return {boolean}
		 */
		ComposePopupView.prototype.addDropboxAttachment = function (oDropboxFile)
		{
			var
				oAttachment = null,
				iAttachmentSizeLimit = Utils.pInt(Settings.settingsGet('AttachmentLimit')),
				mSize = oDropboxFile['bytes']
			;

			oAttachment = new ComposeAttachmentModel(
				oDropboxFile['link'], oDropboxFile['name'], mSize
			);

			oAttachment.fromMessage = false;
			oAttachment.cancel = this.cancelAttachmentHelper(oDropboxFile['link']);
			oAttachment.waiting(false).uploading(true).complete(false);

			this.attachments.push(oAttachment);

			this.attachmentsPlace(true);

			if (0 < mSize && 0 < iAttachmentSizeLimit && iAttachmentSizeLimit < mSize)
			{
				oAttachment.uploading(false).complete(true);
				oAttachment.error(Translator.i18n('UPLOAD/ERROR_FILE_IS_TOO_BIG'));
				return false;
			}

			Remote.composeUploadExternals(function (sResult, oData) {

				var bResult = false;
				oAttachment.uploading(false).complete(true);

				if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
				{
					if (oData.Result[oAttachment.id])
					{
						bResult = true;
						oAttachment.tempName(oData.Result[oAttachment.id]);
					}
				}

				if (!bResult)
				{
					oAttachment.error(Translator.getUploadErrorDescByCode(Enums.UploadErrorCode.FileNoUploaded));
				}

			}, [oDropboxFile['link']]);

			return true;
		};

		/**
		 * @param {Object} oDriveFile
		 * @param {string} sAccessToken
		 * @return {boolean}
		 */
		ComposePopupView.prototype.addDriveAttachment = function (oDriveFile, sAccessToken)
		{
			var
				iAttachmentSizeLimit = Utils.pInt(Settings.settingsGet('AttachmentLimit')),
				oAttachment = null,
				mSize = oDriveFile['fileSize'] ? Utils.pInt(oDriveFile['fileSize']) : 0
			;

			oAttachment = new ComposeAttachmentModel(
				oDriveFile['downloadUrl'], oDriveFile['title'], mSize
			);

			oAttachment.fromMessage = false;
			oAttachment.cancel = this.cancelAttachmentHelper(oDriveFile['downloadUrl']);
			oAttachment.waiting(false).uploading(true).complete(false);

			this.attachments.push(oAttachment);

			this.attachmentsPlace(true);

			if (0 < mSize && 0 < iAttachmentSizeLimit && iAttachmentSizeLimit < mSize)
			{
				oAttachment.uploading(false).complete(true);
				oAttachment.error(Translator.i18n('UPLOAD/ERROR_FILE_IS_TOO_BIG'));
				return false;
			}

			Remote.composeUploadDrive(function (sResult, oData) {

				var bResult = false;
				oAttachment.uploading(false).complete(true);

				if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
				{
					if (oData.Result[oAttachment.id])
					{
						bResult = true;
						oAttachment.tempName(oData.Result[oAttachment.id][0]);
						oAttachment.size(Utils.pInt(oData.Result[oAttachment.id][1]));
					}
				}

				if (!bResult)
				{
					oAttachment.error(Translator.getUploadErrorDescByCode(Enums.UploadErrorCode.FileNoUploaded));
				}

			}, oDriveFile['downloadUrl'], sAccessToken);

			return true;
		};

		/**
		 * @param {MessageModel} oMessage
		 * @param {string} sType
		 */
		ComposePopupView.prototype.prepearMessageAttachments = function (oMessage, sType)
		{
			if (oMessage)
			{
				var
					aAttachments = Utils.isNonEmptyArray(oMessage.attachments()) ? oMessage.attachments() : [],
					iIndex = 0,
					iLen = aAttachments.length,
					oAttachment = null,
					oItem = null,
					bAdd = false
				;

				if (Enums.ComposeType.ForwardAsAttachment === sType)
				{
					this.addMessageAsAttachment(oMessage);
				}
				else
				{
					for (; iIndex < iLen; iIndex++)
					{
						oItem = aAttachments[iIndex];

						bAdd = false;
						switch (sType) {
						case Enums.ComposeType.Reply:
						case Enums.ComposeType.ReplyAll:
							bAdd = oItem.isLinked;
							break;

						case Enums.ComposeType.Forward:
						case Enums.ComposeType.Draft:
						case Enums.ComposeType.EditAsNew:
							bAdd = true;
							break;
						}

						if (bAdd)
						{
							oAttachment = new ComposeAttachmentModel(
								oItem.download, oItem.fileName, oItem.estimatedSize,
								oItem.isInline, oItem.isLinked, oItem.cid, oItem.contentLocation
							);

							oAttachment.fromMessage = true;
							oAttachment.cancel = this.cancelAttachmentHelper(oItem.download);
							oAttachment.waiting(false).uploading(true).complete(false);

							this.attachments.push(oAttachment);
						}
					}
				}
			}
		};

		ComposePopupView.prototype.removeLinkedAttachments = function ()
		{
			var oItem = _.find(this.attachments(), function (oItem) {
				return oItem && oItem.isLinked;
			});

			if (oItem)
			{
				this.attachments.remove(oItem);
				Utils.delegateRunOnDestroy(oItem);
			}
		};

		ComposePopupView.prototype.setMessageAttachmentFailedDownloadText = function ()
		{
			_.each(this.attachments(), function(oAttachment) {
				if (oAttachment && oAttachment.fromMessage)
				{
					oAttachment
						.waiting(false)
						.uploading(false)
						.complete(true)
						.error(Translator.getUploadErrorDescByCode(Enums.UploadErrorCode.FileNoUploaded))
					;
				}
			}, this);
		};

		/**
		 * @param {boolean=} bIncludeAttachmentInProgress = true
		 * @return {boolean}
		 */
		ComposePopupView.prototype.isEmptyForm = function (bIncludeAttachmentInProgress)
		{
			bIncludeAttachmentInProgress = Utils.isUnd(bIncludeAttachmentInProgress) ? true : !!bIncludeAttachmentInProgress;
			var bWithoutAttach = bIncludeAttachmentInProgress ?
				0 === this.attachments().length : 0 === this.attachmentsInReady().length;

			return 0 === this.to().length &&
				0 === this.cc().length &&
				0 === this.bcc().length &&
				0 === this.subject().length &&
				bWithoutAttach &&
				(!this.oEditor || '' === this.oEditor.getData())
			;
		};

		ComposePopupView.prototype.reset = function ()
		{
			this.to('');
			this.cc('');
			this.bcc('');
			this.replyTo('');
			this.subject('');

			this.requestReadReceipt(false);
			this.markAsImportant(false);

			this.attachmentsPlace(false);

			this.aDraftInfo = null;
			this.sInReplyTo = '';
			this.bFromDraft = false;
			this.sReferences = '';

			this.sendError(false);
			this.sendSuccessButSaveError(false);
			this.savedError(false);
			this.savedTime(0);
			this.savedOrSendingText('');
			this.emptyToError(false);
			this.attachmentsInProcessError(false);

			this.showCc(false);
			this.showBcc(false);

			Utils.delegateRunOnDestroy(this.attachments());
			this.attachments([]);

			this.dragAndDropOver(false);
			this.dragAndDropVisible(false);

			this.draftFolder('');
			this.draftUid('');

			this.sending(false);
			this.saving(false);

			if (this.oEditor)
			{
				this.oEditor.clear(false);
			}
		};

		/**
		 * @return {Array}
		 */
		ComposePopupView.prototype.getAttachmentsDownloadsForUpload = function ()
		{
			return _.map(_.filter(this.attachments(), function (oItem) {
				return oItem && '' === oItem.tempName();
			}), function (oItem) {
				return oItem.id;
			});
		};

		ComposePopupView.prototype.triggerForResize = function ()
		{
			this.resizer(!this.resizer());
			this.editorResizeThrottle();
		};

		module.exports = ComposePopupView;

	}());

/***/ },
/* 28 */
/*!******************************!*\
  !*** ./dev/Common/Events.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Plugins = __webpack_require__(/*! Common/Plugins */ 23)
		;

		/**
		 * @constructor
		 */
		function Events()
		{
			this.oSubs = {};
		}

		Events.prototype.oSubs = {};

		/**
		 * @param {string} sName
		 * @param {Function} fFunc
		 * @param {Object=} oContext
		 * @return {Events}
		 */
		Events.prototype.sub = function (sName, fFunc, oContext)
		{
			if (Utils.isUnd(this.oSubs[sName]))
			{
				this.oSubs[sName] = [];
			}

			this.oSubs[sName].push([fFunc, oContext]);

			return this;
		};

		/**
		 * @param {string} sName
		 * @param {Array=} aArgs
		 * @return {Events}
		 */
		Events.prototype.pub = function (sName, aArgs)
		{
			Plugins.runHook('rl-pub', [sName, aArgs]);

			if (!Utils.isUnd(this.oSubs[sName]))
			{
				_.each(this.oSubs[sName], function (aItem) {
					if (aItem[0])
					{
						aItem[0].apply(aItem[1] || null, aArgs || []);
					}
				});
			}

			return this;
		};

		module.exports = new Events();

	}());

/***/ },
/* 29 */
/*!***********************************!*\
  !*** ./dev/Component/Abstract.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 */
		function AbstractComponent()
		{
			this.disposable = [];
		}

		/**
		 * @type {Array}
		 */
		AbstractComponent.prototype.disposable = [];

		AbstractComponent.prototype.dispose = function ()
		{
			_.each(this.disposable, function (fFuncToDispose) {
				if (fFuncToDispose && fFuncToDispose.dispose)
				{
					fFuncToDispose.dispose();
				}
			});
		};

		/**
		 * @param {*} ClassObject
		 * @param {string} sTemplateID
		 * @return {Object}
		 */
		AbstractComponent.componentExportHelper = function (ClassObject, sTemplateID) {
			return {
				viewModel: {
					createViewModel: function(oParams, oCmponentInfo) {

						oParams = oParams || {};
						oParams.element = null;

						if (oCmponentInfo.element)
						{
							oParams.element = $(oCmponentInfo.element);

							__webpack_require__(/*! Common/Translator */ 7).i18nToNode(oParams.element);

							if (!Utils.isUnd(oParams.inline) && ko.unwrap(oParams.inline))
							{
								oParams.element.css('display', 'inline-block');
							}
						}

						return new ClassObject(oParams);
					}
				},
				template: {
					element: sTemplateID
				}
			};
		};

		module.exports = AbstractComponent;

	}());


/***/ },
/* 30 */
/*!********************************!*\
  !*** ./dev/Stores/User/App.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			
			AppStore = __webpack_require__(/*! Stores/App */ 65)
		;

		/**
		 * @constructor
		 */
		function AppUserStore()
		{
			AppStore.call(this);

			this.projectHash = ko.observable('');
			this.threadsAllowed = ko.observable(false);

			this.contactsAutosave = ko.observable(false);
			this.useLocalProxyForExternalImages = ko.observable(false);

			this.contactsIsAllowed = ko.observable(false);

			this.devEmail = '';
			this.devPassword = '';
		}

		AppUserStore.prototype.populate = function()
		{
			AppStore.prototype.populate.call(this);

			this.projectHash(Settings.settingsGet('ProjectHash'));

			this.useLocalProxyForExternalImages(!!Settings.settingsGet('UseLocalProxyForExternalImages'));
			this.contactsIsAllowed(!!Settings.settingsGet('ContactsIsAllowed'));

			this.devEmail = Settings.settingsGet('DevEmail');
			this.devPassword = Settings.settingsGet('DevPassword');
		};

		module.exports = new AppUserStore();

	}());


/***/ },
/* 31 */
/*!********************************!*\
  !*** ./dev/Stores/Language.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function LanguageStore()
		{
			this.languages = ko.observableArray([]);

			this.language = ko.observable('')
				.extend({'limitedList': this.languages});
		}

		LanguageStore.prototype.populate = function ()
		{
			var aLanguages = Settings.settingsGet('Languages');

			this.languages(Utils.isArray(aLanguages) ? aLanguages : []);
			this.language(Settings.settingsGet('Language'));
		};

		module.exports = new LanguageStore();

	}());


/***/ },
/* 32 */
/*!***********************************!*\
  !*** ./dev/Stores/User/Folder.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Consts = __webpack_require__(/*! Common/Consts */ 16),

			Cache = __webpack_require__(/*! Storage/User/Cache */ 19)
		;

		/**
		 * @constructor
		 */
		function FolderUserStore()
		{
			this.sentFolder = ko.observable('');
			this.draftFolder = ko.observable('');
			this.spamFolder = ko.observable('');
			this.trashFolder = ko.observable('');
			this.archiveFolder = ko.observable('');

			this.computed();
			this.subscribe();
		}

		FolderUserStore.prototype.computed = function ()
		{
			this.draftFolderNotEnabled = ko.computed(function () {
				return '' === this.draftFolder() || Consts.Values.UnuseOptionValue === this.draftFolder();
			}, this);
		};

		FolderUserStore.prototype.subscribe = function ()
		{
			var
				fRemoveSystemFolderType = function (observable) {
					return function () {
						var oFolder = Cache.getFolderFromCacheList(observable());
						if (oFolder)
						{
							oFolder.type(Enums.FolderType.User);
						}
					};
				},
				fSetSystemFolderType = function (iType) {
					return function (sValue) {
						var oFolder = Cache.getFolderFromCacheList(sValue);
						if (oFolder)
						{
							oFolder.type(iType);
						}
					};
				}
			;

			this.sentFolder.subscribe(fRemoveSystemFolderType(this.sentFolder), this, 'beforeChange');
			this.draftFolder.subscribe(fRemoveSystemFolderType(this.draftFolder), this, 'beforeChange');
			this.spamFolder.subscribe(fRemoveSystemFolderType(this.spamFolder), this, 'beforeChange');
			this.trashFolder.subscribe(fRemoveSystemFolderType(this.trashFolder), this, 'beforeChange');
			this.archiveFolder.subscribe(fRemoveSystemFolderType(this.archiveFolder), this, 'beforeChange');

			this.sentFolder.subscribe(fSetSystemFolderType(Enums.FolderType.SentItems), this);
			this.draftFolder.subscribe(fSetSystemFolderType(Enums.FolderType.Draft), this);
			this.spamFolder.subscribe(fSetSystemFolderType(Enums.FolderType.Spam), this);
			this.trashFolder.subscribe(fSetSystemFolderType(Enums.FolderType.Trash), this);
			this.archiveFolder.subscribe(fSetSystemFolderType(Enums.FolderType.Archive), this);
		};

		module.exports = new FolderUserStore();

	}());


/***/ },
/* 33 */
/*!****************************************!*\
  !*** ./dev/Component/AbstractInput.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractComponent = __webpack_require__(/*! Component/Abstract */ 29)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractComponent
		 */
		function AbstractInput(oParams)
		{
			AbstractComponent.call(this);

			this.value = oParams.value || '';
			this.size = oParams.size || 0;
			this.label = oParams.label || '';
			this.preLabel = oParams.preLabel || '';
			this.enable = Utils.isUnd(oParams.enable) ? true : oParams.enable;
			this.trigger = oParams.trigger && oParams.trigger.subscribe ? oParams.trigger : null;
			this.placeholder = oParams.placeholder || '';

			this.labeled = !Utils.isUnd(oParams.label);
			this.preLabeled = !Utils.isUnd(oParams.preLabel);
			this.triggered = !Utils.isUnd(oParams.trigger) && !!this.trigger;

			this.classForTrigger = ko.observable('');

			this.className = ko.computed(function () {

				var
					iSize = ko.unwrap(this.size),
					sSuffixValue = this.trigger ?
						' ' + Utils.trim('settings-saved-trigger-input ' + this.classForTrigger()) : ''
				;

				return (0 < iSize ? 'span' + iSize : '') + sSuffixValue;

			}, this);

			if (!Utils.isUnd(oParams.width) && oParams.element)
			{
				oParams.element.find('input,select,textarea').css('width', oParams.width);
			}

			this.disposable.push(this.className);

			if (this.trigger)
			{
				this.setTriggerState(this.trigger());

				this.disposable.push(
					this.trigger.subscribe(this.setTriggerState, this)
				);
			}
		}

		AbstractInput.prototype.setTriggerState = function (nValue)
		{
			switch (Utils.pInt(nValue))
			{
				case Enums.SaveSettingsStep.TrueResult:
					this.classForTrigger('success');
					break;
				case Enums.SaveSettingsStep.FalseResult:
					this.classForTrigger('error');
					break;
				default:
					this.classForTrigger('');
					break;
			}
		};

		_.extend(AbstractInput.prototype, AbstractComponent.prototype);

		AbstractInput.componentExportHelper = AbstractComponent.componentExportHelper;

		module.exports = AbstractInput;

	}());


/***/ },
/* 34 */
/*!*************************************!*\
  !*** ./dev/Knoin/AbstractScreen.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			crossroads = __webpack_require__(/*! crossroads */ 41),

			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @param {string} sScreenName
		 * @param {?=} aViewModels = []
		 * @constructor
		 */
		function AbstractScreen(sScreenName, aViewModels)
		{
			this.sScreenName = sScreenName;
			this.aViewModels = Utils.isArray(aViewModels) ? aViewModels : [];
		}

		/**
		 * @type {Array}
		 */
		AbstractScreen.prototype.oCross = null;

		/**
		 * @type {string}
		 */
		AbstractScreen.prototype.sScreenName = '';

		/**
		 * @type {Array}
		 */
		AbstractScreen.prototype.aViewModels = [];

		/**
		 * @return {Array}
		 */
		AbstractScreen.prototype.viewModels = function ()
		{
			return this.aViewModels;
		};

		/**
		 * @return {string}
		 */
		AbstractScreen.prototype.screenName = function ()
		{
			return this.sScreenName;
		};

		AbstractScreen.prototype.routes = function ()
		{
			return null;
		};

		/**
		 * @return {?Object}
		 */
		AbstractScreen.prototype.__cross = function ()
		{
			return this.oCross;
		};

		AbstractScreen.prototype.__start = function ()
		{
			var
				aRoutes = this.routes(),
				oRoute = null,
				fMatcher = null
			;

			if (Utils.isNonEmptyArray(aRoutes))
			{
				fMatcher = _.bind(this.onRoute || Utils.emptyFunction, this);
				oRoute = crossroads.create();

				_.each(aRoutes, function (aItem) {
					oRoute.addRoute(aItem[0], fMatcher).rules = aItem[1];
				});

				this.oCross = oRoute;
			}
		};

		module.exports = AbstractScreen;

	}());

/***/ },
/* 35 */
/*!******************************!*\
  !*** ./dev/Stores/Social.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3)
		;

		/**
		 * @constructor
		 */
		function SocialStore()
		{
			this.google = {};
			this.twitter = {};
			this.facebook = {};
			this.dropbox = {};

			// Google
			this.google.enabled = ko.observable(false);

			this.google.clientID = ko.observable('');
			this.google.clientSecret = ko.observable('');
			this.google.apiKey = ko.observable('');

			this.google.loading = ko.observable(false);
			this.google.userName = ko.observable('');

			this.google.loggined = ko.computed(function () {
				return '' !== this.google.userName();
			}, this);

			this.google.capa = {};
			this.google.capa.auth = ko.observable(false);
			this.google.capa.drive = ko.observable(false);
			this.google.capa.preview = ko.observable(false);

			this.google.require = {};
			this.google.require.clientSettings = ko.computed(function () {
				return this.google.enabled() && (this.google.capa.auth() || this.google.capa.drive());
			}, this);

			this.google.require.apiKeySettings = ko.computed(function () {
				return this.google.enabled() && this.google.capa.drive();
			}, this);

			// Facebook
			this.facebook.enabled = ko.observable(false);
			this.facebook.appID = ko.observable('');
			this.facebook.appSecret = ko.observable('');
			this.facebook.loading = ko.observable(false);
			this.facebook.userName = ko.observable('');
			this.facebook.supported = ko.observable(false);

			this.facebook.loggined = ko.computed(function () {
				return '' !== this.facebook.userName();
			}, this);

			// Twitter
			this.twitter.enabled = ko.observable(false);
			this.twitter.consumerKey = ko.observable('');
			this.twitter.consumerSecret = ko.observable('');
			this.twitter.loading = ko.observable(false);
			this.twitter.userName = ko.observable('');

			this.twitter.loggined = ko.computed(function () {
				return '' !== this.twitter.userName();
			}, this);

			// Dropbox
			this.dropbox.enabled = ko.observable(false);
			this.dropbox.apiKey = ko.observable('');
		}

		SocialStore.prototype.google = {};
		SocialStore.prototype.twitter = {};
		SocialStore.prototype.facebook = {};
		SocialStore.prototype.dropbox = {};

		SocialStore.prototype.populate = function ()
		{
			var Settings = __webpack_require__(/*! Storage/Settings */ 9);

			this.google.enabled(!!Settings.settingsGet('AllowGoogleSocial'));
			this.google.clientID(Settings.settingsGet('GoogleClientID'));
			this.google.clientSecret(Settings.settingsGet('GoogleClientSecret'));
			this.google.apiKey(Settings.settingsGet('GoogleApiKey'));

			this.google.capa.auth(!!Settings.settingsGet('AllowGoogleSocialAuth'));
			this.google.capa.drive(!!Settings.settingsGet('AllowGoogleSocialDrive'));
			this.google.capa.preview(!!Settings.settingsGet('AllowGoogleSocialPreview'));

			this.facebook.enabled(!!Settings.settingsGet('AllowFacebookSocial'));
			this.facebook.appID(Settings.settingsGet('FacebookAppID'));
			this.facebook.appSecret(Settings.settingsGet('FacebookAppSecret'));
			this.facebook.supported(!!Settings.settingsGet('SupportedFacebookSocial'));

			this.twitter.enabled = ko.observable(!!Settings.settingsGet('AllowTwitterSocial'));
			this.twitter.consumerKey = ko.observable(Settings.settingsGet('TwitterConsumerKey'));
			this.twitter.consumerSecret = ko.observable(Settings.settingsGet('TwitterConsumerSecret'));

			this.dropbox.enabled(!!Settings.settingsGet('AllowDropboxSocial'));
			this.dropbox.apiKey(Settings.settingsGet('DropboxApiKey'));
		};

		module.exports = new SocialStore();

	}());


/***/ },
/* 36 */
/*!********************************!*\
  !*** external "window.moment" ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.moment;

/***/ },
/* 37 */,
/* 38 */
/*!******************************************!*\
  !*** ./dev/Component/AbstracCheckbox.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractComponent = __webpack_require__(/*! Component/Abstract */ 29)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractComponent
		 */
		function AbstracCheckbox(oParams)
		{
			AbstractComponent.call(this);

			this.value = oParams.value;
			if (Utils.isUnd(this.value) || !this.value.subscribe)
			{
				this.value = ko.observable(Utils.isUnd(this.value) ? false : !!this.value);
			}

			this.enable = oParams.enable;
			if (Utils.isUnd(this.enable) || !this.enable.subscribe)
			{
				this.enable = ko.observable(Utils.isUnd(this.enable) ? true : !!this.enable);
			}

			this.disable = oParams.disable;
			if (Utils.isUnd(this.disable) || !this.disable.subscribe)
			{
				this.disable = ko.observable(Utils.isUnd(this.disable) ? false : !!this.disable);
			}

			this.label = oParams.label || '';
			this.inline = Utils.isUnd(oParams.inline) ? false : oParams.inline;

			this.readOnly = Utils.isUnd(oParams.readOnly) ? false : !!oParams.readOnly;
			this.inverted = Utils.isUnd(oParams.inverted) ? false : !!oParams.inverted;

			this.labeled = !Utils.isUnd(oParams.label);
		}

		_.extend(AbstracCheckbox.prototype, AbstractComponent.prototype);

		AbstracCheckbox.prototype.click = function() {
			if (!this.readOnly && this.enable() && !this.disable())
			{
				this.value(!this.value());
			}
		};

		AbstracCheckbox.componentExportHelper = AbstractComponent.componentExportHelper;

		module.exports = AbstracCheckbox;

	}());


/***/ },
/* 39 */
/*!*****************************!*\
  !*** ./dev/Stores/Theme.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function ThemeStore()
		{
			this.themes = ko.observableArray([]);
			this.themeBackgroundName = ko.observable('');
			this.themeBackgroundHash = ko.observable('');

			this.theme = ko.observable('')
				.extend({'limitedList': this.themes});
		}

		ThemeStore.prototype.populate = function ()
		{
			var aThemes = Settings.settingsGet('Themes');

			this.themes(Utils.isArray(aThemes) ? aThemes : []);
			this.theme(Settings.settingsGet('Theme'));
			this.themeBackgroundName(Settings.settingsGet('UserBackgroundName'));
			this.themeBackgroundHash(Settings.settingsGet('UserBackgroundHash'));
		};

		module.exports = new ThemeStore();

	}());


/***/ },
/* 40 */
/*!*******************************!*\
  !*** ./dev/View/Popup/Ask.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),
			key = __webpack_require__(/*! key */ 21),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function AskPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsAsk');

			this.askDesc = ko.observable('');
			this.yesButton = ko.observable('');
			this.noButton = ko.observable('');

			this.yesFocus = ko.observable(false);
			this.noFocus = ko.observable(false);

			this.fYesAction = null;
			this.fNoAction = null;

			this.bFocusYesOnShow = true;
			this.bDisabeCloseOnEsc = true;
			this.sDefaultKeyScope = Enums.KeyState.PopupAsk;

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/Ask', 'PopupsAskViewModel'], AskPopupView);
		_.extend(AskPopupView.prototype, AbstractView.prototype);

		AskPopupView.prototype.clearPopup = function ()
		{
			this.askDesc('');
			this.yesButton(Translator.i18n('POPUPS_ASK/BUTTON_YES'));
			this.noButton(Translator.i18n('POPUPS_ASK/BUTTON_NO'));

			this.yesFocus(false);
			this.noFocus(false);

			this.fYesAction = null;
			this.fNoAction = null;
		};

		AskPopupView.prototype.yesClick = function ()
		{
			this.cancelCommand();

			if (Utils.isFunc(this.fYesAction))
			{
				this.fYesAction.call(null);
			}
		};

		AskPopupView.prototype.noClick = function ()
		{
			this.cancelCommand();

			if (Utils.isFunc(this.fNoAction))
			{
				this.fNoAction.call(null);
			}
		};

		/**
		 * @param {string} sAskDesc
		 * @param {Function=} fYesFunc
		 * @param {Function=} fNoFunc
		 * @param {string=} sYesButton
		 * @param {string=} sNoButton
		 * @param {boolean=} bFocusYesOnShow
		 */
		AskPopupView.prototype.onShow = function (sAskDesc, fYesFunc, fNoFunc, sYesButton, sNoButton, bFocusYesOnShow)
		{
			this.clearPopup();

			this.fYesAction = fYesFunc || null;
			this.fNoAction = fNoFunc || null;

			this.askDesc(sAskDesc || '');
			if (sYesButton)
			{
				this.yesButton(sYesButton);
			}

			if (sYesButton)
			{
				this.yesButton(sNoButton);
			}

			this.bFocusYesOnShow = Utils.isUnd(bFocusYesOnShow) ? true : !!bFocusYesOnShow;
		};

		AskPopupView.prototype.onFocus = function ()
		{
			if (this.bFocusYesOnShow)
			{
				this.yesFocus(true);
			}
		};

		AskPopupView.prototype.onBuild = function ()
		{
			key('tab, shift+tab, right, left', Enums.KeyState.PopupAsk, _.bind(function () {
				if (this.yesFocus())
				{
					this.noFocus(true);
				}
				else
				{
					this.yesFocus(true);
				}
				return false;
			}, this));

			key('esc', Enums.KeyState.PopupAsk, _.bind(function () {
				this.noClick();
				return false;
			}, this));
		};

		module.exports = AskPopupView;

	}());

/***/ },
/* 41 */
/*!************************************!*\
  !*** external "window.crossroads" ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.crossroads;

/***/ },
/* 42 */,
/* 43 */
/*!*************************************!*\
  !*** ./dev/Stores/User/Identity.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function IdentityUserStore()
		{
			this.defaultIdentityID = ko.observable('');

			this.identities = ko.observableArray([]);
			this.identities.loading = ko.observable(false).extend({'throttle': 100});
		}

		IdentityUserStore.prototype.populate = function ()
		{
			this.defaultIdentityID(Settings.settingsGet('DefaultIdentityID'));
		};

		module.exports = new IdentityUserStore();

	}());


/***/ },
/* 44 */
/*!****************************************!*\
  !*** ./dev/View/Popup/FolderSystem.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			FolderStore = __webpack_require__(/*! Stores/User/Folder */ 32),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Data = __webpack_require__(/*! Storage/User/Data */ 15),
			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function FolderSystemPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsFolderSystem');

			Translator.initOnStartOrLangChange(function () {
				this.sChooseOnText = Translator.i18n('POPUPS_SYSTEM_FOLDERS/SELECT_CHOOSE_ONE');
				this.sUnuseText = Translator.i18n('POPUPS_SYSTEM_FOLDERS/SELECT_UNUSE_NAME');
			}, this);

			this.notification = ko.observable('');

			this.folderSelectList = ko.computed(function () {
				return Utils.folderListOptionsBuilder([], Data.folderList(), Data.folderListSystemNames(), [
					['', this.sChooseOnText],
					[Consts.Values.UnuseOptionValue, this.sUnuseText]
				], null, null, null, null, null, true);
			}, this);

			var
				fSaveSystemFolders = null,
				fCallback = null
			;

			this.sentFolder = FolderStore.sentFolder;
			this.draftFolder = FolderStore.draftFolder;
			this.spamFolder = FolderStore.spamFolder;
			this.trashFolder = FolderStore.trashFolder;
			this.archiveFolder = FolderStore.archiveFolder;

			fSaveSystemFolders = _.debounce(function () {

				Settings.settingsSet('SentFolder', FolderStore.sentFolder());
				Settings.settingsSet('DraftFolder', FolderStore.draftFolder());
				Settings.settingsSet('SpamFolder', FolderStore.spamFolder());
				Settings.settingsSet('TrashFolder', FolderStore.trashFolder());
				Settings.settingsSet('ArchiveFolder', FolderStore.archiveFolder());

				Remote.saveSystemFolders(Utils.emptyFunction, {
					'SentFolder': FolderStore.sentFolder(),
					'DraftFolder': FolderStore.draftFolder(),
					'SpamFolder': FolderStore.spamFolder(),
					'TrashFolder': FolderStore.trashFolder(),
					'ArchiveFolder': FolderStore.archiveFolder(),
					'NullFolder': 'NullFolder'
				});

			}, 1000);

			fCallback = function () {

				Settings.settingsSet('SentFolder', FolderStore.sentFolder());
				Settings.settingsSet('DraftFolder', FolderStore.draftFolder());
				Settings.settingsSet('SpamFolder', FolderStore.spamFolder());
				Settings.settingsSet('TrashFolder', FolderStore.trashFolder());
				Settings.settingsSet('ArchiveFolder', FolderStore.archiveFolder());

				fSaveSystemFolders();
			};

			FolderStore.sentFolder.subscribe(fCallback);
			FolderStore.draftFolder.subscribe(fCallback);
			FolderStore.spamFolder.subscribe(fCallback);
			FolderStore.trashFolder.subscribe(fCallback);
			FolderStore.archiveFolder.subscribe(fCallback);

			this.defautOptionsAfterRender = Utils.defautOptionsAfterRender;

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/FolderSystem', 'PopupsFolderSystemViewModel'], FolderSystemPopupView);
		_.extend(FolderSystemPopupView.prototype, AbstractView.prototype);

		FolderSystemPopupView.prototype.sChooseOnText = '';
		FolderSystemPopupView.prototype.sUnuseText = '';

		/**
		 * @param {number=} iNotificationType = Enums.SetSystemFoldersNotification.None
		 */
		FolderSystemPopupView.prototype.onShow = function (iNotificationType)
		{
			var sNotification = '';

			iNotificationType = Utils.isUnd(iNotificationType) ? Enums.SetSystemFoldersNotification.None : iNotificationType;

			switch (iNotificationType)
			{
				case Enums.SetSystemFoldersNotification.Sent:
					sNotification = Translator.i18n('POPUPS_SYSTEM_FOLDERS/NOTIFICATION_SENT');
					break;
				case Enums.SetSystemFoldersNotification.Draft:
					sNotification = Translator.i18n('POPUPS_SYSTEM_FOLDERS/NOTIFICATION_DRAFTS');
					break;
				case Enums.SetSystemFoldersNotification.Spam:
					sNotification = Translator.i18n('POPUPS_SYSTEM_FOLDERS/NOTIFICATION_SPAM');
					break;
				case Enums.SetSystemFoldersNotification.Trash:
					sNotification = Translator.i18n('POPUPS_SYSTEM_FOLDERS/NOTIFICATION_TRASH');
					break;
				case Enums.SetSystemFoldersNotification.Archive:
					sNotification = Translator.i18n('POPUPS_SYSTEM_FOLDERS/NOTIFICATION_ARCHIVE');
					break;
			}

			this.notification(sNotification);
		};

		module.exports = FolderSystemPopupView;

	}());

/***/ },
/* 45 */
/*!*************************************!*\
  !*** ./dev/View/Popup/Languages.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function LanguagesPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsLanguages');

			this.LanguageStore = __webpack_require__(/*! Stores/Language */ 31);

			this.exp = ko.observable(false);

			this.languages = ko.computed(function () {
				return _.map(this.LanguageStore.languages(), function (sLanguage) {
					return {
						'key': sLanguage,
						'selected': ko.observable(false),
						'fullName': Utils.convertLangName(sLanguage)
					};
				});
			}, this);

			this.LanguageStore.language.subscribe(function () {
				this.resetMainLanguage();
			}, this);

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/Languages', 'PopupsLanguagesViewModel'], LanguagesPopupView);
		_.extend(LanguagesPopupView.prototype, AbstractView.prototype);

		LanguagesPopupView.prototype.languageEnName = function (sLanguage)
		{
			var sResult = Utils.convertLangName(sLanguage, true);
			return 'English' === sResult ? '' : sResult;
		};

		LanguagesPopupView.prototype.resetMainLanguage = function ()
		{
			var sCurrent = this.LanguageStore.language();
			_.each(this.languages(), function (oItem) {
				oItem['selected'](oItem['key'] === sCurrent);
			});
		};

		LanguagesPopupView.prototype.onShow = function ()
		{
			this.exp(true);

			this.resetMainLanguage();
		};

		LanguagesPopupView.prototype.onHide = function ()
		{
			this.exp(false);
		};

		LanguagesPopupView.prototype.changeLanguage = function (sLang)
		{
			this.LanguageStore.language(sLang);
			this.cancelCommand();
		};

		module.exports = LanguagesPopupView;

	}());

/***/ },
/* 46 */
/*!*****************************!*\
  !*** ./dev/App/Abstract.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),

			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 12),
			Events = __webpack_require__(/*! Common/Events */ 28),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),

			AbstractBoot = __webpack_require__(/*! Knoin/AbstractBoot */ 57)
		;

		/**
		 * @constructor
		 * @param {RemoteStorage|AdminRemoteStorage} Remote
		 * @extends AbstractBoot
		 */
		function AbstractApp(Remote)
		{
			AbstractBoot.call(this);

			this.isLocalAutocomplete = true;

			this.iframe = $('<iframe style="display:none" src="javascript:;" />').appendTo('body');

			Globals.$win.on('error', function (oEvent) {
				if (oEvent && oEvent.originalEvent && oEvent.originalEvent.message &&
					-1 === Utils.inArray(oEvent.originalEvent.message, [
						'Script error.', 'Uncaught Error: Error calling method on NPObject.'
					]))
				{
					Remote.jsError(
						Utils.emptyFunction,
						oEvent.originalEvent.message,
						oEvent.originalEvent.filename,
						oEvent.originalEvent.lineno,
						window.location && window.location.toString ? window.location.toString() : '',
						Globals.$html.attr('class'),
						Utils.microtime() - Globals.now
					);
				}
			});

			Globals.$doc.on('keydown', function (oEvent) {
				if (oEvent && oEvent.ctrlKey)
				{
					Globals.$html.addClass('rl-ctrl-key-pressed');
				}
			}).on('keyup', function (oEvent) {
				if (oEvent && !oEvent.ctrlKey)
				{
					Globals.$html.removeClass('rl-ctrl-key-pressed');
				}
			});
		}

		_.extend(AbstractApp.prototype, AbstractBoot.prototype);

		AbstractApp.prototype.remote = function ()
		{
			return null;
		};

		AbstractApp.prototype.data = function ()
		{
			return null;
		};

		/**
		 * @param {string} sLink
		 * @return {boolean}
		 */
		AbstractApp.prototype.download = function (sLink)
		{
			var
				oE = null,
				oLink = null,
				sUserAgent = window.navigator.userAgent.toLowerCase()
			;

			if (sUserAgent && (sUserAgent.indexOf('chrome') > -1 || sUserAgent.indexOf('chrome') > -1))
			{
				oLink = window.document.createElement('a');
				oLink['href'] = sLink;

				if (window.document['createEvent'])
				{
					oE = window.document['createEvent']('MouseEvents');
					if (oE && oE['initEvent'] && oLink['dispatchEvent'])
					{
						oE['initEvent']('click', true, true);
						oLink['dispatchEvent'](oE);
						return true;
					}
				}
			}

			if (Globals.bMobileDevice)
			{
				window.open(sLink, '_self');
				window.focus();
			}
			else
			{
				this.iframe.attr('src', sLink);
		//		window.document.location.href = sLink;
			}

			return true;
		};

		AbstractApp.prototype.googlePreviewSupportedCache = null;

		/**
		 * @return {boolean}
		 */
		AbstractApp.prototype.googlePreviewSupported = function ()
		{
			if (null === this.googlePreviewSupportedCache)
			{
				this.googlePreviewSupportedCache = !!Settings.settingsGet('AllowGoogleSocial') &&
					!!Settings.settingsGet('AllowGoogleSocialPreview');
			}

			return this.googlePreviewSupportedCache;
		};

		/**
		 * @param {string} sTitle
		 */
		AbstractApp.prototype.setTitle = function (sTitle)
		{
			sTitle = ((Utils.isNormal(sTitle) && 0 < sTitle.length) ? sTitle + ' - ' : '') +
				Settings.settingsGet('Title') || '';

			window.document.title = sTitle + ' ...';
			window.document.title = sTitle;
		};

		AbstractApp.prototype.redirectToAdminPanel = function ()
		{
			_.delay(function () {
				window.location.href = Links.rootAdmin();
			}, 100);
		};

		AbstractApp.prototype.clearClientSideToken = function ()
		{
			if (window.__rlah_clear)
			{
				window.__rlah_clear();
			}
		};

		/**
		 * @param {boolean=} bLogout = false
		 * @param {boolean=} bClose = false
		 */
		AbstractApp.prototype.loginAndLogoutReload = function (bLogout, bClose)
		{
			var
				kn = __webpack_require__(/*! Knoin/Knoin */ 5),
				sCustomLogoutLink = Utils.pString(Settings.settingsGet('CustomLogoutLink')),
				bInIframe = !!Settings.settingsGet('InIframe')
			;

			bLogout = Utils.isUnd(bLogout) ? false : !!bLogout;
			bClose = Utils.isUnd(bClose) ? false : !!bClose;

			if (bLogout)
			{
				this.clearClientSideToken();
			}

			if (bLogout && bClose && window.close)
			{
				window.close();
			}

			sCustomLogoutLink = sCustomLogoutLink || './';
			if (bLogout && window.location.href !== sCustomLogoutLink)
			{
				_.delay(function () {
					if (bInIframe && window.parent)
					{
						window.parent.location.href = sCustomLogoutLink;
					}
					else
					{
						window.location.href = sCustomLogoutLink;
					}
				}, 100);
			}
			else
			{
				kn.routeOff();
				kn.setHash(Links.root(), true);
				kn.routeOff();

				_.delay(function () {
					if (bInIframe && window.parent)
					{
						window.parent.location.reload();
					}
					else
					{
						window.location.reload();
					}
				}, 100);
			}
		};

		AbstractApp.prototype.historyBack = function ()
		{
			window.history.back();
		};

		AbstractApp.prototype.bootstart = function ()
		{
			Events.pub('rl.bootstart');

			var
				ssm = __webpack_require__(/*! ssm */ 77),
				ko = __webpack_require__(/*! ko */ 3)
			;

			ko.components.register('SaveTrigger', __webpack_require__(/*! Component/SaveTrigger */ 54));
			ko.components.register('Input', __webpack_require__(/*! Component/Input */ 51));
			ko.components.register('Select', __webpack_require__(/*! Component/Select */ 55));
			ko.components.register('TextArea', __webpack_require__(/*! Component/TextArea */ 56));
			ko.components.register('Radio', __webpack_require__(/*! Component/Radio */ 53));

			if (Settings.settingsGet('MaterialDesign') && Globals.bAnimationSupported)
			{
				ko.components.register('Checkbox', __webpack_require__(/*! Component/MaterialDesign/Checkbox */ 52));
			}
			else
			{
	//			ko.components.register('Checkbox', require('Component/Classic/Checkbox'));
				ko.components.register('Checkbox', __webpack_require__(/*! Component/Checkbox */ 50));
			}

			Translator.initOnStartOrLangChange(Translator.initNotificationLanguage, Translator);

			_.delay(Utils.windowResizeCallback, 1000);

			ssm.addState({
				'id': 'mobile',
				'maxWidth': 767,
				'onEnter': function() {
					Globals.$html.addClass('ssm-state-mobile');
					Events.pub('ssm.mobile-enter');
				},
				'onLeave': function() {
					Globals.$html.removeClass('ssm-state-mobile');
					Events.pub('ssm.mobile-leave');
				}
			});

			ssm.addState({
				'id': 'tablet',
				'minWidth': 768,
				'maxWidth': 999,
				'onEnter': function() {
					Globals.$html.addClass('ssm-state-tablet');
				},
				'onLeave': function() {
					Globals.$html.removeClass('ssm-state-tablet');
				}
			});

			ssm.addState({
				'id': 'desktop',
				'minWidth': 1000,
				'maxWidth': 1400,
				'onEnter': function() {
					Globals.$html.addClass('ssm-state-desktop');
				},
				'onLeave': function() {
					Globals.$html.removeClass('ssm-state-desktop');
				}
			});

			ssm.addState({
				'id': 'desktop-large',
				'minWidth': 1400,
				'onEnter': function() {
					Globals.$html.addClass('ssm-state-desktop-large');
				},
				'onLeave': function() {
					Globals.$html.removeClass('ssm-state-desktop-large');
				}
			});

			Events.sub('ssm.mobile-enter', function () {
				Globals.leftPanelDisabled(true);
			});

			Events.sub('ssm.mobile-leave', function () {
				Globals.leftPanelDisabled(false);
			});

			Globals.leftPanelDisabled.subscribe(function (bValue) {
				Globals.$html.toggleClass('rl-left-panel-disabled', bValue);
			});

			ssm.ready();

			__webpack_require__(/*! Stores/Language */ 31).populate();
			__webpack_require__(/*! Stores/Theme */ 39).populate();
			__webpack_require__(/*! Stores/Social */ 35).populate();
		};

		module.exports = AbstractApp;

	}());

/***/ },
/* 47 */
/*!**********************************!*\
  !*** ./dev/Common/HtmlEditor.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),

			Globals = __webpack_require__(/*! Common/Globals */ 8),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 * @param {Object} oElement
		 * @param {Function=} fOnBlur
		 * @param {Function=} fOnReady
		 * @param {Function=} fOnModeChange
		 */
		function HtmlEditor(oElement, fOnBlur, fOnReady, fOnModeChange)
		{
			this.editor = null;
			this.iBlurTimer = 0;
			this.fOnBlur = fOnBlur || null;
			this.fOnReady = fOnReady || null;
			this.fOnModeChange = fOnModeChange || null;

			this.$element = $(oElement);

			this.resize = _.throttle(_.bind(this.resize, this), 100);

			this.init();
		}

		HtmlEditor.prototype.blurTrigger = function ()
		{
			if (this.fOnBlur)
			{
				var self = this;
				window.clearTimeout(this.iBlurTimer);
				this.iBlurTimer = window.setTimeout(function () {
					self.fOnBlur();
				}, 200);
			}
		};

		HtmlEditor.prototype.focusTrigger = function ()
		{
			if (this.fOnBlur)
			{
				window.clearTimeout(this.iBlurTimer);
			}
		};

		/**
		 * @return {boolean}
		 */
		HtmlEditor.prototype.isHtml = function ()
		{
			return this.editor ? 'wysiwyg' === this.editor.mode : false;
		};

		/**
		 * @param {string} sSignature
		 */
		HtmlEditor.prototype.setSignature = function (sSignature)
		{
			if (this.editor)
			{
				this.editor.execCommand('insertSignature', {
					'signature': sSignature
				});
			}
		};

		/**
		 * @return {boolean}
		 */
		HtmlEditor.prototype.checkDirty = function ()
		{
			return this.editor ? this.editor.checkDirty() : false;
		};

		HtmlEditor.prototype.resetDirty = function ()
		{
			if (this.editor)
			{
				this.editor.resetDirty();
			}
		};

		/**
		 * @param {boolean=} bWrapIsHtml = false
		 * @return {string}
		 */
		HtmlEditor.prototype.getData = function (bWrapIsHtml)
		{
			if (this.editor)
			{
				if ('plain' === this.editor.mode && this.editor.plugins.plain && this.editor.__plain)
				{
					return this.editor.__plain.getRawData();
				}

				return bWrapIsHtml ?
					'<div data-html-editor-font-wrapper="true" style="font-family: arial, sans-serif; font-size: 13px;">' +
						this.editor.getData() + '</div>' : this.editor.getData();
			}

			return '';
		};

		HtmlEditor.prototype.modeToggle = function (bPlain)
		{
			if (this.editor)
			{
				if (bPlain)
				{
					if ('plain' === this.editor.mode)
					{
						this.editor.setMode('wysiwyg');
					}
				}
				else
				{
					if ('wysiwyg' === this.editor.mode)
					{
						this.editor.setMode('plain');
					}
				}

				this.resize();
			}
		};

		HtmlEditor.prototype.setHtml = function (sHtml, bFocus)
		{
			if (this.editor)
			{
				this.modeToggle(true);

				try {
					this.editor.setData(sHtml);
				} catch (e) {}

				if (bFocus)
				{
					this.focus();
				}
			}
		};

		HtmlEditor.prototype.setPlain = function (sPlain, bFocus)
		{
			if (this.editor)
			{
				this.modeToggle(false);
				if ('plain' === this.editor.mode && this.editor.plugins.plain && this.editor.__plain)
				{
					return this.editor.__plain.setRawData(sPlain);
				}
				else
				{
					try {
						this.editor.setData(sPlain);
					} catch (e) {}
				}

				if (bFocus)
				{
					this.focus();
				}
			}
		};

		HtmlEditor.prototype.init = function ()
		{
			if (this.$element && this.$element[0])
			{
				var
					self = this,
					fInit = function () {

						var
							oConfig = Globals.oHtmlEditorDefaultConfig,
							sLanguage = Settings.settingsGet('Language'),
							bSource = !!Settings.settingsGet('AllowHtmlEditorSourceButton'),
							bBiti = !!Settings.settingsGet('AllowHtmlEditorBitiButtons')
						;

						if ((bSource || !bBiti) && !oConfig.toolbarGroups.__cfgInited)
						{
							oConfig.toolbarGroups.__cfgInited = true;

							if (bSource)
							{
								oConfig.removeButtons = oConfig.removeButtons.replace(',Source', '');
							}

							if (!bBiti)
							{
								oConfig.removePlugins += (oConfig.removePlugins ? ',' : '')  + 'bidi';
							}
						}

						oConfig.enterMode = window.CKEDITOR.ENTER_BR;
						oConfig.shiftEnterMode = window.CKEDITOR.ENTER_BR;

						oConfig.language = Globals.oHtmlEditorLangsMap[sLanguage] || 'en';
						if (window.CKEDITOR.env)
						{
							window.CKEDITOR.env.isCompatible = true;
						}

						self.editor = window.CKEDITOR.appendTo(self.$element[0], oConfig);

						self.editor.on('key', function(oEvent) {
							if (oEvent && oEvent.data && 9 /* Tab */ === oEvent.data.keyCode)
							{
								return false;
							}
						});

						self.editor.on('blur', function() {
							self.blurTrigger();
						});

						self.editor.on('mode', function() {

							self.blurTrigger();

							if (self.fOnModeChange)
							{
								self.fOnModeChange('plain' !== self.editor.mode);
							}
						});

						self.editor.on('focus', function() {
							self.focusTrigger();
						});

						if (self.fOnReady)
						{
							self.editor.on('instanceReady', function () {

								if (self.editor.removeMenuItem)
								{
									self.editor.removeMenuItem('cut');
									self.editor.removeMenuItem('copy');
									self.editor.removeMenuItem('paste');
								}

								self.editor.setKeystroke(window.CKEDITOR.CTRL + 65 /* A */, 'selectAll');
								self.editor.editable().addClass('cke_enable_context_menu');

								self.fOnReady();
								self.__resizable = true;
								self.resize();
							});
						}
					}
				;

				if (window.CKEDITOR)
				{
					fInit();
				}
				else
				{
					window.__initEditor = fInit;
				}
			}
		};

		HtmlEditor.prototype.focus = function ()
		{
			if (this.editor)
			{
				try {
					this.editor.focus();
				} catch (e) {}
			}
		};

		HtmlEditor.prototype.blur = function ()
		{
			if (this.editor)
			{
				this.editor.focusManager.blur(true);
			}
		};

		HtmlEditor.prototype.resize = function ()
		{
			if (this.editor && this.__resizable)
			{
				try
				{
					this.editor.resize(this.$element.width(), this.$element.innerHeight());
				}
				catch (e) {}
			}
		};

		HtmlEditor.prototype.clear = function (bFocus)
		{
			this.setHtml('', bFocus);
		};


		module.exports = HtmlEditor;

	}());

/***/ },
/* 48 */
/*!****************************!*\
  !*** ./dev/Common/Mime.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	(function () {

		'use strict';

		module.exports = {

			'eml'	: 'message/rfc822',
			'mime'	: 'message/rfc822',
			'txt'	: 'text/plain',
			'text'	: 'text/plain',
			'def'	: 'text/plain',
			'list'	: 'text/plain',
			'in'	: 'text/plain',
			'ini'	: 'text/plain',
			'log'	: 'text/plain',
			'sql'	: 'text/plain',
			'cfg'	: 'text/plain',
			'conf'	: 'text/plain',
			'asc'	: 'text/plain',
			'rtx'	: 'text/richtext',
			'vcard'	: 'text/vcard',
			'vcf'	: 'text/vcard',
			'htm'	: 'text/html',
			'html'	: 'text/html',
			'csv'	: 'text/csv',
			'ics'	: 'text/calendar',
			'ifb'	: 'text/calendar',
			'xml'	: 'text/xml',
			'json'	: 'application/json',
			'swf'	: 'application/x-shockwave-flash',
			'hlp'	: 'application/winhlp',
			'wgt'	: 'application/widget',
			'chm'	: 'application/vnd.ms-htmlhelp',
			'p10'	: 'application/pkcs10',
			'p7c'	: 'application/pkcs7-mime',
			'p7m'	: 'application/pkcs7-mime',
			'p7s'	: 'application/pkcs7-signature',
			'torrent'	: 'application/x-bittorrent',

			// scripts
			'js'	: 'application/javascript',
			'pl'	: 'text/perl',
			'css'	: 'text/css',
			'asp'	: 'text/asp',
			'php'	: 'application/x-httpd-php',
			'php3'	: 'application/x-httpd-php',
			'php4'	: 'application/x-httpd-php',
			'php5'	: 'application/x-httpd-php',
			'phtml'	: 'application/x-httpd-php',

			// images
			'png'	: 'image/png',
			'jpg'	: 'image/jpeg',
			'jpeg'	: 'image/jpeg',
			'jpe'	: 'image/jpeg',
			'jfif'	: 'image/jpeg',
			'gif'	: 'image/gif',
			'bmp'	: 'image/bmp',
			'cgm'	: 'image/cgm',
			'ief'	: 'image/ief',
			'ico'	: 'image/x-icon',
			'tif'	: 'image/tiff',
			'tiff'	: 'image/tiff',
			'svg'	: 'image/svg+xml',
			'svgz'	: 'image/svg+xml',
			'djv'	: 'image/vnd.djvu',
			'djvu'	: 'image/vnd.djvu',
			'webp'	: 'image/webp',

			// archives
			'zip'	: 'application/zip',
			'7z'	: 'application/x-7z-compressed',
			'rar'	: 'application/x-rar-compressed',
			'exe'	: 'application/x-msdownload',
			'dll'	: 'application/x-msdownload',
			'scr'	: 'application/x-msdownload',
			'com'	: 'application/x-msdownload',
			'bat'	: 'application/x-msdownload',
			'msi'	: 'application/x-msdownload',
			'cab'	: 'application/vnd.ms-cab-compressed',
			'gz'	: 'application/x-gzip',
			'tgz'	: 'application/x-gzip',
			'bz'	: 'application/x-bzip',
			'bz2'	: 'application/x-bzip2',
			'deb'	: 'application/x-debian-package',

			// fonts
			'psf'	: 'application/x-font-linux-psf',
			'otf'	: 'application/x-font-otf',
			'pcf'	: 'application/x-font-pcf',
			'snf'	: 'application/x-font-snf',
			'ttf'	: 'application/x-font-ttf',
			'ttc'	: 'application/x-font-ttf',

			// audio
			'mp3'	: 'audio/mpeg',
			'amr'	: 'audio/amr',
			'aac'	: 'audio/x-aac',
			'aif'	: 'audio/x-aiff',
			'aifc'	: 'audio/x-aiff',
			'aiff'	: 'audio/x-aiff',
			'wav'	: 'audio/x-wav',
			'wma'	: 'audio/x-ms-wma',
			'wax'	: 'audio/x-ms-wax',
			'midi'	: 'audio/midi',
			'mp4a'	: 'audio/mp4',
			'ogg'	: 'audio/ogg',
			'weba'	: 'audio/webm',
			'ra'	: 'audio/x-pn-realaudio',
			'ram'	: 'audio/x-pn-realaudio',
			'rmp'	: 'audio/x-pn-realaudio-plugin',
			'm3u'	: 'audio/x-mpegurl',

			// video
			'flv'	: 'video/x-flv',
			'qt'	: 'video/quicktime',
			'mov'	: 'video/quicktime',
			'wmv'	: 'video/windows-media',
			'avi'	: 'video/x-msvideo',
			'mpg'	: 'video/mpeg',
			'mpeg'	: 'video/mpeg',
			'mpe'	: 'video/mpeg',
			'm1v'	: 'video/mpeg',
			'm2v'	: 'video/mpeg',
			'3gp'	: 'video/3gpp',
			'3g2'	: 'video/3gpp2',
			'h261'	: 'video/h261',
			'h263'	: 'video/h263',
			'h264'	: 'video/h264',
			'jpgv'	: 'video/jpgv',
			'mp4'	: 'video/mp4',
			'mp4v'	: 'video/mp4',
			'mpg4'	: 'video/mp4',
			'ogv'	: 'video/ogg',
			'webm'	: 'video/webm',
			'm4v'	: 'video/x-m4v',
			'asf'	: 'video/x-ms-asf',
			'asx'	: 'video/x-ms-asf',
			'wm'	: 'video/x-ms-wm',
			'wmx'	: 'video/x-ms-wmx',
			'wvx'	: 'video/x-ms-wvx',
			'movie'	: 'video/x-sgi-movie',

			// adobe
			'pdf'	: 'application/pdf',
			'psd'	: 'image/vnd.adobe.photoshop',
			'ai'	: 'application/postscript',
			'eps'	: 'application/postscript',
			'ps'	: 'application/postscript',

			// ms office
			'doc'	: 'application/msword',
			'dot'	: 'application/msword',
			'rtf'	: 'application/rtf',
			'xls'	: 'application/vnd.ms-excel',
			'ppt'	: 'application/vnd.ms-powerpoint',
			'docx'	: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'xlsx'	: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'dotx'	: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
			'pptx'	: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

			// open office
			'odt'	: 'application/vnd.oasis.opendocument.text',
			'ods'	: 'application/vnd.oasis.opendocument.spreadsheet'

		};

	}());


/***/ },
/* 49 */
/*!***************************************!*\
  !*** ./dev/Component/AbstracRadio.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractComponent = __webpack_require__(/*! Component/Abstract */ 29)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractComponent
		 */
		function AbstracRadio(oParams)
		{
			AbstractComponent.call(this);

			this.values = ko.observableArray([]);

			this.value = oParams.value;
			if (Utils.isUnd(this.value) || !this.value.subscribe)
			{
				this.value = ko.observable('');
			}

			this.inline = Utils.isUnd(oParams.inline) ? false : oParams.inline;
			this.readOnly = Utils.isUnd(oParams.readOnly) ? false : !!oParams.readOnly;

			if (oParams.values)
			{
				var aValues = _.map(oParams.values, function (sLabel, sValue) {
					return {
						'label': sLabel,
						'value': sValue
					};
				});

				this.values(aValues);
			}

			this.click = _.bind(this.click, this);
		}

		AbstracRadio.prototype.click = function(oValue) {
			if (!this.readOnly && oValue)
			{
				this.value(oValue.value);
			}
		};

		_.extend(AbstracRadio.prototype, AbstractComponent.prototype);

		AbstracRadio.componentExportHelper = AbstractComponent.componentExportHelper;

		module.exports = AbstracRadio;

	}());


/***/ },
/* 50 */
/*!***********************************!*\
  !*** ./dev/Component/Checkbox.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			AbstracCheckbox = __webpack_require__(/*! Component/AbstracCheckbox */ 38)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstracCheckbox
		 */
		function CheckboxComponent(oParams)
		{
			AbstracCheckbox.call(this, oParams);
		}

		_.extend(CheckboxComponent.prototype, AbstracCheckbox.prototype);

		module.exports = AbstracCheckbox.componentExportHelper(
			CheckboxComponent, 'CheckboxComponent');

	}());


/***/ },
/* 51 */
/*!********************************!*\
  !*** ./dev/Component/Input.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			AbstractInput = __webpack_require__(/*! Component/AbstractInput */ 33)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractInput
		 */
		function InputComponent(oParams)
		{
			AbstractInput.call(this, oParams);
		}

		_.extend(InputComponent.prototype, AbstractInput.prototype);

		module.exports = AbstractInput.componentExportHelper(
			InputComponent, 'InputComponent');

	}());


/***/ },
/* 52 */
/*!**************************************************!*\
  !*** ./dev/Component/MaterialDesign/Checkbox.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			AbstracCheckbox = __webpack_require__(/*! Component/AbstracCheckbox */ 38)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstracCheckbox
		 */
		function CheckboxMaterialDesignComponent(oParams)
		{
			AbstracCheckbox.call(this, oParams);

			this.animationBox = ko.observable(false).extend({'falseTimeout': 200});
			this.animationCheckmark = ko.observable(false).extend({'falseTimeout': 200});

			this.animationBoxSetTrue = _.bind(this.animationBoxSetTrue, this);
			this.animationCheckmarkSetTrue = _.bind(this.animationCheckmarkSetTrue, this);

			this.disposable.push(
				this.value.subscribe(function (bValue) {
					this.triggerAnimation(bValue);
				}, this)
			);
		}

		_.extend(CheckboxMaterialDesignComponent.prototype, AbstracCheckbox.prototype);

		CheckboxMaterialDesignComponent.prototype.animationBoxSetTrue = function()
		{
			this.animationBox(true);
		};

		CheckboxMaterialDesignComponent.prototype.animationCheckmarkSetTrue = function()
		{
			this.animationCheckmark(true);
		};

		CheckboxMaterialDesignComponent.prototype.triggerAnimation = function(bBox)
		{
			if (bBox)
			{
				this.animationBoxSetTrue();
				_.delay(this.animationCheckmarkSetTrue, 200);
			}
			else
			{
				this.animationCheckmarkSetTrue();
				_.delay(this.animationBoxSetTrue, 200);
			}
		};

		module.exports = AbstracCheckbox.componentExportHelper(
			CheckboxMaterialDesignComponent, 'CheckboxMaterialDesignComponent');

	}());


/***/ },
/* 53 */
/*!********************************!*\
  !*** ./dev/Component/Radio.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			AbstracRadio = __webpack_require__(/*! Component/AbstracRadio */ 49)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstracRadio
		 */
		function RadioComponent(oParams)
		{
			AbstracRadio.call(this, oParams);
		}

		_.extend(RadioComponent.prototype, AbstracRadio.prototype);

		module.exports = AbstracRadio.componentExportHelper(
			RadioComponent, 'RadioComponent');

	}());


/***/ },
/* 54 */
/*!**************************************!*\
  !*** ./dev/Component/SaveTrigger.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractComponent = __webpack_require__(/*! Component/Abstract */ 29)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractComponent
		 */
		function SaveTriggerComponent(oParams)
		{
			AbstractComponent.call(this);

			this.element = oParams.element || null;
			this.value = oParams.value && oParams.value.subscribe ? oParams.value : null;

			if (this.element)
			{
				if (this.value)
				{
					this.element.css('display', 'inline-block');

					if (oParams.verticalAlign)
					{
						this.element.css('vertical-align', oParams.verticalAlign);
					}

					this.setState(this.value());

					this.disposable.push(
						this.value.subscribe(this.setState, this)
					);
				}
				else
				{
					this.element.hide();
				}
			}
		}

		SaveTriggerComponent.prototype.setState = function (nValue)
		{
			switch (Utils.pInt(nValue))
			{
				case Enums.SaveSettingsStep.TrueResult:
					this.element
						.find('.animated,.error').hide().removeClass('visible')
						.end()
						.find('.success').show().addClass('visible')
					;
					break;
				case Enums.SaveSettingsStep.FalseResult:
					this.element
						.find('.animated,.success').hide().removeClass('visible')
						.end()
						.find('.error').show().addClass('visible')
					;
					break;
				case Enums.SaveSettingsStep.Animate:
					this.element
						.find('.error,.success').hide().removeClass('visible')
						.end()
						.find('.animated').show().addClass('visible')
					;
					break;
				default:
				case Enums.SaveSettingsStep.Idle:
					this.element
						.find('.animated').hide()
						.end()
						.find('.error,.success').removeClass('visible')
					;
					break;
			}
		};

		_.extend(SaveTriggerComponent.prototype, AbstractComponent.prototype);

		module.exports = AbstractComponent.componentExportHelper(
			SaveTriggerComponent, 'SaveTriggerComponent');

	}());


/***/ },
/* 55 */
/*!*********************************!*\
  !*** ./dev/Component/Select.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractInput = __webpack_require__(/*! Component/AbstractInput */ 33)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractInput
		 */
		function SelectComponent(oParams)
		{
			AbstractInput.call(this, oParams);

			this.options = oParams.options || '';

			this.optionsText = oParams.optionsText || null;
			this.optionsValue = oParams.optionsValue || null;

			this.defautOptionsAfterRender = Utils.defautOptionsAfterRender;
		}

		_.extend(SelectComponent.prototype, AbstractInput.prototype);

		module.exports = AbstractInput.componentExportHelper(
			SelectComponent, 'SelectComponent');

	}());


/***/ },
/* 56 */
/*!***********************************!*\
  !*** ./dev/Component/TextArea.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractInput = __webpack_require__(/*! Component/AbstractInput */ 33)
		;

		/**
		 * @constructor
		 *
		 * @param {Object} oParams
		 *
		 * @extends AbstractInput
		 */
		function TextAreaComponent(oParams)
		{
			AbstractInput.call(this, oParams);

			this.rows = oParams.rows || 5;
			this.spellcheck = Utils.isUnd(oParams.spellcheck) ? false : !!oParams.spellcheck;
		}

		_.extend(TextAreaComponent.prototype, AbstractInput.prototype);

		module.exports = AbstractInput.componentExportHelper(
			TextAreaComponent, 'TextAreaComponent');

	}());


/***/ },
/* 57 */
/*!***********************************!*\
  !*** ./dev/Knoin/AbstractBoot.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		/**
		 * @constructor
		 */
		function AbstractBoot()
		{

		}

		AbstractBoot.prototype.bootstart = function ()
		{

		};

		module.exports = AbstractBoot;

	}());

/***/ },
/* 58 */
/*!****************************************!*\
  !*** ./dev/Screen/AbstractSettings.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			ko = __webpack_require__(/*! ko */ 3),

			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 12),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractScreen = __webpack_require__(/*! Knoin/AbstractScreen */ 34)
		;

		/**
		 * @constructor
		 * @param {Array} aViewModels
		 * @extends AbstractScreen
		 */
		function AbstractSettingsScreen(aViewModels)
		{
			AbstractScreen.call(this, 'settings', aViewModels);

			this.menu = ko.observableArray([]);

			this.oCurrentSubScreen = null;
			this.oViewModelPlace = null;

			this.setupSettings();
		}

		_.extend(AbstractSettingsScreen.prototype, AbstractScreen.prototype);

		/**
		 * @param {Function=} fCallback
		 */
		AbstractSettingsScreen.prototype.setupSettings = function (fCallback)
		{
			if (fCallback)
			{
				fCallback();
			}
		};

		AbstractSettingsScreen.prototype.onRoute = function (sSubName)
		{
			var
				self = this,
				oSettingsScreen = null,
				RoutedSettingsViewModel = null,
				oViewModelPlace = null,
				oViewModelDom = null
			;

			RoutedSettingsViewModel = _.find(Globals.aViewModels['settings'], function (SettingsViewModel) {
				return SettingsViewModel && SettingsViewModel.__rlSettingsData &&
					sSubName === SettingsViewModel.__rlSettingsData.Route;
			});

			if (RoutedSettingsViewModel)
			{
				if (_.find(Globals.aViewModels['settings-removed'], function (DisabledSettingsViewModel) {
					return DisabledSettingsViewModel && DisabledSettingsViewModel === RoutedSettingsViewModel;
				}))
				{
					RoutedSettingsViewModel = null;
				}

				if (RoutedSettingsViewModel && _.find(Globals.aViewModels['settings-disabled'], function (DisabledSettingsViewModel) {
					return DisabledSettingsViewModel && DisabledSettingsViewModel === RoutedSettingsViewModel;
				}))
				{
					RoutedSettingsViewModel = null;
				}
			}

			if (RoutedSettingsViewModel)
			{
				if (RoutedSettingsViewModel.__builded && RoutedSettingsViewModel.__vm)
				{
					oSettingsScreen = RoutedSettingsViewModel.__vm;
				}
				else
				{
					oViewModelPlace = this.oViewModelPlace;
					if (oViewModelPlace && 1 === oViewModelPlace.length)
					{
						oSettingsScreen = new RoutedSettingsViewModel();

						oViewModelDom = $('<div></div>').addClass('rl-settings-view-model').hide();
						oViewModelDom.appendTo(oViewModelPlace);

						oSettingsScreen.viewModelDom = oViewModelDom;

						oSettingsScreen.__rlSettingsData = RoutedSettingsViewModel.__rlSettingsData;

						RoutedSettingsViewModel.__dom = oViewModelDom;
						RoutedSettingsViewModel.__builded = true;
						RoutedSettingsViewModel.__vm = oSettingsScreen;

						ko.applyBindingAccessorsToNode(oViewModelDom[0], {
							'i18nInit': true,
							'template': function () { return {'name': RoutedSettingsViewModel.__rlSettingsData.Template}; }
						}, oSettingsScreen);

						Utils.delegateRun(oSettingsScreen, 'onBuild', [oViewModelDom]);
					}
					else
					{
						Utils.log('Cannot find sub settings view model position: SettingsSubScreen');
					}
				}

				if (oSettingsScreen)
				{
					_.defer(function () {
						// hide
						if (self.oCurrentSubScreen)
						{
							Utils.delegateRun(self.oCurrentSubScreen, 'onHide');
							self.oCurrentSubScreen.viewModelDom.hide();
						}
						// --

						self.oCurrentSubScreen = oSettingsScreen;

						// show
						if (self.oCurrentSubScreen)
						{
							self.oCurrentSubScreen.viewModelDom.show();
							Utils.delegateRun(self.oCurrentSubScreen, 'onShow');
							Utils.delegateRun(self.oCurrentSubScreen, 'onFocus', [], 200);

							_.each(self.menu(), function (oItem) {
								oItem.selected(oSettingsScreen && oSettingsScreen.__rlSettingsData && oItem.route === oSettingsScreen.__rlSettingsData.Route);
							});

							$('#rl-content .b-settings .b-content .content').scrollTop(0);
						}
						// --

						Utils.windowResize();
					});
				}
			}
			else
			{
				kn.setHash(Links.settings(), false, true);
			}
		};

		AbstractSettingsScreen.prototype.onHide = function ()
		{
			if (this.oCurrentSubScreen && this.oCurrentSubScreen.viewModelDom)
			{
				Utils.delegateRun(this.oCurrentSubScreen, 'onHide');
				this.oCurrentSubScreen.viewModelDom.hide();
			}
		};

		AbstractSettingsScreen.prototype.onBuild = function ()
		{
			_.each(Globals.aViewModels['settings'], function (SettingsViewModel) {
				if (SettingsViewModel && SettingsViewModel.__rlSettingsData &&
					!_.find(Globals.aViewModels['settings-removed'], function (RemoveSettingsViewModel) {
						return RemoveSettingsViewModel && RemoveSettingsViewModel === SettingsViewModel;
					}))
				{
					this.menu.push({
						'route': SettingsViewModel.__rlSettingsData.Route,
						'label': SettingsViewModel.__rlSettingsData.Label,
						'selected': ko.observable(false),
						'disabled': !!_.find(Globals.aViewModels['settings-disabled'], function (DisabledSettingsViewModel) {
							return DisabledSettingsViewModel && DisabledSettingsViewModel === SettingsViewModel;
						})
					});
				}
			}, this);

			this.oViewModelPlace = $('#rl-content #rl-settings-subscreen');
		};

		AbstractSettingsScreen.prototype.routes = function ()
		{
			var
				DefaultViewModel = _.find(Globals.aViewModels['settings'], function (SettingsViewModel) {
					return SettingsViewModel && SettingsViewModel.__rlSettingsData && SettingsViewModel.__rlSettingsData['IsDefault'];
				}),
				sDefaultRoute = DefaultViewModel ? DefaultViewModel.__rlSettingsData['Route'] : 'general',
				oRules = {
					'subname': /^(.*)$/,
					'normalize_': function (oRequest, oVals) {
						oVals.subname = Utils.isUnd(oVals.subname) ? sDefaultRoute : Utils.pString(oVals.subname);
						return [oVals.subname];
					}
				}
			;

			return [
				['{subname}/', oRules],
				['{subname}', oRules],
				['', oRules]
			];
		};

		module.exports = AbstractSettingsScreen;

	}());

/***/ },
/* 59 */
/*!***************************************!*\
  !*** ./dev/Storage/AbstractRemote.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),

			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Plugins = __webpack_require__(/*! Common/Plugins */ 23),
			Links = __webpack_require__(/*! Common/Links */ 12),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		* @constructor
		*/
		function AbstractRemoteStorage()
		{
			this.oRequests = {};
		}

		AbstractRemoteStorage.prototype.oRequests = {};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sRequestAction
		 * @param {string} sType
		 * @param {?AjaxJsonDefaultResponse} oData
		 * @param {boolean} bCached
		 * @param {*=} oRequestParameters
		 */
		AbstractRemoteStorage.prototype.defaultResponse = function (fCallback, sRequestAction, sType, oData, bCached, oRequestParameters)
		{
			var
				fCall = function () {
					if (Enums.StorageResultType.Success !== sType && Globals.bUnload)
					{
						sType = Enums.StorageResultType.Unload;
					}

					if (Enums.StorageResultType.Success === sType && oData && !oData.Result)
					{
						if (oData && -1 < Utils.inArray(oData.ErrorCode, [
							Enums.Notification.AuthError, Enums.Notification.AccessError,
							Enums.Notification.ConnectionError, Enums.Notification.DomainNotAllowed, Enums.Notification.AccountNotAllowed,
							Enums.Notification.MailServerError,	Enums.Notification.UnknownNotification, Enums.Notification.UnknownError
						]))
						{
							Globals.iAjaxErrorCount++;
						}

						if (oData && Enums.Notification.InvalidToken === oData.ErrorCode)
						{
							Globals.iTokenErrorCount++;
						}

						if (Consts.Values.TokenErrorLimit < Globals.iTokenErrorCount)
						{
							if (Globals.__APP__)
							{
								 Globals.__APP__.loginAndLogoutReload(true);
							}
						}

						if (oData.ClearAuth || oData.Logout || Consts.Values.AjaxErrorLimit < Globals.iAjaxErrorCount)
						{
							if (Globals.__APP__)
							{
								Globals.__APP__.clearClientSideToken();

								if (!oData.ClearAuth)
								{
									 Globals.__APP__.loginAndLogoutReload(true);
								}
							}
						}
					}
					else if (Enums.StorageResultType.Success === sType && oData && oData.Result)
					{
						Globals.iAjaxErrorCount = 0;
						Globals.iTokenErrorCount = 0;
					}

					if (fCallback)
					{
						Plugins.runHook('ajax-default-response', [sRequestAction, Enums.StorageResultType.Success === sType ? oData : null, sType, bCached, oRequestParameters]);

						fCallback(
							sType,
							Enums.StorageResultType.Success === sType ? oData : null,
							bCached,
							sRequestAction,
							oRequestParameters
						);
					}
				}
			;

			switch (sType)
			{
				case 'success':
					sType = Enums.StorageResultType.Success;
					break;
				case 'abort':
					sType = Enums.StorageResultType.Abort;
					break;
				default:
					sType = Enums.StorageResultType.Error;
					break;
			}

			if (Enums.StorageResultType.Error === sType)
			{
				_.delay(fCall, 300);
			}
			else
			{
				fCall();
			}
		};

		/**
		 * @param {?Function} fResultCallback
		 * @param {Object} oParameters
		 * @param {?number=} iTimeOut = 20000
		 * @param {string=} sGetAdd = ''
		 * @param {Array=} aAbortActions = []
		 * @return {jQuery.jqXHR}
		 */
		AbstractRemoteStorage.prototype.ajaxRequest = function (fResultCallback, oParameters, iTimeOut, sGetAdd, aAbortActions)
		{
			var
				self = this,
				bPost = '' === sGetAdd,
				oHeaders = {},
				iStart = (new window.Date()).getTime(),
				oDefAjax = null,
				sAction = ''
			;

			oParameters = oParameters || {};
			iTimeOut = Utils.isNormal(iTimeOut) ? iTimeOut : 20000;
			sGetAdd = Utils.isUnd(sGetAdd) ? '' : Utils.pString(sGetAdd);
			aAbortActions = Utils.isArray(aAbortActions) ? aAbortActions : [];

			sAction = oParameters.Action || '';

			if (sAction && 0 < aAbortActions.length)
			{
				_.each(aAbortActions, function (sActionToAbort) {
					if (self.oRequests[sActionToAbort])
					{
						self.oRequests[sActionToAbort].__aborted = true;
						if (self.oRequests[sActionToAbort].abort)
						{
							self.oRequests[sActionToAbort].abort();
						}
						self.oRequests[sActionToAbort] = null;
					}
				});
			}

			if (bPost)
			{
				oParameters['XToken'] = Settings.settingsGet('Token');
			}

			oDefAjax = $.ajax({
				'type': bPost ? 'POST' : 'GET',
				'url': Links.ajax(sGetAdd),
				'async': true,
				'dataType': 'json',
				'data': bPost ? oParameters : {},
				'headers': oHeaders,
				'timeout': iTimeOut,
				'global': true
			});

			oDefAjax.always(function (oData, sType) {

				var bCached = false;
				if (oData && oData['Time'])
				{
					bCached = Utils.pInt(oData['Time']) > (new window.Date()).getTime() - iStart;
				}

				if (sAction && self.oRequests[sAction])
				{
					if (self.oRequests[sAction].__aborted)
					{
						sType = 'abort';
					}

					self.oRequests[sAction] = null;
				}

				self.defaultResponse(fResultCallback, sAction, sType, oData, bCached, oParameters);
			});

			if (sAction && 0 < aAbortActions.length && -1 < Utils.inArray(sAction, aAbortActions))
			{
				if (this.oRequests[sAction])
				{
					this.oRequests[sAction].__aborted = true;
					if (this.oRequests[sAction].abort)
					{
						this.oRequests[sAction].abort();
					}
					this.oRequests[sAction] = null;
				}

				this.oRequests[sAction] = oDefAjax;
			}

			return oDefAjax;
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sAction
		 * @param {Object=} oParameters
		 * @param {?number=} iTimeout
		 * @param {string=} sGetAdd = ''
		 * @param {Array=} aAbortActions = []
		 */
		AbstractRemoteStorage.prototype.defaultRequest = function (fCallback, sAction, oParameters, iTimeout, sGetAdd, aAbortActions)
		{
			oParameters = oParameters || {};
			oParameters.Action = sAction;

			sGetAdd = Utils.pString(sGetAdd);

			Plugins.runHook('ajax-default-request', [sAction, oParameters, sGetAdd]);

			return this.ajaxRequest(fCallback, oParameters,
				Utils.isUnd(iTimeout) ? Consts.Defaults.DefaultAjaxTimeout : Utils.pInt(iTimeout), sGetAdd, aAbortActions);
		};

		/**
		 * @param {?Function} fCallback
		 */
		AbstractRemoteStorage.prototype.noop = function (fCallback)
		{
			this.defaultRequest(fCallback, 'Noop');
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sMessage
		 * @param {string} sFileName
		 * @param {number} iLineNo
		 * @param {string} sLocation
		 * @param {string} sHtmlCapa
		 * @param {number} iTime
		 */
		AbstractRemoteStorage.prototype.jsError = function (fCallback, sMessage, sFileName, iLineNo, sLocation, sHtmlCapa, iTime)
		{
			this.defaultRequest(fCallback, 'JsError', {
				'Message': sMessage,
				'FileName': sFileName,
				'LineNo': iLineNo,
				'Location': sLocation,
				'HtmlCapa': sHtmlCapa,
				'TimeOnPage': iTime
			});
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sType
		 * @param {Array=} mData = null
		 * @param {boolean=} bIsError = false
		 */
		AbstractRemoteStorage.prototype.jsInfo = function (fCallback, sType, mData, bIsError)
		{
			this.defaultRequest(fCallback, 'JsInfo', {
				'Type': sType,
				'Data': mData,
				'IsError': (Utils.isUnd(bIsError) ? false : !!bIsError) ? '1' : '0'
			});
		};

		/**
		 * @param {?Function} fCallback
		 */
		AbstractRemoteStorage.prototype.getPublicKey = function (fCallback)
		{
			this.defaultRequest(fCallback, 'GetPublicKey');
		};

		/**
		 * @param {?Function} fCallback
		 * @param {string} sVersion
		 */
		AbstractRemoteStorage.prototype.jsVersion = function (fCallback, sVersion)
		{
			this.defaultRequest(fCallback, 'Version', {
				'Version': sVersion
			});
		};

		module.exports = AbstractRemoteStorage;

	}());

/***/ },
/* 60 */
/*!*******************************!*\
  !*** ./dev/Storage/Client.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		/**
		 * @constructor
		 */
		function ClientStorage()
		{
			var
				NextStorageDriver = __webpack_require__(/*! _ */ 2).find([
					__webpack_require__(/*! Common/ClientStorageDriver/LocalStorage */ 94),
					__webpack_require__(/*! Common/ClientStorageDriver/Cookie */ 93)
				], function (NextStorageDriver) {
					return NextStorageDriver && NextStorageDriver.supported();
				})
			;

			this.oDriver = null;

			if (NextStorageDriver)
			{
				this.oDriver = new NextStorageDriver();
			}
		}

		/**
		 * @type {LocalStorageDriver|CookieDriver|null}
		 */
		ClientStorage.prototype.oDriver = null;

		/**
		 * @param {number} iKey
		 * @param {*} mData
		 * @return {boolean}
		 */
		ClientStorage.prototype.set = function (iKey, mData)
		{
			return this.oDriver ? this.oDriver.set('p' + iKey, mData) : false;
		};

		/**
		 * @param {number} iKey
		 * @return {*}
		 */
		ClientStorage.prototype.get = function (iKey)
		{
			return this.oDriver ? this.oDriver.get('p' + iKey) : null;
		};

		module.exports = new ClientStorage();

	}());

/***/ },
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */
/*!***************************!*\
  !*** ./dev/Stores/App.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Globals = __webpack_require__(/*! Common/Globals */ 8),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function AppStore()
		{
			this.allowLanguagesOnSettings = ko.observable(true);
			this.allowLanguagesOnLogin = ko.observable(true);

			this.interfaceAnimation = ko.observable(true);

			this.interfaceAnimation.subscribe(function (bValue) {
				var bAnim = Globals.bMobileDevice || !bValue;
				Globals.$html.toggleClass('rl-anim', !bAnim).toggleClass('no-rl-anim', bAnim);
			});

			this.interfaceAnimation.valueHasMutated();

			this.prem = ko.observable(false);
		}

		AppStore.prototype.populate = function()
		{
			this.allowLanguagesOnLogin(!!Settings.settingsGet('AllowLanguagesOnLogin'));
			this.allowLanguagesOnSettings(!!Settings.settingsGet('AllowLanguagesOnSettings'));

			this.interfaceAnimation(!!Settings.settingsGet('InterfaceAnimation'));

			this.prem(!!Settings.settingsGet('PremType'));
		};

		module.exports = AppStore;

	}());


/***/ },
/* 66 */
/*!*****************************************!*\
  !*** ./dev/Stores/User/Notification.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			ko = __webpack_require__(/*! ko */ 3),
			buzz = __webpack_require__(/*! buzz */ 155),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Links = __webpack_require__(/*! Common/Links */ 12),

			Settings = __webpack_require__(/*! Storage/Settings */ 9)
		;

		/**
		 * @constructor
		 */
		function NotificationUserStore()
		{
			var self = this;

			this.buzz = null;

			this.enableSoundNotification = ko.observable(true);
			this.soundNotificationIsSupported = ko.observable(false);

			this.allowDesktopNotification = ko.observable(false);

			this.desktopNotificationPermisions = ko.computed(function () {

				this.allowDesktopNotification();

				var
					NotificationClass = this.notificationClass(),
					iResult = Enums.DesktopNotification.NotSupported
				;

				if (NotificationClass && NotificationClass.permission)
				{
					switch (NotificationClass.permission.toLowerCase())
					{
						case 'granted':
							iResult = Enums.DesktopNotification.Allowed;
							break;
						case 'denied':
							iResult = Enums.DesktopNotification.Denied;
							break;
						case 'default':
							iResult = Enums.DesktopNotification.NotAllowed;
							break;
					}
				}
				else if (window.webkitNotifications && window.webkitNotifications.checkPermission)
				{
					iResult = window.webkitNotifications.checkPermission();
				}

				return iResult;

			}, this).extend({'notify': 'always'});

			this.enableDesktopNotification = ko.computed({
				'owner': this,
				'read': function () {
					return this.allowDesktopNotification() &&
						Enums.DesktopNotification.Allowed === this.desktopNotificationPermisions();
				},
				'write': function (bValue) {
					if (bValue)
					{
						var
							NotificationClass = this.notificationClass(),
							iPermission = this.desktopNotificationPermisions()
						;

						if (NotificationClass && Enums.DesktopNotification.Allowed === iPermission)
						{
							this.allowDesktopNotification(true);
						}
						else if (NotificationClass && Enums.DesktopNotification.NotAllowed === iPermission)
						{
							NotificationClass.requestPermission(function () {
								self.allowDesktopNotification.valueHasMutated();
								if (Enums.DesktopNotification.Allowed === self.desktopNotificationPermisions())
								{
									if (self.allowDesktopNotification())
									{
										self.allowDesktopNotification.valueHasMutated();
									}
									else
									{
										self.allowDesktopNotification(true);
									}
								}
								else
								{
									if (self.allowDesktopNotification())
									{
										self.allowDesktopNotification(false);
									}
									else
									{
										self.allowDesktopNotification.valueHasMutated();
									}
								}
							});
						}
						else
						{
							this.allowDesktopNotification(false);
						}
					}
					else
					{
						this.allowDesktopNotification(false);
					}
				}
			}).extend({'notify': 'always'});

			if (!this.enableDesktopNotification.valueHasMutated)
			{
				this.enableDesktopNotification.valueHasMutated = function () {
					self.allowDesktopNotification.valueHasMutated();
				};
			}

			this.computedProperies();

			this.initNotificationPlayer();
		}

		NotificationUserStore.prototype.computedProperies = function ()
		{
			this.isDesktopNotificationSupported = ko.computed(function () {
				return Enums.DesktopNotification.NotSupported !== this.desktopNotificationPermisions();
			}, this);

			this.isDesktopNotificationDenied = ko.computed(function () {
				return Enums.DesktopNotification.NotSupported === this.desktopNotificationPermisions() ||
					Enums.DesktopNotification.Denied === this.desktopNotificationPermisions();
			}, this);
		};

		NotificationUserStore.prototype.initNotificationPlayer = function ()
		{
			if (buzz && buzz.isSupported() && (buzz.isOGGSupported() || buzz.isMP3Supported()))
			{
				this.soundNotificationIsSupported(true);

				this.buzz = new buzz.sound(Links.sound('new-mail'), {
					'preload': 'none',
					'formats': ['mp3', 'ogg']
				});
			}
			else
			{
				this.enableSoundNotification(false);
				this.soundNotificationIsSupported(false);
			}
		};

		NotificationUserStore.prototype.playSoundNotification = function (bSkipSetting)
		{
			if (this.buzz && (bSkipSetting ? true : this.enableSoundNotification()))
			{
				this.buzz.play();
			}
		};

		NotificationUserStore.prototype.displayDesktopNotification = function (sImageSrc, sTitle, sText)
		{
			if (this.enableDesktopNotification())
			{
				var
					NotificationClass = this.notificationClass(),
					oNotification = NotificationClass ? new NotificationClass(sTitle, {
						'body': sText,
						'icon': sImageSrc
					}) : null
				;

				if (oNotification)
				{
					if (oNotification.show)
					{
						oNotification.show();
					}

					window.setTimeout((function (oLocalNotifications) {
						return function () {
							if (oLocalNotifications.cancel)
							{
								oLocalNotifications.cancel();
							}
							else if (oLocalNotifications.close)
							{
								oLocalNotifications.close();
							}
						};
					}(oNotification)), 7000);
				}
			}
		};

		NotificationUserStore.prototype.populate = function ()
		{
			this.enableSoundNotification(!!Settings.settingsGet('SoundNotification'));
			this.enableDesktopNotification(!!Settings.settingsGet('DesktopNotifications'));
		};

		/**
		 * @return {*|null}
		 */
		NotificationUserStore.prototype.notificationClass = function ()
		{
			return window.Notification && window.Notification.requestPermission ? window.Notification : null;
		};

		module.exports = new NotificationUserStore();

	}());


/***/ },
/* 67 */
/*!**************************************!*\
  !*** ./dev/View/Popup/AddAccount.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function AddAccountPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsAddAccount');

			this.isNew = ko.observable(true);

			this.email = ko.observable('');
			this.password = ko.observable('');

			this.emailError = ko.observable(false);
			this.passwordError = ko.observable(false);

			this.email.subscribe(function () {
				this.emailError(false);
			}, this);

			this.password.subscribe(function () {
				this.passwordError(false);
			}, this);

			this.submitRequest = ko.observable(false);
			this.submitError = ko.observable('');

			this.emailFocus = ko.observable(false);

			this.addAccountCommand = Utils.createCommand(this, function () {

				this.emailError('' === Utils.trim(this.email()));
				this.passwordError('' === Utils.trim(this.password()));

				if (this.emailError() || this.passwordError())
				{
					return false;
				}

				this.submitRequest(true);

				Remote.accountSetup(_.bind(function (sResult, oData) {

					this.submitRequest(false);
					if (Enums.StorageResultType.Success === sResult && oData && 'AccountSetup' === oData.Action)
					{
						if (oData.Result)
						{
							__webpack_require__(/*! App/User */ 6).accountsAndIdentities();
							this.cancelCommand();
						}
						else if (oData.ErrorCode)
						{
							this.submitError(Translator.getNotification(oData.ErrorCode));
						}
					}
					else
					{
						this.submitError(Translator.getNotification(Enums.Notification.UnknownError));
					}

				}, this), this.email(), this.password(), this.isNew());

				return true;

			}, function () {
				return !this.submitRequest();
			});

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/AddAccount', 'PopupsAddAccountViewModel'], AddAccountPopupView);
		_.extend(AddAccountPopupView.prototype, AbstractView.prototype);

		AddAccountPopupView.prototype.clearPopup = function ()
		{
			this.isNew(true);

			this.email('');
			this.password('');

			this.emailError(false);
			this.passwordError(false);

			this.submitRequest(false);
			this.submitError('');
		};

		AddAccountPopupView.prototype.onShow = function (oAccount)
		{
			this.clearPopup();
			if (oAccount && oAccount.canBeEdit())
			{
				this.isNew(false);
				this.email(oAccount.email);
			}
		};

		AddAccountPopupView.prototype.onFocus = function ()
		{
			this.emailFocus(true);
		};

		module.exports = AddAccountPopupView;

	}());

/***/ },
/* 68 */
/*!************************************!*\
  !*** ./dev/View/Popup/Contacts.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			ko = __webpack_require__(/*! ko */ 3),
			key = __webpack_require__(/*! key */ 21),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Selector = __webpack_require__(/*! Common/Selector */ 78),
			Links = __webpack_require__(/*! Common/Links */ 12),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			SettingsStore = __webpack_require__(/*! Stores/User/Settings */ 26),

			Data = __webpack_require__(/*! Storage/User/Data */ 15),
			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),

			EmailModel = __webpack_require__(/*! Model/Email */ 25),
			ContactModel = __webpack_require__(/*! Model/Contact */ 97),
			ContactPropertyModel = __webpack_require__(/*! Model/ContactProperty */ 98),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function ContactsPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsContacts');

			var
				self = this,
				fFastClearEmptyListHelper = function (aList) {
					if (aList && 0 < aList.length) {
						self.viewProperties.removeAll(aList);
						Utils.delegateRunOnDestroy(aList);
					}
				}
			;

			this.bBackToCompose = false;

			this.allowContactsSync = Data.allowContactsSync;
			this.enableContactsSync = Data.enableContactsSync;
			this.allowExport = !Globals.bMobileDevice;

			this.search = ko.observable('');
			this.contactsCount = ko.observable(0);
			this.contacts = Data.contacts;

			this.currentContact = ko.observable(null);

			this.importUploaderButton = ko.observable(null);

			this.contactsPage = ko.observable(1);
			this.contactsPageCount = ko.computed(function () {
				var iPage = window.Math.ceil(this.contactsCount() / Consts.Defaults.ContactsPerPage);
				return 0 >= iPage ? 1 : iPage;
			}, this);

			this.contactsPagenator = ko.computed(Utils.computedPagenatorHelper(this.contactsPage, this.contactsPageCount));

			this.emptySelection = ko.observable(true);
			this.viewClearSearch = ko.observable(false);

			this.viewID = ko.observable('');
			this.viewReadOnly = ko.observable(false);
			this.viewProperties = ko.observableArray([]);

			this.viewSaveTrigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.viewPropertiesNames = this.viewProperties.filter(function(oProperty) {
				return -1 < Utils.inArray(oProperty.type(), [
					Enums.ContactPropertyType.FirstName, Enums.ContactPropertyType.LastName
				]);
			});

			this.viewPropertiesOther = this.viewProperties.filter(function(oProperty) {
				return -1 < Utils.inArray(oProperty.type(), [
					Enums.ContactPropertyType.Note
				]);
			});

			this.viewPropertiesOther = ko.computed(function () {

				var aList = _.filter(this.viewProperties(), function (oProperty) {
					return -1 < Utils.inArray(oProperty.type(), [
						Enums.ContactPropertyType.Nick
					]);
				});

				return _.sortBy(aList, function (oProperty) {
					return oProperty.type();
				});

			}, this);

			this.viewPropertiesEmails = this.viewProperties.filter(function(oProperty) {
				return Enums.ContactPropertyType.Email === oProperty.type();
			});

			this.viewPropertiesWeb = this.viewProperties.filter(function(oProperty) {
				return Enums.ContactPropertyType.Web === oProperty.type();
			});

			this.viewHasNonEmptyRequaredProperties = ko.computed(function() {

				var
					aNames = this.viewPropertiesNames(),
					aEmail = this.viewPropertiesEmails(),
					fHelper = function (oProperty) {
						return '' !== Utils.trim(oProperty.value());
					}
				;

				return !!(_.find(aNames, fHelper) || _.find(aEmail, fHelper));
			}, this);

			this.viewPropertiesPhones = this.viewProperties.filter(function(oProperty) {
				return Enums.ContactPropertyType.Phone === oProperty.type();
			});

			this.viewPropertiesEmailsNonEmpty = this.viewPropertiesNames.filter(function(oProperty) {
				return '' !== Utils.trim(oProperty.value());
			});

			this.viewPropertiesEmailsEmptyAndOnFocused = this.viewPropertiesEmails.filter(function(oProperty) {
				var bF = oProperty.focused();
				return '' === Utils.trim(oProperty.value()) && !bF;
			});

			this.viewPropertiesPhonesEmptyAndOnFocused = this.viewPropertiesPhones.filter(function(oProperty) {
				var bF = oProperty.focused();
				return '' === Utils.trim(oProperty.value()) && !bF;
			});

			this.viewPropertiesWebEmptyAndOnFocused = this.viewPropertiesWeb.filter(function(oProperty) {
				var bF = oProperty.focused();
				return '' === Utils.trim(oProperty.value()) && !bF;
			});

			this.viewPropertiesOtherEmptyAndOnFocused = ko.computed(function () {
				return _.filter(this.viewPropertiesOther(), function (oProperty) {
					var bF = oProperty.focused();
					return '' === Utils.trim(oProperty.value()) && !bF;
				});
			}, this);

			this.viewPropertiesEmailsEmptyAndOnFocused.subscribe(function(aList) {
				fFastClearEmptyListHelper(aList);
			});

			this.viewPropertiesPhonesEmptyAndOnFocused.subscribe(function(aList) {
				fFastClearEmptyListHelper(aList);
			});

			this.viewPropertiesWebEmptyAndOnFocused.subscribe(function(aList) {
				fFastClearEmptyListHelper(aList);
			});

			this.viewPropertiesOtherEmptyAndOnFocused.subscribe(function(aList) {
				fFastClearEmptyListHelper(aList);
			});

			this.viewSaving = ko.observable(false);

			this.useCheckboxesInList = SettingsStore.useCheckboxesInList;

			this.search.subscribe(function () {
				this.reloadContactList();
			}, this);

			this.contacts.subscribe(Utils.windowResizeCallback);
			this.viewProperties.subscribe(Utils.windowResizeCallback);

			this.contactsChecked = ko.computed(function () {
				return _.filter(this.contacts(), function (oItem) {
					return oItem.checked();
				});
			}, this);

			this.contactsCheckedOrSelected = ko.computed(function () {

				var
					aChecked = this.contactsChecked(),
					oSelected = this.currentContact()
				;

				return _.union(aChecked, oSelected ? [oSelected] : []);

			}, this);

			this.contactsCheckedOrSelectedUids = ko.computed(function () {
				return _.map(this.contactsCheckedOrSelected(), function (oContact) {
					return oContact.idContact;
				});
			}, this);

			this.selector = new Selector(this.contacts, this.currentContact,
				'.e-contact-item .actionHandle', '.e-contact-item.selected', '.e-contact-item .checkboxItem',
					'.e-contact-item.focused');

			this.selector.on('onItemSelect', _.bind(function (oContact) {
				this.populateViewContact(oContact ? oContact : null);
				if (!oContact)
				{
					this.emptySelection(true);
				}
			}, this));

			this.selector.on('onItemGetUid', function (oContact) {
				return oContact ? oContact.generateUid() : '';
			});

			this.newCommand = Utils.createCommand(this, function () {
				this.populateViewContact(null);
				this.currentContact(null);
			});

			this.deleteCommand = Utils.createCommand(this, function () {
				this.deleteSelectedContacts();
				this.emptySelection(true);
			}, function () {
				return 0 < this.contactsCheckedOrSelected().length;
			});

			this.newMessageCommand = Utils.createCommand(this, function () {
				var aC = this.contactsCheckedOrSelected(), aE = [];
				if (Utils.isNonEmptyArray(aC))
				{
					aE = _.map(aC, function (oItem) {
						if (oItem)
						{
							var
								aData = oItem.getNameAndEmailHelper(),
								oEmail = aData ? new EmailModel(aData[0], aData[1]) : null
							;

							if (oEmail && oEmail.validate())
							{
								return oEmail;
							}
						}

						return null;
					});

					aE = _.compact(aE);
				}

				if (Utils.isNonEmptyArray(aE))
				{
					self.bBackToCompose = false;

					kn.hideScreenPopup(__webpack_require__(/*! View/Popup/Contacts */ 68));

					_.delay(function () {
						kn.showScreenPopup(__webpack_require__(/*! View/Popup/Compose */ 27), [Enums.ComposeType.Empty, null, aE]);
					}, 200);
				}

			}, function () {
				return 0 < this.contactsCheckedOrSelected().length;
			});

			this.clearCommand = Utils.createCommand(this, function () {
				this.search('');
			});

			this.saveCommand = Utils.createCommand(this, function () {

				this.viewSaving(true);
				this.viewSaveTrigger(Enums.SaveSettingsStep.Animate);

				var
					sRequestUid = Utils.fakeMd5(),
					aProperties = []
				;

				_.each(this.viewProperties(), function (oItem) {
					if (oItem.type() && '' !== Utils.trim(oItem.value()))
					{
						aProperties.push([oItem.type(), oItem.value(), oItem.typeStr()]);
					}
				});

				Remote.contactSave(function (sResult, oData) {

					var bRes = false;
					self.viewSaving(false);

					if (Enums.StorageResultType.Success === sResult && oData && oData.Result &&
						oData.Result.RequestUid === sRequestUid && 0 < Utils.pInt(oData.Result.ResultID))
					{
						if ('' === self.viewID())
						{
							self.viewID(Utils.pInt(oData.Result.ResultID));
						}

						self.reloadContactList();
						bRes = true;
					}

					_.delay(function () {
						self.viewSaveTrigger(bRes ? Enums.SaveSettingsStep.TrueResult : Enums.SaveSettingsStep.FalseResult);
					}, 300);

					if (bRes)
					{
						self.watchDirty(false);

						_.delay(function () {
							self.viewSaveTrigger(Enums.SaveSettingsStep.Idle);
						}, 1000);
					}

				}, sRequestUid, this.viewID(), aProperties);

			}, function () {
				var
					bV = this.viewHasNonEmptyRequaredProperties(),
					bReadOnly = this.viewReadOnly()
				;
				return !this.viewSaving() && bV && !bReadOnly;
			});

			this.syncCommand = Utils.createCommand(this, function () {

				var self = this;
				__webpack_require__(/*! App/User */ 6).contactsSync(function (sResult, oData) {
					if (Enums.StorageResultType.Success !== sResult || !oData || !oData.Result)
					{
						window.alert(Translator.getNotification(
							oData && oData.ErrorCode ? oData.ErrorCode : Enums.Notification.ContactsSyncError));
					}

					self.reloadContactList(true);
				});

			}, function () {
				return !this.contacts.syncing() && !this.contacts.importing();
			});

			this.bDropPageAfterDelete = false;

			this.watchDirty = ko.observable(false);
			this.watchHash = ko.observable(false);

			this.viewHash = ko.computed(function () {
				return '' + _.map(self.viewProperties(), function (oItem) {
					return oItem.value();
				}).join('');
			});

		//	this.saveCommandDebounce = _.debounce(_.bind(this.saveCommand, this), 1000);

			this.viewHash.subscribe(function () {
				if (this.watchHash() && !this.viewReadOnly() && !this.watchDirty())
				{
					this.watchDirty(true);
				}
			}, this);

			this.sDefaultKeyScope = Enums.KeyState.ContactList;

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/Contacts', 'PopupsContactsViewModel'], ContactsPopupView);
		_.extend(ContactsPopupView.prototype, AbstractView.prototype);

		ContactsPopupView.prototype.getPropertyPlceholder = function (sType)
		{
			var sResult = '';
			switch (sType)
			{
				case Enums.ContactPropertyType.LastName:
					sResult = 'CONTACTS/PLACEHOLDER_ENTER_LAST_NAME';
					break;
				case Enums.ContactPropertyType.FirstName:
					sResult = 'CONTACTS/PLACEHOLDER_ENTER_FIRST_NAME';
					break;
				case Enums.ContactPropertyType.Nick:
					sResult = 'CONTACTS/PLACEHOLDER_ENTER_NICK_NAME';
					break;
			}

			return sResult;
		};

		ContactsPopupView.prototype.addNewProperty = function (sType, sTypeStr)
		{
			this.viewProperties.push(new ContactPropertyModel(sType, sTypeStr || '', '', true, this.getPropertyPlceholder(sType)));
		};

		ContactsPopupView.prototype.addNewOrFocusProperty = function (sType, sTypeStr)
		{
			var oItem = _.find(this.viewProperties(), function (oItem) {
				return sType === oItem.type();
			});

			if (oItem)
			{
				oItem.focused(true);
			}
			else
			{
				this.addNewProperty(sType, sTypeStr);
			}
		};

		ContactsPopupView.prototype.addNewEmail = function ()
		{
			this.addNewProperty(Enums.ContactPropertyType.Email, 'Home');
		};

		ContactsPopupView.prototype.addNewPhone = function ()
		{
			this.addNewProperty(Enums.ContactPropertyType.Phone, 'Mobile');
		};

		ContactsPopupView.prototype.addNewWeb = function ()
		{
			this.addNewProperty(Enums.ContactPropertyType.Web);
		};

		ContactsPopupView.prototype.addNewNickname = function ()
		{
			this.addNewOrFocusProperty(Enums.ContactPropertyType.Nick);
		};

		ContactsPopupView.prototype.addNewNotes = function ()
		{
			this.addNewOrFocusProperty(Enums.ContactPropertyType.Note);
		};

		ContactsPopupView.prototype.addNewBirthday = function ()
		{
			this.addNewOrFocusProperty(Enums.ContactPropertyType.Birthday);
		};

		ContactsPopupView.prototype.exportVcf = function ()
		{
			__webpack_require__(/*! App/User */ 6).download(Links.exportContactsVcf());
		};

		ContactsPopupView.prototype.exportCsv = function ()
		{
			__webpack_require__(/*! App/User */ 6).download(Links.exportContactsCsv());
		};

		ContactsPopupView.prototype.initUploader = function ()
		{
			if (this.importUploaderButton())
			{
				var
					oJua = new Jua({
						'action': Links.uploadContacts(),
						'name': 'uploader',
						'queueSize': 1,
						'multipleSizeLimit': 1,
						'disableFolderDragAndDrop': true,
						'disableDragAndDrop': true,
						'disableMultiple': true,
						'disableDocumentDropPrevent': true,
						'clickElement': this.importUploaderButton()
					})
				;

				if (oJua)
				{
					oJua
						.on('onStart', _.bind(function () {
							this.contacts.importing(true);
						}, this))
						.on('onComplete', _.bind(function (sId, bResult, oData) {

							this.contacts.importing(false);
							this.reloadContactList();

							if (!sId || !bResult || !oData || !oData.Result)
							{
								window.alert(Translator.i18n('CONTACTS/ERROR_IMPORT_FILE'));
							}

						}, this))
					;
				}
			}
		};

		ContactsPopupView.prototype.removeCheckedOrSelectedContactsFromList = function ()
		{
			var
				self = this,
				oKoContacts = this.contacts,
				oCurrentContact = this.currentContact(),
				iCount = this.contacts().length,
				aContacts = this.contactsCheckedOrSelected()
			;

			if (0 < aContacts.length)
			{
				_.each(aContacts, function (oContact) {

					if (oCurrentContact && oCurrentContact.idContact === oContact.idContact)
					{
						oCurrentContact = null;
						self.currentContact(null);
					}

					oContact.deleted(true);
					iCount--;
				});

				if (iCount <= 0)
				{
					this.bDropPageAfterDelete = true;
				}

				_.delay(function () {

					_.each(aContacts, function (oContact) {
						oKoContacts.remove(oContact);
						Utils.delegateRunOnDestroy(oContact);
					});

				}, 500);
			}
		};

		ContactsPopupView.prototype.deleteSelectedContacts = function ()
		{
			if (0 < this.contactsCheckedOrSelected().length)
			{
				Remote.contactsDelete(
					_.bind(this.deleteResponse, this),
					this.contactsCheckedOrSelectedUids()
				);

				this.removeCheckedOrSelectedContactsFromList();
			}
		};

		/**
		 * @param {string} sResult
		 * @param {AjaxJsonDefaultResponse} oData
		 */
		ContactsPopupView.prototype.deleteResponse = function (sResult, oData)
		{
			if (500 < (Enums.StorageResultType.Success === sResult && oData && oData.Time ? Utils.pInt(oData.Time) : 0))
			{
				this.reloadContactList(this.bDropPageAfterDelete);
			}
			else
			{
				_.delay((function (self) {
					return function () {
						self.reloadContactList(self.bDropPageAfterDelete);
					};
				}(this)), 500);
			}
		};

		ContactsPopupView.prototype.removeProperty = function (oProp)
		{
			this.viewProperties.remove(oProp);
			Utils.delegateRunOnDestroy(oProp);
		};

		/**
		 * @param {?ContactModel} oContact
		 */
		ContactsPopupView.prototype.populateViewContact = function (oContact)
		{
			var
				sId = '',
				sLastName = '',
				sFirstName = '',
				aList = []
			;

			this.watchHash(false);

			this.emptySelection(false);
			this.viewReadOnly(false);

			if (oContact)
			{
				sId = oContact.idContact;
				if (Utils.isNonEmptyArray(oContact.properties))
				{
					_.each(oContact.properties, function (aProperty) {
						if (aProperty && aProperty[0])
						{
							if (Enums.ContactPropertyType.LastName === aProperty[0])
							{
								sLastName = aProperty[1];
							}
							else if (Enums.ContactPropertyType.FirstName === aProperty[0])
							{
								sFirstName = aProperty[1];
							}
							else
							{
								aList.push(new ContactPropertyModel(aProperty[0], aProperty[2] || '', aProperty[1]));
							}
						}
					});
				}

				this.viewReadOnly(!!oContact.readOnly);
			}

			aList.unshift(new ContactPropertyModel(Enums.ContactPropertyType.LastName, '', sLastName, false,
				this.getPropertyPlceholder(Enums.ContactPropertyType.LastName)));

			aList.unshift(new ContactPropertyModel(Enums.ContactPropertyType.FirstName, '', sFirstName, !oContact,
				this.getPropertyPlceholder(Enums.ContactPropertyType.FirstName)));

			this.viewID(sId);

			Utils.delegateRunOnDestroy(this.viewProperties());

			this.viewProperties([]);
			this.viewProperties(aList);

			this.watchDirty(false);
			this.watchHash(true);
		};

		/**
		 * @param {boolean=} bDropPagePosition = false
		 */
		ContactsPopupView.prototype.reloadContactList = function (bDropPagePosition)
		{
			var
				self = this,
				iOffset = (this.contactsPage() - 1) * Consts.Defaults.ContactsPerPage
			;

			this.bDropPageAfterDelete = false;

			if (Utils.isUnd(bDropPagePosition) ? false : !!bDropPagePosition)
			{
				this.contactsPage(1);
				iOffset = 0;
			}

			this.contacts.loading(true);
			Remote.contacts(function (sResult, oData) {

				var
					iCount = 0,
					aList = []
				;

				if (Enums.StorageResultType.Success === sResult && oData && oData.Result && oData.Result.List)
				{
					if (Utils.isNonEmptyArray(oData.Result.List))
					{
						aList = _.map(oData.Result.List, function (oItem) {
							var oContact = new ContactModel();
							return oContact.parse(oItem) ? oContact : null;
						});

						aList = _.compact(aList);

						iCount = Utils.pInt(oData.Result.Count);
						iCount = 0 < iCount ? iCount : 0;
					}
				}

				self.contactsCount(iCount);

				Utils.delegateRunOnDestroy(self.contacts());
				self.contacts(aList);

				self.contacts.loading(false);
				self.viewClearSearch('' !== self.search());

			}, iOffset, Consts.Defaults.ContactsPerPage, this.search());
		};

		ContactsPopupView.prototype.onBuild = function (oDom)
		{
			this.oContentVisible = $('.b-list-content', oDom);
			this.oContentScrollable = $('.content', this.oContentVisible);

			this.selector.init(this.oContentVisible, this.oContentScrollable, Enums.KeyState.ContactList);

			var self = this;

			key('delete', Enums.KeyState.ContactList, function () {
				self.deleteCommand();
				return false;
			});

			oDom
				.on('click', '.e-pagenator .e-page', function () {
					var oPage = ko.dataFor(this);
					if (oPage)
					{
						self.contactsPage(Utils.pInt(oPage.value));
						self.reloadContactList();
					}
				})
			;

			this.initUploader();
		};

		ContactsPopupView.prototype.onShow = function (bBackToCompose)
		{
			this.bBackToCompose = Utils.isUnd(bBackToCompose) ? false : !!bBackToCompose;

			kn.routeOff();
			this.reloadContactList(true);
		};

		ContactsPopupView.prototype.onHide = function ()
		{
			kn.routeOn();
			this.currentContact(null);
			this.emptySelection(true);
			this.search('');
			this.contactsCount(0);

			Utils.delegateRunOnDestroy(this.contacts());
			this.contacts([]);

			if (this.bBackToCompose)
			{
				this.bBackToCompose = false;

				kn.showScreenPopup(__webpack_require__(/*! View/Popup/Compose */ 27));
			}
		};

		module.exports = ContactsPopupView;

	}());

/***/ },
/* 69 */
/*!**************************!*\
  !*** ./dev/bootstrap.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		module.exports = function (App) {

			var
				window = __webpack_require__(/*! window */ 10),
				_ = __webpack_require__(/*! _ */ 2),
				$ = __webpack_require__(/*! $ */ 13),

				Globals = __webpack_require__(/*! Common/Globals */ 8),
				Plugins = __webpack_require__(/*! Common/Plugins */ 23),
				Utils = __webpack_require__(/*! Common/Utils */ 1),
				Enums = __webpack_require__(/*! Common/Enums */ 4),
				Translator = __webpack_require__(/*! Common/Translator */ 7),

				EmailModel = __webpack_require__(/*! Model/Email */ 25)
			;

			Globals.__APP__ = App;

			Globals.$win
				.keydown(Utils.killCtrlAandS)
				.keyup(Utils.killCtrlAandS)
				.unload(function () {
					Globals.bUnload = true;
				})
			;

			Globals.$html
				.addClass(Globals.bMobileDevice ? 'mobile' : 'no-mobile')
				.on('click.dropdown.data-api', function () {
					Utils.detectDropdownVisibility();
				})
			;

			// export
			window['rl'] = window['rl'] || {};
			window['rl']['i18n'] = _.bind(Translator.i18n, Translator);
			window['rl']['addHook'] = _.bind(Plugins.addHook, Plugins);
			window['rl']['settingsGet'] = _.bind(Plugins.mainSettingsGet, Plugins);
			window['rl']['remoteRequest'] = _.bind(Plugins.remoteRequest, Plugins);
			window['rl']['pluginSettingsGet'] = _.bind(Plugins.settingsGet, Plugins);
			window['rl']['createCommand'] = Utils.createCommand;

			window['rl']['EmailModel'] = EmailModel;
			window['rl']['Enums'] = Enums;

			window['__APP_BOOT'] = function (fCall) {

				$(function () {

					if (!$('#rl-content').is(':visible'))
					{
						Globals.$html.addClass('no-css');
					}

					if (window['rainloopTEMPLATES'] && window['rainloopTEMPLATES'][0])
					{
						$('#rl-templates').html(window['rainloopTEMPLATES'][0]);

						_.delay(function () {

							App.bootstart();

							Globals.$html
								.removeClass('no-js rl-booted-trigger')
								.addClass('rl-booted')
							;

						}, 10);
					}
					else
					{
						fCall(false);
					}

					window['__APP_BOOT'] = null;
				});
			};

		};

	}());

/***/ },
/* 70 */
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 71 */
/*!************************************!*\
  !*** external "window.Autolinker" ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.Autolinker;

/***/ },
/* 72 */
/*!***********************************!*\
  !*** external "window.JSEncrypt" ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.JSEncrypt;

/***/ },
/* 73 */
/*!******************************!*\
  !*** external "window.JSON" ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.JSON;

/***/ },
/* 74 */
/*!*****************************!*\
  !*** external "window.Jua" ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.Jua;

/***/ },
/* 75 */
/*!************************************!*\
  !*** external "window.SimplePace" ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.SimplePace;

/***/ },
/* 76 */
/*!********************************!*\
  !*** external "window.hasher" ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.hasher;

/***/ },
/* 77 */
/*!*****************************!*\
  !*** external "window.ssm" ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.ssm;

/***/ },
/* 78 */
/*!********************************!*\
  !*** ./dev/Common/Selector.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			ko = __webpack_require__(/*! ko */ 3),
			key = __webpack_require__(/*! key */ 21),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 * @param {koProperty} oKoList
		 * @param {koProperty} oKoSelectedItem
		 * @param {string} sItemSelector
		 * @param {string} sItemSelectedSelector
		 * @param {string} sItemCheckedSelector
		 * @param {string} sItemFocusedSelector
		 */
		function Selector(oKoList, oKoSelectedItem,
			sItemSelector, sItemSelectedSelector, sItemCheckedSelector, sItemFocusedSelector)
		{
			this.list = oKoList;

			this.listChecked = ko.computed(function () {
				return _.filter(this.list(), function (oItem) {
					return oItem.checked();
				});
			}, this).extend({'rateLimit': 0});

			this.isListChecked = ko.computed(function () {
				return 0 < this.listChecked().length;
			}, this);

			this.focusedItem = ko.observable(null);
			this.selectedItem = oKoSelectedItem;
			this.selectedItemUseCallback = true;

			this.itemSelectedThrottle = _.debounce(_.bind(this.itemSelected, this), 300);

			this.listChecked.subscribe(function (aItems) {
				if (0 < aItems.length)
				{
					if (null === this.selectedItem())
					{
						if (this.selectedItem.valueHasMutated)
						{
							this.selectedItem.valueHasMutated();
						}
					}
					else
					{
						this.selectedItem(null);
					}
				}
				else if (this.bAutoSelect && this.focusedItem())
				{
					this.selectedItem(this.focusedItem());
				}
			}, this);

			this.selectedItem.subscribe(function (oItem) {

				if (oItem)
				{
					if (this.isListChecked())
					{
						_.each(this.listChecked(), function (oSubItem) {
							oSubItem.checked(false);
						});
					}

					if (this.selectedItemUseCallback)
					{
						this.itemSelectedThrottle(oItem);
					}
				}
				else if (this.selectedItemUseCallback)
				{
					this.itemSelected(null);
				}

			}, this);

			this.selectedItem.extend({'toggleSubscribe': [null,
				function (oPrev) {
					if (oPrev)
					{
						oPrev.selected(false);
					}
				}, function (oNext) {
					if (oNext)
					{
						oNext.selected(true);
					}
				}
			]});

			this.focusedItem.extend({'toggleSubscribe': [null,
				function (oPrev) {
					if (oPrev)
					{
						oPrev.focused(false);
					}
				}, function (oNext) {
					if (oNext)
					{
						oNext.focused(true);
					}
				}
			]});

			this.oContentVisible = null;
			this.oContentScrollable = null;

			this.sItemSelector = sItemSelector;
			this.sItemSelectedSelector = sItemSelectedSelector;
			this.sItemCheckedSelector = sItemCheckedSelector;
			this.sItemFocusedSelector = sItemFocusedSelector;

			this.sLastUid = '';
			this.bAutoSelect = true;
			this.oCallbacks = {};

			this.emptyFunction = function () {};

			this.focusedItem.subscribe(function (oItem) {
				if (oItem)
				{
					this.sLastUid = this.getItemUid(oItem);
				}
			}, this);

			var
				aCache = [],
				aCheckedCache = [],
				mFocused = null,
				mSelected = null
			;

			this.list.subscribe(function (aItems) {

				var self = this;
				if (Utils.isArray(aItems))
				{
					_.each(aItems, function (oItem) {
						if (oItem)
						{
							var sUid = self.getItemUid(oItem);

							aCache.push(sUid);
							if (oItem.checked())
							{
								aCheckedCache.push(sUid);
							}
							if (null === mFocused && oItem.focused())
							{
								mFocused = sUid;
							}
							if (null === mSelected && oItem.selected())
							{
								mSelected = sUid;
							}
						}
					});
				}
			}, this, 'beforeChange');

			this.list.subscribe(function (aItems) {

				var
					self = this,
					oTemp = null,
					bGetNext = false,
					aUids = [],
					mNextFocused = mFocused,
					bChecked = false,
					bSelected = false,
					iLen = 0
				;

				this.selectedItemUseCallback = false;

				this.focusedItem(null);
				this.selectedItem(null);

				if (Utils.isArray(aItems))
				{
					iLen = aCheckedCache.length;

					_.each(aItems, function (oItem) {

						var sUid = self.getItemUid(oItem);
						aUids.push(sUid);

						if (null !== mFocused && mFocused === sUid)
						{
							self.focusedItem(oItem);
							mFocused = null;
						}

						if (0 < iLen && -1 < Utils.inArray(sUid, aCheckedCache))
						{
							bChecked = true;
							oItem.checked(true);
							iLen--;
						}

						if (!bChecked && null !== mSelected && mSelected === sUid)
						{
							bSelected = true;
							self.selectedItem(oItem);
							mSelected = null;
						}
					});

					this.selectedItemUseCallback = true;

					if (!bChecked && !bSelected && this.bAutoSelect)
					{
						if (self.focusedItem())
						{
							self.selectedItem(self.focusedItem());
						}
						else if (0 < aItems.length)
						{
							if (null !== mNextFocused)
							{
								bGetNext = false;
								mNextFocused = _.find(aCache, function (sUid) {
									if (bGetNext && -1 < Utils.inArray(sUid, aUids))
									{
										return sUid;
									}
									else if (mNextFocused === sUid)
									{
										bGetNext = true;
									}
									return false;
								});

								if (mNextFocused)
								{
									oTemp = _.find(aItems, function (oItem) {
										return mNextFocused === self.getItemUid(oItem);
									});
								}
							}

							self.selectedItem(oTemp || null);
							self.focusedItem(self.selectedItem());
						}
					}
				}

				aCache = [];
				aCheckedCache = [];
				mFocused = null;
				mSelected = null;

			}, this);
		}

		Selector.prototype.itemSelected = function (oItem)
		{
			if (this.isListChecked())
			{
				if (!oItem)
				{
					(this.oCallbacks['onItemSelect'] || this.emptyFunction)(oItem || null);
				}
			}
			else
			{
				if (oItem)
				{
					(this.oCallbacks['onItemSelect'] || this.emptyFunction)(oItem);
				}
			}
		};

		Selector.prototype.goDown = function (bForceSelect)
		{
			this.newSelectPosition(Enums.EventKeyCode.Down, false, bForceSelect);
		};

		Selector.prototype.goUp = function (bForceSelect)
		{
			this.newSelectPosition(Enums.EventKeyCode.Up, false, bForceSelect);
		};

		Selector.prototype.init = function (oContentVisible, oContentScrollable, sKeyScope)
		{
			this.oContentVisible = oContentVisible;
			this.oContentScrollable = oContentScrollable;

			sKeyScope = sKeyScope || 'all';

			if (this.oContentVisible && this.oContentScrollable)
			{
				var
					self = this
				;

				$(this.oContentVisible)
					.on('selectstart', function (oEvent) {
						if (oEvent && oEvent.preventDefault)
						{
							oEvent.preventDefault();
						}
					})
					.on('click', this.sItemSelector, function (oEvent) {
						self.actionClick(ko.dataFor(this), oEvent);
					})
					.on('click', this.sItemCheckedSelector, function (oEvent) {
						var oItem = ko.dataFor(this);
						if (oItem)
						{
							if (oEvent && oEvent.shiftKey)
							{
								self.actionClick(oItem, oEvent);
							}
							else
							{
								self.focusedItem(oItem);
								oItem.checked(!oItem.checked());
							}
						}
					})
				;

				key('enter', sKeyScope, function () {
					if (self.focusedItem() && !self.focusedItem().selected())
					{
						self.actionClick(self.focusedItem());
						return false;
					}

					return true;
				});

				key('ctrl+up, command+up, ctrl+down, command+down', sKeyScope, function () {
					return false;
				});

				key('up, shift+up, down, shift+down, home, end, pageup, pagedown, insert, space', sKeyScope, function (event, handler) {
					if (event && handler && handler.shortcut)
					{
						// TODO
						var iKey = 0;
						switch (handler.shortcut)
						{
							case 'up':
							case 'shift+up':
								iKey = Enums.EventKeyCode.Up;
								break;
							case 'down':
							case 'shift+down':
								iKey = Enums.EventKeyCode.Down;
								break;
							case 'insert':
								iKey = Enums.EventKeyCode.Insert;
								break;
							case 'space':
								iKey = Enums.EventKeyCode.Space;
								break;
							case 'home':
								iKey = Enums.EventKeyCode.Home;
								break;
							case 'end':
								iKey = Enums.EventKeyCode.End;
								break;
							case 'pageup':
								iKey = Enums.EventKeyCode.PageUp;
								break;
							case 'pagedown':
								iKey = Enums.EventKeyCode.PageDown;
								break;
						}

						if (0 < iKey)
						{
							self.newSelectPosition(iKey, key.shift);
							return false;
						}
					}
				});
			}
		};

		Selector.prototype.autoSelect = function (bValue)
		{
			this.bAutoSelect = !!bValue;
		};

		/**
		 * @param {Object} oItem
		 * @returns {string}
		 */
		Selector.prototype.getItemUid = function (oItem)
		{
			var
				sUid = '',
				fGetItemUidCallback = this.oCallbacks['onItemGetUid'] || null
			;

			if (fGetItemUidCallback && oItem)
			{
				sUid = fGetItemUidCallback(oItem);
			}

			return sUid.toString();
		};

		/**
		 * @param {number} iEventKeyCode
		 * @param {boolean} bShiftKey
		 * @param {boolean=} bForceSelect = false
		 */
		Selector.prototype.newSelectPosition = function (iEventKeyCode, bShiftKey, bForceSelect)
		{
			var
				iIndex = 0,
				iPageStep = 10,
				bNext = false,
				bStop = false,
				oResult = null,
				aList = this.list(),
				iListLen = aList ? aList.length : 0,
				oFocused = this.focusedItem()
			;

			if (0 < iListLen)
			{
				if (!oFocused)
				{
					if (Enums.EventKeyCode.Down === iEventKeyCode || Enums.EventKeyCode.Insert === iEventKeyCode || Enums.EventKeyCode.Space === iEventKeyCode || Enums.EventKeyCode.Home === iEventKeyCode || Enums.EventKeyCode.PageUp === iEventKeyCode)
					{
						oResult = aList[0];
					}
					else if (Enums.EventKeyCode.Up === iEventKeyCode || Enums.EventKeyCode.End === iEventKeyCode || Enums.EventKeyCode.PageDown === iEventKeyCode)
					{
						oResult = aList[aList.length - 1];
					}
				}
				else if (oFocused)
				{
					if (Enums.EventKeyCode.Down === iEventKeyCode || Enums.EventKeyCode.Up === iEventKeyCode ||  Enums.EventKeyCode.Insert === iEventKeyCode || Enums.EventKeyCode.Space === iEventKeyCode)
					{
						_.each(aList, function (oItem) {
							if (!bStop)
							{
								switch (iEventKeyCode) {
								case Enums.EventKeyCode.Up:
									if (oFocused === oItem)
									{
										bStop = true;
									}
									else
									{
										oResult = oItem;
									}
									break;
								case Enums.EventKeyCode.Down:
								case Enums.EventKeyCode.Insert:
									if (bNext)
									{
										oResult = oItem;
										bStop = true;
									}
									else if (oFocused === oItem)
									{
										bNext = true;
									}
									break;
								}
							}
						});
					}
					else if (Enums.EventKeyCode.Home === iEventKeyCode || Enums.EventKeyCode.End === iEventKeyCode)
					{
						if (Enums.EventKeyCode.Home === iEventKeyCode)
						{
							oResult = aList[0];
						}
						else if (Enums.EventKeyCode.End === iEventKeyCode)
						{
							oResult = aList[aList.length - 1];
						}
					}
					else if (Enums.EventKeyCode.PageDown === iEventKeyCode)
					{
						for (; iIndex < iListLen; iIndex++)
						{
							if (oFocused === aList[iIndex])
							{
								iIndex += iPageStep;
								iIndex = iListLen - 1 < iIndex ? iListLen - 1 : iIndex;
								oResult = aList[iIndex];
								break;
							}
						}
					}
					else if (Enums.EventKeyCode.PageUp === iEventKeyCode)
					{
						for (iIndex = iListLen; iIndex >= 0; iIndex--)
						{
							if (oFocused === aList[iIndex])
							{
								iIndex -= iPageStep;
								iIndex = 0 > iIndex ? 0 : iIndex;
								oResult = aList[iIndex];
								break;
							}
						}
					}
				}
			}

			if (oResult)
			{
				this.focusedItem(oResult);

				if (oFocused)
				{
					if (bShiftKey)
					{
						if (Enums.EventKeyCode.Up === iEventKeyCode || Enums.EventKeyCode.Down === iEventKeyCode)
						{
							oFocused.checked(!oFocused.checked());
						}
					}
					else if (Enums.EventKeyCode.Insert === iEventKeyCode || Enums.EventKeyCode.Space === iEventKeyCode)
					{
						oFocused.checked(!oFocused.checked());
					}
				}

				if ((this.bAutoSelect || !!bForceSelect) &&
					!this.isListChecked() && Enums.EventKeyCode.Space !== iEventKeyCode)
				{
					this.selectedItem(oResult);
				}

				this.scrollToFocused();
			}
			else if (oFocused)
			{
				if (bShiftKey && (Enums.EventKeyCode.Up === iEventKeyCode || Enums.EventKeyCode.Down === iEventKeyCode))
				{
					oFocused.checked(!oFocused.checked());
				}
				else if (Enums.EventKeyCode.Insert === iEventKeyCode || Enums.EventKeyCode.Space === iEventKeyCode)
				{
					oFocused.checked(!oFocused.checked());
				}

				this.focusedItem(oFocused);
			}
		};

		/**
		 * @return {boolean}
		 */
		Selector.prototype.scrollToFocused = function ()
		{
			if (!this.oContentVisible || !this.oContentScrollable)
			{
				return false;
			}

			var
				iOffset = 20,
				oFocused = $(this.sItemFocusedSelector, this.oContentScrollable),
				oPos = oFocused.position(),
				iVisibleHeight = this.oContentVisible.height(),
				iFocusedHeight = oFocused.outerHeight()
			;

			if (oPos && (oPos.top < 0 || oPos.top + iFocusedHeight > iVisibleHeight))
			{
				if (oPos.top < 0)
				{
					this.oContentScrollable.scrollTop(this.oContentScrollable.scrollTop() + oPos.top - iOffset);
				}
				else
				{
					this.oContentScrollable.scrollTop(this.oContentScrollable.scrollTop() + oPos.top - iVisibleHeight + iFocusedHeight + iOffset);
				}

				return true;
			}

			return false;
		};

		/**
		 * @param {boolean=} bFast = false
		 * @return {boolean}
		 */
		Selector.prototype.scrollToTop = function (bFast)
		{
			if (!this.oContentVisible || !this.oContentScrollable)
			{
				return false;
			}

			if (bFast || 50 > this.oContentScrollable.scrollTop())
			{
				this.oContentScrollable.scrollTop(0);
			}
			else
			{
				this.oContentScrollable.stop().animate({'scrollTop': 0}, 200);
			}

			return true;
		};

		Selector.prototype.eventClickFunction = function (oItem, oEvent)
		{
			var
				sUid = this.getItemUid(oItem),
				iIndex = 0,
				iLength = 0,
				oListItem = null,
				sLineUid = '',
				bChangeRange = false,
				bIsInRange = false,
				aList = [],
				bChecked = false
			;

			if (oEvent && oEvent.shiftKey)
			{
				if ('' !== sUid && '' !== this.sLastUid && sUid !== this.sLastUid)
				{
					aList = this.list();
					bChecked = oItem.checked();

					for (iIndex = 0, iLength = aList.length; iIndex < iLength; iIndex++)
					{
						oListItem = aList[iIndex];
						sLineUid = this.getItemUid(oListItem);

						bChangeRange = false;
						if (sLineUid === this.sLastUid || sLineUid === sUid)
						{
							bChangeRange = true;
						}

						if (bChangeRange)
						{
							bIsInRange = !bIsInRange;
						}

						if (bIsInRange || bChangeRange)
						{
							oListItem.checked(bChecked);
						}
					}
				}
			}

			this.sLastUid = '' === sUid ? '' : sUid;
		};

		/**
		 * @param {Object} oItem
		 * @param {Object=} oEvent
		 */
		Selector.prototype.actionClick = function (oItem, oEvent)
		{
			if (oItem)
			{
				var
					bClick = true,
					sUid = this.getItemUid(oItem)
				;

				if (oEvent)
				{
					if (oEvent.shiftKey && !oEvent.ctrlKey && !oEvent.altKey)
					{
						bClick = false;
						if ('' === this.sLastUid)
						{
							this.sLastUid = sUid;
						}

						oItem.checked(!oItem.checked());
						this.eventClickFunction(oItem, oEvent);

						this.focusedItem(oItem);
					}
					else if (oEvent.ctrlKey && !oEvent.shiftKey && !oEvent.altKey)
					{
						bClick = false;
						this.focusedItem(oItem);

						if (this.selectedItem() && oItem !== this.selectedItem())
						{
							this.selectedItem().checked(true);
						}

						oItem.checked(!oItem.checked());
					}
				}

				if (bClick)
				{
					this.focusedItem(oItem);
					this.selectedItem(oItem);

					this.scrollToFocused();
				}
			}
		};

		Selector.prototype.on = function (sEventName, fCallback)
		{
			this.oCallbacks[sEventName] = fCallback;
		};

		module.exports = Selector;

	}());

/***/ },
/* 79 */
/*!*********************************!*\
  !*** ./dev/Model/Attachment.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),

			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 12),

			AbstractModel = __webpack_require__(/*! Knoin/AbstractModel */ 24)
		;

		/**
		 * @constructor
		 */
		function AttachmentModel()
		{
			AbstractModel.call(this, 'AttachmentModel');

			this.mimeType = '';
			this.fileName = '';
			this.estimatedSize = 0;
			this.friendlySize = '';
			this.isInline = false;
			this.isLinked = false;
			this.isThumbnail = false;
			this.cid = '';
			this.cidWithOutTags = '';
			this.contentLocation = '';
			this.download = '';
			this.folder = '';
			this.uid = '';
			this.mimeIndex = '';
			this.framed = false;
		}

		_.extend(AttachmentModel.prototype, AbstractModel.prototype);

		/**
		 * @static
		 * @param {AjaxJsonAttachment} oJsonAttachment
		 * @return {?AttachmentModel}
		 */
		AttachmentModel.newInstanceFromJson = function (oJsonAttachment)
		{
			var oAttachmentModel = new AttachmentModel();
			return oAttachmentModel.initByJson(oJsonAttachment) ? oAttachmentModel : null;
		};

		AttachmentModel.prototype.mimeType = '';
		AttachmentModel.prototype.fileName = '';
		AttachmentModel.prototype.estimatedSize = 0;
		AttachmentModel.prototype.friendlySize = '';
		AttachmentModel.prototype.isInline = false;
		AttachmentModel.prototype.isLinked = false;
		AttachmentModel.prototype.isThumbnail = false;
		AttachmentModel.prototype.cid = '';
		AttachmentModel.prototype.cidWithOutTags = '';
		AttachmentModel.prototype.contentLocation = '';
		AttachmentModel.prototype.download = '';
		AttachmentModel.prototype.folder = '';
		AttachmentModel.prototype.uid = '';
		AttachmentModel.prototype.mimeIndex = '';
		AttachmentModel.prototype.framed = false;

		/**
		 * @param {AjaxJsonAttachment} oJsonAttachment
		 */
		AttachmentModel.prototype.initByJson = function (oJsonAttachment)
		{
			var bResult = false;
			if (oJsonAttachment && 'Object/Attachment' === oJsonAttachment['@Object'])
			{
				this.mimeType = Utils.trim((oJsonAttachment.MimeType || '').toLowerCase());
				this.fileName = Utils.trim(oJsonAttachment.FileName);
				this.estimatedSize = Utils.pInt(oJsonAttachment.EstimatedSize);
				this.isInline = !!oJsonAttachment.IsInline;
				this.isLinked = !!oJsonAttachment.IsLinked;
				this.isThumbnail = !!oJsonAttachment.IsThumbnail;
				this.cid = oJsonAttachment.CID;
				this.contentLocation = oJsonAttachment.ContentLocation;
				this.download = oJsonAttachment.Download;

				this.folder = oJsonAttachment.Folder;
				this.uid = oJsonAttachment.Uid;
				this.mimeIndex = oJsonAttachment.MimeIndex;
				this.framed = !!oJsonAttachment.Framed;

				this.friendlySize = Utils.friendlySize(this.estimatedSize);
				this.cidWithOutTags = this.cid.replace(/^<+/, '').replace(/>+$/, '');

				bResult = true;
			}

			return bResult;
		};

		/**
		 * @return {boolean}
		 */
		AttachmentModel.prototype.isImage = function ()
		{
			return -1 < Utils.inArray(this.mimeType.toLowerCase(),
				['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
			);
		};

		/**
		 * @return {boolean}
		 */
		AttachmentModel.prototype.hasThumbnail = function ()
		{
			return this.isThumbnail;
		};

		/**
		 * @return {boolean}
		 */
		AttachmentModel.prototype.isText = function ()
		{
			return -1 < Utils.inArray(this.mimeType, ['application/pgp-signature']) ||
				('text/' === this.mimeType.substr(0, 5) && -1 === Utils.inArray(this.mimeType, ['text/html']));
		};

		/**
		 * @return {boolean}
		 */
		AttachmentModel.prototype.isPdf = function ()
		{
			return Globals.bAllowPdfPreview && 'application/pdf' === this.mimeType;
		};

		/**
		 * @return {boolean}
		 */
		AttachmentModel.prototype.isFramed = function ()
		{
			return this.framed && (Globals.__APP__ && Globals.__APP__.googlePreviewSupported()) &&
				!this.isPdf() && !this.isText() && !this.isImage();
		};

		/**
		 * @return {boolean}
		 */
		AttachmentModel.prototype.hasPreview = function ()
		{
			return this.isImage() || this.isPdf() || this.isText() || this.isFramed();
		};

		/**
		 * @return {string}
		 */
		AttachmentModel.prototype.linkDownload = function ()
		{
			return Links.attachmentDownload(this.download);
		};

		/**
		 * @return {string}
		 */
		AttachmentModel.prototype.linkPreview = function ()
		{
			return Links.attachmentPreview(this.download);
		};

		/**
		 * @return {string}
		 */
		AttachmentModel.prototype.linkThumbnail = function ()
		{
			return this.hasThumbnail() ? Links.attachmentThumbnailPreview(this.download) : '';
		};

		/**
		 * @return {string}
		 */
		AttachmentModel.prototype.linkThumbnailPreviewStyle = function ()
		{
			var sLink = this.linkThumbnail();
			return '' === sLink ? '' : 'background:url(' + sLink + ')';
		};

		/**
		 * @return {string}
		 */
		AttachmentModel.prototype.linkFramed = function ()
		{
			return Links.attachmentFramed(this.download);
		};

		/**
		 * @return {string}
		 */
		AttachmentModel.prototype.linkPreviewAsPlain = function ()
		{
			return Links.attachmentPreviewAsPlain(this.download);
		};

		/**
		 * @return {string}
		 */
		AttachmentModel.prototype.linkPreviewMain = function ()
		{
			var sResult = '';
			switch (true)
			{
				case this.isImage():
				case this.isPdf():
					sResult = this.linkPreview();
					break;
				case this.isText():
					sResult = this.linkPreviewAsPlain();
					break;
				case this.isFramed():
					sResult = this.linkFramed();
					break;
			}

			return sResult;
		};

		/**
		 * @return {boolean}
		 */
		AttachmentModel.prototype.hasPreview = function ()
		{
			return this.isImage() || this.isPdf() || this.isText() || this.isFramed();
		};

		/**
		 * @return {string}
		 */
		AttachmentModel.prototype.generateTransferDownloadUrl = function ()
		{
			var	sLink = this.linkDownload();
			if ('http' !== sLink.substr(0, 4))
			{
				sLink = window.location.protocol + '//' + window.location.host + window.location.pathname + sLink;
			}

			return this.mimeType + ':' + this.fileName + ':' + sLink;
		};

		/**
		 * @param {AttachmentModel} oAttachment
		 * @param {*} oEvent
		 * @return {boolean}
		 */
		AttachmentModel.prototype.eventDragStart = function (oAttachment, oEvent)
		{
			var	oLocalEvent = oEvent.originalEvent || oEvent;
			if (oAttachment && oLocalEvent && oLocalEvent.dataTransfer && oLocalEvent.dataTransfer.setData)
			{
				oLocalEvent.dataTransfer.setData('DownloadURL', this.generateTransferDownloadUrl());
			}

			return true;
		};

		/**
		 * @param {string} sMimeType
		 * @returns {string}
		 */
		AttachmentModel.staticIconClassHelper = function (sMimeType)
		{
			sMimeType = Utils.trim(sMimeType).toLowerCase();

			var
				sText = '',
				sClass = 'icon-file',
				aParts = sMimeType.split('/')
			;

			if (aParts && aParts[1])
			{
				if ('image' === aParts[0])
				{
					sClass = 'icon-file-image';
				}
				else if ('text' === aParts[0])
				{
					sClass = 'icon-file-text';
				}
				else if ('audio' === aParts[0])
				{
					sClass = 'icon-file-music';
				}
				else if ('video' === aParts[0])
				{
					sClass = 'icon-file-movie';
				}
				else if (-1 < Utils.inArray(aParts[1],
					['zip', '7z', 'tar', 'rar', 'gzip', 'bzip', 'bzip2', 'x-zip', 'x-7z', 'x-rar', 'x-tar', 'x-gzip', 'x-bzip', 'x-bzip2', 'x-zip-compressed', 'x-7z-compressed', 'x-rar-compressed']))
				{
					sClass = 'icon-file-zip';
				}
				else if (-1 < Utils.inArray(aParts[1],
					['pdf', 'x-pdf']))
				{
					sText = 'pdf';
					sClass = 'icon-none';
				}
		//		else if (-1 < Utils.inArray(aParts[1], [
		//			'exe', 'x-exe', 'x-winexe', 'bat'
		//		]))
		//		{
		//			sClass = 'icon-console';
		//		}
				else if (-1 < Utils.inArray(sMimeType, [
					'application/pgp-signature', 'application/pkcs7-signature'
				]))
				{
					sClass = 'icon-file-certificate';
				}
				else if (-1 < Utils.inArray(aParts[1], [
					'rtf', 'msword', 'vnd.msword', 'vnd.openxmlformats-officedocument.wordprocessingml.document',
					'vnd.openxmlformats-officedocument.wordprocessingml.template',
					'vnd.ms-word.document.macroEnabled.12',
					'vnd.ms-word.template.macroEnabled.12'
				]))
				{
					sClass = 'icon-file-text';
				}
				else if (-1 < Utils.inArray(aParts[1], [
					'excel', 'ms-excel', 'vnd.ms-excel',
					'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'vnd.openxmlformats-officedocument.spreadsheetml.template',
					'vnd.ms-excel.sheet.macroEnabled.12',
					'vnd.ms-excel.template.macroEnabled.12',
					'vnd.ms-excel.addin.macroEnabled.12',
					'vnd.ms-excel.sheet.binary.macroEnabled.12'
				]))
				{
					sClass = 'icon-file-excel';
				}
				else if (-1 < Utils.inArray(aParts[1], [
					'powerpoint', 'ms-powerpoint', 'vnd.ms-powerpoint',
					'vnd.openxmlformats-officedocument.presentationml.presentation',
					'vnd.openxmlformats-officedocument.presentationml.template',
					'vnd.openxmlformats-officedocument.presentationml.slideshow',
					'vnd.ms-powerpoint.addin.macroEnabled.12',
					'vnd.ms-powerpoint.presentation.macroEnabled.12',
					'vnd.ms-powerpoint.template.macroEnabled.12',
					'vnd.ms-powerpoint.slideshow.macroEnabled.12'
				]))
				{
					sClass = 'icon-file-chart-graph';
				}
			}

			return [sClass, sText];
		};

		/**
		 * @returns {string}
		 */
		AttachmentModel.prototype.iconClass = function ()
		{
			return AttachmentModel.staticIconClassHelper(this.mimeType)[0];
		};

		/**
		 * @returns {string}
		 */
		AttachmentModel.prototype.iconText = function ()
		{
			return AttachmentModel.staticIconClassHelper(this.mimeType)[1];
		};

		module.exports = AttachmentModel;

	}());

/***/ },
/* 80 */
/*!*****************************!*\
  !*** ./dev/Model/Filter.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),

			FilterConditionModel = __webpack_require__(/*! Model/FilterCondition */ 99),

			AbstractModel = __webpack_require__(/*! Knoin/AbstractModel */ 24)
		;

		/**
		 * @constructor
		 */
		function FilterModel()
		{
			AbstractModel.call(this, 'FilterModel');

			this.enabled = ko.observable(true);

			this.id = '';

			this.name = ko.observable('');
			this.name.error = ko.observable(false);
			this.name.focused = ko.observable(false);

			this.conditions = ko.observableArray([]);
			this.conditionsType = ko.observable(Enums.FilterRulesType.Any);

			// Actions
			this.actionValue = ko.observable('');
			this.actionValue.error = ko.observable(false);

			this.actionValueSecond = ko.observable('');
			this.actionValueThird = ko.observable('');

			this.actionMarkAsRead = ko.observable(false);

			this.actionKeep = ko.observable(true);
			this.actionNoStop = ko.observable(false);

			this.actionType = ko.observable(Enums.FiltersAction.MoveTo);

			this.actionType.subscribe(function () {
				this.actionValue('');
				this.actionValue.error(false);
				this.actionValueSecond('');
				this.actionValueThird('');
			}, this);

			var fGetRealFolderName = function (sFolderFullNameRaw) {
				var oFolder = Cache.getFolderFromCacheList(sFolderFullNameRaw);
				return oFolder ? oFolder.fullName.replace(
					'.' === oFolder.delimiter ? /\./ : /[\\\/]+/, ' / ') : sFolderFullNameRaw;
			};

			this.nameSub = ko.computed(function () {

				var
					sResult = '',
					sActionValue = this.actionValue()
				;

				switch (this.actionType())
				{
					case Enums.FiltersAction.MoveTo:
						sResult = Translator.i18n('SETTINGS_FILTERS/SUBNAME_MOVE_TO', {
							'FOLDER': fGetRealFolderName(sActionValue)
						});
						break;
					case Enums.FiltersAction.Forward:
						sResult = Translator.i18n('SETTINGS_FILTERS/SUBNAME_FORWARD_TO', {
							'EMAIL': sActionValue
						});
						break;
					case Enums.FiltersAction.Vacation:
						sResult = Translator.i18n('SETTINGS_FILTERS/SUBNAME_VACATION_MESSAGE');
						break;
					case Enums.FiltersAction.Reject:
						sResult = Translator.i18n('SETTINGS_FILTERS/SUBNAME_REJECT');
						break;
					case Enums.FiltersAction.Discard:
						sResult = Translator.i18n('SETTINGS_FILTERS/SUBNAME_DISCARD');
						break;
				}

				return sResult ? '(' + sResult + ')' : '';

			}, this);

			this.actionTemplate = ko.computed(function () {

				var sTemplate = '';
				switch (this.actionType())
				{
					default:
					case Enums.FiltersAction.MoveTo:
						sTemplate = 'SettingsFiltersActionMoveToFolder';
						break;
					case Enums.FiltersAction.Forward:
						sTemplate = 'SettingsFiltersActionForward';
						break;
					case Enums.FiltersAction.Vacation:
						sTemplate = 'SettingsFiltersActionVacation';
						break;
					case Enums.FiltersAction.Reject:
						sTemplate = 'SettingsFiltersActionReject';
						break;
					case Enums.FiltersAction.None:
						sTemplate = 'SettingsFiltersActionNone';
						break;
					case Enums.FiltersAction.Discard:
						sTemplate = 'SettingsFiltersActionDiscard';
						break;
				}

				return sTemplate;

			}, this);

			this.regDisposables(this.conditions.subscribe(Utils.windowResizeCallback));

			this.regDisposables(this.name.subscribe(function (sValue) {
				this.name.error('' === sValue);
			}, this));

			this.regDisposables(this.actionValue.subscribe(function (sValue) {
				this.actionValue.error('' === sValue);
			}, this));

			this.regDisposables([this.actionNoStop, this.actionTemplate]);

			this.deleteAccess = ko.observable(false);
			this.canBeDalete = ko.observable(true);
		}

		_.extend(FilterModel.prototype, AbstractModel.prototype);

		FilterModel.prototype.generateID = function ()
		{
			this.id = Utils.fakeMd5();
		};

		FilterModel.prototype.verify = function ()
		{
			if ('' === this.name())
			{
				this.name.error(true);
				return false;
			}

			if (0 < this.conditions().length)
			{
				if (_.find(this.conditions(), function (oCond) {
					return oCond && !oCond.verify();
				}))
				{
					return false;
				}
			}

			if ('' === this.actionValue())
			{
				if (-1 < Utils.inArray(this.actionType(), [
					Enums.FiltersAction.MoveTo,
					Enums.FiltersAction.Forward,
					Enums.FiltersAction.Reject,
					Enums.FiltersAction.Vacation
				]))
				{
					this.actionValue.error(true);
					return false;
				}
			}

			if (Enums.FiltersAction.Forward === this.actionType() &&
				-1 === this.actionValue().indexOf('@'))
			{
				this.actionValue.error(true);
				return false;
			}

			this.name.error(false);
			this.actionValue.error(false);

			return true;
		};

		FilterModel.prototype.toJson = function ()
		{
			return {
				'ID': this.id,
				'Enabled': this.enabled() ? '1' : '0',
				'Name': this.name(),
				'ConditionsType': this.conditionsType(),
				'Conditions': _.map(this.conditions(), function (oItem) {
					return oItem.toJson();
				}),

				'ActionValue': this.actionValue(),
				'ActionValueSecond': this.actionValueSecond(),
				'ActionValueThird': this.actionValueThird(),
				'ActionType': this.actionType(),

				'Stop': this.actionNoStop() ? '0' : '1',
				'Keep': this.actionKeep() ? '1' : '0',
				'MarkAsRead': this.actionMarkAsRead() ? '1' : '0'
			};
		};

		FilterModel.prototype.addCondition = function ()
		{
			this.conditions.push(new FilterConditionModel());
		};

		FilterModel.prototype.removeCondition = function (oConditionToDelete)
		{
			this.conditions.remove(oConditionToDelete);
			Utils.delegateRunOnDestroy(oConditionToDelete);
		};

		FilterModel.prototype.parse = function (oItem)
		{
			var bResult = false;
			if (oItem && 'Object/Filter' === oItem['@Object'])
			{
				this.id = Utils.pString(oItem['ID']);
				this.name(Utils.pString(oItem['Name']));
				this.enabled(!!oItem['Enabled']);

				this.conditionsType(Utils.pString(oItem['ConditionsType']));

				this.conditions([]);

				if (Utils.isNonEmptyArray(oItem['Conditions']))
				{
					this.conditions(_.compact(_.map(oItem['Conditions'], function (aData) {
						var oFilterCondition = new FilterConditionModel();
						return oFilterCondition && oFilterCondition.parse(aData) ?
							oFilterCondition : null;
					})));
				}

				this.actionType(Utils.pString(oItem['ActionType']));

				this.actionValue(Utils.pString(oItem['ActionValue']));
				this.actionValueSecond(Utils.pString(oItem['ActionValueSecond']));
				this.actionValueThird(Utils.pString(oItem['ActionValueThird']));

				this.actionNoStop(!oItem['Stop']);
				this.actionKeep(!!oItem['Keep']);
				this.actionMarkAsRead(!!oItem['MarkAsRead']);

				bResult = true;
			}

			return bResult;
		};

		FilterModel.prototype.cloneSelf = function ()
		{
			var oClone = new FilterModel();

			oClone.id = this.id;

			oClone.enabled(this.enabled());

			oClone.name(this.name());
			oClone.name.error(this.name.error());

			oClone.conditionsType(this.conditionsType());

			oClone.actionMarkAsRead(this.actionMarkAsRead());

			oClone.actionType(this.actionType());

			oClone.actionValue(this.actionValue());
			oClone.actionValue.error(this.actionValue.error());

			oClone.actionValueSecond(this.actionValueSecond());
			oClone.actionValueThird(this.actionValueThird());

			oClone.actionKeep(this.actionKeep());
			oClone.actionNoStop(this.actionNoStop());

			oClone.conditions(_.map(this.conditions(), function (oCondition) {
				return oCondition.cloneSelf();
			}));

			return oClone;
		};

		module.exports = FilterModel;

	}());

/***/ },
/* 81 */
/*!******************************!*\
  !*** ./dev/Model/Message.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			ko = __webpack_require__(/*! ko */ 3),
			moment = __webpack_require__(/*! moment */ 36),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Links = __webpack_require__(/*! Common/Links */ 12),

			PgpStore = __webpack_require__(/*! Stores/User/Pgp */ 20),

			EmailModel = __webpack_require__(/*! Model/Email */ 25),
			AttachmentModel = __webpack_require__(/*! Model/Attachment */ 79),

			AbstractModel = __webpack_require__(/*! Knoin/AbstractModel */ 24)
		;

		/**
		 * @constructor
		 */
		function MessageModel()
		{
			AbstractModel.call(this, 'MessageModel');

			this.folderFullNameRaw = '';
			this.uid = '';
			this.hash = '';
			this.requestHash = '';
			this.subject = ko.observable('');
			this.subjectPrefix = ko.observable('');
			this.subjectSuffix = ko.observable('');
			this.size = ko.observable(0);
			this.dateTimeStampInUTC = ko.observable(0);
			this.priority = ko.observable(Enums.MessagePriority.Normal);

			this.proxy = false;

			this.fromEmailString = ko.observable('');
			this.fromClearEmailString = ko.observable('');
			this.toEmailsString = ko.observable('');
			this.toClearEmailsString = ko.observable('');

			this.senderEmailsString = ko.observable('');
			this.senderClearEmailsString = ko.observable('');

			this.emails = [];

			this.from = [];
			this.to = [];
			this.cc = [];
			this.bcc = [];
			this.replyTo = [];
			this.deliveredTo = [];

			this.newForAnimation = ko.observable(false);

			this.deleted = ko.observable(false);
			this.unseen = ko.observable(false);
			this.flagged = ko.observable(false);
			this.answered = ko.observable(false);
			this.forwarded = ko.observable(false);
			this.isReadReceipt = ko.observable(false);

			this.focused = ko.observable(false);
			this.selected = ko.observable(false);
			this.checked = ko.observable(false);
			this.hasAttachments = ko.observable(false);
			this.attachmentsMainType = ko.observable('');

			this.moment = ko.observable(moment(moment.unix(0)));

			this.attachmentIconClass = ko.computed(function () {
				var sClass = '';
				if (this.hasAttachments())
				{
					sClass = 'icon-attachment';
					switch (this.attachmentsMainType())
					{
						case 'image':
							sClass = 'icon-image';
							break;
						case 'archive':
							sClass = 'icon-file-zip';
							break;
						case 'doc':
							sClass = 'icon-file-text';
							break;
						case 'certificate':
							sClass = 'icon-file-certificate';
							break;
	//					case 'pdf':
	//						sClass = 'icon-file-pdf';
	//						break;
					}
				}
				return sClass;
			}, this);

			this.fullFormatDateValue = ko.computed(function () {
				return MessageModel.calculateFullFromatDateValue(this.dateTimeStampInUTC());
			}, this);

			this.momentDate = Utils.createMomentDate(this);
			this.momentShortDate = Utils.createMomentShortDate(this);

			this.regDisposables(this.dateTimeStampInUTC.subscribe(function (iValue) {
				var iNow = moment().unix();
				this.moment(moment.unix(iNow < iValue ? iNow : iValue));
			}, this));

			this.body = null;
			this.plainRaw = '';
			this.isHtml = ko.observable(false);
			this.hasImages = ko.observable(false);
			this.attachments = ko.observableArray([]);

			this.isPgpSigned = ko.observable(false);
			this.isPgpEncrypted = ko.observable(false);
			this.pgpSignedVerifyStatus = ko.observable(Enums.SignedVerifyStatus.None);
			this.pgpSignedVerifyUser = ko.observable('');

			this.priority = ko.observable(Enums.MessagePriority.Normal);
			this.readReceipt = ko.observable('');

			this.aDraftInfo = [];
			this.sMessageId = '';
			this.sInReplyTo = '';
			this.sReferences = '';

			this.parentUid = ko.observable(0);
			this.threads = ko.observableArray([]);
			this.threadsLen = ko.observable(0);
			this.hasUnseenSubMessage = ko.observable(false);
			this.hasFlaggedSubMessage = ko.observable(false);

			this.lastInCollapsedThread = ko.observable(false);
			this.lastInCollapsedThreadLoading = ko.observable(false);

			this.threadsLenResult = ko.computed(function () {
				var iCount = this.threadsLen();
				return 0 === this.parentUid() && 0 < iCount ? iCount + 1 : '';
			}, this);

			this.isImportant = ko.computed(function () {
				return Enums.MessagePriority.High === this.priority();
			}, this);

			this.regDisposables([this.attachmentIconClass, this.fullFormatDateValue,
				this.threadsLenResult, this.isImportant]);
		}

		_.extend(MessageModel.prototype, AbstractModel.prototype);

		/**
		 * @static
		 * @param {AjaxJsonMessage} oJsonMessage
		 * @return {?MessageModel}
		 */
		MessageModel.newInstanceFromJson = function (oJsonMessage)
		{
			var oMessageModel = new MessageModel();
			return oMessageModel.initByJson(oJsonMessage) ? oMessageModel : null;
		};

		/**
		 * @static
		 * @param {number} iTimeStampInUTC
		 * @return {string}
		 */
		MessageModel.calculateFullFromatDateValue = function (iTimeStampInUTC)
		{
			return 0 < iTimeStampInUTC ? moment.unix(iTimeStampInUTC).format('LLL') : '';
		};

		/**
		 * @static
		 * @param {Array} aEmail
		 * @param {boolean=} bFriendlyView
		 * @param {boolean=} bWrapWithLink = false
		 * @return {string}
		 */
		MessageModel.emailsToLine = function (aEmail, bFriendlyView, bWrapWithLink)
		{
			var
				aResult = [],
				iIndex = 0,
				iLen = 0
				;

			if (Utils.isNonEmptyArray(aEmail))
			{
				for (iIndex = 0, iLen = aEmail.length; iIndex < iLen; iIndex++)
				{
					aResult.push(aEmail[iIndex].toLine(bFriendlyView, bWrapWithLink));
				}
			}

			return aResult.join(', ');
		};

		/**
		 * @static
		 * @param {Array} aEmail
		 * @return {string}
		 */
		MessageModel.emailsToLineClear = function (aEmail)
		{
			var
				aResult = [],
				iIndex = 0,
				iLen = 0
				;

			if (Utils.isNonEmptyArray(aEmail))
			{
				for (iIndex = 0, iLen = aEmail.length; iIndex < iLen; iIndex++)
				{
					if (aEmail[iIndex] && aEmail[iIndex].email && '' !== aEmail[iIndex].name)
					{
						aResult.push(aEmail[iIndex].email);
					}
				}
			}

			return aResult.join(', ');
		};

		/**
		 * @static
		 * @param {?Array} aJsonEmails
		 * @return {Array.<EmailModel>}
		 */
		MessageModel.initEmailsFromJson = function (aJsonEmails)
		{
			var
				iIndex = 0,
				iLen = 0,
				oEmailModel = null,
				aResult = []
				;

			if (Utils.isNonEmptyArray(aJsonEmails))
			{
				for (iIndex = 0, iLen = aJsonEmails.length; iIndex < iLen; iIndex++)
				{
					oEmailModel = EmailModel.newInstanceFromJson(aJsonEmails[iIndex]);
					if (oEmailModel)
					{
						aResult.push(oEmailModel);
					}
				}
			}

			return aResult;
		};

		/**
		 * @static
		 * @param {Array.<EmailModel>} aMessageEmails
		 * @param {Object} oLocalUnic
		 * @param {Array} aLocalEmails
		 */
		MessageModel.replyHelper = function (aMessageEmails, oLocalUnic, aLocalEmails)
		{
			if (aMessageEmails && 0 < aMessageEmails.length)
			{
				var
					iIndex = 0,
					iLen = aMessageEmails.length
					;

				for (; iIndex < iLen; iIndex++)
				{
					if (Utils.isUnd(oLocalUnic[aMessageEmails[iIndex].email]))
					{
						oLocalUnic[aMessageEmails[iIndex].email] = true;
						aLocalEmails.push(aMessageEmails[iIndex]);
					}
				}
			}
		};

		MessageModel.prototype.clear = function ()
		{
			this.folderFullNameRaw = '';
			this.uid = '';
			this.hash = '';
			this.requestHash = '';
			this.subject('');
			this.subjectPrefix('');
			this.subjectSuffix('');
			this.size(0);
			this.dateTimeStampInUTC(0);
			this.priority(Enums.MessagePriority.Normal);

			this.proxy = false;

			this.fromEmailString('');
			this.fromClearEmailString('');
			this.toEmailsString('');
			this.toClearEmailsString('');
			this.senderEmailsString('');
			this.senderClearEmailsString('');

			this.emails = [];

			this.from = [];
			this.to = [];
			this.cc = [];
			this.bcc = [];
			this.replyTo = [];
			this.deliveredTo = [];

			this.newForAnimation(false);

			this.deleted(false);
			this.unseen(false);
			this.flagged(false);
			this.answered(false);
			this.forwarded(false);
			this.isReadReceipt(false);

			this.selected(false);
			this.checked(false);
			this.hasAttachments(false);
			this.attachmentsMainType('');

			this.body = null;
			this.isHtml(false);
			this.hasImages(false);
			this.attachments([]);

			this.isPgpSigned(false);
			this.isPgpEncrypted(false);
			this.pgpSignedVerifyStatus(Enums.SignedVerifyStatus.None);
			this.pgpSignedVerifyUser('');

			this.priority(Enums.MessagePriority.Normal);
			this.readReceipt('');
			this.aDraftInfo = [];
			this.sMessageId = '';
			this.sInReplyTo = '';
			this.sReferences = '';

			this.parentUid(0);
			this.threads([]);
			this.threadsLen(0);
			this.hasUnseenSubMessage(false);
			this.hasFlaggedSubMessage(false);

			this.lastInCollapsedThread(false);
			this.lastInCollapsedThreadLoading(false);
		};

		/**
		 * @return {string}
		 */
		MessageModel.prototype.friendlySize = function ()
		{
			return Utils.friendlySize(this.size());
		};

		MessageModel.prototype.computeSenderEmail = function ()
		{
			var
				sSent = __webpack_require__(/*! Stores/User/Folder */ 32).sentFolder(),
				sDraft = __webpack_require__(/*! Stores/User/Folder */ 32).draftFolder()
			;

			this.senderEmailsString(this.folderFullNameRaw === sSent || this.folderFullNameRaw === sDraft ?
				this.toEmailsString() : this.fromEmailString());

			this.senderClearEmailsString(this.folderFullNameRaw === sSent || this.folderFullNameRaw === sDraft ?
				this.toClearEmailsString() : this.fromClearEmailString());
		};

		/**
		 * @param {AjaxJsonMessage} oJsonMessage
		 * @return {boolean}
		 */
		MessageModel.prototype.initByJson = function (oJsonMessage)
		{
			var
				bResult = false,
				iPriority = Enums.MessagePriority.Normal
			;

			if (oJsonMessage && 'Object/Message' === oJsonMessage['@Object'])
			{
				iPriority = Utils.pInt(oJsonMessage.Priority);
				this.priority(-1 < Utils.inArray(iPriority, [Enums.MessagePriority.High, Enums.MessagePriority.Low]) ?
					iPriority : Enums.MessagePriority.Normal);

				this.folderFullNameRaw = oJsonMessage.Folder;
				this.uid = oJsonMessage.Uid;
				this.hash = oJsonMessage.Hash;
				this.requestHash = oJsonMessage.RequestHash;

				this.proxy = !!oJsonMessage.ExternalProxy;

				this.size(Utils.pInt(oJsonMessage.Size));

				this.from = MessageModel.initEmailsFromJson(oJsonMessage.From);
				this.to = MessageModel.initEmailsFromJson(oJsonMessage.To);
				this.cc = MessageModel.initEmailsFromJson(oJsonMessage.Cc);
				this.bcc = MessageModel.initEmailsFromJson(oJsonMessage.Bcc);
				this.replyTo = MessageModel.initEmailsFromJson(oJsonMessage.ReplyTo);
				this.deliveredTo = MessageModel.initEmailsFromJson(oJsonMessage.DeliveredTo);

				this.subject(oJsonMessage.Subject);
				if (Utils.isArray(oJsonMessage.SubjectParts))
				{
					this.subjectPrefix(oJsonMessage.SubjectParts[0]);
					this.subjectSuffix(oJsonMessage.SubjectParts[1]);
				}
				else
				{
					this.subjectPrefix('');
					this.subjectSuffix(this.subject());
				}

				this.dateTimeStampInUTC(Utils.pInt(oJsonMessage.DateTimeStampInUTC));
				this.hasAttachments(!!oJsonMessage.HasAttachments);
				this.attachmentsMainType(oJsonMessage.AttachmentsMainType);

				this.fromEmailString(MessageModel.emailsToLine(this.from, true));
				this.fromClearEmailString(MessageModel.emailsToLineClear(this.from));
				this.toEmailsString(MessageModel.emailsToLine(this.to, true));
				this.toClearEmailsString(MessageModel.emailsToLineClear(this.to));

				this.parentUid(Utils.pInt(oJsonMessage.ParentThread));
				this.threads(Utils.isArray(oJsonMessage.Threads) ? oJsonMessage.Threads : []);
				this.threadsLen(Utils.pInt(oJsonMessage.ThreadsLen));

				this.initFlagsByJson(oJsonMessage);
				this.computeSenderEmail();

				bResult = true;
			}

			return bResult;
		};

		/**
		 * @param {AjaxJsonMessage} oJsonMessage
		 * @return {boolean}
		 */
		MessageModel.prototype.initUpdateByMessageJson = function (oJsonMessage)
		{
			var
				bResult = false,
				iPriority = Enums.MessagePriority.Normal
			;

			if (oJsonMessage && 'Object/Message' === oJsonMessage['@Object'])
			{
				iPriority = Utils.pInt(oJsonMessage.Priority);
				this.priority(-1 < Utils.inArray(iPriority, [Enums.MessagePriority.High, Enums.MessagePriority.Low]) ?
					iPriority : Enums.MessagePriority.Normal);

				this.aDraftInfo = oJsonMessage.DraftInfo;

				this.sMessageId = oJsonMessage.MessageId;
				this.sInReplyTo = oJsonMessage.InReplyTo;
				this.sReferences = oJsonMessage.References;

				this.proxy = !!oJsonMessage.ExternalProxy;

				if (__webpack_require__(/*! Stores/User/Pgp */ 20).capaOpenPGP())
				{
					this.isPgpSigned(!!oJsonMessage.PgpSigned);
					this.isPgpEncrypted(!!oJsonMessage.PgpEncrypted);
				}

				this.hasAttachments(!!oJsonMessage.HasAttachments);
				this.attachmentsMainType(oJsonMessage.AttachmentsMainType);

				this.foundedCIDs = Utils.isArray(oJsonMessage.FoundedCIDs) ? oJsonMessage.FoundedCIDs : [];
				this.attachments(this.initAttachmentsFromJson(oJsonMessage.Attachments));

				this.readReceipt(oJsonMessage.ReadReceipt || '');

				this.computeSenderEmail();

				bResult = true;
			}

			return bResult;
		};

		/**
		 * @param {(AjaxJsonAttachment|null)} oJsonAttachments
		 * @return {Array}
		 */
		MessageModel.prototype.initAttachmentsFromJson = function (oJsonAttachments)
		{
			var
				iIndex = 0,
				iLen = 0,
				oAttachmentModel = null,
				aResult = []
			;

			if (oJsonAttachments && 'Collection/AttachmentCollection' === oJsonAttachments['@Object'] &&
				Utils.isNonEmptyArray(oJsonAttachments['@Collection']))
			{
				for (iIndex = 0, iLen = oJsonAttachments['@Collection'].length; iIndex < iLen; iIndex++)
				{
					oAttachmentModel = AttachmentModel.newInstanceFromJson(oJsonAttachments['@Collection'][iIndex]);
					if (oAttachmentModel)
					{
						if ('' !== oAttachmentModel.cidWithOutTags && 0 < this.foundedCIDs.length &&
							0 <= Utils.inArray(oAttachmentModel.cidWithOutTags, this.foundedCIDs))
						{
							oAttachmentModel.isLinked = true;
						}

						aResult.push(oAttachmentModel);
					}
				}
			}

			return aResult;
		};

		/**
		 * @param {AjaxJsonMessage} oJsonMessage
		 * @return {boolean}
		 */
		MessageModel.prototype.initFlagsByJson = function (oJsonMessage)
		{
			var bResult = false;

			if (oJsonMessage && 'Object/Message' === oJsonMessage['@Object'])
			{
				this.unseen(!oJsonMessage.IsSeen);
				this.flagged(!!oJsonMessage.IsFlagged);
				this.answered(!!oJsonMessage.IsAnswered);
				this.forwarded(!!oJsonMessage.IsForwarded);
				this.isReadReceipt(!!oJsonMessage.IsReadReceipt);

				bResult = true;
			}

			return bResult;
		};

		/**
		 * @param {boolean} bFriendlyView
		 * @param {boolean=} bWrapWithLink = false
		 * @return {string}
		 */
		MessageModel.prototype.fromToLine = function (bFriendlyView, bWrapWithLink)
		{
			return MessageModel.emailsToLine(this.from, bFriendlyView, bWrapWithLink);
		};

		/**
		 * @return {string}
		 */
		MessageModel.prototype.fromDkimData = function ()
		{
			var aResult = ['none', ''];
			if (Utils.isNonEmptyArray(this.from) && 1 === this.from.length &&
				this.from[0] && this.from[0].dkimStatus)
			{
				aResult = [this.from[0].dkimStatus, this.from[0].dkimValue || ''];
			}

			return aResult;
		};

		/**
		 * @param {boolean} bFriendlyView
		 * @param {boolean=} bWrapWithLink = false
		 * @return {string}
		 */
		MessageModel.prototype.toToLine = function (bFriendlyView, bWrapWithLink)
		{
			return MessageModel.emailsToLine(this.to, bFriendlyView, bWrapWithLink);
		};

		/**
		 * @param {boolean} bFriendlyView
		 * @param {boolean=} bWrapWithLink = false
		 * @return {string}
		 */
		MessageModel.prototype.ccToLine = function (bFriendlyView, bWrapWithLink)
		{
			return MessageModel.emailsToLine(this.cc, bFriendlyView, bWrapWithLink);
		};

		/**
		 * @param {boolean} bFriendlyView
		 * @param {boolean=} bWrapWithLink = false
		 * @return {string}
		 */
		MessageModel.prototype.bccToLine = function (bFriendlyView, bWrapWithLink)
		{
			return MessageModel.emailsToLine(this.bcc, bFriendlyView, bWrapWithLink);
		};

		/**
		 * @return string
		 */
		MessageModel.prototype.lineAsCcc = function ()
		{
			var aResult = [];
			if (this.deleted())
			{
				aResult.push('deleted');
			}
			if (this.selected())
			{
				aResult.push('selected');
			}
			if (this.checked())
			{
				aResult.push('checked');
			}
			if (this.flagged())
			{
				aResult.push('flagged');
			}
			if (this.unseen())
			{
				aResult.push('unseen');
			}
			if (this.answered())
			{
				aResult.push('answered');
			}
			if (this.forwarded())
			{
				aResult.push('forwarded');
			}
			if (this.focused())
			{
				aResult.push('focused');
			}
			if (this.isImportant())
			{
				aResult.push('important');
			}
			if (this.hasAttachments())
			{
				aResult.push('withAttachments');
				switch (this.attachmentsMainType())
				{
					case 'image':
						aResult.push('imageOnlyAttachments');
						break;
					case 'archive':
						aResult.push('archiveOnlyAttachments');
						break;
				}
			}
			if (this.newForAnimation())
			{
				aResult.push('new');
			}
			if ('' === this.subject())
			{
				aResult.push('emptySubject');
			}
			if (0 < this.parentUid())
			{
				aResult.push('hasParentMessage');
			}
			if (0 < this.threadsLen() && 0 === this.parentUid())
			{
				aResult.push('hasChildrenMessage');
			}
			if (this.hasUnseenSubMessage())
			{
				aResult.push('hasUnseenSubMessage');
			}
			if (this.hasFlaggedSubMessage())
			{
				aResult.push('hasFlaggedSubMessage');
			}

			return aResult.join(' ');
		};

		/**
		 * @return {boolean}
		 */
		MessageModel.prototype.hasVisibleAttachments = function ()
		{
			return !!_.find(this.attachments(), function (oAttachment) {
				return !oAttachment.isLinked;
			});
		};

		/**
		 * @param {string} sCid
		 * @return {*}
		 */
		MessageModel.prototype.findAttachmentByCid = function (sCid)
		{
			var
				oResult = null,
				aAttachments = this.attachments()
			;

			if (Utils.isNonEmptyArray(aAttachments))
			{
				sCid = sCid.replace(/^<+/, '').replace(/>+$/, '');
				oResult = _.find(aAttachments, function (oAttachment) {
					return sCid === oAttachment.cidWithOutTags;
				});
			}

			return oResult || null;
		};

		/**
		 * @param {string} sContentLocation
		 * @return {*}
		 */
		MessageModel.prototype.findAttachmentByContentLocation = function (sContentLocation)
		{
			var
				oResult = null,
				aAttachments = this.attachments()
			;

			if (Utils.isNonEmptyArray(aAttachments))
			{
				oResult = _.find(aAttachments, function (oAttachment) {
					return sContentLocation === oAttachment.contentLocation;
				});
			}

			return oResult || null;
		};


		/**
		 * @return {string}
		 */
		MessageModel.prototype.messageId = function ()
		{
			return this.sMessageId;
		};

		/**
		 * @return {string}
		 */
		MessageModel.prototype.inReplyTo = function ()
		{
			return this.sInReplyTo;
		};

		/**
		 * @return {string}
		 */
		MessageModel.prototype.references = function ()
		{
			return this.sReferences;
		};

		/**
		 * @return {string}
		 */
		MessageModel.prototype.fromAsSingleEmail = function ()
		{
			return Utils.isArray(this.from) && this.from[0] ? this.from[0].email : '';
		};

		/**
		 * @return {string}
		 */
		MessageModel.prototype.viewLink = function ()
		{
			return Links.messageViewLink(this.requestHash);
		};

		/**
		 * @return {string}
		 */
		MessageModel.prototype.downloadLink = function ()
		{
			return Links.messageDownloadLink(this.requestHash);
		};

		/**
		 * @param {Object} oExcludeEmails
		 * @return {Array}
		 */
		MessageModel.prototype.replyEmails = function (oExcludeEmails)
		{
			var
				aResult = [],
				oUnic = Utils.isUnd(oExcludeEmails) ? {} : oExcludeEmails
			;

			MessageModel.replyHelper(this.replyTo, oUnic, aResult);
			if (0 === aResult.length)
			{
				MessageModel.replyHelper(this.from, oUnic, aResult);
			}

			return aResult;
		};

		/**
		 * @param {Object} oExcludeEmails
		 * @return {Array.<Array>}
		 */
		MessageModel.prototype.replyAllEmails = function (oExcludeEmails)
		{
			var
				aToResult = [],
				aCcResult = [],
				oUnic = Utils.isUnd(oExcludeEmails) ? {} : oExcludeEmails
			;

			MessageModel.replyHelper(this.replyTo, oUnic, aToResult);
			if (0 === aToResult.length)
			{
				MessageModel.replyHelper(this.from, oUnic, aToResult);
			}

			MessageModel.replyHelper(this.to, oUnic, aToResult);
			MessageModel.replyHelper(this.cc, oUnic, aCcResult);

			return [aToResult, aCcResult];
		};

		/**
		 * @return {string}
		 */
		MessageModel.prototype.textBodyToString = function ()
		{
			return this.body ? this.body.html() : '';
		};

		/**
		 * @return {string}
		 */
		MessageModel.prototype.attachmentsToStringLine = function ()
		{
			var aAttachLines = _.map(this.attachments(), function (oItem) {
				return oItem.fileName + ' (' + oItem.friendlySize + ')';
			});

			return aAttachLines && 0 < aAttachLines.length ? aAttachLines.join(', ') : '';
		};

		/**
		 * @return {Object}
		 */
		MessageModel.prototype.getDataForWindowPopup = function ()
		{
			return {
				'popupFrom': this.fromToLine(false),
				'popupTo': this.toToLine(false),
				'popupCc': this.ccToLine(false),
				'popupBcc': this.bccToLine(false),
				'popupSubject': this.subject(),
				'popupIsHtml': this.isHtml(),
				'popupDate': this.fullFormatDateValue(),
				'popupAttachments': this.attachmentsToStringLine(),
				'popupBody': this.textBodyToString()
			};
		};

		/**
		 * @param {boolean=} bPrint = false
		 */
		MessageModel.prototype.viewPopupMessage = function (bPrint)
		{
			Utils.windowPopupKnockout(this.getDataForWindowPopup(), 'PopupsWindowSimpleMessage',
				this.subject(), function (oPopupWin)
			{
				if (oPopupWin && oPopupWin.document && oPopupWin.document.body)
				{
					$('img.lazy', oPopupWin.document.body).each(function (iIndex, oImg) {

						var
							$oImg = $(oImg),
							sOrig = $oImg.data('original'),
							sSrc = $oImg.attr('src')
							;

						if (0 <= iIndex && sOrig && !sSrc)
						{
							$oImg.attr('src', sOrig);
						}
					});

					if (bPrint)
					{
						window.setTimeout(function () {
							oPopupWin.print();
						}, 100);
					}
				}
			});
		};

		MessageModel.prototype.printMessage = function ()
		{
			this.viewPopupMessage(true);
		};

		/**
		 * @returns {string}
		 */
		MessageModel.prototype.generateUid = function ()
		{
			return this.folderFullNameRaw + '/' + this.uid;
		};

		/**
		 * @param {MessageModel} oMessage
		 * @return {MessageModel}
		 */
		MessageModel.prototype.populateByMessageListItem = function (oMessage)
		{
			this.folderFullNameRaw = oMessage.folderFullNameRaw;
			this.uid = oMessage.uid;
			this.hash = oMessage.hash;
			this.requestHash = oMessage.requestHash;
			this.subject(oMessage.subject());
			this.subjectPrefix(this.subjectPrefix());
			this.subjectSuffix(this.subjectSuffix());

			this.size(oMessage.size());
			this.dateTimeStampInUTC(oMessage.dateTimeStampInUTC());
			this.priority(oMessage.priority());

			this.proxy = oMessage.proxy;

			this.fromEmailString(oMessage.fromEmailString());
			this.fromClearEmailString(oMessage.fromClearEmailString());
			this.toEmailsString(oMessage.toEmailsString());
			this.toClearEmailsString(oMessage.toClearEmailsString());

			this.emails = oMessage.emails;

			this.from = oMessage.from;
			this.to = oMessage.to;
			this.cc = oMessage.cc;
			this.bcc = oMessage.bcc;
			this.replyTo = oMessage.replyTo;
			this.deliveredTo = oMessage.deliveredTo;

			this.unseen(oMessage.unseen());
			this.flagged(oMessage.flagged());
			this.answered(oMessage.answered());
			this.forwarded(oMessage.forwarded());
			this.isReadReceipt(oMessage.isReadReceipt());

			this.priority(oMessage.priority());

			this.selected(oMessage.selected());
			this.checked(oMessage.checked());
			this.hasAttachments(oMessage.hasAttachments());
			this.attachmentsMainType(oMessage.attachmentsMainType());

			this.moment(oMessage.moment());

			this.body = null;

			this.aDraftInfo = [];
			this.sMessageId = '';
			this.sInReplyTo = '';
			this.sReferences = '';

			this.parentUid(oMessage.parentUid());
			this.threads(oMessage.threads());
			this.threadsLen(oMessage.threadsLen());

			this.computeSenderEmail();

			return this;
		};

		MessageModel.prototype.showExternalImages = function (bLazy)
		{
			if (this.body && this.body.data('rl-has-images'))
			{
				var sAttr = '';
				bLazy = Utils.isUnd(bLazy) ? false : bLazy;

				this.hasImages(false);
				this.body.data('rl-has-images', false);

				sAttr = this.proxy ? 'data-x-additional-src' : 'data-x-src';
				$('[' + sAttr + ']', this.body).each(function () {
					if (bLazy && $(this).is('img'))
					{
						$(this)
							.addClass('lazy')
							.attr('data-original', $(this).attr(sAttr))
							.removeAttr(sAttr)
							;
					}
					else
					{
						$(this).attr('src', $(this).attr(sAttr)).removeAttr(sAttr);
					}
				});

				sAttr = this.proxy ? 'data-x-additional-style-url' : 'data-x-style-url';
				$('[' + sAttr + ']', this.body).each(function () {
					var sStyle = Utils.trim($(this).attr('style'));
					sStyle = '' === sStyle ? '' : (';' === sStyle.substr(-1) ? sStyle + ' ' : sStyle + '; ');
					$(this).attr('style', sStyle + $(this).attr(sAttr)).removeAttr(sAttr);
				});

				if (bLazy)
				{
					$('img.lazy', this.body).addClass('lazy-inited').lazyload({
						'threshold': 400,
						'effect': 'fadeIn',
						'skip_invisible': false,
						'container': $('.RL-MailMessageView .messageView .messageItem .content')[0]
					});

					Globals.$win.resize();
				}

				Utils.windowResize(500);
			}
		};

		MessageModel.prototype.showInternalImages = function (bLazy)
		{
			if (this.body && !this.body.data('rl-init-internal-images'))
			{
				this.body.data('rl-init-internal-images', true);

				bLazy = Utils.isUnd(bLazy) ? false : bLazy;

				var self = this;

				$('[data-x-src-cid]', this.body).each(function () {

					var oAttachment = self.findAttachmentByCid($(this).attr('data-x-src-cid'));
					if (oAttachment && oAttachment.download)
					{
						if (bLazy && $(this).is('img'))
						{
							$(this)
								.addClass('lazy')
								.attr('data-original', oAttachment.linkPreview());
						}
						else
						{
							$(this).attr('src', oAttachment.linkPreview());
						}
					}
				});

				$('[data-x-src-location]', this.body).each(function () {

					var oAttachment = self.findAttachmentByContentLocation($(this).attr('data-x-src-location'));
					if (!oAttachment)
					{
						oAttachment = self.findAttachmentByCid($(this).attr('data-x-src-location'));
					}

					if (oAttachment && oAttachment.download)
					{
						if (bLazy && $(this).is('img'))
						{
							$(this)
								.addClass('lazy')
								.attr('data-original', oAttachment.linkPreview());
						}
						else
						{
							$(this).attr('src', oAttachment.linkPreview());
						}
					}
				});

				$('[data-x-style-cid]', this.body).each(function () {

					var
						sStyle = '',
						sName = '',
						oAttachment = self.findAttachmentByCid($(this).attr('data-x-style-cid'))
					;

					if (oAttachment && oAttachment.linkPreview)
					{
						sName = $(this).attr('data-x-style-cid-name');
						if ('' !== sName)
						{
							sStyle = Utils.trim($(this).attr('style'));
							sStyle = '' === sStyle ? '' : (';' === sStyle.substr(-1) ? sStyle + ' ' : sStyle + '; ');
							$(this).attr('style', sStyle + sName + ': url(\'' + oAttachment.linkPreview() + '\')');
						}
					}
				});

				if (bLazy)
				{
					(function ($oImg, oContainer) {
						_.delay(function () {
							$oImg.addClass('lazy-inited').lazyload({
								'threshold': 400,
								'effect': 'fadeIn',
								'skip_invisible': false,
								'container': oContainer
							});
						}, 300);
					}($('img.lazy', self.body), $('.RL-MailMessageView .messageView .messageItem .content')[0]));
				}

				Utils.windowResize(500);
			}
		};

		MessageModel.prototype.storeDataToDom = function ()
		{
			if (this.body)
			{
				this.body.data('rl-is-html', !!this.isHtml());
				this.body.data('rl-has-images', !!this.hasImages());

				this.body.data('rl-plain-raw', this.plainRaw);

				if (__webpack_require__(/*! Stores/User/Pgp */ 20).capaOpenPGP())
				{
					this.body.data('rl-plain-pgp-signed', !!this.isPgpSigned());
					this.body.data('rl-plain-pgp-encrypted', !!this.isPgpEncrypted());
					this.body.data('rl-pgp-verify-status', this.pgpSignedVerifyStatus());
					this.body.data('rl-pgp-verify-user', this.pgpSignedVerifyUser());
				}
			}
		};

		MessageModel.prototype.storePgpVerifyDataToDom = function ()
		{
			if (this.body && __webpack_require__(/*! Stores/User/Pgp */ 20).capaOpenPGP())
			{
				this.body.data('rl-pgp-verify-status', this.pgpSignedVerifyStatus());
				this.body.data('rl-pgp-verify-user', this.pgpSignedVerifyUser());
			}
		};

		MessageModel.prototype.fetchDataToDom = function ()
		{
			if (this.body)
			{
				this.isHtml(!!this.body.data('rl-is-html'));
				this.hasImages(!!this.body.data('rl-has-images'));

				this.plainRaw = Utils.pString(this.body.data('rl-plain-raw'));

				if (__webpack_require__(/*! Stores/User/Pgp */ 20).capaOpenPGP())
				{
					this.isPgpSigned(!!this.body.data('rl-plain-pgp-signed'));
					this.isPgpEncrypted(!!this.body.data('rl-plain-pgp-encrypted'));
					this.pgpSignedVerifyStatus(this.body.data('rl-pgp-verify-status'));
					this.pgpSignedVerifyUser(this.body.data('rl-pgp-verify-user'));
				}
				else
				{
					this.isPgpSigned(false);
					this.isPgpEncrypted(false);
					this.pgpSignedVerifyStatus(Enums.SignedVerifyStatus.None);
					this.pgpSignedVerifyUser('');
				}
			}
		};

		MessageModel.prototype.verifyPgpSignedClearMessage = function ()
		{
			if (this.isPgpSigned())
			{
				var
					aRes = [],
					mPgpMessage = null,
					Data = __webpack_require__(/*! Storage/User/Data */ 15),
					sFrom = this.from && this.from[0] && this.from[0].email ? this.from[0].email : '',
					aPublicKeys = Data.findPublicKeysByEmail(sFrom),
					oValidKey = null,
					oValidSysKey = null,
					sPlain = ''
				;

				this.pgpSignedVerifyStatus(Enums.SignedVerifyStatus.Error);
				this.pgpSignedVerifyUser('');

				try
				{
					mPgpMessage = PgpStore.openpgp.cleartext.readArmored(this.plainRaw);
					if (mPgpMessage && mPgpMessage.getText)
					{
						this.pgpSignedVerifyStatus(
							aPublicKeys.length ? Enums.SignedVerifyStatus.Unverified : Enums.SignedVerifyStatus.UnknownPublicKeys);

						aRes = mPgpMessage.verify(aPublicKeys);
						if (aRes && 0 < aRes.length)
						{
							oValidKey = _.find(aRes, function (oItem) {
								return oItem && oItem.keyid && oItem.valid;
							});

							if (oValidKey)
							{
								oValidSysKey = Data.findPublicKeyByHex(oValidKey.keyid.toHex());
								if (oValidSysKey)
								{
									sPlain = mPgpMessage.getText();

									this.pgpSignedVerifyStatus(Enums.SignedVerifyStatus.Success);
									this.pgpSignedVerifyUser(oValidSysKey.user);

									sPlain =
										Globals.$div.empty().append(
										$('<pre class="b-plain-openpgp signed verified"></pre>').text(sPlain)
										).html()
										;

									Globals.$div.empty();

									this.replacePlaneTextBody(sPlain);
								}
							}
						}
					}
				}
				catch (oExc) {}

				this.storePgpVerifyDataToDom();
			}
		};

		MessageModel.prototype.decryptPgpEncryptedMessage = function (sPassword)
		{
			if (this.isPgpEncrypted())
			{
				var
					aRes = [],
					mPgpMessage = null,
					mPgpMessageDecrypted = null,
					Data = __webpack_require__(/*! Storage/User/Data */ 15),
					sFrom = this.from && this.from[0] && this.from[0].email ? this.from[0].email : '',
					aPublicKey = Data.findPublicKeysByEmail(sFrom),
					oPrivateKey = Data.findSelfPrivateKey(sPassword),
					oValidKey = null,
					oValidSysKey = null,
					sPlain = ''
				;

				this.pgpSignedVerifyStatus(Enums.SignedVerifyStatus.Error);
				this.pgpSignedVerifyUser('');

				if (!oPrivateKey)
				{
					this.pgpSignedVerifyStatus(Enums.SignedVerifyStatus.UnknownPrivateKey);
				}

				try
				{
					mPgpMessage = PgpStore.openpgp.message.readArmored(this.plainRaw);
					if (mPgpMessage && oPrivateKey && mPgpMessage.decrypt)
					{
						this.pgpSignedVerifyStatus(Enums.SignedVerifyStatus.Unverified);

						mPgpMessageDecrypted = mPgpMessage.decrypt(oPrivateKey);
						if (mPgpMessageDecrypted)
						{
							aRes = mPgpMessageDecrypted.verify(aPublicKey);
							if (aRes && 0 < aRes.length)
							{
								oValidKey = _.find(aRes, function (oItem) {
									return oItem && oItem.keyid && oItem.valid;
								});

								if (oValidKey)
								{
									oValidSysKey = Data.findPublicKeyByHex(oValidKey.keyid.toHex());
									if (oValidSysKey)
									{
										this.pgpSignedVerifyStatus(Enums.SignedVerifyStatus.Success);
										this.pgpSignedVerifyUser(oValidSysKey.user);
									}
								}
							}

							sPlain = mPgpMessageDecrypted.getText();

							sPlain =
								Globals.$div.empty().append(
								$('<pre class="b-plain-openpgp signed verified"></pre>').text(sPlain)
								).html()
								;

							Globals.$div.empty();

							this.replacePlaneTextBody(sPlain);
						}
					}
				}
				catch (oExc) {}

				this.storePgpVerifyDataToDom();
			}
		};

		MessageModel.prototype.replacePlaneTextBody = function (sPlain)
		{
			if (this.body)
			{
				this.body.html(sPlain).addClass('b-text-part plain');
			}
		};

		/**
		 * @return {string}
		 */
		MessageModel.prototype.flagHash = function ()
		{
			return [this.deleted(), this.unseen(), this.flagged(), this.answered(), this.forwarded(),
				this.isReadReceipt()].join('');
		};

		module.exports = MessageModel;

	}());

/***/ },
/* 82 */,
/* 83 */
/*!***********************************!*\
  !*** ./dev/Stores/User/Filter.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3)
		;

		/**
		 * @constructor
		 */
		function FilterUserStore()
		{
			this.capa = ko.observable('');
			this.modules = ko.observable({});

			this.filters = ko.observableArray([]);

			this.filters.loading = ko.observable(false).extend({'throttle': 200});
			this.filters.saving = ko.observable(false).extend({'throttle': 200});

			this.raw = ko.observable('');
		}

		module.exports = new FilterUserStore();

	}());


/***/ },
/* 84 */
/*!**********************************!*\
  !*** ./dev/Stores/User/Quota.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			ko = __webpack_require__(/*! ko */ 3)
		;

		/**
		 * @constructor
		 */
		function QuotaUserStore()
		{
			this.quota = ko.observable(0);
			this.usage = ko.observable(0);

			this.percentage = ko.computed(function () {

				var
					iQuota = this.quota(),
					iUsed = this.usage()
				;

				return 0 < iQuota ? window.Math.ceil((iUsed / iQuota) * 100) : 0;

			}, this);
		}

		/**
		 * @param {number} iQuota
		 * @param {number} iUsage
		 */
		QuotaUserStore.prototype.populateData = function(iQuota, iUsage)
		{
			this.quota(iQuota * 1024);
			this.usage(iUsage * 1024);
		};

		module.exports = new QuotaUserStore();

	}());


/***/ },
/* 85 */,
/* 86 */,
/* 87 */
/*!**********************************!*\
  !*** ./dev/View/Popup/Filter.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			Data = __webpack_require__(/*! Storage/User/Data */ 15),

			FilterStore = __webpack_require__(/*! Stores/User/Filter */ 83),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function FilterPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsFilter');

			this.isNew = ko.observable(true);

			this.modules = FilterStore.modules;

			this.fTrueCallback = null;
			this.filter = ko.observable(null);

			this.allowMarkAsRead = ko.observable(false);

			this.defautOptionsAfterRender = Utils.defautOptionsAfterRender;
			this.folderSelectList = Data.folderMenuForFilters;
			this.selectedFolderValue = ko.observable('');

			this.selectedFolderValue.subscribe(function() {
				if (this.filter())
				{
					this.filter().actionValue.error(false);
				}
			}, this);

			this.saveFilter = Utils.createCommand(this, function () {

				if (this.filter())
				{
					if (Enums.FiltersAction.MoveTo === this.filter().actionType())
					{
						this.filter().actionValue(this.selectedFolderValue());
					}

					if (!this.filter().verify())
					{
						return false;
					}

					if (this.fTrueCallback)
					{
						this.fTrueCallback(this.filter());
					}

					if (this.modalVisibility())
					{
						Utils.delegateRun(this, 'closeCommand');
					}
				}

				return true;
			});

			this.actionTypeOptions = ko.observableArray([]);
			this.fieldOptions = ko.observableArray([]);
			this.typeOptions = ko.observableArray([]);

			Translator.initOnStartOrLangChange(this.populateOptions, this);

			this.modules.subscribe(this.populateOptions, this);

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/Filter', 'PopupsFilterViewModel'], FilterPopupView);
		_.extend(FilterPopupView.prototype, AbstractView.prototype);

		FilterPopupView.prototype.populateOptions = function ()
		{
			this.actionTypeOptions([]);

	//		this.actionTypeOptions.push({'id': Enums.FiltersAction.None,
	//			'name': Translator.i18n('POPUPS_FILTER/SELECT_ACTION_NONE')});

			var oModules = this.modules();
			if (oModules)
			{
				if (oModules.markasread)
				{
					this.allowMarkAsRead(true);
				}

				if (oModules.moveto)
				{
					this.actionTypeOptions.push({'id': Enums.FiltersAction.MoveTo,
						'name': Translator.i18n('POPUPS_FILTER/SELECT_ACTION_MOVE_TO')});
				}

				if (oModules.redirect)
				{
					this.actionTypeOptions.push({'id': Enums.FiltersAction.Forward,
						'name': Translator.i18n('POPUPS_FILTER/SELECT_ACTION_FORWARD_TO')});
				}

				if (oModules.reject)
				{
					this.actionTypeOptions.push({'id': Enums.FiltersAction.Reject,
						'name': Translator.i18n('POPUPS_FILTER/SELECT_ACTION_REJECT')});
				}

				if (oModules.vacation)
				{
					this.actionTypeOptions.push({'id': Enums.FiltersAction.Vacation,
						'name': Translator.i18n('POPUPS_FILTER/SELECT_ACTION_VACATION_MESSAGE')});

				}
			}

			this.actionTypeOptions.push({'id': Enums.FiltersAction.Discard,
				'name': Translator.i18n('POPUPS_FILTER/SELECT_ACTION_DISCARD')});

			this.fieldOptions([
				{'id': Enums.FilterConditionField.From, 'name': Translator.i18n('POPUPS_FILTER/SELECT_FIELD_FROM')},
				{'id': Enums.FilterConditionField.Recipient, 'name': Translator.i18n('POPUPS_FILTER/SELECT_FIELD_RECIPIENTS')},
				{'id': Enums.FilterConditionField.Subject, 'name': Translator.i18n('POPUPS_FILTER/SELECT_FIELD_SUBJECT')}
			]);

			this.typeOptions([
				{'id': Enums.FilterConditionType.Contains, 'name': Translator.i18n('POPUPS_FILTER/SELECT_TYPE_CONTAINS')},
				{'id': Enums.FilterConditionType.NotContains, 'name': Translator.i18n('POPUPS_FILTER/SELECT_TYPE_NOT_CONTAINS')},
				{'id': Enums.FilterConditionType.EqualTo, 'name': Translator.i18n('POPUPS_FILTER/SELECT_TYPE_EQUAL_TO')},
				{'id': Enums.FilterConditionType.NotEqualTo, 'name': Translator.i18n('POPUPS_FILTER/SELECT_TYPE_NOT_EQUAL_TO')}
			]);
		};


		FilterPopupView.prototype.removeCondition = function (oConditionToDelete)
		{
			if (this.filter())
			{
				this.filter().removeCondition(oConditionToDelete);
			}
		};

		FilterPopupView.prototype.clearPopup = function ()
		{
			this.isNew(true);

			this.fTrueCallback = null;
			this.filter(null);
		};

		FilterPopupView.prototype.onShow = function (oFilter, fTrueCallback, bEdit)
		{
			this.clearPopup();

			this.fTrueCallback = fTrueCallback;
			this.filter(oFilter);

			if (oFilter)
			{
				this.selectedFolderValue(oFilter.actionValue());
			}

			this.isNew(!bEdit);

			if (!bEdit && oFilter)
			{
				oFilter.name.focused(true);
			}
		};

		FilterPopupView.prototype.onFocus = function ()
		{
			if (this.isNew() &&  this.filter())
			{
				this.filter().name.focused(true);
			}
		};

		module.exports = FilterPopupView;

	}());

/***/ },
/* 88 */
/*!****************************************!*\
  !*** ./dev/View/Popup/FolderCreate.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			Data = __webpack_require__(/*! Storage/User/Data */ 15),
			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function FolderCreateView()
		{
			AbstractView.call(this, 'Popups', 'PopupsFolderCreate');

			Translator.initOnStartOrLangChange(function () {
				this.sNoParentText = Translator.i18n('POPUPS_CREATE_FOLDER/SELECT_NO_PARENT');
			}, this);

			this.folderName = ko.observable('');
			this.folderName.focused = ko.observable(false);

			this.selectedParentValue = ko.observable(Consts.Values.UnuseOptionValue);

			this.parentFolderSelectList = ko.computed(function () {

				var
					aTop = [],
					fDisableCallback = null,
					fVisibleCallback = null,
					aList = Data.folderList(),
					fRenameCallback = function (oItem) {
						return oItem ? (oItem.isSystemFolder() ? oItem.name() + ' ' + oItem.manageFolderSystemName() : oItem.name()) : '';
					}
				;

				aTop.push(['', this.sNoParentText]);

				if ('' !== Data.namespace)
				{
					fDisableCallback = function (oItem)
					{
						return Data.namespace !== oItem.fullNameRaw.substr(0, Data.namespace.length);
					};
				}

				return Utils.folderListOptionsBuilder([], aList, [], aTop, null, fDisableCallback, fVisibleCallback, fRenameCallback);

			}, this);

			// commands
			this.createFolder = Utils.createCommand(this, function () {

				var
					sParentFolderName = this.selectedParentValue()
				;

				if ('' === sParentFolderName && 1 < Data.namespace.length)
				{
					sParentFolderName = Data.namespace.substr(0, Data.namespace.length - 1);
				}

				Data.foldersCreating(true);
				Remote.folderCreate(function (sResult, oData) {

					Data.foldersCreating(false);
					if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
					{
						__webpack_require__(/*! App/User */ 6).folders();
					}
					else
					{
						Data.folderList.error(
							oData && oData.ErrorCode ? Translator.getNotification(oData.ErrorCode) : Translator.i18n('NOTIFICATIONS/CANT_CREATE_FOLDER'));
					}

				},	this.folderName(), sParentFolderName);

				this.cancelCommand();

			}, function () {
				return this.simpleFolderNameValidation(this.folderName());
			});

			this.defautOptionsAfterRender = Utils.defautOptionsAfterRender;

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/FolderCreate', 'PopupsFolderCreateViewModel'], FolderCreateView);
		_.extend(FolderCreateView.prototype, AbstractView.prototype);

		FolderCreateView.prototype.sNoParentText = '';

		FolderCreateView.prototype.simpleFolderNameValidation = function (sName)
		{
			return (/^[^\\\/]+$/g).test(Utils.trim(sName));
		};

		FolderCreateView.prototype.clearPopup = function ()
		{
			this.folderName('');
			this.selectedParentValue('');
			this.folderName.focused(false);
		};

		FolderCreateView.prototype.onShow = function ()
		{
			this.clearPopup();
		};

		FolderCreateView.prototype.onFocus = function ()
		{
			this.folderName.focused(true);
		};

		module.exports = FolderCreateView;

	}());

/***/ },
/* 89 */
/*!************************************!*\
  !*** ./dev/View/Popup/Identity.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),
			AccountStore = __webpack_require__(/*! Stores/User/Account */ 22),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function IdentityPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsIdentity');

			this.id = '';
			this.edit = ko.observable(false);
			this.owner = ko.observable(false);

			this.email = ko.observable('').validateEmail();
			this.email.focused = ko.observable(false);
			this.name = ko.observable('');
			this.name.focused = ko.observable(false);
			this.replyTo = ko.observable('').validateSimpleEmail();
			this.replyTo.focused = ko.observable(false);
			this.bcc = ko.observable('').validateSimpleEmail();
			this.bcc.focused = ko.observable(false);

		//	this.email.subscribe(function () {
		//		this.email.hasError(false);
		//	}, this);

			this.submitRequest = ko.observable(false);
			this.submitError = ko.observable('');

			this.addOrEditIdentityCommand = Utils.createCommand(this, function () {

				if (!this.email.hasError())
				{
					this.email.hasError('' === Utils.trim(this.email()));
				}

				if (this.email.hasError())
				{
					if (!this.owner())
					{
						this.email.focused(true);
					}

					return false;
				}

				if (this.replyTo.hasError())
				{
					this.replyTo.focused(true);
					return false;
				}

				if (this.bcc.hasError())
				{
					this.bcc.focused(true);
					return false;
				}

				this.submitRequest(true);

				Remote.identityUpdate(_.bind(function (sResult, oData) {

					this.submitRequest(false);
					if (Enums.StorageResultType.Success === sResult && oData)
					{
						if (oData.Result)
						{
							__webpack_require__(/*! App/User */ 6).accountsAndIdentities();
							this.cancelCommand();
						}
						else if (oData.ErrorCode)
						{
							this.submitError(Translator.getNotification(oData.ErrorCode));
						}
					}
					else
					{
						this.submitError(Translator.getNotification(Enums.Notification.UnknownError));
					}

				}, this), this.id, this.email(), this.name(), this.replyTo(), this.bcc());

				return true;

			}, function () {
				return !this.submitRequest();
			});

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/Identity', 'PopupsIdentityViewModel'], IdentityPopupView);
		_.extend(IdentityPopupView.prototype, AbstractView.prototype);

		IdentityPopupView.prototype.clearPopup = function ()
		{
			this.id = '';
			this.edit(false);
			this.owner(false);

			this.name('');
			this.email('');
			this.replyTo('');
			this.bcc('');

			this.email.hasError(false);
			this.replyTo.hasError(false);
			this.bcc.hasError(false);

			this.submitRequest(false);
			this.submitError('');
		};

		/**
		 * @param {?IdentityModel} oIdentity
		 */
		IdentityPopupView.prototype.onShow = function (oIdentity)
		{
			this.clearPopup();

			if (oIdentity)
			{
				this.edit(true);

				this.id = oIdentity.id;
				this.name(oIdentity.name());
				this.email(oIdentity.email());
				this.replyTo(oIdentity.replyTo());
				this.bcc(oIdentity.bcc());

				this.owner(this.id === AccountStore.email());
			}
		};

		IdentityPopupView.prototype.onFocus = function ()
		{
			if (!this.owner())
			{
				this.email.focused(true);
			}
		};

		module.exports = IdentityPopupView;

	}());

/***/ },
/* 90 */
/*!*************************************************!*\
  !*** ./dev/View/Popup/KeyboardShortcutsHelp.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			key = __webpack_require__(/*! key */ 21),

			Enums = __webpack_require__(/*! Common/Enums */ 4),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function KeyboardShortcutsHelpPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsKeyboardShortcutsHelp');

			this.sDefaultKeyScope = Enums.KeyState.PopupKeyboardShortcutsHelp;

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/KeyboardShortcutsHelp', 'PopupsKeyboardShortcutsHelpViewModel'], KeyboardShortcutsHelpPopupView);
		_.extend(KeyboardShortcutsHelpPopupView.prototype, AbstractView.prototype);

		KeyboardShortcutsHelpPopupView.prototype.onBuild = function (oDom)
		{
			key('tab, shift+tab, left, right', Enums.KeyState.PopupKeyboardShortcutsHelp, _.throttle(_.bind(function (event, handler) {
				if (event && handler)
				{
					var
						$tabs = oDom.find('.nav.nav-tabs > li'),
						bNext = handler && ('tab' === handler.shortcut || 'right' === handler.shortcut),
						iIndex = $tabs.index($tabs.filter('.active'))
					;

					if (!bNext && iIndex > 0)
					{
						iIndex--;
					}
					else if (bNext && iIndex < $tabs.length - 1)
					{
						iIndex++;
					}
					else
					{
						iIndex = bNext ? 0 : $tabs.length - 1;
					}

					$tabs.eq(iIndex).find('a[data-toggle="tab"]').tab('show');
					return false;
				}
			}, this), 100));
		};

		module.exports = KeyboardShortcutsHelpPopupView;

	}());

/***/ },
/* 91 */
/*!*************************************************!*\
  !*** ./dev/View/User/AbstractSystemDropDown.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),
			key = __webpack_require__(/*! key */ 21),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 12),

			AccountStore = __webpack_require__(/*! Stores/User/Account */ 22),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),

			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function AbstractSystemDropDownUserView()
		{
			AbstractView.call(this, 'Right', 'SystemDropDown');

			this.accountEmail = AccountStore.email;

			this.accounts = AccountStore.accounts;
			this.accountsUnreadCount = AccountStore.accountsUnreadCount;

			this.accountMenuDropdownTrigger = ko.observable(false);
			this.capaAdditionalAccounts = ko.observable(Settings.capa(Enums.Capa.AdditionalAccounts));

			this.accountClick = _.bind(this.accountClick, this);
		}

		_.extend(AbstractSystemDropDownUserView.prototype, AbstractView.prototype);

		AbstractSystemDropDownUserView.prototype.accountClick = function (oAccount, oEvent)
		{
			if (oAccount && oEvent && !Utils.isUnd(oEvent.which) && 1 === oEvent.which)
			{
				AccountStore.accounts.loading(true);

				_.delay(function () {
					AccountStore.accounts.loading(false);
				}, 1000);
			}

			return true;
		};

		AbstractSystemDropDownUserView.prototype.emailTitle = function ()
		{
			return AccountStore.email();
		};

		AbstractSystemDropDownUserView.prototype.settingsClick = function ()
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).setHash(Links.settings());
		};

		AbstractSystemDropDownUserView.prototype.settingsHelp = function ()
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/KeyboardShortcutsHelp */ 90));
		};

		AbstractSystemDropDownUserView.prototype.addAccountClick = function ()
		{
			if (this.capaAdditionalAccounts())
			{
				__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/AddAccount */ 67));
			}
		};

		AbstractSystemDropDownUserView.prototype.logoutClick = function ()
		{
			Remote.logout(function () {
				__webpack_require__(/*! App/User */ 6).loginAndLogoutReload(true,
					Settings.settingsGet('ParentEmail') && 0 < Settings.settingsGet('ParentEmail').length);
			});
		};

		AbstractSystemDropDownUserView.prototype.onBuild = function ()
		{
			var self = this;
			key('`', [Enums.KeyState.MessageList, Enums.KeyState.MessageView, Enums.KeyState.Settings], function () {
				if (self.viewModelVisibility())
				{
					self.accountMenuDropdownTrigger(true);
				}
			});

			// shortcuts help
			key('shift+/', [Enums.KeyState.MessageList, Enums.KeyState.MessageView, Enums.KeyState.Settings], function () {
				if (self.viewModelVisibility())
				{
					__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/KeyboardShortcutsHelp */ 90));
					return false;
				}
			});
		};

		module.exports = AbstractSystemDropDownUserView;

	}());

/***/ },
/* 92 */
/*!******************************!*\
  !*** ./dev/Common/Base64.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	
	// Base64 encode / decode
	// http://www.webtoolkit.info/

	(function () {

		'use strict';

		/*jslint bitwise: true*/
		var Base64 = {

			// private property
			_keyStr : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

			// public method for urlsafe encoding
			urlsafe_encode : function (input) {
				return Base64.encode(input).replace(/[+]/g, '-').replace(/[\/]/g, '_').replace(/[=]/g, '.');
			},

			// public method for encoding
			encode : function (input) {
				var
					output = '',
					chr1, chr2, chr3, enc1, enc2, enc3, enc4,
					i = 0
				;

				input = Base64._utf8_encode(input);

				while (i < input.length)
				{
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);

					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;

					if (isNaN(chr2))
					{
						enc3 = enc4 = 64;
					}
					else if (isNaN(chr3))
					{
						enc4 = 64;
					}

					output = output +
						this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
						this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
				}

				return output;
			},

			// public method for decoding
			decode : function (input) {
				var
					output = '',
					chr1, chr2, chr3, enc1, enc2, enc3, enc4,
					i = 0
				;

				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

				while (i < input.length)
				{
					enc1 = this._keyStr.indexOf(input.charAt(i++));
					enc2 = this._keyStr.indexOf(input.charAt(i++));
					enc3 = this._keyStr.indexOf(input.charAt(i++));
					enc4 = this._keyStr.indexOf(input.charAt(i++));

					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;

					output = output + String.fromCharCode(chr1);

					if (enc3 !== 64)
					{
						output = output + String.fromCharCode(chr2);
					}

					if (enc4 !== 64)
					{
						output = output + String.fromCharCode(chr3);
					}
				}

				return Base64._utf8_decode(output);
			},

			// private method for UTF-8 encoding
			_utf8_encode : function (string) {

				string = string.replace(/\r\n/g, "\n");

				var
					utftext = '',
					n = 0,
					l = string.length,
					c = 0
				;

				for (; n < l; n++) {

					c = string.charCodeAt(n);

					if (c < 128)
					{
						utftext += String.fromCharCode(c);
					}
					else if ((c > 127) && (c < 2048))
					{
						utftext += String.fromCharCode((c >> 6) | 192);
						utftext += String.fromCharCode((c & 63) | 128);
					}
					else
					{
						utftext += String.fromCharCode((c >> 12) | 224);
						utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						utftext += String.fromCharCode((c & 63) | 128);
					}
				}

				return utftext;
			},

			// private method for UTF-8 decoding
			_utf8_decode : function (utftext) {
				var
					string = '',
					i = 0,
					c = 0,
					c2 = 0,
					c3 = 0
				;

				while ( i < utftext.length )
				{
					c = utftext.charCodeAt(i);

					if (c < 128)
					{
						string += String.fromCharCode(c);
						i++;
					}
					else if((c > 191) && (c < 224))
					{
						c2 = utftext.charCodeAt(i+1);
						string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
						i += 2;
					}
					else
					{
						c2 = utftext.charCodeAt(i+1);
						c3 = utftext.charCodeAt(i+2);
						string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
						i += 3;
					}
				}

				return string;
			}
		};

		module.exports = Base64;
		/*jslint bitwise: false*/

	}());

/***/ },
/* 93 */
/*!**************************************************!*\
  !*** ./dev/Common/ClientStorageDriver/Cookie.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			$ = __webpack_require__(/*! $ */ 13),
			JSON = __webpack_require__(/*! JSON */ 73),

			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 */
		function CookieDriver()
		{
		}

		/**
		 * @static
		 * @return {boolean}
		 */
		CookieDriver.supported = function ()
		{
			return !!(window.navigator && window.navigator.cookieEnabled);
		};

		/**
		 * @param {string} sKey
		 * @param {*} mData
		 * @return {boolean}
		 */
		CookieDriver.prototype.set = function (sKey, mData)
		{
			var
				mStorageValue = $.cookie(Consts.Values.ClientSideStorageIndexName),
				bResult = false,
				mResult = null
			;

			try
			{
				mResult = null === mStorageValue ? null : JSON.parse(mStorageValue);
			}
			catch (oException) {}

			if (!mResult)
			{
				mResult = {};
			}

			mResult[sKey] = mData;

			try
			{
				$.cookie(Consts.Values.ClientSideStorageIndexName, JSON.stringify(mResult), {
					'expires': 30
				});

				bResult = true;
			}
			catch (oException) {}

			return bResult;
		};

		/**
		 * @param {string} sKey
		 * @return {*}
		 */
		CookieDriver.prototype.get = function (sKey)
		{
			var
				mStorageValue = $.cookie(Consts.Values.ClientSideStorageIndexName),
				mResult = null
			;

			try
			{
				mResult = null === mStorageValue ? null : JSON.parse(mStorageValue);
				if (mResult && !Utils.isUnd(mResult[sKey]))
				{
					mResult = mResult[sKey];
				}
				else
				{
					mResult = null;
				}
			}
			catch (oException) {}

			return mResult;
		};

		module.exports = CookieDriver;

	}());

/***/ },
/* 94 */
/*!********************************************************!*\
  !*** ./dev/Common/ClientStorageDriver/LocalStorage.js ***!
  \********************************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			JSON = __webpack_require__(/*! JSON */ 73),

			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Utils = __webpack_require__(/*! Common/Utils */ 1)
		;

		/**
		 * @constructor
		 */
		function LocalStorageDriver()
		{
		}

		/**
		 * @static
		 * @return {boolean}
		 */
		LocalStorageDriver.supported = function ()
		{
			return !!window.localStorage;
		};

		/**
		 * @param {string} sKey
		 * @param {*} mData
		 * @return {boolean}
		 */
		LocalStorageDriver.prototype.set = function (sKey, mData)
		{
			var
				mStorageValue = window.localStorage[Consts.Values.ClientSideStorageIndexName] || null,
				bResult = false,
				mResult = null
			;

			try
			{
				mResult = null === mStorageValue ? null : JSON.parse(mStorageValue);
			}
			catch (oException) {}

			if (!mResult)
			{
				mResult = {};
			}

			mResult[sKey] = mData;

			try
			{
				window.localStorage[Consts.Values.ClientSideStorageIndexName] = JSON.stringify(mResult);

				bResult = true;
			}
			catch (oException) {}

			return bResult;
		};

		/**
		 * @param {string} sKey
		 * @return {*}
		 */
		LocalStorageDriver.prototype.get = function (sKey)
		{
			var
				mStorageValue = window.localStorage[Consts.Values.ClientSideStorageIndexName] || null,
				mResult = null
			;

			try
			{
				mResult = null === mStorageValue ? null : JSON.parse(mStorageValue);
				if (mResult && !Utils.isUnd(mResult[sKey]))
				{
					mResult = mResult[sKey];
				}
				else
				{
					mResult = null;
				}
			}
			catch (oException) {}

			return mResult;
		};

		module.exports = LocalStorageDriver;

	}());

/***/ },
/* 95 */
/*!******************************!*\
  !*** ./dev/Model/Account.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractModel = __webpack_require__(/*! Knoin/AbstractModel */ 24)
		;

		/**
		 * @constructor
		 *
		 * @param {string} sEmail
		 * @param {boolean=} bCanBeDelete = true
		 * @param {number=} iCount = 0
		 */
		function AccountModel(sEmail, bCanBeDelete, iCount)
		{
			AbstractModel.call(this, 'AccountModel');

			this.email = sEmail;

			this.count = ko.observable(iCount || 0);

			this.deleteAccess = ko.observable(false);
			this.canBeDalete = ko.observable(Utils.isUnd(bCanBeDelete) ? true : !!bCanBeDelete);
			this.canBeEdit = this.canBeDalete;
		}

		_.extend(AccountModel.prototype, AbstractModel.prototype);

		/**
		 * @type {string}
		 */
		AccountModel.prototype.email = '';

		/**
		 * @return {string}
		 */
		AccountModel.prototype.changeAccountLink = function ()
		{
			return __webpack_require__(/*! Common/Links */ 12).change(this.email);
		};

		module.exports = AccountModel;

	}());

/***/ },
/* 96 */
/*!****************************************!*\
  !*** ./dev/Model/ComposeAttachment.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AttachmentModel = __webpack_require__(/*! Model/Attachment */ 79),

			AbstractModel = __webpack_require__(/*! Knoin/AbstractModel */ 24)
		;

		/**
		 * @constructor
		 * @param {string} sId
		 * @param {string} sFileName
		 * @param {?number=} nSize
		 * @param {boolean=} bInline
		 * @param {boolean=} bLinked
		 * @param {string=} sCID
		 * @param {string=} sContentLocation
		 */
		function ComposeAttachmentModel(sId, sFileName, nSize, bInline, bLinked, sCID, sContentLocation)
		{
			AbstractModel.call(this, 'ComposeAttachmentModel');

			this.id = sId;
			this.isInline = Utils.isUnd(bInline) ? false : !!bInline;
			this.isLinked = Utils.isUnd(bLinked) ? false : !!bLinked;
			this.CID = Utils.isUnd(sCID) ? '' : sCID;
			this.contentLocation = Utils.isUnd(sContentLocation) ? '' : sContentLocation;
			this.fromMessage = false;

			this.fileName = ko.observable(sFileName);
			this.size = ko.observable(Utils.isUnd(nSize) ? null : nSize);
			this.tempName = ko.observable('');

			this.progress = ko.observable(0);
			this.error = ko.observable('');
			this.waiting = ko.observable(true);
			this.uploading = ko.observable(false);
			this.enabled = ko.observable(true);
			this.complete = ko.observable(false);

			this.progressText = ko.computed(function () {
				var iP = this.progress();
				return 0 === iP ? '' : '' + (99 === iP ? 100 : iP) + '%';
			}, this);

			this.progressStyle = ko.computed(function () {
				var iP = this.progress();
				return 0 === iP ? '' : 'width:' + (99 === iP ? 100 : iP) + '%';
			}, this);

			this.title = ko.computed(function () {
				var sError = this.error();
				return '' !== sError ? sError : this.fileName();
			}, this);

			this.friendlySize = ko.computed(function () {
				var mSize = this.size();
				return null === mSize ? '' : Utils.friendlySize(this.size());
			}, this);

			this.mimeType = ko.computed(function () {
				return Utils.mimeContentType(this.fileName());
			}, this);

			this.regDisposables([this.friendlySize]);
		}

		_.extend(ComposeAttachmentModel.prototype, AbstractModel.prototype);

		ComposeAttachmentModel.prototype.id = '';
		ComposeAttachmentModel.prototype.isInline = false;
		ComposeAttachmentModel.prototype.isLinked = false;
		ComposeAttachmentModel.prototype.CID = '';
		ComposeAttachmentModel.prototype.contentLocation = '';
		ComposeAttachmentModel.prototype.fromMessage = false;
		ComposeAttachmentModel.prototype.cancel = Utils.emptyFunction;

		/**
		 * @param {AjaxJsonComposeAttachment} oJsonAttachment
		 * @return {boolean}
		 */
		ComposeAttachmentModel.prototype.initByUploadJson = function (oJsonAttachment)
		{
			var bResult = false;
			if (oJsonAttachment)
			{
				this.fileName(oJsonAttachment.Name);
				this.size(Utils.isUnd(oJsonAttachment.Size) ? 0 : Utils.pInt(oJsonAttachment.Size));
				this.tempName(Utils.isUnd(oJsonAttachment.TempName) ? '' : oJsonAttachment.TempName);
				this.isInline = false;

				bResult = true;
			}

			return bResult;
		};

		/**
		 * @return {string}
		 */
		ComposeAttachmentModel.prototype.iconClass = function ()
		{
			return AttachmentModel.staticIconClassHelper(this.mimeType())[0];
		};

		/**
		 * @return {string}
		 */
		ComposeAttachmentModel.prototype.iconText = function ()
		{
			return AttachmentModel.staticIconClassHelper(this.mimeType())[1];
		};

		module.exports = ComposeAttachmentModel;

	}());

/***/ },
/* 97 */
/*!******************************!*\
  !*** ./dev/Model/Contact.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 12),

			AbstractModel = __webpack_require__(/*! Knoin/AbstractModel */ 24)
		;

		/**
		 * @constructor
		 */
		function ContactModel()
		{
			AbstractModel.call(this, 'ContactModel');

			this.idContact = 0;
			this.display = '';
			this.properties = [];
			this.readOnly = false;

			this.focused = ko.observable(false);
			this.selected = ko.observable(false);
			this.checked = ko.observable(false);
			this.deleted = ko.observable(false);
		}

		_.extend(ContactModel.prototype, AbstractModel.prototype);

		/**
		 * @return {Array|null}
		 */
		ContactModel.prototype.getNameAndEmailHelper = function ()
		{
			var
				sName = '',
				sEmail = ''
			;

			if (Utils.isNonEmptyArray(this.properties))
			{
				_.each(this.properties, function (aProperty) {
					if (aProperty)
					{
						if (Enums.ContactPropertyType.FirstName === aProperty[0])
						{
							sName = Utils.trim(aProperty[1] + ' ' + sName);
						}
						else if (Enums.ContactPropertyType.LastName === aProperty[0])
						{
							sName = Utils.trim(sName + ' ' + aProperty[1]);
						}
						else if ('' === sEmail && Enums.ContactPropertyType.Email === aProperty[0])
						{
							sEmail = aProperty[1];
						}
					}
				}, this);
			}

			return '' === sEmail ? null : [sEmail, sName];
		};

		ContactModel.prototype.parse = function (oItem)
		{
			var bResult = false;
			if (oItem && 'Object/Contact' === oItem['@Object'])
			{
				this.idContact = Utils.pInt(oItem['IdContact']);
				this.display = Utils.pString(oItem['Display']);
				this.readOnly = !!oItem['ReadOnly'];

				if (Utils.isNonEmptyArray(oItem['Properties']))
				{
					_.each(oItem['Properties'], function (oProperty) {
						if (oProperty && oProperty['Type'] && Utils.isNormal(oProperty['Value']) && Utils.isNormal(oProperty['TypeStr']))
						{
							this.properties.push([Utils.pInt(oProperty['Type']), Utils.pString(oProperty['Value']), Utils.pString(oProperty['TypeStr'])]);
						}
					}, this);
				}

				bResult = true;
			}

			return bResult;
		};

		/**
		 * @return {string}
		 */
		ContactModel.prototype.srcAttr = function ()
		{
			return Links.emptyContactPic();
		};

		/**
		 * @return {string}
		 */
		ContactModel.prototype.generateUid = function ()
		{
			return '' + this.idContact;
		};

		/**
		 * @return string
		 */
		ContactModel.prototype.lineAsCcc = function ()
		{
			var aResult = [];
			if (this.deleted())
			{
				aResult.push('deleted');
			}
			if (this.selected())
			{
				aResult.push('selected');
			}
			if (this.checked())
			{
				aResult.push('checked');
			}
			if (this.focused())
			{
				aResult.push('focused');
			}

			return aResult.join(' ');
		};

		module.exports = ContactModel;

	}());

/***/ },
/* 98 */
/*!**************************************!*\
  !*** ./dev/Model/ContactProperty.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			AbstractModel = __webpack_require__(/*! Knoin/AbstractModel */ 24)
		;

		/**
		 * @constructor
		 * @param {number=} iType = Enums.ContactPropertyType.Unknown
		 * @param {string=} sTypeStr = ''
		 * @param {string=} sValue = ''
		 * @param {boolean=} bFocused = false
		 * @param {string=} sPlaceholder = ''
		 */
		function ContactPropertyModel(iType, sTypeStr, sValue, bFocused, sPlaceholder)
		{
			AbstractModel.call(this, 'ContactPropertyModel');

			this.type = ko.observable(Utils.isUnd(iType) ? Enums.ContactPropertyType.Unknown : iType);
			this.typeStr = ko.observable(Utils.isUnd(sTypeStr) ? '' : sTypeStr);
			this.focused = ko.observable(Utils.isUnd(bFocused) ? false : !!bFocused);
			this.value = ko.observable(Utils.pString(sValue));

			this.placeholder = ko.observable(sPlaceholder || '');

			this.placeholderValue = ko.computed(function () {
				var sPlaceholder = this.placeholder();
				return sPlaceholder ? Translator.i18n(sPlaceholder) : '';
			}, this);

			this.largeValue = ko.computed(function () {
				return Enums.ContactPropertyType.Note === this.type();
			}, this);

			this.regDisposables([this.placeholderValue, this.largeValue]);
		}

		_.extend(ContactPropertyModel.prototype, AbstractModel.prototype);

		module.exports = ContactPropertyModel;

	}());

/***/ },
/* 99 */
/*!**************************************!*\
  !*** ./dev/Model/FilterCondition.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractModel = __webpack_require__(/*! Knoin/AbstractModel */ 24)
		;

		/**
		 * @constructor
		 */
		function FilterConditionModel()
		{
			AbstractModel.call(this, 'FilterConditionModel');

			this.field = ko.observable(Enums.FilterConditionField.From);
			this.type = ko.observable(Enums.FilterConditionType.Contains);
			this.value = ko.observable('');
			this.value.error = ko.observable(false);

			this.template = ko.computed(function () {

				var sTemplate = '';
				switch (this.type())
				{
					default:
						sTemplate = 'SettingsFiltersConditionDefault';
						break;
				}

				return sTemplate;

			}, this);

			this.regDisposables([this.template]);
		}

		_.extend(FilterConditionModel.prototype, AbstractModel.prototype);

		FilterConditionModel.prototype.verify = function ()
		{
			if ('' === this.value())
			{
				this.value.error(true);
				return false;
			}

			return true;
		};

		FilterConditionModel.prototype.parse = function (oItem)
		{
			if (oItem && oItem['Field'] && oItem['Type'])
			{
				this.field(Utils.pString(oItem['Field']));
				this.type(Utils.pString(oItem['Type']));
				this.value(Utils.pString(oItem['Value']));

				return true;
			}

			return false;
		};

		FilterConditionModel.prototype.toJson = function ()
		{
			return {
				'Field': this.field(),
				'Type': this.type(),
				'Value': this.value()
			};
		};

		FilterConditionModel.prototype.cloneSelf = function ()
		{
			var oClone = new FilterConditionModel();

			oClone.field(this.field());
			oClone.type(this.type());
			oClone.value(this.value());

			return oClone;
		};

		module.exports = FilterConditionModel;

	}());

/***/ },
/* 100 */
/*!*****************************!*\
  !*** ./dev/Model/Folder.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Events = __webpack_require__(/*! Common/Events */ 28),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),

			AbstractModel = __webpack_require__(/*! Knoin/AbstractModel */ 24)
		;

		/**
		 * @constructor
		 */
		function FolderModel()
		{
			AbstractModel.call(this, 'FolderModel');

			this.name = ko.observable('');
			this.fullName = '';
			this.fullNameRaw = '';
			this.fullNameHash = '';
			this.delimiter = '';
			this.namespace = '';
			this.deep = 0;
			this.interval = 0;

			this.selectable = false;
			this.existen = true;

			this.type = ko.observable(Enums.FolderType.User);

			this.focused = ko.observable(false);
			this.selected = ko.observable(false);
			this.edited = ko.observable(false);
			this.collapsed = ko.observable(true);
			this.subScribed = ko.observable(true);
			this.subFolders = ko.observableArray([]);
			this.deleteAccess = ko.observable(false);
			this.actionBlink = ko.observable(false).extend({'falseTimeout': 1000});

			this.nameForEdit = ko.observable('');

			this.privateMessageCountAll = ko.observable(0);
			this.privateMessageCountUnread = ko.observable(0);

			this.collapsedPrivate = ko.observable(true);
		}

		_.extend(FolderModel.prototype, AbstractModel.prototype);

		/**
		 * @static
		 * @param {AjaxJsonFolder} oJsonFolder
		 * @return {?FolderModel}
		 */
		FolderModel.newInstanceFromJson = function (oJsonFolder)
		{
			var oFolderModel = new FolderModel();
			return oFolderModel.initByJson(oJsonFolder) ? oFolderModel.initComputed() : null;
		};

		/**
		 * @return {FolderModel}
		 */
		FolderModel.prototype.initComputed = function ()
		{
			var sInboxFolderName = Cache.getFolderInboxName();

			this.hasSubScribedSubfolders = ko.computed(function () {
				return !!_.find(this.subFolders(), function (oFolder) {
					return oFolder.subScribed() && !oFolder.isSystemFolder();
				});
			}, this);

			this.canBeEdited = ko.computed(function () {
				return Enums.FolderType.User === this.type() && this.existen && this.selectable;
			}, this);

			this.visible = ko.computed(function () {

				var
					bSubScribed = this.subScribed(),
					bSubFolders = this.hasSubScribedSubfolders()
				;

				return (bSubScribed || (bSubFolders && (!this.existen || !this.selectable)));

			}, this);

			this.isSystemFolder = ko.computed(function () {
				return Enums.FolderType.User !== this.type();
			}, this);

			this.hidden = ko.computed(function () {
				var
					bSystem = this.isSystemFolder(),
					bSubFolders = this.hasSubScribedSubfolders()
				;

				return (bSystem && !bSubFolders) || (!this.selectable && !bSubFolders);

			}, this);

			this.selectableForFolderList = ko.computed(function () {
				return !this.isSystemFolder() && this.selectable;
			}, this);

			this.messageCountAll = ko.computed({
				'read': this.privateMessageCountAll,
				'write': function (iValue) {
					if (Utils.isPosNumeric(iValue, true))
					{
						this.privateMessageCountAll(iValue);
					}
					else
					{
						this.privateMessageCountAll.valueHasMutated();
					}
				},
				'owner': this
			}).extend({'notify': 'always'});

			this.messageCountUnread = ko.computed({
				'read': this.privateMessageCountUnread,
				'write': function (iValue) {
					if (Utils.isPosNumeric(iValue, true))
					{
						this.privateMessageCountUnread(iValue);
					}
					else
					{
						this.privateMessageCountUnread.valueHasMutated();
					}
				},
				'owner': this
			}).extend({'notify': 'always'});

			this.printableUnreadCount = ko.computed(function () {
				var
					iCount = this.messageCountAll(),
					iUnread = this.messageCountUnread(),
					iType = this.type()
				;

				if (0 < iCount)
				{
					if (Enums.FolderType.Draft === iType)
					{
						return '' + iCount;
					}
					else if (0 < iUnread && Enums.FolderType.Trash !== iType && Enums.FolderType.Archive !== iType && Enums.FolderType.SentItems !== iType)
					{
						return '' + iUnread;
					}
				}

				return '';

			}, this);

			this.canBeDeleted = ko.computed(function () {
				var
					bSystem = this.isSystemFolder()
				;
				return !bSystem && 0 === this.subFolders().length && sInboxFolderName !== this.fullNameRaw;
			}, this);

			this.canBeSubScribed = ko.computed(function () {
				return !this.isSystemFolder() && this.selectable && sInboxFolderName !== this.fullNameRaw;
			}, this);

	//		this.visible.subscribe(function () {
	//			Utils.timeOutAction('folder-list-folder-visibility-change', function () {
	//				Globals.$win.trigger('folder-list-folder-visibility-change');
	//			}, 100);
	//		});

			this.localName = ko.computed(function () {

				Translator.trigger();

				var
					iType = this.type(),
					sName = this.name()
				;

				if (this.isSystemFolder())
				{
					switch (iType)
					{
						case Enums.FolderType.Inbox:
							sName = Translator.i18n('FOLDER_LIST/INBOX_NAME');
							break;
						case Enums.FolderType.SentItems:
							sName = Translator.i18n('FOLDER_LIST/SENT_NAME');
							break;
						case Enums.FolderType.Draft:
							sName = Translator.i18n('FOLDER_LIST/DRAFTS_NAME');
							break;
						case Enums.FolderType.Spam:
							sName = Translator.i18n('FOLDER_LIST/SPAM_NAME');
							break;
						case Enums.FolderType.Trash:
							sName = Translator.i18n('FOLDER_LIST/TRASH_NAME');
							break;
						case Enums.FolderType.Archive:
							sName = Translator.i18n('FOLDER_LIST/ARCHIVE_NAME');
							break;
					}
				}

				return sName;

			}, this);

			this.manageFolderSystemName = ko.computed(function () {

				Translator.trigger();

				var
					sSuffix = '',
					iType = this.type(),
					sName = this.name()
				;

				if (this.isSystemFolder())
				{
					switch (iType)
					{
						case Enums.FolderType.Inbox:
							sSuffix = '(' + Translator.i18n('FOLDER_LIST/INBOX_NAME') + ')';
							break;
						case Enums.FolderType.SentItems:
							sSuffix = '(' + Translator.i18n('FOLDER_LIST/SENT_NAME') + ')';
							break;
						case Enums.FolderType.Draft:
							sSuffix = '(' + Translator.i18n('FOLDER_LIST/DRAFTS_NAME') + ')';
							break;
						case Enums.FolderType.Spam:
							sSuffix = '(' + Translator.i18n('FOLDER_LIST/SPAM_NAME') + ')';
							break;
						case Enums.FolderType.Trash:
							sSuffix = '(' + Translator.i18n('FOLDER_LIST/TRASH_NAME') + ')';
							break;
						case Enums.FolderType.Archive:
							sSuffix = '(' + Translator.i18n('FOLDER_LIST/ARCHIVE_NAME') + ')';
							break;
					}
				}

				if ('' !== sSuffix && '(' + sName + ')' === sSuffix || '(inbox)' === sSuffix.toLowerCase())
				{
					sSuffix = '';
				}

				return sSuffix;

			}, this);

			this.collapsed = ko.computed({
				'read': function () {
					return !this.hidden() && this.collapsedPrivate();
				},
				'write': function (mValue) {
					this.collapsedPrivate(mValue);
				},
				'owner': this
			});

			this.hasUnreadMessages = ko.computed(function () {
				return 0 < this.messageCountUnread();
			}, this);

			this.hasSubScribedUnreadMessagesSubfolders = ko.computed(function () {
				return !!_.find(this.subFolders(), function (oFolder) {
					return oFolder.hasUnreadMessages() || oFolder.hasSubScribedUnreadMessagesSubfolders();
				});
			}, this);

			// subscribe
			this.name.subscribe(function (sValue) {
				this.nameForEdit(sValue);
			}, this);

			this.edited.subscribe(function (bValue) {
				if (bValue)
				{
					this.nameForEdit(this.name());
				}
			}, this);

			this.messageCountUnread.subscribe(function (iUnread) {
				if (Enums.FolderType.Inbox === this.type())
				{
					Events.pub('mailbox.inbox-unread-count', [iUnread]);
				}
			}, this);

			return this;
		};

		FolderModel.prototype.fullName = '';
		FolderModel.prototype.fullNameRaw = '';
		FolderModel.prototype.fullNameHash = '';
		FolderModel.prototype.delimiter = '';
		FolderModel.prototype.namespace = '';
		FolderModel.prototype.deep = 0;
		FolderModel.prototype.interval = 0;

		/**
		 * @return {string}
		 */
		FolderModel.prototype.collapsedCss = function ()
		{
			return this.hasSubScribedSubfolders() ?
				(this.collapsed() ? 'icon-right-mini e-collapsed-sign' : 'icon-down-mini e-collapsed-sign') : 'icon-none e-collapsed-sign';
		};

		/**
		 * @param {AjaxJsonFolder} oJsonFolder
		 * @return {boolean}
		 */
		FolderModel.prototype.initByJson = function (oJsonFolder)
		{
			var
				bResult = false,
				sInboxFolderName = Cache.getFolderInboxName()
			;

			if (oJsonFolder && 'Object/Folder' === oJsonFolder['@Object'])
			{
				this.name(oJsonFolder.Name);
				this.delimiter = oJsonFolder.Delimiter;
				this.fullName = oJsonFolder.FullName;
				this.fullNameRaw = oJsonFolder.FullNameRaw;
				this.fullNameHash = oJsonFolder.FullNameHash;
				this.deep = oJsonFolder.FullNameRaw.split(this.delimiter).length - 1;
				this.selectable = !!oJsonFolder.IsSelectable;
				this.existen = !!oJsonFolder.IsExists;

				this.subScribed(!!oJsonFolder.IsSubscribed);
				this.type(sInboxFolderName === this.fullNameRaw ? Enums.FolderType.Inbox : Enums.FolderType.User);

				bResult = true;
			}

			return bResult;
		};

		/**
		 * @return {string}
		 */
		FolderModel.prototype.printableFullName = function ()
		{
			return this.fullName.split(this.delimiter).join(' / ');
		};

		module.exports = FolderModel;

	}());

/***/ },
/* 101 */
/*!*******************************!*\
  !*** ./dev/Model/Identity.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			AbstractModel = __webpack_require__(/*! Knoin/AbstractModel */ 24)
		;

		/**
		 * @param {string} sId
		 * @param {string} sEmail
		 * @param {boolean=} bCanBeDelete = true
		 * @constructor
		 */
		function IdentityModel(sId, sEmail, bCanBeDelete)
		{
			AbstractModel.call(this, 'IdentityModel');

			this.id = sId;
			this.email = ko.observable(sEmail);
			this.name = ko.observable('');
			this.replyTo = ko.observable('');
			this.bcc = ko.observable('');

			this.deleteAccess = ko.observable(false);
			this.canBeDalete = ko.observable(bCanBeDelete);
		}

		_.extend(IdentityModel.prototype, AbstractModel.prototype);

		IdentityModel.prototype.formattedName = function ()
		{
			var sName = this.name();
			return '' === sName ? this.email() : sName + ' <' + this.email() + '>';
		};

		IdentityModel.prototype.formattedNameForCompose = function ()
		{
			var sName = this.name();
			return '' === sName ? this.email() : sName + ' (' + this.email() + ')';
		};

		IdentityModel.prototype.formattedNameForEmail = function ()
		{
			var sName = this.name();
			return '' === sName ? this.email() : '"' + Utils.quoteName(sName) + '" <' + this.email() + '>';
		};

		module.exports = IdentityModel;

	}());

/***/ },
/* 102 */
/*!*********************************!*\
  !*** ./dev/Model/OpenPgpKey.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			AbstractModel = __webpack_require__(/*! Knoin/AbstractModel */ 24)
		;

		/**
		 * @param {string} iIndex
		 * @param {string} sGuID
		 * @param {string} sID
		 * @param {string} sUserID
		 * @param {string} sEmail
		 * @param {boolean} bIsPrivate
		 * @param {string} sArmor
		 * @constructor
		 */
		function OpenPgpKeyModel(iIndex, sGuID, sID, sUserID, sEmail, bIsPrivate, sArmor)
		{
			AbstractModel.call(this, 'OpenPgpKeyModel');

			this.index = iIndex;
			this.id = sID;
			this.guid = sGuID;
			this.user = sUserID;
			this.email = sEmail;
			this.armor = sArmor;
			this.isPrivate = !!bIsPrivate;

			this.deleteAccess = ko.observable(false);
		}

		_.extend(OpenPgpKeyModel.prototype, AbstractModel.prototype);

		OpenPgpKeyModel.prototype.index = 0;
		OpenPgpKeyModel.prototype.id = '';
		OpenPgpKeyModel.prototype.guid = '';
		OpenPgpKeyModel.prototype.user = '';
		OpenPgpKeyModel.prototype.email = '';
		OpenPgpKeyModel.prototype.armor = '';
		OpenPgpKeyModel.prototype.isPrivate = false;

		module.exports = OpenPgpKeyModel;

	}());

/***/ },
/* 103 */,
/* 104 */,
/* 105 */
/*!**********************************!*\
  !*** ./dev/Screen/User/About.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			AbstractScreen = __webpack_require__(/*! Knoin/AbstractScreen */ 34)
		;

		/**
		 * @constructor
		 * @extends AbstractScreen
		 */
		function AboutUserScreen()
		{
			AbstractScreen.call(this, 'about', [
				__webpack_require__(/*! View/User/About */ 143)
			]);
		}

		_.extend(AboutUserScreen.prototype, AbstractScreen.prototype);

		AboutUserScreen.prototype.onShow = function ()
		{
			__webpack_require__(/*! App/User */ 6).setTitle('RainLoop');
		};

		module.exports = AboutUserScreen;

	}());

/***/ },
/* 106 */
/*!**********************************!*\
  !*** ./dev/Screen/User/Login.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			AbstractScreen = __webpack_require__(/*! Knoin/AbstractScreen */ 34)
		;

		/**
		 * @constructor
		 * @extends AbstractScreen
		 */
		function LoginUserScreen()
		{
			AbstractScreen.call(this, 'login', [
				__webpack_require__(/*! View/User/Login */ 144)
			]);
		}

		_.extend(LoginUserScreen.prototype, AbstractScreen.prototype);

		LoginUserScreen.prototype.onShow = function ()
		{
			__webpack_require__(/*! App/User */ 6).setTitle('');
		};

		module.exports = LoginUserScreen;

	}());

/***/ },
/* 107 */
/*!************************************!*\
  !*** ./dev/Screen/User/MailBox.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Events = __webpack_require__(/*! Common/Events */ 28),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			AccountStore = __webpack_require__(/*! Stores/User/Account */ 22),
			SettingsStore = __webpack_require__(/*! Stores/User/Settings */ 26),

			Data = __webpack_require__(/*! Storage/User/Data */ 15),
			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),

			AbstractScreen = __webpack_require__(/*! Knoin/AbstractScreen */ 34)
		;

		/**
		 * @constructor
		 * @extends AbstractScreen
		 */
		function MailBoxUserScreen()
		{
			AbstractScreen.call(this, 'mailbox', [
				__webpack_require__(/*! View/User/MailBox/SystemDropDown */ 148),
				__webpack_require__(/*! View/User/MailBox/FolderList */ 145),
				__webpack_require__(/*! View/User/MailBox/MessageList */ 146),
				__webpack_require__(/*! View/User/MailBox/MessageView */ 147)
			]);

			this.oLastRoute = {};
		}

		_.extend(MailBoxUserScreen.prototype, AbstractScreen.prototype);

		/**
		 * @type {Object}
		 */
		MailBoxUserScreen.prototype.oLastRoute = {};

		MailBoxUserScreen.prototype.setNewTitle  = function ()
		{
			var
				sEmail = AccountStore.email(),
				nFoldersInboxUnreadCount = Data.foldersInboxUnreadCount()
			;

			__webpack_require__(/*! App/User */ 6).setTitle(('' === sEmail ? '' :
				(0 < nFoldersInboxUnreadCount ? '(' + nFoldersInboxUnreadCount + ') ' : ' ') +
					sEmail + ' - ') + Translator.i18n('TITLES/MAILBOX'));
		};

		MailBoxUserScreen.prototype.onShow = function ()
		{
			this.setNewTitle();
			Globals.keyScope(Enums.KeyState.MessageList);
		};

		/**
		 * @param {string} sFolderHash
		 * @param {number} iPage
		 * @param {string} sSearch
		 * @param {boolean=} bPreview = false
		 */
		MailBoxUserScreen.prototype.onRoute = function (sFolderHash, iPage, sSearch, bPreview)
		{
			if (Utils.isUnd(bPreview) ? false : !!bPreview)
			{
				if (Enums.Layout.NoPreview === SettingsStore.layout() && !Data.message())
				{
					__webpack_require__(/*! App/User */ 6).historyBack();
				}
			}
			else
			{
				var
					sFolderFullNameRaw = Cache.getFolderFullNameRaw(sFolderHash),
					oFolder = Cache.getFolderFromCacheList(sFolderFullNameRaw)
				;

				if (oFolder)
				{
					Data
						.currentFolder(oFolder)
						.messageListPage(iPage)
						.messageListSearch(sSearch)
					;

					if (Enums.Layout.NoPreview === SettingsStore.layout() && Data.message())
					{
						Data.message(null);
					}

					__webpack_require__(/*! App/User */ 6).reloadMessageList();
				}
			}
		};

		MailBoxUserScreen.prototype.onStart = function ()
		{
			Data.folderList.subscribe(Utils.windowResizeCallback);
			Data.messageList.subscribe(Utils.windowResizeCallback);
			Data.message.subscribe(Utils.windowResizeCallback);

			_.delay(function () {
				SettingsStore.layout.valueHasMutated();
			}, 50);

			Events.sub('mailbox.inbox-unread-count', function (iCount) {

				Data.foldersInboxUnreadCount(iCount);

				var sEmail = AccountStore.email();

				_.each(AccountStore.accounts(), function (oItem) {
					if (oItem && sEmail === oItem.email)
					{
						oItem.count(iCount);
					}
				});
			});

			Data.foldersInboxUnreadCount.subscribe(function () {
				this.setNewTitle();
			}, this);

		};

		MailBoxUserScreen.prototype.onBuild = function ()
		{
			if (!Globals.bMobileDevice)
			{
				_.defer(function () {
					__webpack_require__(/*! App/User */ 6).initHorizontalLayoutResizer(Enums.ClientSideKeyName.MessageListSize);
				});
			}
		};

		/**
		 * @return {Array}
		 */
		MailBoxUserScreen.prototype.routes = function ()
		{
			var
				sInboxFolderName = Cache.getFolderInboxName(),
				fNormP = function () {
					return [sInboxFolderName, 1, '', true];
				},
				fNormS = function (oRequest, oVals) {
					oVals[0] = Utils.pString(oVals[0]);
					oVals[1] = Utils.pInt(oVals[1]);
					oVals[1] = 0 >= oVals[1] ? 1 : oVals[1];
					oVals[2] = Utils.pString(oVals[2]);

					if ('' === oRequest)
					{
						oVals[0] = sInboxFolderName;
						oVals[1] = 1;
					}

					return [decodeURI(oVals[0]), oVals[1], decodeURI(oVals[2]), false];
				},
				fNormD = function (oRequest, oVals) {
					oVals[0] = Utils.pString(oVals[0]);
					oVals[1] = Utils.pString(oVals[1]);

					if ('' === oRequest)
					{
						oVals[0] = sInboxFolderName;
					}

					return [decodeURI(oVals[0]), 1, decodeURI(oVals[1]), false];
				}
			;

			return [
				[/^([a-zA-Z0-9]+)\/p([1-9][0-9]*)\/(.+)\/?$/, {'normalize_': fNormS}],
				[/^([a-zA-Z0-9]+)\/p([1-9][0-9]*)$/, {'normalize_': fNormS}],
				[/^([a-zA-Z0-9]+)\/(.+)\/?$/, {'normalize_': fNormD}],
				[/^message-preview$/,  {'normalize_': fNormP}],
				[/^([^\/]*)$/,  {'normalize_': fNormS}]
			];
		};

		module.exports = MailBoxUserScreen;

	}());

/***/ },
/* 108 */
/*!*************************************!*\
  !*** ./dev/Screen/User/Settings.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			AppStore = __webpack_require__(/*! Stores/User/App */ 30),
			Settings = __webpack_require__(/*! Storage/Settings */ 9),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),

			AbstractSettingsScreen = __webpack_require__(/*! Screen/AbstractSettings */ 58)
		;

		/**
		 * @constructor
		 * @extends AbstractSettingsScreen
		 */
		function SettingsUserScreen()
		{
			AbstractSettingsScreen.call(this, [
				__webpack_require__(/*! View/User/Settings/SystemDropDown */ 151),
				__webpack_require__(/*! View/User/Settings/Menu */ 149),
				__webpack_require__(/*! View/User/Settings/Pane */ 150)
			]);

			Translator.initOnStartOrLangChange(function () {
				this.sSettingsTitle = Translator.i18n('TITLES/SETTINGS');
			}, this, function () {
				this.setSettingsTitle();
			});
		}

		_.extend(SettingsUserScreen.prototype, AbstractSettingsScreen.prototype);

		/**
		 * @param {Function=} fCallback
		 */
		SettingsUserScreen.prototype.setupSettings = function (fCallback)
		{
			kn.addSettingsViewModel(__webpack_require__(/*! Settings/User/General */ 125),
				'SettingsGeneral', 'SETTINGS_LABELS/LABEL_GENERAL_NAME', 'general', true);

			if (AppStore.contactsIsAllowed())
			{
				kn.addSettingsViewModel(__webpack_require__(/*! Settings/User/Contacts */ 122),
					'SettingsContacts', 'SETTINGS_LABELS/LABEL_CONTACTS_NAME', 'contacts');
			}

			if (Settings.capa(Enums.Capa.AdditionalAccounts))
			{
				kn.addSettingsViewModel(__webpack_require__(/*! Settings/User/Accounts */ 120),
					'SettingsAccounts', 'SETTINGS_LABELS/LABEL_ACCOUNTS_NAME', 'accounts');
			}

			if (Settings.capa(Enums.Capa.AdditionalIdentities))
			{
				kn.addSettingsViewModel(__webpack_require__(/*! Settings/User/Identities */ 126),
					'SettingsIdentities', 'SETTINGS_LABELS/LABEL_IDENTITIES_NAME', 'identities');
			}
			else
			{
				kn.addSettingsViewModel(__webpack_require__(/*! Settings/User/Identity */ 127),
					'SettingsIdentity', 'SETTINGS_LABELS/LABEL_IDENTITY_NAME', 'identity');
			}

			if (Settings.capa(Enums.Capa.Sieve))
			{
				kn.addSettingsViewModel(__webpack_require__(/*! Settings/User/Filters */ 123),
					'SettingsFilters', 'SETTINGS_LABELS/LABEL_FILTERS_NAME', 'filters');
			}

			if (Settings.capa(Enums.Capa.TwoFactor))
			{
				kn.addSettingsViewModel(__webpack_require__(/*! Settings/User/Security */ 129),
					'SettingsSecurity', 'SETTINGS_LABELS/LABEL_SECURITY_NAME', 'security');
			}

			if ((Settings.settingsGet('AllowGoogleSocial') && Settings.settingsGet('AllowGoogleSocialAuth')) ||
				Settings.settingsGet('AllowFacebookSocial') ||
				Settings.settingsGet('AllowTwitterSocial'))
			{
				kn.addSettingsViewModel(__webpack_require__(/*! Settings/User/Social */ 130),
					'SettingsSocial', 'SETTINGS_LABELS/LABEL_SOCIAL_NAME', 'social');
			}

			if (Settings.settingsGet('ChangePasswordIsAllowed'))
			{
				kn.addSettingsViewModel(__webpack_require__(/*! Settings/User/ChangePassword */ 121),
					'SettingsChangePassword', 'SETTINGS_LABELS/LABEL_CHANGE_PASSWORD_NAME', 'change-password');
			}

			kn.addSettingsViewModel(__webpack_require__(/*! Settings/User/Folders */ 124),
				'SettingsFolders', 'SETTINGS_LABELS/LABEL_FOLDERS_NAME', 'folders');

			if (Settings.capa(Enums.Capa.Themes))
			{
				kn.addSettingsViewModel(__webpack_require__(/*! Settings/User/Themes */ 131),
					'SettingsThemes', 'SETTINGS_LABELS/LABEL_THEMES_NAME', 'themes');
			}

			if (Settings.capa(Enums.Capa.OpenPGP))
			{
				kn.addSettingsViewModel(__webpack_require__(/*! Settings/User/OpenPgp */ 128),
					'SettingsOpenPGP', 'SETTINGS_LABELS/LABEL_OPEN_PGP_NAME', 'openpgp');
			}

			if (fCallback)
			{
				fCallback();
			}
		};

		SettingsUserScreen.prototype.onShow = function ()
		{
			this.setSettingsTitle();
			Globals.keyScope(Enums.KeyState.Settings);
		};

		SettingsUserScreen.prototype.setSettingsTitle = function ()
		{
			__webpack_require__(/*! App/User */ 6).setTitle(this.sSettingsTitle);
		};

		module.exports = SettingsUserScreen;

	}());

/***/ },
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */
/*!***************************************!*\
  !*** ./dev/Settings/User/Accounts.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Translator = __webpack_require__(/*! Common/Translator */ 7),
			Links = __webpack_require__(/*! Common/Links */ 12),

			AccountStore = __webpack_require__(/*! Stores/User/Account */ 22),

			Remote = __webpack_require__(/*! Storage/User/Remote */ 14)
		;

		/**
		 * @constructor
		 */
		function AccountsUserSettings()
		{
			this.accounts = AccountStore.accounts;

			this.processText = ko.computed(function () {
				return AccountStore.accounts.loading() ? Translator.i18n('SETTINGS_ACCOUNTS/LOADING_PROCESS') : '';
			}, this);

			this.visibility = ko.computed(function () {
				return '' === this.processText() ? 'hidden' : 'visible';
			}, this);

			this.accountForDeletion = ko.observable(null).extend({'falseTimeout': 3000}).extend({'toggleSubscribe': [this,
				function (oPrev) {
					if (oPrev)
					{
						oPrev.deleteAccess(false);
					}
				}, function (oNext) {
					if (oNext)
					{
						oNext.deleteAccess(true);
					}
				}
			]});
		}

		AccountsUserSettings.prototype.scrollableOptions = function ()
		{
			return {
				handle: '.drag-handle'
			};
		};

		AccountsUserSettings.prototype.addNewAccount = function ()
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/AddAccount */ 67));
		};

		AccountsUserSettings.prototype.editAccount = function (oAccountItem)
		{
			if (oAccountItem && oAccountItem.canBeEdit())
			{
				__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/AddAccount */ 67), [oAccountItem]);
			}
		};

		/**
		 * @param {AccountModel} oAccountToRemove
		 */
		AccountsUserSettings.prototype.deleteAccount = function (oAccountToRemove)
		{
			if (oAccountToRemove && oAccountToRemove.deleteAccess())
			{
				this.accountForDeletion(null);

				var
					kn = __webpack_require__(/*! Knoin/Knoin */ 5),
					fRemoveAccount = function (oAccount) {
						return oAccountToRemove === oAccount;
					}
				;

				if (oAccountToRemove)
				{
					this.accounts.remove(fRemoveAccount);

					Remote.accountDelete(function (sResult, oData) {

						if (Enums.StorageResultType.Success === sResult && oData &&
							oData.Result && oData.Reload)
						{
							kn.routeOff();
							kn.setHash(Links.root(), true);
							kn.routeOff();

							_.defer(function () {
								window.location.reload();
							});
						}
						else
						{
							__webpack_require__(/*! App/User */ 6).accountsAndIdentities();
						}

					}, oAccountToRemove.email);
				}
			}
		};

		AccountsUserSettings.prototype.onBuild = function (oDom)
		{
			var self = this;

			oDom
				.on('click', '.account-item .e-action', function () {
					var oAccountItem = ko.dataFor(this);
					if (oAccountItem)
					{
						self.editAccount(oAccountItem);
					}
				})
			;
		};

		module.exports = AccountsUserSettings;

	}());

/***/ },
/* 121 */
/*!*********************************************!*\
  !*** ./dev/Settings/User/ChangePassword.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			Remote = __webpack_require__(/*! Storage/User/Remote */ 14)
		;

		/**
		 * @constructor
		 */
		function ChangePasswordUserSettings()
		{
			this.changeProcess = ko.observable(false);

			this.errorDescription = ko.observable('');
			this.passwordMismatch = ko.observable(false);
			this.passwordUpdateError = ko.observable(false);
			this.passwordUpdateSuccess = ko.observable(false);

			this.currentPassword = ko.observable('');
			this.currentPassword.error = ko.observable(false);
			this.newPassword = ko.observable('');
			this.newPassword2 = ko.observable('');

			this.currentPassword.subscribe(function () {
				this.passwordUpdateError(false);
				this.passwordUpdateSuccess(false);
				this.currentPassword.error(false);
			}, this);

			this.newPassword.subscribe(function () {
				this.passwordUpdateError(false);
				this.passwordUpdateSuccess(false);
				this.passwordMismatch(false);
			}, this);

			this.newPassword2.subscribe(function () {
				this.passwordUpdateError(false);
				this.passwordUpdateSuccess(false);
				this.passwordMismatch(false);
			}, this);

			this.saveNewPasswordCommand = Utils.createCommand(this, function () {

				if (this.newPassword() !== this.newPassword2())
				{
					this.passwordMismatch(true);
					this.errorDescription(Translator.i18n('SETTINGS_CHANGE_PASSWORD/ERROR_PASSWORD_MISMATCH'));
				}
				else
				{
					this.changeProcess(true);

					this.passwordUpdateError(false);
					this.passwordUpdateSuccess(false);
					this.currentPassword.error(false);
					this.passwordMismatch(false);
					this.errorDescription('');

					Remote.changePassword(this.onChangePasswordResponse, this.currentPassword(), this.newPassword());
				}

			}, function () {
				return !this.changeProcess() && '' !== this.currentPassword() &&
					'' !== this.newPassword() && '' !== this.newPassword2();
			});

			this.onChangePasswordResponse = _.bind(this.onChangePasswordResponse, this);
		}

		ChangePasswordUserSettings.prototype.onHide = function ()
		{
			this.changeProcess(false);
			this.currentPassword('');
			this.newPassword('');
			this.newPassword2('');
			this.errorDescription('');
			this.passwordMismatch(false);
			this.currentPassword.error(false);
		};

		ChangePasswordUserSettings.prototype.onChangePasswordResponse = function (sResult, oData)
		{
			this.changeProcess(false);
			this.passwordMismatch(false);
			this.errorDescription('');
			this.currentPassword.error(false);

			if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
			{
				this.currentPassword('');
				this.newPassword('');
				this.newPassword2('');

				this.passwordUpdateSuccess(true);
				this.currentPassword.error(false);
			}
			else
			{
				if (oData && Enums.Notification.CurrentPasswordIncorrect === oData.ErrorCode)
				{
					this.currentPassword.error(true);
				}

				this.passwordUpdateError(true);
				this.errorDescription(oData && oData.ErrorCode ? Translator.getNotification(oData.ErrorCode) :
					Translator.getNotification(Enums.Notification.CouldNotSaveNewPassword));
			}
		};

		module.exports = ChangePasswordUserSettings;

	}());

/***/ },
/* 122 */
/*!***************************************!*\
  !*** ./dev/Settings/User/Contacts.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			AppStore = __webpack_require__(/*! Stores/User/App */ 30),

			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),
			Data = __webpack_require__(/*! Storage/User/Data */ 15)
		;

		/**
		 * @constructor
		 */
		function ContactsUserSettings()
		{
			this.contactsAutosave = AppStore.contactsAutosave;

			this.allowContactsSync = Data.allowContactsSync;
			this.enableContactsSync = Data.enableContactsSync;
			this.contactsSyncUrl = Data.contactsSyncUrl;
			this.contactsSyncUser = Data.contactsSyncUser;
			this.contactsSyncPass = Data.contactsSyncPass;

			this.saveTrigger = ko.computed(function () {
				return [
					this.enableContactsSync() ? '1' : '0',
					this.contactsSyncUrl(),
					this.contactsSyncUser(),
					this.contactsSyncPass()
				].join('|');
			}, this).extend({'throttle': 500});
		}

		ContactsUserSettings.prototype.onBuild = function ()
		{
			this.contactsAutosave.subscribe(function (bValue) {
				Remote.saveSettings(null, {
					'ContactsAutosave': bValue ? '1' : '0'
				});
			});

			this.saveTrigger.subscribe(function () {
				Remote.saveContactsSyncData(null,
					this.enableContactsSync(),
					this.contactsSyncUrl(),
					this.contactsSyncUser(),
					this.contactsSyncPass()
				);
			}, this);
		};

		module.exports = ContactsUserSettings;

	}());

/***/ },
/* 123 */
/*!**************************************!*\
  !*** ./dev/Settings/User/Filters.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),
			_ = __webpack_require__(/*! _ */ 2),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			FilterStore = __webpack_require__(/*! Stores/User/Filter */ 83),

			Remote = __webpack_require__(/*! Storage/User/Remote */ 14)
		;

		/**
		 * @constructor
		 */
		function FiltersUserSettings()
		{
			var self = this;

			this.modules = FilterStore.modules;
			this.filters = FilterStore.filters;

			this.inited = ko.observable(false);
			this.serverError = ko.observable(false);
			this.serverErrorDesc = ko.observable('');
			this.haveChanges = ko.observable(false);

			this.processText = ko.observable('');
			this.saveErrorText = ko.observable('');

			this.visibility = ko.observable(false);

			this.filters.subscribe(Utils.windowResizeCallback);

			this.serverError.subscribe(function (bValue) {
				if (!bValue)
				{
					this.serverErrorDesc('');
				}
			}, this);

			this.filterRaw = FilterStore.raw;
			this.filterRaw.capa = FilterStore.capa;
			this.filterRaw.active = ko.observable(false);
			this.filterRaw.allow = ko.observable(false);
			this.filterRaw.error = ko.observable(false);

			this.processText = ko.computed(function () {
				return this.filters.loading() ? Translator.i18n('SETTINGS_FILTERS/LOADING_PROCESS') : '';
			}, this);

			this.visibility = ko.computed(function () {
				return '' === this.processText() ? 'hidden' : 'visible';
			}, this);

			this.filterForDeletion = ko.observable(null).extend({'falseTimeout': 3000}).extend(
				{'toggleSubscribeProperty': [this, 'deleteAccess']});

			this.saveChanges = Utils.createCommand(this, function () {

				if (!this.filters.saving())
				{
					if (this.filterRaw.active() && '' === Utils.trim(this.filterRaw()))
					{
						this.filterRaw.error(true);
						return false;
					}

					this.filters.saving(true);
					this.saveErrorText('');

					Remote.filtersSave(function (sResult, oData) {

						self.filters.saving(false);

						if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
						{
							self.haveChanges(false);
							self.updateList();
						}
						else
						{
							self.saveErrorText(oData && oData.ErrorCode ? Translator.getNotification(oData.ErrorCode) :
								Translator.getNotification(Enums.Notification.CantSaveFilters));
						}

					}, this.filters(), this.filterRaw(), this.filterRaw.active());
				}

				return true;

			}, function () {
				return this.haveChanges();
			});

			this.filters.subscribe(function () {
				this.haveChanges(true);
			}, this);

			this.filterRaw.subscribe(function () {
				this.haveChanges(true);
				this.filterRaw.error(false);
			}, this);

			this.filterRaw.active.subscribe(function () {
				this.haveChanges(true);
				this.filterRaw.error(false);
			}, this);
		}

		FiltersUserSettings.prototype.scrollableOptions = function ()
		{
			return {
				handle: '.drag-handle'
			};
		};

		FiltersUserSettings.prototype.updateList = function ()
		{
			var
				self = this,
				FilterModel = __webpack_require__(/*! Model/Filter */ 80)
			;

			if (!this.filters.loading())
			{
				this.filters.loading(true);

				Remote.filtersGet(function (sResult, oData) {

					self.filters.loading(false);
					self.serverError(false);

					if (Enums.StorageResultType.Success === sResult && oData &&
						oData.Result && Utils.isArray(oData.Result.Filters))
					{
						self.inited(true);
						self.serverError(false);

						var aResult = _.compact(_.map(oData.Result.Filters, function (aItem) {
							var oNew = new FilterModel();
							return (oNew && oNew.parse(aItem)) ? oNew : null;
						}));

						self.filters(aResult);

						self.modules(oData.Result.Modules ? oData.Result.Modules : {});

						self.filterRaw(oData.Result.Raw || '');
						self.filterRaw.capa(Utils.isArray(oData.Result.Capa) ? oData.Result.Capa.join(' ') : '');
						self.filterRaw.active(!!oData.Result.RawIsActive);
						self.filterRaw.allow(!!oData.Result.RawIsAllow);
					}
					else
					{
						self.filters([]);
						self.modules({});
						self.filterRaw('');
						self.filterRaw.capa({});

						self.serverError(true);
						self.serverErrorDesc(oData && oData.ErrorCode ? Translator.getNotification(oData.ErrorCode) :
							Translator.getNotification(Enums.Notification.CantGetFilters));
					}

					self.haveChanges(false);
				});
			}
		};

		FiltersUserSettings.prototype.deleteFilter = function (oFilter)
		{
			this.filters.remove(oFilter);
			Utils.delegateRunOnDestroy(oFilter);
		};

		FiltersUserSettings.prototype.addFilter = function ()
		{
			var
				self = this,
				FilterModel = __webpack_require__(/*! Model/Filter */ 80),
				oNew = new FilterModel()
			;

			oNew.generateID();
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(
				__webpack_require__(/*! View/Popup/Filter */ 87), [oNew, function  () {
					self.filters.push(oNew);
					self.filterRaw.active(false);
				}, false]);
		};

		FiltersUserSettings.prototype.editFilter = function (oEdit)
		{
			var
				self = this,
				oCloned = oEdit.cloneSelf()
			;

			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(
				__webpack_require__(/*! View/Popup/Filter */ 87), [oCloned, function  () {

					var
						aFilters = self.filters(),
						iIndex = aFilters.indexOf(oEdit)
					;

					if (-1 < iIndex && aFilters[iIndex])
					{
						Utils.delegateRunOnDestroy(aFilters[iIndex]);
						aFilters[iIndex] = oCloned;

						self.filters(aFilters);
						self.haveChanges(true);
					}

				}, true]);
		};

		FiltersUserSettings.prototype.onBuild = function (oDom)
		{
			var self = this;

			oDom
				.on('click', '.filter-item .e-action', function () {
					var oFilterItem = ko.dataFor(this);
					if (oFilterItem)
					{
						self.editFilter(oFilterItem);
					}
				})
			;
		};

		FiltersUserSettings.prototype.onShow = function ()
		{
			this.updateList();
		};

		module.exports = FiltersUserSettings;

	}());

/***/ },
/* 124 */
/*!**************************************!*\
  !*** ./dev/Settings/User/Folders.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Data = __webpack_require__(/*! Storage/User/Data */ 15),
			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),
			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),
			Local = __webpack_require__(/*! Storage/Client */ 60)
		;

		/**
		 * @constructor
		 */
		function FoldersUserSettings()
		{
			this.folderList = Data.folderList;

			this.processText = ko.computed(function () {

				var
					bLoading = Data.foldersLoading(),
					bCreating = Data.foldersCreating(),
					bDeleting = Data.foldersDeleting(),
					bRenaming = Data.foldersRenaming()
				;

				if (bCreating)
				{
					return Translator.i18n('SETTINGS_FOLDERS/CREATING_PROCESS');
				}
				else if (bDeleting)
				{
					return Translator.i18n('SETTINGS_FOLDERS/DELETING_PROCESS');
				}
				else if (bRenaming)
				{
					return Translator.i18n('SETTINGS_FOLDERS/RENAMING_PROCESS');
				}
				else if (bLoading)
				{
					return Translator.i18n('SETTINGS_FOLDERS/LOADING_PROCESS');
				}

				return '';

			}, this);

			this.visibility = ko.computed(function () {
				return '' === this.processText() ? 'hidden' : 'visible';
			}, this);

			this.folderForDeletion = ko.observable(null).extend({'falseTimeout': 3000}).extend({'toggleSubscribe': [this,
				function (oPrev) {
					if (oPrev)
					{
						oPrev.deleteAccess(false);
					}
				}, function (oNext) {
					if (oNext)
					{
						oNext.deleteAccess(true);
					}
				}
			]});

			this.folderForEdit = ko.observable(null).extend({'toggleSubscribe': [this,
				function (oPrev) {
					if (oPrev)
					{
						oPrev.edited(false);
					}
				}, function (oNext) {
					if (oNext && oNext.canBeEdited())
					{
						oNext.edited(true);
					}
				}
			]});

			this.useImapSubscribe = !!Settings.settingsGet('UseImapSubscribe');
		}

		FoldersUserSettings.prototype.folderEditOnEnter = function (oFolder)
		{
			var
				sEditName = oFolder ? Utils.trim(oFolder.nameForEdit()) : ''
			;

			if ('' !== sEditName && oFolder.name() !== sEditName)
			{
				Local.set(Enums.ClientSideKeyName.FoldersLashHash, '');

				Data.foldersRenaming(true);
				Remote.folderRename(function (sResult, oData) {

					Data.foldersRenaming(false);
					if (Enums.StorageResultType.Success !== sResult || !oData || !oData.Result)
					{
						Data.folderList.error(
							oData && oData.ErrorCode ? Translator.getNotification(oData.ErrorCode) : Translator.i18n('NOTIFICATIONS/CANT_RENAME_FOLDER'));
					}

					__webpack_require__(/*! App/User */ 6).folders();

				}, oFolder.fullNameRaw, sEditName);

				Cache.removeFolderFromCacheList(oFolder.fullNameRaw);

				oFolder.name(sEditName);
			}

			oFolder.edited(false);
		};

		FoldersUserSettings.prototype.folderEditOnEsc = function (oFolder)
		{
			if (oFolder)
			{
				oFolder.edited(false);
			}
		};

		FoldersUserSettings.prototype.onShow = function ()
		{
			Data.folderList.error('');
		};

		FoldersUserSettings.prototype.createFolder = function ()
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/FolderCreate */ 88));
		};

		FoldersUserSettings.prototype.systemFolder = function ()
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/FolderSystem */ 44));
		};

		FoldersUserSettings.prototype.deleteFolder = function (oFolderToRemove)
		{
			if (oFolderToRemove && oFolderToRemove.canBeDeleted() && oFolderToRemove.deleteAccess() &&
				0 === oFolderToRemove.privateMessageCountAll())
			{
				this.folderForDeletion(null);

				var
					fRemoveFolder = function (oFolder) {

						if (oFolderToRemove === oFolder)
						{
							return true;
						}

						oFolder.subFolders.remove(fRemoveFolder);
						return false;
					}
				;

				if (oFolderToRemove)
				{
					Local.set(Enums.ClientSideKeyName.FoldersLashHash, '');

					Data.folderList.remove(fRemoveFolder);

					Data.foldersDeleting(true);
					Remote.folderDelete(function (sResult, oData) {

						Data.foldersDeleting(false);
						if (Enums.StorageResultType.Success !== sResult || !oData || !oData.Result)
						{
							Data.folderList.error(
								oData && oData.ErrorCode ? Translator.getNotification(oData.ErrorCode) : Translator.i18n('NOTIFICATIONS/CANT_DELETE_FOLDER'));
						}

						__webpack_require__(/*! App/User */ 6).folders();

					}, oFolderToRemove.fullNameRaw);

					Cache.removeFolderFromCacheList(oFolderToRemove.fullNameRaw);
				}
			}
			else if (0 < oFolderToRemove.privateMessageCountAll())
			{
				Data.folderList.error(Translator.getNotification(Enums.Notification.CantDeleteNonEmptyFolder));
			}
		};

		FoldersUserSettings.prototype.subscribeFolder = function (oFolder)
		{
			Local.set(Enums.ClientSideKeyName.FoldersLashHash, '');
			Remote.folderSetSubscribe(Utils.emptyFunction, oFolder.fullNameRaw, true);

			oFolder.subScribed(true);
		};

		FoldersUserSettings.prototype.unSubscribeFolder = function (oFolder)
		{
			Local.set(Enums.ClientSideKeyName.FoldersLashHash, '');
			Remote.folderSetSubscribe(Utils.emptyFunction, oFolder.fullNameRaw, false);

			oFolder.subScribed(false);
		};

		module.exports = FoldersUserSettings;

	}());

/***/ },
/* 125 */
/*!**************************************!*\
  !*** ./dev/Settings/User/General.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			AppStore = __webpack_require__(/*! Stores/User/App */ 30),
			LanguageStore = __webpack_require__(/*! Stores/Language */ 31),
			SettingsStore = __webpack_require__(/*! Stores/User/Settings */ 26),
			NotificationStore = __webpack_require__(/*! Stores/User/Notification */ 66),

			Data = __webpack_require__(/*! Storage/User/Data */ 15),
			Remote = __webpack_require__(/*! Storage/User/Remote */ 14)
		;

		/**
		 * @constructor
		 */
		function GeneralUserSettings()
		{
			this.language = LanguageStore.language;
			this.messagesPerPage = SettingsStore.messagesPerPage;
			this.messagesPerPageArray = Consts.Defaults.MessagesPerPageArray;

			this.editorDefaultType = SettingsStore.editorDefaultType;
			this.layout = SettingsStore.layout;
			this.usePreviewPane = SettingsStore.usePreviewPane;

			this.soundNotificationIsSupported = NotificationStore.soundNotificationIsSupported;
			this.enableSoundNotification = NotificationStore.enableSoundNotification;

			this.enableDesktopNotification = NotificationStore.enableDesktopNotification;
			this.isDesktopNotificationSupported = NotificationStore.isDesktopNotificationSupported;
			this.isDesktopNotificationDenied = NotificationStore.isDesktopNotificationDenied;

			this.showImages = SettingsStore.showImages;
			this.useCheckboxesInList = SettingsStore.useCheckboxesInList;
			this.threadsAllowed = AppStore.threadsAllowed;
			this.useThreads = SettingsStore.useThreads;
			this.replySameFolder = SettingsStore.replySameFolder;
			this.allowLanguagesOnSettings = AppStore.allowLanguagesOnSettings;

			this.languageFullName = ko.computed(function () {
				return Utils.convertLangName(this.language());
			}, this);

			this.languageTrigger = ko.observable(Enums.SaveSettingsStep.Idle).extend({'throttle': 100});

			this.mppTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
			this.editorDefaultTypeTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
			this.layoutTrigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.isAnimationSupported = Globals.bAnimationSupported;

			this.editorDefaultTypes = ko.computed(function () {
				Translator.trigger();
				return [
					{'id': Enums.EditorDefaultType.Html, 'name': Translator.i18n('SETTINGS_GENERAL/LABEL_EDITOR_HTML')},
					{'id': Enums.EditorDefaultType.Plain, 'name': Translator.i18n('SETTINGS_GENERAL/LABEL_EDITOR_PLAIN')},
					{'id': Enums.EditorDefaultType.HtmlForced, 'name': Translator.i18n('SETTINGS_GENERAL/LABEL_EDITOR_HTML_FORCED')},
					{'id': Enums.EditorDefaultType.PlainForced, 'name': Translator.i18n('SETTINGS_GENERAL/LABEL_EDITOR_PLAIN_FORCED')}
				];
			}, this);

			this.layoutTypes = ko.computed(function () {
				Translator.trigger();
				return [
					{'id': Enums.Layout.NoPreview, 'name': Translator.i18n('SETTINGS_GENERAL/LABEL_LAYOUT_NO_SPLIT')},
					{'id': Enums.Layout.SidePreview, 'name': Translator.i18n('SETTINGS_GENERAL/LABEL_LAYOUT_VERTICAL_SPLIT')},
					{'id': Enums.Layout.BottomPreview, 'name': Translator.i18n('SETTINGS_GENERAL/LABEL_LAYOUT_HORIZONTAL_SPLIT')}
				];
			}, this);
		}

		GeneralUserSettings.prototype.testSoundNotification = function ()
		{
			NotificationStore.playSoundNotification(true);
		};

		GeneralUserSettings.prototype.onBuild = function ()
		{
			var self = this;

			_.delay(function () {

				var
					f0 = Utils.settingsSaveHelperSimpleFunction(self.editorDefaultTypeTrigger, self),
					f1 = Utils.settingsSaveHelperSimpleFunction(self.mppTrigger, self),
					f2 = Utils.settingsSaveHelperSimpleFunction(self.layoutTrigger, self),
					fReloadLanguageHelper = function (iSaveSettingsStep) {
						return function() {
							self.languageTrigger(iSaveSettingsStep);
							_.delay(function () {
								self.languageTrigger(Enums.SaveSettingsStep.Idle);
							}, 1000);
						};
					}
				;

				self.language.subscribe(function (sValue) {

					self.languageTrigger(Enums.SaveSettingsStep.Animate);

					Translator.reload(sValue,
						fReloadLanguageHelper(Enums.SaveSettingsStep.TrueResult),
						fReloadLanguageHelper(Enums.SaveSettingsStep.FalseResult));

					Remote.saveSettings(null, {
						'Language': sValue
					});
				});

				self.editorDefaultType.subscribe(function (sValue) {
					Remote.saveSettings(f0, {
						'EditorDefaultType': sValue
					});
				});

				self.messagesPerPage.subscribe(function (iValue) {
					Remote.saveSettings(f1, {
						'MPP': iValue
					});
				});

				self.showImages.subscribe(function (bValue) {
					Remote.saveSettings(null, {
						'ShowImages': bValue ? '1' : '0'
					});
				});

				self.enableDesktopNotification.subscribe(function (bValue) {
					Utils.timeOutAction('SaveDesktopNotifications', function () {
						Remote.saveSettings(null, {
							'DesktopNotifications': bValue ? '1' : '0'
						});
					}, 3000);
				});

				self.enableSoundNotification.subscribe(function (bValue) {
					Utils.timeOutAction('SaveSoundNotification', function () {
						Remote.saveSettings(null, {
							'SoundNotification': bValue ? '1' : '0'
						});
					}, 3000);
				});

				self.replySameFolder.subscribe(function (bValue) {
					Utils.timeOutAction('SaveReplySameFolder', function () {
						Remote.saveSettings(null, {
							'ReplySameFolder': bValue ? '1' : '0'
						});
					}, 3000);
				});

				self.useThreads.subscribe(function (bValue) {

					Data.messageList([]);

					Remote.saveSettings(null, {
						'UseThreads': bValue ? '1' : '0'
					});
				});

				self.layout.subscribe(function (nValue) {

					Data.messageList([]);

					Remote.saveSettings(f2, {
						'Layout': nValue
					});
				});

				self.useCheckboxesInList.subscribe(function (bValue) {
					Remote.saveSettings(null, {
						'UseCheckboxesInList': bValue ? '1' : '0'
					});
				});

			}, 50);
		};

		GeneralUserSettings.prototype.onShow = function ()
		{
			this.enableDesktopNotification.valueHasMutated();
		};

		GeneralUserSettings.prototype.selectLanguage = function ()
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/Languages */ 45));
		};

		module.exports = GeneralUserSettings;

	}());

/***/ },
/* 126 */
/*!*****************************************!*\
  !*** ./dev/Settings/User/Identities.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			HtmlEditor = __webpack_require__(/*! Common/HtmlEditor */ 47),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			AccountStore = __webpack_require__(/*! Stores/User/Account */ 22),
			IdentityStore = __webpack_require__(/*! Stores/User/Identity */ 43),

			Remote = __webpack_require__(/*! Storage/User/Remote */ 14)
		;

		/**
		 * @constructor
		 */
		function IdentitiesUserSettings()
		{
			this.editor = null;
			this.defautOptionsAfterRender = Utils.defautOptionsAfterRender;

			this.accountEmail = AccountStore.email;

			this.displayName = AccountStore.displayName;
			this.signature = AccountStore.signature;
			this.replyTo = AccountStore.replyTo;

			this.signatureDom = ko.observable(null);

			this.defaultIdentityIDTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
			this.displayNameTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
			this.replyTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
			this.signatureTrigger = ko.observable(Enums.SaveSettingsStep.Idle);

			this.identities = IdentityStore.identities;
			this.defaultIdentityID = IdentityStore.defaultIdentityID;

			this.identitiesOptions = ko.computed(function () {

				var
					aList = IdentityStore.identities(),
					aResult = []
				;

				if (0 < aList.length)
				{
					aResult.push({
						'id': AccountStore.email.peek(),
						'name': this.formattedAccountIdentity(),
						'seporator': false
					});

					aResult.push({
						'id': '---',
						'name': '---',
						'seporator': true,
						'disabled': true
					});

					_.each(aList, function (oItem) {
						aResult.push({
							'id': oItem.id,
							'name': oItem.formattedNameForEmail(),
							'seporator': false
						});
					});
				}

				return aResult;
			}, this);

			this.processText = ko.computed(function () {
				return IdentityStore.identities.loading() ? Translator.i18n('SETTINGS_IDENTITIES/LOADING_PROCESS') : '';
			}, this);

			this.visibility = ko.computed(function () {
				return '' === this.processText() ? 'hidden' : 'visible';
			}, this);

			this.identityForDeletion = ko.observable(null).extend({'falseTimeout': 3000}).extend({'toggleSubscribe': [this,
				function (oPrev) {
					if (oPrev)
					{
						oPrev.deleteAccess(false);
					}
				}, function (oNext) {
					if (oNext)
					{
						oNext.deleteAccess(true);
					}
				}
			]});
		}

		/**
		 *
		 * @return {string}
		 */
		IdentitiesUserSettings.prototype.formattedAccountIdentity = function ()
		{
			var
				sDisplayName = AccountStore.displayName.peek(),
				sEmail = AccountStore.email.peek()
			;

			return '' === sDisplayName ? sEmail : '"' + Utils.quoteName(sDisplayName) + '" <' + sEmail + '>';
		};

		IdentitiesUserSettings.prototype.addNewIdentity = function ()
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/Identity */ 89));
		};

		IdentitiesUserSettings.prototype.editIdentity = function (oIdentity)
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/Identity */ 89), [oIdentity]);
		};

		/**
		 * @param {IdentityModel} oIdentityToRemove
		 */
		IdentitiesUserSettings.prototype.deleteIdentity = function (oIdentityToRemove)
		{
			if (oIdentityToRemove && oIdentityToRemove.deleteAccess())
			{
				this.identityForDeletion(null);

				if (oIdentityToRemove)
				{
					IdentityStore.identities.remove(function (oIdentity) {
						return oIdentityToRemove === oIdentity;
					});

					Remote.identityDelete(function () {
						__webpack_require__(/*! App/User */ 6).accountsAndIdentities();
					}, oIdentityToRemove.id);
				}
			}
		};

		IdentitiesUserSettings.prototype.onFocus = function ()
		{
			if (!this.editor && this.signatureDom())
			{
				var
					self = this,
					sSignature = AccountStore.signature()
				;

				this.editor = new HtmlEditor(self.signatureDom(), function () {
					AccountStore.signature(
						(self.editor.isHtml() ? ':HTML:' : '') + self.editor.getData()
					);
				}, function () {
					if (':HTML:' === sSignature.substr(0, 6))
					{
						self.editor.setHtml(sSignature.substr(6), false);
					}
					else
					{
						self.editor.setPlain(sSignature, false);
					}
				});
			}
		};

		IdentitiesUserSettings.prototype.onBuild = function (oDom)
		{
			var self = this;

			oDom
				.on('click', '.identity-item .e-action', function () {
					var oIdentityItem = ko.dataFor(this);
					if (oIdentityItem)
					{
						self.editIdentity(oIdentityItem);
					}
				})
			;

			_.delay(function () {

				var
					f1 = Utils.settingsSaveHelperSimpleFunction(self.displayNameTrigger, self),
					f2 = Utils.settingsSaveHelperSimpleFunction(self.replyTrigger, self),
					f3 = Utils.settingsSaveHelperSimpleFunction(self.signatureTrigger, self),
					f4 = Utils.settingsSaveHelperSimpleFunction(self.defaultIdentityIDTrigger, self)
				;

				IdentityStore.defaultIdentityID.subscribe(function (sValue) {
					Remote.saveSettings(f4, {
						'DefaultIdentityID': sValue
					});
				});

				AccountStore.displayName.subscribe(function (sValue) {
					Remote.saveSettings(f1, {
						'DisplayName': sValue
					});
				});

				AccountStore.replyTo.subscribe(function (sValue) {
					Remote.saveSettings(f2, {
						'ReplyTo': sValue
					});
				});

				AccountStore.signature.subscribe(function (sValue) {
					Remote.saveSettings(f3, {
						'Signature': sValue
					});
				});

			}, 50);
		};

		module.exports = IdentitiesUserSettings;

	}());

/***/ },
/* 127 */
/*!***************************************!*\
  !*** ./dev/Settings/User/Identity.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			HtmlEditor = __webpack_require__(/*! Common/HtmlEditor */ 47),

			AccountStore = __webpack_require__(/*! Stores/User/Account */ 22),

			Remote = __webpack_require__(/*! Storage/User/Remote */ 14)
		;

		/**
		 * @constructor
		 */
		function IdentityUserSettings()
		{
			this.editor = null;

			this.displayName = AccountStore.displayName;
			this.signature = AccountStore.signature;
			this.replyTo = AccountStore.replyTo;

			this.signatureDom = ko.observable(null);

			this.displayNameTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
			this.replyTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
			this.signatureTrigger = ko.observable(Enums.SaveSettingsStep.Idle);
		}

		IdentityUserSettings.prototype.onFocus = function ()
		{
			if (!this.editor && this.signatureDom())
			{
				var
					self = this,
					sSignature = AccountStore.signature()
				;

				this.editor = new HtmlEditor(self.signatureDom(), function () {
					AccountStore.signature(
						(self.editor.isHtml() ? ':HTML:' : '') + self.editor.getData()
					);
				}, function () {
					if (':HTML:' === sSignature.substr(0, 6))
					{
						self.editor.setHtml(sSignature.substr(6), false);
					}
					else
					{
						self.editor.setPlain(sSignature, false);
					}
				});
			}
		};

		IdentityUserSettings.prototype.onBuild = function ()
		{
			var self = this;
			_.delay(function () {

				var
					f1 = Utils.settingsSaveHelperSimpleFunction(self.displayNameTrigger, self),
					f2 = Utils.settingsSaveHelperSimpleFunction(self.replyTrigger, self),
					f3 = Utils.settingsSaveHelperSimpleFunction(self.signatureTrigger, self)
				;

				AccountStore.displayName.subscribe(function (sValue) {
					Remote.saveSettings(f1, {
						'DisplayName': sValue
					});
				});

				AccountStore.replyTo.subscribe(function (sValue) {
					Remote.saveSettings(f2, {
						'ReplyTo': sValue
					});
				});

				AccountStore.signature.subscribe(function (sValue) {
					Remote.saveSettings(f3, {
						'Signature': sValue
					});
				});

			}, 50);
		};

		module.exports = IdentityUserSettings;

	}());

/***/ },
/* 128 */
/*!**************************************!*\
  !*** ./dev/Settings/User/OpenPgp.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),

			PgpStore = __webpack_require__(/*! Stores/User/Pgp */ 20)
		;

		/**
		 * @constructor
		 */
		function OpenPgpUserSettings()
		{
			this.openpgpkeys = PgpStore.openpgpkeys;
			this.openpgpkeysPublic = PgpStore.openpgpkeysPublic;
			this.openpgpkeysPrivate = PgpStore.openpgpkeysPrivate;

			this.openPgpKeyForDeletion = ko.observable(null).extend({'falseTimeout': 3000}).extend({'toggleSubscribe': [this,
				function (oPrev) {
					if (oPrev)
					{
						oPrev.deleteAccess(false);
					}
				}, function (oNext) {
					if (oNext)
					{
						oNext.deleteAccess(true);
					}
				}
			]});
		}

		OpenPgpUserSettings.prototype.addOpenPgpKey = function ()
		{
			kn.showScreenPopup(__webpack_require__(/*! View/Popup/AddOpenPgpKey */ 135));
		};

		OpenPgpUserSettings.prototype.generateOpenPgpKey = function ()
		{
			kn.showScreenPopup(__webpack_require__(/*! View/Popup/NewOpenPgpKey */ 139));
		};

		OpenPgpUserSettings.prototype.viewOpenPgpKey = function (oOpenPgpKey)
		{
			if (oOpenPgpKey)
			{
				kn.showScreenPopup(__webpack_require__(/*! View/Popup/ViewOpenPgpKey */ 142), [oOpenPgpKey]);
			}
		};

		/**
		 * @param {OpenPgpKeyModel} oOpenPgpKeyToRemove
		 */
		OpenPgpUserSettings.prototype.deleteOpenPgpKey = function (oOpenPgpKeyToRemove)
		{
			if (oOpenPgpKeyToRemove && oOpenPgpKeyToRemove.deleteAccess())
			{
				this.openPgpKeyForDeletion(null);

				if (oOpenPgpKeyToRemove && PgpStore.openpgpKeyring)
				{
					var oFindedItem = _.find(PgpStore.openpgpkeys(), function (oOpenPgpKey) {
						return oOpenPgpKeyToRemove === oOpenPgpKey;
					});

					if (oFindedItem)
					{
						PgpStore.openpgpkeys.remove(oFindedItem);
						Utils.delegateRunOnDestroy(oFindedItem);

						PgpStore.openpgpKeyring[oFindedItem.isPrivate ? 'privateKeys' : 'publicKeys']
							.removeForId(oFindedItem.guid);

						PgpStore.openpgpKeyring.store();
					}

					__webpack_require__(/*! App/User */ 6).reloadOpenPgpKeys();
				}
			}
		};

		module.exports = OpenPgpUserSettings;

	}());

/***/ },
/* 129 */
/*!***************************************!*\
  !*** ./dev/Settings/User/Security.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			Remote = __webpack_require__(/*! Storage/User/Remote */ 14)
		;

		/**
		 * @constructor
		 */
		function SecurityUserSettings()
		{
			this.processing = ko.observable(false);
			this.clearing = ko.observable(false);
			this.secreting = ko.observable(false);

			this.viewUser = ko.observable('');
			this.viewEnable = ko.observable(false);
			this.viewEnable.subs = true;
			this.twoFactorStatus = ko.observable(false);

			this.viewSecret = ko.observable('');
			this.viewBackupCodes = ko.observable('');
			this.viewUrl = ko.observable('');

			this.bFirst = true;

			this.viewTwoFactorStatus = ko.computed(function () {
				Translator.trigger();
				return Translator.i18n(
					this.twoFactorStatus() ?
						'SETTINGS_SECURITY/TWO_FACTOR_SECRET_CONFIGURED_DESC' :
						'SETTINGS_SECURITY/TWO_FACTOR_SECRET_NOT_CONFIGURED_DESC'
				);
			}, this);

			this.onResult = _.bind(this.onResult, this);
			this.onSecretResult = _.bind(this.onSecretResult, this);
		}

		SecurityUserSettings.prototype.showSecret = function ()
		{
			this.secreting(true);
			Remote.showTwoFactorSecret(this.onSecretResult);
		};

		SecurityUserSettings.prototype.hideSecret = function ()
		{
			this.viewSecret('');
			this.viewBackupCodes('');
			this.viewUrl('');
		};

		SecurityUserSettings.prototype.createTwoFactor = function ()
		{
			this.processing(true);
			Remote.createTwoFactor(this.onResult);
		};

		SecurityUserSettings.prototype.testTwoFactor = function ()
		{
			__webpack_require__(/*! Knoin/Knoin */ 5).showScreenPopup(__webpack_require__(/*! View/Popup/TwoFactorTest */ 141));
		};

		SecurityUserSettings.prototype.clearTwoFactor = function ()
		{
			this.viewSecret('');
			this.viewBackupCodes('');
			this.viewUrl('');

			this.clearing(true);
			Remote.clearTwoFactor(this.onResult);
		};

		SecurityUserSettings.prototype.onShow = function ()
		{
			this.viewSecret('');
			this.viewBackupCodes('');
			this.viewUrl('');
		};

		SecurityUserSettings.prototype.onResult = function (sResult, oData)
		{
			this.processing(false);
			this.clearing(false);

			if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
			{
				this.viewUser(Utils.pString(oData.Result.User));
				this.viewEnable(!!oData.Result.Enable);
				this.twoFactorStatus(!!oData.Result.IsSet);

				this.viewSecret(Utils.pString(oData.Result.Secret));
				this.viewBackupCodes(Utils.pString(oData.Result.BackupCodes).replace(/[\s]+/g, '  '));
				this.viewUrl(Utils.pString(oData.Result.Url));
			}
			else
			{
				this.viewUser('');
				this.viewEnable(false);
				this.twoFactorStatus(false);

				this.viewSecret('');
				this.viewBackupCodes('');
				this.viewUrl('');
			}

			if (this.bFirst)
			{
				this.bFirst = false;

				var self = this;
				this.viewEnable.subscribe(function (bValue) {
					if (this.viewEnable.subs)
					{
						Remote.enableTwoFactor(function (sResult, oData) {
							if (Enums.StorageResultType.Success !== sResult || !oData || !oData.Result)
							{
								self.viewEnable.subs = false;
								self.viewEnable(false);
								self.viewEnable.subs = true;
							}
						}, bValue);
					}
				}, this);
			}
		};

		SecurityUserSettings.prototype.onSecretResult = function (sResult, oData)
		{
			this.secreting(false);

			if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
			{
				this.viewSecret(Utils.pString(oData.Result.Secret));
				this.viewUrl(Utils.pString(oData.Result.Url));
			}
			else
			{
				this.viewSecret('');
				this.viewUrl('');
			}
		};

		SecurityUserSettings.prototype.onBuild = function ()
		{
			this.processing(true);
			Remote.getTwoFactor(this.onResult);
		};

		module.exports = SecurityUserSettings;

	}());

/***/ },
/* 130 */
/*!*************************************!*\
  !*** ./dev/Settings/User/Social.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		/**
		 * @constructor
		 */
		function SocialUserSettings()
		{
			var
				Utils = __webpack_require__(/*! Common/Utils */ 1),
				SocialStore = __webpack_require__(/*! Stores/Social */ 35)
			;

			this.googleEnable = SocialStore.google.enabled;
			this.googleEnableAuth = SocialStore.google.capa.auth;
			this.googleEnableDrive = SocialStore.google.capa.drive;
			this.googleEnablePreview = SocialStore.google.capa.preview;

			this.googleActions = SocialStore.google.loading;
			this.googleLoggined = SocialStore.google.loggined;
			this.googleUserName = SocialStore.google.userName;

			this.facebookEnable = SocialStore.facebook.enabled;

			this.facebookActions = SocialStore.facebook.loading;
			this.facebookLoggined = SocialStore.facebook.loggined;
			this.facebookUserName = SocialStore.facebook.userName;

			this.twitterEnable = SocialStore.twitter.enabled;

			this.twitterActions = SocialStore.twitter.loading;
			this.twitterLoggined = SocialStore.twitter.loggined;
			this.twitterUserName = SocialStore.twitter.userName;

			this.connectGoogle = Utils.createCommand(this, function () {
				if (!this.googleLoggined())
				{
					__webpack_require__(/*! App/User */ 6).googleConnect();
				}
			}, function () {
				return !this.googleLoggined() && !this.googleActions();
			});

			this.disconnectGoogle = Utils.createCommand(this, function () {
				__webpack_require__(/*! App/User */ 6).googleDisconnect();
			});

			this.connectFacebook = Utils.createCommand(this, function () {
				if (!this.facebookLoggined())
				{
					__webpack_require__(/*! App/User */ 6).facebookConnect();
				}
			}, function () {
				return !this.facebookLoggined() && !this.facebookActions();
			});

			this.disconnectFacebook = Utils.createCommand(this, function () {
				__webpack_require__(/*! App/User */ 6).facebookDisconnect();
			});

			this.connectTwitter = Utils.createCommand(this, function () {
				if (!this.twitterLoggined())
				{
					__webpack_require__(/*! App/User */ 6).twitterConnect();
				}
			}, function () {
				return !this.twitterLoggined() && !this.twitterActions();
			});

			this.disconnectTwitter = Utils.createCommand(this, function () {
				__webpack_require__(/*! App/User */ 6).twitterDisconnect();
			});
		}

		module.exports = SocialUserSettings;

	}());

/***/ },
/* 131 */
/*!*************************************!*\
  !*** ./dev/Settings/User/Themes.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Jua = __webpack_require__(/*! Jua */ 74),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 12),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			ThemeStore = __webpack_require__(/*! Stores/Theme */ 39),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Remote = __webpack_require__(/*! Storage/User/Remote */ 14)
		;

		/**
		 * @constructor
		 */
		function ThemesUserSettings()
		{
			this.theme = ThemeStore.theme;
			this.themes = ThemeStore.themes;
			this.themesObjects = ko.observableArray([]);

			this.background = {};
			this.background.name = ThemeStore.themeBackgroundName;
			this.background.hash = ThemeStore.themeBackgroundHash;
			this.background.uploaderButton = ko.observable(null);
			this.background.loading = ko.observable(false);
			this.background.error = ko.observable('');

			this.capaUserBackground = ko.observable(Settings.capa(Enums.Capa.UserBackground));

			this.themeTrigger = ko.observable(Enums.SaveSettingsStep.Idle).extend({'throttle': 100});

			this.iTimer = 0;
			this.oThemeAjaxRequest = null;

			this.theme.subscribe(function (sValue) {

				_.each(this.themesObjects(), function (oTheme) {
					oTheme.selected(sValue === oTheme.name);
				});

				Utils.changeTheme(sValue, this.background.hash(), this.themeTrigger, Links);

				Remote.saveSettings(null, {
					'Theme': sValue
				});

			}, this);

			this.background.hash.subscribe(function (sValue) {
				Utils.changeTheme(this.theme(), sValue, this.themeTrigger, Links);
			}, this);
		}

		ThemesUserSettings.prototype.onBuild = function ()
		{
			var sCurrentTheme = this.theme();
			this.themesObjects(_.map(this.themes(), function (sTheme) {
				return {
					'name': sTheme,
					'nameDisplay': Utils.convertThemeName(sTheme),
					'selected': ko.observable(sTheme === sCurrentTheme),
					'themePreviewSrc': Links.themePreviewLink(sTheme)
				};
			}));

			this.initUploader();
		};

		ThemesUserSettings.prototype.onShow = function ()
		{
			this.background.error('');
		};

		ThemesUserSettings.prototype.clearBackground = function ()
		{
			if (this.capaUserBackground())
			{
				var self = this;
				Remote.clearUserBackground(function () {
					self.background.name('');
					self.background.hash('');
				});
			}
		};

		ThemesUserSettings.prototype.initUploader = function ()
		{
			if (this.background.uploaderButton() && this.capaUserBackground())
			{
				var
					oJua = new Jua({
						'action': Links.uploadBackground(),
						'name': 'uploader',
						'queueSize': 1,
						'multipleSizeLimit': 1,
						'disableDragAndDrop': true,
						'disableMultiple': true,
						'clickElement': this.background.uploaderButton()
					})
				;

				oJua
					.on('onStart', _.bind(function () {

						this.background.loading(true);
						this.background.error('');

						return true;

					}, this))
					.on('onComplete', _.bind(function (sId, bResult, oData) {

						this.background.loading(false);

						if (bResult && sId && oData && oData.Result && oData.Result.Name && oData.Result.Hash)
						{
							this.background.name(oData.Result.Name);
							this.background.hash(oData.Result.Hash);
						}
						else
						{
							this.background.name('');
							this.background.hash('');

							var sError = '';
							if (oData.ErrorCode)
							{
								switch (oData.ErrorCode)
								{
									case Enums.UploadErrorCode.FileIsTooBig:
										sError = Translator.i18n('SETTINGS_THEMES/ERROR_FILE_IS_TOO_BIG');
										break;
									case Enums.UploadErrorCode.FileType:
										sError = Translator.i18n('SETTINGS_THEMES/ERROR_FILE_TYPE_ERROR');
										break;
								}
							}

							if (!sError && oData.ErrorMessage)
							{
								sError = oData.ErrorMessage;
							}

							this.background.error(sError || Translator.i18n('SETTINGS_THEMES/ERROR_UNKNOWN'));
						}

						return true;

					}, this))
				;
			}
		};

		module.exports = ThemesUserSettings;

	}());

/***/ },
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */
/*!*****************************************!*\
  !*** ./dev/View/Popup/AddOpenPgpKey.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			PgpStore = __webpack_require__(/*! Stores/User/Pgp */ 20),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function AddOpenPgpKeyPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsAddOpenPgpKey');

			this.key = ko.observable('');
			this.key.error = ko.observable(false);
			this.key.focus = ko.observable(false);

			this.key.subscribe(function () {
				this.key.error(false);
			}, this);

			this.addOpenPgpKeyCommand = Utils.createCommand(this, function () {

				var
					iCount = 30,
					aMatch = null,
					sKey = Utils.trim(this.key()),
					oReg = /[\-]{3,6}BEGIN[\s]PGP[\s](PRIVATE|PUBLIC)[\s]KEY[\s]BLOCK[\-]{3,6}[\s\S]+?[\-]{3,6}END[\s]PGP[\s](PRIVATE|PUBLIC)[\s]KEY[\s]BLOCK[\-]{3,6}/gi,
					oOpenpgpKeyring = PgpStore.openpgpKeyring
				;

				sKey = sKey.replace(/[\r\n]([a-zA-Z0-9]{2,}:[^\r\n]+)[\r\n]+([a-zA-Z0-9\/\\+=]{10,})/g, '\n$1!-!N!-!$2')
					.replace(/[\n\r]+/g, '\n').replace(/!-!N!-!/g, '\n\n');

				this.key.error('' === sKey);

				if (!oOpenpgpKeyring || this.key.error())
				{
					return false;
				}

				do
				{
					aMatch = oReg.exec(sKey);
					if (!aMatch || 0 > iCount)
					{
						break;
					}

					if (aMatch[0] && aMatch[1] && aMatch[2] && aMatch[1] === aMatch[2])
					{
						if ('PRIVATE' === aMatch[1])
						{
							oOpenpgpKeyring.privateKeys.importKey(aMatch[0]);
						}
						else if ('PUBLIC' === aMatch[1])
						{
							oOpenpgpKeyring.publicKeys.importKey(aMatch[0]);
						}
					}

					iCount--;
				}
				while (true);

				oOpenpgpKeyring.store();

				__webpack_require__(/*! App/User */ 6).reloadOpenPgpKeys();
				Utils.delegateRun(this, 'cancelCommand');

				return true;
			});

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/AddOpenPgpKey', 'PopupsAddOpenPgpKeyViewModel'], AddOpenPgpKeyPopupView);
		_.extend(AddOpenPgpKeyPopupView.prototype, AbstractView.prototype);

		AddOpenPgpKeyPopupView.prototype.clearPopup = function ()
		{
			this.key('');
			this.key.error(false);
		};

		AddOpenPgpKeyPopupView.prototype.onShow = function ()
		{
			this.clearPopup();
		};

		AddOpenPgpKeyPopupView.prototype.onFocus = function ()
		{
			this.key.focus(true);
		};

		module.exports = AddOpenPgpKeyPopupView;

	}());

/***/ },
/* 136 */
/*!******************************************!*\
  !*** ./dev/View/Popup/AdvancedSearch.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),
			moment = __webpack_require__(/*! moment */ 36),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			Data = __webpack_require__(/*! Storage/User/Data */ 15),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function AdvancedSearchPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsAdvancedSearch');

			this.fromFocus = ko.observable(false);

			this.from = ko.observable('');
			this.to = ko.observable('');
			this.subject = ko.observable('');
			this.text = ko.observable('');
			this.selectedDateValue = ko.observable(-1);

			this.hasAttachment = ko.observable(false);
			this.starred = ko.observable(false);
			this.unseen = ko.observable(false);

			this.searchCommand = Utils.createCommand(this, function () {

				var sSearch = this.buildSearchString();
				if ('' !== sSearch)
				{
					Data.mainMessageListSearch(sSearch);
				}

				this.cancelCommand();
			});

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/AdvancedSearch', 'PopupsAdvancedSearchViewModel'], AdvancedSearchPopupView);
		_.extend(AdvancedSearchPopupView.prototype, AbstractView.prototype);

		AdvancedSearchPopupView.prototype.buildSearchStringValue = function (sValue)
		{
			if (-1 < sValue.indexOf(' '))
			{
				sValue = '"' + sValue + '"';
			}

			return sValue;
		};

		AdvancedSearchPopupView.prototype.buildSearchString = function ()
		{
			var
				aResult = [],
				sFrom = Utils.trim(this.from()),
				sTo = Utils.trim(this.to()),
				sSubject = Utils.trim(this.subject()),
				sText = Utils.trim(this.text()),
				aIs = [],
				aHas = []
			;

			if (sFrom && '' !== sFrom)
			{
				aResult.push('from:' + this.buildSearchStringValue(sFrom));
			}

			if (sTo && '' !== sTo)
			{
				aResult.push('to:' + this.buildSearchStringValue(sTo));
			}

			if (sSubject && '' !== sSubject)
			{
				aResult.push('subject:' + this.buildSearchStringValue(sSubject));
			}

			if (this.hasAttachment())
			{
				aHas.push('attachment');
			}

			if (this.unseen())
			{
				aIs.push('unseen');
			}

			if (this.starred())
			{
				aIs.push('flagged');
			}

			if (0 < aHas.length)
			{
				aResult.push('has:' + aHas.join(','));
			}

			if (0 < aIs.length)
			{
				aResult.push('is:' + aIs.join(','));
			}

			if (-1 < this.selectedDateValue())
			{
				aResult.push('date:' + moment().subtract('days', this.selectedDateValue()).format('YYYY.MM.DD') + '/');
			}

			if (sText && '' !== sText)
			{
				aResult.push('text:' + this.buildSearchStringValue(sText));
			}

			return Utils.trim(aResult.join(' '));
		};

		AdvancedSearchPopupView.prototype.clearPopup = function ()
		{
			this.from('');
			this.to('');
			this.subject('');
			this.text('');

			this.selectedDateValue(-1);
			this.hasAttachment(false);
			this.starred(false);
			this.unseen(false);

			this.fromFocus(true);
		};

		AdvancedSearchPopupView.prototype.onShow = function ()
		{
			this.clearPopup();
		};

		AdvancedSearchPopupView.prototype.onFocus = function ()
		{
			this.fromFocus(true);
		};

		module.exports = AdvancedSearchPopupView;

	}());

/***/ },
/* 137 */
/*!******************************************!*\
  !*** ./dev/View/Popup/ComposeOpenPgp.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),
			key = __webpack_require__(/*! key */ 21),

			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			Data = __webpack_require__(/*! Storage/User/Data */ 15),
			PgpStore = __webpack_require__(/*! Stores/User/Pgp */ 20),

			EmailModel = __webpack_require__(/*! Model/Email */ 25),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function ComposeOpenPgpPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsComposeOpenPgp');

			this.notification = ko.observable('');

			this.sign = ko.observable(true);
			this.encrypt = ko.observable(true);

			this.password = ko.observable('');
			this.password.focus = ko.observable(false);
			this.buttonFocus = ko.observable(false);

			this.from = ko.observable('');
			this.to = ko.observableArray([]);
			this.text = ko.observable('');

			this.resultCallback = null;

			this.submitRequest = ko.observable(false);

			// commands
			this.doCommand = Utils.createCommand(this, function () {

				var
					self = this,
					bResult = true,
					oPrivateKey = null,
					aPublicKeys = []
				;

				this.submitRequest(true);

				if (bResult && this.sign() && '' === this.from())
				{
					this.notification(Translator.i18n('PGP_NOTIFICATIONS/SPECIFY_FROM_EMAIL'));
					bResult = false;
				}

				if (bResult && this.sign())
				{
					oPrivateKey = Data.findPrivateKeyByEmail(this.from(), this.password());
					if (!oPrivateKey)
					{
						this.notification(Translator.i18n('PGP_NOTIFICATIONS/NO_PRIVATE_KEY_FOUND_FOR', {
							'EMAIL': this.from()
						}));

						bResult = false;
					}
				}

				if (bResult && this.encrypt() && 0 === this.to().length)
				{
					this.notification(Translator.i18n('PGP_NOTIFICATIONS/SPECIFY_AT_LEAST_ONE_RECIPIENT'));
					bResult = false;
				}

				if (bResult && this.encrypt())
				{
					aPublicKeys = [];
					_.each(this.to(), function (sEmail) {
						var aKeys = Data.findPublicKeysByEmail(sEmail);
						if (0 === aKeys.length && bResult)
						{
							self.notification(Translator.i18n('PGP_NOTIFICATIONS/NO_PUBLIC_KEYS_FOUND_FOR', {
								'EMAIL': sEmail
							}));

							bResult = false;
						}

						aPublicKeys = aPublicKeys.concat(aKeys);
					});

					if (bResult && (0 === aPublicKeys.length || this.to().length !== aPublicKeys.length))
					{
						bResult = false;
					}
				}

				_.delay(function () {

					if (self.resultCallback && bResult)
					{
						try {

							if (oPrivateKey && 0 === aPublicKeys.length)
							{
								self.resultCallback(
									PgpStore.openpgp.signClearMessage([oPrivateKey], self.text())
								);
							}
							else if (oPrivateKey && 0 < aPublicKeys.length)
							{
								self.resultCallback(
									PgpStore.openpgp.signAndEncryptMessage(aPublicKeys, oPrivateKey, self.text())
								);
							}
							else if (!oPrivateKey && 0 < aPublicKeys.length)
							{
								self.resultCallback(
									PgpStore.openpgp.encryptMessage(aPublicKeys, self.text())
								);
							}
						}
						catch (e)
						{
							self.notification(Translator.i18n('PGP_NOTIFICATIONS/PGP_ERROR', {
								'ERROR': '' + e
							}));

							bResult = false;
						}
					}

					if (bResult)
					{
						self.cancelCommand();
					}

					self.submitRequest(false);

				}, 10);

			}, function () {
				return !this.submitRequest() &&	(this.sign() || this.encrypt());
			});

			this.sDefaultKeyScope = Enums.KeyState.PopupComposeOpenPGP;

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/ComposeOpenPgp', 'PopupsComposeOpenPgpViewModel'], ComposeOpenPgpPopupView);
		_.extend(ComposeOpenPgpPopupView.prototype, AbstractView.prototype);

		ComposeOpenPgpPopupView.prototype.clearPopup = function ()
		{
			this.notification('');

			this.password('');
			this.password.focus(false);
			this.buttonFocus(false);

			this.from('');
			this.to([]);
			this.text('');

			this.submitRequest(false);

			this.resultCallback = null;
		};

		ComposeOpenPgpPopupView.prototype.onBuild = function ()
		{
			key('tab,shift+tab', Enums.KeyState.PopupComposeOpenPGP, _.bind(function () {

				switch (true)
				{
					case this.password.focus():
						this.buttonFocus(true);
						break;
					case this.buttonFocus():
						this.password.focus(true);
						break;
				}

				return false;

			}, this));
		};

		ComposeOpenPgpPopupView.prototype.onHide = function ()
		{
			this.clearPopup();
		};

		ComposeOpenPgpPopupView.prototype.onFocus = function ()
		{
			if (this.sign())
			{
				this.password.focus(true);
			}
			else
			{
				this.buttonFocus(true);
			}
		};

		ComposeOpenPgpPopupView.prototype.onShow = function (fCallback, sText, sFromEmail, sTo, sCc, sBcc)
		{
			this.clearPopup();

			var
				oEmail = new EmailModel(),
				sResultFromEmail = '',
				aRec = []
			;

			this.resultCallback = fCallback;

			oEmail.clear();
			oEmail.mailsoParse(sFromEmail);
			if ('' !== oEmail.email)
			{
				sResultFromEmail = oEmail.email;
			}

			if ('' !== sTo)
			{
				aRec.push(sTo);
			}

			if ('' !== sCc)
			{
				aRec.push(sCc);
			}

			if ('' !== sBcc)
			{
				aRec.push(sBcc);
			}

			aRec = aRec.join(', ').split(',');
			aRec = _.compact(_.map(aRec, function (sValue) {
				oEmail.clear();
				oEmail.mailsoParse(Utils.trim(sValue));
				return '' === oEmail.email ? false : oEmail.email;
			}));

			this.from(sResultFromEmail);
			this.to(aRec);
			this.text(sText);
		};

		module.exports = ComposeOpenPgpPopupView;

	}());

/***/ },
/* 138 */
/*!***************************************!*\
  !*** ./dev/View/Popup/FolderClear.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			Data = __webpack_require__(/*! Storage/User/Data */ 15),
			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),
			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function FolderClearPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsFolderClear');

			this.selectedFolder = ko.observable(null);
			this.clearingProcess = ko.observable(false);
			this.clearingError = ko.observable('');

			this.folderFullNameForClear = ko.computed(function () {
				var oFolder = this.selectedFolder();
				return oFolder ? oFolder.printableFullName() : '';
			}, this);

			this.folderNameForClear = ko.computed(function () {
				var oFolder = this.selectedFolder();
				return oFolder ? oFolder.localName() : '';
			}, this);

			this.dangerDescHtml = ko.computed(function () {
				return Translator.i18n('POPUPS_CLEAR_FOLDER/DANGER_DESC_HTML_1', {
					'FOLDER': this.folderNameForClear()
				});
			}, this);

			this.clearCommand = Utils.createCommand(this, function () {

				var
					self = this,
					oFolderToClear = this.selectedFolder()
				;

				if (oFolderToClear)
				{
					Data.message(null);
					Data.messageList([]);

					this.clearingProcess(true);

					oFolderToClear.messageCountAll(0);
					oFolderToClear.messageCountUnread(0);

					Cache.setFolderHash(oFolderToClear.fullNameRaw, '');

					Remote.folderClear(function (sResult, oData) {

						self.clearingProcess(false);
						if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
						{
							__webpack_require__(/*! App/User */ 6).reloadMessageList(true);
							self.cancelCommand();
						}
						else
						{
							if (oData && oData.ErrorCode)
							{
								self.clearingError(Translator.getNotification(oData.ErrorCode));
							}
							else
							{
								self.clearingError(Translator.getNotification(Enums.Notification.MailServerError));
							}
						}
					}, oFolderToClear.fullNameRaw);
				}

			}, function () {

				var
					oFolder = this.selectedFolder(),
					bIsClearing = this.clearingProcess()
				;

				return !bIsClearing && null !== oFolder;

			});

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/FolderClear', 'PopupsFolderClearViewModel'], FolderClearPopupView);
		_.extend(FolderClearPopupView.prototype, AbstractView.prototype);

		FolderClearPopupView.prototype.clearPopup = function ()
		{
			this.clearingProcess(false);
			this.selectedFolder(null);
		};

		FolderClearPopupView.prototype.onShow = function (oFolder)
		{
			this.clearPopup();
			if (oFolder)
			{
				this.selectedFolder(oFolder);
			}
		};

		module.exports = FolderClearPopupView;

	}());


/***/ },
/* 139 */
/*!*****************************************!*\
  !*** ./dev/View/Popup/NewOpenPgpKey.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			PgpStore = __webpack_require__(/*! Stores/User/Pgp */ 20),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function NewOpenPgpKeyPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsNewOpenPgpKey');

			this.email = ko.observable('');
			this.email.focus = ko.observable('');
			this.email.error = ko.observable(false);

			this.name = ko.observable('');
			this.password = ko.observable('');
			this.keyBitLength = ko.observable(2048);

			this.submitRequest = ko.observable(false);

			this.email.subscribe(function () {
				this.email.error(false);
			}, this);

			this.generateOpenPgpKeyCommand = Utils.createCommand(this, function () {

				var
					self = this,
					sUserID = '',
					mKeyPair = null,
					oOpenpgpKeyring = PgpStore.openpgpKeyring
				;

				this.email.error('' === Utils.trim(this.email()));
				if (!oOpenpgpKeyring || this.email.error())
				{
					return false;
				}

				sUserID = this.email();
				if ('' !== this.name())
				{
					sUserID = this.name() + ' <' + sUserID + '>';
				}

				this.submitRequest(true);

				_.delay(function () {
					mKeyPair = PgpStore.openpgp.generateKeyPair({
						'userId': sUserID,
						'numBits': Utils.pInt(self.keyBitLength()),
						'passphrase': Utils.trim(self.password())
					});

					if (mKeyPair && mKeyPair.privateKeyArmored)
					{
						oOpenpgpKeyring.privateKeys.importKey(mKeyPair.privateKeyArmored);
						oOpenpgpKeyring.publicKeys.importKey(mKeyPair.publicKeyArmored);
						oOpenpgpKeyring.store();

						__webpack_require__(/*! App/User */ 6).reloadOpenPgpKeys();
						Utils.delegateRun(self, 'cancelCommand');
					}

					self.submitRequest(false);
				}, 100);

				return true;
			});

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/NewOpenPgpKey', 'PopupsNewOpenPgpKeyViewModel'], NewOpenPgpKeyPopupView);
		_.extend(NewOpenPgpKeyPopupView.prototype, AbstractView.prototype);

		NewOpenPgpKeyPopupView.prototype.clearPopup = function ()
		{
			this.name('');
			this.password('');

			this.email('');
			this.email.error(false);
			this.keyBitLength(2048);
		};

		NewOpenPgpKeyPopupView.prototype.onShow = function ()
		{
			this.clearPopup();
		};

		NewOpenPgpKeyPopupView.prototype.onFocus = function ()
		{
			this.email.focus(true);
		};

		module.exports = NewOpenPgpKeyPopupView;

	}());

/***/ },
/* 140 */,
/* 141 */
/*!*****************************************!*\
  !*** ./dev/View/Popup/TwoFactorTest.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),

			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function TwoFactorTestPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsTwoFactorTest');

			var self = this;

			this.code = ko.observable('');
			this.code.focused = ko.observable(false);
			this.code.status = ko.observable(null);

			this.testing = ko.observable(false);

			// commands
			this.testCode = Utils.createCommand(this, function () {

				this.testing(true);
				Remote.testTwoFactor(function (sResult, oData) {

					self.testing(false);
					self.code.status(Enums.StorageResultType.Success === sResult && oData && oData.Result ? true : false);

				}, this.code());

			}, function () {
				return '' !== this.code() && !this.testing();
			});

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/TwoFactorTest', 'PopupsTwoFactorTestViewModel'], TwoFactorTestPopupView);
		_.extend(TwoFactorTestPopupView.prototype, AbstractView.prototype);

		TwoFactorTestPopupView.prototype.clearPopup = function ()
		{
			this.code('');
			this.code.focused(false);
			this.code.status(null);
			this.testing(false);
		};

		TwoFactorTestPopupView.prototype.onShow = function ()
		{
			this.clearPopup();
		};

		TwoFactorTestPopupView.prototype.onFocus = function ()
		{
			this.code.focused(true);
		};

		module.exports = TwoFactorTestPopupView;

	}());

/***/ },
/* 142 */
/*!******************************************!*\
  !*** ./dev/View/Popup/ViewOpenPgpKey.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Utils = __webpack_require__(/*! Common/Utils */ 1),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function ViewOpenPgpKeyPopupView()
		{
			AbstractView.call(this, 'Popups', 'PopupsViewOpenPgpKey');

			this.key = ko.observable('');
			this.keyDom = ko.observable(null);

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/Popup/ViewOpenPgpKey', 'PopupsViewOpenPgpKeyViewModel'], ViewOpenPgpKeyPopupView);
		_.extend(ViewOpenPgpKeyPopupView.prototype, AbstractView.prototype);

		ViewOpenPgpKeyPopupView.prototype.clearPopup = function ()
		{
			this.key('');
		};

		ViewOpenPgpKeyPopupView.prototype.selectKey = function ()
		{
			var oEl = this.keyDom();
			if (oEl)
			{
				Utils.selectElement(oEl);
			}
		};

		ViewOpenPgpKeyPopupView.prototype.onShow = function (oOpenPgpKey)
		{
			this.clearPopup();

			if (oOpenPgpKey)
			{
				this.key(oOpenPgpKey.armor);
			}
		};

		module.exports = ViewOpenPgpKeyPopupView;

	}());

/***/ },
/* 143 */
/*!********************************!*\
  !*** ./dev/View/User/About.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			ko = __webpack_require__(/*! ko */ 3),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function AboutUserView()
		{
			AbstractView.call(this, 'Center', 'About');

			this.version = ko.observable(Settings.settingsGet('Version'));

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/User/About', 'View/App/About', 'AboutViewModel'], AboutUserView);
		_.extend(AboutUserView.prototype, AbstractView.prototype);

		module.exports = AboutUserView;

	}());

/***/ },
/* 144 */
/*!********************************!*\
  !*** ./dev/View/User/Login.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			ko = __webpack_require__(/*! ko */ 3),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 12),

			Translator = __webpack_require__(/*! Common/Translator */ 7),

			Plugins = __webpack_require__(/*! Common/Plugins */ 23),

			LanguageStore = __webpack_require__(/*! Stores/Language */ 31),
			AppStore = __webpack_require__(/*! Stores/User/App */ 30),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function LoginUserView()
		{
			AbstractView.call(this, 'Center', 'Login');

			this.email = ko.observable('');
			this.password = ko.observable('');
			this.signMe = ko.observable(false);

			this.additionalCode = ko.observable('');
			this.additionalCode.error = ko.observable(false);
			this.additionalCode.focused = ko.observable(false);
			this.additionalCode.visibility = ko.observable(false);
			this.additionalCodeSignMe = ko.observable(false);

			this.logoImg = Utils.trim(Settings.settingsGet('LoginLogo'));
			this.logoPowered = !!Settings.settingsGet('LoginPowered');
			this.loginDescription = Utils.trim(Settings.settingsGet('LoginDescription'));

			this.forgotPasswordLinkUrl = Settings.settingsGet('ForgotPasswordLinkUrl');
			this.registrationLinkUrl = Settings.settingsGet('RegistrationLinkUrl');

			this.emailError = ko.observable(false);
			this.passwordError = ko.observable(false);

			this.emailFocus = ko.observable(false);
			this.submitFocus = ko.observable(false);

			this.email.subscribe(function () {
				this.emailError(false);
				this.additionalCode('');
				this.additionalCode.visibility(false);
			}, this);

			this.password.subscribe(function () {
				this.passwordError(false);
			}, this);

			this.additionalCode.subscribe(function () {
				this.additionalCode.error(false);
			}, this);

			this.additionalCode.visibility.subscribe(function () {
				this.additionalCode.error(false);
			}, this);

			this.submitRequest = ko.observable(false);
			this.submitError = ko.observable('');
			this.submitErrorAddidional = ko.observable('');

			this.submitError.subscribe(function (sValue) {
				if ('' === sValue)
				{
					this.submitErrorAddidional('');
				}
			}, this);

			this.allowLanguagesOnLogin = AppStore.allowLanguagesOnLogin;

			this.langRequest = ko.observable(false);
			this.language = LanguageStore.language;

			this.bSendLanguage = false;

			this.languageFullName = ko.computed(function () {
				return Utils.convertLangName(this.language());
			}, this);

			this.signMeType = ko.observable(Enums.LoginSignMeType.Unused);

			this.signMeType.subscribe(function (iValue) {
				this.signMe(Enums.LoginSignMeType.DefaultOn === iValue);
			}, this);

			this.signMeVisibility = ko.computed(function () {
				return Enums.LoginSignMeType.Unused !== this.signMeType();
			}, this);

			this.submitCommand = Utils.createCommand(this, function () {

				Utils.triggerAutocompleteInputChange();

				this.emailError('' === Utils.trim(this.email()));
				this.passwordError('' === Utils.trim(this.password()));

				if (this.additionalCode.visibility())
				{
					this.additionalCode.error('' === Utils.trim(this.additionalCode()));
				}

				if (this.emailError() || this.passwordError() || this.additionalCode.error())
				{
					return false;
				}

				var
					iPluginResultCode = 0,
					sPluginResultMessage = '',
					fSubmitResult = function (iResultCode, sResultMessage) {
						iPluginResultCode = iResultCode || 0;
						sPluginResultMessage = sResultMessage || '';
					}
				;

				Plugins.runHook('user-login-submit', [fSubmitResult]);
				if (0 < iPluginResultCode)
				{
					this.submitError(Translator.getNotification(iPluginResultCode));
					return false;
				}
				else if ('' !== sPluginResultMessage)
				{
					this.submitError(sPluginResultMessage);
					return false;
				}

				this.submitRequest(true);

				var
					sPassword = this.password(),

					fLoginRequest = _.bind(function (sPassword) {

						Remote.login(_.bind(function (sResult, oData) {

							if (Enums.StorageResultType.Success === sResult && oData && 'Login' === oData.Action)
							{
								if (oData.Result)
								{
									if (oData.TwoFactorAuth)
									{
										this.additionalCode('');
										this.additionalCode.visibility(true);
										this.additionalCode.focused(true);

										this.submitRequest(false);
									}
									else if (oData.Admin)
									{
										__webpack_require__(/*! App/User */ 6).redirectToAdminPanel();
									}
									else
									{
										__webpack_require__(/*! App/User */ 6).loginAndLogoutReload();
									}
								}
								else if (oData.ErrorCode)
								{
									this.submitRequest(false);
									if (-1 < Utils.inArray(oData.ErrorCode, [Enums.Notification.InvalidInputArgument]))
									{
										oData.ErrorCode = Enums.Notification.AuthError;
									}

									this.submitError(Translator.getNotification(oData.ErrorCode));

									if ('' === this.submitError())
									{
										this.submitError(Translator.getNotification(Enums.Notification.UnknownError));
									}
									else
									{
										if (oData.ErrorMessageAdditional)
										{
											this.submitErrorAddidional(oData.ErrorMessageAdditional);
										}
									}
								}
								else
								{
									this.submitRequest(false);
								}
							}
							else
							{
								this.submitRequest(false);
								this.submitError(Translator.getNotification(Enums.Notification.UnknownError));
							}

						}, this), this.email(), '', sPassword, !!this.signMe(),
							this.bSendLanguage ? this.language() : '',
							this.additionalCode.visibility() ? this.additionalCode() : '',
							this.additionalCode.visibility() ? !!this.additionalCodeSignMe() : false
						);

					}, this)
				;

				if (!!Settings.settingsGet('UseRsaEncryption') && Utils.rsaEncode.supported &&
					Settings.settingsGet('RsaPublicKey'))
				{
					fLoginRequest(Utils.rsaEncode(sPassword, Settings.settingsGet('RsaPublicKey')));
				}
				else
				{
					fLoginRequest(sPassword);
				}

				return true;

			}, function () {
				return !this.submitRequest();
			});

			this.facebookLoginEnabled = ko.observable(false);

			this.facebookCommand = Utils.createCommand(this, function () {

				window.open(Links.socialFacebook(), 'Facebook',
					'left=200,top=100,width=650,height=450,menubar=no,status=no,resizable=yes,scrollbars=yes');

				return true;

			}, function () {
				return !this.submitRequest() && this.facebookLoginEnabled();
			});

			this.googleLoginEnabled = ko.observable(false);

			this.googleCommand = Utils.createCommand(this, function () {

				window.open(Links.socialGoogle(), 'Google',
					'left=200,top=100,width=650,height=450,menubar=no,status=no,resizable=yes,scrollbars=yes');

				return true;

			}, function () {
				return !this.submitRequest() && this.googleLoginEnabled();
			});

			this.twitterLoginEnabled = ko.observable(false);

			this.twitterCommand = Utils.createCommand(this, function () {

				window.open(Links.socialTwitter(), 'Twitter',
					'left=200,top=100,width=650,height=450,menubar=no,status=no,resizable=yes,scrollbars=yes');

				return true;

			}, function () {
				return !this.submitRequest() && this.twitterLoginEnabled();
			});

			this.socialLoginEnabled = ko.computed(function () {

				var
					bF = this.facebookLoginEnabled(),
					bG = this.googleLoginEnabled(),
					bT = this.twitterLoginEnabled()
				;

				return bF || bG || bT;
			}, this);

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/User/Login', 'View/App/Login', 'LoginViewModel'], LoginUserView);
		_.extend(LoginUserView.prototype, AbstractView.prototype);

		LoginUserView.prototype.onShow = function ()
		{
			kn.routeOff();

			_.delay(_.bind(function () {
				if ('' !== this.email() && '' !== this.password())
				{
					this.submitFocus(true);
				}
				else
				{
					this.emailFocus(true);
				}

				if (Settings.settingsGet('UserLanguage'))
				{
					$.cookie('rllang', LanguageStore.language(), {'expires': 30});
				}

			}, this), 100);
		};

		LoginUserView.prototype.onHide = function ()
		{
			this.submitFocus(false);
			this.emailFocus(false);
		};

		LoginUserView.prototype.onBuild = function ()
		{
			var
				self = this,
				sJsHash = Settings.settingsGet('JsHash'),
				fSocial = function (iErrorCode) {
					iErrorCode = Utils.pInt(iErrorCode);
					if (0 === iErrorCode)
					{
						self.submitRequest(true);
						__webpack_require__(/*! App/User */ 6).loginAndLogoutReload();
					}
					else
					{
						self.submitError(Translator.getNotification(iErrorCode));
					}
				}
			;

			this.facebookLoginEnabled(!!Settings.settingsGet('AllowFacebookSocial'));
			this.twitterLoginEnabled(!!Settings.settingsGet('AllowTwitterSocial'));
			this.googleLoginEnabled(!!Settings.settingsGet('AllowGoogleSocial') &&
				!!Settings.settingsGet('AllowGoogleSocialAuth'));

			switch ((Settings.settingsGet('SignMe') || 'unused').toLowerCase())
			{
				case Enums.LoginSignMeTypeAsString.DefaultOff:
					this.signMeType(Enums.LoginSignMeType.DefaultOff);
					break;
				case Enums.LoginSignMeTypeAsString.DefaultOn:
					this.signMeType(Enums.LoginSignMeType.DefaultOn);
					break;
				default:
				case Enums.LoginSignMeTypeAsString.Unused:
					this.signMeType(Enums.LoginSignMeType.Unused);
					break;
			}

			this.email(AppStore.devEmail);
			this.password(AppStore.devPassword);

			if (this.googleLoginEnabled())
			{
				window['rl_' + sJsHash + '_google_login_service'] = fSocial;
			}

			if (this.facebookLoginEnabled())
			{
				window['rl_' + sJsHash + '_facebook_login_service'] = fSocial;
			}

			if (this.twitterLoginEnabled())
			{
				window['rl_' + sJsHash + '_twitter_login_service'] = fSocial;
			}

			_.delay(function () {
				LanguageStore.language.subscribe(function (sValue) {

					self.langRequest(true);

					Translator.reload(sValue, function() {
						self.langRequest(false);
						self.bSendLanguage = true;
						$.cookie('rllang', sValue, {'expires': 30});
					}, function() {
						self.langRequest(false);
					});

				});
			}, 50);

			Utils.triggerAutocompleteInputChange(true);
		};

		LoginUserView.prototype.submitForm = function ()
		{
			this.submitCommand();
		};

		LoginUserView.prototype.selectLanguage = function ()
		{
			kn.showScreenPopup(__webpack_require__(/*! View/Popup/Languages */ 45));
		};

		module.exports = LoginUserView;

	}());

/***/ },
/* 145 */
/*!*********************************************!*\
  !*** ./dev/View/User/MailBox/FolderList.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			window = __webpack_require__(/*! window */ 10),
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			ko = __webpack_require__(/*! ko */ 3),
			key = __webpack_require__(/*! key */ 21),

			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Links = __webpack_require__(/*! Common/Links */ 12),

			AppStore = __webpack_require__(/*! Stores/User/App */ 30),
			SettingsStore = __webpack_require__(/*! Stores/User/Settings */ 26),

			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),
			Data = __webpack_require__(/*! Storage/User/Data */ 15),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function FolderListMailBoxUserView()
		{
			AbstractView.call(this, 'Left', 'MailFolderList');

			this.oContentVisible = null;
			this.oContentScrollable = null;

			this.composeInEdit = Data.composeInEdit;

			this.messageList = Data.messageList;
			this.folderList = Data.folderList;
			this.folderListSystem = Data.folderListSystem;
			this.foldersChanging = Data.foldersChanging;

			this.leftPanelDisabled = Globals.leftPanelDisabled;

			this.iDropOverTimer = 0;

			this.allowContacts = !!AppStore.contactsIsAllowed();

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/User/MailBox/FolderList', 'View/App/MailBox/FolderList', 'MailBoxFolderListViewModel'], FolderListMailBoxUserView);
		_.extend(FolderListMailBoxUserView.prototype, AbstractView.prototype);

		FolderListMailBoxUserView.prototype.onBuild = function (oDom)
		{
			this.oContentVisible = $('.b-content', oDom);
			this.oContentScrollable = $('.content', this.oContentVisible);

			var self = this;

			oDom
				.on('click', '.b-folders .e-item .e-link .e-collapsed-sign', function (oEvent) {

					var
						oFolder = ko.dataFor(this),
						bCollapsed = false
					;

					if (oFolder && oEvent)
					{
						bCollapsed = oFolder.collapsed();
						__webpack_require__(/*! App/User */ 6).setExpandedFolder(oFolder.fullNameHash, bCollapsed);

						oFolder.collapsed(!bCollapsed);
						oEvent.preventDefault();
						oEvent.stopPropagation();
					}
				})
				.on('click', '.b-folders .e-item .e-link.selectable', function (oEvent) {

					oEvent.preventDefault();

					var
						oFolder = ko.dataFor(this)
					;

					if (oFolder)
					{
						if (Enums.Layout.NoPreview === SettingsStore.layout())
						{
							Data.message(null);
						}

						if (oFolder.fullNameRaw === Data.currentFolderFullNameRaw())
						{
							Cache.setFolderHash(oFolder.fullNameRaw, '');
						}

						kn.setHash(Links.mailBox(oFolder.fullNameHash));
					}
				})
			;

			key('up, down', Enums.KeyState.FolderList, function (event, handler) {

				var
					iIndex = -1,
					iKeyCode = handler && 'up' === handler.shortcut ? 38 : 40,
					$items = $('.b-folders .e-item .e-link:not(.hidden):visible', oDom)
				;

				if (event && $items.length)
				{
					iIndex = $items.index($items.filter('.focused'));
					if (-1 < iIndex)
					{
						$items.eq(iIndex).removeClass('focused');
					}

					if (iKeyCode === 38 && iIndex > 0)
					{
						iIndex--;
					}
					else if (iKeyCode === 40 && iIndex < $items.length - 1)
					{
						iIndex++;
					}

					$items.eq(iIndex).addClass('focused');
					self.scrollToFocused();
				}

				return false;
			});

			key('enter', Enums.KeyState.FolderList, function () {
				var $items = $('.b-folders .e-item .e-link:not(.hidden).focused', oDom);
				if ($items.length && $items[0])
				{
					self.folderList.focused(false);
					$items.click();
				}

				return false;
			});

			key('space', Enums.KeyState.FolderList, function () {
				var bCollapsed = true, oFolder = null, $items = $('.b-folders .e-item .e-link:not(.hidden).focused', oDom);
				if ($items.length && $items[0])
				{
					oFolder = ko.dataFor($items[0]);
					if (oFolder)
					{
						bCollapsed = oFolder.collapsed();
						__webpack_require__(/*! App/User */ 6).setExpandedFolder(oFolder.fullNameHash, bCollapsed);
						oFolder.collapsed(!bCollapsed);
					}
				}

				return false;
			});

			key('esc, tab, shift+tab, right', Enums.KeyState.FolderList, function () {
				self.folderList.focused(false);
				return false;
			});

			self.folderList.focused.subscribe(function (bValue) {
				$('.b-folders .e-item .e-link.focused', oDom).removeClass('focused');
				if (bValue)
				{
					$('.b-folders .e-item .e-link.selected', oDom).addClass('focused');
				}
			});
		};

		FolderListMailBoxUserView.prototype.messagesDropOver = function (oFolder)
		{
			window.clearTimeout(this.iDropOverTimer);
			if (oFolder && oFolder.collapsed())
			{
				this.iDropOverTimer = window.setTimeout(function () {
					oFolder.collapsed(false);
					__webpack_require__(/*! App/User */ 6).setExpandedFolder(oFolder.fullNameHash, true);
					Utils.windowResize();
				}, 500);
			}
		};

		FolderListMailBoxUserView.prototype.messagesDropOut = function ()
		{
			window.clearTimeout(this.iDropOverTimer);
		};

		FolderListMailBoxUserView.prototype.scrollToFocused = function ()
		{
			if (!this.oContentVisible || !this.oContentScrollable)
			{
				return false;
			}

			var
				iOffset = 20,
				oFocused = $('.e-item .e-link.focused', this.oContentScrollable),
				oPos = oFocused.position(),
				iVisibleHeight = this.oContentVisible.height(),
				iFocusedHeight = oFocused.outerHeight()
			;

			if (oPos && (oPos.top < 0 || oPos.top + iFocusedHeight > iVisibleHeight))
			{
				if (oPos.top < 0)
				{
					this.oContentScrollable.scrollTop(this.oContentScrollable.scrollTop() + oPos.top - iOffset);
				}
				else
				{
					this.oContentScrollable.scrollTop(this.oContentScrollable.scrollTop() + oPos.top - iVisibleHeight + iFocusedHeight + iOffset);
				}

				return true;
			}

			return false;
		};

		/**
		 *
		 * @param {FolderModel} oToFolder
		 * @param {{helper:jQuery}} oUi
		 */
		FolderListMailBoxUserView.prototype.messagesDrop = function (oToFolder, oUi)
		{
			if (oToFolder && oUi && oUi.helper)
			{
				var
					sFromFolderFullNameRaw = oUi.helper.data('rl-folder'),
					bCopy = Globals.$html.hasClass('rl-ctrl-key-pressed'),
					aUids = oUi.helper.data('rl-uids')
				;

				if (Utils.isNormal(sFromFolderFullNameRaw) && '' !== sFromFolderFullNameRaw && Utils.isArray(aUids))
				{
					__webpack_require__(/*! App/User */ 6).moveMessagesToFolder(sFromFolderFullNameRaw, aUids, oToFolder.fullNameRaw, bCopy);
				}
			}
		};

		FolderListMailBoxUserView.prototype.composeClick = function ()
		{
			kn.showScreenPopup(__webpack_require__(/*! View/Popup/Compose */ 27));
		};

		FolderListMailBoxUserView.prototype.createFolder = function ()
		{
			kn.showScreenPopup(__webpack_require__(/*! View/Popup/FolderCreate */ 88));
		};

		FolderListMailBoxUserView.prototype.configureFolders = function ()
		{
			kn.setHash(Links.settings('folders'));
		};

		FolderListMailBoxUserView.prototype.contactsClick = function ()
		{
			if (this.allowContacts)
			{
				kn.showScreenPopup(__webpack_require__(/*! View/Popup/Contacts */ 68));
			}
		};

		module.exports = FolderListMailBoxUserView;

	}());


/***/ },
/* 146 */
/*!**********************************************!*\
  !*** ./dev/View/User/MailBox/MessageList.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			ko = __webpack_require__(/*! ko */ 3),
			key = __webpack_require__(/*! key */ 21),
			Jua = __webpack_require__(/*! Jua */ 74),
			ifvisible = __webpack_require__(/*! ifvisible */ 156),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Links = __webpack_require__(/*! Common/Links */ 12),
			Events = __webpack_require__(/*! Common/Events */ 28),
			Selector = __webpack_require__(/*! Common/Selector */ 78),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			QuotaStore = __webpack_require__(/*! Stores/User/Quota */ 84),
			SettingsStore = __webpack_require__(/*! Stores/User/Settings */ 26),
			FolderStore = __webpack_require__(/*! Stores/User/Folder */ 32),

			Settings = __webpack_require__(/*! Storage/Settings */ 9),
			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),
			Data = __webpack_require__(/*! Storage/User/Data */ 15),
			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function MessageListMailBoxUserView()
		{
			AbstractView.call(this, 'Right', 'MailMessageList');

			this.sLastUid = null;
			this.bPrefetch = false;
			this.emptySubjectValue = '';

			this.hideDangerousActions = !!Settings.settingsGet('HideDangerousActions');

			this.popupVisibility = Globals.popupVisibility;

			this.message = Data.message;
			this.messageList = Data.messageList;
			this.folderList = Data.folderList;
			this.currentMessage = Data.currentMessage;
			this.isMessageSelected = Data.isMessageSelected;
			this.messageListSearch = Data.messageListSearch;
			this.messageListError = Data.messageListError;
			this.folderMenuForMove = Data.folderMenuForMove;

			this.useCheckboxesInList = SettingsStore.useCheckboxesInList;

			this.mainMessageListSearch = Data.mainMessageListSearch;
			this.messageListEndFolder = Data.messageListEndFolder;

			this.messageListChecked = Data.messageListChecked;
			this.messageListCheckedOrSelected = Data.messageListCheckedOrSelected;
			this.messageListCheckedOrSelectedUidsWithSubMails = Data.messageListCheckedOrSelectedUidsWithSubMails;
			this.messageListCompleteLoadingThrottle = Data.messageListCompleteLoadingThrottle;

			Translator.initOnStartOrLangChange(function () {
				this.emptySubjectValue = Translator.i18n('MESSAGE_LIST/EMPTY_SUBJECT_TEXT');
			}, this);

			this.userQuota = QuotaStore.quota;
			this.userUsageSize = QuotaStore.usage;
			this.userUsageProc = QuotaStore.percentage;

			this.moveDropdownTrigger = ko.observable(false);
			this.moreDropdownTrigger = ko.observable(false);

			// append drag and drop
			this.dragOver = ko.observable(false).extend({'throttle': 1});
			this.dragOverEnter = ko.observable(false).extend({'throttle': 1});
			this.dragOverArea = ko.observable(null);
			this.dragOverBodyArea = ko.observable(null);

			this.messageListItemTemplate = ko.computed(function () {
				return Enums.Layout.SidePreview === SettingsStore.layout() ?
					'MailMessageListItem' : 'MailMessageListItemNoPreviewPane';
			});

			this.messageListSearchDesc = ko.computed(function () {
				var sValue = Data.messageListEndSearch();
				return '' === sValue ? '' : Translator.i18n('MESSAGE_LIST/SEARCH_RESULT_FOR', {'SEARCH': sValue});
			});

			this.messageListPagenator = ko.computed(Utils.computedPagenatorHelper(Data.messageListPage, Data.messageListPageCount));

			this.checkAll = ko.computed({
				'read': function () {
					return 0 < Data.messageListChecked().length;
				},

				'write': function (bValue) {
					bValue = !!bValue;
					_.each(Data.messageList(), function (oMessage) {
						oMessage.checked(bValue);
					});
				}
			});

			this.inputMessageListSearchFocus = ko.observable(false);

			this.sLastSearchValue = '';
			this.inputProxyMessageListSearch = ko.computed({
				'read': this.mainMessageListSearch,
				'write': function (sValue) {
					this.sLastSearchValue = sValue;
				},
				'owner': this
			});

			this.isIncompleteChecked = ko.computed(function () {
				var
					iM = Data.messageList().length,
					iC = Data.messageListChecked().length
				;
				return 0 < iM && 0 < iC && iM > iC;
			}, this);

			this.hasMessages = ko.computed(function () {
				return 0 < this.messageList().length;
			}, this);

			this.hasCheckedOrSelectedLines = ko.computed(function () {
				return 0 < this.messageListCheckedOrSelected().length;
			}, this);

			this.isSpamFolder = ko.computed(function () {
				return FolderStore.spamFolder() === this.messageListEndFolder() &&
					'' !== FolderStore.spamFolder();
			}, this);

			this.isSpamDisabled = ko.computed(function () {
				return Consts.Values.UnuseOptionValue === FolderStore.spamFolder();
			}, this);

			this.isTrashFolder = ko.computed(function () {
				return FolderStore.trashFolder() === this.messageListEndFolder() &&
					'' !== FolderStore.trashFolder();
			}, this);

			this.isDraftFolder = ko.computed(function () {
				return FolderStore.draftFolder() === this.messageListEndFolder() &&
					'' !== FolderStore.draftFolder();
			}, this);

			this.isSentFolder = ko.computed(function () {
				return FolderStore.sentFolder() === this.messageListEndFolder() &&
					'' !== FolderStore.sentFolder();
			}, this);

			this.isArchiveFolder = ko.computed(function () {
				return FolderStore.archiveFolder() === this.messageListEndFolder() &&
					'' !== FolderStore.archiveFolder();
			}, this);

			this.isArchiveDisabled = ko.computed(function () {
				return Consts.Values.UnuseOptionValue === FolderStore.archiveFolder();
			}, this);

			this.canBeMoved = this.hasCheckedOrSelectedLines;

			this.clearCommand = Utils.createCommand(this, function () {
				kn.showScreenPopup(__webpack_require__(/*! View/Popup/FolderClear */ 138), [Data.currentFolder()]);
			});

			this.multyForwardCommand = Utils.createCommand(this, function () {
				kn.showScreenPopup(__webpack_require__(/*! View/Popup/Compose */ 27), [
					Enums.ComposeType.ForwardAsAttachment, Data.messageListCheckedOrSelected()]);
			}, this.canBeMoved);

			this.deleteWithoutMoveCommand = Utils.createCommand(this, function () {
				__webpack_require__(/*! App/User */ 6).deleteMessagesFromFolder(Enums.FolderType.Trash,
					Data.currentFolderFullNameRaw(),
					Data.messageListCheckedOrSelectedUidsWithSubMails(), false);
			}, this.canBeMoved);

			this.deleteCommand = Utils.createCommand(this, function () {
				__webpack_require__(/*! App/User */ 6).deleteMessagesFromFolder(Enums.FolderType.Trash,
					Data.currentFolderFullNameRaw(),
					Data.messageListCheckedOrSelectedUidsWithSubMails(), true);
			}, this.canBeMoved);

			this.archiveCommand = Utils.createCommand(this, function () {
				__webpack_require__(/*! App/User */ 6).deleteMessagesFromFolder(Enums.FolderType.Archive,
					Data.currentFolderFullNameRaw(),
					Data.messageListCheckedOrSelectedUidsWithSubMails(), true);
			}, this.canBeMoved);

			this.spamCommand = Utils.createCommand(this, function () {
				__webpack_require__(/*! App/User */ 6).deleteMessagesFromFolder(Enums.FolderType.Spam,
					Data.currentFolderFullNameRaw(),
					Data.messageListCheckedOrSelectedUidsWithSubMails(), true);
			}, this.canBeMoved);

			this.notSpamCommand = Utils.createCommand(this, function () {
				__webpack_require__(/*! App/User */ 6).deleteMessagesFromFolder(Enums.FolderType.NotSpam,
					Data.currentFolderFullNameRaw(),
					Data.messageListCheckedOrSelectedUidsWithSubMails(), true);
			}, this.canBeMoved);

			this.moveCommand = Utils.createCommand(this, Utils.emptyFunction, this.canBeMoved);

			this.reloadCommand = Utils.createCommand(this, function () {
				if (!Data.messageListCompleteLoadingThrottle())
				{
					__webpack_require__(/*! App/User */ 6).reloadMessageList(false, true);
				}
			});

			this.quotaTooltip = _.bind(this.quotaTooltip, this);

			this.selector = new Selector(this.messageList, this.currentMessage,
				'.messageListItem .actionHandle', '.messageListItem.selected', '.messageListItem .checkboxMessage',
					'.messageListItem.focused');

			this.selector.on('onItemSelect', _.bind(function (oMessage) {
				if (oMessage)
				{
					Data.message(Data.staticMessageList.populateByMessageListItem(oMessage));
					this.populateMessageBody(Data.message());

					if (Enums.Layout.NoPreview === SettingsStore.layout())
					{
						kn.setHash(Links.messagePreview(), true);
						Data.message.focused(true);
					}
				}
				else
				{
					Data.message(null);
				}
			}, this));

			this.selector.on('onItemGetUid', function (oMessage) {
				return oMessage ? oMessage.generateUid() : '';
			});

			Data.messageListEndHash.subscribe(function () {
				this.selector.scrollToTop();
			}, this);

			SettingsStore.layout.subscribe(function (mValue) {
				this.selector.autoSelect(Enums.Layout.NoPreview !== mValue);
			}, this);

			SettingsStore.layout.valueHasMutated();

			Events
				.sub('mailbox.message-list.selector.go-down', function () {
					this.selector.goDown(true);
				}, this)
				.sub('mailbox.message-list.selector.go-up', function () {
					this.selector.goUp(true);
				}, this)
			;

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/User/MailBox/MessageList', 'View/App/MailBox/MessageList', 'MailBoxMessageListViewModel'], MessageListMailBoxUserView);
		_.extend(MessageListMailBoxUserView.prototype, AbstractView.prototype);

		/**
		 * @type {string}
		 */
		MessageListMailBoxUserView.prototype.emptySubjectValue = '';

		MessageListMailBoxUserView.prototype.searchEnterAction = function ()
		{
			this.mainMessageListSearch(this.sLastSearchValue);
			this.inputMessageListSearchFocus(false);
		};

		/**
		 * @returns {string}
		 */
		MessageListMailBoxUserView.prototype.printableMessageCountForDeletion = function ()
		{
			var iCnt = this.messageListCheckedOrSelectedUidsWithSubMails().length;
			return 1 < iCnt ? ' (' + (100 > iCnt ? iCnt : '99+') + ')' : '';
		};

		MessageListMailBoxUserView.prototype.cancelSearch = function ()
		{
			this.mainMessageListSearch('');
			this.inputMessageListSearchFocus(false);
		};

		/**
		 * @param {string} sToFolderFullNameRaw
		 * @param {boolean} bCopy
		 * @return {boolean}
		 */
		MessageListMailBoxUserView.prototype.moveSelectedMessagesToFolder = function (sToFolderFullNameRaw, bCopy)
		{
			if (this.canBeMoved())
			{
				__webpack_require__(/*! App/User */ 6).moveMessagesToFolder(
					Data.currentFolderFullNameRaw(),
					Data.messageListCheckedOrSelectedUidsWithSubMails(), sToFolderFullNameRaw, bCopy);
			}

			return false;
		};

		MessageListMailBoxUserView.prototype.dragAndDronHelper = function (oMessageListItem)
		{
			if (oMessageListItem)
			{
				oMessageListItem.checked(true);
			}

			var
				oEl = Utils.draggablePlace(),
				aUids = Data.messageListCheckedOrSelectedUidsWithSubMails()
			;

			oEl.data('rl-folder', Data.currentFolderFullNameRaw());
			oEl.data('rl-uids', aUids);
			oEl.find('.text').text('' + aUids.length);

			_.defer(function () {
				var aUids = Data.messageListCheckedOrSelectedUidsWithSubMails();

				oEl.data('rl-uids', aUids);
				oEl.find('.text').text('' + aUids.length);
			});

			return oEl;
		};

		/**
		 * @param {string} sResult
		 * @param {AjaxJsonDefaultResponse} oData
		 * @param {boolean} bCached
		 */
		MessageListMailBoxUserView.prototype.onMessageResponse = function (sResult, oData, bCached)
		{
			Data.hideMessageBodies();
			Data.messageLoading(false);

			if (Enums.StorageResultType.Success === sResult && oData && oData.Result)
			{
				Data.setMessage(oData, bCached);
			}
			else if (Enums.StorageResultType.Unload === sResult)
			{
				Data.message(null);
				Data.messageError('');
			}
			else if (Enums.StorageResultType.Abort !== sResult)
			{
				Data.message(null);
				Data.messageError((oData && oData.ErrorCode ?
					Translator.getNotification(oData.ErrorCode) :
					Translator.getNotification(Enums.Notification.UnknownError)));
			}
		};

		MessageListMailBoxUserView.prototype.populateMessageBody = function (oMessage)
		{
			if (oMessage)
			{
				if (Remote.message(this.onMessageResponse, oMessage.folderFullNameRaw, oMessage.uid))
				{
					Data.messageLoading(true);
				}
				else
				{
					Utils.log('Error: Unknown message request: ' + oMessage.folderFullNameRaw + ' ~ ' + oMessage.uid + ' [e-101]');
				}
			}
		};

		/**
		 * @param {string} sFolderFullNameRaw
		 * @param {number} iSetAction
		 * @param {Array=} aMessages = null
		 */
		MessageListMailBoxUserView.prototype.setAction = function (sFolderFullNameRaw, iSetAction, aMessages)
		{
			var
				aUids = [],
				oFolder = null,
				iAlreadyUnread = 0
			;

			if (Utils.isUnd(aMessages))
			{
				aMessages = Data.messageListChecked();
			}

			aUids = _.map(aMessages, function (oMessage) {
				return oMessage.uid;
			});

			if ('' !== sFolderFullNameRaw && 0 < aUids.length)
			{
				switch (iSetAction) {
				case Enums.MessageSetAction.SetSeen:
					_.each(aMessages, function (oMessage) {
						if (oMessage.unseen())
						{
							iAlreadyUnread++;
						}

						oMessage.unseen(false);
						Cache.storeMessageFlagsToCache(oMessage);
					});

					oFolder = Cache.getFolderFromCacheList(sFolderFullNameRaw);
					if (oFolder)
					{
						oFolder.messageCountUnread(oFolder.messageCountUnread() - iAlreadyUnread);
					}

					Remote.messageSetSeen(Utils.emptyFunction, sFolderFullNameRaw, aUids, true);
					break;
				case Enums.MessageSetAction.UnsetSeen:
					_.each(aMessages, function (oMessage) {
						if (oMessage.unseen())
						{
							iAlreadyUnread++;
						}

						oMessage.unseen(true);
						Cache.storeMessageFlagsToCache(oMessage);
					});

					oFolder = Cache.getFolderFromCacheList(sFolderFullNameRaw);
					if (oFolder)
					{
						oFolder.messageCountUnread(oFolder.messageCountUnread() - iAlreadyUnread + aUids.length);
					}
					Remote.messageSetSeen(Utils.emptyFunction, sFolderFullNameRaw, aUids, false);
					break;
				case Enums.MessageSetAction.SetFlag:
					_.each(aMessages, function (oMessage) {
						oMessage.flagged(true);
						Cache.storeMessageFlagsToCache(oMessage);
					});
					Remote.messageSetFlagged(Utils.emptyFunction, sFolderFullNameRaw, aUids, true);
					break;
				case Enums.MessageSetAction.UnsetFlag:
					_.each(aMessages, function (oMessage) {
						oMessage.flagged(false);
						Cache.storeMessageFlagsToCache(oMessage);
					});
					Remote.messageSetFlagged(Utils.emptyFunction, sFolderFullNameRaw, aUids, false);
					break;
				}

				__webpack_require__(/*! App/User */ 6).reloadFlagsCurrentMessageListAndMessageFromCache();
			}
		};

		/**
		 * @param {string} sFolderFullNameRaw
		 * @param {number} iSetAction
		 */
		MessageListMailBoxUserView.prototype.setActionForAll = function (sFolderFullNameRaw, iSetAction)
		{
			var
				oFolder = null,
				aMessages = Data.messageList()
			;

			if ('' !== sFolderFullNameRaw)
			{
				oFolder = Cache.getFolderFromCacheList(sFolderFullNameRaw);

				if (oFolder)
				{
					switch (iSetAction) {
					case Enums.MessageSetAction.SetSeen:
						oFolder = Cache.getFolderFromCacheList(sFolderFullNameRaw);
						if (oFolder)
						{
							_.each(aMessages, function (oMessage) {
								oMessage.unseen(false);
							});

							oFolder.messageCountUnread(0);
							Cache.clearMessageFlagsFromCacheByFolder(sFolderFullNameRaw);
						}

						Remote.messageSetSeenToAll(Utils.emptyFunction, sFolderFullNameRaw, true);
						break;
					case Enums.MessageSetAction.UnsetSeen:
						oFolder = Cache.getFolderFromCacheList(sFolderFullNameRaw);
						if (oFolder)
						{
							_.each(aMessages, function (oMessage) {
								oMessage.unseen(true);
							});

							oFolder.messageCountUnread(oFolder.messageCountAll());
							Cache.clearMessageFlagsFromCacheByFolder(sFolderFullNameRaw);
						}
						Remote.messageSetSeenToAll(Utils.emptyFunction, sFolderFullNameRaw, false);
						break;
					}

					__webpack_require__(/*! App/User */ 6).reloadFlagsCurrentMessageListAndMessageFromCache();
				}
			}
		};

		MessageListMailBoxUserView.prototype.listSetSeen = function ()
		{
			this.setAction(Data.currentFolderFullNameRaw(), Enums.MessageSetAction.SetSeen, Data.messageListCheckedOrSelected());
		};

		MessageListMailBoxUserView.prototype.listSetAllSeen = function ()
		{
			this.setActionForAll(Data.currentFolderFullNameRaw(), Enums.MessageSetAction.SetSeen);
		};

		MessageListMailBoxUserView.prototype.listUnsetSeen = function ()
		{
			this.setAction(Data.currentFolderFullNameRaw(), Enums.MessageSetAction.UnsetSeen, Data.messageListCheckedOrSelected());
		};

		MessageListMailBoxUserView.prototype.listSetFlags = function ()
		{
			this.setAction(Data.currentFolderFullNameRaw(), Enums.MessageSetAction.SetFlag, Data.messageListCheckedOrSelected());
		};

		MessageListMailBoxUserView.prototype.listUnsetFlags = function ()
		{
			this.setAction(Data.currentFolderFullNameRaw(), Enums.MessageSetAction.UnsetFlag, Data.messageListCheckedOrSelected());
		};

		MessageListMailBoxUserView.prototype.flagMessages = function (oCurrentMessage)
		{
			var
				aChecked = this.messageListCheckedOrSelected(),
				aCheckedUids = []
			;

			if (oCurrentMessage)
			{
				if (0 < aChecked.length)
				{
					aCheckedUids = _.map(aChecked, function (oMessage) {
						return oMessage.uid;
					});
				}

				if (0 < aCheckedUids.length && -1 < Utils.inArray(oCurrentMessage.uid, aCheckedUids))
				{
					this.setAction(oCurrentMessage.folderFullNameRaw, oCurrentMessage.flagged() ?
						Enums.MessageSetAction.UnsetFlag : Enums.MessageSetAction.SetFlag, aChecked);
				}
				else
				{
					this.setAction(oCurrentMessage.folderFullNameRaw, oCurrentMessage.flagged() ?
						Enums.MessageSetAction.UnsetFlag : Enums.MessageSetAction.SetFlag, [oCurrentMessage]);
				}
			}
		};

		MessageListMailBoxUserView.prototype.flagMessagesFast = function (bFlag)
		{
			var
				aChecked = this.messageListCheckedOrSelected(),
				aFlagged = []
			;

			if (0 < aChecked.length)
			{
				aFlagged = _.filter(aChecked, function (oMessage) {
					return oMessage.flagged();
				});

				if (Utils.isUnd(bFlag))
				{
					this.setAction(aChecked[0].folderFullNameRaw,
						aChecked.length === aFlagged.length ? Enums.MessageSetAction.UnsetFlag : Enums.MessageSetAction.SetFlag, aChecked);
				}
				else
				{
					this.setAction(aChecked[0].folderFullNameRaw,
						!bFlag ? Enums.MessageSetAction.UnsetFlag : Enums.MessageSetAction.SetFlag, aChecked);
				}
			}
		};

		MessageListMailBoxUserView.prototype.seenMessagesFast = function (bSeen)
		{
			var
				aChecked = this.messageListCheckedOrSelected(),
				aUnseen = []
			;

			if (0 < aChecked.length)
			{
				aUnseen = _.filter(aChecked, function (oMessage) {
					return oMessage.unseen();
				});

				if (Utils.isUnd(bSeen))
				{
					this.setAction(aChecked[0].folderFullNameRaw,
						0 < aUnseen.length ? Enums.MessageSetAction.SetSeen : Enums.MessageSetAction.UnsetSeen, aChecked);
				}
				else
				{
					this.setAction(aChecked[0].folderFullNameRaw,
						bSeen ? Enums.MessageSetAction.SetSeen : Enums.MessageSetAction.UnsetSeen, aChecked);
				}
			}
		};

		MessageListMailBoxUserView.prototype.onBuild = function (oDom)
		{
			var self = this;

			this.oContentVisible = $('.b-content', oDom);
			this.oContentScrollable = $('.content', this.oContentVisible);

			this.oContentVisible.on('click', '.fullThreadHandle', function () {
				var
					aList = [],
					oMessage = ko.dataFor(this)
				;

				if (oMessage && !oMessage.lastInCollapsedThreadLoading())
				{
					Data.messageListThreadFolder(oMessage.folderFullNameRaw);

					aList = Data.messageListThreadUids();

					if (oMessage.lastInCollapsedThread())
					{
						aList.push(0 < oMessage.parentUid() ? oMessage.parentUid() : oMessage.uid);
					}
					else
					{
						aList = _.without(aList, 0 < oMessage.parentUid() ? oMessage.parentUid() : oMessage.uid);
					}

					Data.messageListThreadUids(_.uniq(aList));

					oMessage.lastInCollapsedThreadLoading(true);
					oMessage.lastInCollapsedThread(!oMessage.lastInCollapsedThread());

					__webpack_require__(/*! App/User */ 6).reloadMessageList();
				}

				return false;
			});

			this.selector.init(this.oContentVisible, this.oContentScrollable, Enums.KeyState.MessageList);

			oDom
				.on('click', '.messageList .b-message-list-wrapper', function () {
					if (self.message.focused())
					{
						self.message.focused(false);
					}
				})
				.on('click', '.e-pagenator .e-page', function () {
					var oPage = ko.dataFor(this);
					if (oPage)
					{
						kn.setHash(Links.mailBox(
							Data.currentFolderFullNameHash(),
							oPage.value,
							Data.messageListSearch()
						));
					}
				})
				.on('click', '.messageList .checkboxCkeckAll', function () {
					self.checkAll(!self.checkAll());
				})
				.on('click', '.messageList .messageListItem .flagParent', function () {
					self.flagMessages(ko.dataFor(this));
				})
			;

			this.initUploaderForAppend();
			this.initShortcuts();

			if (!Globals.bMobileDevice && ifvisible && Settings.capa(Enums.Capa.Prefetch))
			{
				ifvisible.setIdleDuration(10);

				ifvisible.idle(function () {
					self.prefetchNextTick();
				});
			}
		};

		MessageListMailBoxUserView.prototype.initShortcuts = function ()
		{
			var self = this;

			// disable print
			key('ctrl+p, command+p', Enums.KeyState.MessageList, function () {
				return false;
			});

			// archive (zip)
			key('z', [Enums.KeyState.MessageList, Enums.KeyState.MessageView], function () {
				self.archiveCommand();
				return false;
			});

			// delete
			key('delete, shift+delete, shift+3', Enums.KeyState.MessageList, function (event, handler) {
				if (event)
				{
					if (0 < Data.messageListCheckedOrSelected().length)
					{
						if (handler && 'shift+delete' === handler.shortcut)
						{
							self.deleteWithoutMoveCommand();
						}
						else
						{
							self.deleteCommand();
						}
					}

					return false;
				}
			});

			// check mail
			key('ctrl+r, command+r', [Enums.KeyState.FolderList, Enums.KeyState.MessageList, Enums.KeyState.MessageView], function () {
				self.reloadCommand();
				return false;
			});

			// check all
			key('ctrl+a, command+a', Enums.KeyState.MessageList, function () {
				self.checkAll(!(self.checkAll() && !self.isIncompleteChecked()));
				return false;
			});

			// write/compose (open compose popup)
			key('w,c', [Enums.KeyState.MessageList, Enums.KeyState.MessageView], function () {
				kn.showScreenPopup(__webpack_require__(/*! View/Popup/Compose */ 27));
				return false;
			});

			// important - star/flag messages
			key('i', [Enums.KeyState.MessageList, Enums.KeyState.MessageView], function () {
				self.flagMessagesFast();
				return false;
			});

			// move
			key('m', Enums.KeyState.MessageList, function () {
				self.moveDropdownTrigger(true);
				return false;
			});

			// read
			key('q', [Enums.KeyState.MessageList, Enums.KeyState.MessageView], function () {
				self.seenMessagesFast(true);
				return false;
			});

			// unread
			key('u', [Enums.KeyState.MessageList, Enums.KeyState.MessageView], function () {
				self.seenMessagesFast(false);
				return false;
			});

			key('shift+f', [Enums.KeyState.MessageList, Enums.KeyState.MessageView], function () {
				self.multyForwardCommand();
				return false;
			});

			// search input focus
			key('/', [Enums.KeyState.MessageList, Enums.KeyState.MessageView], function () {
				self.inputMessageListSearchFocus(true);
				return false;
			});

			// cancel search
			key('esc', Enums.KeyState.MessageList, function () {
				if ('' !== self.messageListSearchDesc())
				{
					self.cancelSearch();
					return false;
				}
			});

			// change focused state
			key('tab, shift+tab, left, right', Enums.KeyState.MessageList, function (event, handler) {
				if (event && handler && ('shift+tab' === handler.shortcut || 'left' === handler.shortcut))
				{
					self.folderList.focused(true);
				}
				else if (self.message())
				{
					self.message.focused(true);
				}

				return false;
			});

			key('ctrl+left, command+left', Enums.KeyState.MessageView, function () {
				return false; // TODO
			});

			key('ctrl+right, command+right', Enums.KeyState.MessageView, function () {
				return false; // TODO
			});
		};

		MessageListMailBoxUserView.prototype.prefetchNextTick = function ()
		{
			if (ifvisible && !this.bPrefetch && !ifvisible.now() && this.viewModelVisibility())
			{
				var
					self = this,
					oMessage = _.find(this.messageList(), function (oMessage) {
						return oMessage &&
							!Cache.hasRequestedMessage(oMessage.folderFullNameRaw, oMessage.uid);
					})
				;

				if (oMessage)
				{
					this.bPrefetch = true;

					Cache.addRequestedMessage(oMessage.folderFullNameRaw, oMessage.uid);

					Remote.message(function (sResult, oData) {

						var bNext = !!(Enums.StorageResultType.Success === sResult && oData && oData.Result);

						_.delay(function () {
							self.bPrefetch = false;
							if (bNext)
							{
								self.prefetchNextTick();
							}
						}, 1000);

					}, oMessage.folderFullNameRaw, oMessage.uid);
				}
			}
		};

		MessageListMailBoxUserView.prototype.composeClick = function ()
		{
			kn.showScreenPopup(__webpack_require__(/*! View/Popup/Compose */ 27));
		};

		MessageListMailBoxUserView.prototype.advancedSearchClick = function ()
		{
			kn.showScreenPopup(__webpack_require__(/*! View/Popup/AdvancedSearch */ 136));
		};

		MessageListMailBoxUserView.prototype.quotaTooltip = function ()
		{
			return Translator.i18n('MESSAGE_LIST/QUOTA_SIZE', {
				'SIZE': Utils.friendlySize(this.userUsageSize()),
				'PROC': this.userUsageProc(),
				'LIMIT': Utils.friendlySize(this.userQuota())
			});
		};

		MessageListMailBoxUserView.prototype.initUploaderForAppend = function ()
		{
			if (!Settings.settingsGet('AllowAppendMessage') || !this.dragOverArea())
			{
				return false;
			}

			var
				oJua = new Jua({
					'action': Links.append(),
					'name': 'AppendFile',
					'queueSize': 1,
					'multipleSizeLimit': 1,
					'disableFolderDragAndDrop': true,
					'hidden': {
						'Folder': function () {
							return Data.currentFolderFullNameRaw();
						}
					},
					'dragAndDropElement': this.dragOverArea(),
					'dragAndDropBodyElement': this.dragOverBodyArea()
				})
			;

			this.dragOver.subscribe(function (bValue) {
				if (bValue)
				{
					this.selector.scrollToTop();
				}
			}, this);

			oJua
				.on('onDragEnter', _.bind(function () {
					this.dragOverEnter(true);
				}, this))
				.on('onDragLeave', _.bind(function () {
					this.dragOverEnter(false);
				}, this))
				.on('onBodyDragEnter', _.bind(function () {
					this.dragOver(true);
				}, this))
				.on('onBodyDragLeave', _.bind(function () {
					this.dragOver(false);
				}, this))
				.on('onSelect', _.bind(function (sUid, oData) {
					if (sUid && oData && 'message/rfc822' === oData['Type'])
					{
						Data.messageListLoading(true);
						return true;
					}

					return false;
				}, this))
				.on('onComplete', _.bind(function () {
					__webpack_require__(/*! App/User */ 6).reloadMessageList(true, true);
				}, this))
			;

			return !!oJua;
		};

		module.exports = MessageListMailBoxUserView;

	}());


/***/ },
/* 147 */
/*!**********************************************!*\
  !*** ./dev/View/User/MailBox/MessageView.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			$ = __webpack_require__(/*! $ */ 13),
			ko = __webpack_require__(/*! ko */ 3),
			key = __webpack_require__(/*! key */ 21),

			PhotoSwipe = __webpack_require__(/*! PhotoSwipe */ 153),
			PhotoSwipeUI_Default = __webpack_require__(/*! PhotoSwipeUI_Default */ 154),

			Consts = __webpack_require__(/*! Common/Consts */ 16),
			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Utils = __webpack_require__(/*! Common/Utils */ 1),
			Events = __webpack_require__(/*! Common/Events */ 28),
			Translator = __webpack_require__(/*! Common/Translator */ 7),

			SettingsStore = __webpack_require__(/*! Stores/User/Settings */ 26),
			AccountStore = __webpack_require__(/*! Stores/User/Account */ 22),
			FolderStore = __webpack_require__(/*! Stores/User/Folder */ 32),

			Local = __webpack_require__(/*! Storage/Client */ 60),
			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),
			Data = __webpack_require__(/*! Storage/User/Data */ 15),
			Remote = __webpack_require__(/*! Storage/User/Remote */ 14),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function MessageViewMailBoxUserView()
		{
			AbstractView.call(this, 'Right', 'MailMessageView');

			var
				self = this,
				sLastEmail = '',
				createCommandHelper = function (sType) {
					return Utils.createCommand(self, function () {
						this.lastReplyAction(sType);
						this.replyOrforward(sType);
					}, self.canBeRepliedOrForwarded);
				}
			;

			this.oHeaderDom = null;
			this.oMessageScrollerDom = null;

			this.pswp = null;

			this.message = Data.message;
			this.currentMessage = Data.currentMessage;
			this.messageListChecked = Data.messageListChecked;
			this.hasCheckedMessages = Data.hasCheckedMessages;
			this.messageListCheckedOrSelectedUidsWithSubMails = Data.messageListCheckedOrSelectedUidsWithSubMails;
			this.messageLoading = Data.messageLoading;
			this.messageLoadingThrottle = Data.messageLoadingThrottle;
			this.messagesBodiesDom = Data.messagesBodiesDom;
			this.useThreads = SettingsStore.useThreads;
			this.replySameFolder = SettingsStore.replySameFolder;
			this.layout = SettingsStore.layout;
			this.usePreviewPane = SettingsStore.usePreviewPane;
			this.isMessageSelected = Data.isMessageSelected;
			this.messageActiveDom = Data.messageActiveDom;
			this.messageError = Data.messageError;

			this.fullScreenMode = Data.messageFullScreenMode;

			this.lastReplyAction_ = ko.observable('');
			this.lastReplyAction = ko.computed({
				read: this.lastReplyAction_,
				write: function (sValue) {
					sValue = -1 === Utils.inArray(sValue, [
						Enums.ComposeType.Reply, Enums.ComposeType.ReplyAll, Enums.ComposeType.Forward
					]) ? Enums.ComposeType.Reply : sValue;
					this.lastReplyAction_(sValue);
				},
				owner: this
			});

			this.lastReplyAction(Local.get(Enums.ClientSideKeyName.LastReplyAction) || Enums.ComposeType.Reply);
			this.lastReplyAction_.subscribe(function (sValue) {
				Local.set(Enums.ClientSideKeyName.LastReplyAction, sValue);
			});

			this.showFullInfo = ko.observable(false);
			this.moreDropdownTrigger = ko.observable(false);
			this.messageDomFocused = ko.observable(false).extend({'rateLimit': 0});

			this.messageVisibility = ko.computed(function () {
				return !this.messageLoadingThrottle() && !!this.message();
			}, this);

			this.message.subscribe(function (oMessage) {
				if (!oMessage)
				{
					this.currentMessage(null);
				}
			}, this);

			this.canBeRepliedOrForwarded = ko.computed(function () {
				var bV = this.messageVisibility();
				return !this.isDraftFolder() && bV;
			}, this);

			// commands
			this.closeMessage = Utils.createCommand(this, function () {
				Data.message(null);
			});

			this.replyCommand = createCommandHelper(Enums.ComposeType.Reply);
			this.replyAllCommand = createCommandHelper(Enums.ComposeType.ReplyAll);
			this.forwardCommand = createCommandHelper(Enums.ComposeType.Forward);
			this.forwardAsAttachmentCommand = createCommandHelper(Enums.ComposeType.ForwardAsAttachment);
			this.editAsNewCommand = createCommandHelper(Enums.ComposeType.EditAsNew);

			this.messageVisibilityCommand = Utils.createCommand(this, Utils.emptyFunction, this.messageVisibility);

			this.messageEditCommand = Utils.createCommand(this, function () {
				this.editMessage();
			}, this.messageVisibility);

			this.deleteCommand = Utils.createCommand(this, function () {
				if (this.message())
				{
					__webpack_require__(/*! App/User */ 6).deleteMessagesFromFolder(Enums.FolderType.Trash,
						this.message().folderFullNameRaw,
						[this.message().uid], true);
				}
			}, this.messageVisibility);

			this.deleteWithoutMoveCommand = Utils.createCommand(this, function () {
				if (this.message())
				{
					__webpack_require__(/*! App/User */ 6).deleteMessagesFromFolder(Enums.FolderType.Trash,
						Data.currentFolderFullNameRaw(),
						[this.message().uid], false);
				}
			}, this.messageVisibility);

			this.archiveCommand = Utils.createCommand(this, function () {
				if (this.message())
				{
					__webpack_require__(/*! App/User */ 6).deleteMessagesFromFolder(Enums.FolderType.Archive,
						this.message().folderFullNameRaw,
						[this.message().uid], true);
				}
			}, this.messageVisibility);

			this.spamCommand = Utils.createCommand(this, function () {
				if (this.message())
				{
					__webpack_require__(/*! App/User */ 6).deleteMessagesFromFolder(Enums.FolderType.Spam,
						this.message().folderFullNameRaw,
						[this.message().uid], true);
				}
			}, this.messageVisibility);

			this.notSpamCommand = Utils.createCommand(this, function () {
				if (this.message())
				{
					__webpack_require__(/*! App/User */ 6).deleteMessagesFromFolder(Enums.FolderType.NotSpam,
						this.message().folderFullNameRaw,
						[this.message().uid], true);
				}
			}, this.messageVisibility);

			// viewer

			this.viewBodyTopValue = ko.observable(0);

			this.viewHash = '';
			this.viewSubject = ko.observable('');
			this.viewFromShort = ko.observable('');
			this.viewFromDkimData = ko.observable(['none', '']);
			this.viewToShort = ko.observable('');
			this.viewFrom = ko.observable('');
			this.viewTo = ko.observable('');
			this.viewCc = ko.observable('');
			this.viewBcc = ko.observable('');
			this.viewDate = ko.observable('');
			this.viewSize = ko.observable('');
			this.viewMoment = ko.observable('');
			this.viewLineAsCcc = ko.observable('');
			this.viewViewLink = ko.observable('');
			this.viewDownloadLink = ko.observable('');
			this.viewUserPic = ko.observable(Consts.DataImages.UserDotPic);
			this.viewUserPicVisible = ko.observable(false);
			this.viewIsImportant = ko.observable(false);

			this.viewPgpPassword = ko.observable('');
			this.viewPgpSignedVerifyStatus = ko.computed(function () {
				return this.message() ? this.message().pgpSignedVerifyStatus() : Enums.SignedVerifyStatus.None;
			}, this);

			this.viewPgpSignedVerifyUser = ko.computed(function () {
				return this.message() ? this.message().pgpSignedVerifyUser() : '';
			}, this);

			this.viewFromDkimStatusIconClass = ko.computed(function () {

				var sResult = 'icon-none iconcolor-display-none';
	//			var sResult = 'icon-warning-alt iconcolor-grey';
				switch (this.viewFromDkimData()[0])
				{
					case 'none':
						break;
					case 'pass':
						sResult = 'icon-ok iconcolor-green';
	//					sResult = 'icon-warning-alt iconcolor-green';
						break;
					default:
						sResult = 'icon-warning-alt iconcolor-red';
						break;
				}

				return sResult;

			}, this);

			this.viewFromDkimStatusTitle = ko.computed(function () {

				var aStatus = this.viewFromDkimData();
				if (Utils.isNonEmptyArray(aStatus))
				{
					if (aStatus[0] && aStatus[1])
					{
						return aStatus[1];
					}
					else if (aStatus[0])
					{
						return 'DKIM: ' + aStatus[0];
					}
				}

				return '';

			}, this);

			this.message.subscribe(function (oMessage) {

				this.messageActiveDom(null);

				this.viewPgpPassword('');

				if (oMessage)
				{
					if (this.viewHash !== oMessage.hash)
					{
						this.scrollMessageToTop();
					}

					this.viewHash = oMessage.hash;
					this.viewSubject(oMessage.subject());
					this.viewFromShort(oMessage.fromToLine(true, true));
					this.viewFromDkimData(oMessage.fromDkimData());
					this.viewToShort(oMessage.toToLine(true, true));
					this.viewFrom(oMessage.fromToLine(false));
					this.viewTo(oMessage.toToLine(false));
					this.viewCc(oMessage.ccToLine(false));
					this.viewBcc(oMessage.bccToLine(false));
					this.viewDate(oMessage.fullFormatDateValue());
					this.viewSize(oMessage.friendlySize());
					this.viewMoment(oMessage.momentDate());
					this.viewLineAsCcc(oMessage.lineAsCcc());
					this.viewViewLink(oMessage.viewLink());
					this.viewDownloadLink(oMessage.downloadLink());
					this.viewIsImportant(oMessage.isImportant());

					sLastEmail = oMessage.fromAsSingleEmail();
					Cache.getUserPic(sLastEmail, function (sPic, $sEmail) {
						if (sPic !== self.viewUserPic() && sLastEmail === $sEmail)
						{
							self.viewUserPicVisible(false);
							self.viewUserPic(Consts.DataImages.UserDotPic);
							if ('' !== sPic)
							{
								self.viewUserPicVisible(true);
								self.viewUserPic(sPic);
							}
						}
					});
				}
				else
				{
					this.viewHash = '';
					this.scrollMessageToTop();
				}

			}, this);

			this.fullScreenMode.subscribe(function (bValue) {
				if (bValue)
				{
					Globals.$html.addClass('rl-message-fullscreen');
				}
				else
				{
					Globals.$html.removeClass('rl-message-fullscreen');
				}

				Utils.windowResize();
			});

			this.messageLoadingThrottle.subscribe(Utils.windowResizeCallback);

			this.goUpCommand = Utils.createCommand(this, function () {
				Events.pub('mailbox.message-list.selector.go-up');
			});

			this.goDownCommand = Utils.createCommand(this, function () {
				Events.pub('mailbox.message-list.selector.go-down');
			});

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/User/MailBox/MessageView', 'View/App/MailBox/MessageView', 'MailBoxMessageViewViewModel'], MessageViewMailBoxUserView);
		_.extend(MessageViewMailBoxUserView.prototype, AbstractView.prototype);

		MessageViewMailBoxUserView.prototype.isPgpActionVisible = function ()
		{
			return Enums.SignedVerifyStatus.Success !== this.viewPgpSignedVerifyStatus();
		};

		MessageViewMailBoxUserView.prototype.isPgpStatusVerifyVisible = function ()
		{
			return Enums.SignedVerifyStatus.None !== this.viewPgpSignedVerifyStatus();
		};

		MessageViewMailBoxUserView.prototype.isPgpStatusVerifySuccess = function ()
		{
			return Enums.SignedVerifyStatus.Success === this.viewPgpSignedVerifyStatus();
		};

		MessageViewMailBoxUserView.prototype.pgpStatusVerifyMessage = function ()
		{
			var sResult = '';
			switch (this.viewPgpSignedVerifyStatus())
			{
				case Enums.SignedVerifyStatus.UnknownPublicKeys:
					sResult = Translator.i18n('PGP_NOTIFICATIONS/NO_PUBLIC_KEYS_FOUND');
					break;
				case Enums.SignedVerifyStatus.UnknownPrivateKey:
					sResult = Translator.i18n('PGP_NOTIFICATIONS/NO_PRIVATE_KEY_FOUND');
					break;
				case Enums.SignedVerifyStatus.Unverified:
					sResult = Translator.i18n('PGP_NOTIFICATIONS/UNVERIFIRED_SIGNATURE');
					break;
				case Enums.SignedVerifyStatus.Error:
					sResult = Translator.i18n('PGP_NOTIFICATIONS/DECRYPTION_ERROR');
					break;
				case Enums.SignedVerifyStatus.Success:
					sResult = Translator.i18n('PGP_NOTIFICATIONS/GOOD_SIGNATURE', {
						'USER': this.viewPgpSignedVerifyUser()
					});
					break;
			}

			return sResult;
		};

		MessageViewMailBoxUserView.prototype.fullScreen = function ()
		{
			this.fullScreenMode(true);
			Utils.windowResize();
		};

		MessageViewMailBoxUserView.prototype.unFullScreen = function ()
		{
			this.fullScreenMode(false);
			Utils.windowResize();
		};

		MessageViewMailBoxUserView.prototype.toggleFullScreen = function ()
		{
			Utils.removeSelection();

			this.fullScreenMode(!this.fullScreenMode());
			Utils.windowResize();
		};

		/**
		 * @param {string} sType
		 */
		MessageViewMailBoxUserView.prototype.replyOrforward = function (sType)
		{
			kn.showScreenPopup(__webpack_require__(/*! View/Popup/Compose */ 27), [sType, Data.message()]);
		};

		MessageViewMailBoxUserView.prototype.onBuild = function (oDom)
		{
			var
				self = this,
				sErrorMessage = Translator.i18n('PREVIEW_POPUP/IMAGE_ERROR'),
				fCheckHeaderHeight = function () {
					if (self.oHeaderDom)
					{
						self.viewBodyTopValue(self.message() ? self.oHeaderDom.height() +
							20 /* padding-(top/bottom): 20px */ + 1 /* borded-bottom: 1px */ : 0);
					}
				}
			;

			this.fullScreenMode.subscribe(function (bValue) {
				if (bValue)
				{
					self.message.focused(true);
				}
			}, this);

			this.fullScreenMode.subscribe(fCheckHeaderHeight);
			this.showFullInfo.subscribe(fCheckHeaderHeight);
			this.message.subscribe(fCheckHeaderHeight);

			Globals.$win.on('resize', function () {
				_.delay(fCheckHeaderHeight, 1);
				_.delay(fCheckHeaderHeight, 200);
				_.delay(fCheckHeaderHeight, 500);
			});

			this.showFullInfo.subscribe(function () {
				Utils.windowResize();
				Utils.windowResize(250);
			});

			this.oHeaderDom = $('.messageItemHeader', oDom);
			this.oHeaderDom = this.oHeaderDom[0] ? this.oHeaderDom : null;

			this.pswpDom = $('.pswp', oDom)[0];

			if (this.pswpDom)
			{
				oDom
					.on('click', '.attachmentImagePreview[data-index]', function (oEvent) {

						var
							oPs = null,
							oEl = oEvent.currentTarget || null,
							aItems = []
	//						fThumbBoundsFn = function (index) {
	//							var oRes = null, oEl = aItems[index], oPos = null;
	//							if (oEl && oEl.el)
	//							{
	//								oPos = oEl.el.find('.iconBG').offset();
	//								oRes = oPos && oPos.top && oPos.left ?
	//									{x: oPos.left, y: oPos.top, w: 60} : null;
	//							}
	//
	//							return oRes;
	//						}
						;

						oDom.find('.attachmentImagePreview[data-index]').each(function (index, oSubElement) {

							var
								$oItem = $(oSubElement)
							;

							aItems.push({
	//							'el': $oItem,
								'w': 600, 'h': 400,
								'src': $oItem.attr('href'),
								'title': $oItem.attr('title') || ''
							});
						});

						if (aItems && 0 < aItems.length)
						{
							Globals.useKeyboardShortcuts(false);

							oPs = new PhotoSwipe(self.pswpDom, PhotoSwipeUI_Default, aItems, {
								'index': Utils.pInt($(oEl).data('index')),
								'bgOpacity': 0.85,
								'loadingIndicatorDelay': 500,
								'errorMsg': '<div class="pswp__error-msg">' + sErrorMessage + '</div>',
								'showHideOpacity': true,
								'tapToToggleControls': false,
	//							'getThumbBoundsFn': fThumbBoundsFn,
								'timeToIdle': 0,
								'timeToIdleOutside': 0,
								'history': false,
								'arrowEl': 1 < aItems.length,
								'counterEl': 1 < aItems.length,
								'shareEl': false
							});

							oPs.listen('imageLoadComplete', function(index, item) {
								if (item && item.img && item.img.width && item.img.height)
								{
									item.w = item.img.width;
									item.h = item.img.height;

									oPs.updateSize(true);
								}
							});

							oPs.listen('close', function() {
								Globals.useKeyboardShortcuts(true);
							});

							oPs.init();
						}

						return false;
					});
			}

			oDom
				.on('click', 'a', function (oEvent) {
					// setup maito protocol
					return !(!!oEvent && 3 !== oEvent['which'] && Utils.mailToHelper($(this).attr('href'), __webpack_require__(/*! View/Popup/Compose */ 27)));
				})
				.on('click', '.attachmentsPlace .attachmentIconParent', function (oEvent) {
					if (oEvent && oEvent.stopPropagation)
					{
						oEvent.stopPropagation();
					}
				})
				.on('click', '.attachmentsPlace .attachmentItem .attachmentNameParent', function () {

					var
						oAttachment = ko.dataFor(this)
					;

					if (oAttachment && oAttachment.download)
					{
						__webpack_require__(/*! App/User */ 6).download(oAttachment.linkDownload());
					}
				})
			;

			this.message.focused.subscribe(function (bValue) {
				if (bValue && !Utils.inFocus()) {
					this.messageDomFocused(true);
				} else {
					this.messageDomFocused(false);
					this.scrollMessageToTop();
					this.scrollMessageToLeft();
				}
			}, this);

			this.messageDomFocused.subscribe(function (bValue) {
				if (!bValue && Enums.KeyState.MessageView === Globals.keyScope())
				{
					this.message.focused(false);
				}
			}, this);

			Globals.keyScope.subscribe(function (sValue) {
				if (Enums.KeyState.MessageView === sValue && this.message.focused())
				{
					this.messageDomFocused(true);
				}
			}, this);

			this.oMessageScrollerDom = oDom.find('.messageItem .content');
			this.oMessageScrollerDom = this.oMessageScrollerDom && this.oMessageScrollerDom[0] ? this.oMessageScrollerDom : null;

			this.initShortcuts();
		};

		/**
		 * @return {boolean}
		 */
		MessageViewMailBoxUserView.prototype.escShortcuts = function ()
		{
			if (this.viewModelVisibility() && this.message())
			{
				if (this.fullScreenMode())
				{
					this.fullScreenMode(false);
				}
				else if (Enums.Layout.NoPreview === this.layout())
				{
					this.message(null);
				}
				else
				{
					this.message.focused(false);
				}

				return false;
			}
		};

		MessageViewMailBoxUserView.prototype.initShortcuts = function ()
		{
			var
				self = this
			;

			// exit fullscreen, back
			key('esc', Enums.KeyState.MessageView, _.bind(this.escShortcuts, this));

			// fullscreen
			key('enter', Enums.KeyState.MessageView, function () {
				self.toggleFullScreen();
				return false;
			});

			key('enter', Enums.KeyState.MessageList, function () {
				if (Enums.Layout.NoPreview !== self.layout() && self.message())
				{
					self.toggleFullScreen();
					return false;
				}
			});

			// reply
			key('r', [Enums.KeyState.MessageList, Enums.KeyState.MessageView], function () {
				if (Data.message())
				{
					self.replyCommand();
					return false;
				}
			});

			// replaAll
			key('a', [Enums.KeyState.MessageList, Enums.KeyState.MessageView], function () {
				if (Data.message())
				{
					self.replyAllCommand();
					return false;
				}
			});

			// forward
			key('f', [Enums.KeyState.MessageList, Enums.KeyState.MessageView], function () {
				if (Data.message())
				{
					self.forwardCommand();
					return false;
				}
			});

			// message information
		//	key('i', [Enums.KeyState.MessageList, Enums.KeyState.MessageView], function () {
		//		if (oData.message())
		//		{
		//			self.showFullInfo(!self.showFullInfo());
		//			return false;
		//		}
		//	});

			// toggle message blockquotes
			key('b', [Enums.KeyState.MessageList, Enums.KeyState.MessageView], function () {
				if (Data.message() && Data.message().body)
				{
					Data.message().body.find('.rlBlockquoteSwitcher').click();
					return false;
				}
			});

			key('ctrl+left, command+left, ctrl+up, command+up', Enums.KeyState.MessageView, function () {
				self.goUpCommand();
				return false;
			});

			key('ctrl+right, command+right, ctrl+down, command+down', Enums.KeyState.MessageView, function () {
				self.goDownCommand();
				return false;
			});

			// print
			key('ctrl+p, command+p', Enums.KeyState.MessageView, function () {
				if (self.message())
				{
					self.message().printMessage();
				}

				return false;
			});

			// delete
			key('delete, shift+delete', Enums.KeyState.MessageView, function (event, handler) {
				if (event)
				{
					if (handler && 'shift+delete' === handler.shortcut)
					{
						self.deleteWithoutMoveCommand();
					}
					else
					{
						self.deleteCommand();
					}

					return false;
				}
			});

			// change focused state
			key('tab, shift+tab, left', Enums.KeyState.MessageView, function (event, handler) {
				if (!self.fullScreenMode() && self.message() && Enums.Layout.NoPreview !== self.layout())
				{
					if (event && handler && 'left' === handler.shortcut)
					{
						if (self.oMessageScrollerDom && 0 < self.oMessageScrollerDom.scrollLeft())
						{
							return true;
						}

						self.message.focused(false);
					}
					else
					{
						self.message.focused(false);
					}
				}
				else if (self.message() && Enums.Layout.NoPreview === self.layout() && event && handler && 'left' === handler.shortcut)
				{
					return true;
				}

				return false;
			});
		};

		/**
		 * @return {boolean}
		 */
		MessageViewMailBoxUserView.prototype.isDraftFolder = function ()
		{
			return Data.message() && FolderStore.draftFolder() === Data.message().folderFullNameRaw;
		};

		/**
		 * @return {boolean}
		 */
		MessageViewMailBoxUserView.prototype.isSentFolder = function ()
		{
			return Data.message() && FolderStore.sentFolder() === Data.message().folderFullNameRaw;
		};

		/**
		 * @return {boolean}
		 */
		MessageViewMailBoxUserView.prototype.isSpamFolder = function ()
		{
			return Data.message() && FolderStore.spamFolder() === Data.message().folderFullNameRaw;
		};

		/**
		 * @return {boolean}
		 */
		MessageViewMailBoxUserView.prototype.isSpamDisabled = function ()
		{
			return Data.message() && FolderStore.spamFolder() === Consts.Values.UnuseOptionValue;
		};

		/**
		 * @return {boolean}
		 */
		MessageViewMailBoxUserView.prototype.isArchiveFolder = function ()
		{
			return Data.message() && FolderStore.archiveFolder() === Data.message().folderFullNameRaw;
		};

		/**
		 * @return {boolean}
		 */
		MessageViewMailBoxUserView.prototype.isArchiveDisabled = function ()
		{
			return Data.message() && FolderStore.archiveFolder() === Consts.Values.UnuseOptionValue;
		};

		/**
		 * @return {boolean}
		 */
		MessageViewMailBoxUserView.prototype.isDraftOrSentFolder = function ()
		{
			return this.isDraftFolder() || this.isSentFolder();
		};

		MessageViewMailBoxUserView.prototype.composeClick = function ()
		{
			kn.showScreenPopup(__webpack_require__(/*! View/Popup/Compose */ 27));
		};

		MessageViewMailBoxUserView.prototype.editMessage = function ()
		{
			if (Data.message())
			{
				kn.showScreenPopup(__webpack_require__(/*! View/Popup/Compose */ 27), [Enums.ComposeType.Draft, Data.message()]);
			}
		};

		MessageViewMailBoxUserView.prototype.scrollMessageToTop = function ()
		{
			if (this.oMessageScrollerDom)
			{
				if (50 < this.oMessageScrollerDom.scrollTop())
				{
					this.oMessageScrollerDom
						.scrollTop(50)
						.animate({'scrollTop': 0}, 200)
					;
				}
				else
				{
					this.oMessageScrollerDom.scrollTop(0);
				}

				Utils.windowResize();
			}
		};

		MessageViewMailBoxUserView.prototype.scrollMessageToLeft = function ()
		{
			if (this.oMessageScrollerDom)
			{
				this.oMessageScrollerDom.scrollLeft(0);
				Utils.windowResize();
			}
		};

		/**
		 * @param {MessageModel} oMessage
		 */
		MessageViewMailBoxUserView.prototype.showImages = function (oMessage)
		{
			if (oMessage && oMessage.showExternalImages)
			{
				oMessage.showExternalImages(true);
			}
		};

		/**
		 * @returns {string}
		 */
		MessageViewMailBoxUserView.prototype.printableCheckedMessageCount = function ()
		{
			var iCnt = this.messageListCheckedOrSelectedUidsWithSubMails().length;
			return 0 < iCnt ? (100 > iCnt ? iCnt : '99+') : '';
		};


		/**
		 * @param {MessageModel} oMessage
		 */
		MessageViewMailBoxUserView.prototype.verifyPgpSignedClearMessage = function (oMessage)
		{
			if (oMessage)
			{
				oMessage.verifyPgpSignedClearMessage();
			}
		};

		/**
		 * @param {MessageModel} oMessage
		 */
		MessageViewMailBoxUserView.prototype.decryptPgpEncryptedMessage = function (oMessage)
		{
			if (oMessage)
			{
				oMessage.decryptPgpEncryptedMessage(this.viewPgpPassword());
			}
		};

		/**
		 * @param {MessageModel} oMessage
		 */
		MessageViewMailBoxUserView.prototype.readReceipt = function (oMessage)
		{
			if (oMessage && '' !== oMessage.readReceipt())
			{
				Remote.sendReadReceiptMessage(Utils.emptyFunction, oMessage.folderFullNameRaw, oMessage.uid,
					oMessage.readReceipt(),
					Translator.i18n('READ_RECEIPT/SUBJECT', {'SUBJECT': oMessage.subject()}),
					Translator.i18n('READ_RECEIPT/BODY', {'READ-RECEIPT': AccountStore.email()}));

				oMessage.isReadReceipt(true);

				Cache.storeMessageFlagsToCache(oMessage);

				__webpack_require__(/*! App/User */ 6).reloadFlagsCurrentMessageListAndMessageFromCache();
			}
		};

		module.exports = MessageViewMailBoxUserView;

	}());

/***/ },
/* 148 */
/*!*************************************************!*\
  !*** ./dev/View/User/MailBox/SystemDropDown.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractSystemDropDownViewModel = __webpack_require__(/*! View/User/AbstractSystemDropDown */ 91)
		;

		/**
		 * @constructor
		 * @extends AbstractSystemDropDownViewModel
		 */
		function SystemDropDownMailBoxUserView()
		{
			AbstractSystemDropDownViewModel.call(this);
			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/User/MailBox/SystemDropDown', 'View/App/MailBox/SystemDropDown', 'MailBoxSystemDropDownViewModel'], SystemDropDownMailBoxUserView);
		_.extend(SystemDropDownMailBoxUserView.prototype, AbstractSystemDropDownViewModel.prototype);

		module.exports = SystemDropDownMailBoxUserView;

	}());


/***/ },
/* 149 */
/*!****************************************!*\
  !*** ./dev/View/User/Settings/Menu.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			Globals = __webpack_require__(/*! Common/Globals */ 8),
			Links = __webpack_require__(/*! Common/Links */ 12),

			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @param {?} oScreen
		 *
		 * @constructor
		 * @extends AbstractView
		 */
		function MenuSettingsUserView(oScreen)
		{
			AbstractView.call(this, 'Left', 'SettingsMenu');

			this.leftPanelDisabled = Globals.leftPanelDisabled;

			this.menu = oScreen.menu;

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/User/Settings/Menu', 'View/App/Settings/Menu', 'SettingsMenuViewModel'], MenuSettingsUserView);
		_.extend(MenuSettingsUserView.prototype, AbstractView.prototype);

		MenuSettingsUserView.prototype.link = function (sRoute)
		{
			return Links.settings(sRoute);
		};

		MenuSettingsUserView.prototype.backToMailBoxClick = function ()
		{
			kn.setHash(Links.inbox(Cache.getFolderInboxName()));
		};

		module.exports = MenuSettingsUserView;

	}());

/***/ },
/* 150 */
/*!****************************************!*\
  !*** ./dev/View/User/Settings/Pane.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),
			key = __webpack_require__(/*! key */ 21),

			Enums = __webpack_require__(/*! Common/Enums */ 4),
			Links = __webpack_require__(/*! Common/Links */ 12),

			Data = __webpack_require__(/*! Storage/User/Data */ 15),
			Cache = __webpack_require__(/*! Storage/User/Cache */ 19),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractView = __webpack_require__(/*! Knoin/AbstractView */ 11)
		;

		/**
		 * @constructor
		 * @extends AbstractView
		 */
		function PaneSettingsUserView()
		{
			AbstractView.call(this, 'Right', 'SettingsPane');

			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/User/Settings/Pane', 'View/App/Settings/Pane', 'SettingsPaneViewModel'], PaneSettingsUserView);
		_.extend(PaneSettingsUserView.prototype, AbstractView.prototype);

		PaneSettingsUserView.prototype.onBuild = function ()
		{
			var self = this;
			key('esc', Enums.KeyState.Settings, function () {
				self.backToMailBoxClick();
			});
		};

		PaneSettingsUserView.prototype.onShow = function ()
		{
			Data.message(null);
		};

		PaneSettingsUserView.prototype.backToMailBoxClick = function ()
		{
			kn.setHash(Links.inbox(Cache.getFolderInboxName()));
		};

		module.exports = PaneSettingsUserView;

	}());

/***/ },
/* 151 */
/*!**************************************************!*\
  !*** ./dev/View/User/Settings/SystemDropDown.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	
	(function () {

		'use strict';

		var
			_ = __webpack_require__(/*! _ */ 2),

			kn = __webpack_require__(/*! Knoin/Knoin */ 5),
			AbstractSystemDropDownUserView = __webpack_require__(/*! View/User/AbstractSystemDropDown */ 91)
		;

		/**
		 * @constructor
		 * @extends AbstractSystemDropDownUserView
		 */
		function SystemDropDownSettingsUserView()
		{
			AbstractSystemDropDownUserView.call(this);
			kn.constructorEnd(this);
		}

		kn.extendAsViewModel(['View/User/Settings/SystemDropDown', 'View/App/Settings/SystemDropDown', 'SettingsSystemDropDownViewModel'], SystemDropDownSettingsUserView);
		_.extend(SystemDropDownSettingsUserView.prototype, AbstractSystemDropDownUserView.prototype);

		module.exports = SystemDropDownSettingsUserView;

	}());

/***/ },
/* 152 */
/*!******************************!*\
  !*** external "window.$LAB" ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.$LAB;

/***/ },
/* 153 */
/*!************************************!*\
  !*** external "window.PhotoSwipe" ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.PhotoSwipe;

/***/ },
/* 154 */
/*!**********************************************!*\
  !*** external "window.PhotoSwipeUI_Default" ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.PhotoSwipeUI_Default;

/***/ },
/* 155 */
/*!******************************!*\
  !*** external "window.buzz" ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.buzz;

/***/ },
/* 156 */
/*!***********************************!*\
  !*** external "window.ifvisible" ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.ifvisible;

/***/ }
/******/ ])
