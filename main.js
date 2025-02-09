import yaml from 'js-yaml';
import contentString from './content.yaml?raw';

try {
  const content = yaml.load(contentString);
  const projects = content.projects;
  const projectsContainer = document.getElementById('projects-container');

  document.getElementById('about-me').textContent = content['about-me'];

  projects.forEach(project => {
    let buttonsHTML = '';

    if (project.buttons) {
      buttonsHTML = project.buttons.map(button => `
        <a href="${button.link}" class="btn btn-secondary">
          <img class="size-4" src="${button['icon-src']}" />
          <span>${button.label}</span>
        </a>
      `).join('');
    }

    const cardHTML = `
      <div class="card bg-base-100 image-full w-84 lg:w-96 h-64 shadow-sm snap-always snap-center">
        <figure>
          <img src="${project['thumbs-src']}" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">
            <span>
              <img class="size-10 shadow-md" src="${project['icon-src']}" />
            </span>
            ${project.name}
            ${project.new ? '<div class="badge badge-primary">NEW</div>' : ''}
          </h2>
          <p class="text-justify text-xs">${project.desc}</p>
          <div class="card-actions justify-end">
            ${buttonsHTML} </div>
        </div>
      </div>
    `;
    projectsContainer.innerHTML += cardHTML;
  });
} catch (error) {
  console.error('Error parsing or processing YAML:', error);
}