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

  const timeline = content.timeline;
  const timelineContainer = document.getElementById('timeline-container');

  timeline.forEach(function callback(event, index) {
    const isFirstIndex = (index == 0);
    const isOddIndex = (index % 2) == 0;

    let leftContentHTML;
    let rightContentHTML;

    if (isOddIndex) {
      leftContentHTML = `<div class="timeline-start italic">${event.year}</div>`;
      rightContentHTML = `<div class="timeline-end timeline-box font-medium">
        ${event.content}
        <br />
        <span class="${isFirstIndex ? 'text-secondary' : 'text-primary'} text-xs italic">${event.details}</span>
      </div>`;
    } else {
      leftContentHTML = `<div class="timeline-start timeline-box font-medium">
        ${event.content}
        <br />
        <span class="text-primary text-xs italic">${event.details}</span>
      </div>`;
      rightContentHTML = `<div class="timeline-end italic">${event.year}</div>`;
    }

    let eventHTML = `
      <li>
        ${(() => {
          if (index == 0) {
            return ''
          } else if (index == 1) {
            return '<hr class="bg-base-200" />'
          } else {
            return '<hr class="bg-primary" />'
          }
        })()}

        ${leftContentHTML}

        <div class="timeline-middle">
            <span class="material-symbols-rounded align-middle ${isFirstIndex ? 'text-secondary' : 'text-primary'}">trip_origin</span>
        </div>

        ${rightContentHTML}

        ${(() => {
          if (index == 0) {
            return '<hr class="bg-base-200" />'
          } else if (index == (timeline.length - 1)) {
            return ''
          } else {
            return '<hr class="bg-primary" />'
          }
        })()}
      </li>
    `;

    timelineContainer.innerHTML += eventHTML;
  });

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