var rotateSpeed = 5.0; // In degrees
var player : ThirdPersonController;

// The last collision flags returned from controller.Move
private var collisionFlags : CollisionFlags;
private var pos : Vector3 = Vector3.forward;
var height : float = 1.5;

private var target : GameObject;

function Awake ()
{
}

function Update() {
	pos = Quaternion.AngleAxis(rotateSpeed, Vector3.up) * pos;
	transform.forward = Vector3.Cross(pos, Vector3.up);
	
	transform.position = player.transform.position;
	transform.position.y += height;
	transform.position += pos;
	
	
	//transform.Rotate(0, rotateSpeed * (rotateRight ? 1 : -1), 0);
	//moveDirection = transform.forward;
	
	//var movement = moveDirection * swimSpeed * Time.deltaTime;
	
	// Move the actor
	//transform.Translate(movement, Space.World);
	//var shadowY = transform.position.y + 4;
}