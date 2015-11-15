//Constructor of animation objects

function Animation(id, span, type) {

    this.id = id;
    this.span = span;
    this.type = type;

}

Animation.prototype.constructor = Animation;

//Method of animation objects
Animation.prototype.calculateMatrix = function() {

    var matrix = mat4.create();
    mat4.identity(matrix);

    return matrix;
}