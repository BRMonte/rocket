const express = require('express');
const { uuid } = require('uuidv4')

const app = express();

app.use(express.json());

const projects = [];

//criando um midleware

function logRequest(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.log(logLabel);

  return next(); // essa linha chama o proximo middleware (route). Sem isso o app trava
};

app.use(logRequest);

app.get('/projects', (request, response) => {
  const { title, owner} = request.query;

  console.log(title);
  console.log(owner);
  return response.json(projects);
});

app.post('/projects', (request, response) => {
  const {title, owner} = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const {id} = request.params;
  const {title, owner} = request.body;
  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({error: 'Project not found'})
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {

  const {id} = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({error: 'Project not found'});
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3000, () => {
  console.log('🧞‍♂️back-end started')
});
