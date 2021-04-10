import debounce from "lodash/debounce";

import Project from "./Project";

export default class {
  constructor({ covers, environment, scene }) {
    this.covers = covers;
    this.environment = environment;
    this.scene = scene;

    this.position = {
      current: 0,
      previous: 0
    };

    this.scroll = {
      clamp: {
        minimum: 0,
        maximum: 0
      },
      values: {
        current: 0,
        target: 0
      },
      y: {
        end: 0,
        start: 0
      }
    };

    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.onHoldEndDebounce = debounce(this.onHoldEnd, 200);

    this.createProjects();
  }

  createProjects() {
    this.projects = this.covers.map((cover, index) => {
      const project = new Project({
        cover,
        environment: this.environment,
        index
      });

      this.scene.add(project);

      return project;
    });
  }

  onTouchDown({ y }) {
    this.isDown = true;

    this.scroll.values.current = this.position.current;

    this.scroll.y.start = y;

    this.onHoldStart();
  }

  onTouchMove({ y }) {
    if (!this.isDown) {
      return;
    }

    this.scroll.y.end = y;

    this.scroll.values.target =
      this.scroll.values.current + (this.scroll.y.start - this.scroll.y.end);
  }

  onTouchUp({ y }) {
    this.isDown = false;

    this.onCheck();
    this.onHoldEnd();
  }

  onWheel(speed) {
    this.scroll.values.target += speed;

    this.onCheckDebounce();

    this.onHoldStart();
    this.onHoldEndDebounce();
  }

  onHoldStart() {
    this.projects.forEach(child => {
      child.onTouchStart();
    });
  }

  onHoldEnd() {
    this.projects.forEach(child => {
      child.onTouchEnd();
    });
  }

  onCheck() {
    this.scroll.values.target =
      this.environment.height * 1.33 * this.indexInfinite;
  }

  update(time) {
    const height = this.environment.height * 1.33;

    this.indexInfinite = Math.round(this.scroll.values.target / height);

    let index = this.indexInfinite % this.covers.length;

    if (this.indexInfinite < 0) {
      index =
        (this.covers.length -
          Math.abs(this.indexInfinite % this.covers.length)) %
        this.covers.length;
    }

    if (this.index !== index) {
      this.index = index;
    }

    this.current = this.projects[this.index];

    this.position.current +=
      (this.scroll.values.target - this.position.current) * 0.1;

    this.calculate();

    this.position.previous = this.position.current;

    this.projects.forEach(child => {
      child.animate(time);
    });
  }

  calculate() {
    const height = this.environment.height * 1.33;
    const heightTotal = height * this.covers.length;

    if (this.position.current < this.position.previous) {
      this.direction = "up";
    } else if (this.position.current > this.position.previous) {
      this.direction = "down";
    } else {
      this.direction = "none";
    }

    this.projects.forEach(child => {
      child.isAfter = child.position.y < -height;
      child.isBefore = child.position.y > height;

      if (this.direction === "down" && child.isBefore) {
        const position = child.location - heightTotal;

        child.isBefore = false;
        child.isAfter = true;

        child.location = position;
      }

      if (this.direction === "up" && child.isAfter) {
        const position = child.location + heightTotal;

        child.isBefore = true;
        child.isAfter = false;

        child.location = position;
      }

      child.update(this.position.current);
    });
  }
}
