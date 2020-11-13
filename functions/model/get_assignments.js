const axios = require('axios');
const { get_course_names } = require('./get_course_names');

async function get_assignments(user_id) {
    const res = await axios.get(`https://us-central1-mana-test-294607.cloudfunctions.net/app/courses/getAllWork/${user_id}`);
    const result = make_carousels(res.data);
    return result;
}

async function make_carousels(result) {
    const courses = await get_course_names();
    const course_names = courses[0];
    const course_ids = courses[1];
    let result_columns = [];
    for (i = 0; i < result.length; i++) {
        const course_index = course_ids.indexOf(result[i].courseId);
        const course_name = course_names[course_index];
        const name = result[i].title.substring(0, 39);
        let alertColor = "#33cc33";   // default = green
        let duedate = "Not assigned";
        let uri = "No uri given"
        if (typeof result[i].dueDate != 'undefined') {
            duedate = result[i].dueDate;
        }
        if (typeof result[i].alternateLink != 'undefined') {
            uri = result[i].alternateLink;
        }
        let time_diff = -1;
        if (duedate != "Not assigned") {
            const dueday = result[i].dueDate.day;
            const duemonth = result[i].dueDate.month;
            const dueyear = result[i].dueDate.year;
            const assignment_duedate = Date.parse(`${dueyear}-${duemonth}-${dueday}`);
            const today_ms = Date.parse(new Date());
            read_duedate = `${dueday}/${duemonth}/${dueyear}`;
            time_diff = diff_minutes(assignment_duedate, today_ms);
            if (time_diff <= 10080 && time_diff > 0) {
                if (time_diff <= 7200 && time_diff > 4320) {
                    //Within 5 days -- yellow
                    alertColor = "#ffcc00";
                } else if (time_diff <= 4320 && time_diff > 1440) {
                    //Within 3 days -- orange
                    alertColor = "#ff6600";
                } else if (time_diff <= 1440) {
                    //Within today -- red
                    alertColor = "#ff0000";
                }
            }
            let a_column = {
                "timeDiff": time_diff,
                "body": {
                    "type": "bubble",
                    "hero": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "image",
                                        "url": "https://www.shareicon.net/data/2015/06/05/49641_document_386x498.png",
                                        "size": "full"
                                    }
                                ],
                                "width": "100%",
                                "height": "150px",
                                "backgroundColor": "#eeeeee"
                            },
                            {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": course_name,
                                        "color": "#ffffff"
                                    }
                                ],
                                "position": "absolute",
                                "backgroundColor": alertColor,
                                "paddingStart": "10px",
                                "paddingEnd": "10px",
                                "cornerRadius": "lg",
                                "offsetTop": "18px",
                                "offsetStart": "18px"
                            }
                        ]
                    },
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "text": name,
                                "size": "xl",
                                "weight": "bold",
                                "adjustMode": "shrink-to-fit"
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "Due:",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": read_duedate,
                                        "flex": 0
                                    }
                                ],
                                "spacing": "5px"
                            }
                        ]
                    },
                    "footer": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "button",
                                "action": {
                                    "type": "uri",
                                    "label": "รายละเอียด",
                                    "uri": uri
                                }
                            },
                            {
                                "type": "button",
                                "action": {
                                    "type": "uri",
                                    "label": "ส่งงาน",
                                    "uri": "https://mana-liff.web.app"
                                },
                                "style": "primary"
                            }
                        ]
                    }
                }
            }
            result_columns.push(a_column);
        }
    }
    // //Descending deadline
    result_columns.sort(function (x, y) {
        return x.timeDiff - y.timeDiff;
    });
    let top_columns = [];
    let top_len = result_columns.length;

    if (result_columns.length > 12) {
        top_len = 12;
    }
    for (i = 0; i < top_len; i++) {
        top_columns.push(result_columns[i].body);
    }

    res_carousel = [
        {
            "type": "flex",
            "altText": "This is a Flex Message",
            "contents": {
                "type": "carousel",
                "contents": top_columns
            }
        }
    ]
    return res_carousel[0];
}

function diff_minutes(duedate, today) {
    // var diff = (duedate.getTime() - today.getTime())/1000;
    var diff = (duedate - today) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}

module.exports = { get_assignments };