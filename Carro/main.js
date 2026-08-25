const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

const vertexShaderSource = `
    attribute vec2 position;

    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }`
;

const fragmentShaderSource = `
    precision mediump float;

    uniform vec4 color;

    void main() {
        gl_FragColor = color;
    }
`
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

function draw(vertices, r, g, b) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        buffer
    );
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(position);
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
        r,
        g,
        b,
        1
    );
    gl.drawArrays(
        gl.TRIANGLE_FAN,
        0,
        vertices.length / 2
    );
}

function circle(x, y, radius, r, g, b) {
    const vertices = [x, y];
    for (let i = 0; i <= 30; i++) {
        const angle =
            i * 2 * Math.PI / 30;
        vertices.push(
            x + Math.cos(angle) * radius,
            y + Math.sin(angle) * radius
        );
    }
    draw(vertices, r, g, b);
}

// Corpo
draw([
    -0.70, -0.30,
     0.70, -0.30,
     0.70,  0.10,
    -0.70,  0.10

], 0.4, 0.4, 0.4);

// Cabine
draw([
    -0.35, 0.10,
     0.35, 0.10,
     0.35, 0.55,
    -0.35, 0.55

], 0.4, 0.4, 0.4);

// Janela
draw([
    -0.10, 0.275,
     0.10, 0.275,
     0.10, 0.40,
    -0.10, 0.40

], 1.0, 1.0, 1.0);

// Roda Esquerda
circle(
    -0.45,
    -0.35,
     0.15,
    0.1,
    0.1,
    0.1
);

// Roda direita
circle(
     0.45,
    -0.35,
     0.15,
    0.1,
    0.1,
    0.1
);