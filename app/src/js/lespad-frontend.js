const totalLessons = 10;
const container = document.querySelector(".lespad-path");
const path = document.getElementById("lessonPath");
const pathLength = path.getTotalLength();

for(let i = 0; i < totalLessons; i++) {
    const distance = (pathLength / (totalLessons - 1)) * i;
    const point = path.getPointAtLength(distance);
    const lesson = document.createElement("div");
    
    lesson.className = "lesson";
    lesson.innerHTML = `<h3>${i + 1}. Les</h3>`;
    lesson.style.left = `${(point.x / 1000) * 100}%`;
    lesson.style.top = `${point.y}px`;

    container.appendChild(lesson);
}

/*
lesson = lesson number
side = left or right
offsetX = horizontal
offsetY = vertical
*/
const graphLessons = [
    {
        lesson: 0,
        text:"1. Les",
        side:"left",
        offsetX: -140,
        offsetY: -35
    },
    {
        lesson: 3,
        text:"5. Les",
        side:"right",
        offsetX: 140,
        offsetY: -35
    },
    {
        lesson: 8,
        text:"9. Les",
        side:"left",
        offsetX: -140,
        offsetY: -35
    }
];

graphLessons.forEach(graph => {
    const distance = (pathLength / (totalLessons - 1)) * graph.lesson;
    const point = path.getPointAtLength(distance);
    const bubble = document.createElement("div");

    bubble.className = graph.side === "left" ? "lesson-callout lesson-callout-left" : "lesson-callout lesson-callout-right";

    const image = graph.side === "left" ? "assets/imgs/textgraph-left.png" : "assets/imgs/textgraph-right.png";

    bubble.innerHTML = `<img src="${image}" alt=""><span>${graph.text}</span>`;
    bubble.style.left = `calc(${(point.x / 1000) * 100}% + ${graph.offsetX}px)`;
    bubble.style.top = `${point.y + graph.offsetY}px`;
    container.appendChild(bubble);
});
