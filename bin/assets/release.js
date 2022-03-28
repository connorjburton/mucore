const handleClick = (event) => {
    console.log(event.target.attributes);
};

const releases = document.querySelectorAll('article input[type="checkbox"]');
releases.forEach((release) => release.addEventListener('click', handleClick));