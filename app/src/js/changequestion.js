const fetchQuestions = async () => {
    try {
        const response = await fetch('./questionData/...');
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        } const { projects } = await response.json();
        return projects || [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
};

const changeQuestion = (questions, type) => {
    const questionElement = document.getElementById('vraag');

    if (type == 'video') {
        questionElement.innerHTML = `
        <h2>${questions.vraag}</h2>
        <video controls autoplay>
            <source src="assets/videos/${questions.video}.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>`;
    } else {
        questionElement.innerHTML = `
        <h2>${questions.vraag}</h2>
        <p>${questions.tekst}</p>`;
    }
}

changeQuestion(questions, 'video');