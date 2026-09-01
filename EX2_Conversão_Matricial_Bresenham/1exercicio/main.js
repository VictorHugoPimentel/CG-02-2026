const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

const vertexShaderSource = `
    attribute vec2 position;

    void main() {
        gl_Position = vec4(position, 0.0, 1.0);

        // tamanho do ponto
        gl_PointSize = 2.0;
    }`
;

const fragmentShaderSource = `
    precision mediump float;

    uniform vec4 color;

    void main() {
        gl_FragColor = color;
    }`
;

function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}
const vertexShader = createShader(
    gl.VERTEX_SHADER,
    vertexShaderSource
);
const fragmentShader = createShader(
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);
const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const position = gl.getAttribLocation(
    program,
    "position"
);
const color = gl.getUniformLocation(
    program,
    "color"
);
const colors = [
    [0.0, 0.0, 1.0], // 0 azul
    [1.0, 0.0, 0.0], // 1 vermelho
    [0.0, 1.0, 0.0], // 2 verde
    [1.0, 1.0, 0.0], // 3 amarelo
    [1.0, 0.0, 1.0], // 4 rosa
    [0.0, 1.0, 1.0], // 5 ciano
    [0.0, 0.0, 0.0], // 6 preto
    [1.0, 0.5, 0.0], // 7 laranja
    [0.5, 0.0, 1.0], // 8 roxo
    [0.5, 0.5, 0.5]  // 9 cinza
];
let currentColor = colors[0];
let startPoint = {
    x: 0,
    y: 0
};
let endPoint = {
    x: 0,
    y: 0
};
let firstClick = true;

function bresenham(x0, y0, x1, y1) {
    const points = [];
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx;
    if (x0 < x1) {
        sx = 1;
    } else {
        sx = -1;
    }
    let sy;
    if (y0 < y1) {
        sy = 1;
    } else {
        sy = -1;
    }
    let error = dx - dy;
    while (true) {
        points.push(x0);
        points.push(y0);
        if (x0 === x1 && y0 === y1) {
            break;
        }
        const error2 = 2 * error;
        if (error2 > -dy) {
            error -= dy;
            x0 += sx;
        }
        if (error2 < dx) {
            error += dx;
            y0 += sy;
        }
    }
    return points;
}

function convertToWebGL(points) {
    const converted = [];
    for (let i = 0; i < points.length; i += 2) {
        const x = points[i];
        const y = points[i + 1];
        const webglX =
            (x / canvas.width) * 2 - 1;
        const webglY =
            1 - (y / canvas.height) * 2;
        converted.push(
            webglX,
            webglY
        );
    }
    return converted;
}

function drawLine() {
    gl.clearColor(
        1.0,
        1.0,
        1.0,
        1.0
    );
    gl.clear(
        gl.COLOR_BUFFER_BIT
    );
    const points = bresenham(
        startPoint.x,
        startPoint.y,
        endPoint.x,
        endPoint.y
    );
    const vertices =
        convertToWebGL(points);
    const buffer =
        gl.createBuffer();
    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        buffer
    );
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(
        position
    );
    gl.vertexAttribPointer(
        position,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );
    gl.uniform4f(
        color,
        currentColor[0],
        currentColor[1],
        currentColor[2],
        1.0
    );
    gl.drawArrays(
        gl.POINTS,
        0,
        vertices.length / 2
    );
}

canvas.addEventListener(
    "mousedown",
    function(event) {
        if (event.button !== 0) {
            return;
        }
        const rect =
            canvas.getBoundingClientRect();
        const x =
            Math.floor(
                event.clientX - rect.left
            );
        const y =
            Math.floor(
                event.clientY - rect.top
            );
        if (firstClick) {
            startPoint = {
                x: x,
                y: y
            };
            firstClick = false;
        } else {
            endPoint = {
                x: x,
                y: y
            };
            firstClick = true;
            drawLine();
        }
    }
);
document.addEventListener(
    "keydown",
    function(event) {
        const number =
            Number(event.key);
        if (
            number >= 0 &&
            number <= 9
        ) {
            currentColor =
                colors[number];
            drawLine();
        }
    }
);
drawLine();