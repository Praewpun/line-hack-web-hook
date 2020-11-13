const axios = require('axios');

async function get_course_names(user_id) {
  const res = await axios.get(`https://mana.roadrei.com/courses/${user_id}`);
  const result = make_names(res.data);
  const course_name = result[0];
  const course_id = result[1];
  return [course_name, course_id];
}

function make_names(result) {
  let names = [];
  let ids = []
  for (i = 0; i < result.length; i++) {
    if (result[i].courseState == "ACTIVE") {
      let name = result[i].name;
      let id = result[i].id;
      names.push(name);
      ids.push(id);
    }
  }
  return [names, ids]
}

module.exports = { get_course_names };