const defaults = {
        monthFullNames: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        monthShortNames: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ],
        daysFullNames: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ],
        daysShortNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        format: {
            deyWeekMin: "D",
            deyWeek: "DD",
            dayMin: "d",
            day: "dd",
            monthMin: "M",
            month: "MM",
            monthShort: "MMM",
            monthFull: "MMMM",
            yearShort: "yy",
            yearFull: "yyyy",
            hourMin: "H",
            hour: "HH",
            hourAmPmMin: "h",
            hourAmPm: "hh",
            minutesMin: "m",
            minutes: "mm",
            secondsMin: "s",
            seconds: "ss",
            milliseconds: "sss",
            markerAmPm: "a",
            timezone: "Z"
        }
    },

    assignDeep = (...objects) => {
        let firstObject = objects[0];

        if (objects[1]) {
            for (let i = 1; i < objects.length; i++) {
                for (let name in objects[i]) {
                    if (objects[i].hasOwnProperty(name)) {
                        if (
                            !firstObject.hasOwnProperty(name) ||
                        Object.prototype.toString.call(objects[i][name]) !==
                            "[object Object]"
                        ) {
                            firstObject[name] = objects[i][name];
                        } else {
                            firstObject[name] = assignDeep(
                                firstObject[name],
                                objects[i][name]
                            );
                        }
                    }
                }
            }
        }

        return firstObject;
    },

    formatting = (date, string, options) => {
        if (!date && Object.prototype.toString.call(date) !== "[object Date]") {
            return null;
        }

        options =
        options && Object.prototype.toString.call(options) === "[object Object]"
            ? assignDeep({}, defaults, options)
            : defaults;

        string =
        !string || typeof string !== "string"
            ? `${options.format.monthShort} ${options.format.day}, ${
                options.format.yearFull
            } ${options.format.hour}:${options.format.minutes} ${
                options.format.timezone
            }`
            : string;

        // Date parse
        let dateParse = {};
        dateParse[options.format.deyWeekMin] =
        options.daysShortNames[date.getDay()];
        dateParse[options.format.deyWeek] = options.daysFullNames[date.getDay()];
        dateParse[options.format.dayMin] = date.getDate().toString();
        dateParse[options.format.day] = ("0" + date.getDate()).slice(-2);
        dateParse[options.format.monthMin] = (date.getMonth() + 1).toString();
        dateParse[options.format.month] = ("0" + (date.getMonth() + 1)).slice(-2);
        dateParse[options.format.monthShort] =
        options.monthShortNames[date.getMonth()];
        dateParse[options.format.monthFull] =
        options.monthFullNames[date.getMonth()];
        dateParse[options.format.yearShort] = date
            .getFullYear()
            .toString()
            .slice(-2);
        dateParse[options.format.yearFull] = date.getFullYear().toString();
        dateParse[options.format.hourMin] = date.getHours().toString();
        dateParse[options.format.hour] = ("0" + date.getHours()).slice(-2);
        dateParse[options.format.hourAmPmMin] =
        date.getHours() > 12
            ? (date.getHours() - 12).toString()
            : date.getHours().toString();
        dateParse[options.format.hourAmPm] =
        date.getHours() > 12
            ? ("0" + (date.getHours() - 12)).slice(-2)
            : ("0" + date.getHours()).slice(-2);
        dateParse[options.format.minutesMin] = date.getMinutes().toString();
        dateParse[options.format.minutes] = ("0" + date.getMinutes()).slice(-2);
        dateParse[options.format.secondsMin] = date.getSeconds().toString();
        dateParse[options.format.seconds] = ("0" + date.getSeconds()).slice(-2);
        dateParse[options.format.milliseconds] = (
            "00" + date.getMilliseconds()
        ).slice(-3);
        dateParse[options.format.markerAmPm] = date.getHours() > 12 ? "PM" : "AM";
        dateParse[options.format.timezone] = date.getTimezoneOffset().toString();

        // Format data
        var formatStr = '',
            stringArr = [],
            formatted = '';

        for (let item in options.format) {
            if (options.format.hasOwnProperty(item)) {
                formatStr += " " + options.format[item];
            }
        }
        formatStr += " ";

        // String parse
        // let stringArr = [];

        for (let s of string) {
            if (
                stringArr.length &&
            s !== " " &&
            formatStr.match(
                new RegExp(
                    `\\s(${stringArr[stringArr.length - 1] + s})[\\S]*\\s`,
                    "g"
                )
            )
            ) {
                stringArr[stringArr.length - 1] =
                stringArr[stringArr.length - 1] + s;
            } else {
                stringArr.push(s);
            }
        }

        // let formatted = "";

        for (let item of stringArr) {
            formatted += dateParse[item] ? dateParse[item] : item;
        }

        return formatted;
    },

    options = {
        format: {
            monthShort: "%b",
            day: "%d",
            yearFull: "%Y",
            hourAmPm: "%I",
            minutes: "%M",
            markerAmPm: "%p",
            timezone: "%Z"
        }
    };

// const format = 'MMM dd, yyyy hh:mma Z';
// const date = formatting(new Date());

// module.exports = formatting;

export {
    formatting
};
