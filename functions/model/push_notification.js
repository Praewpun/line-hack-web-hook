const axios = require('axios');

async function get_notification(result) {
    const course_name = result.courseName;
    const work_title = result.workInfo.workTitle;
    let work_description = "No work description is given";
    let duedate = "Not assigned";
    if (typeof result.workInfo.description != 'undefined') {
        work_description = result.workInfo.description;
    }
    if (result.dueDate) {
        duedate = `${result.dueDate.day}/${result.dueDate.month}/${result.dueDate.year}`;
    }
    let result_send = [];
    if (result.downloadLink.length == 0) {
        // no attachment
        let notification = {
            "type": "bubble",
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "คุณครูมีประกาศ",
                        "size": "lg"
                    },
                    {
                        "type": "separator",
                        "margin": "lg"
                    }
                ],
                "paddingBottom": "none"
            },
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
                        "paddingEnd": "10px",
                        "paddingStart": "10px",
                        "cornerRadius": "lg",
                        "backgroundColor": "#3366ff",
                        "offsetTop": "13px"
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
                                        "type": "text",
                                        "text": work_title,
                                        "size": "xl",
                                        "weight": "bold"
                                    },
                                    {
                                        "type": "text",
                                        "flex": 0,
                                        "contents": [
                                            {
                                                "type": "span",
                                                "text": "วันที่ส่ง:"
                                            },
                                            {
                                                "type": "span",
                                                "text": " "
                                            },
                                            {
                                                "type": "span",
                                                "text": duedate
                                            }
                                        ],
                                        "size": "md",
                                        "offsetTop": "3px"
                                    }
                                ],
                                "spacing": "xl"
                            },
                            {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": work_description,
                                        "color": "#aaaaaa",
                                        "wrap": true,
                                        "adjustMode": "shrink-to-fit"
                                    }
                                ]
                            },
                            {
                                "type": "spacer",
                                "size": "xxl"
                            }
                        ],
                        "offsetTop": "xxl"
                    },
                    {
                        "type": "separator",
                        "margin": "lg"
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
                                        "type": "text",
                                        "text": "ไม่มีไฟล์แนบ",
                                        "flex": 0,
                                        "size": "md",
                                        "color": "#ffffff"
                                    }
                                ],
                                "height": "50px",
                                "backgroundColor": "#eeeeee",
                                "cornerRadius": "md",
                                "paddingStart": "10px",
                                "alignItems": "center",
                                "justifyContent": "center"
                            }
                        ],
                        "margin": "xl"
                    }
                ],
                "paddingBottom": "xl"
            }
        };
        result_send.push(notification);
    } else if (result.downloadLink.length == 1) {
        // with attachment
        const file_name = result.downloadLink[0].filename;
        const uri = result.downloadLink[0].url;
        let notification = {
            "type": "bubble",
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "คุณครูมีประกาศ",
                        "size": "lg"
                    },
                    {
                        "type": "separator",
                        "margin": "lg"
                    }
                ],
                "paddingBottom": "none"
            },
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
                        "paddingEnd": "10px",
                        "paddingStart": "10px",
                        "cornerRadius": "lg",
                        "backgroundColor": "#3366ff",
                        "offsetTop": "13px"
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
                                        "type": "text",
                                        "text": work_title,
                                        "size": "xl",
                                        "weight": "bold"
                                    },
                                    {
                                        "type": "text",
                                        "flex": 0,
                                        "contents": [
                                            {
                                                "type": "span",
                                                "text": "วันที่ส่ง:"
                                            },
                                            {
                                                "type": "span",
                                                "text": " "
                                            },
                                            {
                                                "type": "span",
                                                "text": duedate
                                            }
                                        ],
                                        "size": "md",
                                        "offsetTop": "3px"
                                    }
                                ],
                                "spacing": "xl"
                            },
                            {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": work_description,
                                        "color": "#aaaaaa",
                                        "wrap": true,
                                        "adjustMode": "shrink-to-fit"
                                    }
                                ]
                            },
                            {
                                "type": "spacer",
                                "size": "xxl"
                            }
                        ],
                        "offsetTop": "xxl"
                    },
                    {
                        "type": "separator",
                        "margin": "lg"
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
                                                "type": "image",
                                                "url": "https://w0.pngwave.com/png/131/553/computer-icons-document-file-format-others-png-clip-art.png",
                                                "size": "xxs"
                                            }
                                        ],
                                        "height": "50px",
                                        "justifyContent": "center",
                                        "flex": 0
                                    },
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": file_name,
                                                "size": "md"
                                            }
                                        ],
                                        "justifyContent": "center",
                                        "paddingStart": "10px"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "image",
                                                "size": "xxs",
                                                "url": "https://cdn0.iconfinder.com/data/icons/navigation-set-arrows-part-one/32/ChevronRight-512.png"
                                            }
                                        ],
                                        "justifyContent": "center",
                                        "flex": 0
                                    }
                                ],
                                "height": "50px",
                                "backgroundColor": "#eeeeee",
                                "cornerRadius": "md",
                                "paddingStart": "10px",
                                "action": {
                                    "type": "uri",
                                    "label": "action",
                                    "uri": uri
                                }
                            },
                            {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [],
                                "height": "10px"
                            }
                        ],
                        "margin": "xl"
                    }
                ],
                "paddingBottom": "xl"
            }
        }
        result_send.push(notification);
    }
    //more than 1 attachment -->  handle 2
    else {
        const file_name1 = result.downloadLink[0].filename;
        const uri1 = result.downloadLink[0].url;
        const file_name2 = result.downloadLink[1].filename;
        const uri2 = result.downloadLink[1].url;
        let notification = {
            "type": "bubble",
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "คุณครูมีประกาศ",
                        "size": "lg"
                    },
                    {
                        "type": "separator",
                        "margin": "lg"
                    }
                ],
                "paddingBottom": "none"
            },
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
                        "paddingEnd": "10px",
                        "paddingStart": "10px",
                        "cornerRadius": "lg",
                        "backgroundColor": "#3366ff",
                        "offsetTop": "13px"
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
                                        "type": "text",
                                        "text": work_title,
                                        "size": "xl",
                                        "weight": "bold"
                                    },
                                    {
                                        "type": "text",
                                        "flex": 0,
                                        "contents": [
                                            {
                                                "type": "span",
                                                "text": "วันที่ส่ง:"
                                            },
                                            {
                                                "type": "span",
                                                "text": " "
                                            },
                                            {
                                                "type": "span",
                                                "text": duedate
                                            }
                                        ],
                                        "size": "md",
                                        "offsetTop": "3px"
                                    }
                                ],
                                "spacing": "xl"
                            },
                            {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": work_description,
                                        "color": "#aaaaaa",
                                        "wrap": true,
                                        "adjustMode": "shrink-to-fit"
                                    }
                                ]
                            },
                            {
                                "type": "spacer",
                                "size": "xxl"
                            }
                        ],
                        "offsetTop": "xxl"
                    },
                    {
                        "type": "separator",
                        "margin": "lg"
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
                                                "type": "image",
                                                "url": "https://w0.pngwave.com/png/131/553/computer-icons-document-file-format-others-png-clip-art.png",
                                                "size": "xxs"
                                            }
                                        ],
                                        "height": "50px",
                                        "justifyContent": "center",
                                        "flex": 0
                                    },
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": file_name1,
                                                "size": "md"
                                            }
                                        ],
                                        "justifyContent": "center",
                                        "paddingStart": "10px"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "image",
                                                "size": "xxs",
                                                "url": "https://cdn0.iconfinder.com/data/icons/navigation-set-arrows-part-one/32/ChevronRight-512.png"
                                            }
                                        ],
                                        "justifyContent": "center",
                                        "flex": 0
                                    }
                                ],
                                "height": "50px",
                                "backgroundColor": "#eeeeee",
                                "cornerRadius": "md",
                                "paddingStart": "10px",
                                "action": {
                                    "type": "uri",
                                    "label": "action",
                                    "uri": uri1
                                }
                            },
                            {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [],
                                "height": "10px"
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "image",
                                                "url": "https://w0.pngwave.com/png/131/553/computer-icons-document-file-format-others-png-clip-art.png",
                                                "size": "xxs"
                                            }
                                        ],
                                        "flex": 0,
                                        "justifyContent": "center",
                                        "height": "50px"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": file_name2,
                                                "size": "md"
                                            }
                                        ],
                                        "justifyContent": "center",
                                        "paddingStart": "10px"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "image",
                                                "url": "https://cdn0.iconfinder.com/data/icons/navigation-set-arrows-part-one/32/ChevronRight-512.png",
                                                "size": "xxs"
                                            }
                                        ],
                                        "justifyContent": "center",
                                        "flex": 0
                                    }
                                ],
                                "height": "50px",
                                "backgroundColor": "#eeeeee",
                                "cornerRadius": "md",
                                "paddingStart": "10px",
                                "action": {
                                    "type": "uri",
                                    "label": "action",
                                    "uri": uri2
                                }
                            }
                        ],
                        "margin": "xl"
                    }
                ],
                "paddingBottom": "xl"
            }
        }
        result_send.push(notification);
    }

    flex_result = [
        {
            "type": "flex",
            "altText": "This is a Flex Message",
            "contents": {
                "type": "carousel",
                "contents": result_send
            }
        }
    ]
    return flex_result;
}

module.exports = { get_notification };