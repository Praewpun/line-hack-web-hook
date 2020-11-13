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
const { get_notification } = require('./model/push_notification');
const { send_user_id } = require('./model/send_user_id');
const { default: Axios } = require('axios');
require('dotenv').config({path: __dirname + '/local.env'})

const config = {
    channelAccessToken: 'a/aynZOwgqTKCUZQKrPiFyVinC9oO/zBnh/FgqoqFZJr2KZ086dzLXhlst5ruBlGgHMBi8FB7Liunwiwp2A8/DXJku476MmAxEV+BEpOUrddmvg30/3WI3RkWf7HEP4w9eI/UsoL94ytrIYh2OVcygdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'fc8ad075b7b4fde88fd7b554ecf5281b'
};

const app = express();
// LINE client configuration
const client = new line.Client(config);
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    const user_id = await req.body.events[0].source.userId;
    const token = req.body.events[0].replyToken;
    console.log("userId = ",user_id);
    if (req.body.events[0].type == 'follow') {
        console.log("Someone follows MANA");
        const result = await send_user_id(user_id);
        res.send(client.replyMessage(token, result));
    }
    else if (req.body.events[0].type == 'message') {
        console.log("Someone sends a message to MANA");
        const courses = await get_course_names(user_id);
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
                const result = await handleCourseFiles(token, course_ids, course_index, user_id);
                res.send(result);
            } else {
                const payloadJson = await register_course();
                res.send(client.replyMessage(token, payloadJson));
            }
        } else if (/ของาน/.test(input_text)) {
            const index = input_text.search(/วิชา/) + 5;
            const course_name = input_text.substring(index);
            const course_index = course_names.indexOf(course_name);
            if (course_index != -1) {
                console.log("There's a match in given course name in course name list");
                const result = await handleCourseAssignments(token, course_ids, course_index, user_id);
                res.send(result);
            } else {
                const payloadJson = await register_course();
                res.send(client.replyMessage(token, payloadJson));
            }
        } else if (/ขอข้อมูลอาจารย์/.test(input_text)) {
            console.log("There's a match in contact-in-course request");
            const index = input_text.search(/วิชา/) + 5;
            const course_name = input_text.substring(index);
            const course_index = course_names.indexOf(course_name);
            if (course_index != -1) {
                console.log("There's a match in given course name in course name list");
                const result = await handleTeacherContact(token, course_ids, course_index, user_id);
                res.send(result);
            } else {
                res.send(client.replyMessage(token, { text: 'text', text: "ไม่มีข้อมูลอาจารย์คนนี้นะ" }));
            }
        } else if (input_text == "คอร์สเรียน") {
            console.log("There's match in courses request");
            try {
                const result = await handleCourses(token, user_id);
                res.send(result);
            } catch (error) {
                res.send(client.replyMessage(token, { type: 'text', text: "There is no registered course at the moment" }))
            }
        } else if (input_text == "งานที่ต้องส่ง") {
            console.log("There's match in assignments request");
            try {
                const result = await handleAssignments(token, user_id);
                res.send(result);
            } catch (error) {
                res.send(client.replyMessage(token, { type: 'text', text: "There are no assignments dued within the next 7 days" }));
            }
        } else {
            Promise
                .all(req.body.events.map(handleEvent))
                .then((result) => res.json(result))
        }
    }
});


async function handleCourses(token, user_id) {
    console.log("handleCourses");
    const payloadJson = await get_courses(user_id);
    return client.replyMessage(token, payloadJson);
}

async function handleAssignments(token, user_id) {
    const payloadJson = await get_assignments(user_id);
    console.log("payloadJson = ",JSON.stringify(payloadJson));
    return client.replyMessage(token, payloadJson);
}

async function handleCourseAssignments(token, course_ids, course_index, user_id) {
    const course_id = course_ids[course_index];
    let payloadJson = await get_course_assignments(course_id, user_id);
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

async function handleCourseFiles(token, course_ids, course_index, user_id) {
    try {
        const course_id = course_ids[course_index];
        const payloadJson = await get_course_files(course_id, user_id);
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

async function handleTeacherContact(token, course_ids, course_index, user_id) {
    const course_id = course_ids[course_index];
    const payloadJson = await get_teacher_name(course_id, user_id);
    return client.replyMessage(token, payloadJson);
}

async function handleEvent(event) {
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: "มานะไม่เข้าใจ ลองกดปุ่ม Rich Menu ดูนะ"
    });
}

app.post('/notification', async (req, res) => {
    const response = req.body;
    const result = await handleNotification(response);
    res.send(result);
})

async function handleNotification(response) {
    const user_id = response.userId;
    console.log("The given user_id is ",user_id);
    const payloadJson = await get_notification(response);
    console.log("The payloadJson is ",payloadJson);
    return client.pushMessage(user_id, payloadJson);
}

app.post('/dailynoti', async (req, res) => {
    const users = req.body.users;
    for (let user of users) {
        const payloadJson = await get_assignments(user);
        return res.send(client.pushMessage(user, payloadJson));
    }
});

app.listen(3000);




exports.app = functions.https.onRequest(app)

