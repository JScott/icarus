// Require a character controller to be attached to the same game object
@script RequireComponent(CharacterController)

public var walkAnimation : AnimationClip;
public var runAnimation : AnimationClip;

public var walkMaxAnimationSpeed : float = 0.75;
public var runMaxAnimationSpeed : float = 1.0;

private var _animation : Animation;

var shadow : Projector;

enum AIStateOld {
	Walking = 0,
	Running = 1
}

private var _characterState : CharacterState;

// The speed when moving
var walkSpeed = 15.0;
var runSpeed = 30.0;

// The gravity for the character
var gravity = 20.0;

var speedSmoothing = 10.0;
var rotateSpeed = 500.0;

// The current move direction in x-z
private var moveDirection = Vector3.zero;
// The current vertical speed
private var verticalSpeed = 0.0;
// The current x-z move speed
private var moveSpeed = 0.0;

// The last collision flags returned from controller.Move
private var collisionFlags : CollisionFlags;

private var target : GameObject;

function Awake ()
{
	moveDirection = transform.TransformDirection(Vector3.forward);
	
	_animation = GetComponent(Animation);
	if(!_animation)
	Debug.Log("The character you would like to control doesn't have animations. Moving her might look weird.");
	
	if(!walkAnimation) {
		_animation = null;
		Debug.Log("No walk animation found. Turning off animations.");
	}
	if(!runAnimation) {
		_animation = null;
		Debug.Log("No run animation found. Turning off animations.");
	}
}

function Update() {
	UpdateSmoothedMovementDirection();
	
	// Apply gravity
	// - extra power jump modifies gravity
	// - controlledDescent mode modifies gravity
	ApplyGravity ();
	
	var movement = moveDirection * moveSpeed + Vector3(0, verticalSpeed, 0);
	movement *= Time.deltaTime;
	
	// Move the controller
	var controller : CharacterController = GetComponent(CharacterController);
	collisionFlags = controller.Move(movement);
	var shadowY = transform.position.y + 4;
	
	//transform.position += moveDirection * moveSpeed * Time.deltaTime;

	
	// VISUAL sector
	// Add a shadow to the character
	shadow.transform.position = Vector3(transform.position.x, shadowY, transform.position.z);
	
	// ANIMATION sector
	if(_animation) {
		if(_characterState == CharacterState.Running) {
			_animation[runAnimation.name].speed = Mathf.Clamp(moveSpeed, 0.0, runMaxAnimationSpeed);
			_animation.CrossFade(runAnimation.name);
		}
		else if(_characterState == CharacterState.Walking) {
			_animation[walkAnimation.name].speed = Mathf.Clamp(moveSpeed, 0.0, walkMaxAnimationSpeed);
			_animation.CrossFade(walkAnimation.name);
		}
	}
	// ANIMATION sector
	
	// Set rotation to the move direction
	transform.rotation = Quaternion.LookRotation(moveDirection);
}

function UpdateSmoothedMovementDirection ()
{
	
	// Target direction relative to the camera
	var targetDirection = Quaternion.AngleAxis(0.33, Vector3.up) * moveDirection;
	
	// We store speed and direction seperately,
	// so that when the character stands still we still have a valid forward direction
	// moveDirection is always normalized, and we only update it if there is user input.
	if (targetDirection != Vector3.zero)
	{
		// If we are really slow, just snap to the target direction
		// TODO: also if we're going the opposite direction, just do a skid first
		if (moveSpeed < walkSpeed * 0.9)
		{
			moveDirection = targetDirection.normalized;
		}
		// Otherwise smoothly turn towards it
		else
		{
			moveDirection = Vector3.RotateTowards(moveDirection, targetDirection, rotateSpeed * Mathf.Deg2Rad * Time.deltaTime, 1000);
			moveDirection = moveDirection.normalized;
		}
	}
	
	// Smooth the speed based on the current target direction
	var curSmooth = speedSmoothing * Time.deltaTime;
	
	// Choose target speed
	//* We want to support analog input but make sure you cant walk faster diagonally than just forward or sideways
	var targetSpeed = Mathf.Min(targetDirection.magnitude, 1.0);
	
	targetSpeed *= walkSpeed;
	_characterState = CharacterState.Walking;
	moveSpeed = Mathf.Lerp(moveSpeed, targetSpeed, curSmooth);
}

function ApplyGravity ()
{
	if (IsGrounded()){
		verticalSpeed = 0.0;
	}
	else
	{
		verticalSpeed -= gravity * Time.deltaTime;
	}
}

function IsGrounded () {
	return (collisionFlags & CollisionFlags.CollidedBelow) != 0;
}
