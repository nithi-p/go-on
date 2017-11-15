var app = angular.module("myApp", ["firebase"]);

app.controller('myCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {

  var ref = firebase.database().ref().child("currentNum");
  // download the data into a local object
  var syncObject = $firebaseObject(ref);
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
  syncObject.$bindTo($scope, "currentNum");

  var peopleObject = $firebaseObject(ref);
  peopleObject.$bindTo($scope, "box");

   var peopleRef = firebase.database().ref().child("box");
   var peopleInfo = $firebaseArray(peopleRef);




(function() {
    
    // Init som useful stuff for easier access (don't need 'em all)
    var   b2Vec2 = Box2D.Common.Math.b2Vec2
        , b2AABB = Box2D.Collision.b2AABB
        , b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2Fixture = Box2D.Dynamics.b2Fixture
        , b2World = Box2D.Dynamics.b2World
        , b2MassData = Box2D.Collision.Shapes.b2MassData
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
        , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
        , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
        , b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
        , b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    var SCALE,
        canvas,
        ctx,
        world,
        fixDef,
        shapes = {};
        
    var debug = false;
    
    var init = {
        start: function(id) {
            this.defaultProperties();
            this.canvas(id);
            
            box2d.create.world();
            box2d.create.defaultFixture();
            
            this.surroundings.leftWall();
            this.surroundings.rightWall();
            this.surroundings.ground();
            
            this.callbacks();



                       
             setTimeout(function() {  location.reload(); }, 1000000);
            

            
            // On my signal: Unleash hell.
            (function hell() {
                loop.step();
                loop.update();
                if (debug) {
                    world.DrawDebugData();
                }
                loop.draw();
                requestAnimFrame(hell);
            })();
        },
        defaultProperties: function() {
            SCALE = 55;
        },
        canvas: function(id) {
            canvas = document.getElementById(id);
            ctx = canvas.getContext("2d");
            ctx.canvas.width  = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        },
        surroundings: {
            rightWall: function() {
                add.box({
                    x:  (canvas.width / SCALE )+ 1,   // 740 / 30 + 1.1
                    y:  (canvas.height / SCALE) - (canvas.height / SCALE)*0.5 ,        // 380px / 30 / 2
                    height: canvas.height / SCALE,  // 380px / 30
                    width:2,
                    isStatic: true
                });
            },
            ground: function() {
                add.box({
                    x: canvas.width / SCALE - (canvas.width / SCALE)*0.5,        // 740 / 30 / 2
                    y: (canvas.height / SCALE) + 0.05,
                    height: 0.1,
                    width:canvas.width / SCALE,     // 740 / 30
                    isStatic: true
                });
            },
            leftWall: function() {
                add.box({
                    x: -1,
                    y:  (canvas.height / SCALE) - (canvas.height / SCALE)*0.5 ,        // 380px / 30 / 2
                    height: canvas.height / SCALE,   // 380px / 30
                    width:2,
                    isStatic: true
                });
            }
        },
        callbacks: function() {





            peopleInfo.$watch(function(event) { 


                     var shapeOptions = {
                            username: peopleInfo[peopleInfo.length-1].firstname,
                            longtext: peopleInfo[peopleInfo.length-1].lastname,
                            radius: 2
                        };  
                     add.circle(shapeOptions);
                     setTimeout(function() { add.bloodDrop(shapeOptions); }, 50);



             }, true);


            



            canvas.addEventListener('click', function() {
                 var text = "";
                 var possible = "ABO";
                 text += possible.charAt(Math.floor(Math.random() * possible.length));
                 var chosenValue = Math.random() < 0.75 ? text : 'AB';

                    



                var shapeOptions = {
                    username: chosenValue,
                    longtext: ""
                };

               add.bloodGroup(shapeOptions);
               



            }, false);



             $scope.$watch('currentNum', function() { 


                 var shapeOptions = {
                    radius:2,
                };
                add.random(shapeOptions);
                setTimeout(function() { add.random(shapeOptions); }, 250);
                setTimeout(function() { add.random(shapeOptions); }, 600);

             }, true);






        }
    };        
     
     
    var add = {
        random: function(options) {
            options = options || {};
            if (Math.random() < 0.25){

                 var text = "";
                 var possible = "ABO";
                 text += possible.charAt(Math.floor(Math.random() * possible.length));
                 var chosenValue = Math.random() < 0.75 ? text : 'AB';
                options.username = chosenValue;
                options.longtext = "";
                this.bloodGroup(options);
            } else {
                this.bloodDrop(options);
            }
        },

        circle: function(options) {
            options.radius = 0.8 + Math.random()*0.2;
            options.x = (canvas.width / SCALE)*0.5 + (Math.random()*0.1);
            var shape = new Circle(options);
            shapes[shape.id] = shape;
            box2d.addToWorld(shape);
        },
        bloodGroup: function(options) {
            options.radius = 0.4 + Math.random()*0.2;
            options.x = (canvas.width / SCALE)*0.5 + (Math.random()*0.1);
            var shape = new Circle(options);
            shapes[shape.id] = shape;
            box2d.addToWorld(shape);
        },

        bloodDrop: function(options) {
            options.radius = 0.25 + Math.random()*0.1;
            options.x = (canvas.width / SCALE)*0.5 + (Math.random()*0.1);
            var shape = new BloodDrop(options);
            shapes[shape.id] = shape;
            box2d.addToWorld(shape);
        },

        box: function(options) {
            options.width = options.width || 0.5 + Math.random()*2;
            options.height = options.height || 0.5 + Math.random()*2;
            var shape = new Box(options);
            shapes[shape.id] = shape;
            box2d.addToWorld(shape);
        }
    };

    var box2d = {
        addToWorld: function(shape) {
            var bodyDef = this.create.bodyDef(shape);
            var body = world.CreateBody(bodyDef);
            if (shape.radius) {
                fixDef.shape = new b2CircleShape(shape.radius);
            } else {
                fixDef.shape = new b2PolygonShape;
                fixDef.shape.SetAsBox(shape.width / 2, shape.height / 2);
            }
            body.CreateFixture(fixDef);
        },
        create: {
            world: function() {
                world = new b2World(
                    new b2Vec2(0, 30)    //gravity
                    , true                 //allow sleep
                );
                
                if (debug) {
                    var debugDraw = new b2DebugDraw();
                    debugDraw.SetSprite(ctx);
                    debugDraw.SetDrawScale(30.0);
                    debugDraw.SetFillAlpha(0.3);
                    debugDraw.SetLineThickness(1.0);
                    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
                    world.SetDebugDraw(debugDraw);
                }
            },
            defaultFixture: function() {
                fixDef = new b2FixtureDef;
                fixDef.density = 1;
                fixDef.friction = 0.1;
                fixDef.restitution = 0.4;
            },
            bodyDef: function(shape) {
                var bodyDef = new b2BodyDef;
        
                if (shape.isStatic == true) {
                    bodyDef.type = b2Body.b2_staticBody;
                } else {
                    bodyDef.type = b2Body.b2_dynamicBody;
                }
                bodyDef.position.x = shape.x;
                bodyDef.position.y = shape.y;
                bodyDef.userData = shape.id;
                bodyDef.angle = shape.angle;
            
                return bodyDef;
            }
        },
        get: {
            bodySpec: function(b) {
                return {
                    x: b.GetPosition().x, 
                    y: b.GetPosition().y, 
                    angle: b.GetAngle(), 
                    center: {
                        x: b.GetWorldCenter().x, 
                        y: b.GetWorldCenter().y
                    }
                };
            }
        }
    };


    var loop = {
        step: function() {
            var stepRate = 1 / 60;
            world.Step(stepRate, 10, 10);
            world.ClearForces();
        },
        update: function () {            
            for (var b = world.GetBodyList(); b; b = b.m_next) {
                if (b.IsActive() && typeof b.GetUserData() !== 'undefined' && b.GetUserData() != null) {
                    shapes[b.GetUserData()].update(box2d.get.bodySpec(b));
                }
            }
        },
        draw: function() {            
            if (!debug) ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (var i in shapes) {
                shapes[i].draw();
            }
        }
    };    
    
    var helpers = {

       randomColor: function() {
            var color = "rgba("
            var r = 255;
            var g = 20 + Math.round(Math.random() * 50);
            var b = 40 + Math.round(Math.random() * 50);
            var rgba = r + "," + g + "," + b + ",0.07)";
            color += rgba;
            return color;
        }

    };


    
    /* Shapes down here */
    
    var Shape = function(v) {
        this.id = Math.round(Math.random() * 1000000);
        this.x = v.x || Math.random()*23 + 1;
        this.y = v.y || 0;
        this.angle = 0;
        this.color = helpers.randomColor();
        this.center = { x: null, y: null };
        this.isStatic = v.isStatic || false;
        
        this.update = function(options) {
            this.angle = options.angle;
            this.center = options.center;
            this.x = options.x;
            this.y = options.y;
        };
    };
    
    var Circle = function(options) {
        Shape.call(this, options);
        this.radius = options.radius || 1;
        this.username = options.username;
        this.longtext = options.longtext;

        
        this.draw = function() {
            ctx.save();
            ctx.translate(this.x * SCALE, this.y * SCALE);
            ctx.rotate(this.angle);
            ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);
            ctx.fillStyle = this.color;
                                ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                 ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE,+1, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                    ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-1, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                   ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE+3, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                    ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE+4, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();

                                 ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE+6, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-1, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                    ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                  ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-3, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                    ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-4, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                      ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-5, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                    ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-6, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                    ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-7, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                   ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-8, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                    ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-10, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                    ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-12, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                    ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-14, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                                    ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-20, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.font = (this.radius * SCALE*0.3).toString()+"px Lato";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.fillText(this.username, this.x * SCALE , (this.y * SCALE) - 7);
            ctx.font = (this.radius*SCALE*0.17).toString()+"px Lato";
            var theLongText = this.longtext;
            var ctext = theLongText.split("").join(String.fromCharCode(8202));
            ctx.fillText(ctext, this.x * SCALE, this.y * SCALE + (this.radius * SCALE*0.2)-4);
            ctx.font = (this.radius*SCALE*0.21).toString()+"px Lato";
            ctx.restore();
        };
    };
    Circle.prototype = Shape;


      var BloodDrop = function(options) {
        Shape.call(this, options);
        this.radius = options.radius || 1;
        this.draw = function() {
            ctx.save();
            ctx.translate(this.x * SCALE, this.y * SCALE);
            ctx.rotate(this.angle);
            ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);
            ctx.fillStyle = "rgba(255,0,0,0.05)";
            ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
                        ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-3, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "rgba(255,0,0,0.09)";
                        ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-9, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
             ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE-12, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };
    };
    BloodDrop.prototype = Shape;


    
    var Box = function(options) {
        Shape.call(this, options);
        this.width = options.width || Math.random()*2+0.5;
        this.height = options.height || Math.random()*2+0.5;
        
        this.draw = function() {
            ctx.save();
            ctx.translate(this.x * SCALE, this.y * SCALE);
            ctx.rotate(this.angle);
            ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);
            ctx.fillStyle = this.color;
            ctx.fillRect(
                (this.x-(this.width / 2)) * SCALE,
                (this.y-(this.height / 2)) * SCALE,
                this.width * SCALE,
                this.height * SCALE
            );
            ctx.restore();
        };
    };
    Box.prototype = Shape;
    
    init.start('box2d-demo');
})();








































}]);     // END OF ANGULAR CONTROLLER