// Require a character controller to be attached to the same game object
//@script RequireComponent(CharacterController)

//var shadow : Projector;

enum AIState {
	Walking = 0,
	Running = 1
}

private var _characterState : CharacterState;

// The speed when moving
var swimSpeed = 15.0;

var rotateSpeed = 5.0; // In degrees
var rotateRight = true;

// The current move direction in x-z
private var moveDirection : Vector3;

// The last collision flags returned from controller.Move
private var collisionFlags : CollisionFlags;

private var target : GameObject;

function Awake ()
{
	moveDirection = transform.forward;
}

function Update() {
	transform.Rotate(0, rotateSpeed * (rotateRight ? 1 : -1), 0);
	moveDirection = transform.forward;
	
	var movement = moveDirection * swimSpeed * Time.deltaTime;
	
	// Move the actor
	transform.Translate(movement, Space.World);
	//var shadowY = transform.position.y + 4;
}

function Die() {
	Destroy(gameObject);
}