// declare function as global to avoid issues with terser
switchDateFormat = function($) {
    $('.date').each((idx, val) => {
        const dateElement = $(val);
        const dateParts = dateElement.html().split('/');
        dateElement.html(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);
    })
}

try {
    module.exports = { switchDateFormat };
} catch {}