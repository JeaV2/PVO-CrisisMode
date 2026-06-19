const casus = {
    vraag: "Wat is de juiste manier om een brand te blussen?",
    tekst: "De juiste manier om een brand te blussen is met een brandblussers.",
    video: "brand_blussen"
}

const changeQuestion = (casus, type) => {
    const questionElement = document.getElementById('vraag');

    if (type == 'video') {
        questionElement.innerHTML = `
        <h2>${casus.vraag}</h2>
        <video controls autoplay>
            <source src="assets/videos/${casus.video}.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>`;
    } else {
        questionElement.innerHTML = `
        <h2>${casus.vraag}</h2>
        <p>${casus.tekst}</p>`;
    }
}

changeQuestion(casus, 'video');