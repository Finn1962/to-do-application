const { Projects, Tasks } = require("../db/queries.js");

async function addSampleProject(userId) {
  const schoolProjectId = await Projects.createProject(
    "Website Redesign",
    userId,
  );

  Tasks.createTask({
    userId,
    projectId: schoolProjectId,
    title: "Requirements & Research",
    description: `
      <p>
        Need to figure out what everyone actually wants before we dive into design and code.
      </p>
      <ul>
        <li>
          Chat with marketing and sales to see what's currently missing
        </li>
        <li>
          Map out who we are actually building this for
        </li>
        <li>
          Write down a quick list of <strong>must-have tech features</strong> and speed targets
        </li>
      </ul>`,
  }).then((taskId) => Tasks.completeTask({ taskState: true, taskId, userId }));
  Tasks.createTask({
    userId,
    projectId: schoolProjectId,
    title: "Design Phase",
    description: `
      <p>
        Get the basic layout down on paper before touching any real code.
      </p>
      <ol>
        <li>
          Sketch out simple wireframes for the main landing page and contact form.
        </li>
        <li>
          Run the rough ideas by the design team to make sure UX makes sense.
        </li>
        <li>
          Build a <em>clickable prototype</em> in Figma so stakeholders can test the feel.
        </li>
      </ol>`,
  });
  Tasks.createTask({
    userId,
    projectId: schoolProjectId,
    title: "Tech Setup",
    description: `
    <p>
      Get all the technical groundwork ready so dev work goes smoothly.
    </p>
    <ul>
      <li>
        Spin up a new repo on GitHub and invite the team
      </li>
      <li>
        Install our preferred stack (<em>Next.js + Tailwind</em>) and base libraries
      </li>
    </ul>`,
  });

  Projects.createProject("Home Deep Clean", userId);
}

module.exports = { addSampleProject };
