const functions = require('firebase-functions');
const line = require('@line/bot-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const { get_courses } = require('./model/get_courses');
const { get_assignments } = require('./model/get_assignments');
const { get_course_names } = require('./model/get_course_names');
const { get_course_assignments } = require('./model/get_course_assignment');
const { get_course_files } = require('./model/get_course_files');
const { register_course } = require('./model/register_course');
const { get_teacher_name } = require('./model/get_teacher_contact');
const { default: Axios } = require('axios');

const config = {
    channelAccessToken: 'cv4gqHIJHfoLODDws/5RoVUvRcp+V8jIFJbpd9wQ8n9cMLucMx5ScxVE3ivFSRC4O1sGWkDQbMRzoFvN4iDtujk/DrT4R0Kr3cEYLdDsmRg2n8+SPuUwAcV8yqFy74KoVpln7gIkye622axftJPCoAdB04t89/1O/w1cDnyilFU=',
    channelSecret: '69e74a3b0c5eaa72cf85d85781c39f7b'
};

const app = express();

app.post('/webhook', line.middleware(config), async (req, res) => {
    const courses = await get_course_names();
    const course_names = courses[0];
    const course_ids = courses[1];
    const input_text = await req.body.events[0].message.text;

    if (/ขอไฟล์/.test(input_text)) {
        console.log("There's match in file-in-course request");
        const index = input_text.search(/วิชา/) + 5;
        const course_name = input_text.substring(index);
        const course_index = course_names.indexOf(course_name);
        if (course_index != -1) {
            console.log("There's a match in given course name in course name list");
            const token = req.body.events[0].replyToken;
            const result = await handleCourseFiles(token, course_ids, course_index);
            res.send(result);
        } else {
            const payloadJson = await register_course();
            const token = req.body.events[0].replyToken;
            res.send(client.replyMessage(token, payloadJson));
        }
    } else if (/ของาน/.test(input_text)) {
        const index = input_text.search(/วิชา/) + 5;
        const course_name = input_text.substring(index);
        const course_index = course_names.indexOf(course_name);
        if (course_index != -1) {
            console.log("There's a match in given course name in course name list");
            const token = req.body.events[0].replyToken;
            const result = await handleCourseAssignments(token, course_ids, course_index);
            res.send(result);
        } else {
            const payloadJson = await register_course();
            const token = req.body.events[0].replyToken;
            res.send(client.replyMessage(token, payloadJson));
        }
    } else if (/ขอข้อมูลอาจารย์/.test(input_text)) {
        console.log("There's a match in contact-in-course request");
        const index = input_text.search(/วิชา/) + 5;
        const course_name = input_text.substring(index);
        const course_index = course_names.indexOf(course_name);
        if (course_index != -1) {
            console.log("There's a match in given course name in course name list");
            const token = req.body.events[0].replyToken;
            const result = await handleTeacherContact(token, course_ids, course_index);
            res.send(result);
        } else {
            const token = req.body.events[0].replyToken;
            res.send(client.replyMessage(token, {text:'text',text:"ไม่มีข้อมูลอาจารย์คนนี้นะ"}));
        }
    } else if (input_text == "คอร์สเรียน") {
        console.log("There's match in courses request");
        Promise
            .all(req.body.events.map(handleCourses))
            .then((result) => res.json(result))
            .catch(err => res.send(client.replyMessage(req.body.events[0].replyToken, { type: 'text', text: "There is no registered course at the moment" })));
    } else if (input_text == "งานที่ต้องส่ง") {
        console.log("There's match in assignments request");
        Promise
            .all(req.body.events.map(handleAssignments))
            .then((result) => res.json(result))
            .catch(err => res.send(client.replyMessage(req.body.events[0].replyToken, { type: 'text', text: "There are no assignments dued within the next 7 days" })));
    } else {
        Promise
            .all(req.body.events.map(handleEvent))
            .then((result) => res.json(result))
    }
});

const client = new line.Client(config);

async function handleCourses(event) {
    const payloadJson = await get_courses();
    return client.replyMessage(event.replyToken, payloadJson);
}

async function handleAssignments(event) {
    const payloadJson = await get_assignments();
    return client.replyMessage(event.replyToken, payloadJson);
}

async function handleCourseAssignments(token, course_ids, course_index) {
    const course_id = course_ids[course_index];
    let payloadJson = await get_course_assignments(course_id);
    const courses = await get_course_names();
    const course_names = courses[0];
    const course_name = course_names[course_index];
    if (payloadJson[0].contents.contents.length == 0) {
        payloadJson = {
            "type": 'text',
            "text": "วิชานี้ยังไม่มีงานอะไรจากอาจารย์นะ",
            "sender": {
                "name": course_name,
                "iconUrl": "https://cdn3.vectorstock.com/i/1000x1000/87/27/teacher-icon-flat-style-vector-20708727.jpg"
            }
        }
    }
    return client.replyMessage(token, payloadJson);
}

async function handleCourseFiles(token, course_ids, course_index) {
    try {
        const course_id = course_ids[course_index];
        const payloadJson = await get_course_files(course_id);
        return client.replyMessage(token, payloadJson);
    } catch (error) {
        const courses = await get_course_names();
        const course_names = courses[0];
        const course_name = course_names[course_index];
        return client.replyMessage(token, {
            "type": 'text',
            "text": "วิชานี้ยังไม่มีไฟล์อะไรจากอาจารย์นะ",
            "sender": {
                "name": course_name,
                "iconUrl": "https://cdn3.vectorstock.com/i/1000x1000/87/27/teacher-icon-flat-style-vector-20708727.jpg"
            }
        })
    }
}

async function handleTeacherContact(token, course_ids, course_index) {
    const course_id = course_ids[course_index];
    const payloadJson = await get_teacher_name(course_id);
    return client.replyMessage(token, payloadJson);
  }

async function handleEvent(event) {
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: "มานะไม่เข้าใจ ลองกดปุ่ม Rich Menu ดูนะ"
    });
}

app.post('/callback', line.middleware(config), (req, res) => {
    Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((error) => {
        console.error(error);
        res.status(500).end();
    })
})

app.use(bodyParser.json());

// for notification
app.post('/notification', (req, res) => {
    const noti = req.body;
    console.log("Klod's", req.body);
    return res.send(client.multicast([req.line_id], {
        type: 'text',
        text: "Got klod's message"
    }));
})

app.post('/dailynoti', (req, res) => {
    const users = req.body.users;
    for (let user of users){
        const payloadJson = await get_assignments(user);
        return client.pushMessage(user, payloadJson)
    }
});

app.listen(3000);

exports.app = functions.https.onRequest(app)

