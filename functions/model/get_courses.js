const axios = require('axios');

async function get_courses() {
  const res = await axios.get('https://us-central1-mana-test-294607.cloudfunctions.net/app/courses');
  const result = make_carousels(res.data);
  return result;
}

function make_carousels(result) {
  let result_columns = [];
  let result_len = 0;
  const color_palette= ["#ff1a75","#ff99cc","#cc99ff","#9999ff","#33ccff","#33cccc","#00cc66","#ffcc00","#ff9900","#ff0000","#ffcc00","#ff9900"];
  for (i = 0; i < result.length; i++) {
    if (result[i].courseState == "ACTIVE") {
      result_len += 1;
    }
  }
  if (result_len > 10) {
    result_len = 10;
  }
  for (i = 0; i < result_len; i++) {
    if (result[i].courseState == "ACTIVE") {
      let course_name = result[i].name;
      const filecourse = `ขอไฟล์ วิชา ${course_name}`
      const assignmentcourse = `ของาน วิชา ${course_name}`
      const contactcourse = `ขอข้อมูลอาจารย์ วิชา ${course_name}`
      let a_column =  {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
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
              "cornerRadius": "lg",
              "paddingStart": "10px",
              "paddingEnd": "10px",
              "offsetTop": "18px",
              "offsetStart": "18px"
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": course_name,
                      "color": "#ffffff",
                      "size": "xxl",
                      "adjustMode": "shrink-to-fit"
                    }
                  ],
                  "width": "100%",
                  "height": "60%",
                  "flex": 1,
                  "justifyContent": "center",
                  "alignItems": "center"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "text",
                              "text": "ไฟล์",
                              "color": "#ffffff"
                            }
                          ],
                          "borderWidth": "1px",
                          "borderColor": "#ffffff",
                          "height": "100%",
                          "cornerRadius": "md",
                          "flex": 1,
                          "justifyContent": "center",
                          "alignItems": "center",
                          "action": {
                            "type": "message",
                            "label": "action",
                            "text": filecourse
                          },
                          "backgroundColor": "#00000040"
                        },
                        {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [],
                          "height": "100%",
                          "width": "5%"
                        },
                        {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "text",
                              "text": "งาน",
                              "color": "#ffffff"
                            }
                          ],
                          "height": "100%",
                          "borderWidth": "1px",
                          "borderColor": "#ffffff",
                          "cornerRadius": "md",
                          "flex": 1,
                          "justifyContent": "center",
                          "alignItems": "center",
                          "action": {
                            "type": "message",
                            "label": "action",
                            "text": assignmentcourse
                          },
                          "backgroundColor": "#00000040"
                        }
                      ],
                      "height": "40%",
                      "width": "80%",
                      "flex": 1,
                      "justifyContent": "center",
                      "alignItems": "center"
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "ข้อมูลอาจารย์",
                          "color": "#ffffff"
                        }
                      ],
                      "width": "80%",
                      "height": "40%",
                      "borderWidth": "1px",
                      "borderColor": "#ffffff",
                      "flex": 1,
                      "justifyContent": "center",
                      "alignItems": "center",
                      "cornerRadius": "md",
                      "action": {
                        "type": "message",
                        "label": "action",
                        "text": contactcourse
                      },
                      "backgroundColor": "#00000040"
                    }
                  ],
                  "width": "100%",
                  "height": "40%",
                  "backgroundColor": "#00000040",
                  "flex": 1,
                  "justifyContent": "space-between",
                  "alignItems": "center",
                  "paddingTop": "10px",
                  "paddingBottom": "10px"
                }
              ],
              "width": "100%",
              "height": "100%",
              "position": "absolute",
              "flex": 1
            }
          ],
          "paddingAll": "0px",
          "height": "300px",
          "backgroundColor": color_palette[i]
        }
      }
      result_columns.push(a_column);
    }
  }
  res_carousel = [
    {
      "type": "flex",
      "altText": "Courses",
      "contents": {
        "type": "carousel",
        "contents": result_columns
      }
    }
  ]
  return res_carousel;
}

module.exports = { get_courses };