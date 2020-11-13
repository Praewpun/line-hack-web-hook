const axios = require('axios');
const { get_course_names } = require('./get_course_names');

async function get_teacher_name(course_id,user_id) {
    const res = await axios.get(`https://us-central1-mana-test-294607.cloudfunctions.net/app/courses/teacher/${course_id}/${user_id}`);
    const result = make_carousels(res.data,course_id);
    return result;
}

async function make_carousels(result,course_id) {
    const courses = await get_course_names();
    const course_names = courses[0];
    const course_ids = courses[1];
    const course_index = course_ids.indexOf(course_id);
    const course_name = course_names[course_index];
    result = 
        {
            "type": 'text',
            "text": result[0].profile.name.fullName,
        }
    return result;
}

module.exports = { get_teacher_name };