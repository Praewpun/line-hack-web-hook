const axios = require('axios');

async function send_user_id(user_id) {
    const uri = `https://mana.roadrei.com/courses/assignments/getUserid/${user_id}`;
    const consent = [
        {
            "type": "flex",
            "altText": "MANA wants to add you as a friend",
            "contents": {
                "type": "bubble",
                "size": "kilo",
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "\"เป็นเพื่อนกับ MANA นะ\"",
                            "align": "center"
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "image",
                                    "url": "https://firebasestorage.googleapis.com/v0/b/mana-test-294607.appspot.com/o/messageImage_1603553945338.jpg?alt=media&token=dc39678c-82ad-454f-9023-eafb41d25906"
                                }
                            ],
                            "width": "100px",
                            "height": "100px",
                            "cornerRadius": "100px",
                            "offsetTop": "lg"
                        }
                    ],
                    "justifyContent": "center",
                    "alignItems": "center"
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "button",
                            "action": {
                                "type": "uri",
                                "label": "ยินยอม",
                                "uri": uri
                            },
                            "style": "primary"
                        }
                    ]
                }
            }
        }
    ]
    return consent
}

module.exports = { send_user_id };