import yaml from 'js-yaml';
import contentString from './content.yaml?raw';

try {
  const content = yaml.load(contentString);

  const profileElements = {
    'profile-name': 'name',
    'profile-image-src': 'image-src',
    'profile-title': 'title',
    'profile-title-alt': 'title-alt',
    'profile-summary': 'summary'
  };

  for (const elementId in profileElements) {
    const property = profileElements[elementId];
    const element = document.getElementById(elementId);
    if (element) {
      if (elementId === 'profile-image-src') {
        element.src = content.profile[property];
      } else {
        element.textContent = content.profile[property];
      }
    }
  }

  const callToAction = document.getElementById('call-to-action');

  if (callToAction) {
    callToAction.textContent = content['call-to-action'].label;

    callToAction.addEventListener('click', () => {
      if (content['call-to-action'] && content['call-to-action'].link) {
          window.location.href = content['call-to-action'].link;
      } else {
          console.error("Link is missing for call to action.");
      }
    });
  }

  const projects = content.projects;
  const projectsContainer = document.getElementById('projects-container');

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
      <div class="card bg-base-100 image-full w-80 lg:w-96 h-64 shadow-sm snap-always snap-center">
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