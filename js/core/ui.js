/* =========================================================
   UI CORE — elementos visuais compartilhados
========================================================= */

function uiButton({
  text,
  className = '',
  type = 'button',
  attributes = {}
}) {
  const button = document.createElement('button');

  button.type = type;
  button.className = className;
  button.textContent = text;

  Object.entries(attributes).forEach(([name, value]) => {
    button.setAttribute(name, value);
  });

  button.addEventListener('click', () => {
    sound.click();
  });

  return button;
} 


function uiPanel({
  title = '',
  content = '',
  className = ''
}) {
  const panel = document.createElement('section');

  panel.className = `panel ${className}`.trim();

  if (title) {
    const heading = document.createElement('h2');
    heading.textContent = title;
    panel.appendChild(heading);
  }

  if (content) {
    const body = document.createElement('div');
    body.innerHTML = content;
    panel.appendChild(body);
  }

  return panel;
}


function uiScore({
  label,
  value = 0,
  className = ''
}) {
  const score = document.createElement('div');

  score.className = `score ${className}`.trim();

  score.innerHTML = `
    <span class="score-label"></span>
    <strong class="score-value"></strong>
  `;

  score.querySelector('.score-label').textContent = label;
  score.querySelector('.score-value').textContent = value;

  return score;
}


function uiMessage({
  text,
  type = 'info'
}) {
  const message = document.createElement('div');

  message.className = `ui-message ui-message-${type}`;
  message.textContent = text;

  return message;
}


function createGameHeader({
  title,
  description
}) {
  const header = document.createElement('section');

  header.className = 'stage-head';

  const heading = document.createElement('h1');
  heading.textContent = title;

  const text = document.createElement('p');
  text.textContent = description;

  header.appendChild(heading);
  header.appendChild(text);

  return header;
}