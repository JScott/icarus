// Where we want to be
var cameraTransform : Transform;

// Where we want to be looking
private var focus : Vector3;
// Where we are looking
private var realFocus : Vector3;


// Camera's target
private var _target : Transform;





// the height we want the camera to be above the target
var height : float = 10;			// How high up the camera is
var distance : float = 13;			// How far away the camera is
private var lockAngle : float = 90; // How far we let the camera jump when rotating
var rotateSpeed : float = 160; 		// How fast the camera turns when rotating.

var maxLeadDistance = 2;
var leadSpeed = 2;
var leftRightLead = false;

private enum States { DEFAULT, ROTATE_LEFT, ROTATE_RIGHT };
private var state : States = States.DEFAULT;

var rotation : float = 0;				// The current rotation of the camera
private var rotateDistance : float = 0; // How far we have left to go if rotating



private var lead = Vector3.zero;
private var controller : ThirdPersonController;

function Awake ()
{
	if(!cameraTransform && Camera.main)
		cameraTransform = Camera.main.transform;
	
	if(!cameraTransform) {
		Debug.Log("Please assign a camera to the ThirdPersonCamera script.");
		enabled = false;
	}
	
	_target = transform;
	if (_target)
	{
		controller = _target.GetComponent(ThirdPersonController);
	}
	
	if (controller)
	{
		var characterController : CharacterController = _target.collider;
	}
	else
	Debug.Log("Please assign a target to the camera that has a ThirdPersonController script attached.");

	SetCameraPosition(true);
}

function AngleDistance (a : float, b : float)
{
	a = Mathf.Repeat(a, 360);
	b = Mathf.Repeat(b, 360);
	
	return Mathf.Abs(b - a);
}

function LateUpdate()
{
	// Early out if we don't have a target
	if (!controller) return;


	SetCameraPosition(false);
	
	// Lead where the character is going
	var leadDirection = controller.GetDirection();
	if (leftRightLead) leadDirection = Vector3.Project(leadDirection, cameraTransform.right);
	var newLead =  leadDirection * maxLeadDistance * (controller.GetSpeed()/controller.walkSpeed);
	lead = Vector3.Lerp(lead, newLead, leadSpeed*Time.deltaTime);

		// flatten this to camera

	//if (controller.IsJumping()) focus.y = controller.GetCameraFocusHeight();
	lead.y = 0;
	cameraTransform.position += lead;
	focus += lead;


	cameraTransform.LookAt(focus);
	
	return;
	
	// TODO: look at someone when I'm talking to them
}

function SetCameraPosition(hardReset : boolean)
{
	// Look at the character
	focus.x = _target.position.x;
	focus.z = _target.position.z;
	if (hardReset)
		focus.y = controller.groundedHeight;
	else
		focus.y = Mathf.Lerp(focus.y, controller.groundedHeight, 10*Time.deltaTime);

	// Follow the character
	cameraTransform.position = focus;
	cameraTransform.position.y += height;
	cameraTransform.position.z -= distance;
	cameraTransform.RotateAround(_target.position, Vector3.up, rotation);
}



function Update () {
	// Deal with input affecting the Camera
	if (Input.GetButtonUp("Rotate Camera Left"))
	{
		Rotate(States.ROTATE_LEFT);
	}
	if (Input.GetButtonUp("Rotate Camera Right"))
	{
		Rotate(States.ROTATE_RIGHT);
	}

	// Handle the current state of the Camera
	if (state == States.ROTATE_LEFT || state == States.ROTATE_RIGHT)
	{
		var r = rotateSpeed*Time.deltaTime;
		
		if (rotateDistance >= r)
			rotateDistance -= r;
		else
		{
			r = rotateDistance;
			rotateDistance = 0;
		}

		if (state == States.ROTATE_LEFT)
			rotation += r;
		else
			rotation -= r;

		if (rotateDistance == 0)
			state = States.DEFAULT;
	}
}

function Rotate(rotateState : States)
{
	if (state == States.DEFAULT)
		rotateDistance = 90;
	else if (state == rotateState)
		{ /*nothing*/ }
	else
		rotateDistance = 90 - rotateDistance;

	state = rotateState;
}