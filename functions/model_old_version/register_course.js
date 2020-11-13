async function register_course(){
    const result = {
        "type": "flex",
        "altText": "Register Course",
        "contents": {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "พี่ยังไม่ได้ลงทะเบียนวิชานี้..."
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
                    "label": "ลงทะเบียน",
                    "uri": "http://linecorp.com/"
                  },
                  "style": "primary"
                }
              ]
            }
        }
    }
    return result
}

module.exports = { register_course };