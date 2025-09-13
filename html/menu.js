class WheelMenu {
  constructor(element, config) {
    this.element = element;
    this.config = config;
    this.currentMenu = "mainMenu";
    this.menuHistory = [];
    this.isVisible = false;
    this.keyMonitoring = false;
    this.playerJob = null;

    this.MENU_CENTER = { x: 400, y: 400 };
    this.DIMENSIONS = {
      ICON_SIZE: 70,
      ICON_RADIUS: 265,
      LABEL_OFFSET: 40,
      INNER_RADIUS: 160,
      OUTER_RADIUS: 335,
      GAP_SIZE: 2,
    };

    // Pre-calculate commonly used values
    this.PI_180 = Math.PI / 180;
    this.PI_90 = 90 * this.PI_180;

    // Cache DOM elements
    this.menuItemsGroup = this.element.querySelector("#menuItems");
    this.brushGroup = this.element.querySelector("#brushGroup");

    // Cache namespaces
    this.svgNS = "http://www.w3.org/2000/svg";
    this.xlinkNS = "http://www.w3.org/1999/xlink";

    // Create the defs element for masks
    this.defs = document.createElementNS(this.svgNS, "defs");
    this.element.insertBefore(this.defs, this.element.firstChild);

    this.init();
    this.setupKeyMonitoring();
    console.log("WheelMenu initialized");
  }

  setupKeyMonitoring() {
    document.addEventListener("keyup", (event) => {
      if (event.key === "F6" && this.keyMonitoring) {
        console.log("F6 released - notifying client");
        this.keyMonitoring = false;
        fetch(`https://${GetParentResourceName()}/keyReleased`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "F6" && !this.isVisible) {
        this.keyMonitoring = false;
      }
    });
  }

  init() {
    window.addEventListener("message", (event) => {
      const data = event.data;
      console.log("Message received:", data);

      if (data.type === "openMenu") {
        console.log("Opening menu with job:", data.playerJob);
        this.keyMonitoring = true;
        this.playerJob = data.playerJob;
        this.show();
      } else if (data.type === "closeMenu") {
        console.log("Closing menu");
        this.keyMonitoring = false;
        this.close();
      }
    });
  }

  getCurrentMenuData() {
    console.log(
      "Getting menu data. Current menu:",
      this.currentMenu,
      "Player job:",
      this.playerJob
    );

    if (this.currentMenu === "mainMenu") {
      const menuData = { ...this.config.mainMenu };
      let segments = [...menuData.segments];

      const jobSegmentIndex = segments.findIndex(
        (seg) => seg.submenu === "Job"
      );

      if (
        jobSegmentIndex !== -1 &&
        (!this.playerJob || !this.config.jobSegments[this.playerJob])
      ) {
        segments.splice(jobSegmentIndex, 1);
      }

      return { segments };
    }

    if (this.currentMenu === "Job") {
      if (this.playerJob && this.config.jobSegments[this.playerJob]) {
        console.log("Loading job segments for:", this.playerJob);
        return {
          segments: this.config.jobSegments[this.playerJob],
        };
      }
      this.returnToMain();
      return null;
    }

    return this.config.subMenus[this.currentMenu];
  }

calculateSegmentPosition(index, totalSegments) {
    const startAngle = index * (360 / totalSegments);
    const endAngle = (index + 1) * (360 / totalSegments);
    const middleAngle = (startAngle + endAngle) / 2;
    const middleRad = middleAngle * this.PI_180 - this.PI_90;

    const cosMiddle = Math.cos(middleRad);
    const sinMiddle = Math.sin(middleRad);

    const iconX = this.MENU_CENTER.x + this.DIMENSIONS.ICON_RADIUS * cosMiddle;
    const iconY = this.MENU_CENTER.y + this.DIMENSIONS.ICON_RADIUS * sinMiddle;

    // Keep the same positioning and base size that was working well
    const brushRadius = this.DIMENSIONS.OUTER_RADIUS + -25; // Changed from -10 to -25 to bring it closer
    const brushX = this.MENU_CENTER.x + brushRadius * cosMiddle;
    const brushY = this.MENU_CENTER.y + brushRadius * sinMiddle;
    const arcLength = (2 * Math.PI * brushRadius) / totalSegments;
    
    let width = arcLength * 15.0;  // Keep the large size we had before
    let height = arcLength * 1.0;

    // Only apply a maximum limit if segment is very large (like in 2-3 segment menus)
    if (totalSegments <= 4) {
        width = Math.min(width, 900);  // Maximum width only for very large segments
        height = Math.min(height, 300); // Maximum height only for very large segments
    }
    
    return {
      icon: {
        x: iconX - this.DIMENSIONS.ICON_SIZE / 2,
        y: iconY - this.DIMENSIONS.ICON_SIZE / 2,
        width: this.DIMENSIONS.ICON_SIZE,
        height: this.DIMENSIONS.ICON_SIZE,
      },
      label: {
        x: iconX,
        y: iconY + this.DIMENSIONS.LABEL_OFFSET,
      },
      angles: {
        start: startAngle,
        end: endAngle,
        middle: middleAngle,
        middleRad: middleRad,
      },
      brush: {
        x: brushX,
        y: brushY,
        width: width,
        height: height,
        rotation: middleAngle - 88
      }
    };
}

  createMenuItems() {
    const menuData = this.getCurrentMenuData();
    if (!menuData?.segments) {
      console.error("Invalid menu data received");
      return;
    }

    const segments = menuData.segments;
    const fragment = document.createDocumentFragment();
    const brushFragment = document.createDocumentFragment();

    this.menuItemsGroup.textContent = "";
    this.brushGroup.textContent = "";

    segments.forEach((segment, index) => {
      const position = this.calculateSegmentPosition(index, segments.length);
      const itemGroup = document.createElementNS(this.svgNS, "g");
      itemGroup.setAttribute("class", "menu-item");

      // Create segment background
      const segmentPath = document.createElementNS(this.svgNS, "path");
      segmentPath.setAttribute("class", "menu-item-bg");
      
      const segmentPathString = this.describeArc(
        this.MENU_CENTER.x,
        this.MENU_CENTER.y,
        this.DIMENSIONS.INNER_RADIUS,
        this.DIMENSIONS.OUTER_RADIUS,
        position.angles.start,
        position.angles.end
      );
      segmentPath.setAttribute("d", segmentPathString);

      // Create brush stroke highlight
      const highlightContainer = document.createElementNS(this.svgNS, "g");
      highlightContainer.setAttribute("class", `highlight-container segment-${index}`);
      
const brushStroke = document.createElementNS(this.svgNS, "image");
brushStroke.setAttribute("class", "brush-stroke");
brushStroke.setAttribute("width", position.brush.width);
brushStroke.setAttribute("height", position.brush.height);
brushStroke.setAttributeNS(this.xlinkNS, "href", "./icons/ui/redarc.png");

      // Position and transform the brush stroke
const transform = [
    `translate(${position.brush.x}, ${position.brush.y})`,
    `rotate(${position.brush.rotation})`,
    `translate(${-position.brush.width/2}, ${-position.brush.height/2})`
].join(" ");

      highlightContainer.setAttribute("transform", transform);
      highlightContainer.style.opacity = "0";
      highlightContainer.appendChild(brushStroke);
      brushFragment.appendChild(highlightContainer);

      // Add icon
      const icon = document.createElementNS(this.svgNS, "image");
      icon.setAttribute("class", "menu-item-icon");
      icon.setAttribute("x", position.icon.x);
      icon.setAttribute("y", position.icon.y);
      icon.setAttribute("width", position.icon.width);
      icon.setAttribute("height", position.icon.height);
      icon.setAttributeNS(this.xlinkNS, "href", segment.icon);

      if (segment.label) {
        const label = document.createElementNS(this.svgNS, "text");
        label.setAttribute("class", "menu-item-label");
        label.setAttribute("x", position.label.x);
        label.setAttribute("y", position.label.y);
        label.setAttribute("text-anchor", "middle");
        label.textContent = segment.label;
        itemGroup.appendChild(label);
      }

      itemGroup.dataset.index = index;

      // Event listeners
      itemGroup.addEventListener("mouseenter", () => {
        const highlight = this.brushGroup.querySelector(`.segment-${index}`);
        if (highlight) {
          highlight.style.opacity = "1";
        }
      });

      itemGroup.addEventListener("mouseleave", () => {
        const highlight = this.brushGroup.querySelector(`.segment-${index}`);
        if (highlight) {
          highlight.style.opacity = "0";
        }
      });

      itemGroup.addEventListener("click", () => {
        this.handleSegmentClick(segment);
      });

      itemGroup.appendChild(segmentPath);
      itemGroup.appendChild(icon);
      fragment.appendChild(itemGroup);
    });

    this.brushGroup.appendChild(brushFragment);
    this.menuItemsGroup.appendChild(fragment);
  }

  handleSegmentClick(segment) {
    if (segment.hasSubmenu) {
      this.openSubmenu(segment.submenu);
    } else if (segment.returnTo) {
      if (segment.returnTo === "mainMenu") {
        this.returnToMain();
      } else {
        this.openSubmenu(segment.returnTo);
      }
    } else if (segment.action) {
      this.selectItem(segment.action, segment.label);
    }
  }

  openSubmenu(menuName) {
    console.log("Opening submenu:", menuName);

    if (
      menuName === "Job" &&
      (!this.playerJob || !this.config.jobSegments[this.playerJob])
    ) {
      console.log("No valid job segments found");
      return;
    }

    this.menuHistory.push(this.currentMenu);
    this.currentMenu = menuName;
    this.createMenuItems();
  }

  returnToMain() {
    this.menuHistory = [];
    this.currentMenu = "mainMenu";
    this.createMenuItems();
  }

  show() {
    if (!this.isVisible) {
      this.isVisible = true;
      cancelAnimationFrame(this._hideRAF);
      this.element.style.display = "block";
      this._showRAF = requestAnimationFrame(() => {
        this.element.style.opacity = "1";
        this.returnToMain();
      });
    }
  }

  close() {
    if (this.isVisible) {
      this.isVisible = false;
      cancelAnimationFrame(this._showRAF);
      this.element.style.opacity = "0";
      this._hideRAF = requestAnimationFrame(() => {
        setTimeout(() => {
          if (!this.isVisible) {
            this.element.style.display = "none";
          }
        }, 200);
      });
      this.keyMonitoring = false;
    }
  }

  selectItem(action, label) {
    fetch(`https://${GetParentResourceName()}/menuSelect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: action,
        label: label,
        menu: this.currentMenu,
      }),
    });
  }

  describeArc(x, y, innerRadius, outerRadius, startAngle, endAngle) {
    const adjustedStartAngle = startAngle + this.DIMENSIONS.GAP_SIZE / 2;
    const adjustedEndAngle = endAngle - this.DIMENSIONS.GAP_SIZE / 2;

    const startAngleRad = adjustedStartAngle * this.PI_180 - this.PI_90;
    const endAngleRad = adjustedEndAngle * this.PI_180 - this.PI_90;

    const cosStart = Math.cos(startAngleRad);
    const sinStart = Math.sin(startAngleRad);
    const cosEnd = Math.cos(endAngleRad);
    const sinEnd = Math.sin(endAngleRad);

    const innerStartX = x + innerRadius * cosStart;
    const innerStartY = y + innerRadius * sinStart;
    const innerEndX = x + innerRadius * cosEnd;
    const innerEndY = y + innerRadius * sinEnd;

    const outerStartX = x + outerRadius * cosStart;
    const outerStartY = y + outerRadius * sinStart;
    const outerEndX = x + outerRadius * cosEnd;
    const outerEndY = y + outerRadius * sinEnd;

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return [
      `M ${innerStartX} ${innerStartY}`,
      `L ${outerStartX} ${outerStartY}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
      `L ${innerEndX} ${innerEndY}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
      "Z",
    ].join(" ");
  }
}

window.addEventListener("load", () => {
  console.log("Window loaded");
  const menuElement = document.getElementById("wheelMenu");
  if (menuElement) {
    console.log("Menu element found");
    window.wheelMenu = new WheelMenu(menuElement, Config);
  } else {
    console.error("Menu element not found!");
  }
});