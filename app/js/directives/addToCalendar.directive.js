(function() {
    'use strict';

    angular.module('directive.addtocalendar', ['ngFileSaver'])
        .directive('addToCalendar', function() {
            return {
                restrict: 'E',
                scope: {
                    startDate: '@',
                    endDate: '@',
                    title: '@',
                    description: '@',
                    location: '@'
                },
                controller: ['$scope', '$attrs', 'FileSaver', function($scope, $attrs, FileSaver) {

                    $scope.description = $scope.description || '';
                    var startICS = toITCFormat($scope.startDate),
                        endICS = toITCFormat($scope.endDate);

                    function forEachAttr(attrs, cb) {
                        for (var key in attrs) {
                            if (attrs.hasOwnProperty(key) && key.indexOf('$') === -1) {
                                cb(key, attrs[key]);
                            }
                        }
                    }

                    function formatIcsText(s, maxLength) {
                        function _wrap(s) {
                            if (s.length <= maxLength) {
                                return s;
                            }
                            return s.substring(0, maxLength).replace(/\n/g, '\\n') + "\r\n " + _wrap(s.substring(maxLength), 75);
                        }
                        return _wrap(s.replace(/\n/g, '\\n'), maxLength);
                    }

                    function getHoursDuration(startDate, endDate) {
                        var start = moment(startDate),
                            end = moment(endDate),
                            hours = moment.duration(end.diff(start)).asHours(),
                            minutes = (hours % 1) * 60;

                        if (hours < 10) {
                            hours = '0' + hours;
                        }
                        if (minutes < 10) {
                            minutes = '0' + minutes;
                        }

                        return Number.parseInt(hours).toString() + minutes.toString();
                    }

                    function getIcsBlob(icsData) {
                        return new Blob([icsData], {
                            type: 'application/octet-stream'
                        });
                    }

                    function getIcsFileName(title) {
                        return title.replace(/[^\w ]+/g, '') + '.ics';
                    }

                    function getGoogleCalendarUrl(data) {
                        var googleCalendarUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
                        googleCalendarUrl += '&text=' + data.title;
                        googleCalendarUrl += '&dates=' + startICS + '/' + endICS;
                        googleCalendarUrl += '&details=' + data.description;
                        googleCalendarUrl += '&location=' + data.location;

                        return googleCalendarUrl;
                    }

                    function toITCFormat(date) {
                        return date.replace(/-/g, '').replace(/:/g, '').replace(/\..*$/, 'Z');
                    }

                    function getIcsCalendar(data) {

                        return [
                            'BEGIN:VCALENDAR',
                            'VERSION:2.0',
                            'PRODID:-//speedcontractor/web//NONSGML v1.0//EN',
                            'BEGIN:VEVENT',
                            'UID:info@speedcontractor.com',
                            'DTSTAMP:' + startICS,
                            'CLASS:PUBLIC',
                            'DESCRIPTION:' + formatIcsText(data.description, 62),
                            'DTSTART:' + startICS,
                            'DTEND:' + endICS,
                            'LOCATION:' + formatIcsText(data.location, 64),
                            'SUMMARY:' + formatIcsText(data.title, 66),
                            'TRANSP:TRANSPARENT',
                            'END:VEVENT',
                            'END:VCALENDAR'
                        ].join('\r\n');
                    }

                    function getMicrosoftCalendarUrl(data) {
                        var microsoftCalendarUrl = 'http://calendar.live.com/calendar/calendar.aspx?rru=addevent';
                        microsoftCalendarUrl += '&summary=' + data.title;
                        microsoftCalendarUrl += '&dtstart=' + startICS + '&dtend=' + endICS;
                        microsoftCalendarUrl += '&description=' + data.description;
                        microsoftCalendarUrl += '&location=' + data.location;

                        return microsoftCalendarUrl;
                    }

                    function getYahooCalendarUrl(data) {
                        var yahooCalendarUrl = 'http://calendar.yahoo.com/?v=60&view=d&type=20',
                            duration = getHoursDuration(data.startDate, data.endDate);

                        yahooCalendarUrl += '&TITLE=' + data.title;
                        yahooCalendarUrl += '&ST=' + startICS + '&DUR=' + duration;
                        yahooCalendarUrl += '&DESC=' + data.description;
                        yahooCalendarUrl += '&in_loc=' + data.location;

                        return yahooCalendarUrl;
                    }

                    function getSanitizedData() {
                        var urlData = {};
                        forEachAttr($scope, function(key) {
                            urlData[key] = encodeURIComponent($scope[key]);
                        });
                        return urlData;
                    }

                    function buildUrl() {
                        var urlData = angular.extend(getSanitizedData(), {
                            startDate: $scope.startDate,
                            endDate: $scope.endDate
                        });

                        $scope.calendarUrl = {
                            microsoft: getMicrosoftCalendarUrl(urlData),
                            google: getGoogleCalendarUrl(urlData),
                            yahoo: getYahooCalendarUrl(urlData),
                            icalendar: getIcsCalendar($scope),
                            dlIcal: dlIcal
                        };
                    }

                    function dlIcal() {
                        var fileName = getIcsFileName($scope.title),
                            icsData = $scope.calendarUrl.icalendar,
                            icsBlob = getIcsBlob(icsData);
                        FileSaver.saveAs(icsBlob, fileName);
                    }

                    function init() {
                        buildUrl();
                    }

                    $scope.go = function(url) {
                        var win = window.open(url, '_blank');
                        win.focus();
                    };

                    forEachAttr($attrs, function(key) {
                        $attrs.$observe(key, init);
                    });
                    init();
                }],
                templateUrl: 'add-to-calendar.html'
            };

        });
})();
