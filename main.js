import yaml from 'js-yaml';
import contentString from './content.yaml?raw';

try {
  const content = yaml.load(contentString);

  // Profile elements
  const profileElementMapping = {
    'profile-name': 'name',
    'profile-image-src': 'image-src',
    'profile-title': 'title',
    'profile-title-alt': 'title-alt',
    'profile-summary': 'summary',
  };

  for (const elementId in profileElementMapping) {
    const property = profileElementMapping[elementId];
    const element = document.getElementById(elementId);

    if (element) {
      if (elementId === 'profile-image-src') {
        element.src = content.profile[property];
      } else {
        element.textContent = content.profile[property];
      }
    }
  }

  // Call to action
  const callToAction = document.getElementById('call-to-action');

  if (callToAction) {
    const ctaContent = content['call-to-action'];

    callToAction.textContent = ctaContent.label;

    callToAction.addEventListener('click', () => {
      if (ctaContent && ctaContent.link) {
        window.location.href = ctaContent.link;
      } else {
        console.error("Link is missing for call to action.");
      }
    });
  }

  // Timeline
  const timeline = content.timeline;
  const timelineContainer = document.getElementById('timeline-container');

  timeline.forEach((event, index) => {
    const isFirst = index === 0;
    const isEven = index % 2 === 0;

    const leftContent = isEven ? `
      <div class="timeline-start timeline-box font-medium">
        ${event.content}
        <br />
        <span class="${isFirst ? 'text-secondary' : 'text-primary'} text-xs italic">${event.details}</span>
      </div>` : `
      <div class="timeline-start italic">${event.year}</div>
    `;

    const rightContent = isEven ? `
      <div class="timeline-end italic">${event.year}</div>` : `
      <div class="timeline-end timeline-box font-medium">
        ${event.content}
        <br />
        <span class="text-primary text-xs italic">${event.details}</span>
      </div>
    `;

    const hrBefore = isFirst ? '' : (index === 1 ? '<hr class="bg-base-200" />' : '<hr class="bg-primary" />');
    const hrAfter = isFirst ? '<hr class="bg-base-200" />' : (index === timeline.length - 1 ? '' : '<hr class="bg-primary" />'); // Simplified ternary

    const eventHTML = `
      <li>
        ${hrBefore}
        ${leftContent}
        <div class="timeline-middle">
          <span class="material-symbols-rounded align-middle ${isFirst ? 'text-secondary' : 'text-primary'}">trip_origin</span>
        </div>
        ${rightContent}
        ${hrAfter}
      </li>
    `;

    timelineContainer.innerHTML += eventHTML;
  });

  // Projects
  const projects = content.projects;
  const projectsContainer = document.getElementById('projects-container');

  projects.forEach(project => {
    const buttonsHTML = project.buttons?.map(button => `
      <a href="${button.link}" class="btn btn-secondary">
        <img class="size-4" src="${button['icon-src']}" alt="${button.label} icon" />
        <span>${button.label}</span>
      </a>
    `).join('') || '';


    const cardHTML = `
      <div class="card bg-base-100 image-full w-80 lg:w-96 h-64 shadow-sm snap-always snap-center">
        <figure>
          <img src="${project['thumbs-src']}" alt="${project.name} thumbnail" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">
            <span>
              <img class="size-10 shadow-md" src="${project['icon-src']}" alt="${project.name} icon" />
            </span>
            ${project.name}
            ${project.new ? '<div class="badge badge-primary">NEW</div>' : ''}
          </h2>
          <p class="text-justify text-xs">${project.desc}</p>
          <div class="card-actions justify-end">
            ${buttonsHTML}
          </div>
        </div>
      </div>
    `;

    projectsContainer.innerHTML += cardHTML;
  });

} catch (error) {
  console.error('Error parsing or processing YAML:', error);
}