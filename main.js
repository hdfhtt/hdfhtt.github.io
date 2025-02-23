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
      <div class="timeline-start italic text-sm">${event.year}</div>
    `;

    const rightContent = isEven ? `
      <div class="timeline-end italic text-sm">${event.year}</div>` : `
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
      <a href="${button.link}" class="btn btn-secondary" target="_new">
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
            ${!!project.label ? `<div class="badge badge-neutral uppercase">${project.label}</div>` : ''}
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

  // Skills
  const skills = content.skills;
  const skillsContainer = document.getElementById('skills-container');

  skills.forEach(skillCategory => {
    const skillCategoryName = skillCategory.name;
    const skillCategoryContent = skillCategory.content;

    let subcategoriesHTML = '';

    skillCategoryContent.forEach(subcategory => {
      const subcategoryType = Object.keys(subcategory)[0];
      const subcategoryData = subcategory[subcategoryType];

      const isRated = subcategoryData.type === 'rated';

      subcategoriesHTML += `<span class="font-medium capitalize">${subcategoryType}</span>`;

      if (isRated) {
        subcategoriesHTML += `<ul>`;

        subcategoryData.items.forEach(item => {
          const levelBars = Array.from({ length: 5 }, (_, i) => `
            <div class="h-2 rounded w-full ${i < item.level ? (item.level === 5 ? 'bg-secondary' : 'bg-primary') : 'bg-base-300'}"></div>
          `).join('');

          subcategoriesHTML += `
            <li class="pb-2 flex gap-3 items-center">
              <img class="size-10 min-w-10 h-auto max-h-10 bg-base-200 lg:bg-base-100 min-h-10 p-1 rounded" src="${item['icon-src']}" />
              <div class="w-full">
                <div class="flex justify-between">
                  <span class="font-medium">${item.name}</span>
                  <span>${
                    item.level === 5
                    ? 'Advanced'
                    : item.level === 4
                    ? 'Proficient'
                    : item.level === 3
                    ? 'Intermediate'
                    : item.level === 2
                    ? 'Pre Intermdt'
                    : item.level === 1
                    ? 'Basic'
                    : 'Unknown'
                  }</span>
                </div>
                <div class="flex gap-2 py-2">
                  ${levelBars}
                </div>
                <div class="text-xs">
                  <span>${item.desc}</span>
                </div>
              </div>
            </li>
          `;
        });

        subcategoriesHTML += `</ul>`;
      } else {
        subcategoriesHTML += `<ul class="flex gap-4">`;

        subcategoryData.items.forEach(item => {
          subcategoriesHTML += `
            <li class="tooltip pb-2" data-tip="${item.name}">
              <img class="size-10 min-w-10 h-auto max-h-10 bg-base-100 min-h-10 p-1 rounded" src="${item['icon-src']}" />
            </li>
          `;
        });

        subcategoriesHTML += `</ul>`;
      }
    });

    const skillCategoryHTML = `
      <div class="lg:card w-96 lg:w-80 lg:bg-base-200 shadow-sm snap-always snap-center">
        <div class="card-body py-4 lg:py-8">
          <h2 class="text-xl font-bold">${skillCategoryName}</h2>
          ${subcategoriesHTML}
        </div>
      </div>
    `;

    skillsContainer.innerHTML += skillCategoryHTML;
  });

} catch (error) {
  console.error('Error parsing or processing YAML:', error);
}