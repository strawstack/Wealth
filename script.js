const WIDTH_SVG = 720;
const HEIGHT_SVG = 1280;

// Create SVG
d3.select("body")
    .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${WIDTH_SVG} ${HEIGHT_SVG}`);

function createCircle(d3, data) {
    return d3.select("svg")
        .append("circle")
        .attr("cx", data.x)
        .attr("cy", data.y)
        .attr("r", data.r)
        .style("fill", "salmon");

}

function createRect(d3, data) {
    return d3.select("svg")
        .append('rect')
        .attr('x', data.x)
        .attr('y', data.y)
        .attr('width', data.w)
        .attr('height', data.h)
        .attr('fill', '#69a3b2');
}

const CIRCLE_RADIUS = 25;
const RECT_WIDTH = 2 * CIRCLE_RADIUS;
const RECT_HEIGHT = 20;
const RECT_V_GAP = 5;
const RECT_CIRCLE_V_GAP = 20;

const COLUMN_INTER_SPACE = 20;

const LEFT_RIGHT_MARGIN = 20;
const BOTTOM_MARGIN = 50;

const CIRCLE_Y_LEVEL = HEIGHT_SVG - BOTTOM_MARGIN;

const circle_count = 10;
const rect_start_count = 5;
const render_width = circle_count * (2 * CIRCLE_RADIUS) + (circle_count - 1) * COLUMN_INTER_SPACE;

let circles = [];
let rectangles = [];
for (let i = 0; i < circle_count; i++) {
    circles.push(
        createCircle(d3, {
            x: (COLUMN_INTER_SPACE + 2 * CIRCLE_RADIUS) * i + LEFT_RIGHT_MARGIN + CIRCLE_RADIUS,
            y: CIRCLE_Y_LEVEL,
            r: CIRCLE_RADIUS
        })
    );

    let lst = [];
    for (let j = 0; j < rect_start_count; j++) {
        lst.push(
            createRect(d3, {
                x: (COLUMN_INTER_SPACE + RECT_WIDTH) * i + LEFT_RIGHT_MARGIN,
                y: CIRCLE_Y_LEVEL - CIRCLE_RADIUS - RECT_HEIGHT - RECT_CIRCLE_V_GAP - (RECT_HEIGHT + RECT_V_GAP) * j,
                w: RECT_WIDTH,
                h: RECT_HEIGHT
            })
        );
    }
    rectangles.push(lst);
}

function swap() {
    let order = [];
    for (let i = 0; i < circle_count; i++) { order.push(i); }
    shuffleArray(order);

    // For each circle
    let takenLevels = {};
    for (let i = 0; i < circle_count; i++) {
        
        if (rectangles[order[i]].length == 0) {
            continue;
        }

        // Get first rect
        let rect = rectangles[order[i]].pop();

        // Find destination
        let d = Math.floor(Math.random() * 10);
        while (d == order[i]) {
            d = Math.floor(Math.random() * 10);
        }

        // Highest level between `order[i]` and `d`
        let lo = Math.min(order[i], d);
        let hi = Math.max(order[i], d);
        let highest = 0;
        for (let k = lo; k <= hi; k++) {
            highest = Math.max(highest, rectangles[k].length);
        }

        let offset = 0;
        while (highest + 1 + i + offset in takenLevels) {
            offset += 1;
        }
        takenLevels[highest + 1 + i + offset] = true;

        // Move rect up
        rect.transition()
            .duration(1000)
            .attr("y", CIRCLE_Y_LEVEL - CIRCLE_RADIUS - RECT_HEIGHT - RECT_CIRCLE_V_GAP - 25 * (highest + 1 + i + offset));
        
        // Move rect sideways
        setTimeout(() => {
            rect.transition()
                .duration(1000)
                .attr("x", (COLUMN_INTER_SPACE + RECT_WIDTH) * d + LEFT_RIGHT_MARGIN);
        }, 1000 + 500);

        // Move down
        setTimeout(() => {
            rect.transition()
                .duration(1000)
                .attr("y", CIRCLE_Y_LEVEL - CIRCLE_RADIUS - RECT_HEIGHT - RECT_CIRCLE_V_GAP- 25 * (rectangles[d].length));
            rectangles[d].push(rect);
        }, 1000 + 1000 + 500 + 500);
    }
    
}
setTimeout(() => {
    swap();
    setInterval(swap, 1000 + 1000 + 500 + 1000 + 500 + 500);
}, 500);

setTimeout(() => {
    document.querySelector(".description").style.opacity = 0.6;
}, 500);

// helpers

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}