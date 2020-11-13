const axios = require('axios');
const { get_course_names } = require('./get_course_names');

async function get_course_files(course_id,user_id) {
    const res = await axios.get(`https://us-central1-mana-test-294607.cloudfunctions.net/app/course/materials/${course_id}/${user_id}`);
    const result = make_carousels(res.data, course_id);
    return result;
}

async function make_carousels(result, course_id) {
    let result_columns = [];
    const courses = await get_course_names();
    const course_names = courses[0];
    const course_ids = courses[1];
    const course_index = course_ids.indexOf(course_id);
    const course_name = course_names[course_index];
    let action_type = "text";
    let result_len = result.length;
    if (result.length > 12) {
        result_len = 12;
    }
    for (i = 0; i < result_len; i++) {
        const title = result[i].title;
        const title_name = title.substring(0, 39);
        let upload_date = "Unknown upload date";
        let uri = "No uri given";
        if (typeof result[i].updateTime != 'undefined') {
            const upload_year = result[i].updateTime.substring(0, 4);
            const upload_month = result[i].updateTime.substring(5, 7);
            const upload_day = result[i].updateTime.substring(8, 10);
            upload_date = `${upload_day}/${upload_month}/${upload_year}`;
        }
        if (typeof result[i].alternateLink != 'undefined') {
            uri = result[i].alternateLink;
            action_type = "uri";
        }
        let a_column =
        {
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
                                "url": "https://slideplayer.in.th/slide/2114208/8/images/1/Lecture+2%3A+Logic+Methods+of+proof.jpg",
                                "size": "5xl"
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
                        "backgroundColor": "#3366ff",
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
                        "text": title_name,
                        "size": "xl",
                        "weight": "bold",
                        "adjustMode": "shrink-to-fit"
                    },
                    {
                        "type": "text",
                        "text": upload_date
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                    {
                        "type": "button",
                        "action": {
                            "type": action_type,
                            "label": "ขอไฟล์",
                            "uri": uri
                        }
                    }
                ]
            }
        }
        result_columns.push(a_column);
    }
    res_carousel = [
        {
            "type": "flex",
            "altText": "Files in the course",
            "contents": {
                "type": "carousel",
                "contents": result_columns
            },
            "sender": {
                "name": course_name,
                "iconUrl": "https://cdn3.vectorstock.com/i/1000x1000/87/27/teacher-icon-flat-style-vector-20708727.jpg"
            } 
        }
    ]
    return res_carousel;
}

module.exports = { get_course_files };


            