function LinearAnimation(scene, span, controlPoints) {
	Animation.call(this, span, "linear");
	
	this.scene = scene;
    this.controlPoints = controlPoints;

    this.init();
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.clone = function () {
	
	return new LinearAnimation(this.scene, this.span, this.controlPoints);
	
};

LinearAnimation.prototype.init = function() {
	var distance = 0;
    
	this.translations = [this.controlPoints.length-1];
    this.rotations = [this.controlPoints.length-1];
	
    for (var i = 0; i < this.controlPoints.length - 1; i++) {
		var vector = vec3.create();
        vec3.sub(vector, this.controlPoints[i+1], this.controlPoints[i]);
        this.translations[i] = vector;
		
        var projectionXZ = vec3.fromValues(vector[0], 0, vector[2]);
		
        if( vec3.length(projectionXZ) > 0 ) {
        	var sign;
        	if( projectionXZ[0] < 0 )
        		sign = -1;
        	else if( projectionXZ[0] >= 0 )
        		sign = 1;
        	
            this.rotations[i] = sign * Math.acos(vec3.dot(projectionXZ, vec3.fromValues(0, 0, 1))/vec3.length(projectionXZ));
        } else
           	this.rotations[i] = (i == 0 ? 0 : this.rotations[i-1]);
    
        distance += vec3.length(vector);
    }
	this.start = false;
	this.finish = false;
    this.velocity = distance/this.span;
	
    this.controlPointsTime = [this.controlPoints.length];
    this.controlPointsTime[0] = 0;
	
    this.controlPointsSpan = [this.controlPoints.length - 1];
	
    for (var i = 1; i < this.controlPoints.length; ++i) {    
        this.controlPointsTime[i] = this.controlPointsTime[i-1] + vec3.length(this.translations[i-1])/this.velocity;
        this.controlPointsSpan[i-1] = this.controlPointsTime[i] - this.controlPointsTime[i-1]; 
    }
}

LinearAnimation.prototype.calculateMatrix = function(t) {

    if ( this.startTime < 0 ) {
        this.startTime = t;
    }

    this.matrix = mat4.create();
    mat4.identity(this.matrix);
	
    time = Math.min(t - this.startTime, this.span);

   	if(time >= this.span){
		this.finish = true;
		this.start = false;
   		return;
   	}
	
    var index;
    for( index = this.controlPointsTime.length - 1; index > 0; index-- )
        if( this.controlPointsTime[index] < time )
            break;
	
    var tScale = (time - this.controlPointsTime[index]) / this.controlPointsSpan[index];
    var position = vec3.clone(this.controlPoints[index]);
    var translation_amount = vec3.create();
    vec3.scale(translation_amount, this.translations[index], tScale);
    vec3.add(position, position, translation_amount);
	
    mat4.translate(this.matrix, this.matrix, position);
    mat4.rotateY(this.matrix, this.matrix, this.rotations[index]);
}

