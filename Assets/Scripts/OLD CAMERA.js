// Where we want to be
var cameraTransform : Transform;
// Where we are
var realCameraTransform : Transform;

// Where we want to be looking
private var focus : Vector3;
// Where we are looking
private var realFocus : Vector3;


// Camera's target
private var _target : Transform;



// The distance in the x-z plane to the target

private var distance = 4.0;
var maxDistance = 7.0;
var minDistance = 3.0;

var rotateSpeed = 0.2;
private var idleTime = 0.0;

// the height we want the camera to be above the target
var height = 3.0;

var angularSmoothLag = 0.3;
var angularMaxSpeed = 15.0;

var heightSmoothLag = 0.3;

var snapSmoothLag = 0.2;
var snapMaxSpeed = 720.0;

var clampHeadPositionScreenSpace = 0.75;

var lockCameraTimeout = 0.2;
var leadTime = 0.7;

private var headOffset = Vector3.zero;
private var centerOffset = Vector3.zero;
private var lead = Vector3.zero;

private var heightVelocity = 0.0;
private var angleVelocity = 0.0;
private var snap = false;
private var controller : ThirdPersonController;
private var targetHeight = 100000.0;

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
		centerOffset = characterController.bounds.center - _target.position;
		headOffset = centerOffset;
		headOffset.y = characterController.bounds.max.y - _target.position.y;
	}
	else
	Debug.Log("Please assign a target to the camera that has a ThirdPersonController script attached.");
	
	
	// Set the height of the camera
	//cameraTransform.position = _target.position;
	//cameraTransform.position.y += height;
	//cameraTransform.position.z -= maxDistance;
	realFocus = _target.position;
	
	//playerScript = GameObject.Find("Player").GetComponent(ThirdPersonController);
	Cut(_target, centerOffset);
}

function DebugDrawStuff ()
{
	Debug.DrawLine(_target.position, _target.position + headOffset);
	
}

function AngleDistance (a : float, b : float)
{
	a = Mathf.Repeat(a, 360);
	b = Mathf.Repeat(b, 360);
	
	return Mathf.Abs(b - a);
}

function Apply ()
{
	// Early out if we don't have a target
	if (!controller)
	return;
	
	var targetCenter = _target.position + centerOffset;
	var targetHead = _target.position + headOffset;
	
	var followSpeed = 1.0f;
	
	var leadDistance = 10.0f;
	var leadTime = 1.9f;
	
	
	// Follow the character
	//======================
	
	// X/Z value
	var ray : Vector3 = _target.position - cameraTransform.position;
	var moveVector : Vector3 = ray;
	if (ray.magnitude > maxDistance) {
		var space : Transform = cameraTransform;
		space.eulerAngles.x = 0;
		cameraTransform.Translate(0, 0, ray.magnitude - maxDistance, space);
	}
	else if (ray.magnitude < minDistance) {
		space = cameraTransform;
		space.eulerAngles.x = 0;
		cameraTransform.Translate(0, 0, -controller.walkSpeed/90.0f, space);
	}
	
	// Y value
	// When jumping don't move camera upwards but only down!
	var targetHeight = targetCenter.y + height;
	if (controller.IsJumping())
	{
		// We'd be moving the camera upwards, do that only if it's really high
		//if (targetHeight < cameraTransform.position.y || targetHeight - cameraTransform.position.y > 5)
		//	targetHeight = targetCenter.y + height;
	}
	else
	{
		cameraTransform.position.y = targetHeight;
	}
	
	// Look slightly ahead of the target
	//===================================
	
	// TODO: vertical leading
	
	lead = controller.GetDirection() * leadDistance * (controller.GetSpeed()/controller.walkSpeed);
	//lead = Vector3.Project(lead, cameraTransform.right);
	
	focus = _target.position;
	if (controller.IsJumping()) focus.y = controller.GetCameraFocusHeight();
	focus += lead;
	realFocus = Vector3.Slerp(realFocus, focus, Time.deltaTime * leadTime);
	
	cameraTransform.LookAt(realFocus);
	//SetUpRotation(focus, targetHead);
	
	
	
	return;
	
	
	
	// TODO: look at someone when I'm talking to them
	// might need the overhaul from line 214
	
	
	// Damp the height
	var currentHeight = cameraTransform.position.y;
	currentHeight = Mathf.SmoothDamp (currentHeight, targetHeight, heightVelocity, heightSmoothLag);
	
	
	//if (playerScript.IsTalking())
	//{
	//	moveCam = true;
	//	cameraMoveRay *= Mathf.Lerp(distance, talkZoomDistance, Time.deltaTime * talkZoomSpeed);
	//}
	
	// Rotate to side of talking
	if (controller.IsTalking())
	{
		// TODO: overhaul this whole damn camera system before it gets too ugly
		// we need it to know where it is
		// and smoothly move where it needs to be
		// and smoothly rotate where it needs to look
	}
	
	// Rotate to align if idle
	/*
	else 
	{
		idleTime += Time.deltaTime;
		if (angle <= rotateSpeed)
		{
			cameraTransform.transform.RotateAround(targetCenter, Vector3.up, side * angle);
		}
		else if (idleTime > 3)
		{
			cameraTransform.transform.RotateAround(targetCenter, Vector3.up, side * rotateSpeed);
			if (controller.GetLockCameraTimer () < lockCameraTimeout)
			{
				idleTime = 0.0;
			}
		}
	}*/
}

function LateUpdate () {
	Apply ();
}

function Cut (dummyTarget : Transform, dummyCenter : Vector3)
{
	var oldHeightSmooth = heightSmoothLag;
	var oldSnapMaxSpeed = snapMaxSpeed;
	var oldSnapSmooth = snapSmoothLag;
	
	snapMaxSpeed = 10000;
	snapSmoothLag = 0.001;
	heightSmoothLag = 0.001;
	
	snap = true;
	Apply ();
	
	heightSmoothLag = oldHeightSmooth;
	snapMaxSpeed = oldSnapMaxSpeed;
	snapSmoothLag = oldSnapSmooth;
}

function SetUpRotation (centerPos : Vector3, headPos : Vector3)
{
	// Now it's getting hairy. The devil is in the details here, the big issue is jumping of course.
	// * When jumping up and down we don't want to center the guy in screen space.
	//  This is important to give a feel for how high you jump and avoiding large camera movements.
	//
	// * At the same time we dont want him to ever go out of screen and we want all rotations to be totally smooth.
	//
	// So here is what we will do:
	//
	// 1. We first find the rotation around the y axis. Thus he is always centered on the y-axis
	// 2. When grounded we make him be centered
	// 3. When jumping we keep the camera rotation but rotate the camera to get him back into view if his head is above some threshold
	// 4. When landing we smoothly interpolate towards centering him on screen
	var cameraPos = cameraTransform.position;
	var offsetToCenter = centerPos - cameraPos;
	
	// Generate base rotation only around y-axis
	var yRotation = Quaternion.LookRotation(Vector3(offsetToCenter.x, 0, offsetToCenter.z));
	
	var relativeOffset = Vector3.forward * distance + Vector3.down * height;
	cameraTransform.rotation = yRotation * Quaternion.LookRotation(relativeOffset);
	
	// Calculate the projected center position and top position in world space
	var centerRay = cameraTransform.camera.ViewportPointToRay(Vector3(.5, 0.5, 1));
	var topRay = cameraTransform.camera.ViewportPointToRay(Vector3(.5, clampHeadPositionScreenSpace, 1));
	
	var centerRayPos = centerRay.GetPoint(distance);
	var topRayPos = topRay.GetPoint(distance);
	
	var centerToTopAngle = Vector3.Angle(centerRay.direction, topRay.direction);
	
	var heightToAngle = centerToTopAngle / (centerRayPos.y - topRayPos.y);
	
	var extraLookAngle = heightToAngle * (centerRayPos.y - centerPos.y);
	if (extraLookAngle < centerToTopAngle)
	{
		extraLookAngle = 0;
	}
	else
	{
		extraLookAngle = extraLookAngle - centerToTopAngle;
		cameraTransform.rotation *= Quaternion.Euler(-extraLookAngle, 0, 0);
	}
}

function GetCenterOffset ()
{
	return centerOffset;
}