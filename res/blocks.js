function genPath(vertexSets,  scale) {
    var result = "";
    for(var i = 0; i < vertexSets.length; i++){
        result = result + vertexSets[i][0]*scale + " " + vertexSets[i][1]*scale + " ";
    }
    return result;
}

function Block(points, scale, offset, imgPath){
    this.points = points;
    this.scale = scale;
    this.offset = offset;
    this.imgPath = imgPath;
    this.vertexSets = genPath(points, scale);
}

blocks = [
    new Block(
        [[0, 0], [100, 0], [100, 50], [150, 50], [150, 100], [50, 100], [50, 50], [0, 50]],
        0.8,
        [0.5, 0.5],
        "res/1.1.png"
    ),
    new Block(
        [[0, 100], [100, 100], [100, 50], [150, 50], [150, 0], [50, 0], [50, 50], [0, 50]],
        0.8,
        [0.5, 0.5],
        "res/2.1.png"
    ),
    new Block(
        [[0, 0], [150, 0 ], [150, 50], [100, 50], [100, 100], [50, 100], [50, 50], [0, 50],],
        0.8,
        [0.5, 0.375],
        "res/3.1.png"
    ),
    new Block(
        [[0, 0], [100, 0], [100, 100], [0, 100]],
        0.8,
        [0.5, 0.5],
        "res/4.1.png"
    ),
    new Block(
        [[0, 0], [150, 0], [150, 50], [50, 50], [50, 100], [0, 100]],
        0.8,
        [0.4166666666666667, 0.375],
        "res/5.1.png"
    ),
    new Block(
        [[0, 0], [150, 0], [150, 100], [100, 100], [100, 50], [0, 50]],
        0.8,
        [0.5833333333333333, 0.375],
        "res/6.1.png"
    ),
    new Block(
        [[0, 0], [200, 0], [200, 50], [0, 50]],
        0.8,
        [0.5, 0.5],
        "res/7.1.png"
    )
];
blocksNum = blocks.length;


blocks.choose = function() {
    return blocks[parseInt(Math.random() * blocks.length)];
}


