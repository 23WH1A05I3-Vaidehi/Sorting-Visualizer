let array = []; // store the array globally
let SPEED = 500; // default speed
const container = document.getElementById("array-container"); // container must exist
const speedRange = document.getElementById("speedRange");
const speedValue = document.getElementById("speedValue");

// ---------------- Speed control ----------------
function updateSpeed() {
    SPEED = Number(speedRange.value);

    if (SPEED <= 400) speedValue.innerText = "Fast";
    else if (SPEED <= 700) speedValue.innerText = "Medium";
    else speedValue.innerText = "Slow";
}

// initialize
updateSpeed();
speedRange.addEventListener("input", updateSpeed);

// ---------------- Array generation ----------------
function generateArray(size = 8) {
    container.innerHTML = "";
    array = [];

    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * 90) + 10;
        array.push(value);

        const circle = document.createElement("div");
        circle.className = "circle";
        circle.innerText = value;
        container.appendChild(circle);
    }
}

// ---------------- Animation ----------------
function animate(animations) {
    const circles = document.getElementsByClassName("circle");

    animations.forEach((step, i) => {
        setTimeout(() => {
            const [type, a, b] = step;

            if (type === "compare") {
                circles[a].classList.add("active");
                circles[b].classList.add("active");
                circles[a].style.backgroundColor = "red";
                circles[b].style.backgroundColor = "red";

                setTimeout(() => {
                    circles[a].classList.remove("active");
                    circles[b].classList.remove("active");
                    circles[a].style.backgroundColor = "steelblue";
                    circles[b].style.backgroundColor = "steelblue";
                }, SPEED / 2);
            }

            if (type === "swap") {
                circles[a].classList.add("swap");
                circles[b].classList.add("swap");
                circles[a].style.backgroundColor = "orange";
                circles[b].style.backgroundColor = "orange";

                let temp = circles[a].innerText;
                circles[a].innerText = circles[b].innerText;
                circles[b].innerText = temp;

                setTimeout(() => {
                    circles[a].classList.remove("swap");
                    circles[b].classList.remove("swap");
                    circles[a].style.backgroundColor = "steelblue";
                    circles[b].style.backgroundColor = "steelblue";
                }, SPEED / 2);
            }

            if (type === "overwrite") {
                circles[a].style.backgroundColor = "purple";
                circles[a].innerText = b;
                setTimeout(() => {
                    circles[a].style.backgroundColor = "steelblue";
                }, SPEED / 2);
            }

        }, i * SPEED);
    });
}

// ---------------- Sorting Controller ----------------
function startSort() {
    const algo = document.getElementById("algorithm").value;
    let animations = [];

    if (algo === "bubble") animations = bubbleSort(array);
    if (algo === "selection") animations = selectionSort(array);
    if (algo === "insertion") animations = insertionSort(array);
    if (algo === "merge") animations = mergeSort(array);
    if (algo === "quick") animations = quickSort(array);

    animate(animations);
}


/* ---------------- SORTING ALGORITHMS ---------------- */

function bubbleSort(arr) {
    let a = arr.slice();
    let animations = [];

    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {
            animations.push(["compare", j, j + 1]);
            if (a[j] > a[j + 1]) {
                animations.push(["swap", j, j + 1]);
                [a[j], a[j + 1]] = [a[j + 1], a[j]];
            }
        }
    }
    return animations;
}

function selectionSort(arr) {
    let a = arr.slice();
    let animations = [];

    for (let i = 0; i < a.length; i++) {
        let min = i;
        for (let j = i + 1; j < a.length; j++) {
            animations.push(["compare", min, j]);
            if (a[j] < a[min]) min = j;
        }
        if (min !== i) {
            animations.push(["swap", i, min]);
            [a[i], a[min]] = [a[min], a[i]];
        }
    }
    return animations;
}

function insertionSort(arr) {
    let a = arr.slice();
    let animations = [];

    for (let i = 1; i < a.length; i++) {
        let key = a[i];
        let j = i - 1;

        while (j >= 0 && a[j] > key) {
            animations.push(["overwrite", j + 1, a[j]]);
            a[j + 1] = a[j];
            j--;
        }
        animations.push(["overwrite", j + 1, key]);
        a[j + 1] = key;
    }
    return animations;
}

/* ---------------- MERGE SORT ---------------- */

function mergeSort(arr) {
    let animations = [];
    let a = arr.slice();

    function merge(l, r) {
        let res = [];
        while (l.length && r.length) {
            res.push(l[0] < r[0] ? l.shift() : r.shift());
        }
        return [...res, ...l, ...r];
    }

    function divide(a, start) {
        if (a.length <= 1) return a;
        let mid = Math.floor(a.length / 2);
        let left = divide(a.slice(0, mid), start);
        let right = divide(a.slice(mid), start + mid);
        let merged = merge(left, right);

        for (let i = 0; i < merged.length; i++) {
            animations.push(["overwrite", start + i, merged[i]]);
        }
        return merged;
    }

    divide(a, 0);
    return animations;
}

/* ---------------- QUICK SORT ---------------- */

function quickSort(arr) {
    let animations = [];
    let a = arr.slice();

    function qs(low, high) {
        if (low < high) {
            let p = partition(low, high);
            qs(low, p - 1);
            qs(p + 1, high);
        }
    }

    function partition(low, high) {
        let pivot = a[high];
        let i = low;

        for (let j = low; j < high; j++) {
            animations.push(["compare", j, high]);
            if (a[j] < pivot) {
                animations.push(["swap", i, j]);
                [a[i], a[j]] = [a[j], a[i]];
                i++;
            }
        }
        animations.push(["swap", i, high]);
        [a[i], a[high]] = [a[high], a[i]];
        return i;
    }

    qs(0, a.length - 1);
    return animations;
}

/* ---------------- CONTROLLER ---------------- */

function startSort() {
    const algo = document.getElementById("algorithm").value;
    let animations = [];

    if (algo === "bubble") animations = bubbleSort(array);
    if (algo === "selection") animations = selectionSort(array);
    if (algo === "insertion") animations = insertionSort(array);
    if (algo === "merge") animations = mergeSort(array);
    if (algo === "quick") animations = quickSort(array);

    animate(animations); // uses SPEED chosen on slider before clicking
}




/* ---------------- INIT ---------------- */

generateArray();
