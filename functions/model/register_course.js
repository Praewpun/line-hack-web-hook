async function register_course() {
  const uri = "https://liff.line.me/1655236665-2j6QDLD3/liff1=";
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
              "uri": uri
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