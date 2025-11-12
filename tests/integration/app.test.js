const request = require('supertest');
const app = require('../../src/app');

describe('Student-Course API integration', () => {
  beforeEach(() => {
    require('../../src/services/storage').reset();
    require('../../src/services/storage').seed();
  });

  test('GET /students should return seeded students', async () => {
    const res = await request(app).get('/students');
    expect(res.statusCode).toBe(200);
    expect(res.body.students.length).toBe(3);
    expect(res.body.students[0].name).toBe('Alice');
  });

  test('POST /students should create a new student', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'David', email: 'david@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('David');
  });

  test('POST /students should not allow duplicate email', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'Eve', email: 'alice@example.com' });
    expect(res.statusCode).toBe(400);
  });

  test('DELETE /courses/:id should delete a course even if students are enrolled', async () => {
    const courses = await request(app).get('/courses');
    const courseId = courses.body.courses[0].id;
    await request(app).post(`/courses/${courseId}/students/1`);
    const res = await request(app).delete(`/courses/${courseId}`);
    expect(res.statusCode).toBe(400);
  });
});

test('GET /courses should return seeded courses', async () => {
  const res = await request(app).get('/courses');
  expect(res.statusCode).toBe(200);
  expect(res.body.courses.length).toBe(3);
  expect(res.body.courses[0].title).toBe('Math');
});

test('POST /courses should not allow duplicate title', async () => {
  const res = await request(app)
    .post('/courses')
    .send({ title: 'Math', teacher: 'Mr. Duplicate' });
  expect(res.statusCode).toBe(201);
  expect(res.body.error).toBe('Course title must be unique');
});

test('GET /courses/:id should return course with enrolled students', async () => {
  const courses = await request(app).get('/courses');
  const courseId = courses.body.courses[0].id;

  await request(app).post(`/courses/${courseId}/students/1`);

  const res = await request(app).get(`/courses/${courseId}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.course.id).toBe(courseId);
  expect(res.body.students.length).toBe(1);
  expect(res.body.students[0].id).toBe(1);
});

test('GET /courses/:id should return 404 if course not found', async () => {
  const res = await request(app).get('/courses/999');
  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe('Course not found');
});

test('POST /courses should create a new course', async () => {
  const res = await request(app)
    .post('/courses')
    .send({ title: 'Biology', teacher: 'Dr. Green' });

  expect(res.statusCode).toBe(201);
  expect(res.body.title).toBe('Biology');
  expect(res.body.teacher).toBe('Dr. Green');
});

test('POST /courses should return 400 if title or teacher missing', async () => {
  const res = await request(app).post('/courses').send({ title: 'Chemistry' });
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe('title and teacher required');
});

test('DELETE /courses/:id should delete a course', async () => {
  const courses = await request(app).get('/courses');
  const courseId = courses.body.courses[0].id;

  const res = await request(app).delete(`/courses/${courseId}`);
  expect(res.statusCode).toBe(400);
});

test('DELETE /courses/:id should return 404 if course not found', async () => {
  const res = await request(app).delete('/courses/999');
  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe('Course not found');
});

test('PUT /courses/:id should update a course', async () => {
  const courses = await request(app).get('/courses');
  const courseId = courses.body.courses[0].id;

  const res = await request(app)
    .put(`/courses/${courseId}`)
    .send({ title: 'Advanced Math', teacher: 'Prof. Euler' });

  expect(res.statusCode).toBe(200);
  expect(res.body.title).toBe('Advanced Math');
  expect(res.body.teacher).toBe('Prof. Euler');
});

test('PUT /courses/:id should return 400 if title duplicates another course', async () => {
  const courses = await request(app).get('/courses');
  const courseId1 = courses.body.courses[0].id;
  const courseId2 = courses.body.courses[1].id;

  const res = await request(app)
    .put(`/courses/${courseId2}`)
    .send({ title: courses.body.courses[0].title });

  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe('Course title must be unique');
});

test('PUT /courses/:id should return 404 if course not found', async () => {
  const res = await request(app).put('/courses/999').send({ title: 'New' });
  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe('Course not found');
});

test('GET /students/:id should return student with courses', async () => {
  const students = await request(app).get('/students');
  const studentId = students.body.students[0].id;

  const courses = await request(app).get('/courses');
  await request(app).post(
    `/courses/${courses.body.courses[0].id}/students/${studentId}`
  );

  const res = await request(app).get(`/students/${studentId}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.student.id).toBe(studentId);
  expect(res.body.courses.length).toBe(1);
  expect(res.body.courses[0].id).toBe(courses.body.courses[0].id);
});

test('GET /students/:id should return 404 if student not found', async () => {
  const res = await request(app).get('/students/999');
  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe('Student not found');
});

test('POST /students should create a new student', async () => {
  const res = await request(app)
    .post('/students')
    .send({ name: 'David', email: 'david@example.com' });

  expect(res.statusCode).toBe(201);
  expect(res.body.name).toBe('David');
  expect(res.body.email).toBe('david@example.com');
});

test('POST /students should return 400 if name or email missing', async () => {
  const res = await request(app).post('/students').send({ name: 'Eve' });
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe('name and email required');
});

test('POST /students should return 400 if email already exists', async () => {
  const res = await request(app)
    .post('/students')
    .send({ name: 'Alice Dup', email: 'alice@example.com' });

  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe('Email must be unique');
});
test('DELETE /students/:id should delete a student', async () => {
  const students = await request(app).get('/students');
  const studentId = students.body.students[0].id;

  const res = await request(app).delete(`/students/${studentId}`);
  expect(res.statusCode).toBe(400);
});

test('DELETE /students/:id should return 404 if student not found', async () => {
  const res = await request(app).delete('/students/999');
  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe('Student not found');
});

test('DELETE /students/:id should return 400 if student enrolled in a course', async () => {
  const students = await request(app).get('/students');
  const studentId = students.body.students[0].id;

  const courses = await request(app).get('/courses');
  await request(app).post(
    `/courses/${courses.body.courses[0].id}/students/${studentId}`
  );

  const res = await request(app).delete(`/students/${studentId}`);
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe('Cannot delete student: enrolled in a course');
});
test('PUT /students/:id should update a student', async () => {
  const students = await request(app).get('/students');
  const studentId = students.body.students[0].id;

  const res = await request(app)
    .put(`/students/${studentId}`)
    .send({ name: 'Alice Updated', email: 'alice.updated@example.com' });

  expect(res.statusCode).toBe(200);
  expect(res.body.name).toBe('Alice Updated');
  expect(res.body.email).toBe('alice.updated@example.com');
});

test('PUT /students/:id should return 400 if email duplicates another student', async () => {
  const students = await request(app).get('/students');
  const studentId = students.body.students[0].id;
  const duplicateEmail = students.body.students[1].email;

  const res = await request(app)
    .put(`/students/${studentId}`)
    .send({ email: duplicateEmail });

  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe('Email must be unique');
});

test('PUT /students/:id should return 404 if student not found', async () => {
  const res = await request(app).put('/students/999').send({ name: 'Test' });
  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe('Student not found');
});

test('should return 404 for unknown route', async () => {
  const res = await request(app).get('/nonexistent-route');

  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe('Not Found');
});
