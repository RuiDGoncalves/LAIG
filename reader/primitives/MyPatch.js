function MyPatch(scene, order, partsU, partsV, controlpoints) {
    this.order = order;
    this.partsU = partsU;
    this.partsV = partsV;
    this.all_controlPoints = this.getControlPoints(controlpoints);
    
    if( this.order == 1 )
        this.knots = [0, 0, 1, 1];
    else if( this.order == 2 )
        this.knots = [0, 0, 0, 1, 1, 1];
    else if( this.order == 3 )
        this.knots = [0, 0, 0, 0, 1, 1, 1, 1];

    
    var nurbsSurface = new CGFnurbsSurface(this.order, this.order, this.knots, this.knots, this.all_controlPoints);

    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    CGFnurbsObject.call(this, scene, getSurfacePoint, this.partsU, this.partsV);
}
 
MyPatch.prototype = Object.create(CGFnurbsObject.prototype);
MyPatch.prototype.constructor = MyPatch; 

MyPatch.prototype.getControlPoints = function(arrayPoints) {
   
    var arrangedArrayPoints = [];
    var index = 0;

    for( var orderU = 0; orderU <= this.order; orderU++ ) {
        var vPoints = [];
        for( var orderV = 0; orderV <= this.order; orderV++ ) {
            vPoints.push(arrayPoints[index]);
            index++;
        }
        arrangedArrayPoints.push(vPoints);
    }

    return arrangedArrayPoints;
};


MyPatch.prototype.getKnots = function() {
    var knots = [];
    for (var i = 0; i <= this.order ; i++)
        knots.push(0);
    for (var j = 0; j <= this.order ; j++)
        knots.push(1);

    return knots;
};
