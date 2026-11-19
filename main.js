import content from './content.yaml';

try {
  // Theme
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  if (themeToggle) {
    const activeTheme = () => document.documentElement.dataset.theme
      || (prefersDark.matches ? 'night' : 'light');

    themeToggle.checked = activeTheme() === 'night';

    themeToggle.addEventListener('change', () => {
      const theme = themeToggle.checked ? 'night' : 'light';

      document.documentElement.dataset.theme = theme;
      localStorage.setItem('theme', theme);
    });

    prefersDark.addEventListener('change', (event) => {
      if (localStorage.getItem('theme')) return;

      themeToggle.checked = event.matches;
    });
  }

  // Icons
  const iconPlaceholderHTML = (className) => `
    <span class="material-symbols-rounded flex items-center justify-center ${className}">image_not_supported</span>
  `;

  const iconHTML = (src, className, alt) => src
    ? `<img class="${className}" src="${src}" alt="${alt}" data-icon />`
    : iconPlaceholderHTML(className);

  document.addEventListener('error', (event) => {
    const image = event.target;

    if (image.tagName !== 'IMG' || !image.hasAttribute('data-icon')) return;

    image.outerHTML = iconPlaceholderHTML(image.className);
  }, true);

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

    const hrBefore = isFirst ? '' : (index === 1 ? '<hr class="bg-base-300" />' : '<hr class="bg-primary" />');
    const hrAfter = isFirst ? '<hr class="bg-base-300" />' : (index === timeline.length - 1 ? '' : '<hr class="bg-primary" />');

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
      <a href="${button.link}" class="btn btn-secondary btn-sm" target="_new">
        ${iconHTML(button['icon-src'], 'size-4', `${button.label} icon`)}
        <span>${button.label}</span>
      </a>
    `).join('') || '';

    const cardHTML = `
      <div class="carousel-item lg:w-full">
        <div class="card card-sm image-full bg-base-100 w-80 h-64 shadow-sm lg:w-full">
          <figure>
            <img src="${project['thumbs-src']}" alt="${project.name} thumbnail" />
          </figure>
          <div class="card-body">
            <h2 class="card-title">
              ${iconHTML(project['icon-src'], 'size-10 shadow-md rounded', `${project.name} icon`)}
              ${project.name}
              ${project.new ? '<span class="badge badge-primary badge-sm">NEW</span>' : ''}
              ${!!project.label ? `<span class="badge badge-neutral badge-sm uppercase">${project.label}</span>` : ''}
            </h2>
            <p class="text-justify text-xs">${project.desc}</p>
            <div class="card-actions justify-end">
              ${buttonsHTML}
            </div>
          </div>
        </div>
      </div>
    `;

    projectsContainer.innerHTML += cardHTML;
  });

  // Skills
  const skills = content.skills;
  const skillsContainer = document.getElementById('skills-container');

  const levelLabels = {
    1: 'Basic',
    2: 'Pre Intermediate',
    3: 'Intermediate',
    4: 'Proficient',
    5: 'Advanced',
  };

  skills.forEach(skillCategory => {
    const skillCategoryName = skillCategory.name;
    const skillCategoryContent = skillCategory.content;

    let subcategoriesHTML = '';

    skillCategoryContent.forEach(subcategory => {
      const subcategoryType = Object.keys(subcategory)[0];
      const subcategoryData = subcategory[subcategoryType];

      const isRated = subcategoryData.type === 'rated';

      subcategoriesHTML += `<h3 class="font-medium capitalize">${subcategoryType}</h3>`;

      if (isRated) {
        subcategoriesHTML += `<ul>`;

        subcategoryData.items.forEach(item => {
          const levelBars = Array.from({ length: 5 }, (_, index) => `
            <div class="h-2 w-full rounded ${index < item.level ? (item.level === 5 ? 'bg-secondary' : 'bg-primary') : 'bg-base-300'}"></div>
          `).join('');

          subcategoriesHTML += `
            <li class="flex items-center gap-3 pb-2">
              ${iconHTML(item['icon-src'], 'size-10 min-w-10 object-contain rounded bg-base-200 p-1', `${item.name} icon`)}
              <div class="w-full">
                <div class="flex justify-between gap-2">
                  <span class="font-medium">${item.name}</span>
                  <span class="text-sm">${levelLabels[item.level] ?? 'Unknown'}</span>
                </div>
                <div class="flex gap-2 py-2">
                  ${levelBars}
                </div>
                <div class="text-xs">${item.desc}</div>
              </div>
            </li>
          `;
        });

        subcategoriesHTML += `</ul>`;
      } else {
        subcategoriesHTML += `<ul class="flex flex-wrap gap-3 py-2">`;

        subcategoryData.items.forEach(item => {
          subcategoriesHTML += `
            <li class="tooltip" data-tip="${item.name}">
              ${iconHTML(item['icon-src'], 'size-10 min-w-10 object-contain rounded bg-base-200 p-1', `${item.name} icon`)}
            </li>
          `;
        });

        subcategoriesHTML += `</ul>`;
      }
    });

    const skillCategoryHTML = `
      <div class="carousel-item lg:w-full">
        <div class="card card-sm bg-base-100 w-80 shadow-sm lg:w-full">
          <div class="card-body">
            <h2 class="card-title">${skillCategoryName}</h2>
            ${subcategoriesHTML}
          </div>
        </div>
      </div>
    `;

    skillsContainer.innerHTML += skillCategoryHTML;
  });

} catch (error) {
  console.error('Error parsing or processing YAML:', error);
}
