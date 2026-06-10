/**
 * Debounce is a technique used to limit the rate at which a function is executed. 
 * It ensures that a function is only called after a certain amount of time has passed since the last time it was invoked.
 * This is particularly useful for scenarios like search input, 
 * where you want to wait for the user to stop typing before making an API call.
 * @param {*} func 
 * @param {*} delay 
 * @returns 
 */

function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
}

const search = (query) => {
    console.log(`Searching for ${query}`);
}

const debouncedSearch = debounce(search, 300);

debouncedSearch("JavaScript");
debouncedSearch("JavaScript hard");
debouncedSearch("JavaScript hard questions");
debouncedSearch("JavaScript hard questions for");
debouncedSearch("JavaScript hard questions for interviews");